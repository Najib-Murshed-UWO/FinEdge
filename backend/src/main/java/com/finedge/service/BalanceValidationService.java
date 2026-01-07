package com.finedge.service;

import com.finedge.model.Account;
import com.finedge.model.ChartOfAccount;
import com.finedge.model.JournalEntry;
import com.finedge.model.LedgerEntry;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.ChartOfAccountRepository;
import com.finedge.repository.JournalEntryRepository;
import com.finedge.repository.LedgerEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BalanceValidationService {
    
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    
    @Autowired
    private LedgerEntryRepository ledgerEntryRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private ChartOfAccountRepository chartOfAccountRepository;
    
    /**
     * Validates that all journal entries are balanced (debits = credits)
     */
    @Transactional(readOnly = true)
    public Map<String, Object> validateJournalEntries() {
        Map<String, Object> result = new HashMap<>();
        List<JournalEntry> unbalancedEntries = journalEntryRepository.findUnbalancedEntries();
        
        result.put("totalUnbalanced", unbalancedEntries.size());
        result.put("unbalancedEntries", unbalancedEntries);
        result.put("isValid", unbalancedEntries.isEmpty());
        
        return result;
    }
    
    /**
     * Validates a specific journal entry
     */
    @Transactional(readOnly = true)
    public boolean validateJournalEntry(String journalEntryId) {
        JournalEntry entry = journalEntryRepository.findById(journalEntryId)
            .orElseThrow(() -> new RuntimeException("Journal entry not found"));
        
        List<LedgerEntry> ledgerEntries = ledgerEntryRepository.findByJournalEntryId(journalEntryId);
        
        BigDecimal totalDebit = ledgerEntries.stream()
            .map(LedgerEntry::getDebitAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalCredit = ledgerEntries.stream()
            .map(LedgerEntry::getCreditAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        boolean isBalanced = totalDebit.compareTo(totalCredit) == 0;
        
        // Update journal entry if needed
        if (entry.getIsBalanced() != isBalanced) {
            entry.setIsBalanced(isBalanced);
            entry.setTotalDebit(totalDebit);
            entry.setTotalCredit(totalCredit);
            journalEntryRepository.save(entry);
        }
        
        return isBalanced;
    }
    
    /**
     * Validates customer account balances against ledger entries
     */
    @Transactional(readOnly = true)
    public Map<String, Object> validateCustomerAccountBalances() {
        Map<String, Object> result = new HashMap<>();
        List<Account> accounts = accountRepository.findAll();
        List<Map<String, Object>> discrepancies = new java.util.ArrayList<>();
        
        for (Account account : accounts) {
            BigDecimal ledgerBalance = ledgerEntryRepository.getCustomerAccountBalance(account);
            BigDecimal accountBalance = account.getBalance();
            
            if (ledgerBalance.compareTo(accountBalance) != 0) {
                Map<String, Object> discrepancy = new HashMap<>();
                discrepancy.put("accountId", account.getId());
                discrepancy.put("accountNumber", account.getAccountNumber());
                discrepancy.put("accountBalance", accountBalance);
                discrepancy.put("ledgerBalance", ledgerBalance);
                discrepancy.put("difference", accountBalance.subtract(ledgerBalance));
                discrepancies.add(discrepancy);
            }
        }
        
        result.put("totalAccounts", accounts.size());
        result.put("discrepancies", discrepancies);
        result.put("discrepancyCount", discrepancies.size());
        result.put("isValid", discrepancies.isEmpty());
        
        return result;
    }
    
    /**
     * Validates chart of account balances (trial balance)
     */
    @Transactional(readOnly = true)
    public Map<String, Object> validateTrialBalance() {
        Map<String, Object> result = new HashMap<>();
        List<ChartOfAccount> accounts = chartOfAccountRepository.findByIsActiveTrue();
        List<Map<String, Object>> balances = new java.util.ArrayList<>();
        
        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;
        
        for (ChartOfAccount coa : accounts) {
            BigDecimal balance = ledgerEntryRepository.getAccountBalance(coa);
            
            Map<String, Object> accountBalance = new HashMap<>();
            accountBalance.put("accountCode", coa.getAccountCode());
            accountBalance.put("accountName", coa.getAccountName());
            accountBalance.put("category", coa.getAccountCategory());
            accountBalance.put("balance", balance);
            
            // For assets and expenses, positive balance is debit
            // For liabilities, equity, and revenue, positive balance is credit
            if (coa.getAccountCategory() == com.finedge.model.enums.AccountCategory.ASSET ||
                coa.getAccountCategory() == com.finedge.model.enums.AccountCategory.EXPENSE) {
                if (balance.compareTo(BigDecimal.ZERO) > 0) {
                    totalDebits = totalDebits.add(balance);
                } else {
                    totalCredits = totalCredits.add(balance.abs());
                }
            } else {
                if (balance.compareTo(BigDecimal.ZERO) > 0) {
                    totalCredits = totalCredits.add(balance);
                } else {
                    totalDebits = totalDebits.add(balance.abs());
                }
            }
            
            balances.add(accountBalance);
        }
        
        boolean isBalanced = totalDebits.compareTo(totalCredits) == 0;
        
        result.put("totalDebits", totalDebits);
        result.put("totalCredits", totalCredits);
        result.put("difference", totalDebits.subtract(totalCredits));
        result.put("isBalanced", isBalanced);
        result.put("accountBalances", balances);
        
        return result;
    }
    
    /**
     * Reconciles customer account balance with ledger entries
     */
    @Transactional
    public void reconcileAccountBalance(String accountId) {
        Account account = accountRepository.findById(accountId)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        BigDecimal ledgerBalance = ledgerEntryRepository.getCustomerAccountBalance(account);
        account.setBalance(ledgerBalance);
        accountRepository.save(account);
    }
}

