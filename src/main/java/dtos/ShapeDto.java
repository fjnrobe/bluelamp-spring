package main.java.dtos;

import main.java.models.Annotation;
import main.java.models.Artifact;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class ShapeDto {

    private String id;
    private String sequenceNumber;
    private ArtifactDto referenceArtifactDto;
    private String shapeType;
    private int radius;
    private int width;
    private int height;
    private int centerX;
    private int centerY;
    private String shapeText;
    private String drillDownPageId;
    private List<TagDto> tagDtos = new ArrayList<TagDto>();
    private List<AnnotationDto> annotationDtos = new ArrayList<AnnotationDto>();
    private String templateId; //if the shape was created via
                               //template, this will be the id


    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(String sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public ArtifactDto getReferenceArtifactDto() {
        return referenceArtifactDto;
    }

    public void setReferenceArtifactDto(ArtifactDto referenceArtifactDto) {
        this.referenceArtifactDto = referenceArtifactDto;
    }

    public String getShapeType() {
        return shapeType;
    }

    public void setShapeType(String shapeType) {
        this.shapeType = shapeType;
    }

    public int getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getCenterX() {
        return centerX;
    }

    public void setCenterX(int centerX) {
        this.centerX = centerX;
    }

    public int getCenterY() {
        return centerY;
    }

    public void setCenterY(int centerY) {
        this.centerY = centerY;
    }

    public String getShapeText() {
        return shapeText;
    }

    public void setShapeText(String shapeText) {
        this.shapeText = shapeText;
    }

    public String getDrillDownPageId() {
        return drillDownPageId;
    }

    public void setDrillDownPageId(String drillDownPageId) {
        this.drillDownPageId = drillDownPageId;
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
}
