package main.java.controllers;

import main.java.common.URLConstants;
import main.java.dtos.ErrorDto;
import main.java.managers.LovManager;
import main.java.models.LibraryLevel;
import main.java.models.Lov;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by Robertson_Laptop on 12/16/2017.
 */
@RestController
@EnableAutoConfiguration
public class TagController {

    @Autowired
    LovManager lovManager;


    Logger logger = Logger.getLogger(TagController.class);

    //add a new Tag
    //@Valid enforces validation on the LibraryLevel - per the annotations on the attributes
    @PostMapping(URLConstants.TAG_ADD)
    public ResponseEntity<List<ErrorDto>> addNewTag(@Valid @RequestBody Lov lov)
    {
        logger.info("called url/tag");

        List<ErrorDto> errors = this.lovManager.validateAndSaveLovEntry(lov);

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
