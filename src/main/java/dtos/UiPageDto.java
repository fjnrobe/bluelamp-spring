package main.java.dtos;

import main.java.models.Artifact;
import main.java.models.Shape;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class UiPageDto {

    private PageDto pageDto;
    private List<ShapeDto> shapeDtos = new ArrayList<ShapeDto>();
    private List<ShapeRelationshipDto> shapeRelationshipDtos = new ArrayList<ShapeRelationshipDto>();
    private List<PageDto> predecessorPageDtos = new ArrayList<PageDto>();

    public PageDto getPageDto() {
        return pageDto;
    }

    public void setPageDto(PageDto pageDto) {
        this.pageDto = pageDto;
    }

    public List<ShapeDto> getShapeDtos() {
        return shapeDtos;
    }

    public void setShapeDtos(List<ShapeDto> shapeDtos) {
        this.shapeDtos = shapeDtos;
    }

    public List<ShapeRelationshipDto> getShapeRelationshipDtos() {
        return shapeRelationshipDtos;
    }

    public void setShapeRelationshipDtos(List<ShapeRelationshipDto> shapeRelationshipDtos) {
        this.shapeRelationshipDtos = shapeRelationshipDtos;
    }

    public List<PageDto> getPredecessorPageDtos() {
        return predecessorPageDtos;
    }

    public void setPredecessorPageDtos(List<PageDto> predecessorPageDtos) {
        this.predecessorPageDtos = predecessorPageDtos;
    }
}
