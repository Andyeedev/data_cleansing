--📂 CREATE TARGET TABLES + SAMPLE DATA
-- ACCOUNTS (C01)

CREATE TABLE accounts_target (
    account_id INT PRIMARY KEY,
    account_name TEXT
);

INSERT INTO accounts_target VALUES
(1, 'Alice'),
(2, 'Bob'),
(3, 'Charlie'),
(4, 'Daisy');


-- BALANCES (C02)

CREATE TABLE balances_target (
    account_id INT PRIMARY KEY,
    balance NUMERIC(18,2)
);

INSERT INTO balances_target VALUES
(1, 1000.00),
(2, 2000.00),
(3, 3000.00);

-- CUSTOMER ACCOUNTS (C03)

CREATE TABLE customer_accounts_target (
    account_id INT PRIMARY KEY,
    customer_id INT
);

INSERT INTO customer_accounts_target VALUES
(1, 10),
(2, 20),
(3, 30),
(4, 40);