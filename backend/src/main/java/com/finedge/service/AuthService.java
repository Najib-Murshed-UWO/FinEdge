package com.finedge.service;

import com.finedge.dto.JwtAuthResponse;
import com.finedge.dto.LoginRequest;
import com.finedge.dto.RegisterRequest;
import com.finedge.dto.UserResponse;
import com.finedge.exception.CustomException;
import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.model.enums.AuditAction;
import com.finedge.model.enums.UserRole;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.UserRepository;
import com.finedge.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private AuditService auditService;
    
    @Transactional
    public JwtAuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException("User already exists", 400);
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already exists", 400);
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.CUSTOMER);
        user.setIsActive(true);
        user.setLastLogin(LocalDateTime.now());
        user = userRepository.save(user);
        
        // Create customer profile if role is customer
        if (user.getRole() == UserRole.CUSTOMER) {
            Customer customer = new Customer();
            customer.setUser(user);
            customer.setFullName(request.getFullName() != null ? request.getFullName() : "");
            customer.setPhone(request.getPhone());
            customer.setAddress(request.getAddress());
            customerRepository.save(customer);
        }
        
        // Authenticate user to generate JWT token
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate JWT tokens
        String accessToken = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        
        // Create audit log
        Map<String, Object> newValues = new HashMap<>();
        newValues.put("username", user.getUsername());
        newValues.put("role", user.getRole());
        auditService.createAuditLog(user.getId(), AuditAction.CREATE, "user", user.getId(), 
            null, newValues, httpRequest);
        
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return new JwtAuthResponse(accessToken, refreshToken, "Bearer", userResponse);
    }
    
    public JwtAuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new CustomException("Invalid credentials", 401));
            
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT tokens
            String accessToken = jwtTokenProvider.generateToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
            
            // Create audit log
            auditService.createAuditLog(user.getId(), AuditAction.LOGIN, "user", user.getId(), 
                null, null, httpRequest);
            
            UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
            return new JwtAuthResponse(accessToken, refreshToken, "Bearer", userResponse);
        } catch (Exception e) {
            throw new CustomException("Invalid credentials", 401);
        }
    }
    
    public JwtAuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException("Invalid refresh token", 401);
        }
        
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
        
        if (!user.getIsActive()) {
            throw new CustomException("User account is inactive", 403);
        }
        
        // Create new authentication
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            user.getUsername(), null, 
            org.springframework.security.core.authority.AuthorityUtils.createAuthorityList("ROLE_" + user.getRole().name())
        );
        
        // Generate new tokens
        String newAccessToken = jwtTokenProvider.generateToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return new JwtAuthResponse(newAccessToken, newRefreshToken, "Bearer", userResponse);
    }
    
    public void logout(HttpServletRequest httpRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                auditService.createAuditLog(user.getId(), AuditAction.LOGOUT, "user", user.getId(), 
                    null, null, httpRequest);
            }
        }
        SecurityContextHolder.clearContext();
    }
    
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
        
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
}

