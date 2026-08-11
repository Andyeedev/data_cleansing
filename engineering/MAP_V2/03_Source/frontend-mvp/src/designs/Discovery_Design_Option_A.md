# Discovery Design — Option A: List-Based with Progress

## Concept
A list-based discovery view showing registered systems and a progress dashboard for running discovery jobs. Simple, functional, and familiar.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Discovery                                      │
│  Discover source and target system metadata     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─ Registered Systems ──────────────────────┐ │
│  │  [Source]  my-postgres-prod    PostgreSQL │ │
│  │  [Target]  my-sql-staging     MySQL 8.0  │ │
│  │  [Source]  my-oracle-prod     Oracle 19c │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Run Discovery ──────────────────────────┐ │
│  │  [Start Discovery]  ← primary button    │ │
│  │  Batch: abc123...  ← shows after start  │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─ Discovery Progress ─────────────────────┐ │
│  │  ████████████████████░░░░  67%           │ │
│  │  Status: RUNNING                         │ │
│  │  Completed: 67 / 100                     │ │
│  │  Failed: 0                               │ │
│  │  Polling for updates...                  │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Key Behaviors

- **System list** — Shows all registered systems with role badge (SOURCE/TARGET) and database type
- **Run button** — Triggers discovery execution; button disables during run
- **Progress tracking** — ProgressBar shows completion percentage; polls for updates
- **Batch reference** — Shows truncated batch ID after discovery starts
- **Status display** — RUNNING/COMPLETED/FAILED shown via StatusBadge
- **Empty state** — "No systems registered" when no systems exist
- **Error handling** — ErrorState with retry on failure

## Visual Design

- Follows existing DiscoveryPage.tsx patterns exactly
- Uses `StatusBadge`, `ProgressBar`, `EmptyState`, `ErrorState`, `LoadingSkeleton`
- Uses `var(--space-lg)`, `var(--color-border)`, `var(--radius-md)` tokens
- Systems list: `border rounded-lg` card with row separators
- Progress section: same card pattern with grid layout for stats
- Uses inline `style` props (not CSS modules) consistent with existing codebase

## Props Interface

```tsx
interface DiscoveryPageProps {
  // No props — uses hooks internally
}
```

## Hooks Used

- `useSystemList()` — fetches registered systems
- `useRunExecution()` — triggers discovery run
- `usePollBatchStatus()` — polls for execution status

## API Endpoints

```
GET  /api/v1/systems                              — list registered systems
POST /api/v1/discovery/run                         — start discovery execution
GET  /api/v1/execution/{batch_id}/status           — poll execution status
```

## Pros
- Familiar to users — matches current DiscoveryPage
- Simple and fast to implement
- Clear progress feedback
- Works well for small-to-medium system counts
- Minimal new UI components needed

## Cons
- List-based layout doesn't scale well for many systems
- No visual schema representation
- No drill-down into individual system metadata
- Limited filtering/sorting capabilities
- Progress bar is the only visual indicator

## When to Use
- Initial discovery implementation
- Small number of systems (< 20)
- Users who need simple "run and monitor" workflow
- Quick MVP delivery