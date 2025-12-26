package com.finedge.model.enums;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRole {
    BANKER, CUSTOMER, ADMIN;

    @JsonCreator
    public static UserRole from(String value) {
        return UserRole.valueOf(value.trim().toUpperCase());
    }
}


