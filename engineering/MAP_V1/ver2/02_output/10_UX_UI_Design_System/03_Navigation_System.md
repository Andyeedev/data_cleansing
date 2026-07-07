# MAP MVP Navigation System

| Field    | Value                            |
| -------- | -------------------------------- |
| Document | MAP MVP Navigation System        |
| Version  | 1.0                              |
| Date     | June 2026                        |
| Status   | Official                         |

---

## 1. Global Navigation — Left Sidebar

The left sidebar is the primary persistent navigation. It remains visible on all screens and provides access to every major section of the MAP platform.

### 1.1 Layout

```
┌──────────────────────────────┐
│  MAP Logo                    │  ← Brand anchor, links to Dashboard
│──────────────────────────────│
│  ○ Dashboard                 │
│  ○ Projects                  │
│  ○ Discovery                 │
│  ○ Validation                │
│  ○ Reports                   │
│  ○ Governance                │
│  ○ AI Insights               │
│  ○ Administration            │
│                              │
│                              │
│                              │
│──────────────────────────────│
│  ○ Notifications             │  ← Badge: unread count
│  ○ Settings                  │
│  ○ Help                      │
│  ○ Profile (avatar + name)   │
└──────────────────────────────┘
```

### 1.2 Behavior

| Property           | Value                                                          |
| ------------------ | -------------------------------------------------------------- |
| Position           | Fixed left edge of viewport                                    |
| Width (expanded)   | 240px                                                          |
| Width (collapsed)  | 64px (icons only)                                              |
| Collapse trigger   | Collapse toggle button, or automatic on tablet breakpoint      |
| Active state       | Background: `#667eea` at 10% opacity, text: `#667eea`, left border: 3px solid `#667eea` |
| Hover state        | Background: `gray-100` (#f3f4f6)                               |
| Section grouping   | Visual divider between primary sections and bottom utility bar |
| Scroll             | Sidebar scrolls independently if content exceeds viewport height |
| Z-index            | 1000 (above content layer)                                     |

### 1.3 Menu Items

| Section       | Label            | Icon           | Route                      | Badge              |
| ------------- | ---------------- | -------------- | -------------------------- | ------------------ |
| Primary       | Dashboard        | `LayoutDashboard` | `/dashboard`            | —                  |
| Primary       | Projects         | `Folder`       | `/projects`                | —                  |
| Primary       | Discovery        | `Radar`        | `/discovery`               | —                  |
| Primary       | Validation       | `CheckCircle`  | `/validation`              | —                  |
| Primary       | Reports          | `FileText`     | `/reports`                 | —                  |
| Primary       | Governance       | `Shield`       | `/governance`              | —                  |
| Primary       | AI Insights      | `Sparkles`     | `/ai-insights`             | New badge if unread |
| Secondary     | Administration   | `Settings2`    | `/admin`                   | —                  |
| Divider       | —                | —              | —                          | —                  |
| Bottom        | Notifications    | `Bell`         | `/notifications`           | Count badge        |
| Bottom        | Settings         | `Settings`     | `/settings`                | —                  |
| Bottom        | Help             | `HelpCircle`   | `/help`                    | —                  |
| Bottom        | Profile          | Avatar         | `/profile`                 | —                  |

---

## 2. Top Bar

The top bar is a fixed horizontal bar at the top of the viewport, spanning from the right edge of the sidebar to the right edge of the screen.

### 2.1 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  MAP > Projects > My Project > Migration ABC         🔍  🔔  👤  │
└──────────────────────────────────────────────────────────────────┘
     Breadcrumbs (left)              Search    Notifications  Avatar
```

### 2.2 Components

| Component        | Position | Description                                                        |
| ---------------- | -------- | ------------------------------------------------------------------ |
| Breadcrumbs      | Left     | Hierarchical path to current screen. Clickable except current.     |
| Search Trigger   | Center   | Search input or search icon. Opens global search modal.            |
| Notification Bell| Right    | Bell icon with unread count badge. Opens notification dropdown.    |
| User Avatar      | Right    | Circular avatar. Opens dropdown: Profile, Preferences, Sign Out.   |

### 2.3 Top Bar Behavior

| Property         | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| Position         | Fixed top, right of sidebar                               |
| Height           | 48px                                                      |
| Background       | `#ffffff`                                                 |
| Border           | Bottom: 1px solid `gray-200` (#e5e7eb)                    |
| Z-index          | 999 (below sidebar)                                       |
| Sticky           | Yes — remains fixed on scroll                             |

---

## 3. Context Navigation

Context navigation refers to in-page navigation elements that help users orient within a screen and perform actions.

### 3.1 In-Page Tabs

Used on detail screens to switch between related views.

```
┌────────────────────────────────────────────────────────────────┐
│  Project: My Migration Project                                 │
│                                                                │
│  [Overview]  [Migrations]  [Timeline]  [Team]  [Settings]     │
│────────────────────────────────────────────────────────────────│
│                                                                │
│  (tab content)                                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Active tab: bottom border 2px solid `#667eea`, text color `#667eea`
- Inactive tab: text color `gray-500` (#6b7280), hover `gray-900`
- Tabs are horizontally scrollable on narrow viewports

### 3.2 Back Buttons

- Placed at the top-left of detail screens, above the page title
- Label: `← Back to [Parent Name]`
- Navigates to the parent list or detail screen
- Keyboard: Escape key also triggers back navigation

### 3.3 Action Menus

- Placed at the top-right of content areas
- Primary action: Button (e.g., "Create", "Run Validation", "Export")
- Secondary actions: Dropdown menu (⋯ or "More actions" label)
- Destructive actions: Red text, confirmation dialog required

### 3.4 Filter and Sort Controls

- Placed directly above data tables and lists
- Filter chips: removable tags showing active filters
- Sort indicator: arrow icon on active sort column header
- "Clear all" link to reset all filters

---

## 4. Breadcrumbs

Breadcrumbs show the user's current location in the application hierarchy and provide one-click navigation to any ancestor.

### 4.1 Format

```
MAP > Projects > My Project > Migration ABC
```

- Separator: `>` (chevron icon preferred)
- Last segment: Current page, not clickable, text weight `600`
- All prior segments: Clickable links, text weight `400`
- Truncation: Middle segments collapse to `…` on narrow viewports

### 4.2 Breadcrumb Rules

| Rule                               | Detail                                                             |
| ---------------------------------- | ------------------------------------------------------------------ |
| Always reflect the hierarchy       | Breadcrumbs match the IA tree structure                            |
| Current page is never a link       | Last breadcrumb is plain text, not clickable                       |
| Clicking a parent navigates there  | Each breadcrumb item navigates to that screen's default view       |
| Max depth displayed                | 4 levels before collapsing middle segments                         |
| Mobile behavior                    | Truncate to: `… > Parent > Current`                                |

### 4.3 Breadcrumb Examples

| Screen                      | Breadcrumb                                                    |
| --------------------------- | ------------------------------------------------------------- |
| Dashboard                   | MAP (single item, no breadcrumb needed)                       |
| Project List                | MAP > Projects                                                 |
| Project Detail              | MAP > Projects > My Project                                    |
| Migration Detail            | MAP > Projects > My Project > Migration ABC                    |
| Validation Run Detail       | MAP > Validation > Run #42                                     |
| Finding Detail              | MAP > Validation > Findings > Finding #107                     |
| Policy Edit                 | MAP > Governance > Policies > Data Encryption Policy           |
| User Detail                 | MAP > Administration > Users > john.doe@corp.com               |

---

## 5. Search

Global search provides rapid access to any entity in the platform.

### 5.1 Search Interface

- Activated by: Clicking search bar, or pressing `Cmd/Ctrl+K`
- Modal overlay centered on screen, 640px wide
- Auto-focuses input on open
- Dismissed by: Escape key, clicking outside, or selecting a result

```
┌──────────────────────────────────────────────────────┐
│  🔍 Search resources, migrations, findings...    Esc │
│──────────────────────────────────────────────────────│
│                                                      │
│  Recent Searches                                     │
│  ├── web-server-prod-01                              │
│  └── SQL migration validation                       │
│                                                      │
│  Suggestions                                         │
│  ├── Resource: web-server-prod-01                    │
│  ├── Migration: phase-2-prod-cutover                │
│  └── Finding: F-2024-0042 (High)                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 5.2 Search Scope

| Entity          | Searchable Fields                                                  |
| --------------- | ------------------------------------------------------------------ |
| Resources       | Name, type, region, resource group, tags                           |
| Migrations      | Name, source, target, status                                       |
| Findings        | Title, description, rule name, severity                            |
| Policies        | Name, description, category                                        |
| Reports         | Title, project name, date generated                                |
| Users           | Name, email                                                        |

### 5.3 Search Behavior

| Behavior              | Detail                                                             |
| --------------------- | ------------------------------------------------------------------ |
| Min query length      | 2 characters                                                       |
| Debounce              | 300ms before executing search                                      |
| Results limit         | 10 per entity category, "View all" link for more                   |
| Keyboard navigation   | Arrow keys to navigate results, Enter to select                    |
| Recent searches       | Stored locally, shown on empty query, max 5                        |
| Highlighting          | Matching text highlighted in results                               |

---

## 6. Quick Actions

Quick actions provide fast access to common operations from any context.

### 6.1 Floating Action Button (FAB)

Used on list screens for primary creation action.

- Position: Bottom-right corner, 16px from edges
- Size: 56px diameter
- Color: `#667eea` background, white icon
- Icon: `Plus` or context-appropriate icon
- Tooltip on hover: Action name (e.g., "Create Project")
- Keyboard: `N` key shortcut (when not in an input field)

### 6.2 Toolbar Actions

Used on detail screens for context-specific operations.

```
┌────────────────────────────────────────────────────────────────┐
│  Migration: phase-2-prod-cutover                               │
│                                                 [Validate] [⋮] │
└────────────────────────────────────────────────────────────────┘
```

- Primary action: Prominent button (e.g., "Validate", "Run", "Export")
- Overflow actions: Dropdown menu (⋯ button)
- Placement: Top-right of content area, aligned with page title

### 6.3 Bulk Actions

Used when multiple items are selected in a list.

```
┌────────────────────────────────────────────────────────────────┐
│  3 items selected                    [Export] [Delete] [Clear] │
└────────────────────────────────────────────────────────────────┘
```

- Appears as a sticky bar above the table when items are selected
- Replaces the standard filter bar during selection
- "Clear" deselects all items and dismisses the bar

---

## 7. Responsive Navigation

MAP adapts its navigation across viewport sizes to maintain usability.

### 7.1 Breakpoints

| Name     | Width          | Sidebar Behavior        | Top Bar Behavior          |
| -------- | -------------- | ----------------------- | ------------------------- |
| Desktop  | ≥ 1280px       | Expanded (240px)        | Full breadcrumbs + search |
| Tablet   | 768px – 1279px | Collapsed (64px icons)  | Truncated breadcrumbs     |
| Mobile   | < 768px        | Hidden (hamburger)      | Hamburger + search icon   |

### 7.2 Desktop (≥ 1280px)

- Full sidebar always visible
- Top bar shows full breadcrumbs, search bar, notifications, avatar
- Content area uses remaining horizontal space

### 7.3 Tablet (768px – 1279px)

- Sidebar collapses to icon-only mode (64px)
- Hovering a sidebar icon shows a tooltip with the label
- Clicking a sidebar icon navigates to that section
- Top bar breadcrumbs truncate middle segments
- Search bar becomes search icon (expands on click)

### 7.4 Mobile (< 768px)

- Sidebar is hidden by default
- Hamburger menu icon in top-left opens a slide-out drawer with full sidebar navigation
- Tapping a navigation item closes the drawer and navigates
- Top bar shows: hamburger, page title, search icon, notification icon
- Bottom navigation bar may replace sidebar for core sections (Dashboard, Projects, Validation, Reports, Profile)
- Bottom nav items: max 5, icons with labels below

### 7.5 Responsive Navigation Summary

```
Desktop (≥1280px):
┌──────┬──────────────────────────────────────────────┐
│      │  Breadcrumbs          🔍  🔔  👤             │
│ Side │──────────────────────────────────────────────│
│ bar  │                                              │
│ 240px│  Content                                     │
│      │                                              │
└──────┴──────────────────────────────────────────────┘

Tablet (768–1279px):
┌────┬───────────────────────────────────────────────┐
│    │  Breadcrumbs…        🔍  🔔  👤                │
│Side│───────────────────────────────────────────────│
│ 64 │                                               │
│ px │  Content                                      │
│    │                                               │
└────┴───────────────────────────────────────────────┘

Mobile (<768px):
┌───────────────────────────────────────────────────┐
│  ☰  Page Title           🔍  🔔                   │
│───────────────────────────────────────────────────│
│                                                   │
│  Content                                          │
│                                                   │
│───────────────────────────────────────────────────│
│  🏠      📁      ✓      📊      👤                │
│ Home  Projects Validate Reports Profile           │
└───────────────────────────────────────────────────┘
```

---

*End of document.*
