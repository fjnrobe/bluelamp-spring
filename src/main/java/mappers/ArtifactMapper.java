package main.java.mappers;

import main.java.dtos.ArtifactDto;
import main.java.dtos.TagDto;
import main.java.models.Annotation;
import main.java.models.Artifact;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 12/18/2017.
 */
public class ArtifactMapper {

    public static ArtifactDto mapModelToDto(Artifact artifact, String documentFileName)
    {
        ArtifactDto artifactDto = new ArtifactDto();
        artifactDto.setId(artifact.getId());
        artifactDto.setDocumentTitle(artifact.getDocumentTitle());
        artifactDto.setDetailedText(artifact.getDetailedText());
        artifactDto.setAbbreviation(artifact.getAbbreviation());
        artifactDto.setDocumentType(artifact.getLovDocumentType());
        artifactDto.setLibraryId(artifact.getLibraryLevel().getId());
        artifactDto.setDocumentName(artifact.getDocumentName());
        artifactDto.setDocumentFileName(documentFileName);


        for (Tag tag : artifact.getTags())
        {
            artifactDto.getTagDtos().add(TagMapper.mapModelToDto(tag,false));
        }

        for (Annotation annotation : artifact.getAnnotations())
        {
            artifactDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation,false)) ;
        }

        return artifactDto;
    }
}
