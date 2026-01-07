package com.finedge.repository;

import com.finedge.model.ChartOfAccount;
import com.finedge.model.LedgerEntry;
import com.finedge.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, String> {
    List<LedgerEntry> findByJournalEntryId(String journalEntryId);
    List<LedgerEntry> findByChartOfAccount(ChartOfAccount chartOfAccount);
    List<LedgerEntry> findByAccount(Account account);
    
    @Query("SELECT COALESCE(SUM(l.debitAmount - l.creditAmount), 0) FROM LedgerEntry l WHERE l.chartOfAccount = :chartOfAccount")
    BigDecimal getAccountBalance(@Param("chartOfAccount") ChartOfAccount chartOfAccount);
    
    @Query("SELECT COALESCE(SUM(l.debitAmount - l.creditAmount), 0) FROM LedgerEntry l WHERE l.account = :account")
    BigDecimal getCustomerAccountBalance(@Param("account") Account account);
}

