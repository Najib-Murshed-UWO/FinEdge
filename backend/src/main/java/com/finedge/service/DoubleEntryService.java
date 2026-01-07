package com.finedge.service;

import com.finedge.model.*;
import com.finedge.model.enums.TransactionType;
import com.finedge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for handling double-entry bookkeeping operations
 */
@Service
public class DoubleEntryService {
    
    @Autowired
    private ChartOfAccountService chartOfAccountService;
    
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    
    @Autowired
    private LedgerEntryRepository ledgerEntryRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    /**
     * Creates a journal entry with ledger entries for a transaction
     */
    @Transactional
    public JournalEntry createTransactionEntry(TransactionType transactionType, BigDecimal amount,
                                               Account account, Account toAccount, String description, 
                                               String reference, String transactionId) {
        // Ensure chart of accounts is initialized
        chartOfAccountService.initializeDefaultAccounts();
        
        // Create journal entry
        JournalEntry journalEntry = new JournalEntry();
        journalEntry.setEntryDate(LocalDateTime.now());
        journalEntry.setReference(reference != null ? reference : "JE-" + System.currentTimeMillis());
        journalEntry.setDescription(description);
        journalEntry.setTransactionId(transactionId);
        
        // Create ledger entries based on transaction type
        List<LedgerEntry> ledgerEntries = createLedgerEntriesForTransaction(
            journalEntry, transactionType, amount, account, toAccount, description
        );
        
        // Validate double-entry
        validateDoubleEntry(ledgerEntries);
        
        // Calculate totals
        BigDecimal totalDebit = calculateTotalDebit(ledgerEntries);
        BigDecimal totalCredit = calculateTotalCredit(ledgerEntries);
        
        journalEntry.setTotalDebit(totalDebit);
        journalEntry.setTotalCredit(totalCredit);
        journalEntry.setIsBalanced(true);
        journalEntry = journalEntryRepository.save(journalEntry);
        
        // Save ledger entries
        for (LedgerEntry entry : ledgerEntries) {
            entry.setJournalEntry(journalEntry);
            ledgerEntryRepository.save(entry);
        }
        
        // Update account balances
        updateAccountBalancesFromLedger(ledgerEntries);
        
        return journalEntry;
    }
    
    /**
     * Creates ledger entries for loan disbursement
     */
    @Transactional
    public JournalEntry createLoanDisbursementEntry(BigDecimal amount, Account account, 
                                                    String loanNumber, String transactionId) {
        chartOfAccountService.initializeDefaultAccounts();
        
        ChartOfAccount loansReceivable = chartOfAccountService.getAccountByCode("1200");
        ChartOfAccount customerDepositsLiability = chartOfAccountService.getAccountByCode("2000");
        
        JournalEntry journalEntry = new JournalEntry();
        journalEntry.setEntryDate(LocalDateTime.now());
        journalEntry.setReference("LOAN-DISB-" + loanNumber);
        journalEntry.setDescription("Loan disbursement - " + loanNumber);
        journalEntry.setTransactionId(transactionId);
        
        List<LedgerEntry> ledgerEntries = new ArrayList<>();
        
        // Debit: Customer Account (Asset) - money goes to customer
        LedgerEntry debit = new LedgerEntry();
        debit.setJournalEntry(journalEntry);
        debit.setAccount(account);
        debit.setChartOfAccount(customerDepositsLiability);
        debit.setDebitAmount(amount);
        debit.setCreditAmount(BigDecimal.ZERO);
        debit.setDescription("Loan disbursement to " + account.getAccountNumber());
        ledgerEntries.add(debit);
        
        // Credit: Loans Receivable (Asset) - bank's loan asset increases
        LedgerEntry credit = new LedgerEntry();
        credit.setJournalEntry(journalEntry);
        credit.setAccount(account);
        credit.setChartOfAccount(loansReceivable);
        credit.setDebitAmount(BigDecimal.ZERO);
        credit.setCreditAmount(amount);
        credit.setDescription("Loan receivable - " + loanNumber);
        ledgerEntries.add(credit);
        
        // Validate and save
        validateDoubleEntry(ledgerEntries);
        
        BigDecimal totalDebit = calculateTotalDebit(ledgerEntries);
        BigDecimal totalCredit = calculateTotalCredit(ledgerEntries);
        
        journalEntry.setTotalDebit(totalDebit);
        journalEntry.setTotalCredit(totalCredit);
        journalEntry.setIsBalanced(true);
        journalEntry = journalEntryRepository.save(journalEntry);
        
        for (LedgerEntry entry : ledgerEntries) {
            entry.setJournalEntry(journalEntry);
            ledgerEntryRepository.save(entry);
        }
        
        updateAccountBalancesFromLedger(ledgerEntries);
        
        return journalEntry;
    }
    
