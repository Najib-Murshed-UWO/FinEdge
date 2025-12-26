package com.finedge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardControlsRequest {
    private BigDecimal spendingLimit;
    private Boolean onlineEnabled;
    private Boolean internationalEnabled;
}

