package main.java.repositories;

import main.java.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Robertson_Laptop on 7/21/2018.
 */
public interface UserRoleRepository extends JpaRepository<UserRole, String> {

    public List<UserRole> findById(int id);
}
