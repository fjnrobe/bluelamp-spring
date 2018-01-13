package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by Robertson_Laptop on 12/13/2017.
 */
@Controller
public class ArtifactViews {

    Logger logger = Logger.getLogger(ArtifactViews.class);

    @GetMapping(URLConstants.ARTIFACT_HOME)
    public String getArtifactHome(ModelMap model){

        logger.info("called getArtifactHome");

        return TemplateConstants.ARTIFACT_HOME;
    }
}
