package com.Sistemclub.Backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class HashGenerator {

    @Bean
    CommandLineRunner gerarHash(PasswordEncoder encoder) {
        return args -> {
            String senha = "abrincadeir4";
            String hash = encoder.encode(senha); 
        };
    }
}