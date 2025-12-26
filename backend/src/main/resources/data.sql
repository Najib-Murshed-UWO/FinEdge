-- FinEdge Database Seed Data
-- This file contains realistic mock data for all tables in the FinEdge database
-- 
-- USAGE:
-- 1. This file is automatically executed on application startup if spring.sql.init.mode=always
-- 2. To prevent duplicate data, either:
--    a) Change spring.sql.init.mode=never in application.properties after first run
--    b) Uncomment the TRUNCATE statement below to clear existing data before inserting
--    c) Manually execute this file once using psql or your database client
--
-- DEFAULT CREDENTIALS:
-- All user passwords are BCrypt hashed (default password: "password123")
-- Test users:
--   - admin@finedge.com / password123 (ADMIN)
--   - banker1@finedge.com / password123 (BANKER)
--   - john.doe@email.com / password123 (CUSTOMER)
--
-- DATA INCLUDED:
-- - 9 users (1 admin, 2 bankers, 6 customers)
-- - 8 customers with complete profiles
-- - 16 accounts (checking and savings)
-- - 26 transactions with realistic history
-- - 6 active loans (personal, auto, business, home, education)
-- - 9 loan applications (6 approved, 2 pending, 1 draft)
-- - 26 EMI schedules with payment history
-- - 9 loan approvals
-- - 10 billers across different categories
-- - 15 notifications
-- - 10 audit log entries

-- Clear existing data (optional - uncomment if you want to reset the database)
-- TRUNCATE TABLE emi_schedules, loan_approvals, loan_applications, loans, transactions, accounts, billers, notifications, audit_logs, customers, users CASCADE;

