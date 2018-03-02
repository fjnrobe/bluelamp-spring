package main.java.managers;

import main.java.dtos.*;
import main.java.mappers.DiagramMapper;
import main.java.mappers.ShapeMapper;
import main.java.mappers.ShapeRelationshipMapper;
import main.java.models.*;
import main.java.repositories.*;
import main.java.utilities.StringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
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
    private final ArtifactRepository artifactRepository;
    private final ShapeRepository shapeRespository;

    public DiagramManager(DiagramRepository diagramRepository,
                          LibraryLevelRepository libraryLevelRepository,
                          LovRepository lovRepository,
                          ArtifactRepository artifactRepository,
                          ShapeRepository shapeRepository)
    {
        this.diagramRepository = diagramRepository;
        this.libraryLevelRepository = libraryLevelRepository;
        this.lovRepository = lovRepository;
        this.artifactRepository = artifactRepository;
        this.shapeRespository = shapeRepository;
    }

    public List<ErrorDto> validateAndSaveDiagram(PageDto pageDto) {

        List<ErrorDto> errors = this.validateDiagram(pageDto);

        if (errors.size() == 0) {
            UiPageDto uiPageDto = new UiPageDto();
            uiPageDto.setPageDto(pageDto);
            this.savePage(uiPageDto);
        }

        return errors;
    }

    public List<ErrorDto> validateAndSaveDrilldownPage(NewDrilldownDto newDrilldownDto) {

        List<ErrorDto> errors = this.validatePage(newDrilldownDto.getNewUiPageDto());

        if (errors.size() == 0) {
            this.savePage(newDrilldownDto.getNewUiPageDto());

            errors.addAll(this.validatePage(newDrilldownDto.getCurrentUiPageDto()));
            if (errors.size() == 0) {
                this.savePage(newDrilldownDto.getCurrentUiPageDto());
            }
        }

        return errors;
    }

    public List<ErrorDto> validateAndSavePage(UiPageDto uiPageDto) {

        List<ErrorDto> errors = this.validatePage(uiPageDto);

        if (errors.size() == 0) {
            this.savePage(uiPageDto);
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

    private List<ErrorDto> validatePage(UiPageDto uiPageDto)
    {
        List<ErrorDto> errors = this.validateDiagram(uiPageDto.getPageDto());

        return errors;
    }

    private List<ErrorDto> validateDiagram(PageDto pageDto) {
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

        //if no errors - check that the diagram name is not a duplicate
        if (errors.size() == 0)
        {
            Diagram existingDiagram = this.diagramRepository.findByPageTitleIgnoreCase(pageDto.getPageTitle());

            if ((existingDiagram != null) && (!existingDiagram.getId().equals(pageDto.getId())))
            {
                errors.add(new ErrorDto("There is already a diagram with this title. Duplicate titles are not allowed"));
            }
        }

        return errors;

    }

    private void savePage(UiPageDto uiPageDto)
    {
        PageDto pageDto = uiPageDto.getPageDto();

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

        if (pageDto.getArtifactId() != null)
        {
            Artifact artifact = this.artifactRepository.findById(pageDto.getArtifactId());
            if (artifact != null)
            {
                diagram.setArtifact(artifact);
            }
        }

        //add all the incoming tags
        for (TagDto tagDto : pageDto.getTagDtos())
        {
            Lov tagLov = this.lovRepository.findById(tagDto.getLovDto().getId());

            Tag tag = new Tag();
            tag.setId(tagDto.getId());
            tag.setTagValue(tagDto.getTagValue());
            tag.setLovTagType(tagLov);

            diagram.addTag(tag);
        }

        //add all the incoming annotations
        for (AnnotationDto annotationDto : pageDto.getAnnotationDtos())
        {
            Annotation annotation = new Annotation();
            annotation.setId(annotationDto.getId());
            annotation.setAnnotationText(annotationDto.getAnnotationText());

            diagram.addAnnotation(annotation);
        }

        //add all the shapes
        for (ShapeDto shapeDto : uiPageDto.getShapeDtos())
        {
            Shape shape = new Shape();
            shape.setId(shapeDto.getId());
            shape.setShapeType(shapeDto.getShapeType());
            shape.setShapeText(shapeDto.getShapeText());
            shape.setDrillDownPageId(shapeDto.getDrillDownPageId());
            shape.setCenterX(shapeDto.getCenterX());
            shape.setCenterY(shapeDto.getCenterY());
            shape.setHeight(shapeDto.getHeight());
            shape.setRadius(shapeDto.getRadius());
            shape.setSequenceNumber(shapeDto.getSequenceNumber());
            shape.setWidth(shapeDto.getWidth());

            //add all the incoming tags
            for (TagDto tagDto : shapeDto.getTagDtos())
            {
                Lov tagLov = this.lovRepository.findById(tagDto.getLovDto().getId());

                Tag tag = new Tag();
                tag.setId(tagDto.getId());
                tag.setTagValue(tagDto.getTagValue());
                tag.setLovTagType(tagLov);

                shape.addTag(tag);
            }

            //add all the incoming annotations
            for (AnnotationDto annotationDto : shapeDto.getAnnotationDtos())
            {
                Annotation annotation = new Annotation();
                annotation.setId(annotationDto.getId());
                annotation.setAnnotationText(annotationDto.getAnnotationText());

                shape.addAnnotation(annotation);
            }

            diagram.addShape(shape);
        }

        //add all the relationships
        for (ShapeRelationshipDto shapeRelationshipDto : uiPageDto.getShapeRelationshipDtos())
        {

            Relationship relationship = new Relationship();
            relationship.setId(shapeRelationshipDto.getId());
            relationship.setRelationshipType(shapeRelationshipDto.getRelationshipType());
            relationship.setEndXLocation(shapeRelationshipDto.getEndXLocation());
            relationship.setEndYLocation(shapeRelationshipDto.getEndYLocation());
            relationship.setFromShapeId(shapeRelationshipDto.getFromShapeId());
            relationship.setRelationshipGraphicId(shapeRelationshipDto.getRelationshipGraphicId());
            relationship.setShapeText(shapeRelationshipDto.getShapeText());
            relationship.setStartXLocation(shapeRelationshipDto.getStartXLocation());
            relationship.setStartYLocation(shapeRelationshipDto.getStartYLocation());
            relationship.setToShapeId(shapeRelationshipDto.getToShapeId());

            //add all the incoming tags
            for (TagDto tagDto : shapeRelationshipDto.getTagDtos())
            {
                Lov tagLov = this.lovRepository.findById(tagDto.getLovDto().getId());

                Tag tag = new Tag();
                tag.setId(tagDto.getId());
                tag.setTagValue(tagDto.getTagValue());
                tag.setLovTagType(tagLov);

                relationship.addTag(tag);
            }

            //add all the incoming annotations
            for (AnnotationDto annotationDto : shapeRelationshipDto.getAnnotationDtos())
            {
                Annotation annotation = new Annotation();
                annotation.setId(annotationDto.getId());
                annotation.setAnnotationText(annotationDto.getAnnotationText());

                relationship.addAnnotation(annotation);
            }

            diagram.addRelationship(relationship);
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

        for (Relationship relationship : diagram.getRelationships())
        {
            uiPageDto.getShapeRelationshipDtos().add(ShapeRelationshipMapper.mapModelToDto(relationship));
        }

        //get all shapes that drill down to this page. From this list
        //we can get a unique list of pages for these shapes
        List<Shape> predecessorShapes =
                this.shapeRespository.findByDrillDownPageId(uiPageDto.getPageDto().getId());

        HashMap<String, Diagram> predecessorPages = new HashMap<String, Diagram>();
        for (Shape precedessorShape : predecessorShapes)
        {
            predecessorPages.put( precedessorShape.getDiagram().getId(),
                    precedessorShape.getDiagram() );
        }

        for (Diagram predecessorPage : predecessorPages.values())
        {
            uiPageDto.getPredecessorPageDtos().add(DiagramMapper.mapModelToDto(predecessorPage));
        }

        return uiPageDto;
    }
}