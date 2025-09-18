package com.agrisync.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for testing
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/register", "/api/users/login",
                "/api/users/verify-otp",
                "/api/users/forgot-password",
                "/api/users/reset-password").permitAll() // public endpoints
                .anyRequest().authenticated() // all others require authentication
            )
            .httpBasic(customizer -> {}); // basic auth for testing
        return http.build();
    }
}
