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
@Table(name = "lov")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates
public class Lov implements Persistable {

    private String id;
    private String lovTable;
    private String shortName;
    private String longName;

    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreatedDate
    private Date createdAt;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate
    private Date updatedAt;

    public Lov()
    {

    }

    @Id
    public String getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return false;
    }


    public void setNew(boolean isNew) {};
    public void setId(String id) {
        this.id = id;
    }

    public String getLovTable() {
        return lovTable;
    }

    public void setLovTable(String lovTable) {
        this.lovTable = lovTable;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getLongName() {
        return longName;
    }

    public void setLongName(String longName) {
        this.longName = longName;
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
}
