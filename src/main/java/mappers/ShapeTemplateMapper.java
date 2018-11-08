package main.java.mappers;

import main.java.dtos.ShapeTemplateDto;
import main.java.dtos.ShapeTemplateDto;
import main.java.models.Annotation;
import main.java.models.Shape;
import main.java.models.ShapeTemplate;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 10/28/2018.
 */
public class ShapeTemplateMapper {

    public static ShapeTemplateDto mapModelToDto(ShapeTemplate shape) {

        ShapeTemplateDto shapeTemplateDto = new ShapeTemplateDto();
        shapeTemplateDto.setId(shape.getId());
        shapeTemplateDto.setDrillDownPageId(shape.getDrillDownPageId());
        if (shape.getArtifact() != null) {
            shapeTemplateDto.setReferenceArtifactDto(ArtifactMapper.mapModelToDto(shape.getArtifact(),null));
        }
        shapeTemplateDto.setTemplateName(shape.getTemplateName());
        shapeTemplateDto.setShapeText(shape.getShapeText());
        shapeTemplateDto.setShapeType(shape.getShapeType());

        for (Tag tag : shape.getTags()) {
            shapeTemplateDto.getTagDtos().add(TagMapper.mapModelToDto(tag, true));
        }

        for (Annotation annotation : shape.getAnnotations())
        {
            shapeTemplateDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation,true));
        }

        return shapeTemplateDto;
    }
}
