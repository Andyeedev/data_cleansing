-- Phase 12: Reset Azure SQL Database
-- Drops all tables, recreates them, and seeds baseline data
-- Usage: sqlcmd -S <server> -U <user> -d <db> -P <pass> -i reset_azure.sql

-- Drop all tables
DROP TABLE IF EXISTS customer_risk;
DROP TABLE IF EXISTS account_snapshots;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS employee_records;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;

-- Table 1: Customers (PK, text, row-count)
CREATE TABLE customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100),
    status NVARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE()
);

-- Table 2: Accounts (FK, numeric balances)
CREATE TABLE accounts (
    account_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    account_type NVARCHAR(50),
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency NVARCHAR(3) DEFAULT 'USD'
);

-- Table 3: Transactions (Numeric aggregation)
CREATE TABLE transactions (
    transaction_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    transaction_date DATE,
    transaction_type NVARCHAR(50),
    amount DECIMAL(15,2)
);

-- Table 4: Products (Reference data)
CREATE TABLE products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    product_code NVARCHAR(20) UNIQUE,
    product_name NVARCHAR(100),
    category NVARCHAR(50),
    unit_price DECIMAL(10,2)
);

-- Table 5: Orders (Parent/child, totals)
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    order_date DATE,
    order_status NVARCHAR(20),
    order_total DECIMAL(15,2)
);

-- Table 6: Order Items (FK, calculations)
CREATE TABLE order_items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER,
    line_total DECIMAL(15,2)
);

-- Table 7: Employee Records (Dates, nullable)
CREATE TABLE employee_records (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_name NVARCHAR(100),
    department NVARCHAR(50),
    salary DECIMAL(12,2),
    employment_status NVARCHAR(20)
);

-- Table 8: Branches (Geographic/reference)
CREATE TABLE branches (
    branch_id INT IDENTITY(1,1) PRIMARY KEY,
    branch_code NVARCHAR(10) UNIQUE,
    branch_name NVARCHAR(100),
    region NVARCHAR(50),
    active_flag BIT DEFAULT 1
);

-- Table 9: Account Snapshots (Data drift)
CREATE TABLE account_snapshots (
    snapshot_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    snapshot_date DATE,
    opening_balance DECIMAL(15,2),
    closing_balance DECIMAL(15,2)
);

-- Table 10: Customer Risk (Boolean, nullable)
CREATE TABLE customer_risk (
    risk_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    risk_score INTEGER,
    risk_category NVARCHAR(20),
    review_required BIT DEFAULT 0
);

-- Insert baseline data

-- Table 1: Customers
INSERT INTO customers (customer_name, email, status, created_at) VALUES
('Alice Johnson', 'alice@example.com', 'active', '2024-01-15'),
('Bob Smith', 'bob@example.com', 'active', '2024-02-20'),
('Carol Williams', 'carol@example.com', 'inactive', '2024-03-10'),
('David Brown', 'david@example.com', 'active', '2024-04-05'),
('Eve Davis', 'eve@example.com', 'active', '2024-05-12');

-- Table 2: Accounts
INSERT INTO accounts (customer_id, account_type, balance, currency) VALUES
(1, 'checking', 5000.00, 'USD'),
(1, 'savings', 15000.00, 'USD'),
(2, 'checking', 3500.00, 'USD'),
(3, 'savings', 25000.00, 'USD'),
(4, 'checking', 1200.00, 'USD');

-- Table 3: Transactions
INSERT INTO transactions (account_id, transaction_date, transaction_type, amount) VALUES
(1, '2024-06-01', 'deposit', 1000.00),
(1, '2024-06-05', 'withdrawal', 200.00),
(2, '2024-06-10', 'transfer', 500.00),
(3, '2024-06-15', 'deposit', 750.00),
(4, '2024-06-20', 'withdrawal', 100.00);

-- Table 4: Products
INSERT INTO products (product_code, product_name, category, unit_price) VALUES
('PROD-001', 'Widget A', 'Widgets', 9.99),
('PROD-002', 'Widget B', 'Widgets', 19.99),
('PROD-003', 'Gadget X', 'Gadgets', 49.99),
('PROD-004', 'Gadget Y', 'Gadgets', 89.99),
('PROD-005', 'Tool Z', 'Tools', 29.99);

-- Table 5: Orders
INSERT INTO orders (customer_id, order_date, order_status, order_total) VALUES
(1, '2024-06-01', 'completed', 29.98),
(2, '2024-06-05', 'completed', 49.99),
(1, '2024-06-10', 'pending', 19.99),
(3, '2024-06-15', 'completed', 139.98),
(4, '2024-06-20', 'shipped', 89.99);

-- Table 6: Order Items
INSERT INTO order_items (order_id, product_id, quantity, line_total) VALUES
(1, 1, 2, 19.98),
(1, 2, 1, 9.99),
(2, 3, 1, 49.99),
(3, 2, 1, 19.99),
(4, 4, 1, 89.99);

-- Table 7: Employee Records
INSERT INTO employee_records (employee_name, department, salary, employment_status) VALUES
('John Manager', 'Engineering', 95000.00, 'active'),
('Jane Engineer', 'Engineering', 85000.00, 'active'),
('Bob Analyst', 'Finance', 70000.00, 'active'),
('Alice Designer', 'Design', 75000.00, 'leave'),
('Carol Director', 'Executive', 120000.00, 'active');

-- Table 8: Branches
INSERT INTO branches (branch_code, branch_name, region, active_flag) VALUES
('NYC-001', 'New York Main', 'Northeast', 1),
('LAX-001', 'Los Angeles', 'West', 1),
('CHI-001', 'Chicago Central', 'Midwest', 1),
('HOU-001', 'Houston South', 'South', 0),
('MIA-001', 'Miami Beach', 'Southeast', 1);

-- Table 9: Account Snapshots
INSERT INTO account_snapshots (account_id, snapshot_date, opening_balance, closing_balance) VALUES
(1, '2024-06-01', 4000.00, 5000.00),
(2, '2024-06-01', 14500.00, 15000.00),
(3, '2024-06-01', 3000.00, 3500.00),
(4, '2024-06-01', 24500.00, 25000.00),
(5, '2024-06-01', 1100.00, 1200.00);

-- Table 10: Customer Risk
INSERT INTO customer_risk (customer_id, risk_score, risk_category, review_required) VALUES
(1, 25, 'low', 0),
(2, 45, 'medium', 0),
(3, 75, 'high', 1),
(4, 15, 'low', 0),
(5, 60, 'medium', 1);
