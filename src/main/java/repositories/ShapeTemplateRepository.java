package main.java.repositories;


import main.java.models.Shape;
import main.java.models.ShapeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public interface ShapeTemplateRepository extends JpaRepository<ShapeTemplate, String> {
    public ShapeTemplate findById(String id);
    public ShapeTemplate findByTemplateName(String name);
    public List<ShapeTemplate> findByArtifactId(String artifactId);
}
