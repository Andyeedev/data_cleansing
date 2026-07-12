# Prompt 018: Create Report Viewer — Analysis

**Date:** 2026-07-09  
**Status:** Analysis Complete — Awaiting Go-Ahead  
**Prompt:** `engineering\MAP_V2\01_Prompts\Workstream_03_Presentation_Engine\018_Create_Report_Viewer.md`

---

## 1. What the Prompt Asks For

Create a reusable Report Viewer that provides a consistent enterprise viewing experience for all MAP reports. The viewer is the **display layer** — it renders reports but does not generate them.

**Scope:**
- Presentation framework only
- No report generation
- No backend integration
- No APIs
- No export functionality

**Key Distinction:**
| Component | Purpose |
|-----------|---------|
| HTML Reporting Framework (016) | **Generates** report HTML from templates and data |
| Report Centre (017) | **Manages** reports — browse, search, schedule, queue |
| Report Viewer (018) | **Views** reports — display, navigate, zoom, annotate |

---

## 2. What Already Exists

| Existing Component | Location | Relevance |
|-------------------|----------|-----------|
| HtmlReport | `reporting/html/framework/HtmlReport.tsx` | Top-level report component — can be rendered inside the viewer canvas |
| ReportRenderer | `reporting/html/framework/ReportRenderer.tsx` | Assembles sections and renders HTML — the viewer will wrap this |
| ReportContext | `reporting/html/framework/ReportContext.tsx` | Report state — viewer may extend or use alongside its own context |
| ReportLayout | `reporting/html/framework/ReportLayout.tsx` | Print-optimised layout — viewer provides its own chrome around this |
| ReportPreview | `reporting/centre/ReportPreview.tsx` | Simple preview in Report Centre — viewer is a full-featured version |
| HtmlReportWidget | `components/widgets/reports/HtmlReportWidget.tsx` | Renders HTML via `dangerouslySetInnerHTML` — could be used for simple rendering |
| Widget Framework | `components/widgets/` | 18 widgets available for viewer UI elements |
| Theme System | `theme/` | Complete design tokens for styling |

**Key Insight:** The HTML Reporting Framework generates report content. The Report Viewer wraps that content in a professional viewing experience with toolbar, sidebar, navigation, search, zoom, and other viewer controls.

---

## 3. Files to Create

### 3.1 Viewer Core (`src/reporting/viewer/` — 18 files)

| File | Purpose | Dependencies |
|------|---------|-------------|
| `ReportViewer.tsx` | Top-level viewer component — orchestrates layout | ReportViewerContext, ReportCanvas, ReportToolbar, ReportSidebar |
| `ReportCanvas.tsx` | Viewing surface — renders report content, handles scroll, zoom | ReportViewerContext |
| `ReportToolbar.tsx` | Top toolbar — open, refresh, print, export, download, fullscreen, zoom, search, share, AI summary | ReportViewerContext |
| `ReportNavigation.tsx` | Bottom/side navigation — previous/next section, page jump, TOC, breadcrumbs | ReportViewerContext |
| `ReportOutline.tsx` | Report outline panel — hierarchical section view | ReportViewerContext |
| `ReportBookmarks.tsx` | Bookmarks panel — saved positions within report | ReportViewerContext |
| `ReportHeader.tsx` | Report header — name, owner, category, date, version, project, status | ReportViewerContext |
| `ReportFooter.tsx` | Report footer — page numbers, generation info | ReportViewerContext |
| `ReportMetadata.tsx` | Metadata panel — full report metadata display | ReportViewerContext |
| `ReportProperties.tsx` | Properties panel — report details and settings | ReportViewerContext |
| `ReportSidebar.tsx` | Sidebar container — houses TOC, bookmarks, comments, metadata panels | ReportViewerContext |
| `ReportComments.tsx` | Comments panel — notes, review items, discussion threads | ReportViewerContext |
| `ReportAnnotations.tsx` | Annotations panel — highlights, bookmarks, markers, flags | ReportViewerContext |
| `ReportSearch.tsx` | Search controls — search input, highlight results, match count, prev/next | ReportViewerContext |
| `ReportZoom.tsx` | Zoom controls — fit width, fit page, 100%, 125%, 150%, 200% | ReportViewerContext |
| `ReportFullscreen.tsx` | Fullscreen mode — fullscreen, presentation mode, reading mode | ReportViewerContext |
| `ReportPrintPreview.tsx` | Print preview — print-optimised view | ReportViewerContext |
| `ReportViewerContext.tsx` | React context — viewer state (zoom, active section, bookmarks, search, etc.) | React Context |

### 3.2 Components & Widgets (`src/reporting/viewer/components/widgets/`)

