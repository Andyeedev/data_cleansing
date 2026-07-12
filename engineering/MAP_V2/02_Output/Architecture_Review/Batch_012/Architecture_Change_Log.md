# MAP Nexus Enterprise Platform
## Architecture Change Log

**Version:** 1.0
**Date:** 2026-07-12
**Status:** Complete

---

## Changes Applied

### Change 1: Schema Model Resolution

**Before:**
- 05_Database_Architecture.md: 7 schemas (operational, governance, reporting, administration, configuration, audit, analytics)
- 12_Platform_Integration_Architecture.md: 3 schemas (core, engine, platform)

**After:**
- 5 schemas: core, engine, reporting, platform, audit

**Rationale:**
- Preserves existing core and engine tables
- Separates audit as cross-cutting concern (Security Architecture requirement)
- Keeps reporting as full capability (not just dimensions)
- Platform absorbs administration and configuration

---

### Change 2: Database Target

**Before:**
- .env references map_nexus
- SQL scripts targeted map_nexus

**After:**
- All SQL targets migration_engine
- No new database created

**Rationale:**
- Architecture mandates single database
- map_nexus doesn't exist
- migration_engine is the actual database

---

### Change 3: Backend Location

**Before:**
- MAP_V2/03_Source/backend/main.py considered as backend entry point

**After:**
- app/api/main.py is the single FastAPI entry point
- New routes added to app/api/routes/

**Rationale:**
- 11_Development_Standards.md mandates app/ as application root
- Existing backend has working auth, system, credential, execution routes
- MAP_V2/03_Source/backend/ is empty shell

---

### Change 4: Filename Fix

**Before:**
- 12_Platform_Integration_Architecture..md (double dot)

**After:**
- 12_Platform_Integration_Architecture.md (single dot)

**Rationale:**
- Consistency with other architecture documents
- Prevents reference errors

---

### Change 5: Architecture Document Update

**Before:**
- 05_Database_Architecture.md defines 7 schemas

**After:**
- 05_Database_Architecture.md updated to reflect 5-schema model

**Rationale:**
- Align with actual database state
- Align with 12_Platform_Integration_Architecture.md
- Resolve schema model conflict

---

## Pending Changes

| Change | Status |
|--------|--------|
| Create platform schema SQL | Pending |
| Create audit schema SQL | Pending |
| Extend reporting schema | Pending |
| Add user/role routes | Pending |
| Add workflow/task/calendar routes | Pending |
| Add platform services | Pending |
| Update app/api/main.py | Pending |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-12 | Initial architecture review complete |
