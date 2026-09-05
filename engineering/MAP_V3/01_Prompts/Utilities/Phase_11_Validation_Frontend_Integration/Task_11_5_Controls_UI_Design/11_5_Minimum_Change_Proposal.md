# Phase 11 Task 11.5 — Minimum Change Proposal

## Controls UI Design Options

**Task:** 11.5  
**Status:** Proposal Ready  
**Date:** 2026-08-06  
**Authorized By:** Pending  

---

## 1. Summary

**Core Logic:** Produce 3 design options for Controls UI. No code changes — design specifications only.

**Implementation Pattern:** N/A (documentation only)

---

## 2. Files to CREATE (3 Design Documents)

| # | File | Purpose |
|---|------|---------|
| 1 | `11_5_Design_Option_1_Table.md` | Table-based design specification |
| 2 | `11_5_Design_Option_2_Card.md` | Card-based design specification |
| 3 | `11_5_Design_Option_3_Dashboard.md` | Visual progress/dashboard design specification |

## 3. Files to MODIFY

None — design documents only.

## 4. Design Specifications

### 4.1 Design Option 1: Table-based

**Layout:**
- PageHeader: "Controls Management"
- MetricCards: Total Controls, Enabled, Disabled, Critical
- DataTable with columns:
  - Control ID (monospace)
  - Name
  - Description
  - Severity (StatusBadge)
  - Status (StatusBadge: ENABLED/DISABLED)
  - Actions (Edit, Delete buttons)

**Components to Use:**
- `PageHeader`
- `MetricCard`
- `DataTable`
- `StatusBadge`
- `SearchBar`
- `Pagination`
- `Modal` (for edit/create)

### 4.2 Design Option 2: Card-based

**Layout:**
- PageHeader: "Controls Management"
- MetricCards: Total Controls, Enabled, Disabled, Critical
- Grid of ControlCards:
  - Control ID (monospace)
  - Name
  - Description (truncated)
  - Severity (StatusBadge)
  - Status (StatusBadge: ENABLED/DISABLED)
  - Actions (Edit, Delete buttons)

**Components to Use:**
- `PageHeader`
- `MetricCard`
- `StatusBadge`
- `SearchBar`
- `Modal` (for edit/create)

### 4.3 Design Option 3: Visual progress/dashboard

**Layout:**
- PageHeader: "Controls Overview"
- Dashboard layout:
  - Compliance gauge (circular progress)
  - Risk distribution chart (bar/pie)
  - Active controls list
  - Recent activity feed
- TabBar: Overview, Details, History

**Components to Use:**
- `PageHeader`
- `MetricCard`
- `ProgressBar`
- `StatusBadge`
- `TabBar`

## 5. Implementation Order

1. Create Table-based design document
2. Create Card-based design document
3. Create Dashboard design document
4. Wait for user approval of one design
5. Implement approved design (Task 11.6)

## 6. Testing Strategy

- Visual review of design options
- User feedback on preferred design

## 7. Backward Compatibility

- Design documents only
- No code changes
- No database changes

## 8. Estimated Effort

- **Design Documents:** 1-2 hours
- **User Review:** Variable
- **Total:** 1-2 hours (documentation only)

---

**End of Document**
