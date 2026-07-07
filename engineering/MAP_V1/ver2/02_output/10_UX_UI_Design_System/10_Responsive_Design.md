# MAP Responsive Design Specification

| Field    | Value                                |
| -------- | ------------------------------------ |
| Document | MAP Responsive Design Specification  |
| Version  | 1.0                                  |
| Date     | June 2026                            |
| Status   | Official                             |
| Author   | MAP Design Engineering               |

---

## 1. Breakpoints

| Name    | Width            | Layout Description                                      |
|---------|------------------|---------------------------------------------------------|
| Mobile  | < 576px          | Single column, bottom navigation, stacked content       |
| Tablet  | 576px – 991px    | Collapsed sidebar (icons only), 2-column content        |
| Laptop  | 992px – 1199px   | Full sidebar, multi-column content grid                 |
| Desktop | 1200px – 1399px  | Full layout with comfortable spacing                   |
| Wide    | >= 1400px        | Max-width container (1440px) centered on screen         |

**Breakpoint definitions use `min-width` media queries** (mobile-first approach). All styles are written for mobile and progressively enhanced for larger screens.

---

## 2. Minimum Supported Resolution

- **Minimum:** 1024 x 768
- **Recommended:** 1280 x 800 or higher
- **Optimal:** 1920 x 1080

Users on resolutions below 1024 x 768 see a banner notification suggesting they resize their browser or use a larger display. Core functionality remains accessible, but layout may be constrained.

---

## 3. Layout Adaptation

### Desktop (>= 1200px)

```
+--------------------------------------------------+
|  Top Bar (64px)                                  |
+----------+---------------------------------------+
| Sidebar  |  Content Area (fluid)                 |
| (240px)  |                                       |
|          |  +---+ +---+ +---+ +---+             |
|          |  |   | |   | |   | |   |             |
|          |  +---+ +---+ +---+ +---+             |
|          |                                       |
+----------+---------------------------------------+
```

- **Sidebar:** 240px fixed width, persistent left navigation.
- **Content:** Fluid width filling remaining space.
- **Content max-width:** 1200px within the content area.
- **Gutters:** 24px horizontal, 16px vertical between content sections.
- **Page padding:** 32px on all sides.

### Tablet (576px – 991px)

```
+--------------------------------------------------+
|  Top Bar (64px)                        [hamburger]|
+------+-------------------------------------------+
|Icons |  Content Area (fluid)                     |
|(64px)|                                           |
|      |  +----------+ +----------+               |
|      |  |          | |          |               |
|      |  +----------+ +----------+               |
|      |                                           |
+------+-------------------------------------------+
```

- **Sidebar:** 64px collapsed, icons only (no labels). Expandable to 240px on hover or hamburger toggle.
- **Content:** Fluid width with 2-column grid where appropriate.
- **Gutters:** 16px horizontal.
- **Page padding:** 16px horizontal, 24px vertical.

### Mobile (< 576px)

```
+------------------------+
|  Top Bar (56px) [hamburger]|
+------------------------+
|                        |
|  Content (full width)  |
|  Stacked vertically    |
|                        |
|  +------------------+  |
|  |                  |  |
|  +------------------+  |
|  +------------------+  |
|  |                  |  |
|  +------------------+  |
|                        |
+------------------------+
|  Bottom Nav (56px)     |
+------------------------+
```

- **No sidebar.** Navigation via bottom tab bar and hamburger menu.
- **Content:** Full width, single column, stacked vertically.
- **Page padding:** 16px horizontal.
- **Bottom navigation:** Fixed to viewport bottom.

---

## 4. Navigation Behaviour

### Desktop

- Persistent left sidebar with full labels and icons.
- Sidebar items: Dashboard, Projects, Migrations, Policies, Reports, Settings.
- Active item highlighted with primary gradient left border.
- Sidebar does not collapse; always visible.

### Tablet

- Sidebar defaults to collapsed (64px, icons only).
- Hamburger toggle in top bar expands sidebar to 240px with labels.
- Expanded sidebar overlays content (does not push).
- Click outside sidebar or select an item to collapse.
- Sidebar state remembered in `localStorage`.

### Mobile

- **Bottom tab bar** with 5 primary items: Dashboard, Projects, Migrations, Search, Profile.
- **Hamburger menu** (top-left) reveals full navigation as a slide-in panel.
- Bottom tab bar items show icon + label; active item uses primary color.
- Swipe left/right on content does NOT navigate between pages (prevents conflict with horizontal scrolling).

---

## 5. Content Adaptation

### Tables

| Viewport | Behaviour                                                                 |
|----------|---------------------------------------------------------------------------|
| Desktop  | Full table with all columns visible, fixed header, sortable columns       |
| Tablet   | Full table with horizontal scroll for wide tables, fixed first column     |
| Mobile   | Card view (each row becomes a card), or horizontal scroll with sticky name column |

- Tables with more than 6 columns always use horizontal scroll with a visual indicator (fade gradient on right edge).
- Sticky first column (entity name) always visible when scrolling horizontally.
- Mobile card view stacks key fields vertically with a "Show more" toggle for hidden columns.

