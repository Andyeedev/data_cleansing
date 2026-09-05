# Phase 11 Task 11.5 — Design Option 1: Table-based

## Controls Management — Table Layout

**Design:** Option 1 (Table-based)  
**Status:** Ready for Review  
**Date:** 2026-08-06  

---

## 1. Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader: "Controls Management"                           │
│ Description: "Manage validation rules and their controls"   │
│ Actions: [Create Control]                                   │
├─────────────────────────────────────────────────────────────┤
│ MetricCards: [Total] [Enabled] [Disabled] [Critical]        │
├─────────────────────────────────────────────────────────────┤
│ SearchBar: [Search controls...]                             │
├─────────────────────────────────────────────────────────────┤
│ DataTable                                                   │
│ ┌─────────┬──────────┬─────────────┬──────────┬──────────┬──────────┐
│ │ Ctrl ID │ Name     │ Description │ Severity │ Status   │ Actions  │
│ ├─────────┼──────────┼─────────────┼──────────┼──────────┼──────────┤
│ │ C01     │ Data     │ Validates   │ HIGH     │ ENABLED  │ [Edit]   │
│ │         │ Complety │ data...     │          │          │ [Delete] │
│ ├─────────┼──────────┼─────────────┼──────────┼──────────┼──────────┤
│ │ C02     │ Schema   │ Checks     │ MEDIUM   │ ENABLED  │ [Edit]   │
│ │         │ Validty  │ schema...   │          │          │ [Delete] │
│ ├─────────┼──────────┼─────────────┼──────────┼──────────┼──────────┤
│ │ C03     │ Referntl │ Validates   │ HIGH     │ DISABLED │ [Edit]   │
│ │         │ Integrity│ refernce... │          │          │ [Delete] │
│ └─────────┴──────────┴─────────────┴──────────┴──────────┴──────────┘
│ Pagination: [< 1 2 3 >]                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1 PageHeader
- **Title:** "Controls Management"
- **Description:** "Manage validation rules and their controls"
- **Actions:** "Create Control" button (primary)

### 2.2 MetricCards Row
| Card | Value | Color |
|------|-------|-------|
| Total Controls | `data.total` | `var(--color-text)` |
| Enabled | `data.controls.filter(c => c.enabled_flag).length` | `var(--color-success)` |
| Disabled | `data.controls.filter(c => !c.enabled_flag).length` | `var(--color-warning)` |
| Critical | `data.controls.filter(c => c.severity_level === 'CRITICAL').length` | `var(--color-danger)` |

### 2.3 SearchBar
- Placeholder: "Search controls..."
- Filters: Name, Description, Control ID

### 2.4 DataTable Columns
| Column | Field | Width | Alignment |
|--------|-------|-------|-----------|
| Control ID | `control_id` | 100px | Left (monospace) |
| Name | `control_name` | 200px | Left |
| Description | `description` | 300px | Left (truncated) |
| Severity | `severity_level` | 100px | Center (StatusBadge) |
| Status | `enabled_flag` | 100px | Center (StatusBadge) |
| Actions | — | 150px | Center |

### 2.5 Table Features
- **Sorting:** Click column headers to sort
- **Filtering:** SearchBar filters across all columns
- **Pagination:** 10 rows per page
- **Row Click:** Navigate to control detail (if implemented)

### 2.6 Action Buttons
- **Edit:** Opens EditModal
- **Delete:** Confirmation dialog, then delete

---

## 3. Modals

### 3.1 Create Control Modal
- Fields: Control ID, Name, Description, Severity (dropdown), Enabled (checkbox)
- Actions: Cancel, Create

### 3.2 Edit Control Modal
- Fields: Name, Description, Severity (dropdown), Enabled (checkbox)
- Actions: Cancel, Save

---

## 4. States

### 4.1 Loading State
- MetricCards: LoadingSkeleton
- Table: LoadingSkeleton rows

### 4.2 Empty State
- No controls found
- EmptyState component

### 4.3 Error State
- API error
- ErrorState component with retry

---

## 5. Components to Reuse

| # | Component | Source |
|---|-----------|--------|
| 1 | `PageHeader` | `src/components/PageHeader/PageHeader.tsx` |
| 2 | `MetricCard` | `src/components/shared/MetricCard.tsx` |
| 3 | `StatusBadge` | `src/components/shared/StatusBadge.tsx` |
| 4 | `DataTable` | `src/components/shared/DataTable.tsx` |
| 5 | `SearchBar` | `src/components/shared/SearchBar.tsx` |
| 6 | `Pagination` | `src/components/shared/Pagination.tsx` |
| 7 | `Modal` | `src/components/shared/Modal.tsx` |
| 8 | `EmptyState` | `src/components/shared/EmptyState.tsx` |
| 9 | `ErrorState` | `src/components/shared/ErrorState.tsx` |
| 10 | `LoadingSkeleton` | `src/components/shared/LoadingSkeleton.tsx` |

---

## 6. Pros & Cons

### Pros
- ✅ Familiar pattern (matches Validation → Results)
- ✅ Efficient for large datasets
- ✅ Easy comparison across controls
- ✅ Supports detailed data display
- ✅ Reuses existing DataTable component

### Cons
- ❌ Less visual appeal
- ❌ May feel cramped on mobile
- ❌ Limited visual hierarchy

---

**End of Design Option 1**
