# Double-Entry Bookkeeping Implementation

## Overview

The FinEdge application now implements proper **double-entry bookkeeping** with journal entries and ledger entries, following standard accounting principles where every transaction has equal debits and credits.

## Architecture

### Core Components

1. **Chart of Accounts** (`ChartOfAccount`)
   - Defines the accounts used in the accounting system
   - Categories: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
   - Account codes for easy identification

2. **Journal Entries** (`JournalEntry`)
   - Records the complete transaction with description and reference
   - Tracks total debits and credits
   - Validates that debits equal credits

3. **Ledger Entries** (`LedgerEntry`)
   - Individual debit/credit entries linked to journal entries
   - Links to chart of accounts and customer accounts
   - Tracks balance after each entry

4. **Transactions** (`Transaction`)
   - Customer-facing transaction records
   - Linked to journal entries for accounting traceability

### Database Schema

```sql
-- Chart of Accounts
chart_of_accounts (
    id, account_code, account_name, account_category,
    parent_account_id, is_active, description
)

-- Journal Entries
journal_entries (
    id, entry_date, reference, description,
    total_debit, total_credit, is_balanced, transaction_id
)

-- Ledger Entries
ledger_entries (
    id, journal_entry_id, chart_of_account_id, account_id,
    debit_amount, credit_amount, balance_after, description
)
```

## Default Chart of Accounts

The system initializes with the following default accounts:

### Assets (1000-1999)
- **1000**: Cash and Cash Equivalents
- **1100**: Customer Deposits - Asset (Cash held for customer deposits)
- **1200**: Loans Receivable (Outstanding loans to customers)

### Liabilities (2000-2999)
- **2000**: Customer Deposits - Liability (Customer deposit liabilities)
- **2100**: Interest Payable
- **2200**: Loan Disbursements Payable

### Equity (3000-3999)
- **3000**: Bank Capital
- **3100**: Retained Earnings

### Revenue (4000-4999)
- **4000**: Interest Income
- **4100**: Service Fees
- **4200**: Loan Processing Fees

### Expenses (5000-5999)
- **5000**: Interest Expense
- **5100**: Operating Expenses
- **5200**: Loan Loss Provision

## Transaction Processing with Double-Entry

### 1. Deposit Transaction

**Example:** Customer deposits $1,000

**Journal Entry:**
```
Reference: DEP-20240101-001
Description: Deposit to ACC-2023-001
Total Debit: $1,000
Total Credit: $1,000
```

**Ledger Entries:**
```
1. Debit:  Customer Account (1100)        $1,000
   Credit: Customer Deposits Liability (2000) $1,000
```

**Accounting Logic:**
- Debit increases customer's asset (cash in account)
- Credit increases bank's liability (money owed to customer)

### 2. Withdrawal Transaction

**Example:** Customer withdraws $500

**Journal Entry:**
```
Reference: WDL-20240101-001
Description: Withdrawal from ACC-2023-001
Total Debit: $500
Total Credit: $500
```

**Ledger Entries:**
```
1. Debit:  Customer Deposits Liability (2000) $500
   Credit: Customer Account (1100)            $500
```

**Accounting Logic:**
- Debit reduces bank's liability (less money owed)
- Credit reduces customer's asset (less cash in account)

### 3. Transfer Transaction

**Example:** Transfer $200 from Account A to Account B

**Journal Entry:**
```
Reference: XFR-20240101-001
Description: Transfer from ACC-001 to ACC-002
Total Debit: $200
Total Credit: $200
```

**Ledger Entries:**
```
1. Debit:  Account B (1100)  $200
   Credit: Account A (1100)  $200
```

**Accounting Logic:**
- Debit increases destination account (asset)
- Credit decreases source account (asset)
- Total assets remain constant

### 4. Loan Disbursement

**Example:** Disburse $25,000 loan to customer

**Journal Entry:**
```
Reference: LOAN-DISB-LOAN-2023-001
Description: Loan disbursement - LOAN-2023-001
Total Debit: $25,000
Total Credit: $25,000
```

**Ledger Entries:**
```
1. Debit:  Customer Deposits Liability (2000) $25,000
   Credit: Loans Receivable (1200)            $25,000
```

**Accounting Logic:**
- Debit: Customer receives money (liability increases)
- Credit: Bank creates loan asset (receivable increases)

### 5. EMI Payment

**Example:** Pay EMI of $800 ($600 principal + $200 interest)

**Journal Entry:**
```
Reference: EMI-PAY-LOAN-001-1
Description: EMI payment for loan LOAN-001
Total Debit: $800
Total Credit: $800
```

