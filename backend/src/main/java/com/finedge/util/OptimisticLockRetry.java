package com.finedge.util;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

/**
 * Utility class for handling optimistic lock retries
 * Provides retry mechanism for operations that may fail due to concurrent modifications
 */
@Component
public class OptimisticLockRetry {
    
    /**
     * Executes a supplier function with retry logic for optimistic lock failures
     * 
     * @param operation The operation to execute
     * @param maxRetries Maximum number of retry attempts
     * @return The result of the operation
     * @throws RuntimeException if operation fails after all retries
     */
    public static <T> T executeWithRetry(Supplier<T> operation, int maxRetries) {
        int attempts = 0;
        RuntimeException lastException = null;
        
        while (attempts < maxRetries) {
            try {
                return operation.get();
            } catch (OptimisticLockingFailureException e) {
                lastException = e;
                attempts++;
                if (attempts < maxRetries) {
                    try {
                        // Exponential backoff: 50ms, 100ms, 200ms, etc.
                        Thread.sleep(50L * (1L << (attempts - 1)));
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Retry interrupted", ie);
                    }
                }
            }
        }
        
        throw new RuntimeException("Operation failed after " + maxRetries + " retries due to concurrent modifications", lastException);
    }
    
    /**
     * Executes a runnable operation with retry logic for optimistic lock failures
     * 
     * @param operation The operation to execute
     * @param maxRetries Maximum number of retry attempts
     * @throws RuntimeException if operation fails after all retries
     */
    public static void executeWithRetry(Runnable operation, int maxRetries) {
        executeWithRetry(() -> {
            operation.run();
            return null;
        }, maxRetries);
    }
}

