package com.finedge.controller;

import com.finedge.dto.AccountRequest;
import com.finedge.model.Account;
import com.finedge.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    @GetMapping
    public ResponseEntity<Map<String, List<Account>>> getMyAccounts() {
        List<Account> accounts = accountService.getMyAccounts();
        return ResponseEntity.ok(Map.of("accounts", accounts));
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('BANKER', 'ADMIN')")
    public ResponseEntity<Map<String, List<Account>>> getAllAccounts(@RequestParam(required = false) String customerId) {
        List<Account> accounts = accountService.getAllAccounts(customerId);
        return ResponseEntity.ok(Map.of("accounts", accounts));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Account>> getAccount(@PathVariable String id) {
        Account account = accountService.getAccount(id);
        return ResponseEntity.ok(Map.of("account", account));
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Account>> createAccount(@Valid @RequestBody AccountRequest request,
                                                         HttpServletRequest httpRequest) {
        Account account = accountService.createAccount(request, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("account", account));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Account>> updateAccount(@PathVariable String id,
                                                               @RequestBody AccountRequest request) {
        // Implementation for updating account
        Account account = accountService.getAccount(id);
        return ResponseEntity.ok(Map.of("account", account));
    }
}

