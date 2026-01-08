package com.finedge.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtTokenProviderTest {
    
    @InjectMocks
    private JwtTokenProvider jwtTokenProvider;
    
    private static final String TEST_SECRET = "testSecretKeyThatIsAtLeast256BitsLongForHS512AlgorithmToWorkProperly12345678901234567890";
    private static final long TEST_EXPIRATION = 3600000; // 1 hour
    private static final long TEST_REFRESH_EXPIRATION = 604800000; // 7 days
    
    private Authentication authentication;
    
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpiration", TEST_EXPIRATION);
        ReflectionTestUtils.setField(jwtTokenProvider, "refreshExpiration", TEST_REFRESH_EXPIRATION);
        
        UserDetails userDetails = User.builder()
            .username("testuser")
            .password("password")
            .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")))
            .build();
        
        authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities()
        );
    }
    
    @Test
    void testGenerateToken_Success() {
        // Act
        String token = jwtTokenProvider.generateToken(authentication);
        
        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }
    
    @Test
    void testGenerateRefreshToken_Success() {
        // Act
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        
        // Assert
        assertNotNull(refreshToken);
        assertFalse(refreshToken.isEmpty());
    }
    
    @Test
    void testGetUsernameFromToken_Success() {
        // Arrange
        String token = jwtTokenProvider.generateToken(authentication);
        
        // Act
        String username = jwtTokenProvider.getUsernameFromToken(token);
        
        // Assert
        assertEquals("testuser", username);
    }
    
    @Test
    void testGetExpirationDateFromToken_Success() {
        // Arrange
        String token = jwtTokenProvider.generateToken(authentication);
        
        // Act
        Date expiration = jwtTokenProvider.getExpirationDateFromToken(token);
        
        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }
    
    @Test
    void testValidateToken_ValidToken() {
        // Arrange
        String token = jwtTokenProvider.generateToken(authentication);
        
        // Act
        Boolean isValid = jwtTokenProvider.validateToken(token);
        
        // Assert
        assertTrue(isValid);
    }
    
    @Test
    void testValidateToken_InvalidToken() {
        // Arrange
        String invalidToken = "invalid.token.here";
        
        // Act
        Boolean isValid = jwtTokenProvider.validateToken(invalidToken);
        
        // Assert
        assertFalse(isValid);
    }
    
    @Test
    void testValidateToken_WithUserDetails_Success() {
        // Arrange
        String token = jwtTokenProvider.generateToken(authentication);
        UserDetails userDetails = User.builder()
            .username("testuser")
            .password("password")
            .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")))
            .build();
        
        // Act
        Boolean isValid = jwtTokenProvider.validateToken(token, userDetails);
        
        // Assert
        assertTrue(isValid);
    }
    
    @Test
    void testValidateToken_WithUserDetails_WrongUsername() {
        // Arrange
        String token = jwtTokenProvider.generateToken(authentication);
        UserDetails userDetails = User.builder()
            .username("wronguser")
            .password("password")
            .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")))
            .build();
        
        // Act
        Boolean isValid = jwtTokenProvider.validateToken(token, userDetails);
        
        // Assert
        assertFalse(isValid);
    }
    
    @Test
    void testGetAuthoritiesFromToken_Success() {
        // Arrange
        String token = jwtTokenProvider.generateToken(authentication);
        
        // Act
        String authorities = jwtTokenProvider.getAuthoritiesFromToken(token);
        
        // Assert
        assertNotNull(authorities);
        assertTrue(authorities.contains("ROLE_CUSTOMER"));
    }
    
    @Test
    void testTokenExpiration() throws InterruptedException {
        // Arrange - Set very short expiration
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpiration", 100); // 100ms
        
        String token = jwtTokenProvider.generateToken(authentication);
        
        // Wait for token to expire
        Thread.sleep(200);
        
        // Act
        Boolean isValid = jwtTokenProvider.validateToken(token);
        
        // Assert
        assertFalse(isValid);
    }
}

