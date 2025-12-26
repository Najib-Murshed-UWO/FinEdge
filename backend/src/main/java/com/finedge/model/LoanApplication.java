package com.finedge.model;

import com.finedge.model.enums.LoanStatus;
import com.finedge.model.enums.LoanType;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "loan_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "loan_type", nullable = false)
    private LoanType loanType;
    
    @Column(name = "requested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;
    
    @Column(name = "purpose")
    private String purpose;
    
    @Type(JsonType.class)
    @Column(name = "employment_details", columnDefinition = "jsonb")
    private Map<String, Object> employmentDetails;
    
    @Type(JsonType.class)
    @Column(name = "financial_documents", columnDefinition = "jsonb")
    private Map<String, Object> financialDocuments;
    
    @Column(name = "credit_assessment_score", precision = 5, scale = 2)
    private BigDecimal creditAssessmentScore;
    
    @Column(name = "credit_assessment_notes", columnDefinition = "text")
    private String creditAssessmentNotes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanStatus status = LoanStatus.DRAFT;
    
    @Column(name = "current_step", nullable = false)
    private Integer currentStep = 1;
    
    @Column(name = "total_steps", nullable = false)
    private Integer totalSteps = 3;
    
    @Column(name = "approved_amount", precision = 15, scale = 2)
    private BigDecimal approvedAmount;
    
    @Column(name = "approved_interest_rate", precision = 5, scale = 2)
    private BigDecimal approvedInterestRate;
    
    @Column(name = "approved_tenure_months")
    private Integer approvedTenureMonths;
    
    @ManyToOne
    @JoinColumn(name = "loan_id")
    private Loan loan;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

