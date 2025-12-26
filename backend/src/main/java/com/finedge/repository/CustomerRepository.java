package com.finedge.repository;

import com.finedge.model.Customer;
import com.finedge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Optional<Customer> findByUser(User user);
    Optional<Customer> findByUserId(String userId);
}

