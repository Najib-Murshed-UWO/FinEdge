package com.finedge.config;

import io.github.bucket4j.Bucket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class RateLimitConfigTest {
    
    @InjectMocks
    private RateLimitConfig rateLimitConfig;
    
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(rateLimitConfig, "authRequests", 5);
        ReflectionTestUtils.setField(rateLimitConfig, "authWindowMinutes", 1);
        ReflectionTestUtils.setField(rateLimitConfig, "transactionRequests", 20);
        ReflectionTestUtils.setField(rateLimitConfig, "transactionWindowMinutes", 1);
        ReflectionTestUtils.setField(rateLimitConfig, "readOnlyRequests", 100);
        ReflectionTestUtils.setField(rateLimitConfig, "readOnlyWindowMinutes", 1);
        ReflectionTestUtils.setField(rateLimitConfig, "adminRequests", 50);
        ReflectionTestUtils.setField(rateLimitConfig, "adminWindowMinutes", 1);
        ReflectionTestUtils.setField(rateLimitConfig, "generalRequests", 60);
        ReflectionTestUtils.setField(rateLimitConfig, "generalWindowMinutes", 1);
    }
    
    @Test
    void testGetAuthBucket_SameKeyReturnsSameBucket() {
        // Act
        Bucket bucket1 = rateLimitConfig.getAuthBucket("test-key");
        Bucket bucket2 = rateLimitConfig.getAuthBucket("test-key");
        
        // Assert
        assertNotNull(bucket1);
        assertNotNull(bucket2);
        assertSame(bucket1, bucket2);
    }
    
    @Test
    void testGetAuthBucket_DifferentKeysReturnDifferentBuckets() {
        // Act
        Bucket bucket1 = rateLimitConfig.getAuthBucket("key1");
        Bucket bucket2 = rateLimitConfig.getAuthBucket("key2");
        
        // Assert
        assertNotNull(bucket1);
        assertNotNull(bucket2);
        assertNotSame(bucket1, bucket2);
    }
    
    @Test
    void testGetAuthBucket_ConsumesTokens() {
        // Arrange
        Bucket bucket = rateLimitConfig.getAuthBucket("test-key");
        
        // Act & Assert
        assertTrue(bucket.tryConsume(1));
        assertTrue(bucket.tryConsume(1));
        assertTrue(bucket.tryConsume(1));
        assertTrue(bucket.tryConsume(1));
        assertTrue(bucket.tryConsume(1));
        assertFalse(bucket.tryConsume(1)); // Should fail after 5 requests
    }
    
    @Test
    void testGetTransactionBucket_ConsumesTokens() {
        // Arrange
        Bucket bucket = rateLimitConfig.getTransactionBucket("test-key");
        
        // Act & Assert - Should allow 20 requests
        for (int i = 0; i < 20; i++) {
            assertTrue(bucket.tryConsume(1), "Should allow request " + (i + 1));
        }
        assertFalse(bucket.tryConsume(1), "Should reject request after limit");
    }
    
    @Test
    void testGetReadOnlyBucket_ConsumesTokens() {
        // Arrange
        Bucket bucket = rateLimitConfig.getReadOnlyBucket("test-key");
        
        // Act & Assert - Should allow 100 requests
        for (int i = 0; i < 100; i++) {
            assertTrue(bucket.tryConsume(1), "Should allow request " + (i + 1));
        }
        assertFalse(bucket.tryConsume(1), "Should reject request after limit");
    }
    
    @Test
    void testGetAdminBucket_ConsumesTokens() {
        // Arrange
        Bucket bucket = rateLimitConfig.getAdminBucket("test-key");
        
        // Act & Assert - Should allow 50 requests
        for (int i = 0; i < 50; i++) {
            assertTrue(bucket.tryConsume(1), "Should allow request " + (i + 1));
        }
        assertFalse(bucket.tryConsume(1), "Should reject request after limit");
    }
    
    @Test
    void testGetGeneralBucket_ConsumesTokens() {
        // Arrange
        Bucket bucket = rateLimitConfig.getGeneralBucket("test-key");
        
        // Act & Assert - Should allow 60 requests
        for (int i = 0; i < 60; i++) {
            assertTrue(bucket.tryConsume(1), "Should allow request " + (i + 1));
        }
        assertFalse(bucket.tryConsume(1), "Should reject request after limit");
    }
    
    @Test
    void testClearBucket() {
        // Arrange
        Bucket bucket1 = rateLimitConfig.getAuthBucket("test-key");
        rateLimitConfig.clearBucket("auth:test-key");
        
        // Act
        Bucket bucket2 = rateLimitConfig.getAuthBucket("test-key");
        
        // Assert - Should be a new bucket instance
        assertNotSame(bucket1, bucket2);
    }
    
    @Test
    void testClearAllBuckets() {
        // Arrange
        Bucket bucket1 = rateLimitConfig.getAuthBucket("key1");
        Bucket bucket2 = rateLimitConfig.getTransactionBucket("key2");
        
        // Act
        rateLimitConfig.clearAllBuckets();
        
        // Assert - New buckets should be created
        Bucket bucket3 = rateLimitConfig.getAuthBucket("key1");
        Bucket bucket4 = rateLimitConfig.getTransactionBucket("key2");
        
        assertNotSame(bucket1, bucket3);
        assertNotSame(bucket2, bucket4);
    }
}

