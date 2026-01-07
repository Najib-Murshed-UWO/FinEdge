package com.finedge.repository;

import com.finedge.model.EMISchedule;
import com.finedge.model.Loan;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EMIScheduleRepository extends JpaRepository<EMISchedule, String> {
    List<EMISchedule> findByLoan(Loan loan);
    List<EMISchedule> findByLoanId(String loanId);
    List<EMISchedule> findByLoanIdOrderByInstallmentNumber(String loanId);
    
    @Query("SELECT e FROM EMISchedule e WHERE e.loan.id = :loanId AND e.isPaid = false AND e.dueDate >= :now ORDER BY e.dueDate")
    List<EMISchedule> findUpcomingEMIs(@Param("loanId") String loanId, @Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM EMISchedule e WHERE e.isPaid = false AND e.dueDate < :now")
    List<EMISchedule> findOverdueEMIs(@Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM EMISchedule e WHERE e.loan.id = :loanId AND e.isPaid = false AND e.dueDate < :now")
    List<EMISchedule> findOverdueEMIsByLoanId(@Param("loanId") String loanId, @Param("now") LocalDateTime now);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM EMISchedule e WHERE e.id = :id")
    Optional<EMISchedule> findByIdWithLock(@Param("id") String id);
}

