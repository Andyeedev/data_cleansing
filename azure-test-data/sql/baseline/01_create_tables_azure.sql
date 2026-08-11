-- Phase 12: Azure Test Data — Baseline Schema (Azure SQL Compatible)
-- Creates 10 tables for migration validation testing

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
