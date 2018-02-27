package main.java.mappers;

import main.java.dtos.ShapeRelationshipDto;
import main.java.models.Annotation;
import main.java.models.Relationship;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class ShapeRelationshipMapper {

    public static ShapeRelationshipDto mapModelToDto(Relationship relationship) {

        ShapeRelationshipDto shapeRelationshipDto = new ShapeRelationshipDto();

        shapeRelationshipDto.setId(relationship.getId());
        shapeRelationshipDto.setShapeText(relationship.getShapeText());

        shapeRelationshipDto.setEndXLocation(relationship.getEndXLocation());
        shapeRelationshipDto.setEndYLocation(relationship.getEndYLocation());
        shapeRelationshipDto.setFromShapeId(relationship.getFromShapeId());
        shapeRelationshipDto.setRelationshipType(relationship.getRelationshipType());
        shapeRelationshipDto.setRelationshipGraphicId(relationship.getRelationshipGraphicId());
        shapeRelationshipDto.setStartXLocation(relationship.getStartXLocation());
        shapeRelationshipDto.setStartYLocation(relationship.getStartYLocation());
        shapeRelationshipDto.setToShapeId(relationship.getToShapeId());

        for (Annotation annotation : relationship.getAnnotations())
        {
            shapeRelationshipDto.getAnnotationDtos().add(AnnotationMapper.mapModelToDto(annotation));
        }

        for (Tag tag : relationship.getTags())
        {
            shapeRelationshipDto.getTagDtos().add(TagMapper.mapModelToDto(tag));
        }

        return shapeRelationshipDto;
    }
}
