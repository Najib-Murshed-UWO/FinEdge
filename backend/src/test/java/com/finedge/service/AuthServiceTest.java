package com.finedge.service;

import com.finedge.dto.JwtAuthResponse;
import com.finedge.dto.LoginRequest;
import com.finedge.dto.RegisterRequest;
import com.finedge.dto.UserResponse;
import com.finedge.exception.CustomException;
import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.model.enums.UserRole;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.UserRepository;
import com.finedge.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private CustomerRepository customerRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    
    @Mock
    private AuditService auditService;
    
    @Mock
    private HttpServletRequest httpRequest;
    
    @InjectMocks
    private AuthService authService;
    
    private User testUser;
    private Customer testCustomer;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    
    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        
        testUser = new User();
        testUser.setId("user-123");
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(UserRole.CUSTOMER);
        testUser.setIsActive(true);
        testUser.setLastLogin(LocalDateTime.now());
        
        testCustomer = new Customer();
        testCustomer.setId("customer-123");
        testCustomer.setUser(testUser);
        testCustomer.setFullName("Test User");
        
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");
        registerRequest.setPhone("1234567890");
        registerRequest.setAddress("123 Test St");
        
        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");
    }
    
    @Test
    void testRegister_Success() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        Authentication auth = new UsernamePasswordAuthenticationToken(
            testUser, "password123",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtTokenProvider.generateToken(any())).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken(any())).thenReturn("refreshToken");
        when(customerRepository.save(any(Customer.class))).thenReturn(testCustomer);
        
        // Act
        JwtAuthResponse response = authService.register(registerRequest, httpRequest);
        
        // Assert
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertNotNull(response.getUser());
        assertEquals("testuser", response.getUser().getUsername());
        
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(customerRepository).save(any(Customer.class));
        verify(auditService).createAuditLog(anyString(), any(), anyString(), anyString(), any(), any(), any());
    }
    
    @Test
    void testRegister_UsernameExists() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            authService.register(registerRequest, httpRequest);
        });
        
        assertEquals("User already exists", exception.getMessage());
        assertEquals(400, exception.getStatusCode());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void testRegister_EmailExists() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            authService.register(registerRequest, httpRequest);
        });
        
        assertEquals("Email already exists", exception.getMessage());
        assertEquals(400, exception.getStatusCode());
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void testLogin_Success() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken(
            testUser, "password123",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(any())).thenReturn("accessToken");
        when(jwtTokenProvider.generateRefreshToken(any())).thenReturn("refreshToken");
        
        // Act
        JwtAuthResponse response = authService.login(loginRequest, httpRequest);
        
        // Assert
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertNotNull(response.getUser());
        
        verify(authenticationManager).authenticate(any());
        verify(userRepository).findByUsername("testuser");
        verify(userRepository).save(any(User.class));
        verify(jwtTokenProvider).generateToken(any());
        verify(auditService).createAuditLog(anyString(), any(), anyString(), anyString(), any(), any(), any());
    }
    
    @Test
    void testLogin_InvalidCredentials() {
        // Arrange
        when(authenticationManager.authenticate(any())).thenThrow(new org.springframework.security.authentication.BadCredentialsException("Bad credentials"));
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            authService.login(loginRequest, httpRequest);
        });
        
        assertEquals("Invalid credentials", exception.getMessage());
        assertEquals(401, exception.getStatusCode());
    }
    
    @Test
    void testRefreshToken_Success() {
        // Arrange
        String refreshToken = "validRefreshToken";
        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromToken(refreshToken)).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        Authentication auth = new UsernamePasswordAuthenticationToken(
            testUser, null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        when(jwtTokenProvider.generateToken(any())).thenReturn("newAccessToken");
        when(jwtTokenProvider.generateRefreshToken(any())).thenReturn("newRefreshToken");
        
        // Act
        JwtAuthResponse response = authService.refreshToken(refreshToken);
        
        // Assert
        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("newRefreshToken", response.getRefreshToken());
        
        verify(jwtTokenProvider).validateToken(refreshToken);
        verify(jwtTokenProvider).getUsernameFromToken(refreshToken);
        verify(userRepository).findByUsername("testuser");
    }
    
    @Test
    void testRefreshToken_InvalidToken() {
        // Arrange
        String refreshToken = "invalidToken";
        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(false);
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            authService.refreshToken(refreshToken);
        });
        
        assertEquals("Invalid refresh token", exception.getMessage());
        assertEquals(401, exception.getStatusCode());
    }
    
    @Test
    void testRefreshToken_InactiveUser() {
        // Arrange
        String refreshToken = "validRefreshToken";
        testUser.setIsActive(false);
        when(jwtTokenProvider.validateToken(refreshToken)).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromToken(refreshToken)).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            authService.refreshToken(refreshToken);
        });
        
        assertEquals("User account is inactive", exception.getMessage());
        assertEquals(403, exception.getStatusCode());
    }
    
    @Test
    void testLogout() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken(
            "testuser", null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        // Act
        authService.logout(httpRequest);
        
        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(auditService).createAuditLog(anyString(), any(), anyString(), anyString(), any(), any(), any());
    }
    
    @Test
    void testGetCurrentUser_Success() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken(
            "testuser", null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        // Act
        UserResponse response = authService.getCurrentUser();
        
        // Assert
        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals(UserRole.CUSTOMER, response.getRole());
    }
    
    @Test
    void testGetCurrentUser_NotFound() {
        // Arrange
        Authentication auth = new UsernamePasswordAuthenticationToken(
            "testuser", null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            authService.getCurrentUser();
        });
        
        assertEquals("User not found", exception.getMessage());
        assertEquals(404, exception.getStatusCode());
    }
}

