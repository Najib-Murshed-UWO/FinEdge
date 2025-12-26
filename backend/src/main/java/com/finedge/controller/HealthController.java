package com.finedge.controller;

import com.finedge.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @Autowired
    private HealthService healthService;
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(healthService.healthCheck());
    }
    
    @GetMapping("/ready")
    public ResponseEntity<Map<String, Boolean>> readinessCheck() {
        return ResponseEntity.ok(healthService.readinessCheck());
    }
    
    @GetMapping("/live")
    public ResponseEntity<Map<String, Boolean>> livenessCheck() {
        return ResponseEntity.ok(healthService.livenessCheck());
    }
}

