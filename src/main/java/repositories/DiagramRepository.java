package main.java.repositories;

import main.java.interfaces.ImodelId;
import main.java.models.Artifact;
import main.java.models.Diagram;
import main.java.models.LibraryLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
public interface DiagramRepository extends JpaRepository<Diagram, String> {
    public Diagram findById(String id);
    public List<Diagram> findByLibraryLevel(LibraryLevel libraryLevel);
    public Diagram findByPageTitleIgnoreCase(String title);
    public List<Diagram> findByArtifactId(String artifactId);

    @Modifying
    @Query(value = "update diagram set library_id = ?2 where library_id = ?1",
            nativeQuery =true)
    public int updateLibraryId(String oldLibraryId, String newLibraryId);

//    @Query(value = "SELECT d.id  " +
//            "FROM PUBLIC.ANNOTATION a  " +
//            "INNER JOIN relationship r  " +
//            "ON a.relationship_id = r.id  " +
//            "inner join diagram d " +
//            "on r.diagram_id= d.id " +
//            "WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(?1) " +
//            "union " +
//            "SELECT d.id  " +
//            "FROM PUBLIC.ANNOTATION a " +
//            "INNER JOIN shape s " +
//            "ON a.shape_id = s.id " +
//            "inner join diagram d " +
//            "on s.diagram_id= d.id " +
//            "WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(?1) " +
//            "UNION " +
//            "SELECT d.id  " +
//            "FROM PUBLIC.ANNOTATION a " +
//            "inner join diagram d " +
//            "on a.diagram_id= d.id " +
//            "WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(?1) " +
//            "UNION " +
//            "SELECT d.id  " +
//            "FROM PUBLIC.TAG t " +
//            "INNER JOIN relationship r " +
//            "ON t.shape_relationship_id = r.id " +
//            "inner join diagram d " +
//            "on r.diagram_id= d.id " +
//            "WHERE to_tsvector(t.tagvalue ) @@ to_tsquery(?1) " +
//            "union " +
//            "SELECT d.id  " +
//            "FROM PUBLIC.TAG t " +
//            "INNER JOIN shape s " +
//            "ON t.shape_id = s.id " +
//            "inner join diagram d " +
//            "on s.diagram_id= d.id " +
//            "WHERE to_tsvector(t.tagvalue) @@ to_tsquery(?1) " +
//            "UNION " +
//            "SELECT d.id  " +
//            "FROM PUBLIC.TAG t " +
//            "inner join diagram d " +
//            "on t.diagram_id= d.id " +
//            "WHERE to_tsvector(t.tagvalue ) @@ to_tsquery(?1) " +
//            "UNION " +
//            "SELECT d.id  " +
//            "FROM shape s " +
//            "inner join diagram d " +
//            "on s.diagram_id= d.id " +
//            "WHERE to_tsvector(s.shapetext ) @@ to_tsquery(?1) " +
//            "UNION " +
//            "SELECT d.id  " +
//            "FROM relationship r " +
//            "inner join diagram d " +
//            "on r.diagram_id= d.id " +
//            "WHERE to_tsvector(r.shapetext ) @@ to_tsquery(?1) " +
//            "UNION " +
//            "SELECT d.id  " +
//            "FROM  diagram d " +
//            "WHERE to_tsvector(d.pagetitle || ' ' || d.pagedescription ) @@ to_tsquery(?1) "
//            ,
//           nativeQuery = true)
//    public List<ImodelId> findBySearchText(String searchText);
}
