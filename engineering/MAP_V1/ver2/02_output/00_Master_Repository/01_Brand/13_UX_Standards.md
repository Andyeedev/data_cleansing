# MAP UX Standards

| Field    | Value                   |
| -------- | ----------------------- |
| Document | MAP UX Standards        |
| Version  | 1.0                     |
| Date     | June 2026               |
| Status   | Official                |
| Author   | MAP Design Engineering  |

---

## 1. Interaction Rules

### Click Targets

| Context         | Minimum Size | Notes                                      |
|-----------------|--------------|---------------------------------------------|
| Buttons         | 32 x 32 px  | Visual size; touch targets 44 x 44 px      |
| Links           | 32 x 32 px  | Padding extends hit area if text is short   |
| Table rows      | Full row     | Entire row is clickable for selection       |
| Checkboxes      | 32 x 32 px  | Label text extends clickable area           |
| Icon buttons    | 32 x 32 px  | 44 x 44 px on mobile/tablet                |
| Menu items      | Full width   | Full menu item height (min 32 px)          |
| Close buttons   | 32 x 32 px  | Visually distinct, clearly labelled        |

### Click Behaviour

- **Single click:** Primary action (select, open, activate).
- **Double click:** Edit mode only (inline editing in data tables, text fields).
- **Right click:** Context menu only where expected (table rows, file items). Disabled on all other elements.
- **Long press (mobile):** Context menu or multi-select (consistent with OS conventions).

### Drag and Drop

- Visual feedback: dragged item gets opacity reduction (0.5) and drop shadow.
- Drop zones highlight with primary color border and light fill on hover.
- Invalid drop targets show "not allowed" cursor.
- Keyboard alternative: all drag-and-drop actions available via keyboard (cut/paste or move buttons).
- Maximum drag ghost size: 200 x 100 px.

### Confirmation and Undo

| Action Type           | Approach                   | Details                                           |
|-----------------------|----------------------------|---------------------------------------------------|
| Destructive (delete)  | Confirmation dialog        | "Are you sure? This cannot be undone."            |
| Destructive (revoke)  | Confirmation dialog        | "Revoke [item]? [X] users will lose access."      |
| Destructive (archive) | Confirmation dialog        | "Archive [item]? It will be hidden from view."    |
| Non-destructive       | Undo via toast             | Toast with "Undo" button, 5 second window         |
| Bulk actions          | Confirmation with count    | "Delete 15 items? This cannot be undone."         |
| Financial (export)    | Confirmation dialog        | "Export [X] records to [format]?"                 |

---

## 2. Animations

### Timing

| Category  | Duration | Usage                                       |
|-----------|----------|---------------------------------------------|
| Micro     | 100–150ms| Focus ring, hover state, colour transitions |
| Small     | 200ms    | Panel slide, tooltip show, dropdown open     |
| Standard  | 300ms    | Page transition, modal open/close            |
| Large     | 400–500ms| Complex multi-element transitions (rare)    |

### Easing Functions

| Easing     | CSS Function   | Usage                                          |
|------------|----------------|------------------------------------------------|
| ease-in-out| cubic-bezier   | Default for most transitions                   |
| ease-out   | cubic-bezier   | Elements entering viewport (fade in, slide in) |
| ease-in    | cubic-bezier   | Elements leaving viewport (fade out, slide out)|
| linear     | linear         | Progress bars, loading spinners               |

### Animation Rules

- **No bouncing** or elastic effects. Professional, restrained motion.
- **No spinning** of non-spinner elements (cards, panels).
- All animations are **subtle and purposeful** — they guide attention, confirm actions, or indicate state change.
- Maximum simultaneous animated elements: 3 (to avoid visual chaos).
- Animations never block user interaction.

---

## 3. Transitions

### Page Transitions

| Transition         | Duration | Easing      | Implementation                              |
|--------------------|----------|-------------|---------------------------------------------|
| Page fade          | 150ms    | ease-in-out | Content fades out, new content fades in     |
| Route change       | 150ms    | ease-in-out | Skeleton loading during transition          |

- Page transitions are optional; skeleton screens provide loading feedback independently.
- No slide transitions between pages (reduces motion sickness risk).

### Panel Transitions

