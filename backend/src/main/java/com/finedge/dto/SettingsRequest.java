package com.finedge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettingsRequest {
    private String language;
    private String dateFormat;
    private String timeFormat;
    private String currency;
    private String timezone;
    private Map<String, Boolean> notificationPreferences;
    private Map<String, Boolean> privacySettings;
}

