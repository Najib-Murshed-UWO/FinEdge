package com.finedge.repository;

import com.finedge.model.Account;
import com.finedge.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByAccount(Account account);
    List<Transaction> findByAccountId(String accountId);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.customer.id = :customerId OR (t.toAccount IS NOT NULL AND t.toAccount.customer.id = :customerId)")
    List<Transaction> findByCustomerId(@Param("customerId") String customerId);
    
    Page<Transaction> findByAccountIdOrderByCreatedAtDesc(String accountId, Pageable pageable);
}

