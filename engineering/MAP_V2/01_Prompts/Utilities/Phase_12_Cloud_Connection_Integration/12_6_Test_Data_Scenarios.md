# Phase 12 — Test Data Scenarios

## Migration Validation Test Scenarios

**Phase:** 12  
**Status:** Design  
**Date:** 2026-08-08

---

## 1. Test Tables (10 Tables × 5 Rows)

### Table 1: customers
| Column | Type | Purpose |
|--------|------|---------|
| customer_id | INT (PK) | Primary key |
| customer_name | VARCHAR | Text field |
| email | VARCHAR | Text field |
| status | VARCHAR | Status field |
| created_at | TIMESTAMP | Date field |

### Table 2: accounts
| Column | Type | Purpose |
|--------|------|---------|
| account_id | INT (PK) | Primary key |
| customer_id | INT (FK) | Foreign key → customers |
| account_type | VARCHAR | Text field |
| balance | DECIMAL | Numeric field |
| currency | VARCHAR | Text field |

### Table 3: transactions
| Column | Type | Purpose |
|--------|------|---------|
| transaction_id | INT (PK) | Primary key |
| account_id | INT (FK) | Foreign key → accounts |
| transaction_date | DATE | Date field |
| transaction_type | VARCHAR | Text field |
| amount | DECIMAL | Numeric field |

### Table 4: products
| Column | Type | Purpose |
|--------|------|---------|
| product_id | INT (PK) | Primary key |
| product_code | VARCHAR | Code field |
| product_name | VARCHAR | Text field |
| category | VARCHAR | Text field |
| unit_price | DECIMAL | Numeric field |

### Table 5: orders
| Column | Type | Purpose |
|--------|------|---------|
| order_id | INT (PK) | Primary key |
| customer_id | INT (FK) | Foreign key → customers |
| order_date | DATE | Date field |
| order_status | VARCHAR | Status field |
| order_total | DECIMAL | Numeric field |

### Table 6: order_items
| Column | Type | Purpose |
|--------|------|---------|
| order_item_id | INT (PK) | Primary key |
| order_id | INT (FK) | Foreign key → orders |
| product_id | INT (FK) | Foreign key → products |
| quantity | INT | Numeric field |
| line_total | DECIMAL | Numeric field |

### Table 7: employee_records
| Column | Type | Purpose |
|--------|------|---------|
| employee_id | INT (PK) | Primary key |
| employee_name | VARCHAR | Text field |
| department | VARCHAR | Text field |
| salary | DECIMAL | Numeric field |
| employment_status | VARCHAR | Status field |

### Table 8: branches
| Column | Type | Purpose |
|--------|------|---------|
| branch_id | INT (PK) | Primary key |
| branch_code | VARCHAR | Code field |
| branch_name | VARCHAR | Text field |
| region | VARCHAR | Text field |
| active_flag | BOOLEAN | Boolean field |

### Table 9: account_snapshots
| Column | Type | Purpose |
|--------|------|---------|
| snapshot_id | INT (PK) | Primary key |
| account_id | INT (FK) | Foreign key → accounts |
| snapshot_date | DATE | Date field |
| opening_balance | DECIMAL | Numeric field |
| closing_balance | DECIMAL | Numeric field |

### Table 10: customer_risk
| Column | Type | Purpose |
|--------|------|---------|
| risk_id | INT (PK) | Primary key |
| customer_id | INT (FK) | Foreign key → customers |
| risk_score | INT | Numeric field |
| risk_category | VARCHAR | Text field |
| review_required | BOOLEAN | Boolean field |

---

## 2. Migration Scenarios (10 Scenarios)

**Important:** Scenarios must distinguish between:
- **Database-level failure:** Constraint violation prevents the change (e.g., duplicate PK rejected by DB)
- **MAP validation failure:** Change succeeds but MAP detects the difference
- **Schema discovery detection:** MAP discovers schema differences during discovery

| # | Scenario | Description | Detection Level | DB-Specific Notes |
|---|----------|-------------|-----------------|-------------------|
| 1 | Exact match | Source = Target | Baseline | None |
| 2 | Row-count mismatch | Target has fewer rows | MAP validation | DELETE row from target |
| 3 | Missing target row | Target missing PK | MAP validation | DELETE specific row |
| 4 | Duplicate primary key | Target has duplicate | **Database-level** (constraint) | May need to disable constraint temporarily |
| 5 | Numeric balance mismatch | Balance differs | MAP validation | UPDATE balance value |
| 6 | Null-value difference | Target has NULL | MAP validation | SET column = NULL |
| 7 | Data-type difference | Type mismatch | **Schema discovery** | ALTER column type (PG: TYPE, SQL: ALTER) |
| 8 | Referential-integrity difference | FK points to missing row | MAP validation | DELETE referenced row |
| 9 | Column-count/schema difference | Extra/missing column | **Schema discovery** | ALTER TABLE (PG/SQL syntax differs) |
| 10 | Data drift | Values slightly different | MAP validation | UPDATE multiple values |

**DB-Specific Handling:**
- PostgreSQL: `ALTER COLUMN TYPE`, `DROP CONSTRAINT`
- Azure SQL: `ALTER COLUMN`, `ALTER CONSTRAINT`
- Each scenario script must have PG and SQL variants

---

## 3. Relationship Diagram

```
customers (1) ────────< accounts (many)
  │                         │
  ├──< orders (many)        ├──< transactions (many)
  │       │                 └──< account_snapshots (many)
  │       └──< order_items (many)
  │
  └──< customer_risk (many)

products (1) ────────< order_items (many)

branches (standalone)
employee_records (standalone)
```

---

## 4. Reset Strategy

| Action | Method |
|--------|--------|
| Reset to baseline | Run `reset_to_baseline.sql` |
| Destroy databases | `terraform destroy` or `az group delete` |
| Recreate databases | `terraform apply` or `provision.sh` |
| Reseed data | Run `seed.sh` |

---

**End of Document**
