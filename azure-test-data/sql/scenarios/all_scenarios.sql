-- Phase 12: Migration Scenarios
-- Each script introduces a controlled difference between source and target

-- ============================================
-- Scenario 1: Exact Match (Baseline)
-- No changes — source and target should match
-- ============================================
-- Verify: All validation rules should pass


-- ============================================
-- Scenario 2: Row-Count Mismatch
-- Target has fewer rows than source
-- ============================================
-- PostgreSQL:
DELETE FROM customers WHERE customer_id = 5;
-- Azure SQL:
DELETE FROM customers WHERE customer_id = 5;
-- Then reload source with all 5 rows


-- ============================================
-- Scenario 3: Missing Target Row
-- Target missing a specific PK
-- ============================================
-- Azure SQL only:
DELETE FROM accounts WHERE account_id = 3;
-- Source retains all 5 rows


-- ============================================
-- Scenario 4: Duplicate Primary Key
-- Target has duplicate PK (requires constraint bypass)
-- ============================================
-- Note: This may fail at database level due to PK constraint
-- PostgreSQL:
-- INSERT INTO customers (customer_id, customer_name) VALUES (1, 'Duplicate');
-- Azure SQL:
-- INSERT INTO customers (customer_id, customer_name) VALUES (1, 'Duplicate');
-- Detection: Database-level failure


-- ============================================
-- Scenario 5: Numeric Balance Mismatch
-- Balance value differs between source and target
-- ============================================
-- Azure SQL only:
UPDATE accounts SET balance = 9999.99 WHERE account_id = 1;
-- Source retains original balance


-- ============================================
-- Scenario 6: Null-Value Difference
-- Target has NULL where source has value
-- ============================================
-- Azure SQL only:
UPDATE customers SET email = NULL WHERE customer_id = 2;
-- Source retains email value


-- ============================================
-- Scenario 7: Data-Type Difference
-- Column type differs (schema-level)
-- ============================================
-- PostgreSQL:
-- ALTER TABLE customers ALTER COLUMN customer_id TYPE BIGINT;
-- Azure SQL:
-- ALTER TABLE customers ALTER COLUMN customer_id BIGINT;
-- Detection: Schema discovery


-- ============================================
-- Scenario 8: Referential-Integrity Difference
-- FK points to missing row
-- ============================================
-- Azure SQL only:
DELETE FROM customers WHERE customer_id = 3;
-- accounts still references customer_id = 3


-- ============================================
-- Scenario 9: Column-Count/Schema Difference
-- Target has extra or missing column
-- ============================================
-- Azure SQL only:
ALTER TABLE customers ADD COLUMN temp_column VARCHAR(50);
-- Or: ALTER TABLE customers DROP COLUMN email;


-- ============================================
-- Scenario 10: Data Drift
-- Values slightly different (within tolerance?)
-- ============================================
-- Azure SQL only:
UPDATE transactions SET amount = amount + 0.01;
-- Small drift in all transaction amounts
