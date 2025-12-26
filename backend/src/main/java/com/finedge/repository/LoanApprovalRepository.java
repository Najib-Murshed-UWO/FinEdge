package com.finedge.repository;

import com.finedge.model.LoanApproval;
import com.finedge.model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanApprovalRepository extends JpaRepository<LoanApproval, String> {
    List<LoanApproval> findByLoanApplication(LoanApplication loanApplication);
    List<LoanApproval> findByLoanApplicationId(String loanApplicationId);
    List<LoanApproval> findByLoanApplicationIdOrderByStep(String loanApplicationId);
}

