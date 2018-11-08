package main.java.controllers;

import main.java.common.URLConstants;
import main.java.dtos.UserSecurityDto;
import main.java.managers.SecurityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Created by Robertson_Laptop on 7/15/2018.
 */
@RestController
@EnableAutoConfiguration
public class SecurityController {

    @Autowired
    SecurityManager securityManager;

    @GetMapping(URLConstants.GET_CURRENT_USER_PROFILE)
    public UserSecurityDto getCurrentUserProfile()
    {
        return this.securityManager.getCurrentUserProfile();
    }
}
