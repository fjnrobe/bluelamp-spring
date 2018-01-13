package main.java.mappers;

import main.java.dtos.PageDto;
import main.java.dtos.TagDto;
import main.java.models.Diagram;
import main.java.models.Tag;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class TagMapper {

    public static TagDto mapModelToDto(Tag tag) {
        TagDto tagDto = new TagDto();
        tagDto.setTagValue(tag.getTagValue());
        tagDto.setId(tag.getId());
        tagDto.setLov(tag.getLovTagType());

        return tagDto;
    }
}
