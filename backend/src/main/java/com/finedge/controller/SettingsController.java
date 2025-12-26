package com.finedge.controller;

import com.finedge.dto.ContactInfoRequest;
import com.finedge.dto.PersonalDetailsRequest;
import com.finedge.dto.SettingsRequest;
import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.model.UserSettings;
import com.finedge.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    
    @Autowired
    private SettingsService settingsService;
    
    @PutMapping("/personal-details")
    public ResponseEntity<Map<String, Customer>> updatePersonalDetails(@Valid @RequestBody PersonalDetailsRequest request) {
        Customer customer = settingsService.updatePersonalDetails(request);
        return ResponseEntity.ok(Map.of("customer", customer));
    }
    
    @PutMapping("/contact-info")
    public ResponseEntity<Map<String, User>> updateContactInfo(@Valid @RequestBody ContactInfoRequest request) {
        User user = settingsService.updateContactInfo(request);
        return ResponseEntity.ok(Map.of("user", user));
    }
    
    @GetMapping
    public ResponseEntity<Map<String, UserSettings>> getSettings() {
        UserSettings settings = settingsService.getSettings();
        return ResponseEntity.ok(Map.of("settings", settings));
    }
    
    @PutMapping
    public ResponseEntity<Map<String, UserSettings>> updateSettings(@Valid @RequestBody SettingsRequest request) {
        UserSettings settings = settingsService.updateSettings(request);
        return ResponseEntity.ok(Map.of("settings", settings));
    }
}

