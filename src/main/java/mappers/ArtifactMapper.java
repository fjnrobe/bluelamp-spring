package main.java.mappers;

import main.java.dtos.ArtifactDto;
import main.java.dtos.TagDto;
import main.java.models.Artifact;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 12/18/2017.
 */
public class ArtifactMapper {

    public static ArtifactDto mapModelToDto(Artifact artifact)
    {
        ArtifactDto artifactDto = new ArtifactDto();
        artifactDto.setId(artifact.getId());
        artifactDto.setDocumentTitle(artifact.getDocumentTitle());
        artifactDto.setDetailedText(artifact.getDetailedText());
        artifactDto.setAbbreviation(artifact.getAbbreviation());
        artifactDto.setDocumentType(artifact.getLovDocumentType());
        artifactDto.setLibraryId(artifact.getLibraryLevel().getId());

        for (Tag tag : artifact.getTags())
        {
            artifactDto.getTags().add(TagMapper.mapModelToDto(tag));
        }

        return artifactDto;
    }
}
