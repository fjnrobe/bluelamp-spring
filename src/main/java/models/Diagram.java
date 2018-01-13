package main.java.models;

import main.java.dtos.AnnotationDto;
import main.java.dtos.TagDto;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
@Entity
@Table(name = "diagram")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates

public class Diagram {

    @Id
    private String id;
    private String pageTitle;
    private String pageDescription;

    @OneToOne
    @JoinColumn(name = "artifact_id")
    private Artifact artifact;

    @ManyToOne
    @JoinColumn(name = "library_id",
            foreignKey = @ForeignKey(name = "LIBRARY_ID_FK")
    )
    private LibraryLevel libraryLevel;

    @OneToMany(mappedBy = "diagram",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Tag> tags = new ArrayList<Tag>();

    @OneToMany(mappedBy = "diagram",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Annotation> annotations = new ArrayList<Annotation>();


    @OneToMany(mappedBy = "diagram",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Shape> shapes = new ArrayList<Shape>();

    @OneToMany(mappedBy = "diagram",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ShapeRelationship> relationships = new ArrayList<ShapeRelationship>();

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

    public LibraryLevel getLibraryLevel() {
        return libraryLevel;
    }

    public void setLibraryLevel(LibraryLevel libraryLevel) {
        this.libraryLevel = libraryLevel;
    }


    public List<Tag> getTags() {
        return tags;
    }

    public void addTag(Tag newTag) {

        boolean exists = false;
        for (Tag tag : tags)
        {
            if (tag.getId().equals(newTag.getId()))
            {
                exists = true;
                break;
            }
        }
        if (!exists) {
            tags.add(newTag);
            newTag.setDiagram(this);
        }
    }

    public void removeTag(Tag oldTag) {
        boolean exists = false;
        for (Tag tag : tags)
        {
            if (tag.getId().equals(oldTag.getId()))
            {
                exists = true;
                break;
            }
        }
        if (exists) {
            tags.remove(oldTag);
            oldTag.setDiagram(null);
        }
    }

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
    }

    public Artifact getArtifact() {
        return artifact;
    }

    public void setArtifact(Artifact artifact) {
        this.artifact = artifact;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Shape> getShapes() {
        return shapes;
    }

    public void setShapes(List<Shape> shapes) {
        this.shapes = shapes;
    }

    public List<ShapeRelationship> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<ShapeRelationship> relationships) {
        this.relationships = relationships;
    }
}
