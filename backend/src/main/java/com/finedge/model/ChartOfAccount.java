package com.finedge.model;

import com.finedge.model.enums.AccountCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chart_of_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartOfAccount {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();
    
    @Column(name = "account_code", nullable = false, unique = true)
    private String accountCode;
    
    @Column(name = "account_name", nullable = false)
    private String accountName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "account_category", nullable = false)
    private AccountCategory accountCategory;
    
    @ManyToOne
    @JoinColumn(name = "parent_account_id")
    private ChartOfAccount parentAccount;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "description")
    private String description;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

