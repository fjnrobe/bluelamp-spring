package main.java.configuration;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication // same as @Configuration @EnableAutoConfiguration @ComponentScan
@EnableJpaAuditing  //enables auto maintenance of create/update date columns in models
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
