package main.java.controllers;

import main.java.common.URLConstants;
import main.java.managers.LibraryManager;
import main.java.managers.LovManager;
import main.java.models.LibraryLevel;
import main.java.models.Lov;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Robertson_Laptop on 12/7/2017.
 */
@RestController
@EnableAutoConfiguration
public class LovController {

    @Autowired
    LovManager lovManager;


    Logger logger = Logger.getLogger(LovController.class);

    @GetMapping(URLConstants.LOV_GET_TABLE)
    public List<Lov> getTagTypes(@PathVariable(value = "lovTable") String lovTable)
    {
        return lovManager.getLovTable(lovTable);
    }
}
