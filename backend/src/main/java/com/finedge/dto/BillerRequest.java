package com.finedge.dto;

import com.finedge.model.enums.BillerCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillerRequest {
    @NotBlank(message = "Biller name is required")
    private String name;
    
    @NotNull(message = "Category is required")
    private BillerCategory category;
    
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    private String phone;
    private String email;
    private String website;
}

