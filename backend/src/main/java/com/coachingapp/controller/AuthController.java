// backend/src/main/java/com/coachingapp/controller/AuthController.java
package com.coachingapp.controller;

import com.coachingapp.model.User;
import com.coachingapp.payload.LoginRequest;
import com.coachingapp.payload.LoginResponse;
import com.coachingapp.repository.UserRepository;
import com.coachingapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // 1) Attempt to authenticate via email & password
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        // 2) If authentication succeeds, set security context (optional)
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3) Look up the User entity so we can get its ID
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            // This should not happen if your UserDetailsService is wired correctly,
            // but just in case:
            return ResponseEntity
                    .status(401)
                    .body("User not found");
        }

        User user = userOpt.get();
        Long userId = user.getId();

        // 4) Generate a JWT (your JwtUtil already creates a token with subject = email)
        String token = jwtUtil.generateToken(user.getEmail());

        // 5) Return both the token and the userId in the response body
        LoginResponse loginResponse = new LoginResponse(token, userId);
        return ResponseEntity.ok(loginResponse);
    }

    // Optional: You likely already have this endpoint that returns the “current user’s” info.
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = authentication.getName(); // subject from JWT
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        // Return just the ID and email (you can customize this DTO if you want)
        return ResponseEntity.ok(new LoginResponse(null, user.getId()));
    }
}
