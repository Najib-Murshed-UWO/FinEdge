package com.finedge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillPaymentRequest {
    @NotBlank(message = "Biller ID is required")
    private String billerId;
    
    @NotBlank(message = "Account ID is required")
    private String accountId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Payment date is required")
    private LocalDateTime paymentDate;
    
    @NotBlank(message = "Payment type is required")
    private String type; // "ONE_TIME" or "RECURRING" (case-insensitive, accepts "one-time" or "recurring")
    
    private String description;
}

