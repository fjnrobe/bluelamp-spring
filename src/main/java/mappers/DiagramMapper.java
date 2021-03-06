package main.java.mappers;

import main.java.dtos.ArtifactDto;
import main.java.dtos.PageDto;
import main.java.dtos.TagDto;
import main.java.models.Annotation;
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
        if (diagram.getArtifact() != null) {
            pageDto.setArtifactId(diagram.getArtifact().getId());
        }

        for (Tag tag : diagram.getTags())
        {
            pageDto.getTagDtos().add(TagMapper.mapModelToDto(tag,false));
        }

        for (Annotation annotation : diagram.getAnnotations())
        {
            pageDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation,false));
        }

        return pageDto;
    }
}
