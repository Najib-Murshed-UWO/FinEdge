# Race Condition Protection Implementation

This document describes the race condition protection mechanisms implemented in the FinEdge backend API.

## Overview

Financial applications require strong consistency guarantees to prevent data corruption from concurrent operations. This implementation uses a combination of optimistic and pessimistic locking strategies to ensure data integrity.

## Implemented Solutions

### 1. Optimistic Locking (@Version)

Added `@Version` annotation to critical entities to detect concurrent modifications:

- **Account**: Added `version` field for optimistic locking
- **Loan**: Added `version` field for optimistic locking  
- **EMISchedule**: Added `version` field for optimistic locking

When an entity is updated, Hibernate automatically increments the version. If another transaction modified the entity concurrently, an `OptimisticLockingFailureException` is thrown.

### 2. Pessimistic Locking

Implemented pessimistic locking (PESSIMISTIC_WRITE) for critical operations to prevent concurrent access:

#### Repository Methods Added:
- `AccountRepository.findByIdWithLock()` - Locks account for exclusive write access
- `AccountRepository.findByAccountNumberWithLock()` - Locks account by account number
- `LoanRepository.findByIdWithLock()` - Locks loan for exclusive write access
- `EMIScheduleRepository.findByIdWithLock()` - Locks EMI schedule to prevent double payment

### 3. Transaction Isolation Levels

Updated critical transaction methods to use `REPEATABLE_READ` isolation level:

- `TransactionService.createTransaction()` - Prevents phantom reads during balance calculations
- `LoanService.payEMI()` - Ensures consistent view of loan and account data
- `BillPaymentService.createPayment()` - Prevents concurrent payment processing

### 4. Deadlock Prevention

Implemented consistent lock ordering for transfer operations:

- Accounts are locked in lexicographic order (by ID) to prevent circular wait conditions
- This ensures that if two transfers involve the same accounts, they acquire locks in the same order

### 5. Retry Mechanism

Created `OptimisticLockRetry` utility class for handling optimistic lock failures:

- Provides exponential backoff retry logic
- Configurable maximum retry attempts
- Handles `OptimisticLockingFailureException` gracefully

## Protected Operations

### Transaction Processing
- **Issue**: Concurrent transactions could read stale balance and cause incorrect calculations
- **Solution**: Pessimistic locking on accounts during transaction processing
- **Location**: `TransactionService.createTransaction()`

### Account Transfers
- **Issue**: Concurrent transfers could cause balance inconsistencies
- **Solution**: 
  - Pessimistic locking on both source and destination accounts
  - Consistent lock ordering to prevent deadlocks
- **Location**: `TransactionService.createTransaction()` (TRANSFER type)

### EMI Payments
- **Issue**: 
  - Double payment of same EMI
  - Concurrent payments causing incorrect loan balance
- **Solution**: 
  - Pessimistic locking on EMI schedule, loan, and account
  - Lock order: EMI → Loan → Account
- **Location**: `LoanService.payEMI()`

### Loan Disbursements
- **Issue**: Concurrent disbursements could cause account balance corruption
- **Solution**: Pessimistic locking on account during disbursement
- **Location**: `LoanService.reviewLoanApplication()` (final approval)

### Bill Payments
- **Issue**: Concurrent bill payments could cause insufficient funds to be missed
- **Solution**: Pessimistic locking on account during payment processing
- **Location**: `BillPaymentService.createPayment()`

## Database Schema Changes

The following columns are automatically added by Hibernate (via `@Version`):

- `accounts.version` (BIGINT, default 0)
- `loans.version` (BIGINT, default 0)
- `emi_schedules.version` (BIGINT, default 0)

These are managed automatically by Hibernate and don't require manual migration scripts when using `spring.jpa.hibernate.ddl-auto=update`.

## Best Practices

1. **Always use pessimistic locking for financial operations** that modify account balances
2. **Use consistent lock ordering** when locking multiple resources to prevent deadlocks
3. **Keep transactions short** to minimize lock duration
4. **Handle OptimisticLockingFailureException** with retry logic for non-critical operations
5. **Use appropriate isolation levels** based on consistency requirements

## Testing Recommendations

1. **Concurrent Transaction Test**: Simulate multiple simultaneous transactions on the same account
2. **Transfer Deadlock Test**: Verify that concurrent transfers don't cause deadlocks
3. **EMI Double Payment Test**: Attempt to pay the same EMI twice concurrently
4. **Load Testing**: Verify system behavior under high concurrent load

## Performance Considerations

- Pessimistic locking may cause contention under high load
- Consider using optimistic locking with retry for read-heavy operations
- Monitor lock wait times and deadlock occurrences
- Consider implementing connection pooling and transaction timeout settings

## Future Enhancements

1. Implement distributed locking for multi-instance deployments
2. Add monitoring and alerting for lock contention
3. Consider using database-level constraints (e.g., CHECK constraints for balance)
4. Implement idempotency keys for critical operations

