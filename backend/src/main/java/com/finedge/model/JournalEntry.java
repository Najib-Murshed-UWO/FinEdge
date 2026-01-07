package com.finedge.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "journal_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntry {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();
    
    @Column(name = "entry_date", nullable = false)
    private LocalDateTime entryDate;
    
    @Column(name = "reference", unique = true)
    private String reference;
    
    @Column(name = "description", columnDefinition = "text")
    private String description;
    
    @Column(name = "total_debit", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalDebit = BigDecimal.ZERO;
    
    @Column(name = "total_credit", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalCredit = BigDecimal.ZERO;
    
    @Column(name = "is_balanced", nullable = false)
    private Boolean isBalanced = false;
    
    @Column(name = "transaction_id")
    private String transactionId; // Link to original transaction if applicable
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

