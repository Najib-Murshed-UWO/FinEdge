package com.finedge.controller;

import com.finedge.dto.BillPaymentRequest;
import com.finedge.model.BillPayment;
import com.finedge.service.BillPaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bill-payments")
public class BillPaymentController {
    
    @Autowired
    private BillPaymentService paymentService;
    
    @GetMapping
    public ResponseEntity<Map<String, List<BillPayment>>> getMyPayments() {
        List<BillPayment> payments = paymentService.getMyPayments();
        return ResponseEntity.ok(Map.of("payments", payments));
    }
    
    @PostMapping
    public ResponseEntity<Map<String, BillPayment>> createPayment(@Valid @RequestBody BillPaymentRequest request) {
        BillPayment payment = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("payment", payment));
    }
}

