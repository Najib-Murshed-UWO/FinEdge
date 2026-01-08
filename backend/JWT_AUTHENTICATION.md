# JWT Authentication Implementation

This document describes the JWT (JSON Web Token) authentication and authorization implementation in the FinEdge application.

## Overview

The application has been migrated from session-based authentication to JWT token-based authentication for better scalability and stateless API design.

## Backend Implementation

### Dependencies

Added JWT dependencies to `pom.xml`:
- `jjwt-api` (v0.12.3)
- `jjwt-impl` (v0.12.3)
- `jjwt-jackson` (v0.12.3)

### Configuration

**application.properties:**
```properties
jwt.secret=${JWT_SECRET:your-256-bit-secret-key-for-jwt-token-generation-change-this-in-production}
jwt.expiration=86400000  # 24 hours in milliseconds
jwt.refreshExpiration=604800000  # 7 days in milliseconds
```

**Important:** Change the `JWT_SECRET` environment variable in production to a secure, randomly generated 256-bit key.

### Components

#### 1. JwtTokenProvider (`com.finedge.security.JwtTokenProvider`)
- Generates access tokens and refresh tokens
- Validates JWT tokens
- Extracts user information from tokens
- Uses HMAC-SHA256 for signing

#### 2. JwtAuthenticationFilter (`com.finedge.security.JwtAuthenticationFilter`)
- Intercepts all HTTP requests
- Extracts JWT token from `Authorization: Bearer <token>` header
- Validates token and sets Spring Security authentication context
- Runs before Spring Security's authentication filters

#### 3. SecurityConfig Updates
- Changed session policy to `STATELESS`
- Disabled CSRF (not needed for stateless JWT)
- Added CORS configuration
- Integrated JWT filter into security chain

### API Endpoints

#### POST `/api/auth/register`
- Registers a new user
- Returns: `JwtAuthResponse` with access token, refresh token, and user info

#### POST `/api/auth/login`
- Authenticates user credentials
- Returns: `JwtAuthResponse` with access token, refresh token, and user info

#### POST `/api/auth/refresh`
- Refreshes access token using refresh token
- Request body: `{ "refreshToken": "..." }`
- Returns: `JwtAuthResponse` with new tokens

#### POST `/api/auth/logout`
- Logs out user (clears security context)
- Note: With JWT, logout is client-side (token removal)

#### GET `/api/auth/me`
- Returns current authenticated user information
- Requires: `Authorization: Bearer <token>` header

### Token Structure

**Access Token:**
- Subject: Username
- Claims: Authorities (roles)
- Expiration: 24 hours
- Used for: API authentication

**Refresh Token:**
- Subject: Username
- Claims: Type ("refresh")
- Expiration: 7 days
- Used for: Obtaining new access tokens

## Frontend Implementation

### AuthContext (`client/src/contexts/AuthContext.tsx`)

Provides authentication state and methods:
- `user`: Current user object
- `token`: Access token
- `refreshToken`: Refresh token
- `login(username, password)`: Login method
- `register(data)`: Registration method
- `logout()`: Logout method
- `isAuthenticated`: Boolean flag
- `isLoading`: Loading state
- `refreshAccessToken()`: Refresh token method

### Token Storage

Tokens are stored in `localStorage`:
- `finedge_access_token`: Access token
- `finedge_refresh_token`: Refresh token
- `finedge_user`: User information (JSON)

### API Integration (`client/src/lib/api.ts`)

- Automatically adds `Authorization: Bearer <token>` header to all requests
- Handles 401 responses by attempting token refresh
- Redirects to login if refresh fails
- Retries original request after successful refresh

### Protected Routes (`client/src/components/ProtectedRoute.tsx`)

- Wraps protected routes
- Checks authentication status
- Validates user roles
- Redirects unauthenticated users to login
- Shows loading state during authentication check

### Route Protection

Routes are protected in `App.tsx`:
- Customer routes: `/dashboard`, `/bill-payments`, `/cards`, etc.
- Banker routes: `/banker/*` (requires BANKER or ADMIN role)
- Admin routes: `/admin/*` (requires ADMIN role)

## Security Features

1. **Token Expiration**: Access tokens expire after 24 hours
2. **Refresh Tokens**: Long-lived refresh tokens (7 days) for seamless re-authentication
3. **Automatic Refresh**: Frontend automatically refreshes expired tokens
4. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
5. **Role-Based Access**: Routes protected by user roles
6. **Stateless**: No server-side session storage required

## Usage

### Login Flow

1. User submits credentials
2. Backend validates and generates JWT tokens
3. Frontend stores tokens in localStorage
4. Subsequent requests include token in Authorization header
5. Backend validates token on each request

### Token Refresh Flow

1. Access token expires (401 response)
2. Frontend detects 401 and attempts refresh
3. Backend validates refresh token
4. New tokens generated and returned
5. Original request retried with new token

### Logout Flow

1. User clicks logout
2. Frontend calls logout API (optional)
3. Frontend clears tokens from localStorage
4. User redirected to login page

## Production Considerations

1. **Change JWT Secret**: Use a strong, randomly generated secret key
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Storage**: Consider httpOnly cookies instead of localStorage for better XSS protection
4. **Token Blacklisting**: Implement token blacklist for logout (Redis recommended)
5. **Rate Limiting**: Add rate limiting to auth endpoints
6. **Token Rotation**: Consider rotating refresh tokens on use
7. **Monitoring**: Monitor token expiration and refresh patterns

## Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john.doe","password":"password123"}'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### Test Token Refresh
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

## Migration Notes

- Session-based authentication has been removed
- Spring Session JDBC dependency can be removed if not used elsewhere
- All API endpoints now require JWT token in Authorization header
- Frontend automatically handles token management

