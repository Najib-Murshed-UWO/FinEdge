package com.finedge.config;

import com.finedge.service.ChartOfAccountService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {
    
    @Autowired
    private ChartOfAccountService chartOfAccountService;
    
    @PostConstruct
    public void initialize() {
        // Initialize chart of accounts on application startup
        chartOfAccountService.initializeDefaultAccounts();
    }
}

