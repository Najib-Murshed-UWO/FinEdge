package com.finedge.service;

import com.finedge.dto.CardControlsRequest;
import com.finedge.dto.PinChangeRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.*;
import com.finedge.model.enums.CardStatus;
import com.finedge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CardService {
    
    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
    }
    
    public List<Card> getMyCards() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return cardRepository.findByCustomer(customer);
    }
    
    public Card getCard(String id) {
        Card card = cardRepository.findById(id)
            .orElseThrow(() -> new CustomException("Card not found", 404));
        
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        if (!card.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Unauthorized access", 403);
        }
        
        return card;
    }
    
    @Transactional
    public Card toggleFreeze(String id, Boolean freeze) {
        Card card = getCard(id);
        card.setIsFrozen(freeze);
        card.setStatus(freeze ? CardStatus.FROZEN : CardStatus.ACTIVE);
        return cardRepository.save(card);
    }
    
    @Transactional
    public Card updateControls(String id, CardControlsRequest request) {
        Card card = getCard(id);
        
        if (request.getSpendingLimit() != null) {
            card.setSpendingLimit(request.getSpendingLimit());
        }
        if (request.getOnlineEnabled() != null) {
            card.setOnlineEnabled(request.getOnlineEnabled());
        }
        if (request.getInternationalEnabled() != null) {
            card.setInternationalEnabled(request.getInternationalEnabled());
        }
        
        return cardRepository.save(card);
    }
    
    @Transactional
    public void changePin(String id, PinChangeRequest request) {
        Card card = getCard(id);
        
        // Verify current PIN
        if (!passwordEncoder.matches(request.getCurrentPin(), card.getPin())) {
            throw new CustomException("Current PIN is incorrect", 400);
        }
        
        // Verify new PIN matches confirmation
        if (!request.getNewPin().equals(request.getConfirmPin())) {
            throw new CustomException("New PIN and confirmation PIN do not match", 400);
        }
        
        // Verify new PIN is different from current PIN
        if (passwordEncoder.matches(request.getNewPin(), card.getPin())) {
            throw new CustomException("New PIN must be different from current PIN", 400);
        }
        
        // Update PIN
        card.setPin(passwordEncoder.encode(request.getNewPin()));
        cardRepository.save(card);
    }
    
    @Transactional
    public Card reportCard(String id, String reason) {
        Card card = getCard(id);
        
        CardStatus status;
        if ("lost".equalsIgnoreCase(reason)) {
            status = CardStatus.LOST;
        } else if ("stolen".equalsIgnoreCase(reason)) {
            status = CardStatus.STOLEN;
        } else {
            throw new CustomException("Invalid reason. Must be 'lost' or 'stolen'", 400);
        }
        
        card.setStatus(status);
        card.setIsFrozen(true);
        card.setOnlineEnabled(false);
        card.setInternationalEnabled(false);
        
        return cardRepository.save(card);
    }
}

