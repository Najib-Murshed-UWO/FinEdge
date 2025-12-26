package com.finedge.model;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {
    @Id
    @Column(name = "id")
    private String id = UUID.randomUUID().toString();
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(name = "language")
    private String language = "en-US";
    
    @Column(name = "date_format")
    private String dateFormat = "MM/DD/YYYY";
    
    @Column(name = "time_format")
    private String timeFormat = "12h";
    
    @Column(name = "currency")
    private String currency = "USD";
    
    @Column(name = "timezone")
    private String timezone = "America/New_York";
    
    @Type(JsonType.class)
    @Column(name = "notification_preferences", columnDefinition = "jsonb")
    private Map<String, Boolean> notificationPreferences;
    
    @Type(JsonType.class)
    @Column(name = "privacy_settings", columnDefinition = "jsonb")
    private Map<String, Boolean> privacySettings;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

