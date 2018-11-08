package main.java.managers;

import main.java.dtos.UserSecurityDto;
import main.java.models.UserRole;
import main.java.models.UserSecurity;
import main.java.repositories.UserSecurityRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Robertson_Laptop on 7/15/2018.
 */
@Service
public class SecurityService implements UserDetailsService {



    @Autowired
    UserSecurityRepository userSecurityRepository;



    @Transactional
    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {

        User newUser = null;

        UserSecurity user = this.userSecurityRepository.findByUserName(s);
        if (user != null)
        {
            List<GrantedAuthority> authorities =
                    this.buildUserAuthority(user.getUserRoles());

            newUser = this.buildUserForAuthentication(user, authorities);
        }

        return newUser;
    }

    /**
     * convert application's user role into into the spring GrantedAuthority model
     * @param userRoles - list of userRoles as stored in application db
     * @return - Spring's security model for roles
     */
    private List<GrantedAuthority> buildUserAuthority(List<UserRole> userRoles) {

        Set<GrantedAuthority> setAuths = new HashSet<GrantedAuthority>();

        // Build user's authorities
        for (UserRole userRole : userRoles) {
            setAuths.add(new SimpleGrantedAuthority(userRole.getRoleName()));
        }

        List<GrantedAuthority> result = new ArrayList<GrantedAuthority>(setAuths);

        return result;
    }

    // Converts application userSecurity to
    // org.springframework.security.core.userdetails.User
    private User buildUserForAuthentication(UserSecurity user,
                                            List<GrantedAuthority> authorities) {
        return new User(user.getUserName(), user.getUserPassword(),
                user.isEnabled(), true, true, true, authorities);
    }

}
