package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import main.java.dtos.UserSecurityDto;
import main.java.utilities.JSONUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import main.java.managers.SecurityManager;

@Controller
public class LibraryViews extends BaseView {

    Logger logger = Logger.getLogger(LibraryViews.class);

    @Autowired
    SecurityManager securityManager;

    @GetMapping(URLConstants.LIBRARY_HOME)
    public String getLibrary(ModelMap model){

        logger.info("called getLibrary");

        UserSecurityDto dto = super.getCurrentUserProfile();
        model.put("userInfo", dto);

        model.put("userProfile", JSONUtils.convertToJSON(dto));

        return TemplateConstants.LIBRARY_CATEGORY;
    }


}
