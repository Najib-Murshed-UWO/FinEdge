package com.finedge.model;

import com.finedge.model.enums.CardStatus;
import com.finedge.model.enums.CardType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Card {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
    
    @Column(name = "card_number", nullable = false, unique = true)
    private String cardNumber;
    
    @Column(name = "card_holder", nullable = false)
    private String cardHolder;
    
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;
    
    @Column(name = "cvv", nullable = false)
    private String cvv; // Encrypted
    
    @Column(name = "pin", nullable = false)
    private String pin; // Encrypted
    
    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", nullable = false)
    private CardType cardType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CardStatus status = CardStatus.ACTIVE;
    
    @Column(name = "is_frozen", nullable = false)
    private Boolean isFrozen = false;
    
    @Column(name = "spending_limit", precision = 15, scale = 2)
    private BigDecimal spendingLimit;
    
    @Column(name = "current_spending", precision = 15, scale = 2)
    private BigDecimal currentSpending = BigDecimal.ZERO;
    
    @Column(name = "online_enabled", nullable = false)
    private Boolean onlineEnabled = true;
    
    @Column(name = "international_enabled", nullable = false)
    private Boolean internationalEnabled = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

