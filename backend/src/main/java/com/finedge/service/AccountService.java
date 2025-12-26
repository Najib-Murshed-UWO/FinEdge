package com.finedge.service;

import com.finedge.dto.AccountRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.Account;
import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.model.enums.AccountStatus;
import com.finedge.model.enums.AuditAction;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditService auditService;
    
    public List<Account> getMyAccounts() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return accountRepository.findByCustomer(customer);
    }
    
    public Account getAccount(String id) {
        Account account = accountRepository.findById(id)
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
        
        return account;
    }
    
    @Transactional
    public Account createAccount(AccountRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        Account account = new Account();
        account.setCustomer(customer);
        account.setAccountNumber("ACC" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8));
        account.setAccountType(request.getAccountType());
        account.setAccountName(request.getAccountName());
        account.setCurrency(request.getCurrency());
        account.setInterestRate(request.getInterestRate());
        account.setBalance(BigDecimal.ZERO);
        account.setStatus(AccountStatus.ACTIVE);
        account.setOpenedAt(LocalDateTime.now());
        
        account = accountRepository.save(account);
        
        // Create audit log
        auditService.createAuditLog(currentUser.getId(), AuditAction.CREATE, "account", 
            account.getId(), null, null, httpRequest);
        
        return account;
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
    }
}

