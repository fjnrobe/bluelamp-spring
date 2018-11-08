package main.java.mappers;

import main.java.dtos.AnnotationDto;
import main.java.dtos.ArtifactDto;
import main.java.models.Annotation;
import main.java.models.Artifact;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class AnnotationMapper {

    public static AnnotationDto mapModelToDto(Annotation annotation, boolean sharedInd)
    {
        AnnotationDto annoAnnotationDto = new AnnotationDto();
        annoAnnotationDto.setId(annotation.getId());
        annoAnnotationDto.setAnnotationText(annotation.getAnnotationText());
        annoAnnotationDto.setSharedInd(sharedInd);

        return annoAnnotationDto;
    }
}
