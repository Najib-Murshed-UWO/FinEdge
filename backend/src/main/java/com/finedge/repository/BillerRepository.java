package com.finedge.repository;

import com.finedge.model.Biller;
import com.finedge.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillerRepository extends JpaRepository<Biller, String> {
    List<Biller> findByCustomer(Customer customer);
    List<Biller> findByCustomerId(String customerId);
}

