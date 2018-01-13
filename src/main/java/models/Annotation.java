package main.java.models;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

/**
 * Created by Robertson_Laptop on 1/11/2018.
 */
@Entity
@Table(name = "annotation")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates
public class Annotation {
    @Id
    private String id;

    private String annotationText;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAnnotationText() {
        return annotationText;
    }

    public void setAnnotationText(String annotationText) {
        this.annotationText = annotationText;
    }

    @ManyToOne
    @JoinColumn(name="diagram_id", foreignKey = @ForeignKey(name="diagram_id_fk"))
    private Diagram diagram;

    @ManyToOne
    @JoinColumn(name="shape_id", foreignKey = @ForeignKey(name="shape_id_fk"))
    private Shape shape;

}
