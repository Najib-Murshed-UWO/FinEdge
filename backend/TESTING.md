# Unit Testing Documentation

## Overview

The FinEdge backend includes comprehensive unit tests for critical services and components. Tests are written using JUnit 5 and Mockito for mocking dependencies.

## Test Structure

All tests are located in `backend/src/test/java/com/finedge/` and follow the same package structure as the main source code.

## Test Coverage

### 1. AuthService Tests (`service/AuthServiceTest.java`)

**Coverage:**
- User registration (success, duplicate username, duplicate email)
- User login (success, invalid credentials)
- Token refresh (success, invalid token, inactive user)
- Logout functionality
- Get current user (success, not found)

**Key Test Cases:**
- ✅ Successful registration creates user and customer profile
- ✅ Registration fails when username already exists
- ✅ Registration fails when email already exists
- ✅ Successful login generates JWT tokens
- ✅ Login fails with invalid credentials
- ✅ Token refresh generates new tokens
- ✅ Token refresh fails with invalid token
- ✅ Token refresh fails for inactive users

### 2. TransactionService Tests (`service/TransactionServiceTest.java`)

**Coverage:**
- Get user transactions (with pagination)
- Get account transactions (with ownership verification)
- Create transactions (deposit, withdrawal, transfer)
- Insufficient funds validation
- Account not found handling

**Key Test Cases:**
- ✅ Retrieves transactions for authenticated user
- ✅ Enforces account ownership for customers
- ✅ Creates deposit transactions successfully
- ✅ Creates withdrawal transactions successfully
- ✅ Creates transfer transactions successfully
- ✅ Rejects transactions with insufficient funds
- ✅ Handles account not found errors

### 3. JwtTokenProvider Tests (`security/JwtTokenProviderTest.java`)

**Coverage:**
- Token generation (access and refresh tokens)
- Token validation
- Username extraction from token
- Expiration date extraction
- Authorities extraction
- Token expiration handling

**Key Test Cases:**
- ✅ Generates valid access tokens
- ✅ Generates valid refresh tokens
- ✅ Extracts username from token
- ✅ Validates valid tokens correctly
- ✅ Rejects invalid tokens
- ✅ Validates tokens with user details
- ✅ Handles expired tokens correctly

### 4. RateLimitConfig Tests (`config/RateLimitConfigTest.java`)

**Coverage:**
- Bucket creation and retrieval
- Token consumption for different endpoint types
- Bucket clearing functionality
- Rate limit enforcement

**Key Test Cases:**
- ✅ Creates buckets for different endpoint types
- ✅ Same key returns same bucket instance
- ✅ Different keys return different buckets
- ✅ Enforces auth endpoint limits (5 requests/minute)
- ✅ Enforces transaction endpoint limits (20 requests/minute)
- ✅ Enforces read-only endpoint limits (100 requests/minute)
- ✅ Enforces admin endpoint limits (50 requests/minute)
- ✅ Enforces general endpoint limits (60 requests/minute)
- ✅ Clears individual buckets
- ✅ Clears all buckets

### 5. DoubleEntryService Tests (`service/DoubleEntryServiceTest.java`)

**Coverage:**
- Transaction entry creation (deposit, withdrawal, transfer)
- Loan disbursement entry creation
- EMI payment entry creation
- Double-entry validation

**Key Test Cases:**
- ✅ Creates balanced journal entries for deposits
- ✅ Creates balanced journal entries for withdrawals
- ✅ Creates balanced journal entries for transfers
- ✅ Creates balanced journal entries for loan disbursements
- ✅ Creates balanced journal entries for EMI payments
- ✅ Validates that debits equal credits

### 6. BalanceValidationService Tests (`service/BalanceValidationServiceTest.java`)

**Coverage:**
- Journal entry validation (all entries, specific entry)
- Customer account balance validation
- Trial balance validation
- Account reconciliation

**Key Test Cases:**
- ✅ Validates all journal entries are balanced
- ✅ Identifies unbalanced journal entries
- ✅ Validates specific journal entry
- ✅ Validates customer account balances
- ✅ Identifies balance discrepancies
- ✅ Generates trial balance correctly

## Running Tests

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=AuthServiceTest
```

### Run Tests with Coverage
```bash
mvn test jacoco:report
```

## Test Dependencies

The following dependencies are included in `pom.xml`:

- **JUnit 5** (`spring-boot-starter-test`) - Testing framework
- **Mockito** (`spring-boot-starter-test`) - Mocking framework
- **Spring Security Test** - Security testing utilities

## Test Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are mocked to ensure unit test isolation
3. **Clear Naming**: Test methods use descriptive names (e.g., `testRegister_Success`)
4. **Arrange-Act-Assert**: Tests follow the AAA pattern
5. **Verification**: Important interactions are verified using Mockito's `verify()`

## Future Test Additions

Consider adding tests for:
- LoanService (loan applications, EMI payments)
- BillPaymentService (bill payment processing)
- AccountService (account creation, management)
- ChartOfAccountService (chart initialization)
- Controllers (API endpoint testing)
- Integration tests (end-to-end API testing)

## Notes

- Some null type safety warnings in tests are acceptable and don't affect functionality
- Tests use reflection to set private fields for configuration (e.g., JWT secret)
- Security context is cleared between tests to ensure isolation

