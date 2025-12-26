package com.finedge.service;

import com.finedge.dto.TransactionRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.Account;
import com.finedge.model.Customer;
import com.finedge.model.Transaction;
import com.finedge.model.User;
import com.finedge.model.enums.AuditAction;
import com.finedge.model.enums.TransactionStatus;
import com.finedge.model.enums.TransactionType;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.TransactionRepository;
import com.finedge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    
    public List<Transaction> getMyTransactions() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return transactionRepository.findByCustomerId(customer.getId());
    }
    
    public List<Transaction> getAccountTransactions(String accountId) {
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
        
        return transactionRepository.findByAccount(account);
    }
    
    @Transactional
    public Transaction createTransaction(TransactionRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        User currentUser = getCurrentUser();
        Account account = accountRepository.findById(request.getAccountId())
            .orElseThrow(() -> new CustomException("Account not found", 404));
        
        // Verify ownership
        if (currentUser.getRole() == com.finedge.model.enums.UserRole.CUSTOMER) {
            Customer customer = customerRepository.findByUser(currentUser)
                .orElseThrow(() -> new CustomException("Customer profile not found", 404));
            if (!account.getCustomer().getId().equals(customer.getId())) {
                throw new CustomException("Forbidden", 403);
            }
        }
        
        // Calculate new balance
        BigDecimal amount = request.getAmount();
        BigDecimal newBalance = account.getBalance();
        
        if (request.getTransactionType() == TransactionType.DEPOSIT || 
            request.getTransactionType() == TransactionType.TRANSFER) {
            newBalance = newBalance.add(amount);
        } else if (request.getTransactionType() == TransactionType.WITHDRAWAL || 
                   request.getTransactionType() == TransactionType.PAYMENT) {
            if (newBalance.compareTo(amount) < 0) {
                throw new CustomException("Insufficient funds", 400);
            }
            newBalance = newBalance.subtract(amount);
        }
        
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        if (request.getToAccountId() != null) {
            transaction.setToAccount(accountRepository.findById(request.getToAccountId()).orElse(null));
        }
        transaction.setTransactionType(request.getTransactionType());
        transaction.setAmount(amount);
        transaction.setBalanceAfter(newBalance);
        transaction.setDescription(request.getDescription());
        transaction.setReference(request.getReference());
        transaction.setStatus(TransactionStatus.PENDING);
        transaction = transactionRepository.save(transaction);
        
        // Update account balance
        account.setBalance(newBalance);
        accountRepository.save(account);
        
        // Update transaction status
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setProcessedAt(LocalDateTime.now());
        transaction = transactionRepository.save(transaction);
        
        // Handle transfer to another account
        if (request.getTransactionType() == TransactionType.TRANSFER && request.getToAccountId() != null) {
            Account toAccount = accountRepository.findById(request.getToAccountId())
                .orElseThrow(() -> new CustomException("Destination account not found", 404));
            toAccount.setBalance(toAccount.getBalance().add(amount));
            accountRepository.save(toAccount);
            
            Transaction transferTransaction = new Transaction();
            transferTransaction.setAccount(toAccount);
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

