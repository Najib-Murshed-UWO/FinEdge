package com.finedge.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

// Utility class for enum conversion if needed
// PostgreSQL enums are stored in lowercase, Java enums are uppercase
// JPA's @Enumerated(EnumType.STRING) handles this automatically
// but we may need custom converters for specific cases

