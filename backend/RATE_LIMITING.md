# Rate Limiting Implementation

## Overview

The FinEdge application implements comprehensive rate limiting using **Bucket4j** to protect API endpoints from abuse and ensure fair usage. Rate limiting is applied at the filter level, before authentication, to protect against brute force attacks and excessive API usage.

## Implementation Details

### Technology Stack

- **Bucket4j 8.10.1**: Token bucket algorithm for rate limiting
- **In-Memory Storage**: ConcurrentHashMap for storing rate limit buckets
- **Spring Security Integration**: Filter integrated into security filter chain

### Rate Limit Configuration

Different endpoints have different rate limits based on their sensitivity and usage patterns:

| Endpoint Type | Requests | Window | Use Case |
|--------------|----------|--------|----------|
| **Auth Endpoints** | 5 | 1 minute | Login, Register, Refresh Token |
| **Transaction Creation** | 20 | 1 minute | Creating transactions, EMI payments, bill payments |
| **Read-Only Endpoints** | 100 | 1 minute | GET requests (viewing data) |
| **Admin Endpoints** | 50 | 1 minute | Admin operations, validation endpoints |
| **General API** | 60 | 1 minute | Other API endpoints |

### Configuration Properties

Rate limits can be configured in `application.properties`:

```properties
# Rate Limiting Configuration
rate-limit.auth.requests=5
rate-limit.auth.window-minutes=1
rate-limit.transaction.requests=20
rate-limit.transaction.window-minutes=1
rate-limit.read-only.requests=100
rate-limit.read-only.window-minutes=1
rate-limit.admin.requests=50
rate-limit.admin.window-minutes=1
rate-limit.general.requests=60
rate-limit.general.window-minutes=1
```

### Rate Limit Key Strategy

The rate limiting uses different keys based on authentication status:

- **Authenticated Users**: Uses username/user ID as the rate limit key
- **Unauthenticated Users**: Uses IP address as the rate limit key

This ensures:
- Authenticated users have per-user rate limits
- Unauthenticated users (e.g., login attempts) are rate-limited by IP
- Protection against brute force attacks on authentication endpoints

### Endpoint Classification

The rate limiting filter automatically classifies endpoints:

1. **Auth Endpoints** (`/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`)
   - Strictest limits (5 requests/minute)
   - Rate-limited by IP address
   - Protects against brute force attacks

2. **Transaction Endpoints** (`POST /api/transactions`, EMI payments, bill payments)
   - Moderate limits (20 requests/minute)
   - Rate-limited by user ID
   - Prevents transaction spam

3. **Admin Endpoints** (`/api/validation`, `/api/admin`, loan reviews)
   - Moderate limits (50 requests/minute)
   - Rate-limited by user ID
   - Protects administrative operations

4. **Read-Only Endpoints** (All GET requests)
   - Lenient limits (100 requests/minute)
   - Rate-limited by user ID
   - Allows normal browsing behavior

5. **General Endpoints** (All other endpoints)
   - Standard limits (60 requests/minute)
   - Rate-limited by user ID or IP

### Excluded Endpoints

The following endpoints are excluded from rate limiting:
- `/api/health`
- `/api/ready`
- `/api/live`

These health check endpoints are excluded to allow monitoring systems to check application status without being rate-limited.

## Response Headers

When a request is processed, the following headers are added:

- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Limit`: Total number of requests allowed in the window

## Rate Limit Exceeded Response

When a rate limit is exceeded, the API returns:

- **Status Code**: `429 Too Many Requests`
- **Response Body**:
  ```json
  {
    "error": "Too Many Requests",
    "message": "Rate limit exceeded. Please try again later.",
    "status": 429
  }
  ```

## Architecture

### Components

1. **RateLimitConfig** (`com.finedge.config.RateLimitConfig`)
   - Manages rate limit buckets
   - Provides methods to get/create buckets for different endpoint types
   - Uses in-memory ConcurrentHashMap for bucket storage

2. **RateLimitFilter** (`com.finedge.security.RateLimitFilter`)
   - Extends `OncePerRequestFilter`
   - Intercepts all requests before authentication
   - Determines appropriate bucket based on endpoint
   - Enforces rate limits and adds response headers

3. **SecurityConfig Integration**
   - Rate limit filter is added before JWT authentication filter
   - Ensures rate limiting applies to all requests, including unauthenticated ones

### Filter Chain Order

```
Request → RateLimitFilter → JwtAuthenticationFilter → UsernamePasswordAuthenticationFilter → Controller
```

This order ensures:
- Rate limiting is applied before authentication
- Unauthenticated requests (e.g., login attempts) are rate-limited
- Authenticated requests are rate-limited per user

## Benefits

1. **Security**: Protects against brute force attacks on authentication endpoints
2. **Fair Usage**: Ensures fair distribution of API resources
3. **DoS Protection**: Prevents denial-of-service attacks through request flooding
4. **Resource Management**: Prevents excessive database load from transaction spam
5. **User Experience**: Provides clear error messages when limits are exceeded

## Future Enhancements

Potential improvements for production:

1. **Distributed Rate Limiting**: Use Redis instead of in-memory storage for multi-instance deployments
2. **Dynamic Rate Limits**: Adjust limits based on user tier (e.g., premium users get higher limits)
3. **Rate Limit Headers**: Add `Retry-After` header to indicate when to retry
4. **Rate Limit Logging**: Log rate limit violations for security monitoring
5. **Whitelist/Blacklist**: Add IP whitelisting for trusted sources, blacklisting for known attackers

## Testing

To test rate limiting:

1. **Auth Endpoints**: Send 6 login requests from the same IP within 1 minute - the 6th should return 429
2. **Transaction Endpoints**: Create 21 transactions within 1 minute - the 21st should return 429
3. **Read Endpoints**: Make 101 GET requests within 1 minute - the 101st should return 429

## Monitoring

Monitor rate limit violations:
- Check application logs for 429 responses
- Monitor `X-RateLimit-Remaining` headers in responses
- Track rate limit violations per endpoint type
- Alert on unusual patterns (e.g., many 429s from same IP)

