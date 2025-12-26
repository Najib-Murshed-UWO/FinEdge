package com.finedge.dto;

import com.finedge.model.enums.LoanType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class LoanApplicationRequest {
    @NotNull(message = "Loan type is required")
    private LoanType loanType;
    
    @NotNull(message = "Requested amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal requestedAmount;
    
    private String purpose;
    private Map<String, Object> employmentDetails;
    private Map<String, Object> financialDocuments;
}

