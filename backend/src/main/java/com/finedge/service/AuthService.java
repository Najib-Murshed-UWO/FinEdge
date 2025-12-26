package com.finedge.service;

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
//import com.finedge.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
    private AuditService auditService;
    
    @Transactional
    public UserResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
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
        
        // Set session
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", user.getId());
        
        // Create audit log
        Map<String, Object> newValues = new HashMap<>();
        newValues.put("username", user.getUsername());
        newValues.put("role", user.getRole());
        auditService.createAuditLog(user.getId(), AuditAction.CREATE, "user", user.getId(), 
            null, newValues, httpRequest);
        
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
    
    public UserResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new CustomException("Invalid credentials", 401));
            
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Set session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("userId", user.getId());
            
            // Create audit log
            auditService.createAuditLog(user.getId(), AuditAction.LOGIN, "user", user.getId(), 
                null, null, httpRequest);
            
            return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        } catch (Exception e) {
            throw new CustomException("Invalid credentials", 401);
        }
    }
    
    public void logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            String userId = (String) session.getAttribute("userId");
            if (userId != null) {
                auditService.createAuditLog(userId, AuditAction.LOGOUT, "user", userId, 
                    null, null, httpRequest);
            }
            session.invalidate();
        }
    }
    
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
        
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }
}

