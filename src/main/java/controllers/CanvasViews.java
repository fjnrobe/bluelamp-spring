package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
@Controller
public class CanvasViews {

    Logger logger = Logger.getLogger(CanvasViews.class);

    @GetMapping(URLConstants.DIAGRAM_CANVAS)
    public String getDiagramCanvas(ModelMap model){

        logger.info("called getDiagramCanvas");

        return TemplateConstants.DIAGRAM_CANVAS;
    }
}
