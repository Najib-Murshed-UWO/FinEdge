package com.finedge.service;

import com.finedge.dto.BillerRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.Biller;
import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.repository.BillerRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BillerService {
    
    @Autowired
    private BillerRepository billerRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
    }
    
    public List<Biller> getMyBillers() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return billerRepository.findByCustomer(customer);
    }
    
    public Biller getBiller(String id) {
        Biller biller = billerRepository.findById(id)
            .orElseThrow(() -> new CustomException("Biller not found", 404));
        
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        if (!biller.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        return biller;
    }
    
    @Transactional
    public Biller createBiller(BillerRequest request) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        Biller biller = new Biller();
        biller.setCustomer(customer);
        biller.setName(request.getName());
        biller.setCategory(request.getCategory());
        biller.setAccountNumber(request.getAccountNumber());
        biller.setPhone(request.getPhone());
        biller.setEmail(request.getEmail());
        biller.setWebsite(request.getWebsite());
        
        return billerRepository.save(biller);
    }
    
    @Transactional
    public Biller updateBiller(String id, BillerRequest request) {
        Biller biller = getBiller(id);
        
        biller.setName(request.getName());
        biller.setCategory(request.getCategory());
        biller.setAccountNumber(request.getAccountNumber());
        biller.setPhone(request.getPhone());
        biller.setEmail(request.getEmail());
        biller.setWebsite(request.getWebsite());
        
        return billerRepository.save(biller);
    }
    
    @Transactional
    public void deleteBiller(String id) {
        Biller biller = getBiller(id);
        billerRepository.delete(biller);
    }
}

