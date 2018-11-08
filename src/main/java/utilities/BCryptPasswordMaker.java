package main.java.utilities;
//
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
///**
// * Created by Robertson_Laptop on 7/24/2018.
// */
public class BCryptPasswordMaker {

    public static void main(String[] args)
    {
        String password = "87to16";
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

    }
}
