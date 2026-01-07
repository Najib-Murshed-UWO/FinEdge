package com.finedge.controller;

import com.finedge.service.BalanceValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/validation")
public class BalanceValidationController {
    
    @Autowired
    private BalanceValidationService balanceValidationService;
    
    @GetMapping("/journal-entries")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BANKER')")
    public ResponseEntity<Map<String, Object>> validateJournalEntries() {
        Map<String, Object> result = balanceValidationService.validateJournalEntries();
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/journal-entries/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BANKER')")
    public ResponseEntity<Map<String, Object>> validateJournalEntry(@PathVariable String id) {
        boolean isValid = balanceValidationService.validateJournalEntry(id);
        return ResponseEntity.ok(Map.of("journalEntryId", id, "isBalanced", isValid));
    }
    
    @GetMapping("/customer-accounts")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BANKER')")
    public ResponseEntity<Map<String, Object>> validateCustomerAccountBalances() {
        Map<String, Object> result = balanceValidationService.validateCustomerAccountBalances();
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/trial-balance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> validateTrialBalance() {
        Map<String, Object> result = balanceValidationService.validateTrialBalance();
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/reconcile/{accountId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('BANKER')")
    public ResponseEntity<Map<String, String>> reconcileAccount(@PathVariable String accountId) {
        balanceValidationService.reconcileAccountBalance(accountId);
        return ResponseEntity.ok(Map.of("message", "Account balance reconciled successfully", "accountId", accountId));
    }
}

