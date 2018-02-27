package main.java.repositories;

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
}
