package com.finedge.repository;

import com.finedge.model.BillReminder;
import com.finedge.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillReminderRepository extends JpaRepository<BillReminder, String> {
    List<BillReminder> findByCustomer(Customer customer);
    List<BillReminder> findByCustomerId(String customerId);
    List<BillReminder> findByCustomerIdAndEnabledTrue(String customerId);
}