-- ============================================
-- USERS
-- ============================================
INSERT INTO users (id, username, email, password, role, is_active, last_login, created_at, updated_at) VALUES
-- Admin users
('usr-001', 'admin', 'admin@finedge.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'ADMIN', true, '2024-01-15 10:30:00', '2023-06-01 09:00:00', '2024-01-15 10:30:00'),
('usr-002', 'banker1', 'banker1@finedge.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'BANKER', true, '2024-01-14 14:20:00', '2023-06-01 09:00:00', '2024-01-14 14:20:00'),
('usr-003', 'banker2', 'banker2@finedge.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'BANKER', true, '2024-01-13 16:45:00', '2023-06-01 09:00:00', '2024-01-13 16:45:00'),
-- Customer users
('usr-101', 'john.doe', 'john.doe@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-15 08:15:00', '2023-07-15 10:00:00', '2024-01-15 08:15:00'),
('usr-102', 'jane.smith', 'jane.smith@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-14 11:30:00', '2023-08-20 14:30:00', '2024-01-14 11:30:00'),
('usr-103', 'michael.johnson', 'michael.j@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-13 09:45:00', '2023-09-10 16:00:00', '2024-01-13 09:45:00'),
('usr-104', 'sarah.williams', 'sarah.w@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-12 13:20:00', '2023-10-05 11:00:00', '2024-01-12 13:20:00'),
('usr-105', 'david.brown', 'david.brown@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-11 15:10:00', '2023-11-12 09:30:00', '2024-01-11 15:10:00'),
('usr-106', 'emily.davis', 'emily.davis@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-10 10:00:00', '2023-12-01 13:45:00', '2024-01-10 10:00:00'),
('usr-107', 'robert.miller', 'robert.m@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-09 12:30:00', '2024-01-02 10:15:00', '2024-01-09 12:30:00'),
('usr-108', 'lisa.wilson', 'lisa.wilson@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJ0a', 'CUSTOMER', true, '2024-01-08 14:45:00', '2024-01-05 15:00:00', '2024-01-08 14:45:00');

-- ============================================
-- CUSTOMERS
-- ============================================
INSERT INTO customers (id, user_id, full_name, phone, address, date_of_birth, ssn, credit_score, employment_status, annual_income, kyc_status, kyc_verified_at, created_at, updated_at) VALUES
('cust-001', 'usr-101', 'John Doe', '+1-555-0101', '123 Main Street, New York, NY 10001', '1985-03-15 00:00:00', '123-45-6789', 750, 'EMPLOYED', 85000.00, 'VERIFIED', '2023-07-20 10:00:00', '2023-07-15 10:00:00', '2023-07-20 10:00:00'),
('cust-002', 'usr-102', 'Jane Smith', '+1-555-0102', '456 Oak Avenue, Los Angeles, CA 90001', '1990-07-22 00:00:00', '234-56-7890', 780, 'EMPLOYED', 95000.00, 'VERIFIED', '2023-08-25 14:00:00', '2023-08-20 14:30:00', '2023-08-25 14:00:00'),
('cust-003', 'usr-103', 'Michael Johnson', '+1-555-0103', '789 Pine Road, Chicago, IL 60601', '1988-11-08 00:00:00', '345-67-8901', 720, 'SELF_EMPLOYED', 72000.00, 'VERIFIED', '2023-09-15 11:00:00', '2023-09-10 16:00:00', '2023-09-15 11:00:00'),
('cust-004', 'usr-104', 'Sarah Williams', '+1-555-0104', '321 Elm Street, Houston, TX 77001', '1992-01-30 00:00:00', '456-78-9012', 800, 'EMPLOYED', 110000.00, 'VERIFIED', '2023-10-10 09:00:00', '2023-10-05 11:00:00', '2023-10-10 09:00:00'),
('cust-005', 'usr-105', 'David Brown', '+1-555-0105', '654 Maple Drive, Phoenix, AZ 85001', '1987-05-18 00:00:00', '567-89-0123', 690, 'EMPLOYED', 68000.00, 'VERIFIED', '2023-11-20 13:00:00', '2023-11-12 09:30:00', '2023-11-20 13:00:00'),
('cust-006', 'usr-106', 'Emily Davis', '+1-555-0106', '987 Cedar Lane, Philadelphia, PA 19101', '1995-09-12 00:00:00', '678-90-1234', 760, 'EMPLOYED', 88000.00, 'VERIFIED', '2023-12-05 10:00:00', '2023-12-01 13:45:00', '2023-12-05 10:00:00'),
('cust-007', 'usr-107', 'Robert Miller', '+1-555-0107', '147 Birch Court, San Antonio, TX 78201', '1983-12-25 00:00:00', '789-01-2345', 710, 'EMPLOYED', 75000.00, 'VERIFIED', '2024-01-05 15:00:00', '2024-01-02 10:15:00', '2024-01-05 15:00:00'),
('cust-008', 'usr-108', 'Lisa Wilson', '+1-555-0108', '258 Spruce Way, San Diego, CA 92101', '1991-04-07 00:00:00', '890-12-3456', 740, 'EMPLOYED', 82000.00, 'VERIFIED', '2024-01-08 12:00:00', '2024-01-05 15:00:00', '2024-01-08 12:00:00');

-- ============================================
-- ACCOUNTS
-- ============================================
INSERT INTO accounts (id, customer_id, account_number, account_type, account_name, balance, currency, status, interest_rate, opened_at, closed_at, created_at, updated_at) VALUES
-- John Doe's accounts
('acc-001', 'cust-001', 'ACC-2023-001', 'CHECKING', 'John Doe - Primary Checking', 12500.50, 'USD', 'ACTIVE', 0.00, '2023-07-20 10:00:00', NULL, '2023-07-20 10:00:00', '2024-01-15 08:00:00'),
('acc-002', 'cust-001', 'ACC-2023-002', 'SAVINGS', 'John Doe - Savings Account', 35000.00, 'USD', 'ACTIVE', 2.50, '2023-07-20 10:00:00', NULL, '2023-07-20 10:00:00', '2024-01-15 08:00:00'),
-- Jane Smith's accounts
('acc-003', 'cust-002', 'ACC-2023-003', 'CHECKING', 'Jane Smith - Primary Checking', 18500.75, 'USD', 'ACTIVE', 0.00, '2023-08-25 14:00:00', NULL, '2023-08-25 14:00:00', '2024-01-14 11:00:00'),
('acc-004', 'cust-002', 'ACC-2023-004', 'SAVINGS', 'Jane Smith - High Yield Savings', 52000.00, 'USD', 'ACTIVE', 3.00, '2023-08-25 14:00:00', NULL, '2023-08-25 14:00:00', '2024-01-14 11:00:00'),
-- Michael Johnson's accounts
('acc-005', 'cust-003', 'ACC-2023-005', 'CHECKING', 'Michael Johnson - Business Checking', 8900.25, 'USD', 'ACTIVE', 0.00, '2023-09-15 11:00:00', NULL, '2023-09-15 11:00:00', '2024-01-13 09:00:00'),
('acc-006', 'cust-003', 'ACC-2023-006', 'SAVINGS', 'Michael Johnson - Emergency Fund', 15000.00, 'USD', 'ACTIVE', 2.25, '2023-09-15 11:00:00', NULL, '2023-09-15 11:00:00', '2024-01-13 09:00:00'),
-- Sarah Williams's accounts
('acc-007', 'cust-004', 'ACC-2023-007', 'CHECKING', 'Sarah Williams - Primary Checking', 22500.00, 'USD', 'ACTIVE', 0.00, '2023-10-10 09:00:00', NULL, '2023-10-10 09:00:00', '2024-01-12 13:00:00'),
('acc-008', 'cust-004', 'ACC-2023-008', 'SAVINGS', 'Sarah Williams - Savings Account', 68000.00, 'USD', 'ACTIVE', 2.75, '2023-10-10 09:00:00', NULL, '2023-10-10 09:00:00', '2024-01-12 13:00:00'),
-- David Brown's accounts
('acc-009', 'cust-005', 'ACC-2023-009', 'CHECKING', 'David Brown - Primary Checking', 6500.00, 'USD', 'ACTIVE', 0.00, '2023-11-20 13:00:00', NULL, '2023-11-20 13:00:00', '2024-01-11 15:00:00'),
('acc-010', 'cust-005', 'ACC-2023-010', 'SAVINGS', 'David Brown - Savings Account', 12000.00, 'USD', 'ACTIVE', 2.00, '2023-11-20 13:00:00', NULL, '2023-11-20 13:00:00', '2024-01-11 15:00:00'),
-- Emily Davis's accounts
('acc-011', 'cust-006', 'ACC-2023-011', 'CHECKING', 'Emily Davis - Primary Checking', 14200.50, 'USD', 'ACTIVE', 0.00, '2023-12-05 10:00:00', NULL, '2023-12-05 10:00:00', '2024-01-10 10:00:00'),
('acc-012', 'cust-006', 'ACC-2023-012', 'SAVINGS', 'Emily Davis - Savings Account', 28000.00, 'USD', 'ACTIVE', 2.50, '2023-12-05 10:00:00', NULL, '2023-12-05 10:00:00', '2024-01-10 10:00:00'),
-- Robert Miller's accounts
('acc-013', 'cust-007', 'ACC-2024-001', 'CHECKING', 'Robert Miller - Primary Checking', 9800.75, 'USD', 'ACTIVE', 0.00, '2024-01-05 15:00:00', NULL, '2024-01-05 15:00:00', '2024-01-09 12:00:00'),
('acc-014', 'cust-007', 'ACC-2024-002', 'SAVINGS', 'Robert Miller - Savings Account', 18000.00, 'USD', 'ACTIVE', 2.25, '2024-01-05 15:00:00', NULL, '2024-01-05 15:00:00', '2024-01-09 12:00:00'),
-- Lisa Wilson's accounts
('acc-015', 'cust-008', 'ACC-2024-003', 'CHECKING', 'Lisa Wilson - Primary Checking', 11200.00, 'USD', 'ACTIVE', 0.00, '2024-01-08 12:00:00', NULL, '2024-01-08 12:00:00', '2024-01-08 14:00:00'),
('acc-016', 'cust-008', 'ACC-2024-004', 'SAVINGS', 'Lisa Wilson - Savings Account', 24000.00, 'USD', 'ACTIVE', 2.50, '2024-01-08 12:00:00', NULL, '2024-01-08 12:00:00', '2024-01-08 14:00:00');

-- ============================================
-- TRANSACTIONS
-- ============================================
INSERT INTO transactions (id, account_id, to_account_id, transaction_type, amount, balance_after, description, reference, status, metadata, processed_at, created_at, updated_at) VALUES
-- John Doe's transactions
('txn-001', 'acc-001', NULL, 'DEPOSIT', 5000.00, 5000.00, 'Initial account deposit', 'REF-20230720-001', 'COMPLETED', '{"source": "wire_transfer", "initiated_by": "customer"}', '2023-07-20 10:05:00', '2023-07-20 10:00:00', '2023-07-20 10:05:00'),
('txn-002', 'acc-001', NULL, 'DEPOSIT', 3000.00, 8000.00, 'Salary deposit', 'REF-20230801-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Tech Corp"}', '2023-08-01 08:00:00', '2023-08-01 08:00:00', '2023-08-01 08:00:00'),
('txn-003', 'acc-001', 'acc-002', 'TRANSFER', 2000.00, 6000.00, 'Transfer to savings', 'REF-20230815-001', 'COMPLETED', '{"transfer_type": "internal"}', '2023-08-15 14:30:00', '2023-08-15 14:30:00', '2023-08-15 14:30:00'),
('txn-004', 'acc-001', NULL, 'WITHDRAWAL', 500.00, 5500.00, 'ATM withdrawal', 'REF-20230910-001', 'COMPLETED', '{"atm_location": "123 Main St"}', '2023-09-10 16:45:00', '2023-09-10 16:45:00', '2023-09-10 16:45:00'),
('txn-005', 'acc-001', NULL, 'PAYMENT', 1200.00, 4300.00, 'Credit card payment', 'REF-20231005-001', 'COMPLETED', '{"payment_method": "online", "merchant": "Credit Card Co"}', '2023-10-05 10:00:00', '2023-10-05 10:00:00', '2023-10-05 10:00:00'),
('txn-006', 'acc-001', NULL, 'DEPOSIT', 3000.00, 7300.00, 'Salary deposit', 'REF-20231101-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Tech Corp"}', '2023-11-01 08:00:00', '2023-11-01 08:00:00', '2023-11-01 08:00:00'),
('txn-007', 'acc-001', NULL, 'DEPOSIT', 3000.00, 10300.00, 'Salary deposit', 'REF-20231201-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Tech Corp"}', '2023-12-01 08:00:00', '2023-12-01 08:00:00', '2023-12-01 08:00:00'),
('txn-008', 'acc-001', NULL, 'DEPOSIT', 3000.00, 13300.00, 'Salary deposit', 'REF-20240101-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Tech Corp"}', '2024-01-01 08:00:00', '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
('txn-009', 'acc-001', NULL, 'WITHDRAWAL', 800.50, 12500.50, 'Grocery purchase', 'REF-20240110-001', 'COMPLETED', '{"payment_method": "debit_card", "merchant": "SuperMart"}', '2024-01-10 18:30:00', '2024-01-10 18:30:00', '2024-01-10 18:30:00'),
('txn-010', 'acc-002', NULL, 'INTEREST', 87.50, 35087.50, 'Monthly interest payment', 'REF-20240101-002', 'COMPLETED', '{"interest_period": "2023-12"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
-- Jane Smith's transactions
('txn-011', 'acc-003', NULL, 'DEPOSIT', 6000.00, 6000.00, 'Initial account deposit', 'REF-20230825-001', 'COMPLETED', '{"source": "wire_transfer"}', '2023-08-25 14:05:00', '2023-08-25 14:00:00', '2023-08-25 14:05:00'),
('txn-012', 'acc-003', NULL, 'DEPOSIT', 4000.00, 10000.00, 'Salary deposit', 'REF-20230901-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Finance Inc"}', '2023-09-01 08:00:00', '2023-09-01 08:00:00', '2023-09-01 08:00:00'),
('txn-013', 'acc-003', 'acc-004', 'TRANSFER', 3000.00, 7000.00, 'Transfer to savings', 'REF-20230915-001', 'COMPLETED', '{"transfer_type": "internal"}', '2023-09-15 10:00:00', '2023-09-15 10:00:00', '2023-09-15 10:00:00'),
('txn-014', 'acc-003', NULL, 'DEPOSIT', 4000.00, 11000.00, 'Salary deposit', 'REF-20231001-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Finance Inc"}', '2023-10-01 08:00:00', '2023-10-01 08:00:00', '2023-10-01 08:00:00'),
('txn-015', 'acc-003', NULL, 'DEPOSIT', 4000.00, 15000.00, 'Salary deposit', 'REF-20231101-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Finance Inc"}', '2023-11-01 08:00:00', '2023-11-01 08:00:00', '2023-11-01 08:00:00'),
('txn-016', 'acc-003', NULL, 'DEPOSIT', 4000.00, 19000.00, 'Salary deposit', 'REF-20231201-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Finance Inc"}', '2023-12-01 08:00:00', '2023-12-01 08:00:00', '2023-12-01 08:00:00'),
('txn-017', 'acc-003', NULL, 'WITHDRAWAL', 500.75, 18500.75, 'ATM withdrawal', 'REF-20240112-001', 'COMPLETED', '{"atm_location": "456 Oak Ave"}', '2024-01-12 19:00:00', '2024-01-12 19:00:00', '2024-01-12 19:00:00'),
('txn-018', 'acc-004', NULL, 'INTEREST', 130.00, 52130.00, 'Monthly interest payment', 'REF-20240101-003', 'COMPLETED', '{"interest_period": "2023-12"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
-- Michael Johnson's transactions
('txn-019', 'acc-005', NULL, 'DEPOSIT', 5000.00, 5000.00, 'Initial account deposit', 'REF-20230915-001', 'COMPLETED', '{"source": "wire_transfer"}', '2023-09-15 11:05:00', '2023-09-15 11:00:00', '2023-09-15 11:05:00'),
('txn-020', 'acc-005', NULL, 'DEPOSIT', 3000.00, 8000.00, 'Business income', 'REF-20231015-001', 'COMPLETED', '{"source": "client_payment", "client": "ABC Corp"}', '2023-10-15 12:00:00', '2023-10-15 12:00:00', '2023-10-15 12:00:00'),
('txn-021', 'acc-005', NULL, 'WITHDRAWAL', 900.25, 8900.25, 'Business expense', 'REF-20240105-001', 'COMPLETED', '{"payment_method": "check", "vendor": "Office Supplies Co"}', '2024-01-05 14:00:00', '2024-01-05 14:00:00', '2024-01-05 14:00:00'),
-- Sarah Williams's transactions
('txn-022', 'acc-007', NULL, 'DEPOSIT', 8000.00, 8000.00, 'Initial account deposit', 'REF-20231010-001', 'COMPLETED', '{"source": "wire_transfer"}', '2023-10-10 09:05:00', '2023-10-10 09:00:00', '2023-10-10 09:05:00'),
('txn-023', 'acc-007', NULL, 'DEPOSIT', 5500.00, 13500.00, 'Salary deposit', 'REF-20231101-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Law Firm LLC"}', '2023-11-01 08:00:00', '2023-11-01 08:00:00', '2023-11-01 08:00:00'),
('txn-024', 'acc-007', NULL, 'DEPOSIT', 5500.00, 19000.00, 'Salary deposit', 'REF-20231201-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Law Firm LLC"}', '2023-12-01 08:00:00', '2023-12-01 08:00:00', '2023-12-01 08:00:00'),
('txn-025', 'acc-007', NULL, 'DEPOSIT', 5500.00, 22500.00, 'Salary deposit', 'REF-20240101-001', 'COMPLETED', '{"source": "direct_deposit", "employer": "Law Firm LLC"}', '2024-01-01 08:00:00', '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
('txn-026', 'acc-008', NULL, 'INTEREST', 155.83, 68155.83, 'Monthly interest payment', 'REF-20240101-004', 'COMPLETED', '{"interest_period": "2023-12"}', '2024-01-01 00:00:00', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- ============================================
-- LOANS
-- ============================================
INSERT INTO loans (id, customer_id, account_id, loan_number, loan_type, principal_amount, interest_rate, tenure_months, monthly_emi, amount_paid, amount_remaining, status, disbursed_at, closed_at, purpose, purpose_description, created_at, updated_at) VALUES
-- John Doe's loans
('loan-001', 'cust-001', 'acc-001', 'LOAN-2023-001', 'PERSONAL', 25000.00, 8.50, 36, 789.50, 4737.00, 20263.00, 'ACTIVE', '2023-08-01 10:00:00', NULL, 'Home Renovation', 'Kitchen and bathroom renovation project', '2023-07-25 14:00:00', '2024-01-15 08:00:00'),
-- Jane Smith's loans
('loan-002', 'cust-002', 'acc-003', 'LOAN-2023-002', 'AUTO', 35000.00, 6.75, 60, 689.20, 5513.60, 29486.40, 'ACTIVE', '2023-09-15 11:00:00', NULL, 'Vehicle Purchase', '2023 Honda Accord purchase', '2023-09-10 16:00:00', '2024-01-14 11:00:00'),
-- Michael Johnson's loans
('loan-003', 'cust-003', 'acc-005', 'LOAN-2023-003', 'BUSINESS', 50000.00, 9.25, 48, 1250.00, 6250.00, 43750.00, 'ACTIVE', '2023-10-20 09:00:00', NULL, 'Business Expansion', 'Office equipment and inventory purchase', '2023-10-15 13:00:00', '2024-01-13 09:00:00'),
-- Sarah Williams's loans
('loan-004', 'cust-004', 'acc-007', 'LOAN-2023-004', 'HOME', 200000.00, 5.50, 240, 1376.00, 5504.00, 194496.00, 'ACTIVE', '2023-11-01 08:00:00', NULL, 'Home Purchase', 'Primary residence mortgage', '2023-10-25 10:00:00', '2024-01-12 13:00:00'),
-- David Brown's loans
('loan-005', 'cust-005', 'acc-009', 'LOAN-2023-005', 'PERSONAL', 15000.00, 10.00, 24, 692.50, 2077.50, 12922.50, 'ACTIVE', '2023-12-10 14:00:00', NULL, 'Debt Consolidation', 'Consolidating credit card debt', '2023-12-05 11:00:00', '2024-01-11 15:00:00'),
-- Emily Davis's loans
('loan-006', 'cust-006', 'acc-011', 'LOAN-2023-006', 'EDUCATION', 30000.00, 7.00, 60, 594.00, 1188.00, 28812.00, 'ACTIVE', '2024-01-05 10:00:00', NULL, 'Student Loan', 'Graduate school tuition', '2023-12-28 15:00:00', '2024-01-10 10:00:00');

-- ============================================
-- LOAN APPLICATIONS
-- ============================================
INSERT INTO loan_applications (id, customer_id, loan_type, requested_amount, purpose, employment_details, financial_documents, credit_assessment_score, credit_assessment_notes, status, current_step, total_steps, approved_amount, approved_interest_rate, approved_tenure_months, loan_id, submitted_at, reviewed_at, reviewed_by, created_at, updated_at) VALUES
-- Approved applications (linked to existing loans)
('app-001', 'cust-001', 'PERSONAL', 25000.00, 'Home Renovation', '{"employer": "Tech Corp", "position": "Software Engineer", "years_employed": 5, "monthly_income": 7083.33}', '{"tax_return": "filed", "bank_statements": "provided"}', 85.50, 'Good credit history, stable employment, sufficient income', 'APPROVED', 3, 3, 25000.00, 8.50, 36, 'loan-001', '2023-07-25 14:00:00', '2023-07-28 10:00:00', 'usr-002', '2023-07-25 14:00:00', '2023-07-28 10:00:00'),
('app-002', 'cust-002', 'AUTO', 35000.00, 'Vehicle Purchase', '{"employer": "Finance Inc", "position": "Financial Analyst", "years_employed": 3, "monthly_income": 7916.67}', '{"tax_return": "filed", "bank_statements": "provided"}', 88.00, 'Excellent credit score, strong financial position', 'APPROVED', 3, 3, 35000.00, 6.75, 60, 'loan-002', '2023-09-10 16:00:00', '2023-09-12 11:00:00', 'usr-002', '2023-09-10 16:00:00', '2023-09-12 11:00:00'),
('app-003', 'cust-003', 'BUSINESS', 50000.00, 'Business Expansion', '{"business_type": "Consulting", "years_in_business": 7, "monthly_income": 6000.00}', '{"tax_return": "filed", "business_license": "provided"}', 82.00, 'Established business, consistent revenue', 'APPROVED', 3, 3, 50000.00, 9.25, 48, 'loan-003', '2023-10-15 13:00:00', '2023-10-18 09:00:00', 'usr-003', '2023-10-15 13:00:00', '2023-10-18 09:00:00'),
('app-004', 'cust-004', 'HOME', 200000.00, 'Home Purchase', '{"employer": "Law Firm LLC", "position": "Attorney", "years_employed": 4, "monthly_income": 9166.67}', '{"tax_return": "filed", "bank_statements": "provided", "property_appraisal": "completed"}', 90.00, 'Excellent credit, high income, property approved', 'APPROVED', 3, 3, 200000.00, 5.50, 240, 'loan-004', '2023-10-25 10:00:00', '2023-10-28 14:00:00', 'usr-002', '2023-10-25 10:00:00', '2023-10-28 14:00:00'),
('app-005', 'cust-005', 'PERSONAL', 15000.00, 'Debt Consolidation', '{"employer": "Retail Corp", "position": "Store Manager", "years_employed": 6, "monthly_income": 5666.67}', '{"tax_return": "filed", "bank_statements": "provided"}', 75.00, 'Moderate credit score, stable employment', 'APPROVED', 3, 3, 15000.00, 10.00, 24, 'loan-005', '2023-12-05 11:00:00', '2023-12-08 10:00:00', 'usr-003', '2023-12-05 11:00:00', '2023-12-08 10:00:00'),
('app-006', 'cust-006', 'EDUCATION', 30000.00, 'Student Loan', '{"student_status": "enrolled", "school": "State University", "program": "MBA"}', '{"enrollment_verification": "provided", "cost_breakdown": "submitted"}', 78.00, 'Student loan, co-signer available', 'APPROVED', 3, 3, 30000.00, 7.00, 60, 'loan-006', '2023-12-28 15:00:00', '2024-01-02 09:00:00', 'usr-002', '2023-12-28 15:00:00', '2024-01-02 09:00:00'),
-- Pending/Under Review applications
('app-007', 'cust-007', 'PERSONAL', 20000.00, 'Medical Expenses', '{"employer": "Healthcare Inc", "position": "Nurse", "years_employed": 4, "monthly_income": 6250.00}', '{"tax_return": "filed", "medical_bills": "provided"}', NULL, NULL, 'UNDER_REVIEW', 2, 3, NULL, NULL, NULL, NULL, '2024-01-08 10:00:00', NULL, NULL, '2024-01-08 10:00:00', '2024-01-08 10:00:00'),
('app-008', 'cust-008', 'AUTO', 28000.00, 'Vehicle Purchase', '{"employer": "Marketing Agency", "position": "Marketing Manager", "years_employed": 3, "monthly_income": 6833.33}', '{"tax_return": "filed", "bank_statements": "provided"}', NULL, NULL, 'SUBMITTED', 1, 3, NULL, NULL, NULL, NULL, '2024-01-10 14:00:00', NULL, NULL, '2024-01-10 14:00:00', '2024-01-10 14:00:00'),
-- Draft application
('app-009', 'cust-001', 'HOME', 150000.00, 'Home Improvement', '{"employer": "Tech Corp", "position": "Software Engineer", "years_employed": 5, "monthly_income": 7083.33}', NULL, NULL, NULL, 'DRAFT', 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-12 09:00:00', '2024-01-12 09:00:00');

-- ============================================
-- LOAN APPROVALS
-- ============================================
INSERT INTO loan_approvals (id, loan_application_id, approver_id, status, step, comments, approved_at, created_at, updated_at) VALUES
('approval-001', 'app-001', 'usr-002', 'APPROVED', 1, 'Initial review completed - all documents verified', '2023-07-26 10:00:00', '2023-07-26 10:00:00', '2023-07-26 10:00:00'),
('approval-002', 'app-001', 'usr-002', 'APPROVED', 2, 'Credit assessment passed', '2023-07-27 14:00:00', '2023-07-27 14:00:00', '2023-07-27 14:00:00'),
('approval-003', 'app-001', 'usr-002', 'APPROVED', 3, 'Final approval granted', '2023-07-28 10:00:00', '2023-07-28 10:00:00', '2023-07-28 10:00:00'),
('approval-004', 'app-002', 'usr-002', 'APPROVED', 1, 'Application reviewed and verified', '2023-09-11 09:00:00', '2023-09-11 09:00:00', '2023-09-11 09:00:00'),
('approval-005', 'app-002', 'usr-002', 'APPROVED', 2, 'Credit check passed', '2023-09-11 15:00:00', '2023-09-11 15:00:00', '2023-09-11 15:00:00'),
('approval-006', 'app-002', 'usr-002', 'APPROVED', 3, 'Approved for disbursement', '2023-09-12 11:00:00', '2023-09-12 11:00:00', '2023-09-12 11:00:00'),
('approval-007', 'app-003', 'usr-003', 'APPROVED', 1, 'Business documents verified', '2023-10-16 10:00:00', '2023-10-16 10:00:00', '2023-10-16 10:00:00'),
('approval-008', 'app-003', 'usr-003', 'APPROVED', 2, 'Business financials reviewed', '2023-10-17 11:00:00', '2023-10-17 11:00:00', '2023-10-17 11:00:00'),
('approval-009', 'app-003', 'usr-003', 'APPROVED', 3, 'Business loan approved', '2023-10-18 09:00:00', '2023-10-18 09:00:00', '2023-10-18 09:00:00');

-- ============================================
-- EMI SCHEDULES
-- ============================================
INSERT INTO emi_schedules (id, loan_id, installment_number, due_date, principal_amount, interest_amount, total_amount, paid_amount, is_paid, paid_at, transaction_id, overdue_days, created_at, updated_at) VALUES
-- John Doe's loan EMI schedule (6 installments paid)
('emi-001', 'loan-001', 1, '2023-09-01 00:00:00', 625.00, 177.08, 802.08, 802.08, true, '2023-09-01 10:00:00', 'txn-003', 0, '2023-08-01 10:00:00', '2023-09-01 10:00:00'),
('emi-002', 'loan-001', 2, '2023-10-01 00:00:00', 629.42, 172.66, 802.08, 802.08, true, '2023-10-01 10:00:00', NULL, 0, '2023-08-01 10:00:00', '2023-10-01 10:00:00'),
('emi-003', 'loan-001', 3, '2023-11-01 00:00:00', 633.88, 168.20, 802.08, 802.08, true, '2023-11-01 10:00:00', NULL, 0, '2023-08-01 10:00:00', '2023-11-01 10:00:00'),
('emi-004', 'loan-001', 4, '2023-12-01 00:00:00', 638.37, 163.71, 802.08, 802.08, true, '2023-12-01 10:00:00', NULL, 0, '2023-08-01 10:00:00', '2023-12-01 10:00:00'),
('emi-005', 'loan-001', 5, '2024-01-01 00:00:00', 642.90, 159.18, 802.08, 802.08, true, '2024-01-01 10:00:00', NULL, 0, '2023-08-01 10:00:00', '2024-01-01 10:00:00'),
('emi-006', 'loan-001', 6, '2024-02-01 00:00:00', 647.47, 154.61, 802.08, 526.78, false, NULL, NULL, 0, '2023-08-01 10:00:00', '2024-01-15 08:00:00'),
('emi-007', 'loan-001', 7, '2024-03-01 00:00:00', 652.08, 150.00, 802.08, 0.00, false, NULL, NULL, 0, '2023-08-01 10:00:00', '2023-08-01 10:00:00'),
-- Jane Smith's loan EMI schedule (8 installments paid)
('emi-008', 'loan-002', 1, '2023-10-15 00:00:00', 492.50, 196.70, 689.20, 689.20, true, '2023-10-15 10:00:00', NULL, 0, '2023-09-15 11:00:00', '2023-10-15 10:00:00'),
('emi-009', 'loan-002', 2, '2023-11-15 00:00:00', 495.27, 193.93, 689.20, 689.20, true, '2023-11-15 10:00:00', NULL, 0, '2023-09-15 11:00:00', '2023-11-15 10:00:00'),
('emi-010', 'loan-002', 3, '2023-12-15 00:00:00', 498.06, 191.14, 689.20, 689.20, true, '2023-12-15 10:00:00', NULL, 0, '2023-09-15 11:00:00', '2023-12-15 10:00:00'),
('emi-011', 'loan-002', 4, '2024-01-15 00:00:00', 500.87, 188.33, 689.20, 689.20, true, '2024-01-15 10:00:00', NULL, 0, '2023-09-15 11:00:00', '2024-01-15 10:00:00'),
('emi-012', 'loan-002', 5, '2024-02-15 00:00:00', 503.70, 185.50, 689.20, 0.00, false, NULL, NULL, 0, '2023-09-15 11:00:00', '2023-09-15 11:00:00'),
-- Michael Johnson's loan EMI schedule (5 installments paid)
('emi-013', 'loan-003', 1, '2023-11-20 00:00:00', 864.58, 385.42, 1250.00, 1250.00, true, '2023-11-20 10:00:00', NULL, 0, '2023-10-20 09:00:00', '2023-11-20 10:00:00'),
('emi-014', 'loan-003', 2, '2023-12-20 00:00:00', 873.25, 376.75, 1250.00, 1250.00, true, '2023-12-20 10:00:00', NULL, 0, '2023-10-20 09:00:00', '2023-12-20 10:00:00'),
('emi-015', 'loan-003', 3, '2024-01-20 00:00:00', 881.99, 368.01, 1250.00, 1250.00, true, '2024-01-20 10:00:00', NULL, 0, '2023-10-20 09:00:00', '2024-01-20 10:00:00'),
('emi-016', 'loan-003', 4, '2024-02-20 00:00:00', 890.80, 359.20, 1250.00, 0.00, false, NULL, NULL, 0, '2023-10-20 09:00:00', '2023-10-20 09:00:00'),
-- Sarah Williams's loan EMI schedule (4 installments paid)
('emi-017', 'loan-004', 1, '2023-12-01 00:00:00', 460.33, 915.67, 1376.00, 1376.00, true, '2023-12-01 10:00:00', NULL, 0, '2023-11-01 08:00:00', '2023-12-01 10:00:00'),
('emi-018', 'loan-004', 2, '2024-01-01 00:00:00', 462.44, 913.56, 1376.00, 1376.00, true, '2024-01-01 10:00:00', NULL, 0, '2023-11-01 08:00:00', '2024-01-01 10:00:00'),
('emi-019', 'loan-004', 3, '2024-02-01 00:00:00', 464.56, 911.44, 1376.00, 0.00, false, NULL, NULL, 0, '2023-11-01 08:00:00', '2023-11-01 08:00:00'),
-- David Brown's loan EMI schedule (3 installments paid)
('emi-020', 'loan-005', 1, '2024-01-10 00:00:00', 567.50, 125.00, 692.50, 692.50, true, '2024-01-10 10:00:00', NULL, 0, '2023-12-10 14:00:00', '2024-01-10 10:00:00'),
('emi-021', 'loan-005', 2, '2024-02-10 00:00:00', 572.23, 120.27, 692.50, 692.50, true, '2024-02-10 10:00:00', NULL, 0, '2023-12-10 14:00:00', '2024-02-10 10:00:00'),
('emi-022', 'loan-005', 3, '2024-03-10 00:00:00', 577.00, 115.50, 692.50, 692.50, true, '2024-03-10 10:00:00', NULL, 0, '2023-12-10 14:00:00', '2024-03-10 10:00:00'),
('emi-023', 'loan-005', 4, '2024-04-10 00:00:00', 581.82, 110.68, 692.50, 0.00, false, NULL, NULL, 0, '2023-12-10 14:00:00', '2023-12-10 14:00:00'),
-- Emily Davis's loan EMI schedule (2 installments paid)
('emi-024', 'loan-006', 1, '2024-02-05 00:00:00', 419.00, 175.00, 594.00, 594.00, true, '2024-02-05 10:00:00', NULL, 0, '2024-01-05 10:00:00', '2024-02-05 10:00:00'),
('emi-025', 'loan-006', 2, '2024-03-05 00:00:00', 421.44, 172.56, 594.00, 594.00, true, '2024-03-05 10:00:00', NULL, 0, '2024-01-05 10:00:00', '2024-03-05 10:00:00'),
('emi-026', 'loan-006', 3, '2024-04-05 00:00:00', 423.90, 170.10, 594.00, 0.00, false, NULL, NULL, 0, '2024-01-05 10:00:00', '2024-01-05 10:00:00');

-- ============================================
-- BILLERS
-- ============================================
INSERT INTO billers (id, customer_id, name, category, account_number, phone, email, website, created_at, updated_at) VALUES
('biller-001', 'cust-001', 'Electric Company', 'UTILITIES', 'ELEC-123456', '+1-555-2001', 'billing@electricco.com', 'https://www.electricco.com', '2023-08-01 10:00:00', '2023-08-01 10:00:00'),
('biller-002', 'cust-001', 'Water Department', 'UTILITIES', 'WTR-789012', '+1-555-2002', 'billing@waterdept.gov', 'https://www.waterdept.gov', '2023-08-01 10:00:00', '2023-08-01 10:00:00'),
('biller-003', 'cust-001', 'Internet Provider', 'TELECOMMUNICATIONS', 'INT-345678', '+1-555-2003', 'support@internet.com', 'https://www.internet.com', '2023-08-05 14:00:00', '2023-08-05 14:00:00'),
('biller-004', 'cust-002', 'Gas Company', 'UTILITIES', 'GAS-901234', '+1-555-2004', 'billing@gasco.com', 'https://www.gasco.com', '2023-09-01 09:00:00', '2023-09-01 09:00:00'),
('biller-005', 'cust-002', 'Mobile Phone Carrier', 'TELECOMMUNICATIONS', 'MOB-567890', '+1-555-2005', 'support@mobile.com', 'https://www.mobile.com', '2023-09-01 09:00:00', '2023-09-01 09:00:00'),
('biller-006', 'cust-003', 'Insurance Company', 'INSURANCE', 'INS-123789', '+1-555-2006', 'billing@insurance.com', 'https://www.insurance.com', '2023-10-01 11:00:00', '2023-10-01 11:00:00'),
('biller-007', 'cust-004', 'Credit Card Company', 'FINANCIAL', 'CC-456123', '+1-555-2007', 'support@creditcard.com', 'https://www.creditcard.com', '2023-11-01 10:00:00', '2023-11-01 10:00:00'),
('biller-008', 'cust-005', 'Healthcare Provider', 'HEALTHCARE', 'HC-789456', '+1-555-2008', 'billing@healthcare.com', 'https://www.healthcare.com', '2023-12-01 12:00:00', '2023-12-01 12:00:00'),
('biller-009', 'cust-006', 'University', 'EDUCATION', 'UNIV-123456', '+1-555-2009', 'bursar@university.edu', 'https://www.university.edu', '2024-01-01 09:00:00', '2024-01-01 09:00:00'),
('biller-010', 'cust-007', 'Property Tax Office', 'GOVERNMENT', 'TAX-456789', '+1-555-2010', 'tax@city.gov', 'https://www.city.gov/tax', '2024-01-05 14:00:00', '2024-01-05 14:00:00');

-- ============================================
-- NOTIFICATIONS
-- ============================================
INSERT INTO notifications (id, user_id, type, title, message, is_read, read_at, metadata, related_entity_type, related_entity_id, created_at) VALUES
-- John Doe's notifications
('notif-001', 'usr-101', 'LOAN_APPROVAL', 'Loan Approved', 'Your personal loan application for $25,000 has been approved.', true, '2023-07-28 11:00:00', '{"loan_id": "loan-001", "amount": 25000}', 'LOAN_APPLICATION', 'app-001', '2023-07-28 10:00:00'),
('notif-002', 'usr-101', 'PAYMENT_DUE', 'EMI Payment Due', 'Your EMI payment of $802.08 is due on February 1, 2024.', false, NULL, '{"loan_id": "loan-001", "emi_id": "emi-006", "amount": 802.08}', 'EMI_SCHEDULE', 'emi-006', '2024-01-25 08:00:00'),
('notif-003', 'usr-101', 'TRANSACTION', 'Transaction Completed', 'Your deposit of $3,000.00 has been processed successfully.', true, '2024-01-01 08:05:00', '{"transaction_id": "txn-008", "amount": 3000}', 'TRANSACTION', 'txn-008', '2024-01-01 08:00:00'),
-- Jane Smith's notifications
('notif-004', 'usr-102', 'LOAN_APPROVAL', 'Auto Loan Approved', 'Your auto loan application for $35,000 has been approved.', true, '2023-09-12 12:00:00', '{"loan_id": "loan-002", "amount": 35000}', 'LOAN_APPLICATION', 'app-002', '2023-09-12 11:00:00'),
('notif-005', 'usr-102', 'PAYMENT_DUE', 'EMI Payment Due', 'Your EMI payment of $689.20 is due on February 15, 2024.', false, NULL, '{"loan_id": "loan-002", "emi_id": "emi-012", "amount": 689.20}', 'EMI_SCHEDULE', 'emi-012', '2024-01-30 08:00:00'),
('notif-006', 'usr-102', 'ACCOUNT_UPDATE', 'Interest Credited', 'Interest of $130.00 has been credited to your savings account.', true, '2024-01-01 08:10:00', '{"account_id": "acc-004", "interest_amount": 130}', 'ACCOUNT', 'acc-004', '2024-01-01 00:00:00'),
-- Michael Johnson's notifications
('notif-007', 'usr-103', 'LOAN_APPROVAL', 'Business Loan Approved', 'Your business loan application for $50,000 has been approved.', true, '2023-10-18 10:00:00', '{"loan_id": "loan-003", "amount": 50000}', 'LOAN_APPLICATION', 'app-003', '2023-10-18 09:00:00'),
('notif-008', 'usr-103', 'PAYMENT_DUE', 'EMI Payment Due', 'Your EMI payment of $1,250.00 is due on February 20, 2024.', false, NULL, '{"loan_id": "loan-003", "emi_id": "emi-016", "amount": 1250}', 'EMI_SCHEDULE', 'emi-016', '2024-02-05 08:00:00'),
-- Sarah Williams's notifications
('notif-009', 'usr-104', 'LOAN_APPROVAL', 'Home Loan Approved', 'Your home loan application for $200,000 has been approved.', true, '2023-10-28 15:00:00', '{"loan_id": "loan-004", "amount": 200000}', 'LOAN_APPLICATION', 'app-004', '2023-10-28 14:00:00'),
('notif-010', 'usr-104', 'PAYMENT_DUE', 'EMI Payment Due', 'Your EMI payment of $1,376.00 is due on February 1, 2024.', false, NULL, '{"loan_id": "loan-004", "emi_id": "emi-019", "amount": 1376}', 'EMI_SCHEDULE', 'emi-019', '2024-01-25 08:00:00'),
-- David Brown's notifications
('notif-011', 'usr-105', 'LOAN_APPROVAL', 'Personal Loan Approved', 'Your personal loan application for $15,000 has been approved.', true, '2023-12-08 11:00:00', '{"loan_id": "loan-005", "amount": 15000}', 'LOAN_APPLICATION', 'app-005', '2023-12-08 10:00:00'),
-- Emily Davis's notifications
('notif-012', 'usr-106', 'LOAN_APPROVAL', 'Education Loan Approved', 'Your education loan application for $30,000 has been approved.', true, '2024-01-02 10:00:00', '{"loan_id": "loan-006", "amount": 30000}', 'LOAN_APPLICATION', 'app-006', '2024-01-02 09:00:00'),
('notif-013', 'usr-106', 'PAYMENT_DUE', 'EMI Payment Due', 'Your EMI payment of $594.00 is due on April 5, 2024.', false, NULL, '{"loan_id": "loan-006", "emi_id": "emi-026", "amount": 594}', 'EMI_SCHEDULE', 'emi-026', '2024-03-30 08:00:00'),
-- Robert Miller's notifications
('notif-014', 'usr-107', 'SYSTEM', 'Application Under Review', 'Your loan application is currently under review by our team.', false, NULL, '{"application_id": "app-007"}', 'LOAN_APPLICATION', 'app-007', '2024-01-08 10:00:00'),
-- Lisa Wilson's notifications
('notif-015', 'usr-108', 'SYSTEM', 'Application Submitted', 'Your loan application has been submitted successfully.', true, '2024-01-10 14:05:00', '{"application_id": "app-008"}', 'LOAN_APPLICATION', 'app-008', '2024-01-10 14:00:00');

-- ============================================
-- AUDIT LOGS
-- ============================================
INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, metadata, ip_address, user_agent, created_at) VALUES
('audit-001', 'usr-101', 'CREATE', 'ACCOUNT', 'acc-001', NULL, '{"account_number": "ACC-2023-001", "account_type": "CHECKING"}', '{"source": "web"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.100', '2023-07-20 10:00:00'),
('audit-002', 'usr-101', 'LOGIN', 'USER', 'usr-101', NULL, NULL, '{"ip": "192.168.1.100"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.100', '2023-07-20 10:05:00'),
('audit-003', 'usr-102', 'CREATE', 'ACCOUNT', 'acc-003', NULL, '{"account_number": "ACC-2023-003", "account_type": "CHECKING"}', '{"source": "web"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.101', '2023-08-25 14:00:00'),
('audit-004', 'usr-002', 'APPROVE', 'LOAN_APPLICATION', 'app-001', '{"status": "UNDER_REVIEW"}', '{"status": "APPROVED"}', '{"approver_role": "BANKER"}', '192.168.1.50', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.50', '2023-07-28 10:00:00'),
('audit-005', 'usr-002', 'APPROVE', 'LOAN_APPLICATION', 'app-002', '{"status": "UNDER_REVIEW"}', '{"status": "APPROVED"}', '{"approver_role": "BANKER"}', '192.168.1.50', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.50', '2023-09-12 11:00:00'),
('audit-006', 'usr-103', 'TRANSFER', 'TRANSACTION', 'txn-003', '{"balance": 8000.00}', '{"balance": 6000.00}', '{"transfer_type": "internal"}', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.102', '2023-08-15 14:30:00'),
('audit-007', 'usr-003', 'APPROVE', 'LOAN_APPLICATION', 'app-003', '{"status": "UNDER_REVIEW"}', '{"status": "APPROVED"}', '{"approver_role": "BANKER"}', '192.168.1.51', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.51', '2023-10-18 09:00:00'),
('audit-008', 'usr-001', 'LOGIN', 'USER', 'usr-001', NULL, NULL, '{"ip": "192.168.1.1"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1', '2024-01-15 10:30:00'),
('audit-009', 'usr-104', 'CREATE', 'LOAN_APPLICATION', 'app-004', NULL, '{"loan_type": "HOME", "requested_amount": 200000}', '{"source": "web"}', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.103', '2023-10-25 10:00:00'),
('audit-010', 'usr-105', 'UPDATE', 'ACCOUNT', 'acc-009', '{"balance": 6500.00}', '{"balance": 6500.00}', '{"action": "balance_check"}', '192.168.1.104', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)', '192.168.1.104', '2024-01-11 15:10:00');

