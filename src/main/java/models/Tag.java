package main.java.models;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.domain.Persistable;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Robertson_Laptop on 12/4/2017.
 */
@Entity
@Table(name = "tag")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates

public class Tag implements Persistable {

    private String id;

    //note - a tag could be applied to an artifact, shape, connection, page
    @ManyToOne
    @JoinColumn(name = "lov_tag_type_id",
            foreignKey = @ForeignKey(name = "lov_tag_id_FK")
    )
    private Lov lovTagType;  //points to the lov entry for the type of tag
    private String tagValue;

    @ManyToOne
    @JoinColumn(name="diagram_id", foreignKey = @ForeignKey(name="diagram_id_fk"))
    private Diagram diagram;

    //private String shapeId;
    //private String connectionId;

    @ManyToOne
    @JoinColumn(name="artifact_id", foreignKey = @ForeignKey(name="artifact_id_fk"))
    private Artifact artifact;

    @ManyToOne
    @JoinColumn(name="shape_id", foreignKey = @ForeignKey(name="shape_id_fk"))
    private Shape shape;

    @ManyToOne
    @JoinColumn(name="shape_relationship_id", foreignKey = @ForeignKey(name="shape_relationship_id_fk"))
    private ShapeRelationship shapeRelationship;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date createdAt;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    private Date updatedAt;

    public Tag()
    {
    }

    @Override
    @Id
    public String getId() {
        return id;
    }

    public void setNew(boolean isNew) {};

    public void setId(String id) {
        this.id = id;
    }

    public Lov getLovTagType() {
        return lovTagType;
    }

    public void setLovTagType(Lov lovTagType) {
        this.lovTagType = lovTagType;
    }

    public String getTagValue() {
        return tagValue;
    }

    public void setTagValue(String tagValue) {
        this.tagValue = tagValue;
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

    @ManyToOne
    public Artifact getArtifact() {
        return artifact;
    }

    public void setArtifact(Artifact artifact) {
        this.artifact = artifact;
    }

    @ManyToOne
    public Diagram getDiagram () { return diagram;};

    public void setDiagram(Diagram diagram) {this.diagram = diagram;};

    @Override
    public boolean isNew() {
        return false;
    }

    public Shape getShape() {
        return shape;
    }

    public void setShape(Shape shape) {
        this.shape = shape;
    }

    public ShapeRelationship getShapeRelationship() {
        return shapeRelationship;
    }

    public void setShapeRelationship(ShapeRelationship shapeRelationship) {
        this.shapeRelationship = shapeRelationship;
    }
}
