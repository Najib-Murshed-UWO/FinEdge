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
            @RequestParam(required = false) Boolean unreadOnly,
            @RequestParam(required = false, defaultValue = "50") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer offset) {
        String userId = getCurrentUserId();
        List<Notification> notifications;
        if (Boolean.TRUE.equals(unreadOnly)) {
            notifications = notificationService.getMyNotifications(userId).stream()
                .filter(n -> !n.getIsRead())
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
        } else {
            notifications = notificationService.getMyNotifications(userId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
        }
        // Apply pagination
        int fromIndex = Math.min(offset, notifications.size());
        int toIndex = Math.min(offset + limit, notifications.size());
        List<Notification> paginatedNotifications = notifications.subList(fromIndex, toIndex);
        return ResponseEntity.ok(Map.of("notifications", paginatedNotifications));
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

