package main.java.controllers;




import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import main.java.dtos.ErrorDto;
import main.java.managers.LibraryManager;
import main.java.models.LibraryLevel;
import org.apache.log4j.Logger;
import org.apache.tomcat.jni.Library;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URL;
import java.util.List;

/**
 * Created by Robertson_Laptop on 11/24/2017.
 */
@RestController
@EnableAutoConfiguration
public class LibraryController {

    @Autowired
    LibraryManager libraryManager;


    Logger logger = Logger.getLogger(LibraryViews.class);

    @GetMapping(URLConstants.SUBLIBRARY_GET)
    public List<LibraryLevel> getSubLibraries(@PathVariable String parentLibraryId)
    {
        return libraryManager.getLibraryList(parentLibraryId);
    }

    //call to get a library level entry and its parent/grandparent if applicable.
    @GetMapping(URLConstants.LIBRARY_GET_DELETE)
    public ResponseEntity<List<LibraryLevel>> getLibraryLevelAndAnchestry(@PathVariable(value = "libraryId") String libraryId)
    {
        logger.info("called url/library_get with " + libraryId);
        List<LibraryLevel> libEntry = libraryManager.getLibraryAncestry(libraryId);
        if(libEntry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(libEntry);

    }

    @DeleteMapping(URLConstants.LIBRARY_GET_DELETE)
    public ResponseEntity<List<ErrorDto>> deleteLibraryLevel(@PathVariable(value = "libraryId") String libraryId)
    {
        logger.info("called url/library for delete");

        List<ErrorDto> errors = libraryManager.validateAndDeleteLibraryLevel(libraryId);

        if (!errors.isEmpty())
        {
            return new ResponseEntity(errors, HttpStatus.NOT_ACCEPTABLE);
        }
        else
        {
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }
    //add a library level
    //@Valid enforces validation on the LibraryLevel - per the annotations on the attributes
    @PostMapping(URLConstants.LIBRARY_UPDATE)
    public ResponseEntity<List<ErrorDto>> addLibraryLevel(@Valid @RequestBody LibraryLevel libraryLevel)
    {
        logger.info("called url/libraryUpdate");

        List<ErrorDto> errors = libraryManager.validateAndSaveLibraryLevel(libraryLevel);

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




