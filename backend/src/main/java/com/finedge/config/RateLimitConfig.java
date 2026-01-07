package com.finedge.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {
    
    @Value("${rate-limit.auth.requests:5}")
    private int authRequests;
    
    @Value("${rate-limit.auth.window-minutes:1}")
    private int authWindowMinutes;
    
    @Value("${rate-limit.transaction.requests:20}")
    private int transactionRequests;
    
    @Value("${rate-limit.transaction.window-minutes:1}")
    private int transactionWindowMinutes;
    
    @Value("${rate-limit.read-only.requests:100}")
    private int readOnlyRequests;
    
    @Value("${rate-limit.read-only.window-minutes:1}")
    private int readOnlyWindowMinutes;
    
    @Value("${rate-limit.admin.requests:50}")
    private int adminRequests;
    
    @Value("${rate-limit.admin.window-minutes:1}")
    private int adminWindowMinutes;
    
    @Value("${rate-limit.general.requests:60}")
    private int generalRequests;
    
    @Value("${rate-limit.general.window-minutes:1}")
    private int generalWindowMinutes;
    
    // In-memory cache for rate limit buckets (per key)
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    /**
     * Get or create a bucket for authentication endpoints (login, register, refresh)
     */
    public Bucket getAuthBucket(String key) {
        return cache.computeIfAbsent("auth:" + key, k -> createBucket(authRequests, authWindowMinutes));
    }
    
    /**
     * Get or create a bucket for transaction creation endpoints
     */
    public Bucket getTransactionBucket(String key) {
        return cache.computeIfAbsent("transaction:" + key, k -> createBucket(transactionRequests, transactionWindowMinutes));
    }
    
    /**
     * Get or create a bucket for read-only endpoints (GET requests)
     */
    public Bucket getReadOnlyBucket(String key) {
        return cache.computeIfAbsent("read:" + key, k -> createBucket(readOnlyRequests, readOnlyWindowMinutes));
    }
    
    /**
     * Get or create a bucket for admin endpoints
     */
    public Bucket getAdminBucket(String key) {
        return cache.computeIfAbsent("admin:" + key, k -> createBucket(adminRequests, adminWindowMinutes));
    }
    
    /**
     * Get or create a bucket for general API endpoints
     */
    public Bucket getGeneralBucket(String key) {
        return cache.computeIfAbsent("general:" + key, k -> createBucket(generalRequests, generalWindowMinutes));
    }
    
    /**
     * Create a bucket with specified capacity and refill rate
     */
    private Bucket createBucket(int capacity, int windowMinutes) {
        // Using the builder pattern for non-deprecated API
        Bandwidth limit = Bandwidth.builder()
                .capacity(capacity)
                .refillIntervally(capacity, Duration.ofMinutes(windowMinutes))
                .build();
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    /**
     * Clear bucket for a specific key (useful for testing or manual reset)
     */
    public void clearBucket(String key) {
        cache.remove(key);
    }
    
    /**
     * Clear all buckets (useful for testing)
     */
    public void clearAllBuckets() {
        cache.clear();
    }
}

