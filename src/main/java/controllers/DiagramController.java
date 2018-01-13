package main.java.controllers;

import main.java.common.URLConstants;
import main.java.dtos.ArtifactDto;
import main.java.dtos.ErrorDto;
import main.java.dtos.PageDto;
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

    @PostMapping(URLConstants.DIAGRAM_POST)
    public ResponseEntity<List<ErrorDto>> saveDiagram(@Valid @RequestBody
                                                              PageDto pageDto)
    {

        logger.info("called diagram - POST");

        List<ErrorDto> errors = this.diagramManager.validateAndSaveDiagram(pageDto);

        if (!errors.isEmpty())
        {
            return new ResponseEntity(errors, HttpStatus.NOT_ACCEPTABLE);
        }
        else
        {
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }

    //get all diagrams linked to a given library id
    @GetMapping(URLConstants.DIAGRAMS_BY_LIBRARY_ID_GET)
    public List<PageDto> getDiagramsByLibraryId(@PathVariable(value = "libraryId") String libraryId)
    {
        return this.diagramManager.getDiagramsByLibraryId(libraryId);
    }

}
