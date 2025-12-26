package com.finedge.repository;

import com.finedge.model.Card;
import com.finedge.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, String> {
    List<Card> findByCustomer(Customer customer);
    List<Card> findByCustomerId(String customerId);
    List<Card> findByAccountId(String accountId);
}

