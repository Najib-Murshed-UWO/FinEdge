package com.finedge.repository;

import com.finedge.model.AutoPay;
import com.finedge.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutoPayRepository extends JpaRepository<AutoPay, String> {
    List<AutoPay> findByCustomer(Customer customer);
    List<AutoPay> findByCustomerId(String customerId);
    List<AutoPay> findByCustomerIdAndEnabledTrue(String customerId);
}

