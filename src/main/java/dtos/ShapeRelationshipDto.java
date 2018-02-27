package main.java.dtos;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class ShapeRelationshipDto {

    private String id;
    private String fromShapeId;
    private String toShapeId;
    private String relationshipType;
    private int startXLocation;
    private int startYLocation;
    private int endXLocation;
    private int endYLocation;
    private String relationshipGraphicId;
    private String shapeText;
    private List<TagDto> tagDtos = new ArrayList<TagDto>();
    private List<AnnotationDto> annotationDtos = new ArrayList<AnnotationDto>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFromShapeId() {
        return fromShapeId;
    }

    public void setFromShapeId(String fromShapeId) {
        this.fromShapeId = fromShapeId;
    }

    public String getToShapeId() {
        return toShapeId;
    }

    public void setToShapeId(String toShapeId) {
        this.toShapeId = toShapeId;
    }

    public int getStartXLocation() {
        return startXLocation;
    }

    public void setStartXLocation(int startXLocation) {
        this.startXLocation = startXLocation;
    }

    public int getStartYLocation() {
        return startYLocation;
    }

    public void setStartYLocation(int startYLocation) {
        this.startYLocation = startYLocation;
    }

    public int getEndXLocation() {
        return endXLocation;
    }

    public void setEndXLocation(int endXLocation) {
        this.endXLocation = endXLocation;
    }

    public int getEndYLocation() {
        return endYLocation;
    }

    public void setEndYLocation(int endYLocation) {
        this.endYLocation = endYLocation;
    }

    public String getRelationshipGraphicId() {
        return relationshipGraphicId;
    }

    public void setRelationshipGraphicId(String relationshipGraphicId) {
        this.relationshipGraphicId = relationshipGraphicId;
    }

    public String getShapeText() {
        return shapeText;
    }

    public void setShapeText(String shapeText) {
        this.shapeText = shapeText;
    }

    public List<TagDto> getTagDtos() {
        return tagDtos;
    }

    public void setTagDtos(List<TagDto> tagDtos) {
        this.tagDtos = tagDtos;
    }

    public List<AnnotationDto> getAnnotationDtos() {
        return annotationDtos;
    }

    public void setAnnotationDtos(List<AnnotationDto> annotationDtos) {
        this.annotationDtos = annotationDtos;
    }

    public String getRelationshipType() {
        return relationshipType;
    }

    public void setRelationshipType(String relationshipType) {
        this.relationshipType = relationshipType;
    }
}