| Transition         | Duration | Easing      | Implementation                              |
|--------------------|----------|-------------|---------------------------------------------|
| Sidebar expand     | 200ms    | ease-out    | Slides from left, 64px to 240px             |
| Sidebar collapse   | 200ms    | ease-in     | Slides to left, 240px to 64px               |
| Panel slide-in     | 200ms    | ease-out    | Right-side panels (settings, filters)       |
| Panel slide-out    | 150ms    | ease-in     | Right-side panels close                     |

### Modal Transitions

| Transition         | Duration | Easing      | Implementation                              |
|--------------------|----------|-------------|---------------------------------------------|
| Modal open         | 200ms    | ease-out    | Fade in + scale from 95% to 100%            |
| Modal close        | 150ms    | ease-in     | Fade out + scale from 100% to 95%           |
| Modal backdrop     | 200ms    | ease-in-out | Fade from 0 to 0.4 opacity                  |

### Toast Transitions

| Transition         | Duration | Easing      | Implementation                              |
|--------------------|----------|-------------|---------------------------------------------|
| Toast slide-in     | 200ms    | ease-out    | Slides from right edge                      |
| Toast slide-out    | 150ms    | ease-in     | Slides to right edge                        |
| Toast auto-dismiss | 3000ms   | N/A         | Visible for 3 seconds before auto-dismiss   |

### Other Transitions

| Transition         | Duration | Easing      | Implementation                              |
|--------------------|----------|-------------|---------------------------------------------|
| Dropdown open      | 150ms    | ease-out    | Fade + scale from 95% to 100%               |
| Dropdown close     | 100ms    | ease-in     | Fade out                                    |
| Tooltip show       | 150ms    | ease-out    | Fade in                                     |
| Tooltip hide       | 100ms    | ease-in     | Fade out                                    |
| Collapse/expand    | 200ms    | ease-in-out | Height transition with content               |
| Progress update    | 300ms    | ease-in-out | Smooth progress bar fill                     |
| Checkmark draw     | 300ms    | ease-out    | SVG stroke-dashoffset animation              |

---

## 4. Loading States

### Skeleton Screens

- Used for page loads and data fetching.
- Shape matches expected content (rectangles for text, circles for avatars).
- Subtle shimmer animation (1.5s linear loop) across skeleton elements.
- Skeleton matches layout dimensions exactly (no layout shift when content loads).
- Skeletons appear within 200ms of loading start; spinner is not shown for skeleton states.

### Spinner

- Used for button actions and inline loading.
- Size: 16px (inline), 24px (button), 40px (full page), 64px (initial load).
- Color: primary gradient or current text color.
- Placed adjacent to the action being performed (e.g., inside button text).
- Always accompanied by text label: "Saving...", "Loading...", "Processing...".

### Progress Bar

- Used for determinate operations (file uploads, report generation, migrations).
- Shows percentage complete and estimated time remaining.
- Smooth animation between value changes (300ms transition).
- Color transitions: primary gradient (normal) -> green (complete) -> red (error).

### Shimmer

- Content loading placeholder with subtle gradient animation.
- Applied to card skeletons, table row skeletons, chart placeholders.
- Respects `prefers-reduced-motion`: disables shimmer, shows static gray placeholders.

### Loading State Hierarchy

| State          | Indicator        | When to Use                                    |
|----------------|------------------|------------------------------------------------|
| Initial load   | Full skeleton    | Page first loads, no cached data               |
| Data refresh   | Skeleton (partial)| Re-fetching data for existing view           |
| Action (button)| Spinner + text   | Form submit, API call, save action             |
| Determinate    | Progress bar     | Migration execution, file upload, export       |
| Background     | Subtle spinner   | Auto-refresh, polling, background sync         |
| Offline        | Offline badge    | Network connection lost                        |

---

## 5. Success Feedback

### Toast Notification

