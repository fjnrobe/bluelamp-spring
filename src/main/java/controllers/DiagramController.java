package main.java.controllers;

import main.java.common.URLConstants;
import main.java.dtos.*;
import main.java.managers.DiagramManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
@RestController
@EnableAutoConfiguration
public class DiagramController {

    @Autowired
    DiagramManager diagramManager;

    Logger logger = Logger.getLogger(DiagramController.class);

    @GetMapping(URLConstants.DIAGRAMS_SEARCH)
    public List<PageDto> getDiagramsBySearch(@PathVariable(value="searchText") String searchText)
    {
        return this.diagramManager.getDiagramsBySearch(searchText);

    }

    @PostMapping(URLConstants.DIAGRAM_POST_NEW_DRILLDOWN)
    public ResponseEntity<List<ErrorDto>> saveDrillDownPage(@Valid @RequestBody
                                                                    NewDrilldownDto newDrilldownDto)
    {

        logger.info("called saveDrillDownPage");

        List<ErrorDto> errors = this.diagramManager.validateAndSaveDrilldownPage(newDrilldownDto);

        if (!errors.isEmpty())
        {
            return new ResponseEntity(errors, HttpStatus.NOT_ACCEPTABLE);
        }
        else
        {
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }

    @PostMapping(URLConstants.DIAGRAM_POST)
    public ResponseEntity<List<ErrorDto>> savePage(@Valid @RequestBody
                                                           UiPageDto uiPageDto)
    {

        logger.info("called diagram - post");

        List<ErrorDto> errors = this.diagramManager.validateAndSavePage(uiPageDto);

        if (!errors.isEmpty())
        {
            return new ResponseEntity(errors, HttpStatus.NOT_ACCEPTABLE);
        }
        else
        {
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }

//    @PostMapping(URLConstants.DIAGRAM_SHARE)
//    public ResponseEntity<List<ErrorDto>> shareDiagram(@Valid @RequestBody
//                                                           EmailMessageDto emailMessageDto)
//    {
//
//        logger.info("called diagram - share");
//
//        List<ErrorDto> errors = this.emailManager.shareDiagram(emailMessageDto);
//
//        if (!errors.isEmpty())
//        {
//            return new ResponseEntity(errors, HttpStatus.NOT_ACCEPTABLE);
//        }
//        else
//        {
//            return new ResponseEntity(HttpStatus.CREATED);
//        }
//    }

    //get a a diagram's page info by page id
    @GetMapping(URLConstants.DIAGRAM_BY_PAGE_ID)
    public UiPageDto getDiagramByPageId(@PathVariable(value="pageId") String pageId)
    {
        return this.diagramManager.getPageById(pageId);
    }

    //get all diagrams linked to a given library id
    @GetMapping(URLConstants.DIAGRAMS_BY_LIBRARY_ID_GET)
    public List<PageDto> getDiagramsByLibraryId(@PathVariable(value = "libraryId") String libraryId)
    {
        return this.diagramManager.getDiagramsByLibraryId(libraryId);
    }

    @DeleteMapping(URLConstants.CANVAS_PAGE)
    public ResponseEntity<List<ErrorDto>> deletePage(@PathVariable(value = "pageId") String pageId)
    {
        this.diagramManager.deleteDiagram(pageId);

        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping(URLConstants.TEMPLATE_GETALL)
    public List<ShapeTemplateDto> getAllShapeTemplates()
    {
        return this.diagramManager.getShapeTemplates();
    }

    @PostMapping(URLConstants.TEMPLATE_SAVE)
    public ResponseEntity<List<ErrorDto>> saveShapeTemplate(@Valid @RequestBody
                                                           ShapeTemplateDto shapeTemplateDto)
    {
        logger.info("called saveTemplate");

        List<ErrorDto> errors = this.diagramManager.validateAndSaveShapeTemplate(shapeTemplateDto);

        if (!errors.isEmpty())
        {
            return new ResponseEntity(errors, HttpStatus.NOT_ACCEPTABLE);
        }
        else
        {
            return new ResponseEntity(HttpStatus.CREATED);
        }

    }
}
