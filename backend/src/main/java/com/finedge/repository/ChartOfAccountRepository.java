package com.finedge.repository;

import com.finedge.model.ChartOfAccount;
import com.finedge.model.enums.AccountCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChartOfAccountRepository extends JpaRepository<ChartOfAccount, String> {
    Optional<ChartOfAccount> findByAccountCode(String accountCode);
    List<ChartOfAccount> findByAccountCategory(AccountCategory category);
    List<ChartOfAccount> findByIsActiveTrue();
    List<ChartOfAccount> findByParentAccount(ChartOfAccount parentAccount);
}

