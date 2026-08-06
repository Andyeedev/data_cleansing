# Phase 11 Task 11.5 — Design Option 2: Card-based

## Controls Management — Card Layout

**Design:** Option 2 (Card-based)  
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
│ SearchBar: [Search controls...]  [Filter: Severity ▼]       │
├─────────────────────────────────────────────────────────────┤
│ Card Grid (3 columns)                                       │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐      │
│ │ C01           │ │ C02           │ │ C03           │      │
│ │ Data Complet  │ │ Schema Valid  │ │ Referntl Intg │      │
│ │ [HIGH]        │ │ [MEDIUM]      │ │ [HIGH]        │      │
│ │ ✅ ENABLED    │ │ ✅ ENABLED    │ │ ❌ DISABLED   │      │
│ │               │ │               │ │               │      │
│ │ Validates     │ │ Checks       │ │ Validates     │      │
│ │ data comple-  │ │ schema val-  │ │ refernce     │      │
│ │ teness...     │ │ idity...     │ │ integrity... │      │
│ │               │ │               │ │               │      │
│ │ [Edit] [Del]  │ │ [Edit] [Del]  │ │ [Edit] [Del]  │      │
│ └───────────────┘ └───────────────┘ └───────────────┘      │
│                                                             │
│ ┌───────────────┐ ┌───────────────┐                         │
│ │ C04           │ │ C05           │                         │
│ │ Performance   │ │ Security      │                         │
│ │ [MEDIUM]      │ │ [CRITICAL]    │                         │
│ │ ✅ ENABLED    │ │ ✅ ENABLED    │                         │
│ │               │ │               │                         │
│ │ Measures      │ │ Validates    │                         │
│ │ performnce... │ │ security...  │                         │
│ │               │ │               │                         │
│ │ [Edit] [Del]  │ │ [Edit] [Del]  │                         │
│ └───────────────┘ └───────────────┘                         │
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

### 2.3 SearchBar & Filters
- SearchBar: "Search controls..."
- Filter Dropdown: Severity (All, LOW, MEDIUM, HIGH, CRITICAL)
- Filter Dropdown: Status (All, Enabled, Disabled)

### 2.4 ControlCard Component
```
┌─────────────────────────┐
│ Header:                 │
│   Control ID (monospace)│
│   Control Name          │
│   Severity Badge        │
│   Status Badge          │
├─────────────────────────┤
│ Body:                   │
│   Description (truncated│
│   to 2 lines)           │
├─────────────────────────┤
│ Footer:                 │
│   [Edit] [Delete]       │
└─────────────────────────┘
```

### 2.5 Card Features
- **Click:** Expand card or open detail modal
- **Hover:** Show action buttons
- **Color coding:** Left border color based on severity
  - CRITICAL: `var(--color-danger)`
  - HIGH: `var(--color-warning)`
  - MEDIUM: `var(--color-info)`
  - LOW: `var(--color-success)`

### 2.6 Card Grid Layout
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column
- Gap: `var(--space-md)`

---

## 3. Modals

### 3.1 Create Control Modal
- Fields: Control ID, Name, Description, Severity (dropdown), Enabled (checkbox)
- Actions: Cancel, Create

### 3.2 Edit Control Modal
- Fields: Name, Description, Severity (dropdown), Enabled (checkbox)
- Actions: Cancel, Save

### 3.3 Control Detail Modal (Optional)
- Full control details
- Linked rules list
- Execution history

---

## 4. States

### 4.1 Loading State
- MetricCards: LoadingSkeleton
- Cards: LoadingSkeleton cards

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
| 4 | `SearchBar` | `src/components/shared/SearchBar.tsx` |
| 5 | `Modal` | `src/components/shared/Modal.tsx` |
| 6 | `EmptyState` | `src/components/shared/EmptyState.tsx` |
| 7 | `ErrorState` | `src/components/shared/ErrorState.tsx` |
| 8 | `LoadingSkeleton` | `src/components/shared/LoadingSkeleton.tsx` |

### 5.1 New Components Required
| # | Component | Purpose |
|---|-----------|---------|
| 1 | `ControlCard` | Individual control card |
| 2 | `ControlCardGrid` | Grid layout for cards |

---

## 6. Pros & Cons

### Pros
- ✅ Visual appeal
- ✅ Better mobile experience
- ✅ Quick overview of control status
- ✅ Easy to scan
- ✅ Color-coded severity

### Cons
- ❌ Less efficient for large datasets
- ❌ Limited data display per card
- ❌ May require scrolling
- ❌ New components required (ControlCard, ControlCardGrid)

---

**End of Design Option 2**
