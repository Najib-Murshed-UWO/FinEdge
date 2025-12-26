package com.finedge.service;

import com.finedge.dto.ContactInfoRequest;
import com.finedge.dto.PersonalDetailsRequest;
import com.finedge.dto.SettingsRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.model.UserSettings;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.UserRepository;
import com.finedge.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class SettingsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserSettingsRepository settingsRepository;
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
    }
    
    @Transactional
    public Customer updatePersonalDetails(PersonalDetailsRequest request) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        customer.setFullName(request.getFirstName() + " " + request.getLastName());
        if (request.getDateOfBirth() != null) {
            customer.setDateOfBirth(request.getDateOfBirth().atStartOfDay());
        }
        customer.setAddress(request.getAddress() + ", " + request.getCity() + ", " + 
                          request.getState() + " " + request.getZipCode() + ", " + request.getCountry());
        
        return customerRepository.save(customer);
    }
    
    @Transactional
    public User updateContactInfo(ContactInfoRequest request) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        currentUser.setEmail(request.getEmail());
        userRepository.save(currentUser);
        
        customer.setPhone(request.getPhone());
        customerRepository.save(customer);
        
        return currentUser;
    }
    
    public UserSettings getSettings() {
        User currentUser = getCurrentUser();
        return settingsRepository.findByUser(currentUser)
            .orElseGet(() -> createDefaultSettings(currentUser));
    }
    
    @Transactional
    public UserSettings updateSettings(SettingsRequest request) {
        User currentUser = getCurrentUser();
        UserSettings settings = settingsRepository.findByUser(currentUser)
            .orElseGet(() -> createDefaultSettings(currentUser));
        
        if (request.getLanguage() != null) {
            settings.setLanguage(request.getLanguage());
        }
        if (request.getDateFormat() != null) {
            settings.setDateFormat(request.getDateFormat());
        }
        if (request.getTimeFormat() != null) {
            settings.setTimeFormat(request.getTimeFormat());
        }
        if (request.getCurrency() != null) {
            settings.setCurrency(request.getCurrency());
        }
        if (request.getTimezone() != null) {
            settings.setTimezone(request.getTimezone());
        }
        if (request.getNotificationPreferences() != null) {
            settings.setNotificationPreferences(request.getNotificationPreferences());
        }
        if (request.getPrivacySettings() != null) {
            settings.setPrivacySettings(request.getPrivacySettings());
        }
        
        return settingsRepository.save(settings);
    }
    
    private UserSettings createDefaultSettings(User user) {
        UserSettings settings = new UserSettings();
        settings.setUser(user);
        settings.setLanguage("en-US");
        settings.setDateFormat("MM/DD/YYYY");
        settings.setTimeFormat("12h");
        settings.setCurrency("USD");
        settings.setTimezone("America/New_York");
        return settingsRepository.save(settings);
    }
}

