package main.java.mappers;

import main.java.dtos.ArtifactDto;
import main.java.dtos.PageDto;
import main.java.dtos.TagDto;
import main.java.models.Artifact;
import main.java.models.Diagram;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 1/11/2018.
 */
public class DiagramMapper {

    public static PageDto mapModelToDto(Diagram diagram)
    {
        PageDto pageDto = new PageDto();

        pageDto.setId(diagram.getId());
        pageDto.setPageTitle(diagram.getPageTitle());
        pageDto.setPageDescription(diagram.getPageDescription());
        pageDto.setLibraryId(diagram.getLibraryLevel().getId());
        pageDto.setArtifactDto(ArtifactMapper.mapModelToDto(diagram.getArtifact()));

        for (Tag tag : diagram.getTags())
        {
            pageDto.getTags().add(TagMapper.mapModelToDto(tag));
        }

        return pageDto;
    }
}
