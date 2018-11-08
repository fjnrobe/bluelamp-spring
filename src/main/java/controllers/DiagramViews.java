package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import main.java.dtos.UserSecurityDto;
import main.java.utilities.JSONUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
@Controller
public class DiagramViews extends BaseView
{
    Logger logger = Logger.getLogger(DiagramViews.class);

    @GetMapping(URLConstants.DIAGRAM_HOME)
    public String getDiagramHome(ModelMap model){

        logger.info("called getDiagramHome");

        UserSecurityDto dto = super.getCurrentUserProfile();
        model.put("userInfo", dto);

        model.put("userProfile", JSONUtils.convertToJSON(dto));

        return TemplateConstants.DIAGRAM_HOME;
    }
}
