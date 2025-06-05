package com.coachingapp.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Utility class for generating and validating JWT tokens.
 */
@Component
public class JwtUtil {

    // Inject the secret and expiration from application.properties (or environment)
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-in-ms}")
    private long jwtExpirationInMs;

    /**
     * Generate a JWT token for the given subject (email).
     *
     * @param subject the subject (in our case, the user's email)
     * @return a signed JWT string
     */
    public String generateToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    /**
     * Extract the email (subject) from a JWT token.
     *
     * @param token the JWT string
     * @return the subject (email) inside the token, or null if parsing fails
     */
    public String getEmailFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.getSubject();
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * Validate the JWT token: check signature and expiration.
     *
     * @param authToken the JWT string
     * @return true if valid (signature matches, not expired), false otherwise
     */
    public boolean validateToken(String authToken) {
        try {
            // If parsing fails or token is expired, an exception will be thrown
            getAllClaimsFromToken(authToken);
            return true;
        } catch (ExpiredJwtException ex) {
            // Token has expired
            return false;
        } catch (Exception ex) {
            // Malformed or invalid signature
            return false;
        }
    }

    /**
     * Parse the token and return all claims. If the token is invalid or expired,
     * this will throw an exception (ExpiredJwtException, etc.).
     *
     * @param token the JWT string
     * @return the parsed Claims object
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
    }
}
