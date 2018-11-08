package main.java.repositories;

import main.java.models.LibraryLevel;
import main.java.models.UserSecurity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSecurityRepository extends JpaRepository<UserSecurity, String> {

    public UserSecurity findByUserName( String userName);
    public UserSecurity findById( int userId);

}