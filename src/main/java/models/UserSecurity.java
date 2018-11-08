package main.java.models;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "userSecurity")
@EntityListeners(AuditingEntityListener.class)  //enables auto maintenance of create/update dates
public class UserSecurity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;
    private String userName;
    private String userPassword;
    private String email;
    private String firstName;
    private String lastName;


    @OneToMany(mappedBy = "userSecurity",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<UserRole> userRoles = new ArrayList<UserRole>();

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    private boolean isEnabled;


    public UserSecurity()
    {

    }

    public UserSecurity(String userName, String userPassword)
    {
        this.userName = userName;
        this.userPassword = userPassword;
    }


    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

    public void addUserRole(UserRole userRole) {

        boolean exists = false;
        for (UserRole role : this.userRoles)
        {
            if (role.getRoleName().equals(userRole.getRoleName()))
            {
                exists = true;
                break;
            }
        }
        if (!exists) {
            this.userRoles.add(userRole);
            userRole.setUserSecurity(this);
        }
    }

    public void removeUserRole(UserRole userRole) {
        boolean exists = false;
        for (UserRole role : this.userRoles)
        {
            if (role.getId() == userRole.getId())
            {
                exists = true;
                break;
            }
        }
        if (exists) {
            userRoles.remove(userRole);
            userRole.setUserSecurity(null);
        }
    }

    public List<UserRole> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(List<UserRole> userRoles) {
        this.userRoles = userRoles;
    }
}
