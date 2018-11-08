package main.java.repositories;

import main.java.models.Shape;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public interface ShapeRepository extends JpaRepository<Shape, String> {

    public List<Shape> findByArtifactId(String artifactId);
    public List<Shape> findByDrillDownPageId(String drillDownPageId);

    @Modifying
    @Query(value = "update shape set drilldownpageid = -1 where drilldownpageid = ?1",
            nativeQuery =true)
    public void removeDrillDownPageId(String pageId);
}
