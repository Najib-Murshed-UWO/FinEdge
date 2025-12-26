package com.finedge.service;

import com.finedge.model.Account;
import com.finedge.model.Customer;
import com.finedge.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CreditAssessmentService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    public CreditAssessmentResult assessCredit(Customer customer, BigDecimal requestedAmount) {
        int score = 0;
        List<String> notes = new ArrayList<>();
        
        // Credit score factor (0-40 points)
        if (customer.getCreditScore() != null) {
            int creditScore = customer.getCreditScore();
            if (creditScore >= 750) {
                score += 40;
                notes.add("Excellent credit score");
            } else if (creditScore >= 700) {
                score += 30;
                notes.add("Good credit score");
            } else if (creditScore >= 650) {
                score += 20;
                notes.add("Fair credit score");
            } else {
                score += 10;
                notes.add("Below average credit score");
            }
        } else {
            notes.add("No credit score available");
        }
        
        // Income factor (0-30 points)
        if (customer.getAnnualIncome() != null && customer.getAnnualIncome().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal income = customer.getAnnualIncome();
            BigDecimal debtToIncomeRatio = requestedAmount.divide(income, 4, java.math.RoundingMode.HALF_UP);
            
            if (debtToIncomeRatio.compareTo(new BigDecimal("0.3")) < 0) {
                score += 30;
                notes.add("Low debt-to-income ratio");
            } else if (debtToIncomeRatio.compareTo(new BigDecimal("0.4")) < 0) {
                score += 20;
                notes.add("Moderate debt-to-income ratio");
            } else if (debtToIncomeRatio.compareTo(new BigDecimal("0.5")) < 0) {
                score += 10;
                notes.add("High debt-to-income ratio");
            } else {
                notes.add("Very high debt-to-income ratio - risky");
            }
        } else {
            notes.add("No income information available");
        }
        
        // Employment status (0-20 points)
        if (customer.getEmploymentStatus() != null) {
            String employmentStatus = customer.getEmploymentStatus().toLowerCase();
            if (employmentStatus.contains("employed")) {
                score += 20;
                notes.add("Employed");
            } else if (employmentStatus.contains("self")) {
                score += 15;
                notes.add("Self-employed");
            } else {
                score += 5;
                notes.add("Unemployed or other");
            }
        }
        
        // Account history (0-10 points)
        List<Account> accounts = accountRepository.findByCustomer(customer);
        if (!accounts.isEmpty()) {
            score += 10;
            notes.add("Existing account relationship");
        }
        
        // Calculate approved amount and interest rate
        BigDecimal approvedAmount = requestedAmount;
        BigDecimal interestRate = new BigDecimal("12.0");
        
        if (score >= 80) {
            approvedAmount = requestedAmount;
            interestRate = new BigDecimal("7.5");
            notes.add("Premium rate approved");
        } else if (score >= 60) {
            approvedAmount = requestedAmount.multiply(new BigDecimal("0.9"));
            interestRate = new BigDecimal("9.5");
            notes.add("Standard rate approved");
        } else if (score >= 40) {
            approvedAmount = requestedAmount.multiply(new BigDecimal("0.7"));
            interestRate = new BigDecimal("12.0");
            notes.add("Higher rate due to risk");
        } else {
            approvedAmount = BigDecimal.ZERO;
            notes.add("Application rejected - insufficient credit score");
        }
        
        return new CreditAssessmentResult(score, String.join("; ", notes), 
            approvedAmount.compareTo(BigDecimal.ZERO) > 0 ? approvedAmount : null,
            approvedAmount.compareTo(BigDecimal.ZERO) > 0 ? interestRate : null);
    }
    
    public static class CreditAssessmentResult {
        private final int score;
        private final String notes;
        private final BigDecimal approvedAmount;
        private final BigDecimal interestRate;
        
        public CreditAssessmentResult(int score, String notes, BigDecimal approvedAmount, BigDecimal interestRate) {
            this.score = score;
            this.notes = notes;
            this.approvedAmount = approvedAmount;
            this.interestRate = interestRate;
        }
        
        public int getScore() { return score; }
        public String getNotes() { return notes; }
        public BigDecimal getApprovedAmount() { return approvedAmount; }
        public BigDecimal getInterestRate() { return interestRate; }
    }
    
    public static BigDecimal calculateEMI(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("12"), 6, java.math.RoundingMode.HALF_UP)
            .divide(new BigDecimal("100"), 6, java.math.RoundingMode.HALF_UP);
        
        BigDecimal onePlusRate = BigDecimal.ONE.add(monthlyRate);
        BigDecimal numerator = principal.multiply(monthlyRate).multiply(
            onePlusRate.pow(tenureMonths)
        );
        BigDecimal denominator = onePlusRate.pow(tenureMonths).subtract(BigDecimal.ONE);
        
        return numerator.divide(denominator, 2, java.math.RoundingMode.HALF_UP);
    }
}

