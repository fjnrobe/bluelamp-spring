package main.java.repositories;

import main.java.models.LibraryLevel;
import main.java.models.Lov;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Robertson_Laptop on 12/4/2017.
 */
public interface LovRepository  extends JpaRepository<Lov, String> {

    public List<Lov> findByLovTable(String lovTable);

    public Lov findById(String id);
    public Lov findByLovTableAndShortNameAllIgnoreCase(String lovTable, String shortName);
    public Lov findByLovTableAndLongNameAllIgnoreCase(String lovTable, String longName);

}
