package main.java.controllers;

import main.java.common.URLConstants;
import main.java.dtos.ArtifactDto;
import main.java.dtos.ErrorDto;
import main.java.dtos.PageDto;
import main.java.dtos.UiPageDto;
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
 * Created by Robertson_Laptop on 1/13/2018.
 */
@RestController
@EnableAutoConfiguration
public class CanvasController {

    @Autowired
    DiagramManager diagramManager;

    Logger logger = Logger.getLogger(CanvasController.class);


}
