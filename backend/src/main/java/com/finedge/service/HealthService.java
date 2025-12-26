package com.finedge.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class HealthService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        try {
            jdbcTemplate.execute("SELECT 1");
            response.put("status", "healthy");
            response.put("timestamp", java.time.Instant.now().toString());
            response.put("uptime", java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime());
            response.put("services", Map.of(
                "database", "connected",
                "api", "operational"
            ));
        } catch (Exception e) {
            response.put("status", "unhealthy");
            response.put("timestamp", java.time.Instant.now().toString());
            response.put("services", Map.of(
                "database", "disconnected",
                "api", "operational"
            ));
        }
        return response;
    }
    
    public Map<String, Boolean> readinessCheck() {
        Map<String, Boolean> response = new HashMap<>();
        try {
            jdbcTemplate.execute("SELECT 1");
            response.put("ready", true);
        } catch (Exception e) {
            response.put("ready", false);
        }
        return response;
    }
    
    public Map<String, Boolean> livenessCheck() {
        return Map.of("alive", true);
    }
}

