# Phase 12 — Revised Implementation Order

## Corrected Sequence

| Step | Activity | Status |
|------|----------|--------|
| 1 | SQL Server auth type testing | ✅ Complete |
| 2 | Build standalone SQL Server adapter | ⏳ Next |
| 3 | Create second SQL DB (target) | ⏳ Pending |
| 4 | SQL Server → SQL Server source/target test | ⏳ Pending |
| 5 | PostgreSQL certification | ⏳ Pending |
| 6 | Full source/target testing | ⏳ Pending |
| 7 | Gate 2 Approval | ⏳ Pending |
| 8 | MAP Integration | ⏳ Pending |

---

## Next: Standalone SQL Server Adapter

**Location:** `azure-test-data/certification/src/adapter.py`

**Purpose:**
- Test SQL Server → SQL Server migration flow
- Discover schemas in both databases
- Map source tables to target tables
- Execute validation rules
- Verify results

---

## Next: Second SQL Database

**Create target database for SQL Server → SQL Server testing:**
```powershell
az sql db create --resource-group rg-sql-certification --server sql-certification-test --name target_db --sku S0
```

---

**End of Document**
