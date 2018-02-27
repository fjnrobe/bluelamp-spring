package main.java.dtos;

import main.java.models.Lov;

/**
 * Created by Robertson_Laptop on 12/31/2017.
 */
public class TagDto {
    private String id;       //id of the tag
    private String tagValue; //value of the tag
    private LovDto lovDto;        //this is the lov entry for the tag

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTagValue() {
        return tagValue;
    }

    public void setTagValue(String tagValue) {
        this.tagValue = tagValue;
    }

    public LovDto getLovDto() {
        return lovDto;
    }

    public void setLovDto(LovDto lovDto) {
        this.lovDto = lovDto;
    }
}
