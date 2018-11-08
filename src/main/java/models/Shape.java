package main.java.models;

import main.java.dtos.AnnotationDto;
import main.java.dtos.ArtifactDto;
import main.java.dtos.TagDto;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
@Entity
@Table(name = "shape")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates

public class Shape {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "diagram_id",
            foreignKey = @ForeignKey(name = "diagram_id_fk")
    )
    private Diagram diagram;

    private String sequenceNumber;
    @ManyToOne
    @JoinColumn(name = "artifact_id", foreignKey =  @ForeignKey(name="artifact_id"))
    private Artifact artifact;
    private String shapeType;
    private int radius;
    private int width;
    private int height;
    private int centerX;
    private int centerY;
    private String shapeText;
    private String drillDownPageId;

    private String templateId;

    @OneToMany(mappedBy = "shape",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Tag> tags = new ArrayList<Tag>();

    @OneToMany(mappedBy = "shape",
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

    public Shape()
    {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(String sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
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

    public int getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getCenterX() {
        return centerX;
    }

    public void setCenterX(int centerX) {
        this.centerX = centerX;
    }

    public int getCenterY() {
        return centerY;
    }

    public void setCenterY(int centerY) {
        this.centerY = centerY;
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
            newTag.setShape(this);
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
            oldTag.setShape(null);
        }
    }

    public Diagram getDiagram() {
        return diagram;
    }

    public void setDiagram(Diagram diagram) {
        this.diagram = diagram;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
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
            newAnnotation.setShape(this);
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
            newAnnotation.setDiagram(null);
        }
    }
}
