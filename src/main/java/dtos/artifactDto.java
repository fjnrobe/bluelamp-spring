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
    private String documentName;
    private String documentContent;
    private String documentFileName;
    private String libraryAncestry;  //populated when performing a library search
                                     //is a string of the form Library/library/library
                                     //indicating the parent library structure
    private List<TagDto> tagDtos = new ArrayList<TagDto>();
    private List<AnnotationDto> annotationDtos = new ArrayList<AnnotationDto>();

    public ArtifactDto()
    {

    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public String getDocumentContent() {
        return documentContent;
    }

    public void setDocumentContent(String documentContent) {
        this.documentContent = documentContent;
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

    public List<AnnotationDto> getAnnotationDtos() {
        return annotationDtos;
    }

    public void setAnnotationDtos(List<AnnotationDto> annotationDtos) {
        this.annotationDtos = annotationDtos;
    }

    public List<TagDto> getTagDtos() {
        return tagDtos;
    }

    public void setTagDtos(List<TagDto> tagDtos) {
        this.tagDtos = tagDtos;
    }

    public String getLibraryAncestry() {
        return libraryAncestry;
    }

    public void setLibraryAncestry(String libraryAncestry) {
        this.libraryAncestry = libraryAncestry;
    }

    public String getDocumentFileName() {
        return documentFileName;
    }

    public void setDocumentFileName(String documentFileName) {
        this.documentFileName = documentFileName;
    }
}
