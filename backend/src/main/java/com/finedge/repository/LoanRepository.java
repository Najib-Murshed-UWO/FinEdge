package com.finedge.repository;

import com.finedge.model.Customer;
import com.finedge.model.Loan;
import com.finedge.model.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, String> {
    List<Loan> findByCustomer(Customer customer);
    List<Loan> findByCustomerId(String customerId);
    Optional<Loan> findByLoanNumber(String loanNumber);
    List<Loan> findByStatus(LoanStatus status);
}

