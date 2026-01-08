package com.finedge.service;

import com.finedge.model.*;
import com.finedge.model.enums.AccountCategory;
import com.finedge.model.enums.TransactionType;
import com.finedge.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoubleEntryServiceTest {
    
    @Mock
    private ChartOfAccountService chartOfAccountService;
    
    @Mock
    private JournalEntryRepository journalEntryRepository;
    
    @Mock
    private LedgerEntryRepository ledgerEntryRepository;
    
    @Mock
    private AccountRepository accountRepository;
    
    @InjectMocks
    private DoubleEntryService doubleEntryService;
    
    private Account testAccount;
    private Account destinationAccount;
    private ChartOfAccount customerDepositsAsset;
    private ChartOfAccount customerDepositsLiability;
    private ChartOfAccount loansReceivable;
    private ChartOfAccount interestIncome;
    
    @BeforeEach
    void setUp() {
        testAccount = new Account();
        testAccount.setId("account-123");
        testAccount.setAccountNumber("ACC001");
        testAccount.setBalance(new BigDecimal("1000.00"));
        
        destinationAccount = new Account();
        destinationAccount.setId("account-456");
        destinationAccount.setAccountNumber("ACC002");
        destinationAccount.setBalance(new BigDecimal("500.00"));
        
        customerDepositsAsset = new ChartOfAccount();
        customerDepositsAsset.setAccountCode("1100");
        customerDepositsAsset.setAccountName("Customer Deposits - Asset");
        customerDepositsAsset.setAccountCategory(AccountCategory.ASSET);
        
        customerDepositsLiability = new ChartOfAccount();
        customerDepositsLiability.setAccountCode("2000");
        customerDepositsLiability.setAccountName("Customer Deposits - Liability");
        customerDepositsLiability.setAccountCategory(AccountCategory.LIABILITY);
        
        loansReceivable = new ChartOfAccount();
        loansReceivable.setAccountCode("1200");
        loansReceivable.setAccountName("Loans Receivable");
        loansReceivable.setAccountCategory(AccountCategory.ASSET);
        
        interestIncome = new ChartOfAccount();
        interestIncome.setAccountCode("4000");
        interestIncome.setAccountName("Interest Income");
        interestIncome.setAccountCategory(AccountCategory.REVENUE);
        
        when(chartOfAccountService.getAccountByCode("1100")).thenReturn(customerDepositsAsset);
        when(chartOfAccountService.getAccountByCode("2000")).thenReturn(customerDepositsLiability);
        when(chartOfAccountService.getAccountByCode("1200")).thenReturn(loansReceivable);
        when(chartOfAccountService.getAccountByCode("4000")).thenReturn(interestIncome);
        
        when(journalEntryRepository.save(any(JournalEntry.class))).thenAnswer(invocation -> {
            JournalEntry je = invocation.getArgument(0);
            if (je.getId() == null) {
                je.setId("journal-" + System.currentTimeMillis());
            }
            return je;
        });
        
        when(ledgerEntryRepository.save(any(LedgerEntry.class))).thenAnswer(invocation -> {
            LedgerEntry le = invocation.getArgument(0);
            if (le.getId() == null) {
                le.setId("ledger-" + System.currentTimeMillis());
            }
            return le;
        });
        
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }
    
    @Test
    void testCreateTransactionEntry_Deposit_Success() {
        // Arrange
        BigDecimal amount = new BigDecimal("100.00");
        
        // Act
        JournalEntry journalEntry = doubleEntryService.createTransactionEntry(
            TransactionType.DEPOSIT,
            amount,
            testAccount,
            null,
            "Test deposit",
            "REF-001",
            "TXN-001"
        );
        
        // Assert
        assertNotNull(journalEntry);
        assertTrue(journalEntry.getIsBalanced());
        assertEquals(amount, journalEntry.getTotalDebit());
        assertEquals(amount, journalEntry.getTotalCredit());
        
        verify(chartOfAccountService).initializeDefaultAccounts();
        verify(journalEntryRepository).save(any(JournalEntry.class));
        verify(ledgerEntryRepository, atLeastOnce()).save(any(LedgerEntry.class));
    }
    
    @Test
    void testCreateTransactionEntry_Withdrawal_Success() {
        // Arrange
        BigDecimal amount = new BigDecimal("50.00");
        
        // Act
        JournalEntry journalEntry = doubleEntryService.createTransactionEntry(
            TransactionType.WITHDRAWAL,
            amount,
            testAccount,
            null,
            "Test withdrawal",
            "REF-002",
            "TXN-002"
        );
        
        // Assert
        assertNotNull(journalEntry);
        assertTrue(journalEntry.getIsBalanced());
        assertEquals(amount, journalEntry.getTotalDebit());
        assertEquals(amount, journalEntry.getTotalCredit());
        
        verify(journalEntryRepository).save(any(JournalEntry.class));
    }
    
    @Test
    void testCreateTransactionEntry_Transfer_Success() {
        // Arrange
        BigDecimal amount = new BigDecimal("100.00");
        
        // Act
        JournalEntry journalEntry = doubleEntryService.createTransactionEntry(
            TransactionType.TRANSFER,
            amount,
            testAccount,
            destinationAccount,
            "Test transfer",
            "REF-003",
            "TXN-003"
        );
        
        // Assert
        assertNotNull(journalEntry);
        assertTrue(journalEntry.getIsBalanced());
        assertEquals(amount, journalEntry.getTotalDebit());
        assertEquals(amount, journalEntry.getTotalCredit());
        
        verify(journalEntryRepository).save(any(JournalEntry.class));
    }
    
    @Test
    void testCreateLoanDisbursementEntry_Success() {
        // Arrange
        BigDecimal amount = new BigDecimal("5000.00");
        String loanNumber = "LOAN-001";
        String transactionId = "TXN-LOAN-001";
        
        // Act
        JournalEntry journalEntry = doubleEntryService.createLoanDisbursementEntry(
            amount,
            testAccount,
            loanNumber,
            transactionId
        );
        
        // Assert
        assertNotNull(journalEntry);
        assertTrue(journalEntry.getIsBalanced());
        assertEquals(amount, journalEntry.getTotalDebit());
        assertEquals(amount, journalEntry.getTotalCredit());
        assertTrue(journalEntry.getDescription().contains(loanNumber));
        
        verify(chartOfAccountService).initializeDefaultAccounts();
        verify(journalEntryRepository).save(any(JournalEntry.class));
        verify(ledgerEntryRepository, times(2)).save(any(LedgerEntry.class));
    }
    
    @Test
    void testCreateEMIPaymentEntry_Success() {
        // Arrange
        BigDecimal principalAmount = new BigDecimal("100.00");
        BigDecimal interestAmount = new BigDecimal("10.00");
        BigDecimal totalAmount = principalAmount.add(interestAmount);
        String loanNumber = "LOAN-001";
        String transactionId = "TXN-EMI-001";
        
        // Act
        JournalEntry journalEntry = doubleEntryService.createEMIPaymentEntry(
            principalAmount,
            interestAmount,
            testAccount,
            loanNumber,
            transactionId
        );
        
        // Assert
        assertNotNull(journalEntry);
        assertTrue(journalEntry.getIsBalanced());
        assertEquals(totalAmount, journalEntry.getTotalDebit());
        assertEquals(totalAmount, journalEntry.getTotalCredit());
        
        verify(chartOfAccountService).initializeDefaultAccounts();
        verify(journalEntryRepository).save(any(JournalEntry.class));
        verify(ledgerEntryRepository, atLeast(2)).save(any(LedgerEntry.class));
    }
    
    @Test
    void testDoubleEntryValidation_Balanced() {
        // Arrange
        BigDecimal amount = new BigDecimal("100.00");
        
        // Act
        JournalEntry journalEntry = doubleEntryService.createTransactionEntry(
            TransactionType.DEPOSIT,
            amount,
            testAccount,
            null,
            "Test",
            "REF",
            "TXN"
        );
        
        // Assert - Should not throw exception
        assertNotNull(journalEntry);
        assertTrue(journalEntry.getIsBalanced());
    }
}

