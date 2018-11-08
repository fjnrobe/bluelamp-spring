package main.java.dtos;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 10/28/2018.
 */
public class ShapeTemplateDto {

    private String id;
    private String templateName;
    private ArtifactDto referenceArtifactDto;
    private String shapeType;
    private String shapeText;
    private String drillDownPageId;
    private List<TagDto> tagDtos = new ArrayList<TagDto>();
    private List<AnnotationDto> annotationDtos = new ArrayList<AnnotationDto>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }
}