    /**
     * Creates ledger entries for EMI payment
     */
    @Transactional
    public JournalEntry createEMIPaymentEntry(BigDecimal principalAmount, BigDecimal interestAmount,
                                              Account account, String loanNumber, String transactionId) {
        chartOfAccountService.initializeDefaultAccounts();
        
        ChartOfAccount loansReceivable = chartOfAccountService.getAccountByCode("1200");
        ChartOfAccount interestIncome = chartOfAccountService.getAccountByCode("4000");
        ChartOfAccount customerDepositsLiability = chartOfAccountService.getAccountByCode("2000");
        
        JournalEntry journalEntry = new JournalEntry();
        journalEntry.setEntryDate(LocalDateTime.now());
        journalEntry.setReference("EMI-PAY-" + loanNumber + "-" + System.currentTimeMillis());
        journalEntry.setDescription("EMI payment for loan " + loanNumber);
        journalEntry.setTransactionId(transactionId);
        
        List<LedgerEntry> ledgerEntries = new ArrayList<>();
        BigDecimal totalAmount = principalAmount.add(interestAmount);
        
        // Debit: Customer Deposits Liability (reducing customer's deposit liability)
        LedgerEntry debit1 = new LedgerEntry();
        debit1.setJournalEntry(journalEntry);
        debit1.setAccount(account);
        debit1.setChartOfAccount(customerDepositsLiability);
        debit1.setDebitAmount(totalAmount);
        debit1.setCreditAmount(BigDecimal.ZERO);
        debit1.setDescription("EMI payment from " + account.getAccountNumber());
        ledgerEntries.add(debit1);
        
        // Credit: Loans Receivable (reducing loan asset) - Principal portion
        LedgerEntry credit1 = new LedgerEntry();
        credit1.setJournalEntry(journalEntry);
        credit1.setAccount(account);
        credit1.setChartOfAccount(loansReceivable);
        credit1.setDebitAmount(BigDecimal.ZERO);
        credit1.setCreditAmount(principalAmount);
        credit1.setDescription("Principal payment - " + loanNumber);
        ledgerEntries.add(credit1);
        
        // Credit: Interest Income (Revenue) - Interest portion
        LedgerEntry credit2 = new LedgerEntry();
        credit2.setJournalEntry(journalEntry);
        credit2.setAccount(account);
        credit2.setChartOfAccount(interestIncome);
        credit2.setDebitAmount(BigDecimal.ZERO);
        credit2.setCreditAmount(interestAmount);
        credit2.setDescription("Interest income - " + loanNumber);
        ledgerEntries.add(credit2);
        
        // Validate and save
        validateDoubleEntry(ledgerEntries);
        
        BigDecimal totalDebit = calculateTotalDebit(ledgerEntries);
        BigDecimal totalCredit = calculateTotalCredit(ledgerEntries);
        
        journalEntry.setTotalDebit(totalDebit);
        journalEntry.setTotalCredit(totalCredit);
        journalEntry.setIsBalanced(true);
        journalEntry = journalEntryRepository.save(journalEntry);
        
        for (LedgerEntry entry : ledgerEntries) {
            entry.setJournalEntry(journalEntry);
            ledgerEntryRepository.save(entry);
        }
        
        updateAccountBalancesFromLedger(ledgerEntries);
        
        return journalEntry;
    }
    
