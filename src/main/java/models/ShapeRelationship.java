package main.java.models;

import main.java.dtos.AnnotationDto;
import main.java.dtos.LovDto;
import main.java.dtos.TagDto;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
@Entity
@Table(name = "relationship")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates

public class ShapeRelationship {
    @Id
    private String id;
    private String fromShapeId;
    private String toShapeId;

    @JoinColumn(name = "diagram_id",
            foreignKey = @ForeignKey(name = "diagram_id_fk")
    )
    private Diagram diagram;

    @ManyToOne
    @JoinColumn(name = "lov_document_type_id",
            foreignKey = @ForeignKey(name = "lov_document_type_id_FK")
    )
    private Lov lovRelationshipType;
    private int startXLocation;
    private int startYLocation;
    private int endXLocation;
    private int endYLocation;
    private String relationshipGraphicId;
    private String shapeText;
    @OneToMany(mappedBy = "relationship",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Tag> tags;
    @OneToMany(mappedBy = "relationship",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Annotation> annotations;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFromShapeId() {
        return fromShapeId;
    }

    public void setFromShapeId(String fromShapeId) {
        this.fromShapeId = fromShapeId;
    }

    public String getToShapeId() {
        return toShapeId;
    }

    public void setToShapeId(String toShapeId) {
        this.toShapeId = toShapeId;
    }

    public Lov getLovRelationshipType() {
        return lovRelationshipType;
    }

    public void setLovRelationshipType(Lov lovRelationshipType) {
        this.lovRelationshipType = lovRelationshipType;
    }

    public int getStartXLocation() {
        return startXLocation;
    }

    public void setStartXLocation(int startXLocation) {
        this.startXLocation = startXLocation;
    }

    public int getStartYLocation() {
        return startYLocation;
    }

    public void setStartYLocation(int startYLocation) {
        this.startYLocation = startYLocation;
    }

    public int getEndXLocation() {
        return endXLocation;
    }

    public void setEndXLocation(int endXLocation) {
        this.endXLocation = endXLocation;
    }

    public int getEndYLocation() {
        return endYLocation;
    }

    public void setEndYLocation(int endYLocation) {
        this.endYLocation = endYLocation;
    }

    public String getRelationshipGraphicId() {
        return relationshipGraphicId;
    }

    public void setRelationshipGraphicId(String relationshipGraphicId) {
        this.relationshipGraphicId = relationshipGraphicId;
    }

    public String getShapeText() {
        return shapeText;
    }

    public void setShapeText(String shapeText) {
        this.shapeText = shapeText;
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
            newTag.setShapeRelationship(this);
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
            oldTag.setShapeRelationship(null);
        }
    }

    public Diagram getDiagram() {
        return diagram;
    }

    public void setDiagram(Diagram diagram) {
        this.diagram = diagram;
    }
}
