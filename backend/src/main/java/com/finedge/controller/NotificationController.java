package com.finedge.controller;

import com.finedge.model.Notification;
import com.finedge.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private com.finedge.repository.UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, List<Notification>>> getMyNotifications(
            @RequestParam(required = false) Boolean unreadOnly) {
        String userId = getCurrentUserId();
        List<Notification> notifications;
        if (Boolean.TRUE.equals(unreadOnly)) {
            notifications = notificationService.getMyNotifications(userId).stream()
                .filter(n -> !n.getIsRead())
                .toList();
        } else {
            notifications = notificationService.getMyNotifications(userId);
        }
        return ResponseEntity.ok(Map.of("notifications", notifications));
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Notification>> markNotificationAsRead(@PathVariable String id) {
        String userId = getCurrentUserId();
        Notification notification = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(Map.of("notification", notification));
    }
    
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllNotificationsAsRead() {
        String userId = getCurrentUserId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
    
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .map(com.finedge.model.User::getId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