### Forms

| Viewport | Behaviour                                                |
|----------|----------------------------------------------------------|
| Desktop  | 2-column layout for related fields (Name + Description)  |
| Tablet   | 2-column where space allows, single column below 768px   |
| Mobile   | Single column, all fields stacked vertically             |

- Form submit buttons are always full-width on mobile.
- Inline validation messages appear below each field on all viewports.
- Multi-step forms show a horizontal progress indicator (desktop) or vertical (mobile).

### Charts

| Viewport | Behaviour                                                    |
|----------|--------------------------------------------------------------|
| Desktop  | Full interactive charts with tooltips, legends, zoom         |
| Tablet   | Slightly smaller charts, legends below chart area            |
| Mobile   | Simplified charts; tap/click to view detail in modal         |

- Chart legends wrap to multiple lines on smaller screens.
- Donut charts become full-width on mobile; bar charts use vertical orientation.
- All charts have a "View details" fallback for mobile interaction.

### Cards

| Viewport | Behaviour                                           |
|----------|-----------------------------------------------------|
| Desktop  | 3 or 4 cards per row in a responsive grid           |
| Tablet   | 2 cards per row                                     |
| Mobile   | 1 card per row (full width), stacked vertically     |

- Cards maintain consistent padding (16px mobile, 20px tablet, 24px desktop).
- Card actions (buttons, menus) are always accessible regardless of viewport.

---

## 6. Touch Targets

| Context       | Minimum Size | Notes                                      |
|---------------|--------------|---------------------------------------------|
| Mobile        | 44 x 44 px  | All interactive elements (buttons, links)   |
| Tablet        | 44 x 44 px  | Same as mobile for touch interaction        |
| Desktop       | 32 x 32 px  | Minimum for all clickable elements          |
| Icon buttons  | 44 x 44 px  | Minimum touch area (may have smaller visual) |
| Form controls | 44 x 44 px  | Inputs, checkboxes, radio buttons           |

- Touch targets must have adequate spacing (minimum 8px between adjacent targets).
- Visual size may be smaller than touch target; use `::before` or `::after` pseudo-elements to extend hit area.
- Hover states on desktop do not affect touch target sizing.

---

## 7. Responsive Typography

| Element       | Desktop    | Tablet     | Mobile     |
|---------------|------------|------------|------------|
| H1            | 30px/1.2   | 28px/1.2   | 24px/1.3   |
| H2            | 24px/1.3   | 22px/1.3   | 20px/1.35  |
| H3            | 20px/1.4   | 18px/1.4   | 16px/1.4   |
| Body          | 14px/1.5   | 14px/1.5   | 14px/1.6   |
| Small/Caption | 12px/1.4   | 12px/1.4   | 12px/1.4   |
| Code          | 13px/1.5   | 13px/1.5   | 13px/1.5   |

- Base font size is 14px across all viewports for consistency.
- Line height increases slightly on mobile for improved readability on small screens.
- Font weights: 400 (body), 500 (medium emphasis), 600 (headings, labels), 700 (H1 only).
- Font family: Inter (system font fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif).
- Maximum line length: 72 characters for body text (prevents fatigue on wide screens).

---

## 8. Spacing Scale

| Token       | Value  | Usage                                     |
|-------------|--------|--------------------------------------------|
| `space-xs`  | 4px    | Tight spacing (icon gaps, chip padding)    |
| `space-sm`  | 8px    | Compact spacing (inline elements)          |
| `space-md`  | 16px   | Default spacing (between form fields)      |
| `space-lg`  | 24px   | Section spacing (between content blocks)   |
| `space-xl`  | 32px   | Page padding (desktop)                     |
| `space-2xl` | 48px   | Major section dividers                     |

- Spacing scales down on mobile: `space-xl` becomes 24px, `space-2xl` becomes 32px.
- Consistent spacing creates visual rhythm and reduces cognitive load.

---

## 9. Responsive Grid

- **Desktop:** 12-column grid, 24px gutter, max-width 1440px centered.
- **Tablet:** 8-column grid, 16px gutter.
- **Mobile:** 4-column grid, 16px gutter.

| Content Type       | Desktop Columns | Tablet Columns | Mobile Columns |
|--------------------|-----------------|----------------|----------------|
| Dashboard cards    | 3 per row (4col)| 2 per row (4col)| 1 per row     |
| Form fields (pair) | 6 + 6           | 4 + 4          | 4 (full width) |
| Sidebar + content  | 3 + 9           | 1 + 7          | N/A (no sidebar)|
| Data tables        | 12 (full width) | 8 (full width) | Card view      |

---

## 10. Image and Asset Handling

- All icons are SVG-based and scale infinitely.
- Dashboard charts render via canvas/SVG; no raster images for data visualizations.
- Logo upload: server-side resizing to 256x256 px for consistent display.
- Background patterns (if any) use CSS gradients, not image files.
- User-uploaded images served via CDN with responsive `srcset` where applicable.
