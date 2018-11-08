package main.java.managers;



import main.java.common.Constants;
import main.java.controllers.LibraryViews;
import main.java.dtos.ErrorDto;
import main.java.models.Artifact;
import main.java.models.Diagram;
import main.java.models.LibraryLevel;
import main.java.repositories.ArtifactRepository;
import main.java.repositories.DiagramRepository;
import main.java.repositories.LibraryLevelRepository;
import org.apache.log4j.Logger;
import org.apache.tomcat.jni.Library;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 11/24/2017.
 */
@Repository("libraryManager")
public class LibraryManager {

    Logger logger = Logger.getLogger(LibraryManager.class);

    private final LibraryLevelRepository libraryLevelRepository;
    private final ArtifactRepository artifactRepository;
    private final DiagramRepository diagramRepository;

    public LibraryManager(LibraryLevelRepository repository,
                          ArtifactRepository artifactRepository,
                          DiagramRepository diagramRepository)
    {
        this.libraryLevelRepository = repository;
        this.artifactRepository = artifactRepository;
        this.diagramRepository = diagramRepository;
    }

    public List<ErrorDto> validateAndSaveLibraryLevel(LibraryLevel libraryLevel)
    {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        //need validation logic

        //if the library entry was updated with a change in level, we need
        //to update it. get the parent library id to determine the parent
        if (libraryLevel.getParentLibraryId() == "-1")
        {
            libraryLevel.setLevel(0);
        }
        LibraryLevel parentLibraryEntry = this.getByLibraryId(libraryLevel.getParentLibraryId());
        libraryLevel.setLevel(parentLibraryEntry.getLevel() + 1);

        this.libraryLevelRepository.save(libraryLevel);

        return errors;

    }

    @Transactional
    public List<ErrorDto> validateAndDeleteLibraryLevel(String libraryId)
    {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        //need any validation logic

        LibraryLevel libraryLevelToDelete = this.libraryLevelRepository.findById(libraryId);
        if (libraryLevelToDelete == null)
        {
            errors.add(new ErrorDto("Could not delete librarylevel with id: " + libraryId + ". Id not valid"));
        }
        else
        {
            //get all the immediate children
            List<LibraryLevel> subLibraries = this.getLibraryList(libraryId);
            logger.info( "subLibraries" + subLibraries);

            for (LibraryLevel subLibrary : subLibraries) {

                //if the sub library has children - then lets delete them too
                if (subLibrary.getSubLibraryCount() > 0) {

                    //get all the sub children so we can re-assign all associated
                    //docs (artifacts/diagrams) to the 'unassigned library'
                    List<LibraryLevel> subSubLibraries = this.getLibraryList(subLibrary.getId());
                    for (LibraryLevel subSubLibrary : subSubLibraries) {
                        this.unAssignAssociatedDocuments(subSubLibrary.getId());
                    }

                    this.libraryLevelRepository.deleteByParentLibraryId(subLibrary.getId());
                }
                //reassign the documents to the 'unassigned library'
                this.unAssignAssociatedDocuments(subLibrary.getId());
            }

            this.libraryLevelRepository.deleteByParentLibraryId(libraryId);

            //save the current library to 'flush' the object
            this.libraryLevelRepository.save(libraryLevelToDelete);

            //reassign the documents to the 'unassigned library'
            this.unAssignAssociatedDocuments(libraryId);

            this.libraryLevelRepository.delete(libraryId);
        }

        return errors;
    }

    private void unAssignAssociatedDocuments(String libraryId) {

        //re-assign all the artifacts of the sub-children to the unassigned library
        int cnt = this.artifactRepository.updateLibraryId(libraryId,
                Constants.UNASSIGNED_LIBRARY);

        //re-assign all diagrams to the unassigned library
        cnt = this.diagramRepository.updateLibraryId(libraryId,
                Constants.UNASSIGNED_LIBRARY);

    }

    public LibraryLevel getByLibraryId(String id)
    {
        return this.libraryLevelRepository.findById(id);
    }

    //returns a text version of the library ancestry in the form:
    //library / library / library - the parent library structure where the
    //incoming libraryId is the lowest value
    public String getLibraryAncestryText(String libraryId)
    {
        List<LibraryLevel> ancestry = this.getLibraryAncestry(libraryId);

        String libraryText = ancestry.get(0).getDescription();
        if (ancestry.size() > 1)
        {
            libraryText = ancestry.get(1).getDescription() + "/" + libraryText;
        }
        if (ancestry.size() > 2)
        {
            libraryText = ancestry.get(2).getDescription() + "/" + libraryText;
        }

        return libraryText;
    }

    //get the libraryLevel info for the incoming library id, and its
    //parent, and its parent (if applicable). The first list entry
    //will be the requested library, while the 2nd and 3rd entries, if populated
    //will be the parent and grandparent
    public List<LibraryLevel> getLibraryAncestry(String libraryId)
    {
        List<LibraryLevel> ancestry = new ArrayList<LibraryLevel>();
        LibraryLevel lib1 = this.getByLibraryId(libraryId);
        if (lib1 != null)
        {
            ancestry.add(lib1);
            if (lib1.getParentLibraryId() != null)
            {
                LibraryLevel lib2 = this.getByLibraryId(lib1.getParentLibraryId());
                if (lib2 != null)
                {
                    ancestry.add(lib2);

                    if (lib2.getParentLibraryId() != null)
                    {
                        LibraryLevel lib3 = this.getByLibraryId(lib2.getParentLibraryId());
                        if (lib3 != null)
                        {
                            ancestry.add(lib3);
                        }
                    }
                }
            }
        }

        return ancestry;
    }

    //get all library entries that are children of the incoming parent id
    // along with the count of sub-library entries, artifacts, and diagrams
    public List<LibraryLevel> getLibraryList(String parentLibraryId)
    {
        List<LibraryLevel> libraryList =
            this.libraryLevelRepository.findByParentLibraryId(parentLibraryId);

        for (LibraryLevel libraryEntry : libraryList)
        {
            List<LibraryLevel> subList =
                    this.libraryLevelRepository.findByParentLibraryId(libraryEntry.getId());

            libraryEntry.setSubLibraryCount(subList.size());

            List<Diagram> diagramList = this.diagramRepository.findByLibraryLevel(libraryEntry);
            libraryEntry.setDiagramCount(diagramList.size());

            List<Artifact> artifactList = this.artifactRepository.findByLibraryLevel(libraryEntry);
            libraryEntry.setArtifactCount(artifactList.size());
        }

        return libraryList;
    }

}
