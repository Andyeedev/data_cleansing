# 03_Contradiction_Report.md

# Master Architecture Consolidation — Phase A
# Contradiction Report

### MAP Nexus Enterprise Architecture

---

## Contradictions Summary

| # | Topic | Severity | Status |
|---|-------|----------|--------|
| 1 | Table Count (24 vs 62) | **Critical** | Unresolved |
| 2 | Endpoint Count (65 vs 74) | **High** | Unresolved |
| 3 | Schema Count (5 vs 6) | **Medium** | Unresolved |
| 4 | React File Count (100+ vs 525) | **Medium** | Unresolved |
| 5 | Navigation Items (103+ vs 130) | **Low** | Unresolved |
| 6 | Control Registry (3 vs 10) | **Medium** | Unresolved |

---

## Detailed Contradiction Analysis

### 1. Table Count — CRITICAL

| Source | Count | Evidence |
|--------|-------|----------|
| `18_Data/01_Executive_Summary` | **62** (57 active + 6 legacy) | Detailed per-schema |
| `18_Data/02_Database_Schema_Inventory` | **57** active | DDL evidence |
| `20_Impl/01_Executive_Summary` | **~62** | Approximate |
| `20_Impl/16_Implementation_Statistics` | **24** | **UNDERCOUNTED** |
| `15_Traceability` | **69** | Overcounted |
| `19_Solution/01_Executive_Summary` | **~62** | Approximate |

**Resolution:** `20_Impl/16` is severely undercounted. The authoritative count is **57-62** tables. `20_Impl/16` must be corrected.

---

### 2. Endpoint Count — HIGH

| Source | Count | Evidence |
|--------|-------|----------|
| `19_Solution/06_API_Architecture` | **71 + 3 health = 74** | Detailed endpoint list |
| `20_Impl/01_Executive_Summary` | **~74** | Matches 19/06 |
| `20_Impl/16_Implementation_Statistics` | **~74** | Matches 19/06 |
| `19_Solution/01_Executive_Summary` | **~65** | **UNDERCOUNTED** |
| `15_Traceability` | **72+** | Approximate |

**Resolution:** `19_Solution/01` is understated. The authoritative count is **74** endpoints. `19/01` must be updated.

---

### 3. Schema Count — MEDIUM

| Source | Count | Notes |
|--------|-------|-------|
| `05_Database_Architecture` | **5** | Excludes engine_v14 |
| `19_Solution/01_Executive_Summary` | **5** | Excludes engine_v14 |
| `20_Impl/01_Executive_Summary` | **5** | Excludes engine_v14 |
| `15_Traceability` | **6** | Includes engine_v14 |
| `18_Data/01_Executive_Summary` | **6** | Includes engine_v14 |

**Resolution:** Documents disagree on whether `engine_v14` (legacy backup schema) counts. Recommendation: Count **5 active schemas**, note `engine_v14` as legacy.

---

### 4. React File Count — MEDIUM

| Source | Count | Notes |
|--------|-------|-------|
| `19_Solution/01_Executive_Summary` | **525** React components | All files |
| `20_Impl/01_Executive_Summary` | **525** React files | All files |
| `20_Impl/16_Implementation_Statistics` | **100+** TSX, **100+** TS | Subset only |

**Resolution:** `20_Impl/16` counts only TSX/TS components, not all React files. The **525** count includes all TypeScript/TSX files in the frontend.

---

### 5. Navigation Items — LOW

| Source | Count | Notes |
|--------|-------|-------|
| `19_Solution/01_Executive_Summary` | **~130** | Total navigation items |
| `15_Traceability` | **17 menus, 103+ submenus** | Different counting method |

**Resolution:** Different counting methods. `~130` counts all items including sub-items; `103+` counts only submenus.

---

### 6. Control Registry — MEDIUM

| Source | Count | Notes |
|--------|-------|-------|
| `18_Data/02_Database_Schema_Inventory` | **C01-C03** (3) | DDL schema file |
| `20_Impl/07_Backend_Implementation` | **C01-C10** (10) | Runtime implementation |
| `07_Backend_Architecture` | **C01-C010** (10) | Rule catalogue |

**Resolution:** DDL schema file defines 3 controls, but runtime has 10. The DDL may be outdated. Recommendation: Verify against actual database.

---

## Contradiction Resolution Matrix

| # | Item | Document A | Document B | Resolution |
|---|------|------------|------------|------------|
| 1 | Tables | 20/16: 24 | 18/01: 62 | Correct 20/16 to 57-62 |
| 2 | Endpoints | 19/01: ~65 | 19/06: 74 | Update 19/01 to 74 |
| 3 | Schemas | 05: 5 | 18/01: 6 | Use 5 active, note legacy |
| 4 | React | 20/16: 100+ | 19/01: 525 | Use 525 (all files) |
| 5 | Navigation | 15: 103+ | 19/01: ~130 | Use ~130 (all items) |
| 6 | Controls | 18/02: 3 | 20/07: 10 | Verify against database |

---

**Version:** 1.0

**Status:** Phase A Review
