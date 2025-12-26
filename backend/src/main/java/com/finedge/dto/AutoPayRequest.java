package com.finedge.dto;

import com.finedge.model.enums.PaymentFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutoPayRequest {
    @NotBlank(message = "Biller ID is required")
    private String billerId;
    
    @NotBlank(message = "Account ID is required")
    private String accountId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Frequency is required")
    private PaymentFrequency frequency;
    
    private Integer dayOfMonth; // Required for monthly frequency
}

