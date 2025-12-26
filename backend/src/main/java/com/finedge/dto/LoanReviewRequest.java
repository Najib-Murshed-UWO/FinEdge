package com.finedge.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanReviewRequest {
    @NotBlank(message = "Action is required (approve or reject)")
    private String action; // "approve" or "reject"
    
    private String comments;
    private BigDecimal approvedAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
}

