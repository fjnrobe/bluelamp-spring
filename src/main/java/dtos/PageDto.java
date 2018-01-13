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
    private ArtifactDto artifactDto;
    private List<TagDto> tags = new ArrayList<TagDto>();
    private List<AnnotationDto> annotations = new ArrayList<AnnotationDto>();

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

    public List<TagDto> getTags() {
        return tags;
    }

    public void setTags(List<TagDto> tags) {
        this.tags = tags;
    }

    public List<AnnotationDto> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<AnnotationDto> annotations) {
        this.annotations = annotations;
    }

    public ArtifactDto getArtifactDto() {
        return artifactDto;
    }

    public void setArtifactDto(ArtifactDto artifactDto) {
        this.artifactDto = artifactDto;
    }
}
