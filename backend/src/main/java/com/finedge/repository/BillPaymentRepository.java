package com.finedge.repository;

import com.finedge.model.BillPayment;
import com.finedge.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillPaymentRepository extends JpaRepository<BillPayment, String> {
    List<BillPayment> findByCustomer(Customer customer);
    List<BillPayment> findByCustomerIdOrderByPaymentDateDesc(String customerId);
    List<BillPayment> findByBillerId(String billerId);
}

