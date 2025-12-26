package com.finedge.controller;

import com.finedge.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
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
        // Implementation for banker analytics
        return ResponseEntity.ok(Map.of(
            "pendingApplications", 0,
            "totalCustomers", 0,
            "recentActivity", Map.of()
        ));
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminAnalytics() {
        // Implementation for admin analytics
        return ResponseEntity.ok(Map.of(
            "totalCustomers", 0,
            "recentAuditLogs", List.of(),
            "systemHealth", Map.of("status", "operational", "uptime", 0)
        ));
    }
}

