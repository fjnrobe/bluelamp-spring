package main.java.managers;

import main.java.dtos.ArtifactDto;
import main.java.dtos.ErrorDto;
import main.java.dtos.TagDto;
import main.java.mappers.ArtifactMapper;
import main.java.models.Artifact;
import main.java.models.LibraryLevel;
import main.java.models.Lov;
import main.java.models.Tag;
import main.java.repositories.ArtifactRepository;
import main.java.repositories.LibraryLevelRepository;
import main.java.repositories.LovRepository;
import main.java.repositories.TagRepository;
import main.java.utilities.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by Robertson_Laptop on 12/11/2017.
 */
@Repository("artifactManager")
public class ArtifactManager {
    Logger logger = Logger.getLogger(ArtifactManager.class);

    private final ArtifactRepository artifactRepository;
    private final LibraryLevelRepository libraryLevelRepository;
    private final LovRepository lovRepository;
    private final TagRepository tagRepository;

    public ArtifactManager(ArtifactRepository repository,
                           LibraryLevelRepository libraryRepository,
                           LovRepository lovRepository,
                           TagRepository tagRepository)
    {
        this.artifactRepository = repository;
        this.libraryLevelRepository = libraryRepository;
        this.lovRepository = lovRepository;
        this.tagRepository = tagRepository;
    }

    public List<ArtifactDto> getArtifactsByLibraryId(String libraryId)
    {
        LibraryLevel libraryLevel = this.libraryLevelRepository.findById(libraryId);

        List<ArtifactDto> artifactDtos = new ArrayList<ArtifactDto>();

        List<Artifact> artifacts = this.artifactRepository.findByLibraryLevel(libraryLevel);
        for (Artifact artifact : artifacts)
        {
            artifactDtos.add(ArtifactMapper.mapModelToDto(artifact));
        }

        return artifactDtos;
    }

    public ArtifactDto getArtifactById(String artifactId)
    {
        Artifact artifact = this.artifactRepository.findById(artifactId);

        return ArtifactMapper.mapModelToDto(artifact);
    }

    public List<ErrorDto> validateAndSaveArtifact(ArtifactDto artifactDto) {

        List<ErrorDto> errors = this.validateArtifact(artifactDto);

        if (errors.size() == 0) {
            this.saveArtifact(artifactDto);
        }

        return errors;
    }

    //validate the contents of the artifact
    //1) all required fields are present
    private List<ErrorDto> validateArtifact(ArtifactDto artifactDto) {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        if (StringUtils.isEmpty(artifactDto.getId())) {
            errors.add(new ErrorDto("artifact id is missing"));
        }
        if (StringUtils.isEmpty(artifactDto.getAbbreviation())) {
            errors.add(new ErrorDto("the artifact abbreviation is required"));
        }
        if (StringUtils.isEmpty(artifactDto.getDetailedText()))
        {
            errors.add(new ErrorDto("the artifact text is required"));
        }
        if (StringUtils.isEmpty(artifactDto.getDocumentTitle()))
        {
            errors.add(new ErrorDto("the artifact title is required"));
        }
        if (artifactDto.getDocumentType() == null)
        {
            errors.add(new ErrorDto("the artifact document type is required"));
        }
        if (StringUtils.isEmpty(artifactDto.getLibraryId()))
        {
            errors.add(new ErrorDto("the artifact library/category is required"));
        }

        return errors;
    }

    //map the incoming dto to the artifact model and then persist
    private void saveArtifact(ArtifactDto artifactDto)
    {
        //start off by removing the existing entry (if present)
        Artifact artifact = this.artifactRepository.findById(artifactDto.getId());
        if (artifact != null) {
            this.artifactRepository.delete(artifact);
        }

        artifact = new Artifact();

        artifact.setAbbreviation(artifactDto.getAbbreviation());
        artifact.setDetailedText(artifactDto.getDetailedText());
        artifact.setDocumentTitle(artifactDto.getDocumentTitle());
        artifact.setId(artifactDto.getId());

        artifact.setLovDocumentType(artifactDto.getDocumentType());

        LibraryLevel libraryEntry = this.libraryLevelRepository.findById(artifactDto.getLibraryId());

        if (libraryEntry != null)
        {
            artifact.setLibraryLevel(libraryEntry);
        }

        //add all the incoming tags
        for (TagDto tagDto : artifactDto.getTags())
        {
            Lov tagLov = this.lovRepository.findById(tagDto.getLov().getId());

            Tag tag = new Tag();
            tag.setId(tagDto.getId());
            tag.setTagValue(tagDto.getTagValue());
            tag.setArtifact(artifact);
            tag.setLovTagType(tagLov);

            //note - if the tag already exists, it won't be added again
            artifact.addTag(tag);
        }

        this.artifactRepository.save(artifact);

    }

}
