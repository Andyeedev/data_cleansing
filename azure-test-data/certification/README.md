# SQL Server Certification Project

**Purpose:** Standalone SQL Server → SQL Server migration flow testing  
**Location:** `azure-test-data/certification/` (completely outside MAP)  
**Status:** Gate 1 Approved — Implementation in progress

---

## Structure

```
certification/
├── src/
│   └── adapter.py                 ← Standalone adapter
├── tests/
│   └── test_sql_to_sql.py         ← Source/target test script
├── requirements.txt               ← Dependencies
└── README.md                      ← This file
```

---

## Prerequisites

```bash
pip install pyodbc pytest
```

---

## Environment Variables

```bash
export SOURCE_HOST="sql-certification-test.database.windows.net"
export SOURCE_DB="certification_db"
export TARGET_HOST="sql-certification-test.database.windows.net"
export TARGET_DB="target_db"
export SQL_ADMIN_USER="certadmin"
export SQL_ADMIN_PASSWORD="your-password"
```

---

## Run Tests

```bash
cd certification
python tests/test_sql_to_sql.py
```

---

## What It Tests

| Test | Description |
|------|-------------|
| Connection | Source and target database connections |
| Schema Discovery | Table and column discovery |
| Row Count | Compare row counts between source/target |
| Column Count | Compare column counts |
| Column Names | Compare column names |
| Data Types | Compare data types |

---

## Important Notes

- This is a **standalone project** — not part of MAP
- **Do not modify `app/adapters/sqlserver.py`** until Gate 2 approval
- Managed Identity tests require **Azure-hosted test runner**
- All secrets stored in **environment variables**

---

## Certification Report

After tests pass, a certification report will be produced for Gate 2 approval.
