package com.finedge.security;

import com.finedge.config.RateLimitConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    
    @Autowired
    private RateLimitConfig rateLimitConfig;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                    @NonNull HttpServletResponse response, 
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // Skip rate limiting for health check endpoints
        if (path.startsWith("/api/health") || path.startsWith("/api/ready") || path.startsWith("/api/live")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Determine rate limit key (use IP for unauthenticated, user ID for authenticated)
        String rateLimitKey = getRateLimitKey(request);
        
        // Determine which bucket to use based on endpoint
        Bucket bucket = getBucketForEndpoint(path, method, rateLimitKey);
        
        // Check if request is allowed
        if (bucket.tryConsume(1)) {
            // Add rate limit headers
            addRateLimitHeaders(response, bucket);
            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            handleRateLimitExceeded(response, bucket);
        }
    }
    
    /**
     * Get rate limit key - use IP for unauthenticated requests, user ID for authenticated
     */
    private String getRateLimitKey(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() 
            && !authentication.getPrincipal().equals("anonymousUser")) {
            // Use username as key for authenticated users
            return authentication.getName();
        } else {
            // Use IP address for unauthenticated users
            return getClientIpAddress(request);
        }
    }
    
    /**
     * Get client IP address from request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    /**
     * Determine which bucket to use based on endpoint path and method
     */
    private Bucket getBucketForEndpoint(String path, String method, String key) {
        // Auth endpoints - strictest limits
        if (path.startsWith("/api/auth/login") || 
            path.startsWith("/api/auth/register") || 
            path.startsWith("/api/auth/refresh")) {
            return rateLimitConfig.getAuthBucket(key);
        }
        
        // Admin endpoints
        if (path.startsWith("/api/validation") || 
            path.startsWith("/api/admin") ||
            (path.startsWith("/api/loans") && path.contains("/review"))) {
            return rateLimitConfig.getAdminBucket(key);
        }
        
        // Transaction creation endpoints
        if (path.startsWith("/api/transactions") && "POST".equals(method)) {
            return rateLimitConfig.getTransactionBucket(key);
        }
        
        // Loan payment endpoints
        if (path.contains("/emi/") && path.contains("/pay") && "POST".equals(method)) {
            return rateLimitConfig.getTransactionBucket(key);
        }
        
        // Bill payment endpoints
        if (path.startsWith("/api/bill-payments") && "POST".equals(method)) {
            return rateLimitConfig.getTransactionBucket(key);
        }
        
        // Read-only endpoints (GET requests)
        if ("GET".equals(method)) {
            return rateLimitConfig.getReadOnlyBucket(key);
        }
        
        // General API endpoints
        return rateLimitConfig.getGeneralBucket(key);
    }
    
    /**
     * Add rate limit headers to response
     */
    private void addRateLimitHeaders(HttpServletResponse response, Bucket bucket) {
        // Get available tokens (approximate)
        long availableTokens = bucket.getAvailableTokens();
        response.setHeader("X-RateLimit-Remaining", String.valueOf(availableTokens));
        response.setHeader("X-RateLimit-Limit", String.valueOf(bucket.getAvailableTokens() + 1)); // Approximate
    }
    
    /**
     * Handle rate limit exceeded
     */
    private void handleRateLimitExceeded(HttpServletResponse response, Bucket bucket) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Too Many Requests");
        errorResponse.put("message", "Rate limit exceeded. Please try again later.");
        errorResponse.put("status", HttpStatus.TOO_MANY_REQUESTS.value());
        
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}

