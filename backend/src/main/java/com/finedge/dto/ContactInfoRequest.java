package com.finedge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactInfoRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    private String alternatePhone;
    
    @NotBlank(message = "Mailing address is required")
    private String mailingAddress;
    
    @NotBlank(message = "Mailing city is required")
    private String mailingCity;
    
    @NotBlank(message = "Mailing state is required")
    private String mailingState;
    
    @NotBlank(message = "Mailing ZIP code is required")
    private String mailingZipCode;
    
    @NotBlank(message = "Mailing country is required")
    private String mailingCountry;
}

