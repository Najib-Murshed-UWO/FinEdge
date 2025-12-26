package com.finedge.controller;

import com.finedge.dto.BillReminderRequest;
import com.finedge.model.BillReminder;
import com.finedge.service.BillReminderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bill-reminders")
public class BillReminderController {
    
    @Autowired
    private BillReminderService reminderService;
    
    @GetMapping
    public ResponseEntity<Map<String, List<BillReminder>>> getMyReminders() {
        List<BillReminder> reminders = reminderService.getMyReminders();
        return ResponseEntity.ok(Map.of("reminders", reminders));
    }
    
    @PostMapping
    public ResponseEntity<Map<String, BillReminder>> createReminder(@Valid @RequestBody BillReminderRequest request) {
        BillReminder reminder = reminderService.createReminder(request);
        return ResponseEntity.ok(Map.of("reminder", reminder));
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Map<String, BillReminder>> toggleReminder(@PathVariable String id,
                                                                     @RequestParam Boolean enabled) {
        BillReminder reminder = reminderService.toggleReminder(id, enabled);
        return ResponseEntity.ok(Map.of("reminder", reminder));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReminder(@PathVariable String id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.ok(Map.of("message", "Reminder deleted successfully"));
    }
}

