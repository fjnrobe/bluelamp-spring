package main.java.dtos;

/**
 * Created by Robertson_Laptop on 2/25/2018.
 */
public class NewDrilldownDto {

    public UiPageDto newUiPageDto;
    public UiPageDto currentUiPageDto;

    public NewDrilldownDto()
    {

    }

    public UiPageDto getCurrentUiPageDto() {
        return currentUiPageDto;
    }

    public void setCurrentUiPageDto(UiPageDto currentUiPageDto) {
        this.currentUiPageDto = currentUiPageDto;
    }

    public UiPageDto getNewUiPageDto() {
        return newUiPageDto;
    }

    public void setNewUiPageDto(UiPageDto newUiPageDto) {
        this.newUiPageDto = newUiPageDto;
    }
}
