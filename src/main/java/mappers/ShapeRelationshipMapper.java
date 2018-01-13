package main.java.mappers;

import main.java.dtos.ShapeDto;
import main.java.dtos.ShapeRelationshipDto;
import main.java.models.Annotation;
import main.java.models.Shape;
import main.java.models.ShapeRelationship;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class ShapeRelationshipMapper {

    public static ShapeRelationshipDto mapModelToDto(ShapeRelationship shapeRelationship) {

        ShapeRelationshipDto shapeRelationshipDto = new ShapeRelationshipDto();

        shapeRelationshipDto.setId(shapeRelationship.getId());
        shapeRelationshipDto.setShapeText(shapeRelationship.getShapeText());

        shapeRelationshipDto.setEndXLocation(shapeRelationship.getEndXLocation());
        shapeRelationshipDto.setEndYLocation(shapeRelationship.getEndYLocation());
        shapeRelationshipDto.setFromShapeId(shapeRelationship.getFromShapeId());
        shapeRelationshipDto.setLovRelationshipType(LovMapper.mapModelToDto(shapeRelationship.getLovRelationshipType()));
        shapeRelationshipDto.setRelationshipGraphicId(shapeRelationship.getRelationshipGraphicId());
        shapeRelationshipDto.setStartXLocation(shapeRelationship.getStartXLocation());
        shapeRelationshipDto.setStartYLocation(shapeRelationship.getStartYLocation());
        shapeRelationshipDto.setToShapeId(shapeRelationship.getToShapeId());

        for (Annotation annotation : shapeRelationship.getAnnotations())
        {
            shapeRelationshipDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation));
        }

        for (Tag tag : shapeRelationship.getTags())
        {
            shapeRelationshipDto.getTagDtos().add(TagMapper.mapModelToDto(tag));
        }

        return shapeRelationshipDto;
    }
}
