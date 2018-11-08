package main.java.managers;

import main.java.dtos.AnnotationDto;
import main.java.dtos.ArtifactDto;
import main.java.dtos.ErrorDto;
import main.java.dtos.TagDto;
import main.java.mappers.ArtifactMapper;
import main.java.models.*;
import main.java.repositories.*;
import main.java.utilities.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


/**
 * Created by Robertson_Laptop on 12/11/2017.
 */
@Repository("artifactManager")
public class ArtifactManager {
    Logger logger = Logger.getLogger(ArtifactManager.class);

    @Autowired
    DocumentManager documentManager;

    @Autowired
    LibraryManager libraryManager;

    private final ArtifactRepository artifactRepository;
    private final LibraryLevelRepository libraryLevelRepository;
    private final LovRepository lovRepository;
    private final TagRepository tagRepository;
    private final DiagramRepository diagramRepository;
    private final ShapeRepository shapeRepository;
    private final AnnotationRepository annotationRepository;
    private final ShapeTemplateRepository shapeTemplateRepository;

    public ArtifactManager(ArtifactRepository repository,
                           LibraryLevelRepository libraryRepository,
                           LovRepository lovRepository,
                           TagRepository tagRepository,
                           DiagramRepository diagramRepository,
                           ShapeRepository shapeRepository,
                           AnnotationRepository annotationRepository,
                           ShapeTemplateRepository shapeTemplateRepository) {
        this.artifactRepository = repository;
        this.libraryLevelRepository = libraryRepository;
        this.lovRepository = lovRepository;
        this.tagRepository = tagRepository;
        this.diagramRepository = diagramRepository;
        this.shapeRepository = shapeRepository;
        this.annotationRepository = annotationRepository;
        this.shapeTemplateRepository = shapeTemplateRepository;
    }

    public List<ArtifactDto> getArtifactsByLibraryId(String libraryId) {
        LibraryLevel libraryLevel = this.libraryLevelRepository.findById(libraryId);

        List<ArtifactDto> artifactDtos = new ArrayList<ArtifactDto>();

        List<Artifact> artifacts = this.artifactRepository.findByLibraryLevel(libraryLevel);
        for (Artifact artifact : artifacts) {
            ArtifactDto newArtifactDto = ArtifactMapper.mapModelToDto(artifact, null);
            newArtifactDto.setLibraryAncestry(
                    this.libraryManager.getLibraryAncestryText( artifact.getLibraryLevel().getId()));

            artifactDtos.add(newArtifactDto);
        }

        return artifactDtos;
    }

    public List<ArtifactDto> getArtifactsBySearch(String searchText) {
        List<ArtifactDto> artifactDtos = new ArrayList<ArtifactDto>();

        searchText = searchText.replace(" ", "&");
        List<Artifact> artifacts = this.artifactRepository.findBySearchText(searchText);
        for (Artifact artifact : artifacts) {
            ArtifactDto newArtifactDto = ArtifactMapper.mapModelToDto(artifact, null);
            newArtifactDto.setLibraryAncestry(
                    this.libraryManager.getLibraryAncestryText( artifact.getLibraryLevel().getId()));

            artifactDtos.add(newArtifactDto);
        }

        return artifactDtos;
    }

    public ArtifactDto getArtifactById(String artifactId) {
        Artifact artifact = this.artifactRepository.findById(artifactId);
        String fileName = null;
        if (!StringUtils.isEmpty(artifact.getDocumentName())) {
            fileName = this.documentManager.getDocumentFileName(artifact.getId());
        }
        return ArtifactMapper.mapModelToDto(artifact, fileName);

    }

    public List<ErrorDto> validateAndSaveArtifact(ArtifactDto artifactDto) {

        List<ErrorDto> errors = this.validateArtifactForSave(artifactDto);

        if (errors.size() == 0) {
            this.saveArtifact(artifactDto);

            //persist the attached artifact document (word, excel, etc) if there
            //is content. else, purge the content (user chose to remove document)
            if (!StringUtils.isEmpty(artifactDto.getDocumentName())) {
                if (!StringUtils.isEmpty(artifactDto.getDocumentContent())) {
                    this.documentManager.persistDocument(artifactDto);
                }

            } else {
                this.documentManager.deleteDocument(artifactDto.getId());
            }
        }


        return errors;
    }

