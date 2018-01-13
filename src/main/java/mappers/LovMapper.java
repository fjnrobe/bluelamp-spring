package main.java.mappers;

import main.java.dtos.ArtifactDto;
import main.java.dtos.LovDto;
import main.java.models.Artifact;
import main.java.models.Lov;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class LovMapper {

    public static LovDto mapModelToDto(Lov lov) {
        LovDto lovDto = new LovDto();
        lovDto.setId(lov.getId());
        lovDto.setLongName(lov.getLongName());
        lovDto.setLovTable(lov.getLovTable());
        lovDto.setShortName(lov.getShortName());

        return lovDto;
    }
}
