package main.java.controllers;

import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import main.java.dtos.UiPageDto;
import main.java.dtos.UserSecurityDto;
import main.java.managers.DiagramManager;
import main.java.utilities.JSONUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
@Controller
public class CanvasViews extends BaseView {

    @Autowired
    DiagramManager diagramManager;

    Logger logger = Logger.getLogger(CanvasViews.class);

    @GetMapping(URLConstants.CANVAS_PAGE)
    public String getDiagramCanvas(@PathVariable String pageId, ModelMap model){

        logger.info("called getDiagramCanvas");

        UiPageDto pageDto = this.diagramManager.getPageById(pageId);

        if (pageDto != null)
        {
            model.put("uiPageDto", JSONUtils.convertToJSON(pageDto));
        }
        UserSecurityDto dto = super.getCurrentUserProfile();
        model.put("userInfo", dto);

        model.put("userProfile", JSONUtils.convertToJSON(dto));

        return TemplateConstants.DIAGRAM_CANVAS;
    }
}
