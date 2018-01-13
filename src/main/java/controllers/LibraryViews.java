package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LibraryViews {

    Logger logger = Logger.getLogger(LibraryViews.class);

    @GetMapping(URLConstants.LIBRARY_HOME)
    public String getLibrary(ModelMap model){

        logger.info("called getLibrary");

        return TemplateConstants.LIBRARY_CATEGORY;
    }


}
