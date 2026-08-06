# Phase 11 — Gap Analysis Report
## Validation → Rules vs Migration → Mappings
## Validation → Discovery vs Migration → Discovery

**Date**: 2026-08-06  
**Status**: Awaiting Approval  
**Author**: opencode

---

## 1. Migration → Mappings (Reference Pattern)

### Key UX Patterns
| # | Pattern | Implementation |
|---|---------|----------------|
| M1 | **Tenant filter** | `TenantFilter` component — multi-tenancy scoping |
| M2 | **Contextual metrics** | Active Table Pairs, Columns Defined, Match Rate (with progress bar) |
| M3 | **Info banner** | Explains relationship between Mappings and Discovery |
| M4 | **Action bar** | Auto Map, Save (with change count), Export CSV, Clear All |
| M5 | **Search + status filter** | SearchBar + status dropdown (All/Matched/Unmapped/Modified/Pending) |
| M6 | **Validate action** | Button that runs validation and surfaces type mismatches inline |
| M7 | **Grouped table** | Source → Target table pairs as group headers |
| M8 | **Group header actions** | Each group header shows Active/Empty badge + Clear button |
| M9 | **Inline editing** | Transform dropdown + Rule text input per column row |
| M10 | **Row highlighting** | Changed rows get blue tint |
| M11 | **Confirmation modal** | For destructive Clear actions — requires typing to confirm |
| M12 | **Unmapped section** | Shows source columns without targets as tag chips |
| M13 | **Pagination** | Shows table pair count + page number |

---

## 2. Validation → Rules (Current Implementation)

### What Was Implemented
| # | Feature | Status |
|---|---------|--------|
| R1 | Tenant filter | **MISSING** |
| R2 | Contextual metrics | Partial — Total Rules, Enabled, Disabled, Critical |
| R3 | Info banner | Present |
| R4 | Action bar | Partial — Save + Refresh only |
| R5 | Search + status filter | Present |
| R6 | Severity filter | Present (extra filter) |
| R7 | Validate action | **MISSING** |
| R8 | Grouped table | Present — grouped by control_id |
| R9 | Group header actions | Partial — shows Active/Inactive badge but no per-group action |
| R10 | Inline editing | Present — Severity dropdown + Enabled checkbox |
| R11 | Row highlighting | Present |
| R12 | Confirmation modal | **MISSING** (was removed) |
| R13 | Unmapped section | **MISSING** |
| R14 | Export CSV | **MISSING** |
| R15 | Auto-generate rules | **MISSING** |
| R16 | Pagination | Present |

### Gap Summary
| Gap | Severity | Description |
|-----|----------|-------------|
| **Tenant filter** | HIGH | No multi-tenancy scoping — page shows all rules regardless of tenant |
| **Validate action** | HIGH | No way to validate rule configurations (e.g., check SQL template exists, severity is set) |
| **Export CSV** | MEDIUM | Cannot export rule configurations |
| **Confirmation modal** | MEDIUM | No safeguard for destructive actions (if Delete is added later) |
| **Unmapped rules section** | LOW | No visibility into rules without controls or orphaned rules |
| **Auto-generate rules** | MEDIUM | No way to auto-discover rules from column metadata (MAP CLI does this) |
| **Group-level actions** | LOW | No per-control-group actions (e.g., enable/disable all rules in a control) |

---

## 3. Migration → Discovery (Reference Pattern)

### Key UX Patterns
| # | Pattern | Implementation |
|---|---------|----------------|
| D1 | **Tenant filter** | `TenantFilter` component |
| D2 | **Contextual metrics** | Systems, Schemas, Tables, Matched (with match rate subtitle) |
| D3 | **Search + status filter** | SearchBar + status dropdown (All/Matched/Source Only/Target Only/Modified) |
| D4 | **SplitPane layout** | System tree (left) + Discovery Results table (right) |
| D5 | **Tree structure** | System > Schema > Table hierarchy with status icons |
| D6 | **Expand/Collapse All** | Buttons above tree |
| D7 | **Tree ↔ Table sync** | Click tree node filters table; click table row highlights tree |
| D8 | **Sortable columns** | Clickable column headers with sort arrows |
| D9 | **Column diff detail** | When table row is selected, shows column-level comparison below table |
| D10 | **Detail modal** | `DiscoveryDetailModal` — dedicated component for schema details |
| D11 | **Pagination** | Shows range (1-10 of N) |

---

## 4. Validation → Discovery (Current Implementation)

### What Was Implemented
| # | Feature | Status |
|---|---------|--------|
| DR1 | Tenant filter | **MISSING** |
| DR2 | Contextual metrics | Partial — Total Rules, Controls, Enabled, Critical |
| DR3 | Search + status filter | Present |
| DR4 | Severity filter | Present (extra filter) |
| DR5 | SplitPane layout | Present |
| DR6 | Tree structure | Present — Control > Rule hierarchy |
| DR7 | Expand/Collapse All | Present |
| DR8 | Tree ↔ Table sync | Present |
| DR9 | Sortable columns | Present |
| DR10 | Column detail view | **MISSING** — no detail when selecting a rule |
| DR11 | Detail modal | Partial — generic Modal, not DiscoveryDetailModal |
| DR12 | Pagination | Present |

### Gap Summary
| Gap | Severity | Description |
|-----|----------|-------------|
| **Tenant filter** | HIGH | No multi-tenancy scoping |
| **Column/detail view** | HIGH | When clicking a rule, no detail panel shows SQL template, parameters, execution history |
| **DiscoveryDetailModal** | MEDIUM | Using generic Modal instead of dedicated discovery detail component |
| **Metric subtitles** | LOW | Missing contextual subtitles (e.g., "X% enabled" on Enabled metric) |
| **Column diff analogy** | HIGH | Discovery shows column diff for selected table; Discovery should show rule parameters/SQL for selected rule |

---

## 5. Implementation Status

### Phase A — Validation → Rules (COMPLETED)
| # | Fix | Status | Commit |
|---|-----|--------|--------|
| A1 | Add TenantFilter to page header | **DONE** | `0a3cf5ae` |
| A2 | Add Validate button that checks rule configurations | **DONE** | `0a3cf5ae` |
| A3 | Add Export CSV button | **DONE** | `0a3cf5ae` |
| A4 | Add confirmation modal for destructive actions | **DONE** | `0a3cf5ae` |
| A5 | Add unmapped rules section (rules without controls) | **DONE** | `0a3cf5ae` |
| A6 | Add auto-generate rules from column metadata | **DONE** | `0a3cf5ae` |
| A7 | Add per-control-group bulk actions | **DONE** | `0a3cf5ae` |

### Phase B — Validation → Discovery (Before Task 11.6)
| # | Fix | Effort |
|---|-----|--------|
| B1 | Add TenantFilter to page header | LOW |
| B2 | Add rule detail panel below table (SQL template, parameters, created_at) | MEDIUM |
| B3 | Replace generic Modal with dedicated RuleDetailModal | LOW |
| B4 | Add metric subtitles | LOW |

---

## 6. Decision Required

**Option 1**: Fix Validation → Rules first, then fix Validation → Discovery, then proceed to Task 11.6  
**Option 2**: Fix both Validation → Rules and Validation → Discovery in parallel, then proceed to Task 11.6  
**Option 3**: Proceed to Task 11.6 with current gaps documented, fix in Task 11.7

**Recommendation**: Option 1 — fix Rules first to establish the pattern, then apply same fixes to Discovery.
