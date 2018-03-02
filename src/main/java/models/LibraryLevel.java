package main.java.models;


import com.fasterxml.jackson.annotation.JsonInclude;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.domain.Persistable;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Created by Robertson_Laptop on 11/24/2017.
 */
@Entity
@Table(name = "library_level")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates
public class LibraryLevel {

    private String id;
    private Integer level;
    @NotBlank
    private String description;
    @NotBlank
    private String abbreviation;
    @NotBlank
    private String parentLibraryId;

    private List<LibraryLevel> subLibraryList;

    private int subLibraryCount; //this attribute is populated only for display usage
    private int artifactCount;   //this attribute is populated only for display usage
    private int diagramCount;    //this attribute is populated only for display usage



    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date createdAt;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    private Date updatedAt;


    @Transient
    @JsonInclude
    public int getSubLibraryCount() {
        return subLibraryCount;
    }

    @Transient
    @JsonInclude
    public void setSubLibraryCount(int subLibraryCount) {
        this.subLibraryCount = subLibraryCount;
    }

    @Id
    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getParentLibraryId() {
        return parentLibraryId;
    }

    public void setParentLibraryId(String parentLibraryId) {
        this.parentLibraryId = parentLibraryId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Transient
    @JsonInclude
    public List<LibraryLevel> getSubLibraryList() {
        return subLibraryList;
    }

    @Transient
    @JsonInclude
    public void setSubLibraryList(List<LibraryLevel> subLibraries) {
        this.subLibraryList = subLibraries;
    }

    public LibraryLevel()
    {

    }

    @Transient
    @JsonInclude
    public int getArtifactCount() {
        return artifactCount;
    }

    @Transient
    @JsonInclude
    public void setArtifactCount(int artifactCount) {
        this.artifactCount = artifactCount;
    }

    @Transient
    @JsonInclude
    public int getDiagramCount() {
        return diagramCount;
    }

    @Transient
    @JsonInclude
    public void setDiagramCount(int diagramCount) {
        this.diagramCount = diagramCount;
    }

}
