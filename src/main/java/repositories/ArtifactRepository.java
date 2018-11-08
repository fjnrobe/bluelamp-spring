package main.java.repositories;

import main.java.models.Artifact;
import main.java.models.LibraryLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import main.java.common.Queries;
import java.util.List;

import static main.java.common.Queries.*;


/**
 * Created by Robertson_Laptop on 12/11/2017.
 */
public interface ArtifactRepository extends JpaRepository<Artifact, String> {

    public List<Artifact> findByLibraryLevel(LibraryLevel libraryLevel);
    public Artifact findById(String id);

    @Modifying
    @Query(value = "update artifact set library_id = ?2 where library_id = ?1",
            nativeQuery =true)
    public int updateLibraryId(String oldLibraryId, String newLibraryId);

    @Query(value = "SELECT ar.* " +
            "FROM PUBLIC.ANNOTATION a " +
            " inner join artifact ar " +
            " on a.artifact_id = ar.id " +
            " WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(?1) " +
            " union " +
            " SELECT ar.* " +
            " FROM PUBLIC.TAG t " +
            " inner join artifact ar " +
            " on t.artifact_id = ar.id " +
            " WHERE to_tsvector(t.tagvalue) @@ to_tsquery(?1) " +
            " UNION " +
            " select ar.* " +
            " FROM artifact ar " +
            " WHERE to_tsvector(ar.abbreviation || ' ' || " +
            "                   ar.detailedtext || ' ' || " +
            "                   ar.documenttitle) @@ to_tsquery(?1) ",
            nativeQuery = true)
    public List<Artifact> findBySearchText(String searchText);
}
