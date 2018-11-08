package main.java.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by Robertson_Laptop on 7/15/2018.
 */
public class UserSecurityDto {

    private int id;
    @NotNull
    @Size(min=2, max=15)
    private String userName = "";
    @NotNull
    @Size(min=2, max=15)
    private String password = "";
    @NotNull
    @Size(min=2, max=40)
    private String firstName = "";
    @NotNull
    @Size(min=2, max=40)
    private String lastName = "";
    @NotNull
    @Size(min=2, max=80)
    private String email = "";
    private boolean isEditor = false;
    private boolean isAdministrator = false ;
    private boolean isActivated = true;
    private boolean isLoggedIn = false;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEditor() {
        return isEditor;
    }

    public void setEditor(boolean editor) {
        isEditor = editor;
    }

    public boolean isAdministrator() {
        return isAdministrator;
    }

    public void setAdministrator(boolean administrator) {
        isAdministrator = administrator;
    }

    public boolean isActivated() {
        return isActivated;
    }

    public void setActivated(boolean activated) {
        isActivated = activated;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isLoggedIn() {
        return isLoggedIn;
    }

    public void setLoggedIn(boolean loggedIn) {
        isLoggedIn = loggedIn;
    }
}
