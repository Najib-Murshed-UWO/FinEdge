package com.finedge.dto;

import com.finedge.model.enums.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountRequest {
    @NotNull(message = "Account type is required")
    private AccountType accountType;
    
    @NotBlank(message = "Account name is required")
    private String accountName;
    
    private String currency = "USD";
    private BigDecimal interestRate = BigDecimal.ZERO;
}

