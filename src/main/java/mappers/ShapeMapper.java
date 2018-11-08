package main.java.mappers;

import main.java.dtos.PageDto;
import main.java.dtos.ShapeDto;
import main.java.models.*;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class ShapeMapper {

    //if a shape was created from a template, then we pull the shape text, type, artifact,
    //annotations, tags from the shape template as well and the remainder of the
    //attributes come from the shape itself
    public static ShapeDto mapModelToDto(Shape shape, ShapeTemplate shapeTemplate) {

        ShapeDto shapeDto = new ShapeDto();
        shapeDto.setId(shape.getId());
        shapeDto.setCenterX(shape.getCenterX());
        shapeDto.setCenterY(shape.getCenterY());
        shapeDto.setDrillDownPageId(shape.getDrillDownPageId());
        shapeDto.setHeight(shape.getHeight());
        shapeDto.setRadius(shape.getRadius());

        shapeDto.setSequenceNumber(shape.getSequenceNumber());
        shapeDto.setShapeText(shape.getShapeText());
        shapeDto.setShapeType(shape.getShapeType());

        for (Tag tag : shape.getTags()) {
            shapeDto.getTagDtos().add(TagMapper.mapModelToDto(tag,false));
        }

        for (Annotation annotation : shape.getAnnotations())
        {
            shapeDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation,false));
        }

        shapeDto.setWidth(shape.getWidth());
        shapeDto.setTemplateId(shape.getTemplateId());

        //if the shape came from a template - overlay with template fields
        if (shapeTemplate != null) {
            shapeDto.setShapeText(shapeTemplate.getShapeText());
            shapeDto.setShapeType(shapeTemplate.getShapeType());

            if (shapeTemplate.getArtifact() != null) {
                shapeDto.setReferenceArtifactDto(ArtifactMapper.mapModelToDto(shapeTemplate.getArtifact(), null));
            }

            for (Tag tag : shapeTemplate.getTags()) {
                shapeDto.getTagDtos().add(TagMapper.mapModelToDto(tag, true));
            }

            for (Annotation annotation : shapeTemplate.getAnnotations()) {
                shapeDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation, true));
            }
        }

        return shapeDto;
    }
}
