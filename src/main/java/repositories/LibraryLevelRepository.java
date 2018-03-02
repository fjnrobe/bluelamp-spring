package main.java.repositories;



import main.java.models.LibraryLevel;
import org.apache.tomcat.jni.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Robertson_Laptop on 11/24/2017.
 */
public interface LibraryLevelRepository extends JpaRepository<LibraryLevel, String> {

   public LibraryLevel findById(String id);

   public List<LibraryLevel> findByParentLibraryId(String parentLibraryId);

   public List<LibraryLevel> deleteByParentLibraryId(String parentLibraryId);

}
