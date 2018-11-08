package main.java.models;

/**
 * Created by Robertson_Laptop on 12/7/2017.
 */

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artifact")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates

public class Artifact {

    @Id
    private String id;

    private String documentTitle;
    private String abbreviation;
    private String detailedText;
    private String documentName;   //name of separate document stored in file storage

    @ManyToOne()
    @JoinColumn(name = "lov_document_type_id",
            foreignKey = @ForeignKey(name = "lov_document_type_id_FK")
    )
    private Lov lovDocumentType;

    @ManyToOne()
    @JoinColumn(name = "library_id",
            foreignKey = @ForeignKey(name = "LIBRARY_ID_FK")
    )
    private LibraryLevel libraryLevel;

    @OneToMany(mappedBy = "artifact",
                cascade = CascadeType.ALL,
                orphanRemoval = true)
    private List<Tag> tags = new ArrayList<Tag>();

    @OneToMany(mappedBy = "artifact",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Annotation> annotations = new ArrayList<Annotation>();

    public Artifact()
    {

    }

    public LibraryLevel getLibraryLevel() {
        return libraryLevel;
    }

    public void setLibraryLevel(LibraryLevel libraryLevel) {
        this.libraryLevel = libraryLevel;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
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
            newTag.setArtifact(this);
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
            oldTag.setArtifact(null);
        }
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

    public Lov getLovDocumentType() {
        return lovDocumentType;
    }

    public void setLovDocumentType(Lov lovDocumentType) {
        this.lovDocumentType = lovDocumentType;
    }

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
    }

    public void addAnnotation(Annotation newAnnotation) {

        boolean exists = false;
        for (Annotation annotation : this.getAnnotations())
        {
            if (annotation.getId().equals(newAnnotation.getId()))
            {
                exists = true;
                break;
            }
        }
        if (!exists) {
            this.annotations.add(newAnnotation);
            newAnnotation.setArtifact(this);
        }
    }

    public void removeAnnotation(Annotation newAnnotation) {
        boolean exists = false;
        for (Annotation annotation : this.getAnnotations())
        {
            if (annotation.getId().equals(newAnnotation.getId()))
            {
                exists = true;
                break;
            }
        }
        if (exists) {
            annotations.remove(newAnnotation);
            newAnnotation.setArtifact(null);
        }
    }
}
