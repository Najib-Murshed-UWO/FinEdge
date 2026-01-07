package com.finedge.service;

import com.finedge.model.ChartOfAccount;
import com.finedge.model.enums.AccountCategory;
import com.finedge.repository.ChartOfAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChartOfAccountService {
    
    @Autowired
    private ChartOfAccountRepository chartOfAccountRepository;
    
    /**
     * Initialize default chart of accounts for the banking system
     */
    @Transactional
    public void initializeDefaultAccounts() {
        // Check if accounts already exist
        if (chartOfAccountRepository.count() > 0) {
            return; // Already initialized
        }
        
        // ASSET Accounts
        createAccount("1000", "Cash and Cash Equivalents", AccountCategory.ASSET, null, "Bank's cash reserves");
        createAccount("1100", "Customer Deposits - Asset", AccountCategory.ASSET, null, "Cash held for customer deposits");
        createAccount("1200", "Loans Receivable", AccountCategory.ASSET, null, "Outstanding loans to customers");
        
        // LIABILITY Accounts
        createAccount("2000", "Customer Deposits - Liability", AccountCategory.LIABILITY, null, "Customer deposit liabilities");
        createAccount("2100", "Interest Payable", AccountCategory.LIABILITY, null, "Interest owed to customers");
        createAccount("2200", "Loan Disbursements Payable", AccountCategory.LIABILITY, null, "Pending loan disbursements");
        
        // EQUITY Accounts
        createAccount("3000", "Bank Capital", AccountCategory.EQUITY, null, "Bank's equity capital");
        createAccount("3100", "Retained Earnings", AccountCategory.EQUITY, null, "Accumulated retained earnings");
        
        // REVENUE Accounts
        createAccount("4000", "Interest Income", AccountCategory.REVENUE, null, "Interest earned on loans");
        createAccount("4100", "Service Fees", AccountCategory.REVENUE, null, "Service and transaction fees");
        createAccount("4200", "Loan Processing Fees", AccountCategory.REVENUE, null, "Fees from loan processing");
        
        // EXPENSE Accounts
        createAccount("5000", "Interest Expense", AccountCategory.EXPENSE, null, "Interest paid to customers");
        createAccount("5100", "Operating Expenses", AccountCategory.EXPENSE, null, "General operating expenses");
        createAccount("5200", "Loan Loss Provision", AccountCategory.EXPENSE, null, "Provision for loan losses");
    }
    
    private ChartOfAccount createAccount(String code, String name, AccountCategory category, 
                                        ChartOfAccount parent, String description) {
        ChartOfAccount account = new ChartOfAccount();
        account.setAccountCode(code);
        account.setAccountName(name);
        account.setAccountCategory(category);
        account.setParentAccount(parent);
        account.setDescription(description);
        account.setIsActive(true);
        return chartOfAccountRepository.save(account);
    }
    
    public ChartOfAccount getAccountByCode(String code) {
        return chartOfAccountRepository.findByAccountCode(code)
            .orElseThrow(() -> new RuntimeException("Chart of account not found: " + code));
    }
    
    public List<ChartOfAccount> getAllActiveAccounts() {
        return chartOfAccountRepository.findByIsActiveTrue();
    }
}

