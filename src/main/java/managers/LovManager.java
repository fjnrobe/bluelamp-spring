package main.java.managers;

import main.java.dtos.ErrorDto;
import main.java.models.Lov;
import main.java.repositories.LibraryLevelRepository;
import main.java.repositories.LovRepository;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 12/7/2017.
 */
@Repository("lovManager")
public class LovManager {

    Logger logger = Logger.getLogger(LibraryManager.class);

    private final LovRepository lovRepository;

    public LovManager(LovRepository repository)
    {
        this.lovRepository = repository;
    }

    public List<Lov> getLovTable(String lovTable)
    {
        return this.lovRepository.findByLovTable(lovTable);
    }

    public List<ErrorDto> validateAndSaveLovEntry(Lov lov)
    {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();

        errors = this.validateLov(lov);

        if (errors.size() == 0)
        {
            this.lovRepository.save(lov);
        }

        return errors;
    }

    //validate the incoming lov entry for:
    //1) all required fields populated
    //2) the lov values (short name and long name) is not a dup for the lov table
    private List<ErrorDto> validateLov(Lov lov)
    {
        List<ErrorDto> errors = new ArrayList<ErrorDto>();
        if (StringUtils.isEmpty(lov.getLovTable()))
        {
            errors.add((new ErrorDto("the lov table is a required field")));
        }
        if (StringUtils.isEmpty(lov.getShortName()))
        {
            errors.add((new ErrorDto("the short name is a required field")));
        }
        if (StringUtils.isEmpty(lov.getLongName())) {
            errors.add((new ErrorDto("the long name is a required field")));
        }

        if (errors.size() == 0)
        {
            Lov dupLov = this.lovRepository.findByLovTableAndShortNameAllIgnoreCase(lov.getLovTable(), lov.getShortName());
            if (dupLov != null)
            {
                errors.add(new ErrorDto("there is already an entry with this short name value"));
            }

            dupLov = this.lovRepository.findByLovTableAndLongNameAllIgnoreCase(lov.getLovTable(), lov.getLongName());
            if (dupLov != null)
            {
                errors.add(new ErrorDto("there is already an entry with this long name value"));
            }
        }

        return errors;

    }
}