| File | Purpose |
|------|---------|
| `ViewerToolbarButton.tsx` | Reusable toolbar button with icon, tooltip, disabled state |
| `ViewerSidebarPanel.tsx` | Reusable sidebar panel with header, content, collapse |
| `ViewerZoomControl.tsx` | Zoom dropdown with preset levels |
| `ViewerSearchBar.tsx` | Search input with match navigation |
| `ViewerPageIndicator.tsx` | Page X of Y indicator |

### 3.3 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Architecture, usage, integration guide |

**Total:** 24 files

---

## 4. Implementation Plan

### Phase 1: Context & Types
1. Create `ReportViewerContext.tsx` — viewer state (zoom level, active section, bookmarks, search state, sidebar panels, fullscreen mode)

### Phase 2: Layout Components
2. Create `ReportToolbar.tsx` — top toolbar with all controls
3. Create `ReportSidebar.tsx` — sidebar container with panel switching
4. Create `ReportCanvas.tsx` — main viewing surface
5. Create `ReportHeader.tsx` — report header display
6. Create `ReportFooter.tsx` — report footer with page numbers

### Phase 3: Navigation & Search
7. Create `ReportNavigation.tsx` — section navigation controls
8. Create `ReportOutline.tsx` — hierarchical outline panel
9. Create `ReportSearch.tsx` — search controls
10. Create `ReportZoom.tsx` — zoom controls

### Phase 4: Panels & Features
11. Create `ReportBookmarks.tsx` — bookmarks panel
12. Create `ReportComments.tsx` — comments panel
13. Create `ReportAnnotations.tsx` — annotations panel
14. Create `ReportMetadata.tsx` — metadata panel
15. Create `ReportProperties.tsx` — properties panel

### Phase 5: Modes
16. Create `ReportFullscreen.tsx` — fullscreen/presentation/reading modes
17. Create `ReportPrintPreview.tsx` — print preview mode

### Phase 6: Widgets & Assembly
18. Create viewer widget components
19. Create `ReportViewer.tsx` — top-level orchestrator
20. Create `README.md` — documentation

---

## 5. Viewer Layout

```
┌─────────────────────────────────────────────────────────────┐
│                      ReportToolbar                          │
│  [Open] [Refresh] [Print] [Export] [Download] [Search]     │
│  [Zoom: 100% ▼] [Fullscreen] [AI Summary] [Share]         │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │              ReportCanvas                       │
│          │                                                  │
│ ┌──────┐ │  ┌──────────────────────────────────────────┐   │
│ │ TOC  │ │  │           ReportHeader                   │   │
│ ├──────┤ │  │  Name | Owner | Category | Date | Status │   │
│ │Book- │ │  ├──────────────────────────────────────────┤   │
│ │marks │ │  │                                          │   │
│ ├──────┤ │  │           Report Content                 │   │
│ │Com-  │ │  │                                          │   │
│ │ments │ │  │  (Rendered via HtmlReport /              │   │
│ ├──────┤ │  │   ReportRenderer from Prompt 016)        │   │
│ │Meta- │ │  │                                          │   │
│ │data  │ │  │                                          │   │
│ └──────┘ │  ├──────────────────────────────────────────┤   │
│          │  │           ReportFooter                   │   │
│          │  │  Page X of Y | Generated by MAP Nexus    │   │
│          │  └──────────────────────────────────────────┘   │
├──────────┴──────────────────────────────────────────────────┤
│                    ReportNavigation                         │
│  [< Previous Section]  [Next Section >]  [Page 1 of 10]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Context State Shape

```typescript
interface ReportViewerState {
  // Report
  reportConfig: HtmlReportConfig | null;
  reportData: Record<string, unknown>;
  
  // View
  zoom: number; // 50-200
  zoomPreset: 'fit-width' | 'fit-page' | '100' | '125' | '150' | '200';
  isFullscreen: boolean;
  viewMode: 'normal' | 'presentation' | 'reading';
  
  // Navigation
  activeSection: string | null;
  currentPages: { current: number; total: number };
  
  // Sidebar
  sidebarOpen: boolean;
  activeSidebarPanel: 'toc' | 'bookmarks' | 'comments' | 'metadata';
  
  // Search
  searchQuery: string;
  searchResults: { count: number; currentMatch: number };
  highlightMatches: boolean;
  
  // Bookmarks
  bookmarks: { id: string; sectionId: string; label: string; timestamp: string }[];
  
  // Comments
  comments: { id: string; sectionId: string; text: string; author: string; timestamp: string }[];
  
