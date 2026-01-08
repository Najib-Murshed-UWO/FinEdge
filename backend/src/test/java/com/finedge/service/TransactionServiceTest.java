package com.finedge.service;

import com.finedge.dto.TransactionRequest;
import com.finedge.exception.CustomException;
import com.finedge.model.*;
import com.finedge.model.enums.TransactionStatus;
import com.finedge.model.enums.TransactionType;
import com.finedge.model.enums.UserRole;
import com.finedge.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @Mock
    private AccountRepository accountRepository;
    
    @Mock
    private CustomerRepository customerRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private AuditService auditService;
    
    @Mock
    private NotificationService notificationService;
    
    @Mock
    private DoubleEntryService doubleEntryService;
    
    @Mock
    private JournalEntryRepository journalEntryRepository;
    
    @Mock
    private HttpServletRequest httpRequest;
    
    @InjectMocks
    private TransactionService transactionService;
    
    private User testUser;
    private Customer testCustomer;
    private Account testAccount;
    private Account destinationAccount;
    private TransactionRequest transactionRequest;
    private JournalEntry journalEntry;
    
    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        
        testUser = new User();
        testUser.setId("user-123");
        testUser.setUsername("testuser");
        testUser.setRole(UserRole.CUSTOMER);
        
        testCustomer = new Customer();
        testCustomer.setId("customer-123");
        testCustomer.setUser(testUser);
        
        testAccount = new Account();
        testAccount.setId("account-123");
        testAccount.setAccountNumber("ACC001");
        testAccount.setBalance(new BigDecimal("1000.00"));
        testAccount.setCustomer(testCustomer);
        
        destinationAccount = new Account();
        destinationAccount.setId("account-456");
        destinationAccount.setAccountNumber("ACC002");
        destinationAccount.setBalance(new BigDecimal("500.00"));
        destinationAccount.setCustomer(testCustomer);
        
        journalEntry = new JournalEntry();
        journalEntry.setId("journal-123");
        journalEntry.setTransactionId("TXN-123");
        
        transactionRequest = new TransactionRequest();
        transactionRequest.setAccountId("account-123");
        transactionRequest.setAmount(new BigDecimal("100.00"));
        transactionRequest.setTransactionType(TransactionType.DEPOSIT);
        transactionRequest.setDescription("Test transaction");
    }
    
    @Test
    void testGetMyTransactions_Success() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(customerRepository.findByUser(testUser)).thenReturn(Optional.of(testCustomer));
        
        List<Transaction> transactions = new ArrayList<>();
        Transaction t1 = new Transaction();
        t1.setId("txn-1");
        t1.setCreatedAt(LocalDateTime.now().minusHours(1));
        Transaction t2 = new Transaction();
        t2.setId("txn-2");
        t2.setCreatedAt(LocalDateTime.now());
        transactions.add(t1);
        transactions.add(t2);
        
        when(transactionRepository.findByCustomerId("customer-123")).thenReturn(transactions);
        
        // Act
        List<Transaction> result = transactionService.getMyTransactions(10, 0);
        
        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(userRepository).findByUsername("testuser");
        verify(customerRepository).findByUser(testUser);
        verify(transactionRepository).findByCustomerId("customer-123");
    }
    
    @Test
    void testGetAccountTransactions_Success() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findById("account-123")).thenReturn(Optional.of(testAccount));
        when(customerRepository.findByUser(testUser)).thenReturn(Optional.of(testCustomer));
        
        List<Transaction> transactions = new ArrayList<>();
        Transaction t1 = new Transaction();
        t1.setId("txn-1");
        t1.setCreatedAt(LocalDateTime.now());
        transactions.add(t1);
        
        when(transactionRepository.findByAccount(testAccount)).thenReturn(transactions);
        
        // Act
        List<Transaction> result = transactionService.getAccountTransactions("account-123", 10, 0);
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(accountRepository).findById("account-123");
    }
    
    @Test
    void testGetAccountTransactions_Forbidden() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        Customer otherCustomer = new Customer();
        otherCustomer.setId("customer-456");
        testAccount.setCustomer(otherCustomer);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findById("account-123")).thenReturn(Optional.of(testAccount));
        when(customerRepository.findByUser(testUser)).thenReturn(Optional.of(testCustomer));
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            transactionService.getAccountTransactions("account-123", 10, 0);
        });
        
        assertEquals("Forbidden", exception.getMessage());
        assertEquals(403, exception.getStatusCode());
    }
    
    @Test
    void testCreateTransaction_Deposit_Success() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        transactionRequest.setTransactionType(TransactionType.DEPOSIT);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findByIdWithLock("account-123")).thenReturn(Optional.of(testAccount));
        when(customerRepository.findByUser(testUser)).thenReturn(Optional.of(testCustomer));
        when(doubleEntryService.createTransactionEntry(any(), any(), any(), any(), any(), any(), any()))
            .thenReturn(journalEntry);
        
        Transaction savedTransaction = new Transaction();
        savedTransaction.setId("txn-123");
        savedTransaction.setAccount(testAccount);
        savedTransaction.setAmount(new BigDecimal("100.00"));
        savedTransaction.setStatus(TransactionStatus.COMPLETED);
        
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(journalEntry);
        
        // Act
        Transaction result = transactionService.createTransaction(transactionRequest, httpRequest);
        
        // Assert
        assertNotNull(result);
        verify(accountRepository).findByIdWithLock("account-123");
        verify(doubleEntryService).createTransactionEntry(any(), any(), any(), any(), any(), any(), any());
        verify(transactionRepository).save(any(Transaction.class));
        verify(notificationService).createNotification(anyString(), any(), anyString(), anyString(), any(), anyString(), anyString());
        verify(auditService).createAuditLog(anyString(), any(), anyString(), anyString(), any(), any(), any());
    }
    
    @Test
    void testCreateTransaction_Withdrawal_Success() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        transactionRequest.setTransactionType(TransactionType.WITHDRAWAL);
        transactionRequest.setAmount(new BigDecimal("50.00"));
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findByIdWithLock("account-123")).thenReturn(Optional.of(testAccount));
        when(customerRepository.findByUser(testUser)).thenReturn(Optional.of(testCustomer));
        when(doubleEntryService.createTransactionEntry(any(), any(), any(), any(), any(), any(), any()))
            .thenReturn(journalEntry);
        
        Transaction savedTransaction = new Transaction();
        savedTransaction.setId("txn-123");
        savedTransaction.setAccount(testAccount);
        savedTransaction.setAmount(new BigDecimal("50.00"));
        savedTransaction.setStatus(TransactionStatus.COMPLETED);
        
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(journalEntry);
        
        // Act
        Transaction result = transactionService.createTransaction(transactionRequest, httpRequest);
        
        // Assert
        assertNotNull(result);
        verify(accountRepository).findByIdWithLock("account-123");
    }
    
    @Test
    void testCreateTransaction_Withdrawal_InsufficientFunds() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        transactionRequest.setTransactionType(TransactionType.WITHDRAWAL);
        transactionRequest.setAmount(new BigDecimal("2000.00")); // More than balance
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findByIdWithLock("account-123")).thenReturn(Optional.of(testAccount));
        when(customerRepository.findByUser(testUser)).thenReturn(Optional.of(testCustomer));
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            transactionService.createTransaction(transactionRequest, httpRequest);
        });
        
        assertEquals("Insufficient funds", exception.getMessage());
        assertEquals(400, exception.getStatusCode());
        verify(doubleEntryService, never()).createTransactionEntry(any(), any(), any(), any(), any(), any(), any());
    }
    
    @Test
    void testCreateTransaction_Transfer_Success() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        transactionRequest.setTransactionType(TransactionType.TRANSFER);
        transactionRequest.setAmount(new BigDecimal("100.00"));
        transactionRequest.setToAccountId("account-456");
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findByIdWithLock("account-123")).thenReturn(Optional.of(testAccount));
        when(accountRepository.findByIdWithLock("account-456")).thenReturn(Optional.of(destinationAccount));
        when(customerRepository.findByUser(testUser)).thenReturn(Optional.of(testCustomer));
        when(doubleEntryService.createTransactionEntry(any(), any(), any(), any(), any(), any(), any()))
            .thenReturn(journalEntry);
        
        Transaction savedTransaction = new Transaction();
        savedTransaction.setId("txn-123");
        savedTransaction.setAccount(testAccount);
        savedTransaction.setAmount(new BigDecimal("100.00"));
        savedTransaction.setStatus(TransactionStatus.COMPLETED);
        
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(journalEntry);
        
        // Act
        Transaction result = transactionService.createTransaction(transactionRequest, httpRequest);
        
        // Assert
        assertNotNull(result);
        verify(accountRepository).findByIdWithLock("account-123");
        verify(accountRepository).findByIdWithLock("account-456");
        verify(transactionRepository, times(2)).save(any(Transaction.class)); // Original + transfer transaction
    }
    
    @Test
    void testCreateTransaction_AccountNotFound() {
        // Arrange
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findByIdWithLock("account-123")).thenReturn(Optional.empty());
        
        // Act & Assert
        CustomException exception = assertThrows(CustomException.class, () -> {
            transactionService.createTransaction(transactionRequest, httpRequest);
        });
        
        assertEquals("Account not found", exception.getMessage());
        assertEquals(404, exception.getStatusCode());
    }
}

