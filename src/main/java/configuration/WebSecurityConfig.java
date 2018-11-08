package main.java.configuration;

import main.java.common.URLConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import main.java.managers.SecurityService;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    //this bean the configureGlobal override are needed to hock in the SecurityManage for login lookup
    @Bean
    public UserDetailsService userDetailsService() {
        return new SecurityService();
    };

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService()).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/css/**").permitAll()       //without this, the page that opened after the login had the css only
                .antMatchers("/scripts/**").permitAll()  //without this, the page that opened after the login had the css only
                .anyRequest().authenticated()
                .and()
                .csrf().disable() //without this line I got a 405 on the postback
                .formLogin()
                .loginPage(URLConstants.LOGIN)
                .permitAll()
                .loginProcessingUrl("/loginProc")  //this url is not configured - the security framework processes
                .usernameParameter("fldUserName")
                .passwordParameter("fldPassword")
                .defaultSuccessUrl(URLConstants.HOME)
                .and()
                .logout()
                .permitAll();

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder;
    }

}