    //validate the contents of the artifact
    //1) all required fields are present
    private List<ErrorDto> validateArtifactForSave(ArtifactDto artifactDto) {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        if (StringUtils.isEmpty(artifactDto.getId())) {
            errors.add(new ErrorDto("artifact id is missing"));
        }
        if (StringUtils.isEmpty(artifactDto.getAbbreviation())) {
            errors.add(new ErrorDto("the artifact abbreviation is required"));
        }
        if (StringUtils.isEmpty(artifactDto.getDetailedText())) {
            errors.add(new ErrorDto("the artifact text is required"));
        }
        if (StringUtils.isEmpty(artifactDto.getDocumentTitle())) {
            errors.add(new ErrorDto("the artifact title is required"));
        }
        if (artifactDto.getDocumentType() == null) {
            errors.add(new ErrorDto("the artifact document type is required"));
        }
        if (StringUtils.isEmpty(artifactDto.getLibraryId())) {
            errors.add(new ErrorDto("the artifact library/category is required"));
        }

        return errors;
    }

    //map the incoming dto to the artifact model and then persist
    private void saveArtifact(ArtifactDto artifactDto) {
        //start off by removing the existing entry (if present)
        Artifact artifact = this.artifactRepository.findById(artifactDto.getId());
        if (artifact == null) {
            artifact = new Artifact();
        }

        artifact.setAbbreviation(artifactDto.getAbbreviation());
        artifact.setDetailedText(artifactDto.getDetailedText());
        artifact.setDocumentTitle(artifactDto.getDocumentTitle());
        artifact.setId(artifactDto.getId());
        artifact.setDocumentName(artifactDto.getDocumentName());

        artifact.setLovDocumentType(artifactDto.getDocumentType());

        LibraryLevel libraryEntry = this.libraryLevelRepository.findById(artifactDto.getLibraryId());

        if (libraryEntry != null) {
            artifact.setLibraryLevel(libraryEntry);
        }

        //delete the existing tags/comments
        for (Tag tag : artifact.getTags())
        {
            this.tagRepository.delete(tag.getId());
        }
        for (Annotation annotation : artifact.getAnnotations())
        {
            this.annotationRepository.delete(annotation.getId());
        }

        artifact.getTags().clear();
        artifact.getAnnotations().clear();

        //add all the incoming tags
        for (TagDto tagDto : artifactDto.getTagDtos()) {
            Lov tagLov = this.lovRepository.findById(tagDto.getLovDto().getId());

            Tag tag = new Tag();
            tag.setId(tagDto.getId());
            tag.setTagValue(tagDto.getTagValue());
            tag.setArtifact(artifact);
            tag.setLovTagType(tagLov);

            //note - if the tag already exists, it won't be added again
            artifact.addTag(tag);
        }

        //add all the incoming annotations
        for (AnnotationDto annotationDto : artifactDto.getAnnotationDtos()) {
            Annotation annotation = new Annotation();
            annotation.setId(annotationDto.getId());
            annotation.setAnnotationText(annotationDto.getAnnotationText());

            artifact.addAnnotation(annotation);
        }
        this.artifactRepository.save(artifact);

    }

    //validate and delete a given artifact
    public List<ErrorDto> validateAndDeleteArtifact(String artifactId) {
        List<ErrorDto> errors = this.validateArtifactForDelete(artifactId);

        if (errors.size() == 0) {
            this.deleteArtifact(artifactId);
            this.documentManager.deleteDocument(artifactId);
        }

        return errors;
    }

    private List<ErrorDto> validateArtifactForDelete(String artifactId) {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        //the artifact cannot be referenced by any diagrams or shapes
        List<Diagram> existingDiagrams =
                this.diagramRepository.findByArtifactId(artifactId);
        if ((existingDiagrams != null) && (existingDiagrams.size() > 0)) {
            errors.add(new ErrorDto("This artifact cannot be deleted, it is referenced by 1 or more diagrams"));
        }

        List<Shape> existingShapes =
                this.shapeRepository.findByArtifactId(artifactId);
        if ((existingShapes != null) && (existingShapes.size() > 0)) {
            errors.add(new ErrorDto("This artifact cannot be deleted, it is referenced by 1 or more shapes"));
        }

        List<ShapeTemplate> existingTemplates =
                this.shapeTemplateRepository.findByArtifactId(artifactId);
        if ((existingTemplates != null) && (existingTemplates.size() > 0))
        {
            errors.add(new ErrorDto("This artifact cannot be deleted, it is referenced by 1 or more shape Templates"));
        }

        return errors;
    }

    private void deleteArtifact(String artifactId) {
        Artifact artifact = this.artifactRepository.findById(artifactId);

        if (artifact != null) {
            this.artifactRepository.delete(artifact);
        }
    }

}
