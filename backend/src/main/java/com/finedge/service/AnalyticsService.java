package com.finedge.service;

import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.model.enums.LoanStatus;
import com.finedge.model.enums.TransactionType;
import com.finedge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private EMIScheduleRepository emiScheduleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Map<String, Object> getCustomerAnalytics() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new RuntimeException("Customer profile not found"));
        
        // Get accounts summary
        List<com.finedge.model.Account> accounts = accountRepository.findByCustomer(customer);
        BigDecimal totalBalance = accounts.stream()
            .map(com.finedge.model.Account::getBalance)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Get loans summary
        List<com.finedge.model.Loan> loans = loanRepository.findByCustomer(customer);
        List<com.finedge.model.Loan> activeLoans = loans.stream()
            .filter(l -> l.getStatus() == LoanStatus.ACTIVE)
            .toList();
        BigDecimal totalLoanAmount = loans.stream()
            .map(com.finedge.model.Loan::getPrincipalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPaid = loans.stream()
            .map(com.finedge.model.Loan::getAmountPaid)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Get transactions summary (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<com.finedge.model.Transaction> transactions = transactionRepository.findByCustomerId(customer.getId());
        List<com.finedge.model.Transaction> recentTransactions = transactions.stream()
            .filter(t -> t.getCreatedAt().isAfter(thirtyDaysAgo))
            .toList();
        
        BigDecimal totalIncome = recentTransactions.stream()
            .filter(t -> t.getTransactionType() == TransactionType.DEPOSIT || 
                        t.getTransactionType() == TransactionType.TRANSFER)
            .map(com.finedge.model.Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalExpenses = recentTransactions.stream()
            .filter(t -> t.getTransactionType() == TransactionType.WITHDRAWAL || 
                        t.getTransactionType() == TransactionType.PAYMENT)
            .map(com.finedge.model.Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Get upcoming EMIs
        List<com.finedge.model.EMISchedule> upcomingEMIs = new java.util.ArrayList<>();
        for (com.finedge.model.Loan loan : activeLoans) {
            upcomingEMIs.addAll(emiScheduleRepository.findUpcomingEMIs(loan.getId(), LocalDateTime.now()));
        }
        upcomingEMIs.sort((a, b) -> a.getDueDate().compareTo(b.getDueDate()));
        
        Map<String, Object> result = new HashMap<>();
        result.put("accounts", Map.of(
            "total", accounts.size(),
            "totalBalance", totalBalance
        ));
        result.put("loans", Map.of(
            "total", loans.size(),
            "active", activeLoans.size(),
            "totalAmount", totalLoanAmount,
            "totalPaid", totalPaid,
            "remaining", totalLoanAmount.subtract(totalPaid)
        ));
        result.put("transactions", Map.of(
            "total", recentTransactions.size(),
            "income", totalIncome,
            "expenses", totalExpenses,
            "net", totalIncome.subtract(totalExpenses)
        ));
        result.put("upcomingEMIs", upcomingEMIs.stream().limit(5).toList());
        
        return result;
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

