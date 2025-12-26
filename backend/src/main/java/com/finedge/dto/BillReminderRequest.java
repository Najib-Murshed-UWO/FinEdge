package com.finedge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillReminderRequest {
    @NotBlank(message = "Biller ID is required")
    private String billerId;
    
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
    
    @NotNull(message = "Expected amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal expectedAmount;
    
    @NotNull(message = "Days before is required")
    @Positive(message = "Days before must be positive")
    private Integer daysBefore;
}