  // Annotations
  annotations: { id: string; type: 'highlight' | 'marker' | 'flag'; sectionId: string; text: string }[];
}
```

---

## 7. Widget Integration

| Viewer Component | Widget Used |
|-----------------|-------------|
| ReportToolbar buttons | Custom `ViewerToolbarButton` component |
| Search results | StatusWidget for match count |
| AI Summary button | AISummaryWidget |
| Comments/Notifications | NotificationWidget |
| Report metadata | GridWidget for property display |
| Activity/Timeline | TimelineWidget |

---

## 8. Theme Integration

The viewer uses the existing Theme System:

| Element | Theme Tokens |
|---------|-------------|
| Toolbar | `bg-neutral-5`, `border-neutral-20`, `shadow-sm` |
| Sidebar | `bg-neutral-5`, `border-neutral-20` |
| Canvas | `bg-white` |
| Buttons | `buttonStyles` from `theme/components/buttons` |
| Icons | `theme.icons.action.*`, `theme.icons.view.*` |
| Typography | `theme.typography.body.md`, `theme.typography.heading.h2` |
| Spacing | `theme.spacing.*`, `theme.layout.*` |
| Z-index | `zIndexByComponent.sidebar`, `zIndexByComponent.dropdown` |

---

## 9. Responsive Behaviour

| Breakpoint | Layout |
|-----------|--------|
| Desktop (≥1024px) | Full layout: sidebar + canvas + toolbar |
| Tablet (640-1023px) | Collapsible sidebar, full-width canvas |
| Mobile (<640px) | Hidden sidebar, stacked toolbar, scrollable canvas |

---

## 10. Accessibility

| Requirement | Implementation |
|------------|---------------|
| WCAG AA | Colour contrast via theme tokens |
| Keyboard Navigation | Tab through toolbar, sidebar, canvas; arrow keys for sections |
| Screen Readers | ARIA labels on all controls, landmarks for toolbar/sidebar/main |
| ARIA Labels | `aria-label` on buttons, `aria-current` for active section |
| High Contrast | Theme supports high contrast mode via Tailwind classes |

---

## 11. Testing Strategy

### 11.1 Unit Tests

| Test | What to Verify |
|------|---------------|
| `ReportViewerContext.test.tsx` | Context provider renders, state updates correctly |
| `ReportZoom.test.tsx` | Zoom level changes, preset selection works |
| `ReportSearch.test.tsx` | Search input, match count, prev/next navigation |

### 11.2 Component Tests

| Test | What to Verify |
|------|---------------|
| `ReportToolbar.test.tsx` | All buttons render, click handlers fire |
| `ReportSidebar.test.tsx` | Panel switching, collapse/expand |
| `ReportCanvas.test.tsx` | Report content renders, scroll works |
| `ReportNavigation.test.tsx` | Previous/next section, page indicator |
| `ReportBookmarks.test.tsx` | Add/remove bookmarks |
| `ReportComments.test.tsx` | Add/remove comments |

### 11.3 Integration Tests

| Test | What to Verify |
|------|---------------|
| `ReportViewer.test.tsx` | Full viewer renders with toolbar, sidebar, canvas |
| `ReportViewer.test.tsx` | Viewer integrates with HtmlReport from Prompt 016 |
| `ReportViewer.test.tsx` | Zoom controls affect canvas rendering |
| `ReportViewer.test.tsx` | Search highlights content in canvas |

### 11.4 Visual Tests

| Test | What to Verify |
|------|---------------|
| Desktop layout | Sidebar visible, toolbar full, canvas centered |
| Tablet layout | Sidebar collapses, toolbar adapts |
| Print preview | Print-optimised layout without viewer chrome |
| Fullscreen mode | Viewer fills viewport, toolbar auto-hides |

### 11.5 Test Commands

```bash
cd MAP_V2\03_Source\frontend
npm run test -- --coverage --watchAll=false
npm run lint
npm run typecheck
```

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Zoom may conflict with browser zoom | Use CSS `transform: scale()` on canvas content only |
| Fullscreen API browser support | Fallback to CSS `position: fixed` with `z-index` |
| Print preview may include viewer chrome | Use `@media print` to hide toolbar/sidebar |
| Search highlighting in rendered HTML | Use `TreeWalker` API to find text nodes |
| Context state complexity | Keep state minimal, derive computed values |

---

## 13. Acceptance Criteria Checklist

| Criterion | Status |
|-----------|--------|
| Report Viewer operational | ⬜ Pending |
| Report Canvas created | ⬜ Pending |
| Report Navigation created | ⬜ Pending |
| Toolbar created | ⬜ Pending |
| Sidebar created | ⬜ Pending |
| HTML Reporting Framework integrated | ⬜ Pending |
| Widget Framework integrated | ⬜ Pending |
| Responsive layouts implemented | ⬜ Pending |
| Accessibility implemented | ⬜ Pending |
| Ready for Prompt 019 | ⬜ Pending |

---

## 14. Next Prompt

**Prompt 019 — Create PDF Reporting Framework**

Transforms the HTML reporting architecture into enterprise-quality PDF documents suitable for regulatory submissions, audit evidence, executive reporting and customer deliverables.

---

**Recommendation:** Proceed with implementation. The HTML Reporting Framework (016) and Report Centre (017) provide the foundation. The Report Viewer builds on top of these to create a complete viewing experience.
