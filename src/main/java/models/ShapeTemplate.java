package main.java.models;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Robertson_Laptop on 10/28/2018.
 */
@Entity
@Table(name = "shapeTemplate")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates

public class ShapeTemplate {

    @Id
    private String id;

    private String templateName;

    @ManyToOne
    @JoinColumn(name = "artifact_id", foreignKey =  @ForeignKey(name="artifact_id"))
    private Artifact artifact;
    private String shapeType;
    private String shapeText;
    private String drillDownPageId;

    @OneToMany(mappedBy = "shapeTemplate",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Tag> tags = new ArrayList<Tag>();

    @OneToMany(mappedBy = "shapeTemplate",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Annotation> annotations = new ArrayList<Annotation>();

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date createdAt;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    private Date updatedAt;

    public ShapeTemplate()
    {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Artifact getArtifact() {
        return artifact;
    }

    public void setArtifact(Artifact artifact) {
        this.artifact = artifact;
    }

    public String getShapeType() {
        return shapeType;
    }

    public void setShapeType(String shapeType) {
        this.shapeType = shapeType;
    }

    public String getShapeText() {
        return shapeText;
    }

    public void setShapeText(String shapeText) {
        this.shapeText = shapeText;
    }

    public String getDrillDownPageId() {
        return drillDownPageId;
    }

    public void setDrillDownPageId(String drillDownPageId) {
        this.drillDownPageId = drillDownPageId;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
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
            newTag.setShapeTemplate(this);
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
            oldTag.setShapeTemplate(null);
        }
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
            newAnnotation.setShapeTemplate(this);
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

        }
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }
}
