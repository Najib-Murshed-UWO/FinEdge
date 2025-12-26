package com.finedge.controller;

import com.finedge.dto.AutoPayRequest;
import com.finedge.model.AutoPay;
import com.finedge.service.AutoPayService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/autopay")
public class AutoPayController {
    
    @Autowired
    private AutoPayService autoPayService;
    
    @GetMapping
    public ResponseEntity<Map<String, List<AutoPay>>> getMyAutoPays() {
        List<AutoPay> autoPays = autoPayService.getMyAutoPays();
        return ResponseEntity.ok(Map.of("autoPays", autoPays));
    }
    
    @PostMapping
    public ResponseEntity<Map<String, AutoPay>> createAutoPay(@Valid @RequestBody AutoPayRequest request) {
        AutoPay autoPay = autoPayService.createAutoPay(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("autoPay", autoPay));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, AutoPay>> updateAutoPay(@PathVariable String id,
                                                              @Valid @RequestBody AutoPayRequest request) {
        AutoPay autoPay = autoPayService.updateAutoPay(id, request);
        return ResponseEntity.ok(Map.of("autoPay", autoPay));
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Map<String, AutoPay>> toggleAutoPay(@PathVariable String id,
                                                                @RequestParam Boolean enabled) {
        AutoPay autoPay = autoPayService.toggleAutoPay(id, enabled);
        return ResponseEntity.ok(Map.of("autoPay", autoPay));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAutoPay(@PathVariable String id) {
        autoPayService.deleteAutoPay(id);
        return ResponseEntity.ok(Map.of("message", "Auto-pay deleted successfully"));
    }
}

