package main.java.configuration;

import main.java.models.UserSecurity;
import main.java.repositories.UserSecurityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication // same as @Configuration @EnableAutoConfiguration @ComponentScan
@EnableJpaAuditing  //enables auto maintenance of create/update date columns in models
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner init(final UserSecurityRepository UserSecurityRepository) {

        return new CommandLineRunner() {

            @Override
            public void run(String... arg0) throws Exception {
            //    UserSecurityRepository.save(new UserSecurity("jroberts", "J20180611!"));

            }
        };

    }

}
