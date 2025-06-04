package com.coachingapp.security;

import com.coachingapp.service.JpaUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JpaUserDetailsService userDetailsService;

    @Value("${cors.allowedOrigins}")
    private String corsAllowedOrigins;

    /**
     * 1) PasswordEncoder bean: we use BCrypt to hash and verify passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 2) Build an AuthenticationManager that knows how to look up a user
     *    via our JpaUserDetailsService + BCryptPasswordEncoder.
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http
                .getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    /**
     * 3) Define a global CORS policy to allow our React app (e.g. http://localhost:3000).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow origins from the comma‐separated property (application.properties)
        List<String> origins = List.of(corsAllowedOrigins.split(","));
        config.setAllowedOrigins(origins);

        // Allow these HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow any header (or list specific headers as needed)
        config.setAllowedHeaders(List.of("*"));

        // If you ever send cookies or include Authorization header, enable credentials
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this CORS config to ALL endpoints (/**)
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * 4) The SecurityFilterChain: enable CORS, disable CSRF, permit specific endpoints,
     *    require authentication on everything else, and insert our JwtAuthenticationFilter.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                // A) Enable Spring’s built‐in CORS filter (uses corsConfigurationSource() above)
                .cors().and()

                // B) Disable CSRF (because we use stateless JWTs, not server‐side sessions)
                .csrf().disable()

                // C) Make it stateless; no HTTP session will be created or used by Spring Security
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()

                // D) Configure URL‐based authorization
                .authorizeHttpRequests()
                // 1) Always allow any OPTIONS request (CORS preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 2) Allow unauthenticated access to /api/auth/login and /api/auth/register
                //    (client calls these to obtain a JWT in the first place)
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                // 3) Require authentication (valid JWT) for any other /api/auth/**, including /api/auth/me
                .requestMatchers("/api/auth/**").authenticated()

                // 4) Require authentication for all other /api/** endpoints
                .requestMatchers("/api/**").authenticated()
                .and()

                // E) Hook our custom AuthenticationManager from above
                .authenticationManager(authenticationManager(http))

                // F) Insert our JwtAuthenticationFilter BEFORE Spring’s UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
