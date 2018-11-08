package main.java.managers;

import main.java.dtos.ErrorDto;
import main.java.dtos.UserSecurityDto;
import main.java.models.UserRole;
import main.java.models.UserSecurity;
import main.java.repositories.UserSecurityRepository;
import main.java.utilities.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Robertson_Laptop on 9/7/2018.
 */
@Repository("securityManager")
public class SecurityManager {

    Logger logger = Logger.getLogger(SecurityManager.class);

    @Autowired
    UserSecurityRepository userSecurityRepository;

    public List<UserSecurityDto> getUserProfiles()
    {
        List<UserSecurityDto> userSecurityDtos = new ArrayList<UserSecurityDto>();

        List<UserSecurity> userSecurities =
                this.userSecurityRepository.findAll();

        for (UserSecurity userSecurity : userSecurities)
        {
            userSecurityDtos.add(this.mapModelToDto(userSecurity));
        }

        return userSecurityDtos;
    }

    public UserSecurityDto getUserProfile(String userName)
    {
        //the file dto that combines app info and security flags
        UserSecurityDto userSecurityDto = new UserSecurityDto();

        //get the application specific record
        UserSecurity userSecurity = this.userSecurityRepository.findByUserName(userName);
        if (userSecurity != null) {
            userSecurityDto = this.mapModelToDto(userSecurity);
        }

        return userSecurityDto;
    }

    private UserSecurityDto mapModelToDto(UserSecurity userSecurity)
    {
        UserSecurityDto userSecurityDto = new UserSecurityDto();

        userSecurityDto.setId(userSecurity.getId());
        userSecurityDto.setActivated(userSecurity.isEnabled());
        userSecurityDto.setUserName(userSecurity.getUserName());
        userSecurityDto.setFirstName(userSecurity.getFirstName());
        userSecurityDto.setLastName(userSecurity.getLastName());
        userSecurityDto.setEmail(userSecurity.getEmail());
        userSecurityDto.setPassword(userSecurity.getUserPassword());
        for (UserRole role : userSecurity.getUserRoles()) {
            if (role.getRoleName().equals("ADMIN")) {
                userSecurityDto.setAdministrator(true);
            }
            if (role.getRoleName().equals("EDITOR")) {
                userSecurityDto.setEditor(true);
            }
        }

        return userSecurityDto;
    }

    public UserSecurityDto getCurrentUserProfile()
    {
        //the file dto that combines app info and security flags
        UserSecurityDto userSecurityDto = null;

        //get the security role info use by Spring
        UserDetails userDetails = this.getCurrentUserInfo();

        if (userDetails != null) {
            userSecurityDto = this.getUserProfile(userDetails.getUsername());
            userSecurityDto.setLoggedIn(true);
        }
        //users are not required to login, so if not logged in, create a default
        //profile with no security
        else
        {
            userSecurityDto = new UserSecurityDto();
            userSecurityDto.setId(0);
            userSecurityDto.setUserName("");
            userSecurityDto.setFirstName("guest");
            userSecurityDto.setLastName("guest");
            userSecurityDto.setActivated(true);
            userSecurityDto.setEditor(false);
            userSecurityDto.setAdministrator(false);
            userSecurityDto.setLoggedIn(false);
        }

        return userSecurityDto;
    }

    //get the user security as stored by the spring security. As this app doesn't require
    //a user to log in to view only, it is possible thta the authentication won't exist.
    //For these cases, we return a new/empty userDetails
    public UserDetails getCurrentUserInfo()
    {
        UserDetails userDetails = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
             userDetails = (UserDetails)
                    authentication.getPrincipal();
        }

