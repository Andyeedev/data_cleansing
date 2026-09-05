Design Option A: Minimal Timeline (Current + Polish)
Clean, card-based with color-coded left borders. Simple and functional.
┌─────────────────────────────────────────────────────────┐
│  Migration Timeline                    [Tenant ▼] [🔄] │
├─────────────────────────────────────────────────────────┤
│  Running: 0  │  Today: 2  │  Failed: 17  │  Sched: 0  │
├─────────────────────────────────────────────────────────┤
│  🔍 Search by batch ID or project...    [All Status ▼] │
├─────────────────────────────────────────────────────────┤
│  ▸ August 5, 2026                                       │
│    ┌─ ✅ 8989f171...  Data Migration Alpha  │ Completed│
│    │  0/0 controls · Duration: 45s · 10:30 AM          │
│    └─ [Details] [Retry] [Logs]                          │
│    ┌─ ❌ 542f13cd...  Client2 Data Transfer │ Failed   │
│    │  0/0 controls · Duration: 0s · 10:31 AM           │
│    │  ┃ Connection refused...                           │
│    └─ [Details] [Retry] [Logs]                          │
│  ▸ August 4, 2026                                       │
│    ...                                                  │
└─────────────────────────────────────────────────────────┘
Design Option B: Table-Style Timeline
Compact table layout with sortable columns. Better for scanning many events.
┌─────────────────────────────────────────────────────────────────────────────┐
│  Migration Timeline                                       [Tenant ▼] [🔄]  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Running: 0  │  Today: 2  │  Failed: 17  │  Scheduled: 0                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔍 Search...                                          [All Status ▼]      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Date        │ Status  │ Batch ID      │ Project            │ Duration │ ⋯ │
│  ────────────┼─────────┼───────────────┼────────────────────┼──────────┼───│
│  Aug 5 10:30 │ ✅ Done │ 8989f171-a590 │ Data Migration Alpha│   45s    │ ⋯ │
│  Aug 5 10:31 │ ❌ Fail │ 542f13cd-1676 │ Client2 Data Transf│    0s    │ ⋯ │
│  Aug 4 14:22 │ ✅ Done │ b11f2aec-7358 │ Data Migration Beta│  120s    │ ⋯ │
│  Aug 4 14:25 │ ✅ Done │ 0741c44f-26b6 │ Legacy Migration Pr│   89s    │ ⋯ │
│  ...                                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
Design Option C: Visual Timeline with Progress Bars
Graphical timeline with horizontal progress visualization. Best for status at-a-glance.
┌─────────────────────────────────────────────────────────────────┐
│  Migration Timeline                        [Tenant ▼] [🔄]    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ RUNNING │ │  TODAY  │ │ FAILED  │ │ SCHEDLD │              │
│  │    0    │ │    2    │ │   17    │ │    0    │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Search...                              [All Status ▼]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ════════════════ August 5, 2026 ════════════════              │
│                                                                 │
│  10:30 AM  ✅ COMPLETED  Data Migration Alpha                  │
│  ████████████████████████████████ 100%                         │
│  Duration: 45s · Batch: 8989f171                               │
│                                                                 │
│  10:31 AM  ❌ FAILED     Client2 Data Transfer                 │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  15%                        │
│  Duration: 0s · Batch: 542f13cd                                │
│  ⚠ Connection refused on port 5432                             │
│                                                                 │
│  ════════════════ August 4, 2026 ════════════════              │
│  ...                                                            │
└─────────────────────────────────────────────────────────────────┘