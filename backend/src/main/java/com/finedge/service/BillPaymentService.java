package com.finedge.service;

import com.finedge.dto.BillPaymentRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.*;
import com.finedge.model.enums.PaymentStatus;
import com.finedge.model.enums.PaymentType;
import com.finedge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BillPaymentService {
    
    @Autowired
    private BillPaymentRepository billPaymentRepository;
    
    @Autowired
    private BillerRepository billerRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
    }
    
    public List<BillPayment> getMyPayments() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return billPaymentRepository.findByCustomerIdOrderByPaymentDateDesc(customer.getId());
    }
    
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public BillPayment createPayment(BillPaymentRequest request) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        Biller biller = billerRepository.findById(request.getBillerId())
            .orElseThrow(() -> new CustomException("Biller not found", 404));
        
        if (!biller.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        // Use pessimistic locking to prevent race conditions when processing payment
        Account account = accountRepository.findByIdWithLock(request.getAccountId())
            .orElseThrow(() -> new CustomException("Account not found", 404));
        
        if (!account.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        // Check balance if payment needs to be processed immediately
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new CustomException("Insufficient funds", 400);
        }
        
        BillPayment payment = new BillPayment();
        payment.setCustomer(customer);
        payment.setBiller(biller);
        payment.setAccount(account);
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(request.getPaymentDate());
        
        // Convert String to PaymentType enum
        try {
            PaymentType paymentType = PaymentType.valueOf(request.getType().toUpperCase().replace("-", "_"));
            payment.setType(paymentType);
        } catch (IllegalArgumentException e) {
            throw new CustomException("Invalid payment type. Must be 'ONE_TIME' or 'RECURRING'", 400);
        }
        
        payment.setStatus(PaymentStatus.PENDING);
        payment.setDescription(request.getDescription());
        
        return billPaymentRepository.save(payment);
    }
}

