package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
@Controller
public class DiagramViews
{
    Logger logger = Logger.getLogger(DiagramViews.class);

    @GetMapping(URLConstants.DIAGRAM_HOME)
    public String getDiagramHome(ModelMap model){

        logger.info("called getDiagramHome");

        return TemplateConstants.DIAGRAM_HOME;
    }
}