**Ledger Entries:**
```
1. Debit:  Customer Deposits Liability (2000) $800
   Credit: Loans Receivable (1200)            $600  (Principal)
   Credit: Interest Income (4000)              $200  (Interest)
```

**Accounting Logic:**
- Debit: Customer pays money (liability decreases)
- Credit: Loan receivable decreases (principal portion)
- Credit: Bank earns interest income (revenue)

## Balance Validation

### 1. Journal Entry Validation

Validates that all journal entries are balanced (debits = credits):

```java
GET /api/validation/journal-entries
```

Returns:
- Total unbalanced entries
- List of unbalanced entries
- Validation status

### 2. Customer Account Balance Validation

Compares customer account balances with ledger entries:

```java
GET /api/validation/customer-accounts
```

Returns:
- Total accounts checked
- List of discrepancies
- Account balances vs ledger balances

### 3. Trial Balance

Generates a trial balance for all chart of accounts:

```java
GET /api/validation/trial-balance
```

Returns:
- Total debits
- Total credits
- Difference
- Account balances by category

### 4. Account Reconciliation

Reconciles a specific account balance with ledger entries:

```java
POST /api/validation/reconcile/{accountId}
```

Updates account balance to match ledger entries.

## Key Features

### 1. Automatic Validation

Every transaction is automatically validated:
- Debits must equal credits
- Journal entry is marked as balanced only if validation passes
- Transaction fails if validation fails

### 2. Balance Tracking

- Account balances are calculated from ledger entries
- Each ledger entry stores `balance_after` for audit trail
- Balances can be recalculated from ledger entries

### 3. Complete Audit Trail

- Every transaction has a journal entry
- Every journal entry has multiple ledger entries
- Full traceability from transaction to accounting entries

### 4. Financial Reporting Ready

- Trial balance can be generated
- Balance sheet can be created from chart of accounts
- Income statement from revenue/expense accounts

## API Endpoints

### Validation Endpoints

- `GET /api/validation/journal-entries` - Validate all journal entries
- `GET /api/validation/journal-entries/{id}` - Validate specific journal entry
- `GET /api/validation/customer-accounts` - Validate customer account balances
- `GET /api/validation/trial-balance` - Generate trial balance
- `POST /api/validation/reconcile/{accountId}` - Reconcile account balance

**Access:** Admin and Banker roles required

## Implementation Details

### DoubleEntryService

Centralized service for creating journal and ledger entries:
- `createTransactionEntry()` - For regular transactions
- `createLoanDisbursementEntry()` - For loan disbursements
- `createEMIPaymentEntry()` - For EMI payments

### Transaction Processing Flow

```
1. Validate transaction request
   ↓
2. Lock accounts (pessimistic locking)
   ↓
3. Create Journal Entry
   ↓
4. Create Ledger Entries (debits and credits)
   ↓
5. Validate: Debits = Credits
   ↓
6. Save Journal Entry and Ledger Entries
   ↓
7. Update Account Balances from Ledger
   ↓
8. Create Transaction Record
   ↓
9. Create Notifications and Audit Logs
```

## Benefits

1. **Accuracy**: Automatic validation ensures transactions are balanced
2. **Compliance**: Meets accounting standards (GAAP, IFRS)
3. **Audit Trail**: Complete transaction history
4. **Error Detection**: Unbalanced entries are immediately flagged
5. **Financial Reporting**: Easy to generate financial statements
6. **Reconciliation**: Accounts can be reconciled with ledger entries

## Testing

### Test Double-Entry Validation

```bash
# Check all journal entries are balanced
curl -X GET http://localhost:5000/api/validation/journal-entries \
  -H "Authorization: Bearer <token>"

# Generate trial balance
curl -X GET http://localhost:5000/api/validation/trial-balance \
  -H "Authorization: Bearer <token>"

# Validate customer account balances
curl -X GET http://localhost:5000/api/validation/customer-accounts \
  -H "Authorization: Bearer <token>"
```

### Expected Results

- All journal entries should be balanced (debits = credits)
- Trial balance should show total debits = total credits
- Customer account balances should match ledger entries

## Migration Notes

- Existing transactions will not have journal entries (created before implementation)
- New transactions automatically create journal and ledger entries
- Chart of accounts is initialized on application startup
- Account balances are now calculated from ledger entries

## Future Enhancements

1. **Historical Balance Calculation**: Recalculate balances from ledger entries
2. **Financial Statements**: Generate balance sheet and income statement
3. **Account Reconciliation**: Automated reconciliation process
4. **Reporting**: Enhanced financial reporting capabilities
5. **Multi-Currency**: Support for multiple currencies with exchange rates

