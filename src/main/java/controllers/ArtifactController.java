package main.java.controllers;

import main.java.common.URLConstants;
import main.java.dtos.ArtifactDto;
import main.java.dtos.ErrorDto;
import main.java.managers.ArtifactManager;
import main.java.models.Artifact;
import main.java.models.LibraryLevel;
import main.java.models.Lov;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by Robertson_Laptop on 12/7/2017.
 */
@RestController
@EnableAutoConfiguration
public class ArtifactController {

    @Autowired
    ArtifactManager artifactManager;

    Logger logger = Logger.getLogger(TagController.class);

    //get all artifacts linked to a given library id
    @GetMapping(URLConstants.ARTIFACTS_BY_LIBRARY_ID_GET)
    public List<ArtifactDto> getArtifactsByLibraryId(@PathVariable(value = "libraryId") String libraryId)
    {
        return this.artifactManager.getArtifactsByLibraryId(libraryId);
    }

    @GetMapping(URLConstants.ARTIFACTS_GET)
    public ArtifactDto getArtifactById(@PathVariable(value = "artifactId") String artifactId)
    {
        return this.artifactManager.getArtifactById(artifactId);
    }

    @DeleteMapping(URLConstants.ARTIFACTS_DELETE)
    public ResponseEntity<List<ErrorDto>> deleteArtifact(@PathVariable(value = "artifactId") String artifactId)
    {
        logger.info("called artifacts - DELETE");

        List<ErrorDto> errors = this.artifactManager.validateAndDeleteArtifact(artifactId);

        if (!errors.isEmpty())
        {
            return new ResponseEntity(errors, HttpStatus.NOT_ACCEPTABLE);
        }
        else
        {
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }

    @PostMapping(URLConstants.ARTIFACTS_POST)
    public ResponseEntity<List<ErrorDto>> saveArtifact(@Valid @RequestBody
                                                                   ArtifactDto artifactDto)
    {

        logger.info("called artifacts - POST");

        List<ErrorDto> errors = this.artifactManager.validateAndSaveArtifact(artifactDto);

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
