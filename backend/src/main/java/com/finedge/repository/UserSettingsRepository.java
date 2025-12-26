package com.finedge.repository;

import com.finedge.model.User;
import com.finedge.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, String> {
    Optional<UserSettings> findByUser(User user);
    Optional<UserSettings> findByUserId(String userId);
}

