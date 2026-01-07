package com.finedge.controller;

import com.finedge.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, Object>> getCustomerAnalytics() {
        return ResponseEntity.ok(analyticsService.getCustomerAnalytics());
    }
    
    @GetMapping("/banker")
    @PreAuthorize("hasAnyRole('BANKER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getBankerAnalytics() {
        return ResponseEntity.ok(analyticsService.getBankerAnalytics());
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminAnalytics());
    }
}

