package main.java.managers;

import main.java.dtos.*;
import main.java.mappers.ArtifactMapper;
import main.java.mappers.DiagramMapper;
import main.java.mappers.ShapeMapper;
import main.java.mappers.ShapeRelationshipMapper;
import main.java.models.*;
import main.java.repositories.*;
import main.java.utilities.StringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
@Repository("diagramManager")
public class DiagramManager
{
    private final DiagramRepository diagramRepository;
    private final LibraryLevelRepository libraryLevelRepository;
    private final LovRepository lovRepository;

    public DiagramManager(DiagramRepository diagramRepository,
                          LibraryLevelRepository libraryLevelRepository,
                          LovRepository lovRepository)
    {
        this.diagramRepository = diagramRepository;
        this.libraryLevelRepository = libraryLevelRepository;
        this.lovRepository = lovRepository;
    }

    public List<ErrorDto> validateAndSaveDiagram(PageDto pageDto) {

        List<ErrorDto> errors = this.validatePage(pageDto);

        if (errors.size() == 0) {
            this.saveDiagram(pageDto);
        }

        return errors;
    }

    public List<PageDto> getDiagramsByLibraryId(String libraryId)
    {
        LibraryLevel libraryLevel = this.libraryLevelRepository.findById(libraryId);

        List<PageDto> pageDtos = new ArrayList<PageDto>();

        List<Diagram> diagrams = this.diagramRepository.findByLibraryLevel(libraryLevel);
        for (Diagram diagram : diagrams)
        {
            pageDtos.add(DiagramMapper.mapModelToDto(diagram));
        }

        return pageDtos;
    }

    private List<ErrorDto> validatePage(PageDto pageDto) {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        //make sure all required fields are present
        if (StringUtils.isEmpty(pageDto.getId())) {
            errors.add(new ErrorDto("page id is missing"));
        }

        if (StringUtils.isEmpty(pageDto.getLibraryId()))
        {
            errors.add(new ErrorDto("the library for the page is required"));
        }

        if (StringUtils.isEmpty(pageDto.getPageTitle()))
        {
            errors.add(new ErrorDto("the page title is required"));
        }

        if (StringUtils.isEmpty(pageDto.getPageDescription()))
        {
            errors.add(new ErrorDto("the page description is required"));
        }

        return errors;

    }

    private void saveDiagram(PageDto pageDto)
    {
        Diagram diagram = this.diagramRepository.findById(pageDto.getId());

        if (diagram != null) {
            this.diagramRepository.delete(diagram);
        }

        diagram = new Diagram();

        diagram.setId(pageDto.getId());
        diagram.setPageTitle(pageDto.getPageTitle());
        diagram.setPageDescription(pageDto.getPageDescription());

        LibraryLevel libraryEntry = this.libraryLevelRepository.findById(pageDto.getLibraryId());

        if (libraryEntry != null)
        {
            diagram.setLibraryLevel(libraryEntry);
        }

        //add all the incoming tags
        for (TagDto tagDto : pageDto.getTags())
        {
            Lov tagLov = this.lovRepository.findById(tagDto.getLov().getId());

            Tag tag = new Tag();
            tag.setId(tagDto.getId());
            tag.setTagValue(tagDto.getTagValue());
            tag.setDiagram(diagram);
            tag.setLovTagType(tagLov);

            //note - if the tag already exists, it won't be added again
            diagram.addTag(tag);
        }

        this.diagramRepository.save(diagram);
    }

    public UiPageDto getPageById(String pageId)
    {

        UiPageDto uiPageDto = new UiPageDto();

        Diagram diagram = this.diagramRepository.findById(pageId);

        uiPageDto.setPageDto(DiagramMapper.mapModelToDto(diagram));

        for (Shape shape : diagram.getShapes())
        {
            uiPageDto.getShapeDtos().add(ShapeMapper.mapModelToDto(shape));
        }

        for (ShapeRelationship shapeRelationship : diagram.getRelationships())
        {
            uiPageDto.getShapeRelationshipDtos().add(ShapeRelationshipMapper.mapModelToDto(shapeRelationship));
        }

        return uiPageDto;
    }
}