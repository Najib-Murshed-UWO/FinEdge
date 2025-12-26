package com.finedge.repository;

import com.finedge.model.Customer;
import com.finedge.model.LoanApplication;
import com.finedge.model.enums.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, String> {
    List<LoanApplication> findByCustomer(Customer customer);
    List<LoanApplication> findByCustomerId(String customerId);
    List<LoanApplication> findByStatus(LoanStatus status);
    Page<LoanApplication> findByStatusOrderByCreatedAtDesc(LoanStatus status, Pageable pageable);
}

