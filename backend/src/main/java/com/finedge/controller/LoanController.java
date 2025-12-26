package com.finedge.controller;

import com.finedge.dto.LoanApplicationRequest;
import com.finedge.dto.LoanReviewRequest;
import com.finedge.model.EMISchedule;
import com.finedge.model.Loan;
import com.finedge.model.LoanApplication;
import com.finedge.model.LoanApproval;
import com.finedge.repository.EMIScheduleRepository;
import com.finedge.repository.LoanApprovalRepository;
import com.finedge.service.LoanService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoanController {
    
    @Autowired
    private LoanService loanService;
    
    @Autowired
    private LoanApprovalRepository loanApprovalRepository;
    
    @Autowired
    private EMIScheduleRepository emiScheduleRepository;
    
    @GetMapping("/loans")
    public ResponseEntity<Map<String, List<Loan>>> getMyLoans() {
        List<Loan> loans = loanService.getMyLoans();
        return ResponseEntity.ok(Map.of("loans", loans));
    }
    
    @GetMapping("/loans/{id}")
    public ResponseEntity<Map<String, Object>> getLoan(@PathVariable String id) {
        Loan loan = loanService.getLoan(id);
        List<EMISchedule> emiSchedules = emiScheduleRepository.findByLoanId(id);
        return ResponseEntity.ok(Map.of("loan", loan, "emiSchedules", emiSchedules));
    }
    
    @GetMapping("/loan-applications")
    public ResponseEntity<Map<String, List<LoanApplication>>> getMyLoanApplications() {
        List<LoanApplication> applications = loanService.getMyLoanApplications();
        return ResponseEntity.ok(Map.of("applications", applications));
    }
    
    @GetMapping("/loan-applications/pending")
    @PreAuthorize("hasAnyRole('BANKER', 'ADMIN')")
    public ResponseEntity<Map<String, List<LoanApplication>>> getPendingLoanApplications() {
        List<LoanApplication> applications = loanService.getPendingLoanApplications();
        return ResponseEntity.ok(Map.of("applications", applications));
    }
    
    @GetMapping("/loan-applications/{id}")
    public ResponseEntity<Map<String, Object>> getLoanApplication(@PathVariable String id) {
        LoanApplication application = loanService.getLoanApplication(id);
        List<LoanApproval> approvals = loanApprovalRepository.findByLoanApplicationIdOrderByStep(id);
        return ResponseEntity.ok(Map.of("application", application, "approvals", approvals));
    }
    
    @PostMapping("/loan-applications")
    public ResponseEntity<Map<String, LoanApplication>> submitLoanApplication(
            @Valid @RequestBody LoanApplicationRequest request,
            HttpServletRequest httpRequest) {
        LoanApplication application = loanService.submitLoanApplication(request, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("application", application));
    }
    
    @PostMapping("/loan-applications/{id}/review")
    @PreAuthorize("hasAnyRole('BANKER', 'ADMIN')")
    public ResponseEntity<Map<String, LoanApplication>> reviewLoanApplication(
            @PathVariable String id,
            @Valid @RequestBody LoanReviewRequest request,
            HttpServletRequest httpRequest) {
        LoanApplication application = loanService.reviewLoanApplication(id, request, httpRequest);
        return ResponseEntity.ok(Map.of("application", application));
    }
    
    @PostMapping("/loans/{loanId}/emi/{emiId}/pay")
    public ResponseEntity<Map<String, String>> payEMI(@PathVariable String loanId,
                                                      @PathVariable String emiId,
                                                      @RequestBody Map<String, String> request) {
        // Implementation for paying EMI
        return ResponseEntity.ok(Map.of("message", "EMI paid successfully"));
    }
    
}

