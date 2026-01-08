package com.finedge.service;

import com.finedge.dto.LoanApplicationRequest;
import com.finedge.dto.LoanReviewRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.*;
import com.finedge.model.enums.*;
import com.finedge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class LoanService {
    
    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private LoanApplicationRepository loanApplicationRepository;
    
    @Autowired
    private LoanApprovalRepository loanApprovalRepository;
    
    @Autowired
    private EMIScheduleRepository emiScheduleRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private CreditAssessmentService creditAssessmentService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private AuditService auditService;
    
    @Autowired
    private DoubleEntryService doubleEntryService;
    
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    
    
    public List<Loan> getMyLoans() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return loanRepository.findByCustomer(customer);
    }
    
    public Loan getLoan(String id) {
        Loan loan = loanRepository.findById(id)
            .orElseThrow(() -> new CustomException("Loan not found", 404));
        
        User currentUser = getCurrentUser();
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            Customer customer = customerRepository.findByUser(currentUser)
                .orElseThrow(() -> new CustomException("Customer profile not found", 404));
            if (!loan.getCustomer().getId().equals(customer.getId())) {
                throw new CustomException("Forbidden", 403);
            }
        }
        
        return loan;
    }
    
    public LoanApplication getLoanApplication(String id) {
        LoanApplication application = loanApplicationRepository.findById(id)
            .orElseThrow(() -> new CustomException("Loan application not found", 404));
        
        User currentUser = getCurrentUser();
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            Customer customer = customerRepository.findByUser(currentUser)
                .orElseThrow(() -> new CustomException("Customer profile not found", 404));
            if (!application.getCustomer().getId().equals(customer.getId())) {
                throw new CustomException("Forbidden", 403);
            }
        }
        
        return application;
    }
    
    public List<LoanApplication> getMyLoanApplications() {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        return loanApplicationRepository.findByCustomer(customer);
    }
    
    public List<LoanApplication> getPendingLoanApplications() {
        return loanApplicationRepository.findByStatus(LoanStatus.SUBMITTED);
    }
    
    @Transactional
    public LoanApplication submitLoanApplication(LoanApplicationRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        // Perform credit assessment
        CreditAssessmentService.CreditAssessmentResult assessment = 
            creditAssessmentService.assessCredit(customer, request.getRequestedAmount());
        
        LoanApplication application = new LoanApplication();
        application.setCustomer(customer);
        application.setLoanType(request.getLoanType());
        application.setRequestedAmount(request.getRequestedAmount());
        application.setPurpose(request.getPurpose());
        application.setEmploymentDetails(request.getEmploymentDetails());
        application.setFinancialDocuments(request.getFinancialDocuments());
        application.setCreditAssessmentScore(new BigDecimal(assessment.getScore()));
        application.setCreditAssessmentNotes(assessment.getNotes());
        application.setStatus(LoanStatus.SUBMITTED);
        application.setCurrentStep(1);
        application.setTotalSteps(3);
        application.setSubmittedAt(LocalDateTime.now());
        application = loanApplicationRepository.save(application);
        
        // Create initial approval record
        LoanApproval approval = new LoanApproval();
        approval.setLoanApplication(application);
        approval.setApprover(currentUser);
        approval.setStep(1);
        approval.setStatus(ApprovalStatus.PENDING);
        loanApprovalRepository.save(approval);
        
        auditService.createAuditLog(currentUser.getId(), AuditAction.CREATE, "loan_application", 
            application.getId(), null, null, httpRequest);
        
        return application;
    }
    
    @Transactional
    public LoanApplication reviewLoanApplication(String id, LoanReviewRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != UserRole.BANKER && currentUser.getRole() != UserRole.ADMIN) {
            throw new CustomException("Forbidden", 403);
        }
        
        LoanApplication application = loanApplicationRepository.findById(id)
            .orElseThrow(() -> new CustomException("Loan application not found", 404));
        
        if (application.getStatus() != LoanStatus.SUBMITTED && application.getStatus() != LoanStatus.UNDER_REVIEW) {
            throw new CustomException("Application cannot be reviewed in current state", 400);
        }
        
        List<LoanApproval> approvals = loanApprovalRepository.findByLoanApplicationIdOrderByStep(id);
        final Integer currentStep = application.getCurrentStep();
        LoanApproval currentApproval = approvals.stream()
            .filter(a -> a.getStep().equals(currentStep) && a.getStatus() == ApprovalStatus.PENDING)
            .findFirst()
            .orElseThrow(() -> new CustomException("No pending approval for current step", 400));
        
        if ("approve".equals(request.getAction())) {
            currentApproval.setStatus(ApprovalStatus.APPROVED);
            currentApproval.setApprovedAt(LocalDateTime.now());
            currentApproval.setComments(request.getComments());
            loanApprovalRepository.save(currentApproval);
            
            if (application.getCurrentStep() < application.getTotalSteps()) {
                application.setStatus(LoanStatus.UNDER_REVIEW);
                application.setCurrentStep(application.getCurrentStep() + 1);
                application.setReviewedAt(LocalDateTime.now());
                application.setReviewedBy(currentUser);
                application = loanApplicationRepository.save(application);
                
                // Create next approval step
                LoanApproval nextApproval = new LoanApproval();
                nextApproval.setLoanApplication(application);
                nextApproval.setApprover(currentUser);
                nextApproval.setStep(application.getCurrentStep());
                nextApproval.setStatus(ApprovalStatus.PENDING);
                loanApprovalRepository.save(nextApproval);
            } else {
                // Final approval - create loan
                BigDecimal finalAmount = request.getApprovedAmount() != null ? 
                    request.getApprovedAmount() : application.getApprovedAmount() != null ? 
                    application.getApprovedAmount() : application.getRequestedAmount();
                BigDecimal finalRate = request.getInterestRate() != null ? 
                    request.getInterestRate() : application.getApprovedInterestRate() != null ? 
                    application.getApprovedInterestRate() : new BigDecimal("12.0");
                int finalTenure = request.getTenureMonths() != null ? 
                    request.getTenureMonths() : application.getApprovedTenureMonths() != null ? 
                    application.getApprovedTenureMonths() : 36;
                
                // Get or create account
                List<Account> accounts = accountRepository.findByCustomer(application.getCustomer());
                Account account = accounts.stream()
                    .filter(a -> a.getAccountType() == AccountType.CHECKING)
                    .findFirst()
                    .orElse(null);
                
                if (account == null) {
                    account = new Account();
                    account.setCustomer(application.getCustomer());
                    account.setAccountNumber("ACC" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8));
                    account.setAccountType(AccountType.CHECKING);
                    account.setAccountName("Primary Checking");
                    account.setCurrency("USD");
                    account.setBalance(BigDecimal.ZERO);
                    account.setStatus(AccountStatus.ACTIVE);
                    account.setOpenedAt(LocalDateTime.now());
                    account = accountRepository.save(account);
                }
                
                // Create loan
                BigDecimal emi = CreditAssessmentService.calculateEMI(finalAmount, finalRate, finalTenure);
                Loan loan = new Loan();
                loan.setCustomer(application.getCustomer());
                loan.setAccount(account);
                loan.setLoanNumber("LOAN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8));
                loan.setLoanType(application.getLoanType());
                loan.setPrincipalAmount(finalAmount);
                loan.setInterestRate(finalRate);
                loan.setTenureMonths(finalTenure);
                loan.setMonthlyEMI(emi);
                BigDecimal rateMultiplier = finalRate.divide(new BigDecimal("100"), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(finalTenure).divide(new BigDecimal("12"), 4, java.math.RoundingMode.HALF_UP));
                loan.setAmountRemaining(finalAmount.multiply(BigDecimal.ONE.add(rateMultiplier)));
                loan.setStatus(LoanStatus.ACTIVE);
                loan.setPurpose(application.getPurpose());
                loan.setDisbursedAt(LocalDateTime.now());
                loan = loanRepository.save(loan);
                
                // Generate EMI schedule
                generateEMISchedule(loan, finalAmount, finalRate, finalTenure);
                
                // Disburse to account with pessimistic lock and double-entry bookkeeping
                Account lockedAccount = accountRepository.findByIdWithLock(account.getId())
                    .orElseThrow(() -> new CustomException("Account not found", 404));
                
                // Create journal entry for loan disbursement using double-entry
                String transactionId = "LOAN-DISB-" + loan.getLoanNumber();
                JournalEntry journalEntry = doubleEntryService.createLoanDisbursementEntry(
                    finalAmount, lockedAccount, loan.getLoanNumber(), transactionId
                );
                
                account = lockedAccount; // Update reference
                
                // Create transaction record
                Transaction transaction = new Transaction();
                transaction.setAccount(account);
                transaction.setJournalEntry(journalEntry);
                transaction.setTransactionType(TransactionType.DEPOSIT);
                transaction.setAmount(finalAmount);
                transaction.setBalanceAfter(account.getBalance());
                transaction.setDescription("Loan disbursement - " + loan.getLoanNumber());
                transaction.setStatus(TransactionStatus.COMPLETED);
                transaction.setProcessedAt(LocalDateTime.now());
                transaction = transactionRepository.save(transaction);
                
                // Update journal entry with transaction ID
                journalEntry.setTransactionId(transaction.getId());
                journalEntryRepository.save(journalEntry);
                
                // Update application
                application.setStatus(LoanStatus.APPROVED);
                application.setApprovedAmount(finalAmount);
                application.setApprovedInterestRate(finalRate);
                application.setApprovedTenureMonths(finalTenure);
                application.setLoan(loan);
                application.setReviewedAt(LocalDateTime.now());
                application.setReviewedBy(currentUser);
                application = loanApplicationRepository.save(application);
                
                notificationService.createNotification(application.getCustomer().getUser().getId(), 
                    NotificationType.LOAN_APPROVAL, "Loan Approved",
                    "Your " + application.getLoanType() + " loan of $" + finalAmount + " has been approved",
                    null, "loan", loan.getId());
                
                auditService.createAuditLog(currentUser.getId(), AuditAction.APPROVE, "loan_application", 
                    id, null, null, httpRequest);
                
                return application;
            }
        } else {
            application.setStatus(LoanStatus.REJECTED);
            application.setReviewedAt(LocalDateTime.now());
            application.setReviewedBy(currentUser);
            application = loanApplicationRepository.save(application);
            
            currentApproval.setStatus(ApprovalStatus.REJECTED);
            currentApproval.setComments(request.getComments());
            loanApprovalRepository.save(currentApproval);
            
            notificationService.createNotification(application.getCustomer().getUser().getId(), 
                NotificationType.LOAN_APPROVAL, "Loan Application Rejected",
                "Your loan application has been rejected. " + (request.getComments() != null ? request.getComments() : ""),
                null, "loan_application", id);
        }
        
        auditService.createAuditLog(currentUser.getId(), 
            "reject".equals(request.getAction()) ? AuditAction.REJECT : AuditAction.APPROVE, 
            "loan_application", id, null, null, httpRequest);
        
        return application;
    }
    
    private void generateEMISchedule(Loan loan, BigDecimal principal, BigDecimal interestRate, int tenureMonths) {
        BigDecimal monthlyRate = interestRate.divide(new BigDecimal("12"), 6, java.math.RoundingMode.HALF_UP)
            .divide(new BigDecimal("100"), 6, java.math.RoundingMode.HALF_UP);
        BigDecimal emi = CreditAssessmentService.calculateEMI(principal, interestRate, tenureMonths);
        
        BigDecimal remainingPrincipal = principal;
        LocalDateTime startDate = LocalDateTime.now().plusMonths(1);
        List<EMISchedule> schedules = new ArrayList<>();
        
        for (int i = 1; i <= tenureMonths; i++) {
            BigDecimal interestAmount = remainingPrincipal.multiply(monthlyRate);
            BigDecimal principalAmount = emi.subtract(interestAmount);
            remainingPrincipal = remainingPrincipal.subtract(principalAmount);
            
            EMISchedule schedule = new EMISchedule();
            schedule.setLoan(loan);
            schedule.setInstallmentNumber(i);
            schedule.setDueDate(startDate.plusMonths(i - 1));
            schedule.setPrincipalAmount(principalAmount);
            schedule.setInterestAmount(interestAmount);
            schedule.setTotalAmount(emi);
            schedule.setPaidAmount(BigDecimal.ZERO);
            schedule.setIsPaid(false);
            schedules.add(schedule);
        }
        
        emiScheduleRepository.saveAll(schedules);
    }
    
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public void payEMI(String loanId, String emiId, String accountId) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByUser(currentUser)
            .orElseThrow(() -> new CustomException("Customer profile not found", 404));
        
        // Lock EMI schedule first to prevent double payment
        EMISchedule emi = emiScheduleRepository.findByIdWithLock(emiId)
            .orElseThrow(() -> new CustomException("EMI schedule not found", 404));
        
        // Check if already paid (double-check after acquiring lock)
        if (emi.getIsPaid()) {
            throw new CustomException("EMI already paid", 400);
        }
        
        if (!emi.getLoan().getId().equals(loanId)) {
            throw new CustomException("EMI does not belong to this loan", 400);
        }
        
        // Lock loan to prevent concurrent modifications
        Loan loan = loanRepository.findByIdWithLock(loanId)
            .orElseThrow(() -> new CustomException("Loan not found", 404));
        
        if (!loan.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Forbidden", 403);
        }
        
        // Lock account with pessimistic lock to prevent race conditions
        Account account = accountRepository.findByIdWithLock(accountId)
            .orElseThrow(() -> new CustomException("Account not found", 404));
        
        if (!account.getCustomer().getId().equals(customer.getId())) {
            throw new CustomException("Forbidden", 403);
        }
        
        // Check balance with locked account
        if (account.getBalance().compareTo(emi.getTotalAmount()) < 0) {
            throw new CustomException("Insufficient funds", 400);
        }
        
        // Create journal entry for EMI payment using double-entry bookkeeping
        String transactionId = "EMI-PAY-" + loan.getLoanNumber() + "-" + emi.getInstallmentNumber();
        JournalEntry journalEntry = doubleEntryService.createEMIPaymentEntry(
            emi.getPrincipalAmount(),
            emi.getInterestAmount(),
            account,
            loan.getLoanNumber(),
            transactionId
        );
        
        // Update EMI schedule atomically
        emi.setIsPaid(true);
        emi.setPaidAmount(emi.getTotalAmount());
        emi.setPaidAt(LocalDateTime.now());
        
        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setJournalEntry(journalEntry);
        transaction.setTransactionType(TransactionType.PAYMENT);
        transaction.setAmount(emi.getTotalAmount());
        transaction.setBalanceAfter(account.getBalance());
        transaction.setDescription("EMI Payment - Installment #" + emi.getInstallmentNumber() + " for Loan " + loan.getLoanNumber());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setProcessedAt(LocalDateTime.now());
        transaction = transactionRepository.save(transaction);
        
        // Update journal entry with transaction ID
        journalEntry.setTransactionId(transaction.getId());
        journalEntryRepository.save(journalEntry);
        
        emi.setTransaction(transaction);
        emiScheduleRepository.save(emi);
        
        // Update loan amounts atomically
        BigDecimal newAmountPaid = loan.getAmountPaid().add(emi.getTotalAmount());
        BigDecimal newAmountRemaining = loan.getAmountRemaining().subtract(emi.getTotalAmount());
        loan.setAmountPaid(newAmountPaid);
        loan.setAmountRemaining(newAmountRemaining);
        
        // Check if loan is fully paid
        if (newAmountRemaining.compareTo(BigDecimal.ZERO) <= 0) {
            loan.setStatus(LoanStatus.CLOSED);
            loan.setClosedAt(LocalDateTime.now());
        }
        
        loanRepository.save(loan);
        
        // Create notification
        notificationService.createNotification(customer.getUser().getId(), 
            NotificationType.PAYMENT_DUE, "EMI Paid",
            "EMI installment #" + emi.getInstallmentNumber() + " of $" + emi.getTotalAmount() + " has been paid successfully",
            null, "emi_schedule", emiId);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new CustomException("User not found", 404));
    }
}
