package com.finedge.service;

import com.finedge.dto.AutoPayRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.*;
import com.finedge.model.enums.PaymentFrequency;
import com.finedge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AutoPayService {
    
    @Autowired
    private AutoPayRepository autoPayRepository;
    
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
    
    public List<AutoPay> getMyAutoPays() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return autoPayRepository.findByCustomer(customer);
    }
    
    @Transactional
    public AutoPay createAutoPay(AutoPayRequest request) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        Biller biller = billerRepository.findById(request.getBillerId())
            .orElseThrow(() -> new CustomException("Biller not found", 404));
        
        if (!biller.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        Account account = accountRepository.findById(request.getAccountId())
            .orElseThrow(() -> new CustomException("Account not found", 404));
        
        if (!account.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        if (request.getFrequency() == PaymentFrequency.MONTHLY && request.getDayOfMonth() == null) {
            throw new CustomException("Day of month is required for monthly payments", 400);
        }
        
        LocalDate nextPaymentDate = calculateNextPaymentDate(request.getFrequency(), request.getDayOfMonth());
        
        AutoPay autoPay = new AutoPay();
        autoPay.setCustomer(customer);
        autoPay.setBiller(biller);
        autoPay.setAccount(account);
        autoPay.setAmount(request.getAmount());
        autoPay.setFrequency(request.getFrequency());
        autoPay.setDayOfMonth(request.getDayOfMonth());
        autoPay.setEnabled(true);
        autoPay.setNextPaymentDate(nextPaymentDate);
        
        return autoPayRepository.save(autoPay);
    }
    
    @Transactional
    public AutoPay updateAutoPay(String id, AutoPayRequest request) {
        AutoPay autoPay = autoPayRepository.findById(id)
            .orElseThrow(() -> new CustomException("Auto-pay not found", 404));
        
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        if (!autoPay.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        autoPay.setAmount(request.getAmount());
        autoPay.setFrequency(request.getFrequency());
        autoPay.setDayOfMonth(request.getDayOfMonth());
        autoPay.setNextPaymentDate(calculateNextPaymentDate(request.getFrequency(), request.getDayOfMonth()));
        
        return autoPayRepository.save(autoPay);
    }
    
    @Transactional
    public AutoPay toggleAutoPay(String id, Boolean enabled) {
        AutoPay autoPay = autoPayRepository.findById(id)
            .orElseThrow(() -> new CustomException("Auto-pay not found", 404));
        
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        if (!autoPay.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        autoPay.setEnabled(enabled);
        return autoPayRepository.save(autoPay);
    }
    
    @Transactional
    public void deleteAutoPay(String id) {
        AutoPay autoPay = autoPayRepository.findById(id)
            .orElseThrow(() -> new CustomException("Auto-pay not found", 404));
        
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        if (!autoPay.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        autoPayRepository.delete(autoPay);
    }
    
    private LocalDate calculateNextPaymentDate(PaymentFrequency frequency, Integer dayOfMonth) {
        LocalDate today = LocalDate.now();
        
        switch (frequency) {
            case WEEKLY:
                return today.plusWeeks(1);
            case BI_WEEKLY:
                return today.plusWeeks(2);
            case MONTHLY:
                if (dayOfMonth != null) {
                    LocalDate nextDate = today.withDayOfMonth(Math.min(dayOfMonth, 28));
                    if (nextDate.isBefore(today) || nextDate.isEqual(today)) {
                        nextDate = nextDate.plusMonths(1);
                    }
                    return nextDate;
                }
                return today.plusMonths(1);
            default:
                return today.plusMonths(1);
        }
    }
}

