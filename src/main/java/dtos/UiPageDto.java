package main.java.dtos;

import main.java.models.Artifact;

import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class UiPageDto {

    private PageDto pageDto;
    private List<ShapeDto> shapeDtos;
    private List<ShapeRelationshipDto> shapeRelationshipDtos;
    private List<PageDto> predecessorPages;

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

    public List<PageDto> getPredecessorPages() {
        return predecessorPages;
    }

    public void setPredecessorPages(List<PageDto> predecessorPages) {
        this.predecessorPages = predecessorPages;
    }
}
