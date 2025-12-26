package com.finedge.controller;

import com.finedge.dto.BillerRequest;
import com.finedge.model.Biller;
import com.finedge.service.BillerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billers")
public class BillerController {
    
    @Autowired
    private BillerService billerService;
    
    @GetMapping
    public ResponseEntity<Map<String, List<Biller>>> getMyBillers() {
        List<Biller> billers = billerService.getMyBillers();
        return ResponseEntity.ok(Map.of("billers", billers));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Biller>> getBiller(@PathVariable String id) {
        Biller biller = billerService.getBiller(id);
        return ResponseEntity.ok(Map.of("biller", biller));
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Biller>> createBiller(@Valid @RequestBody BillerRequest request) {
        Biller biller = billerService.createBiller(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("biller", biller));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Biller>> updateBiller(@PathVariable String id,
                                                             @Valid @RequestBody BillerRequest request) {
        Biller biller = billerService.updateBiller(id, request);
        return ResponseEntity.ok(Map.of("biller", biller));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBiller(@PathVariable String id) {
        billerService.deleteBiller(id);
        return ResponseEntity.ok(Map.of("message", "Biller deleted successfully"));
    }
}

