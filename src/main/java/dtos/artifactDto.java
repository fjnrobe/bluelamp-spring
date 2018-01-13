package main.java.dtos;

import main.java.models.LibraryLevel;
import main.java.models.Lov;
import main.java.models.Tag;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 12/16/2017.
 */
public class ArtifactDto {

    private String id;
    private String documentTitle;
    private String abbreviation;
    private String detailedText;
    private Lov documentType;
    private String libraryId;

    private List<TagDto> tags = new ArrayList<TagDto>();

    public ArtifactDto()
    {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDocumentTitle() {
        return documentTitle;
    }

    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getDetailedText() {
        return detailedText;
    }

    public void setDetailedText(String detailedText) {
        this.detailedText = detailedText;
    }

    public List<TagDto> getTags() {
        return tags;
    }

    public void setTags(List<TagDto> tags) {
        this.tags = tags;
    }

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public Lov getDocumentType() {
        return documentType;
    }

    public void setDocumentType(Lov documentType) {
        this.documentType = documentType;
    }
}
