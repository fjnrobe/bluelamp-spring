package main.java.controllers;

import main.java.common.URLConstants;
import main.java.dtos.ArtifactDto;
import main.java.dtos.ErrorDto;
import main.java.managers.ArtifactManager;
import main.java.managers.DocumentManager;
import main.java.models.Artifact;
import main.java.models.LibraryLevel;
import main.java.models.Lov;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.Base64;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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

    @Autowired
    DocumentManager documentManager;

    Logger logger = Logger.getLogger(TagController.class);

    //get all artifacts linked to a given library id
    @GetMapping(URLConstants.ARTIFACTS_BY_LIBRARY_ID_GET)
    public List<ArtifactDto> getArtifactsByLibraryId(@PathVariable(value = "libraryId") String libraryId)
    {
        return this.artifactManager.getArtifactsByLibraryId(libraryId);
    }

    @GetMapping(URLConstants.ARTIFACTS_SEARCH)
    public List<ArtifactDto> getArtifactsBySearch(@PathVariable(value="searchText") String searchText)
    {
        return this.artifactManager.getArtifactsBySearch(searchText);
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

    @GetMapping(URLConstants.ARTIFACTS_DOC_DOWNLOAD)
    public void download(@PathVariable(value = "artifactId") String artifactId,
                         HttpServletRequest request,
                                             HttpServletResponse response) throws IOException {

        ServletContext context = request.getServletContext();

        // Load file as Resource
        File file = this.documentManager.getDocument(artifactId);

        FileInputStream inputStream = new FileInputStream(file);

        // get MIME type of the file
        String mimeType = context.getMimeType(file.getPath());
        if (mimeType == null) {
            // set to binary type if MIME mapping not found
            mimeType = "application/octet-stream";
        }

        // set content attributes for the response
        response.setContentType(mimeType);
        response.setContentLength((int) file.length());

        // set headers for the response
        String headerKey = "Content-Disposition";
        String headerValue = String.format("attachment; filename=\"%s\"",
                file.getName());
        response.setHeader(headerKey, headerValue);

        // get output stream of the response
        OutputStream outStream = response.getOutputStream();

        byte[] buffer = new byte[4096];
        int bytesRead = -1;

        // write bytes read from the input stream into the output stream
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, bytesRead);
        }

        inputStream.close();
        outStream.close();
    }

}
