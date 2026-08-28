-- Snowflake Certification — Baseline Seed Data (5 rows per table)
-- Run after 01_create_tables.sql in EACH database (SOURCE and TARGET)
-- USE WAREHOUSE MAP_CERT_WH; USE DATABASE MAP_CERTIFICATION_SOURCE; USE SCHEMA CERT_SCHEMA;
-- Then repeat for MAP_CERTIFICATION_TARGET to ensure exact match baseline

-- Customers (5)
INSERT INTO customers (customer_name, email, status) VALUES
('Alice Johnson', 'alice.johnson@example.com', 'active'),
('Bob Smith', 'bob.smith@example.com', 'active'),
('Carol Davis', 'carol.davis@example.com', 'active'),
('David Wilson', 'david.wilson@example.com', 'inactive'),
('Eve Brown', 'eve.brown@example.com', 'active');

-- Accounts (5) — FK to customers 1..5
INSERT INTO accounts (customer_id, account_type, balance, currency) VALUES
(1, 'checking', 1500.00, 'USD'),
(2, 'savings', 3200.50, 'USD'),
(3, 'checking', 800.75, 'EUR'),
(1, 'savings', 5400.00, 'USD'),
(5, 'checking', 2100.25, 'GBP');

-- Products (5)
INSERT INTO products (product_code, product_name, category, unit_price) VALUES
('PRD-001', 'Premium Savings', 'Savings', 99.99),
('PRD-002', 'Business Checking', 'Checking', 49.99),
('PRD-003', 'Credit Card Gold', 'Credit', 199.99),
('PRD-004', 'Loan Personal', 'Loan', 299.99),
('PRD-005', 'Investment Basic', 'Investment', 149.99);

-- Transactions (5) — FK to accounts 1..5
INSERT INTO transactions (account_id, transaction_date, transaction_type, amount) VALUES
(1, '2026-01-15', 'deposit', 500.00),
(1, '2026-01-20', 'withdrawal', -200.00),
(2, '2026-02-01', 'deposit', 1000.00),
(3, '2026-02-10', 'deposit', 300.00),
(4, '2026-03-05', 'transfer', -150.00);

-- Orders (5) — FK to customers
INSERT INTO orders (customer_id, order_date, order_status, order_total) VALUES
(1, '2026-01-20', 'completed', 299.98),
(2, '2026-02-05', 'pending', 149.99),
(3, '2026-02-15', 'completed', 499.97),
(1, '2026-03-01', 'shipped', 199.99),
(5, '2026-03-10', 'completed', 99.99);

-- Order Items (5) — FK to orders + products
INSERT INTO order_items (order_id, product_id, quantity, line_total) VALUES
(1, 1, 2, 199.98),
(1, 2, 2, 99.99),
(2, 5, 1, 149.99),
(3, 3, 1, 199.99),
(4, 4, 1, 199.99);

-- Employee Records (5)
INSERT INTO employee_records (employee_name, department, salary, employment_status) VALUES
('John Manager', 'Finance', 85000.00, 'active'),
('Sarah Analyst', 'Risk', 65000.00, 'active'),
('Mike Teller', 'Operations', 45000.00, 'active'),
('Lisa Auditor', 'Compliance', 75000.00, NULL),
('Tom Intern', 'Finance', 30000.00, 'inactive');

-- Branches (5)
INSERT INTO branches (branch_code, branch_name, region, active_flag) VALUES
('BR-001', 'Head Office', 'North', TRUE),
('BR-002', 'Downtown', 'North', TRUE),
('BR-003', 'Westside', 'West', TRUE),
('BR-004', 'Eastside', 'East', FALSE),
('BR-005', 'South Branch', 'South', TRUE);

-- Account Snapshots (5) — FK to accounts
INSERT INTO account_snapshots (account_id, snapshot_date, opening_balance, closing_balance) VALUES
(1, '2026-03-01', 1000.00, 1500.00),
(2, '2026-03-01', 2200.50, 3200.50),
(3, '2026-03-01', 500.75, 800.75),
(4, '2026-03-01', 5550.00, 5400.00),
(5, '2026-03-01', 1800.25, 2100.25);

-- Customer Risk (5) — FK to customers
INSERT INTO customer_risk (customer_id, risk_score, risk_category, review_required) VALUES
(1, 25, 'low', FALSE),
(2, 65, 'medium', TRUE),
(3, 85, 'high', TRUE),
(4, 45, 'medium', FALSE),
(5, 15, 'low', NULL);

-- Verify counts (should be 5 each)
-- SELECT 'customers' AS tbl, COUNT(*) FROM customers UNION ALL
-- SELECT 'accounts', COUNT(*) FROM accounts UNION ALL
-- SELECT 'transactions', COUNT(*) FROM transactions UNION ALL
-- SELECT 'products', COUNT(*) FROM products UNION ALL
-- SELECT 'orders', COUNT(*) FROM orders UNION ALL
-- SELECT 'order_items', COUNT(*) FROM order_items UNION ALL
-- SELECT 'employee_records', COUNT(*) FROM employee_records UNION ALL
-- SELECT 'branches', COUNT(*) FROM branches UNION ALL
-- SELECT 'account_snapshots', COUNT(*) FROM account_snapshots UNION ALL
-- SELECT 'customer_risk', COUNT(*) FROM customer_risk;
