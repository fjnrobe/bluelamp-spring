package main.java.repositories;

import main.java.models.Artifact;
import main.java.models.Diagram;
import main.java.models.LibraryLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
public interface DiagramRepository extends JpaRepository<Diagram, String> {
    public Diagram findById(String id);
    public List<Diagram> findByLibraryLevel(LibraryLevel libraryLevel);
}
