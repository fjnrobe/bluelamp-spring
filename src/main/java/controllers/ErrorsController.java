package main.java.controllers;

import main.java.common.URLConstants;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class ErrorsController implements ErrorController {


    @RequestMapping(URLConstants.ERROR_PAGE)
    public String error() {
        return URLConstants.LIBRARY_HOME;
    }

    @Override
    public String getErrorPath() {
        return URLConstants.ERROR_PAGE;
    }
}