        return userDetails;
    }



    public List<ErrorDto> validateAndSaveUser(UserSecurityDto userSecurityDto)
    {
        List<ErrorDto> errorsDto = null;

        if (userSecurityDto.getId() == 0) {
            errorsDto = this.validateNewUser(userSecurityDto);
        }
        else
        {
            errorsDto = this.validateExistingUser(userSecurityDto);
        }

        if (errorsDto.size() == 0)
        {
            this.saveUser(userSecurityDto);
        }

        return errorsDto;
    }

    private List<ErrorDto> validateNewUser(UserSecurityDto userSecurityDto)
    {
        List<ErrorDto> errorsDto = new ArrayList<ErrorDto>();

        if (StringUtils.isEmpty(userSecurityDto.getFirstName()))
        {
            errorsDto.add(new ErrorDto("First Name is a required field"));
        }

        if (StringUtils.isEmpty(userSecurityDto.getLastName()))
        {
            errorsDto.add(new ErrorDto("Last Name is a required field"));
        }

        if (StringUtils.isEmpty(userSecurityDto.getUserName()))
        {
            errorsDto.add(new ErrorDto("User Name is a required field"));
        }

        if (StringUtils.isEmpty(userSecurityDto.getPassword()))
        {
            errorsDto.add(new ErrorDto("Password is a required field"));
        }

        if (errorsDto.size() == 0)
        {
            //make sure the user name is unique
            UserSecurity userSecurity =
                    this.userSecurityRepository.findByUserName(userSecurityDto.getUserName());

            if (userSecurity != null)
            {
                errorsDto.add(new ErrorDto("This User Name is already in use"));
            }
        }

        return errorsDto;
    }

    private List<ErrorDto> validateExistingUser(UserSecurityDto userSecurityDto)
    {
        List<ErrorDto> errorsDto = new ArrayList<ErrorDto>();

        if (StringUtils.isEmpty(userSecurityDto.getFirstName()))
        {
            errorsDto.add(new ErrorDto("First Name is a required field"));
        }

        if (StringUtils.isEmpty(userSecurityDto.getLastName()))
        {
            errorsDto.add(new ErrorDto("Last Name is a required field"));
        }

        if (StringUtils.isEmpty(userSecurityDto.getUserName()))
        {
            errorsDto.add(new ErrorDto("User Name is a required field"));
        }

        if (errorsDto.size() == 0)
        {
            //make sure the user name is unique
            UserSecurity userSecurity =
                    this.userSecurityRepository.findByUserName(userSecurityDto.getUserName());

            if ((userSecurity != null) && (userSecurity.getId() != userSecurityDto.getId()))
            {
                errorsDto.add(new ErrorDto("This User Name is already in use"));
            }
        }

        return errorsDto;
    }

    private void saveUser(UserSecurityDto userSecurityDto)
    {
        String userPassword = "";
        if (userSecurityDto.getId() != 0)
        {
            UserSecurity userSecurity =
                    this.userSecurityRepository.findById(userSecurityDto.getId());

            userPassword = userSecurity.getUserPassword();
            this.userSecurityRepository.delete(userSecurity);
        }
        else
        {
            userPassword = this.hashPassword(userSecurityDto.getPassword());
        }

        UserSecurity userSecurity = new UserSecurity();
        userSecurity.setUserName(userSecurityDto.getUserName());
        userSecurity.setFirstName(userSecurityDto.getFirstName());
        userSecurity.setLastName(userSecurityDto.getLastName());
        userSecurity.setUserName(userSecurityDto.getUserName());
        userSecurity.setUserPassword(userPassword);
        userSecurity.setEmail(userSecurityDto.getEmail());
        userSecurity.setEnabled(userSecurityDto.isActivated());

        if (userSecurityDto.isEditor()) {
            userSecurity.addUserRole(new UserRole("EDITOR"));
        }

        if (userSecurityDto.isAdministrator())
        {
            userSecurity.addUserRole(new UserRole("ADMIN"));
        }

        this.userSecurityRepository.save(userSecurity);

    }

    private String hashPassword(String unencryptedPassword)
    {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(unencryptedPassword);
    }
}
