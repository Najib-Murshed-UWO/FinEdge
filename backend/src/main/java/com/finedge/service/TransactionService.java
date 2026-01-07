package com.finedge.service;

import com.finedge.dto.TransactionRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.*;
import com.finedge.model.enums.AuditAction;
import com.finedge.model.enums.TransactionStatus;
import com.finedge.model.enums.TransactionType;
import com.finedge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditService auditService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private DoubleEntryService doubleEntryService;
    
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    
    public List<Transaction> getMyTransactions(Integer limit, Integer offset) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        List<Transaction> allTransactions = transactionRepository.findByCustomerId(customer.getId());
        // Sort by created date descending and apply pagination
        allTransactions.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        int fromIndex = Math.min(offset, allTransactions.size());
        int toIndex = Math.min(offset + limit, allTransactions.size());
        return allTransactions.subList(fromIndex, toIndex);
    }
    
    public List<Transaction> getAccountTransactions(String accountId, Integer limit, Integer offset) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new CustomException("Account not found", 404));
        
        // Verify ownership
        User currentUser = getCurrentUser();
        if (currentUser.getRole() == com.finedge.model.enums.UserRole.CUSTOMER) {
            Customer customer = customerRepository.findByUser(currentUser)
                .orElseThrow(() -> new CustomException("Customer profile not found", 404));
            if (!account.getCustomer().getId().equals(customer.getId())) {
                throw new CustomException("Forbidden", 403);
            }
        }
        
        List<Transaction> allTransactions = transactionRepository.findByAccount(account);
        // Sort by created date descending and apply pagination
        allTransactions.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        int fromIndex = Math.min(offset, allTransactions.size());
        int toIndex = Math.min(offset + limit, allTransactions.size());
        return allTransactions.subList(fromIndex, toIndex);
    }
    
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public Transaction createTransaction(TransactionRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        User currentUser = getCurrentUser();
        
        // Use pessimistic locking to prevent race conditions
        Account account = accountRepository.findByIdWithLock(request.getAccountId())
            .orElseThrow(() -> new CustomException("Account not found", 404));
        
        // Verify ownership
        if (currentUser.getRole() == com.finedge.model.enums.UserRole.CUSTOMER) {
            Customer customer = customerRepository.findByUser(currentUser)
                .orElseThrow(() -> new CustomException("Customer profile not found", 404));
            if (!account.getCustomer().getId().equals(customer.getId())) {
                throw new CustomException("Forbidden", 403);
            }
        }
        
        BigDecimal amount = request.getAmount();
        Account toAccount = null;
        
        // For transfers, lock both accounts in consistent order to prevent deadlocks
        if (request.getTransactionType() == TransactionType.TRANSFER && request.getToAccountId() != null) {
            String fromAccountId = account.getId();
            String toAccountId = request.getToAccountId();
            
            // Lock accounts in lexicographic order to prevent deadlocks
            if (fromAccountId.compareTo(toAccountId) < 0) {
                // Already have fromAccount locked, now lock toAccount
                toAccount = accountRepository.findByIdWithLock(toAccountId)
                    .orElseThrow(() -> new CustomException("Destination account not found", 404));
            } else {
                // Lock toAccount first, then fromAccount
                toAccount = accountRepository.findByIdWithLock(toAccountId)
                    .orElseThrow(() -> new CustomException("Destination account not found", 404));
                // Re-lock fromAccount to ensure we have both locked
                account = accountRepository.findByIdWithLock(fromAccountId)
                    .orElseThrow(() -> new CustomException("Account not found", 404));
            }
        }
        
        // Validate sufficient funds for withdrawals, payments, and transfers
        if (request.getTransactionType() == TransactionType.WITHDRAWAL || 
            request.getTransactionType() == TransactionType.PAYMENT ||
            request.getTransactionType() == TransactionType.TRANSFER) {
            if (account.getBalance().compareTo(amount) < 0) {
                throw new CustomException("Insufficient funds", 400);
            }
        }
        
        // Create Journal Entry and Ledger Entries using double-entry service
        String transactionId = "TXN-" + System.currentTimeMillis();
        JournalEntry journalEntry = doubleEntryService.createTransactionEntry(
            request.getTransactionType(),
            amount,
            account,
            toAccount,
            request.getDescription(),
            request.getReference(),
            transactionId
        );
        
        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setJournalEntry(journalEntry);
        if (toAccount != null) {
            transaction.setToAccount(toAccount);
        }
        transaction.setTransactionType(request.getTransactionType());
        transaction.setAmount(amount);
        transaction.setBalanceAfter(account.getBalance());
        transaction.setDescription(request.getDescription());
        transaction.setReference(request.getReference());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setProcessedAt(LocalDateTime.now());
        transaction = transactionRepository.save(transaction);
        
        // Update journal entry with transaction ID
        journalEntry.setTransactionId(transaction.getId());
        journalEntryRepository.save(journalEntry);
        
        // For transfers, create a second transaction record for the destination account
        if (request.getTransactionType() == TransactionType.TRANSFER && toAccount != null) {
            Transaction transferTransaction = new Transaction();
            transferTransaction.setAccount(toAccount);
            transferTransaction.setJournalEntry(journalEntry);
            transferTransaction.setTransactionType(TransactionType.DEPOSIT);
            transferTransaction.setAmount(amount);
            transferTransaction.setBalanceAfter(toAccount.getBalance());
            transferTransaction.setDescription("Transfer from " + account.getAccountNumber());
            transferTransaction.setStatus(TransactionStatus.COMPLETED);
            transferTransaction.setProcessedAt(LocalDateTime.now());
            transactionRepository.save(transferTransaction);
        }
        
        // Create notification
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("transactionId", transaction.getId());
        notificationService.createNotification(currentUser.getId(), 
            com.finedge.model.enums.NotificationType.TRANSACTION,
            "Transaction Completed",
            request.getTransactionType() + " of $" + amount + " processed",
            metadata, "transaction", transaction.getId());
        
        // Create audit log
        Map<String, Object> newValues = new HashMap<>();
        newValues.put("transactionId", transaction.getId());
        newValues.put("amount", amount);
        auditService.createAuditLog(currentUser.getId(), AuditAction.CREATE, "transaction", 
            transaction.getId(), null, newValues, httpRequest);
        
        return transaction;
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
    }
}

