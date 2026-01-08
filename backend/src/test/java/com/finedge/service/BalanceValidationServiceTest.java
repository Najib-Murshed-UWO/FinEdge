package com.finedge.service;

import com.finedge.model.Account;
import com.finedge.model.ChartOfAccount;
import com.finedge.model.JournalEntry;
import com.finedge.model.LedgerEntry;
import com.finedge.model.enums.AccountCategory;
import com.finedge.repository.AccountRepository;
import com.finedge.repository.ChartOfAccountRepository;
import com.finedge.repository.JournalEntryRepository;
import com.finedge.repository.LedgerEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BalanceValidationServiceTest {
    
    @Mock
    private JournalEntryRepository journalEntryRepository;
    
    @Mock
    private LedgerEntryRepository ledgerEntryRepository;
    
    @Mock
    private AccountRepository accountRepository;
    
    @Mock
    private ChartOfAccountRepository chartOfAccountRepository;
    
    @InjectMocks
    private BalanceValidationService balanceValidationService;
    
    private JournalEntry balancedJournalEntry;
    private JournalEntry unbalancedJournalEntry;
    private Account testAccount;
    private List<LedgerEntry> ledgerEntries;
    
    @BeforeEach
    void setUp() {
        balancedJournalEntry = new JournalEntry();
        balancedJournalEntry.setId("journal-1");
        balancedJournalEntry.setTotalDebit(new BigDecimal("100.00"));
        balancedJournalEntry.setTotalCredit(new BigDecimal("100.00"));
        balancedJournalEntry.setIsBalanced(true);
        
        unbalancedJournalEntry = new JournalEntry();
        unbalancedJournalEntry.setId("journal-2");
        unbalancedJournalEntry.setTotalDebit(new BigDecimal("100.00"));
        unbalancedJournalEntry.setTotalCredit(new BigDecimal("90.00"));
        unbalancedJournalEntry.setIsBalanced(false);
        
        testAccount = new Account();
        testAccount.setId("account-123");
        testAccount.setAccountNumber("ACC001");
        testAccount.setBalance(new BigDecimal("1000.00"));
        
        ledgerEntries = new ArrayList<>();
        LedgerEntry entry1 = new LedgerEntry();
        entry1.setAccount(testAccount);
        entry1.setDebitAmount(new BigDecimal("100.00"));
        entry1.setCreditAmount(BigDecimal.ZERO);
        ledgerEntries.add(entry1);
        
        LedgerEntry entry2 = new LedgerEntry();
        entry2.setAccount(testAccount);
        entry2.setDebitAmount(BigDecimal.ZERO);
        entry2.setCreditAmount(new BigDecimal("100.00"));
        ledgerEntries.add(entry2);
    }
    
    @Test
    void testValidateJournalEntries_AllBalanced() {
        // Arrange
        List<JournalEntry> unbalancedEntries = new ArrayList<>();
        when(journalEntryRepository.findUnbalancedEntries()).thenReturn(unbalancedEntries);
        
        // Act
        Map<String, Object> result = balanceValidationService.validateJournalEntries();
        
        // Assert
        assertNotNull(result);
        assertEquals(0, result.get("totalUnbalanced"));
        assertTrue((Boolean) result.get("isValid"));
        assertTrue(((List<?>) result.get("unbalancedEntries")).isEmpty());
        
        verify(journalEntryRepository).findUnbalancedEntries();
    }
    
    @Test
    void testValidateJournalEntries_SomeUnbalanced() {
        // Arrange
        List<JournalEntry> unbalancedEntries = new ArrayList<>();
        unbalancedEntries.add(unbalancedJournalEntry);
        when(journalEntryRepository.findUnbalancedEntries()).thenReturn(unbalancedEntries);
        
        // Act
        Map<String, Object> result = balanceValidationService.validateJournalEntries();
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.get("totalUnbalanced"));
        assertFalse((Boolean) result.get("isValid"));
        assertEquals(1, ((List<?>) result.get("unbalancedEntries")).size());
    }
    
    @Test
    void testValidateJournalEntry_Balanced() {
        // Arrange
        when(journalEntryRepository.findById("journal-1")).thenReturn(Optional.of(balancedJournalEntry));
        
        // Act
        boolean isValid = balanceValidationService.validateJournalEntry("journal-1");
        
        // Assert
        assertTrue(isValid);
        verify(journalEntryRepository).findById("journal-1");
    }
    
    @Test
    void testValidateJournalEntry_Unbalanced() {
        // Arrange
        when(journalEntryRepository.findById("journal-2")).thenReturn(Optional.of(unbalancedJournalEntry));
        
        // Act
        boolean isValid = balanceValidationService.validateJournalEntry("journal-2");
        
        // Assert
        assertFalse(isValid);
    }
    
    @Test
    void testValidateJournalEntry_NotFound() {
        // Arrange
        when(journalEntryRepository.findById("non-existent")).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            balanceValidationService.validateJournalEntry("non-existent");
        });
    }
    
    @Test
    void testValidateCustomerAccountBalances_AllValid() {
        // Arrange
        List<Account> accounts = new ArrayList<>();
        accounts.add(testAccount);
        
        when(accountRepository.findAll()).thenReturn(accounts);
        when(ledgerEntryRepository.getCustomerAccountBalance(testAccount))
            .thenReturn(new BigDecimal("1000.00"));
        
        // Act
        Map<String, Object> result = balanceValidationService.validateCustomerAccountBalances();
        
        // Assert
        assertNotNull(result);
        assertTrue((Boolean) result.get("isValid"));
        verify(accountRepository).findAll();
    }
    
    @Test
    void testValidateCustomerAccountBalances_Mismatch() {
        // Arrange
        List<Account> accounts = new ArrayList<>();
        accounts.add(testAccount);
        
        when(accountRepository.findAll()).thenReturn(accounts);
        when(ledgerEntryRepository.getCustomerAccountBalance(testAccount))
            .thenReturn(new BigDecimal("900.00")); // Different from account balance
        
        // Act
        Map<String, Object> result = balanceValidationService.validateCustomerAccountBalances();
        
        // Assert
        assertNotNull(result);
        assertFalse((Boolean) result.get("isValid"));
        assertTrue(((List<?>) result.get("mismatchedAccounts")).size() > 0);
    }
    
    @Test
    void testValidateTrialBalance_Success() {
        // Arrange
        List<ChartOfAccount> chartAccounts = new ArrayList<>();
        ChartOfAccount account1 = new ChartOfAccount();
        account1.setAccountCode("1000");
        account1.setAccountName("Cash");
        account1.setAccountCategory(AccountCategory.ASSET);
        account1.setIsActive(true);
        chartAccounts.add(account1);
        
        when(chartOfAccountRepository.findByIsActiveTrue()).thenReturn(chartAccounts);
        when(ledgerEntryRepository.getAccountBalance(account1)).thenReturn(new BigDecimal("5000.00"));
        
        // Act
        Map<String, Object> result = balanceValidationService.validateTrialBalance();
        
        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("totalDebits"));
        assertTrue(result.containsKey("totalCredits"));
        verify(chartOfAccountRepository).findAll();
    }
}

