# Connection Design — Option A: Inline Compact Panel

## Concept
A compact inline panel that embeds directly within system configuration forms. Minimal UI, maximum efficiency. Tests run in-place with immediate visual feedback.

## Layout

```
┌─────────────────────────────────────────────────┐
│  🔌 Connection Test                             │
├─────────────────────────────────────────────────┤
│  [Test Connection]  ← primary button           │
│                                                 │
│  Status: ● Connected  |  Latency: 42ms         │
│  Version: PostgreSQL 15.2                       │
│  Capabilities: transactions, savepoints, ssl    │
└─────────────────────────────────────────────────┘
```

## Key Behaviors

- **Embedded** — Panel sits inside the System Form or Edit System page, below the connection config fields
- **One-click test** — Single "Test Connection" button; no modal, no navigation
- **Inline result** — Success/failure shown directly below the button in a colored badge
- **Minimal details** — Shows latency, version, and capabilities as a single line
- **No history** — Only shows the last test result; no historical log
- **Auto-dismiss** — Result fades after 5 seconds on success; persists on failure

## Visual Design

- Uses existing `border rounded-lg p-4` card pattern
- Success: `bg-green-50` border, green check icon
- Failure: `bg-red-50` border, red X icon
- Loading: button disabled with spinner, text changes to "Testing..."
- Follows existing Tailwind utility class conventions

## Props Interface

```tsx
interface ConnectionTestPanelProps {
  systemId?: string;
  connectionConfig: Record<string, any>;
  dbType: string;
  onTestComplete?: (result: ConnectionTestResult) => void;
}
```

## Pros
- Fastest to implement
- Least visual clutter
- Fits existing page layouts without disruption
- Users don't need to navigate away from config

## Cons
- No test history or audit trail
- Limited diagnostic information on failure
- No re-test comparison over time
- Less suitable for admin/debugging workflows

## When to Use
- Quick connection verification during system setup
- Embedded in Create/Edit System forms
- Users who primarily need "does this connect?" confirmation