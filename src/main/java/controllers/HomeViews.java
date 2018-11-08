package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import main.java.dtos.UserSecurityDto;
import main.java.utilities.JSONUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;


/**
 * Created by Robertson_Laptop on 12/7/2017.
 */
@Controller
public class HomeViews extends BaseView{

    @GetMapping(URLConstants.HOME)
    public String getHomePage(ModelMap model){

        UserSecurityDto dto = super.getCurrentUserProfile();
        model.put("userInfo", dto);

        model.put("userProfile", JSONUtils.convertToJSON(dto));

        return TemplateConstants.HOME;
    }
}
