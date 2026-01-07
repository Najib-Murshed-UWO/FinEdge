package com.finedge.repository;

import com.finedge.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, String> {
    Optional<JournalEntry> findByReference(String reference);
    List<JournalEntry> findByEntryDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<JournalEntry> findByTransactionId(String transactionId);
    
    @Query("SELECT j FROM JournalEntry j WHERE j.isBalanced = false")
    List<JournalEntry> findUnbalancedEntries();
}

