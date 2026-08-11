-- Phase 12: Azure Test Data — Baseline Schema
-- Creates 10 tables for migration validation testing

-- Table 1: Customers (PK, text, row-count)
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Accounts (FK, numeric balances)
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    account_type VARCHAR(50),
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD'
);

-- Table 3: Transactions (Numeric aggregation)
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    transaction_date DATE,
    transaction_type VARCHAR(50),
    amount DECIMAL(15,2)
);

-- Table 4: Products (Reference data)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_code VARCHAR(20) UNIQUE,
    product_name VARCHAR(100),
    category VARCHAR(50),
    unit_price DECIMAL(10,2)
);

-- Table 5: Orders (Parent/child, totals)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    order_date DATE,
    order_status VARCHAR(20),
    order_total DECIMAL(15,2)
);

-- Table 6: Order Items (FK, calculations)
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER,
    line_total DECIMAL(15,2)
);

-- Table 7: Employee Records (Dates, nullable)
CREATE TABLE employee_records (
    employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(12,2),
    employment_status VARCHAR(20)
);

-- Table 8: Branches (Geographic/reference)
CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    branch_code VARCHAR(10) UNIQUE,
    branch_name VARCHAR(100),
    region VARCHAR(50),
    active_flag BOOLEAN DEFAULT TRUE
);

-- Table 9: Account Snapshots (Data drift)
CREATE TABLE account_snapshots (
    snapshot_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id),
    snapshot_date DATE,
    opening_balance DECIMAL(15,2),
    closing_balance DECIMAL(15,2)
);

-- Table 10: Customer Risk (Boolean, nullable)
CREATE TABLE customer_risk (
    risk_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    risk_score INTEGER,
    risk_category VARCHAR(20),
    review_required BOOLEAN DEFAULT FALSE
);
