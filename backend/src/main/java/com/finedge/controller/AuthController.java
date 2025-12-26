package com.finedge.controller;

import com.finedge.dto.LoginRequest;
import com.finedge.dto.RegisterRequest;
import com.finedge.dto.UserResponse;
import com.finedge.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, UserResponse>> register(@Valid @RequestBody RegisterRequest request, 
                                                              HttpServletRequest httpRequest) {
        UserResponse user = authService.register(request, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("user", user));
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, UserResponse>> login(@Valid @RequestBody LoginRequest request,
                                                             HttpServletRequest httpRequest) {
        UserResponse user = authService.login(request, httpRequest);
        return ResponseEntity.ok(Map.of("user", user));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest httpRequest) {
        authService.logout(httpRequest);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    @GetMapping("/me")
    public ResponseEntity<Map<String, UserResponse>> getCurrentUser() {
        UserResponse user = authService.getCurrentUser();
        return ResponseEntity.ok(Map.of("user", user));
    }
}

