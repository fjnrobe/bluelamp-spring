package main.java.controllers;

import main.java.dtos.UserSecurityDto;
import main.java.managers.SecurityManager;
import main.java.managers.SecurityService;
import main.java.models.UserSecurity;
import main.java.utilities.JSONUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Security;

/**
 * Created by Robertson_Laptop on 9/10/2018.
 */
public class BaseView {

    @Autowired
    SecurityManager securityManager;


    public UserSecurityDto getCurrentUserProfile()
    {
            return
                this.securityManager.getCurrentUserProfile();

    }

}
