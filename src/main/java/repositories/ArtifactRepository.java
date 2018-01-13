package main.java.repositories;

import main.java.models.Artifact;
import main.java.models.LibraryLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Robertson_Laptop on 12/11/2017.
 */
public interface ArtifactRepository extends JpaRepository<Artifact, String> {

    public List<Artifact> findByLibraryLevel(LibraryLevel libraryLevel);
    public Artifact findById(String id);
}
