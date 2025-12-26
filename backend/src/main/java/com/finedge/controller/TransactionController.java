package com.finedge.controller;

import com.finedge.dto.TransactionRequest;
import com.finedge.model.Transaction;
import com.finedge.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping("/transactions")
    public ResponseEntity<Map<String, List<Transaction>>> getMyTransactions() {
        List<Transaction> transactions = transactionService.getMyTransactions();
        return ResponseEntity.ok(Map.of("transactions", transactions));
    }
    
    @GetMapping("/accounts/{accountId}/transactions")
    public ResponseEntity<Map<String, List<Transaction>>> getAccountTransactions(@PathVariable String accountId) {
        List<Transaction> transactions = transactionService.getAccountTransactions(accountId);
        return ResponseEntity.ok(Map.of("transactions", transactions));
    }
    
    @PostMapping("/transactions")
    public ResponseEntity<Map<String, Transaction>> createTransaction(@Valid @RequestBody TransactionRequest request,
                                                                     HttpServletRequest httpRequest) {
        Transaction transaction = transactionService.createTransaction(request, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("transaction", transaction));
    }
}