    /**
     * Creates ledger entries for a transaction
     */
    private List<LedgerEntry> createLedgerEntriesForTransaction(JournalEntry journalEntry,
                                                                TransactionType transactionType,
                                                                BigDecimal amount, Account account,
                                                                Account toAccount, String description) {
        List<LedgerEntry> ledgerEntries = new ArrayList<>();
        
        ChartOfAccount customerDepositsLiability = chartOfAccountService.getAccountByCode("2000");
        ChartOfAccount cashAsset = chartOfAccountService.getAccountByCode("1100");
        
        switch (transactionType) {
            case DEPOSIT:
                // Debit: Customer Account (Asset)
                LedgerEntry debit1 = new LedgerEntry();
                debit1.setJournalEntry(journalEntry);
                debit1.setAccount(account);
                debit1.setChartOfAccount(cashAsset);
                debit1.setDebitAmount(amount);
                debit1.setCreditAmount(BigDecimal.ZERO);
                debit1.setDescription(description != null ? description : "Deposit to " + account.getAccountNumber());
                ledgerEntries.add(debit1);
                
                // Credit: Customer Deposits Liability
                LedgerEntry credit1 = new LedgerEntry();
                credit1.setJournalEntry(journalEntry);
                credit1.setAccount(account);
                credit1.setChartOfAccount(customerDepositsLiability);
                credit1.setDebitAmount(BigDecimal.ZERO);
                credit1.setCreditAmount(amount);
                credit1.setDescription("Customer deposit liability");
                ledgerEntries.add(credit1);
                break;
                
            case WITHDRAWAL:
            case PAYMENT:
                // Debit: Customer Deposits Liability (reducing liability)
                LedgerEntry debit2 = new LedgerEntry();
                debit2.setJournalEntry(journalEntry);
                debit2.setAccount(account);
                debit2.setChartOfAccount(customerDepositsLiability);
                debit2.setDebitAmount(amount);
                debit2.setCreditAmount(BigDecimal.ZERO);
                debit2.setDescription(description != null ? description : "Withdrawal from " + account.getAccountNumber());
                ledgerEntries.add(debit2);
                
                // Credit: Customer Account (Asset)
                LedgerEntry credit2 = new LedgerEntry();
                credit2.setJournalEntry(journalEntry);
                credit2.setAccount(account);
                credit2.setChartOfAccount(cashAsset);
                credit2.setDebitAmount(BigDecimal.ZERO);
                credit2.setCreditAmount(amount);
                credit2.setDescription("Cash withdrawal");
                ledgerEntries.add(credit2);
                break;
                
            case TRANSFER:
                if (toAccount == null) {
                    throw new RuntimeException("Destination account required for transfer");
                }
                
                // Debit: Destination Account (Asset)
                LedgerEntry debit3 = new LedgerEntry();
                debit3.setJournalEntry(journalEntry);
                debit3.setAccount(toAccount);
                debit3.setChartOfAccount(cashAsset);
                debit3.setDebitAmount(amount);
                debit3.setCreditAmount(BigDecimal.ZERO);
                debit3.setDescription(description != null ? description : "Transfer to " + toAccount.getAccountNumber());
                ledgerEntries.add(debit3);
                
                // Credit: Source Account (Asset)
                LedgerEntry credit3 = new LedgerEntry();
                credit3.setJournalEntry(journalEntry);
                credit3.setAccount(account);
                credit3.setChartOfAccount(cashAsset);
                credit3.setDebitAmount(BigDecimal.ZERO);
                credit3.setCreditAmount(amount);
                credit3.setDescription("Transfer from " + account.getAccountNumber());
                ledgerEntries.add(credit3);
                break;
                
            default:
                throw new RuntimeException("Unsupported transaction type: " + transactionType);
        }
        
        return ledgerEntries;
    }
    
    /**
     * Validates that debits equal credits
     */
    private void validateDoubleEntry(List<LedgerEntry> ledgerEntries) {
        BigDecimal totalDebit = calculateTotalDebit(ledgerEntries);
        BigDecimal totalCredit = calculateTotalCredit(ledgerEntries);
        
        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new RuntimeException(
                String.format("Double-entry validation failed: Debits ($%s) must equal Credits ($%s)", 
                    totalDebit, totalCredit)
            );
        }
    }
    
    private BigDecimal calculateTotalDebit(List<LedgerEntry> ledgerEntries) {
        return ledgerEntries.stream()
            .map(LedgerEntry::getDebitAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    private BigDecimal calculateTotalCredit(List<LedgerEntry> ledgerEntries) {
        return ledgerEntries.stream()
            .map(LedgerEntry::getCreditAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Updates account balances based on ledger entries
     */
    private void updateAccountBalancesFromLedger(List<LedgerEntry> ledgerEntries) {
        Map<Account, BigDecimal> balanceChanges = new HashMap<>();
        
        for (LedgerEntry entry : ledgerEntries) {
            if (entry.getAccount() != null) {
                BigDecimal change = entry.getDebitAmount().subtract(entry.getCreditAmount());
                balanceChanges.merge(entry.getAccount(), change, BigDecimal::add);
                
                // Store balance after this entry
                BigDecimal currentBalance = entry.getAccount().getBalance();
                entry.setBalanceAfter(currentBalance.add(change));
            }
        }
        
        // Update account balances
        for (Map.Entry<Account, BigDecimal> entry : balanceChanges.entrySet()) {
            Account account = entry.getKey();
            BigDecimal change = entry.getValue();
            BigDecimal newBalance = account.getBalance().add(change);
            account.setBalance(newBalance);
            accountRepository.save(account);
        }
    }
}

