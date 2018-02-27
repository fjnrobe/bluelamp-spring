package main.java.repositories;

import main.java.models.Shape;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public interface ShapeRepository extends JpaRepository<Shape, String> {

    public List<Shape> findByArtifactId(String artifactId);

}
