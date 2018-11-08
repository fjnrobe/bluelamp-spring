package main.java.controllers;

import main.java.managers.SecurityManager;
import main.java.common.TemplateConstants;
import main.java.common.URLConstants;
import main.java.dtos.ErrorDto;
import main.java.dtos.UserSecurityDto;
import org.apache.log4j.Logger;
import org.jboss.logging.annotations.Pos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import javax.validation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static java.lang.System.*;

/**
 * Created by Robertson_Laptop on 7/15/2018.
 */
@Controller
public class SecurityViews extends BaseView {

    Logger logger = Logger.getLogger(SecurityViews.class);

    @Autowired
    SecurityManager securityManager;

    @GetMapping(URLConstants.EDIT_LOGINS)
    public String getLoginList(ModelMap modelMap)
    {
        modelMap.put("users", this.securityManager.getUserProfiles());
        modelMap.put("userInfo", super.getCurrentUserProfile());

        return TemplateConstants.USER_LIST;
    }

    @GetMapping(URLConstants.LOGIN)
    public String getLogin(ModelMap modelmap)
    {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();
        modelmap.put("errors", errors);

        return TemplateConstants.LOGIN;
    }

    @GetMapping(URLConstants.CREATE_LOGIN)
    public String createUser(ModelMap modelmap)
    {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();
        UserSecurityDto newUser = new UserSecurityDto();
        modelmap.put("errors", errors);
        modelmap.put("user", newUser );
        modelmap.put("userInfo", super.getCurrentUserProfile());
        return TemplateConstants.CREATE_USER;
    }

    @PostMapping(URLConstants.CREATE_LOGIN)
    public String addNewUser(@ModelAttribute("user") UserSecurityDto userSecurityDto, ModelMap modelmap)
//add the below to use the binding validation. not wide about its use those.
//    public String addNewUser(@Valid UserSecurityDto personForm,
//                                                     BindingResult bindingResult)
    {

        List<ErrorDto> errorDtos = this.securityManager.validateAndSaveUser(userSecurityDto);

        if (!errorDtos.isEmpty()) {
            modelmap.put("errors", errorDtos);
            modelmap.put("userInfo", super.getCurrentUserProfile());
            return TemplateConstants.CREATE_USER;
        } else {

            return "redirect:" + URLConstants.EDIT_LOGINS;
        }
    }

    @GetMapping(URLConstants.EDIT_LOGIN)
    public String editUser(@PathVariable(value="userName") String userName, ModelMap modelMap)
    {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        modelMap.put("errors", errors);
        modelMap.put("user", this.securityManager.getUserProfile(userName) );
        modelMap.put("userInfo", super.getCurrentUserProfile());
        return TemplateConstants.CREATE_USER;
    }

//        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
//        Validator validator = factory.getValidator();
//        Set<ConstraintViolation<UserSecurityDto>> violations = validator.validate(userSecurityDto);
//
//        for (ConstraintViolation<UserSecurityDto> violation : violations) {
//            errorDtos.add(new ErrorDto(violation.getMessage()));
//        }

//        if (bindingResult.hasErrors())
//        {
//            List<ObjectError> errors = bindingResult.getAllErrors();
//            for (ObjectError error : errors)
//            {
//                logger.info(error.toString());
//            }
//        }


}
