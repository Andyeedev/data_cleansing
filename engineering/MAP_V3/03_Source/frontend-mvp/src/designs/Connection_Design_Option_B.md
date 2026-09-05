# Connection Design — Option B: Slide-Out Drawer with History

## Concept
A slide-out drawer panel that opens from the right side of the screen. Provides test results with full history, retry capability, and detailed diagnostics.

## Layout

```
┌─────────────────────────────────────────────────┐
│  System Configuration                           │
│  [Configure fields...          ] [Test ▼]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────┐                       │
│  │ Connection Test      │  ← toggle button      │
│  └──────────────────────┘                       │
│                                                 │
│  (main form content)                            │
│                                                 │
└─────────────────────────────────────────────────┘
         ↕ drawer slides over content

┌─────────────────────────────────────────────────┐
│  Connection Test Panel          [✕ Close]       │
├─────────────────────────────────────────────────┤
│  [Run Test]  ← large primary button            │
│                                                 │
│  ── Last Result ─────────────────────────────── │
│  Status: ✅ Connected                           │
│  Latency: 42ms  |  Version: PG 15.2            │
│  Capabilities: transactions, savepoints, ssl    │
│                                                 │
│  ── Test History ────────────────────────────── │
│  2026-08-03 14:32  ✅  38ms  PG 15.2           │
│  2026-08-03 12:15  ❌  timeout  —              │
│  2026-08-02 09:00  ✅  45ms  PG 15.2           │
│                                                 │
│  ── Diagnostics ─────────────────────────────── │
│  Pool: active  |  SSL: verified  |  Auth: OK   │
└─────────────────────────────────────────────────┘
```

## Key Behaviors

- **Toggle drawer** — Click "Test Connection" button to open slide-out drawer
- **Full history** — All previous test results shown in reverse chronological order
- **Retry** — Button re-runs test; new result appended to history
- **Detailed diagnostics** — Shows pool status, SSL verification, auth method
- **Close button** — Drawer closes with X; content remains on main form
- **Persistent state** — Drawer stays open across re-renders; state preserved

## Visual Design

- Drawer: `position: fixed`, right side, `width: 380px`, `height: 100vh`
- Overlay: semi-transparent black backdrop (`bg-black/50`)
- Animation: slide-in from right, `transition-transform duration-300`
- History items: `border-b` separator, `text-sm`, monospace timestamps
- Diagnostic section: `bg-gray-50` rounded, monospace font
- Follows existing Tailwind utility class conventions

## Props Interface

```tsx
interface ConnectionTestPanelProps {
  systemId?: string;
  connectionConfig: Record<string, any>;
  dbType: string;
  onTestComplete?: (result: ConnectionTestResult) => void;
  showHistory?: boolean;  // default true in this design
}
```

## Pros
- Full test history and audit trail
- Detailed diagnostics for debugging
- Non-blocking — user can still see main form
- Professional, admin-friendly
- Supports troubleshooting intermittent connection issues

## Cons
- More complex to implement
- Takes up screen real estate
- Requires overlay/positioning logic
- May feel heavy for simple "does it connect?" checks

## When to Use
- Admin/debugging workflows
- Production environments where connection issues need diagnosis
- Systems with intermittent connectivity
- Teams that need test history for compliance