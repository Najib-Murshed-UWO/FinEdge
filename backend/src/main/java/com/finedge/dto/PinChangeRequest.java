package com.finedge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PinChangeRequest {
    @NotBlank(message = "Current PIN is required")
    @Pattern(regexp = "\\d{4}", message = "PIN must be 4 digits")
    private String currentPin;
    
    @NotBlank(message = "New PIN is required")
    @Pattern(regexp = "\\d{4}", message = "PIN must be 4 digits")
    private String newPin;
    
    @NotBlank(message = "Confirm PIN is required")
    @Pattern(regexp = "\\d{4}", message = "PIN must be 4 digits")
    private String confirmPin;
}

