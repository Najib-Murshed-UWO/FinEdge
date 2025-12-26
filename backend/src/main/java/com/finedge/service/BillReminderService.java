package com.finedge.service;

import com.finedge.dto.BillReminderRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.BillReminder;
import com.finedge.model.Biller;
import com.finedge.model.Customer;
import com.finedge.model.User;
import com.finedge.repository.BillReminderRepository;
import com.finedge.repository.BillerRepository;
import com.finedge.repository.CustomerRepository;
import com.finedge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BillReminderService {
    
    @Autowired
    private BillReminderRepository reminderRepository;
    
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
    
    public List<BillReminder> getMyReminders() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return reminderRepository.findByCustomer(customer);
    }
    
    @Transactional
    public BillReminder createReminder(BillReminderRequest request) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        Biller biller = billerRepository.findById(request.getBillerId())
            .orElseThrow(() -> new CustomException("Biller not found", 404));
        
        if (!biller.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        BillReminder reminder = new BillReminder();
        reminder.setCustomer(customer);
        reminder.setBiller(biller);
        reminder.setDueDate(request.getDueDate());
        reminder.setExpectedAmount(request.getExpectedAmount());
        reminder.setDaysBefore(request.getDaysBefore());
        reminder.setEnabled(true);
        
        return reminderRepository.save(reminder);
    }
    
    @Transactional
    public BillReminder toggleReminder(String id, Boolean enabled) {
        BillReminder reminder = reminderRepository.findById(id)
            .orElseThrow(() -> new CustomException("Reminder not found", 404));
        
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        if (!reminder.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        reminder.setEnabled(enabled);
        return reminderRepository.save(reminder);
    }
    
    @Transactional
    public void deleteReminder(String id) {
        BillReminder reminder = reminderRepository.findById(id)
            .orElseThrow(() -> new CustomException("Reminder not found", 404));
        
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        if (!reminder.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        reminderRepository.delete(reminder);
    }
}

