package main.java.managers;

import main.java.dtos.*;
import main.java.interfaces.ImodelId;
import main.java.mappers.*;
import main.java.models.*;
import main.java.repositories.*;
import main.java.utilities.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
@Repository("diagramManager")
@EnableAutoConfiguration
public class DiagramManager
{
    private final DiagramRepository diagramRepository;
    private final LibraryLevelRepository libraryLevelRepository;
    private final LovRepository lovRepository;
    private final ArtifactRepository artifactRepository;
    private final ShapeRepository shapeRespository;
    private final ShapeTemplateRepository shapeTemplateRepository;

    @Autowired
    DiagramDao diagramDao;

    @Autowired
    LibraryManager libraryManager;

    public DiagramManager(DiagramRepository diagramRepository,
                          LibraryLevelRepository libraryLevelRepository,
                          LovRepository lovRepository,
                          ArtifactRepository artifactRepository,
                          ShapeRepository shapeRepository,
                          ShapeTemplateRepository shapeTemplateRepository)
    {
        this.diagramRepository = diagramRepository;
        this.libraryLevelRepository = libraryLevelRepository;
        this.lovRepository = lovRepository;
        this.artifactRepository = artifactRepository;
        this.shapeRespository = shapeRepository;
        this.shapeTemplateRepository = shapeTemplateRepository;
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

    public List<PageDto> getDiagramsBySearch(String searchText)
    {
        List<PageDto> pageDtos = new ArrayList<PageDto>();

        //the database search function (tsquery) uses & (and), | (or), and ! (not). So - if
        //we get a multiple word search, replace the spaces with &
        searchText = searchText.replace(" ", "&");
        List<String> diagramIds = this.diagramDao.findBySearchText(searchText);
        for (String diagramId : diagramIds)
        {
            Diagram diagram = this.diagramRepository.findById(diagramId);
            PageDto newPageDto = DiagramMapper.mapModelToDto(diagram);

            newPageDto.setLibraryAncestry(this.libraryManager.getLibraryAncestryText(newPageDto.getLibraryId()));
            pageDtos.add(newPageDto);
        }

        return pageDtos;
    }

    public List<PageDto> getDiagramsByLibraryId(String libraryId)
    {
        LibraryLevel libraryLevel = this.libraryLevelRepository.findById(libraryId);

        List<PageDto> pageDtos = new ArrayList<PageDto>();

        List<Diagram> diagrams = this.diagramRepository.findByLibraryLevel(libraryLevel);
        for (Diagram diagram : diagrams)
        {

            PageDto newPageDto = DiagramMapper.mapModelToDto(diagram);

            newPageDto.setLibraryAncestry(this.libraryManager.getLibraryAncestryText(newPageDto.getLibraryId()));
            pageDtos.add(newPageDto);
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

        //start off by deleting the existing diagram - all dependent
        //table entries will be deleted via cascade delete
        Diagram diagram = this.diagramRepository.findById(pageDto.getId());

        if (diagram != null) {
            this.diagramRepository.delete(diagram);
        }

        //then re-create - alot easier than trying to determine what changed
        //between old/new values
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

        //add all the shapes - for those shapes that were created from templates
        //we store a reference to the shape template and update the shape
        //template with the text, tags and annotations
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
            shape.setArtifact(null);

            Artifact artifact = null;
            if (shapeDto.getReferenceArtifactDto() != null)
            {
                artifact = this.artifactRepository.findById(shapeDto.getReferenceArtifactDto().getId());
                if (artifact != null) {
                    shape.setArtifact(artifact);
                }
            }

            //add all the incoming tags
            for (TagDto tagDto : shapeDto.getTagDtos())
            {
                if (!tagDto.isSharedInd()) {
                    Lov tagLov = this.lovRepository.findById(tagDto.getLovDto().getId());

                    Tag tag = new Tag();
                    tag.setId(tagDto.getId());
                    tag.setTagValue(tagDto.getTagValue());
                    tag.setLovTagType(tagLov);

                    shape.addTag(tag);
                }
            }

            //add all the incoming annotations
            for (AnnotationDto annotationDto : shapeDto.getAnnotationDtos())
            {
                if (!annotationDto.isSharedInd())
                {
                    Annotation annotation = new Annotation();
                    annotation.setId(annotationDto.getId());
                    annotation.setAnnotationText(annotationDto.getAnnotationText());

                    shape.addAnnotation(annotation);
                }
            }

            ShapeTemplate shapeTemplate = null;
            if (shapeDto.getTemplateId() != null)
            {
                shape.setTemplateId(shapeDto.getTemplateId());
                shapeTemplate = this.shapeTemplateRepository.findById(shapeDto.getTemplateId());
                if (shapeTemplate != null) {
                    String templateShapeType = shapeTemplate.getShapeType();
                    String templateName = shapeTemplate.getTemplateName();
                    this.shapeTemplateRepository.delete(shapeTemplate.getId());

                    shapeTemplate = new ShapeTemplate();
                    shapeTemplate.setId(shapeDto.getTemplateId());
                    shapeTemplate.setShapeType(templateShapeType);
                    shapeTemplate.setTemplateName(templateName);
                    shapeTemplate.setShapeText(shapeDto.getShapeText());
                    shapeTemplate.setDrillDownPageId(shapeDto.getDrillDownPageId());
                    shapeTemplate.setArtifact(artifact);

                    //add all the incoming tags
                    for (TagDto tagDto : shapeDto.getTagDtos()) {
                        if (tagDto.isSharedInd()) {
                            Lov tagLov = this.lovRepository.findById(tagDto.getLovDto().getId());

                            Tag tag = new Tag();
                            tag.setId(tagDto.getId());
                            tag.setTagValue(tagDto.getTagValue());
                            tag.setLovTagType(tagLov);

                            shapeTemplate.addTag(tag);
                        }
                    }

                    //add all the incoming annotations
                    for (AnnotationDto annotationDto : shapeDto.getAnnotationDtos()) {
                        if (annotationDto.isSharedInd()) {
                            Annotation annotation = new Annotation();
                            annotation.setId(annotationDto.getId());
                            annotation.setAnnotationText(annotationDto.getAnnotationText());

                            shapeTemplate.addAnnotation(annotation);
                        }
                    }
                    this.shapeTemplateRepository.save(shapeTemplate);
                }
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
            ShapeTemplate shapeTemplate = null;

            if (shape.getTemplateId() != null)
            {
                shapeTemplate =
                        this.shapeTemplateRepository.findById(shape.getTemplateId());
            }
            ShapeDto shapeDto = ShapeMapper.mapModelToDto(shape, shapeTemplate);
            if (shape.getArtifact() != null)
            {
                shapeDto.setReferenceArtifactDto(ArtifactMapper.mapModelToDto(shape.getArtifact(),""));
            }
            uiPageDto.getShapeDtos().add(shapeDto);
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

    public List<ErrorDto> validateAndSaveShapeTemplate(ShapeTemplateDto shapeTemplateDto)
    {
        List<ErrorDto> errors = validateShapeTemplate(shapeTemplateDto);

        if (errors.size() == 0)
        {
            ShapeTemplate shapeTemplate = this.shapeTemplateRepository.findById(shapeTemplateDto.getId());

            if (shapeTemplate != null) {
                this.shapeTemplateRepository.delete(shapeTemplate);
            }

            shapeTemplate = new ShapeTemplate();

            shapeTemplate.setId(shapeTemplateDto.getId());
            shapeTemplate.setTemplateName(shapeTemplateDto.getTemplateName());
            shapeTemplate.setDrillDownPageId(shapeTemplateDto.getDrillDownPageId());
            shapeTemplate.setShapeText(shapeTemplateDto.getShapeText());
            shapeTemplate.setShapeType(shapeTemplateDto.getShapeType());

            if (shapeTemplateDto.getReferenceArtifactDto() != null) {
                Artifact artifact = this.artifactRepository.findById(shapeTemplateDto.getReferenceArtifactDto().getId());
                if (artifact != null) {
                    shapeTemplate.setArtifact(artifact);
                }
            }

            //add all the incoming tags
            for (TagDto tagDto : shapeTemplateDto.getTagDtos()) {
                if (tagDto.isSharedInd()) {
                    Lov tagLov = this.lovRepository.findById(tagDto.getLovDto().getId());

                    Tag tag = new Tag();
                    tag.setId(tagDto.getId());
                    tag.setTagValue(tagDto.getTagValue());
                    tag.setLovTagType(tagLov);

                    shapeTemplate.addTag(tag);
                }
            }

            //add all the incoming annotations
            for (AnnotationDto annotationDto : shapeTemplateDto.getAnnotationDtos()) {

                if (annotationDto.isSharedInd()) {
                    Annotation annotation = new Annotation();
                    annotation.setId(annotationDto.getId());
                    annotation.setAnnotationText(annotationDto.getAnnotationText());

                    shapeTemplate.addAnnotation(annotation);
                }
            }

            this.shapeTemplateRepository.save(shapeTemplate);
        }

        return errors;
    }

    public List<ErrorDto> validateShapeTemplate(ShapeTemplateDto shapeTemplateDto) {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        if (StringUtils.isEmpty(shapeTemplateDto.getTemplateName()))
        {
            errors.add (new ErrorDto("The template name is required"));
        }
        else
        {
            ShapeTemplate existingTemplate = this.shapeTemplateRepository.findByTemplateName(shapeTemplateDto.getTemplateName());
            if ((existingTemplate != null) && (existingTemplate.getId() != shapeTemplateDto.getId()))
            {
                errors.add (new ErrorDto("This template name is already in use"));
            }
        }

        if (StringUtils.isEmpty(shapeTemplateDto.getShapeText()))
        {
            errors.add (new ErrorDto("The template text is required"));
        }

        return errors;
    }

    public List<ShapeTemplateDto> getShapeTemplates()
    {
        List<ShapeTemplateDto> shapeTemplateDtos = new ArrayList<ShapeTemplateDto>();

        List<ShapeTemplate> shapeTemplates = this.shapeTemplateRepository.findAll();

        for (ShapeTemplate shapeTemplate : shapeTemplates)
        {
            shapeTemplateDtos.add(ShapeTemplateMapper.mapModelToDto(shapeTemplate));
        }

        return shapeTemplateDtos;
    }


    @Transactional
    public void deleteDiagram(String pageId)
    {
        //we need to remove this page from any shapes that drill down to this page
        this.shapeRespository.removeDrillDownPageId(pageId);
        this.diagramRepository.delete(pageId);
    }
}