- **Position:** Bottom-right corner.
- **Duration:** 3 seconds auto-dismiss.
- **Colour:** Green background (#059669) with white text.
- **Icon:** Checkmark icon on the left.
- **Action:** Optional "Undo" button or "View" link.
- **Dismiss:** Click X or swipe right (mobile).
- **Stack:** Multiple toasts stack vertically (max 3 visible).

### Inline Success Message

- Appears below the action area (e.g., after form submission).
- Green text with checkmark icon.
- Persists until user navigates away or dismisses.
- Used when the success state is important to maintain visibility.

### Checkmark Animation

- Subtle SVG stroke-dashoffset animation (300ms).
- Applied to: completion badges, successful validation indicators, task completion.
- Draws the checkmark progressively (left to right).
- Respects `prefers-reduced-motion`: shows static checkmark immediately.

### Status Badge Update

- Badge colour transitions smoothly (300ms) when status changes.
- Badge text updates instantly.
- Subtle pulse animation (once) on status change to draw attention.

---

## 6. Error Recovery

### Inline Error Messages

- Appear directly below the relevant form field.
- Red text (#dc2626) with error icon (exclamation triangle).
- Linked to field via `aria-describedby`.
- Persist until the error condition is resolved.
- Include actionable guidance: what went wrong and how to fix it.

### Toast for System Errors

- Red background (#dc2626) with white text.
- Auto-dismiss after 5 seconds (longer than success toasts).
- Includes "Retry" button for transient failures.
- Stacks below success toasts.

### Retry Buttons

- Present on network failures, API timeouts, and transient errors.
- Styled as secondary buttons (outlined).
- Debounced: 1 second cooldown between retry attempts.
- Maximum 3 automatic retries before showing manual retry option.

### Graceful Degradation

| Scenario                  | Degradation Approach                                      |
|---------------------------|-----------------------------------------------------------|
| API failure               | Show cached data with "Data may be outdated" banner       |
| Feature unavailable       | Hide feature with "Coming soon" or show basic alternative |
| Slow network              | Skeleton loading with timeout fallback                    |
| No internet               | Offline indicator + cached content + retry when online    |
| Browser compatibility     | Core functionality works; advanced features gracefully hidden |
| Rate limiting             | Toast with retry-after countdown                          |

### Error Boundary

- Each major UI section wrapped in error boundary.
- On component failure: shows "Something went wrong" with retry option.
- Logs error to monitoring service (no sensitive data).
- Allows rest of application to continue functioning.
- Error boundary UI: simple card with error icon, message, and retry button.

---

## 7. Notifications

### Toast Notifications

- **Position:** Bottom-right corner, 16px from edges.
- **Width:** 360px (desktop), full width minus padding (mobile).
- **Duration:** 3 seconds (success/info), 5 seconds (warning/error).
- **Stack:** Vertical stack, newest on top, max 3 visible.
- **Dismiss:** Click X, swipe right (mobile), or auto-dismiss.
- **Priority:** Replaces previous toast of same type (prevents toast spam).

| Type    | Colour   | Icon       | Auto-dismiss |
|---------|----------|------------|--------------|
| Success | Green    | Checkmark  | 3 seconds    |
| Info    | Blue     | Info       | 3 seconds    |
| Warning | Orange   | Warning    | 5 seconds    |
| Error   | Red      | Error      | 5 seconds    |

### Banner Notifications

- **Position:** Top of page, below top bar.
- **Width:** Full page width.
- **Persistent:** Does not auto-dismiss (user must manually close).
- **Close button:** X icon on the right.
- **Colour:** Left border colour indicates type.

| Type    | Border Colour | Use Case                                     |
|---------|---------------|----------------------------------------------|
| Info    | Blue          | System updates, feature announcements        |
| Warning | Orange        | Maintenance windows, approaching limits      |
| Error   | Red           | Service outages, critical failures           |
| Success | Green         | Deployment complete, migration finished       |

### Badge Notifications

- **Position:** Top-right corner of bell icon.
- **Size:** 16px diameter, red background, white text.
- **Count:** Shows number of unread notifications (max "99+").
- **Pulse:** Subtle pulse animation when new notification arrives.
- **Reset:** Badge clears when notification panel is opened.

### Notification Priority

| Priority | Delivery     | Example                                       |
|----------|--------------|-----------------------------------------------|
| Critical | Modal dialog | Service outage, security alert, data loss risk|
| High     | Banner       | Migration failed, validation error, limit reached|
| Medium   | Toast        | Task completed, report generated, invite sent |
| Low      | Badge only   | New comment, suggestion, tip                  |

### Notification Settings

Users can configure notification preferences per channel:
- **In-app:** All notifications (cannot be fully disabled).
- **Email:** Critical and high only (configurable per type).
- **Webhook:** Configurable per event type.
- **Push (future):** Critical only.

---

## 8. Empty States

### No Data

- Illustration: Simple line drawing relevant to context (e.g., empty folder for no projects).
- Heading: Descriptive (e.g., "No projects yet").
- Body: Explanation and call to action (e.g., "Create your first project to get started").
- CTA Button: Primary action (e.g., "Create Project").

### No Search Results

- Illustration: Magnifying glass with question mark.
- Heading: "No results found".
- Body: "Try adjusting your search or filters."
- CTA: "Clear filters" link.

### No Permissions

- Illustration: Lock icon.
- Heading: "Access required".
- Body: "You don't have permission to view this page. Contact your administrator."
- CTA: "Request access" link.

---

## 9. Data Display Patterns

### Number Formatting

| Type          | Format               | Example           |
|---------------|----------------------|-------------------|
| Integers      | Locale-formatted     | 1,234,567         |
| Percentages   | 1 decimal + %        | 87.5%             |
| Currency      | Currency symbol + locale | $1,234.56      |
| File sizes    | KB/MB/GB + 1 decimal | 2.4 MB            |
| Durations     | h:mm:ss              | 2:15:30           |
| Dates         | Locale-formatted     | Jun 15, 2026      |
| Date + time   | Locale + time        | Jun 15, 2026 3:45 PM |
| Relative time | Human-readable       | 5 minutes ago     |

### Relative Time Rules

| Time Range       | Display               |
|------------------|-----------------------|
| < 1 minute       | "just now"            |
| 1–59 minutes     | "X minutes ago"       |
| 1–23 hours       | "X hours ago"         |
| 1–6 days         | "X days ago"          |
| 7–29 days        | "X weeks ago"         |
| 30–364 days      | "X months ago"        |
| >= 365 days      | "X years ago"         |

### Status Badges

| Status    | Colour  | Background | Icon       |
|-----------|---------|------------|------------|
| Active    | Green   | Light green| Checkmark  |
| Pending   | Yellow  | Light yellow| Clock     |
| Failed    | Red     | Light red  | X          |
| Warning   | Orange  | Light orange| Warning   |
| Inactive  | Gray    | Light gray | Pause      |
| Running   | Blue    | Light blue | Spinner    |

### Timestamps

- Always show relative time by default.
- Show absolute time on hover/tap (tooltip).
- Full timestamp in detail views and logs.
- Time zone always indicated (user's timezone or UTC).

---

## 10. Form UX Patterns

### Field Layout

- Labels always visible above fields (never floating labels that disappear).
- Required fields: asterisk (*) after label, with "required" in label text for screen readers.
- Helper text below fields (before error state).
- Error messages replace helper text (same position).

### Validation Timing

- **On blur:** Validate individual fields when user tabs away.
- **On submit:** Validate all fields, show all errors.
- **Real-time:** Only for character count and format hints (not error states).
- Never show errors before user has interacted with a field.

### Submit Button

- Placed at bottom-right of form (desktop) or full-width (mobile).
- Primary style with loading state during submission.
- Disabled state during async submission (prevents double-submit).
- Button text changes: "Save" -> "Saving..." -> "Saved" (with checkmark).

### Multi-Step Forms

- Progress indicator at top (step numbers or progress bar).
- "Back" button to return to previous step.
- Data persisted between steps (no data loss on back navigation).
- Validation on each step before advancing.
- "Save as draft" available on every step.

---

## 11. Data Table Patterns

### Sorting

- Click column header to sort ascending.
- Click again for descending.
- Click again to remove sort.
- Arrow icon indicates sort direction.
- Maximum 1 sort column at a time (single sort).

### Pagination

- 25 rows per page (default), options: 25 / 50 / 100.
- Page navigation: Previous / page numbers / Next.
- Current page highlighted.
- "Showing X-Y of Z records" text.

### Row Selection

- Checkbox column for multi-select.
- "Select all" checkbox in header.
- Selected rows highlighted with light primary background.
- Bulk actions toolbar appears when items selected.
- Keyboard: Space toggles row selection, Shift+click for range select.

### Empty Table

- Message: "No [items] found."
- Suggestion: "Try adjusting your filters or create a new [item]."
- CTA: Primary action button.

---

## 12. Responsive Interaction Adaptations

| Interaction      | Desktop                    | Mobile                         |
|------------------|----------------------------|--------------------------------|
| Right-click      | Context menu               | Long press context menu        |
| Hover            | Tooltip, hover card        | Tap to view detail             |
| Drag and drop    | Full support               | Long press + drag              |
| Multi-select     | Ctrl+click, Shift+click    | Long press to enter select mode|
| Keyboard shortcuts| Full support              | Reduced (limited keyboard)     |
| Double-click     | Edit mode                  | Tap (no double-click)          |
| Scroll           | Vertical + horizontal      | Vertical + swipe               |
