package main.java.dtos;

import main.java.models.Lov;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
public class PageDto {
    private String id;
    private String pageTitle;
    private String pageDescription;
    private String libraryId;
    private String artifactId;
    private List<TagDto> tagDtos = new ArrayList<TagDto>();
    private List<AnnotationDto> annotationDtos = new ArrayList<AnnotationDto>();
    private String libraryAncestry;  //populated when performing a library search
    //is a string of the form Library/library/library
    //indicating the parent library structure

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPageTitle() {
        return pageTitle;
    }

    public void setPageTitle(String pageTitle) {
        this.pageTitle = pageTitle;
    }

    public String getPageDescription() {
        return pageDescription;
    }

    public void setPageDescription(String pageDescription) {
        this.pageDescription = pageDescription;
    }

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public String getArtifactId() {
        return artifactId;
    }

    public void setArtifactId(String artifactId) {
        this.artifactId = artifactId;
    }

    public List<TagDto> getTagDtos() {
        return tagDtos;
    }

    public void setTagDtos(List<TagDto> tagDtos) {
        this.tagDtos = tagDtos;
    }

    public List<AnnotationDto> getAnnotationDtos() {
        return annotationDtos;
    }

    public void setAnnotationDtos(List<AnnotationDto> annotationDtos) {
        this.annotationDtos = annotationDtos;
    }

    public String getLibraryAncestry() {
        return libraryAncestry;
    }

    public void setLibraryAncestry(String libraryAncestry) {
        this.libraryAncestry = libraryAncestry;
    }
}
