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
 * Created by Robertson_Laptop on 12/13/2017.
 */
@Controller
public class ArtifactViews extends BaseView
{

    Logger logger = Logger.getLogger(ArtifactViews.class);

    @GetMapping(URLConstants.ARTIFACT_HOME)
    public String getArtifactHome(ModelMap model){

        logger.info("called getArtifactHome");

        UserSecurityDto dto = super.getCurrentUserProfile();
        model.put("userInfo", dto);

        model.put("userProfile", JSONUtils.convertToJSON(dto));


        return TemplateConstants.ARTIFACT_HOME;
    }
}
