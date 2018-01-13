package main.java.mappers;

import main.java.dtos.PageDto;
import main.java.dtos.ShapeDto;
import main.java.models.Annotation;
import main.java.models.Diagram;
import main.java.models.Shape;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class ShapeMapper {

    public static ShapeDto mapModelToDto(Shape shape) {

        ShapeDto shapeDto = new ShapeDto();
        shapeDto.setId(shape.getId());
        shapeDto.setCenterX(shape.getCenterX());
        shapeDto.setCenterY(shape.getCenterY());
        shapeDto.setDrillDownPageId(shape.getDrillDownPageId());
        shapeDto.setHeight(shape.getHeight());
        shapeDto.setRadius(shape.getRadius());
        shapeDto.setReferenceArtifactDto(ArtifactMapper.mapModelToDto(shape.getArtifact()));
        shapeDto.setSequenceNumber(shape.getSequenceNumber());
        shapeDto.setShapeText(shape.getShapeText());
        shapeDto.setShapeType(shape.getShapeType());

        for (Tag tag : shape.getTags()) {
            shapeDto.getTagDtos().add(TagMapper.mapModelToDto(tag));
        }

        for (Annotation annotation : shape.getAnnotations())
        {
            shapeDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation));
        }

        shapeDto.setWidth(shape.getWidth());

        return shapeDto;
    }
}
