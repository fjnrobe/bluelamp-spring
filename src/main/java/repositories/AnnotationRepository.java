package main.java.repositories;

import main.java.models.Annotation;
import main.java.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by Robertson_Laptop on 12/4/2017.
 */
public interface AnnotationRepository extends JpaRepository<Annotation, String> {


}
