package main.java.models;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

/**
 * Created by Robertson_Laptop on 7/21/2018.
 */
@Entity
@Table(name = "userRole")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates

public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;
    private String roleName;

    @ManyToOne
    @JoinColumn(name="userSecurity_id")
    public UserSecurity userSecurity;

    public UserRole()
    {

    }

    public UserRole(String roleName)
    {
        this.roleName = roleName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public UserSecurity getUserSecurity() {
        return userSecurity;
    }

    public void setUserSecurity(UserSecurity userSecurity) {
        this.userSecurity = userSecurity;
    }
}
