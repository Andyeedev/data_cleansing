# Report Viewer

Enterprise Report Viewer for MAP Nexus™.

## Architecture

```
ReportViewer
├── ReportToolbar (top)
│   ├── Open, Refresh, Print, Export, Download
│   ├── SearchBar (search, highlight, match count)
│   ├── ZoomControl (fit width/page, presets)
│   └── Fullscreen, Share, AI Summary
├── ReportSidebar (left)
│   ├── ReportOutline (TOC)
│   ├── ReportBookmarks
│   ├── ReportComments
│   ├── ReportMetadata
│   ├── ReportProperties
│   ├── ReportSearch
│   ├── ReportZoom
│   ├── ReportFullscreen
│   └── ReportPrintPreview
├── ReportCanvas (centre)
│   ├── ReportHeader
│   ├── Report Content (via HtmlReport)
│   └── ReportFooter + PageIndicator
└── ReportNavigation (bottom)
    └── Previous/Next Section, Page Jump
```

## Folder Structure

```
src/reporting/viewer/
├── ReportViewer.tsx              # Top-level component
├── ReportViewerContext.tsx       # React context for viewer state
├── ReportCanvas.tsx             # Viewing surface
├── ReportToolbar.tsx            # Top toolbar
├── ReportSidebar.tsx            # Sidebar container
├── ReportNavigation.tsx         # Section navigation
├── ReportOutline.tsx            # Table of contents
├── ReportBookmarks.tsx          # Bookmarks panel
├── ReportComments.tsx           # Comments panel
├── ReportMetadata.tsx           # Metadata panel
├── ReportProperties.tsx         # Properties panel
├── ReportSearch.tsx             # Search panel
├── ReportZoom.tsx               # Zoom panel
├── ReportFullscreen.tsx         # View mode panel
├── ReportPrintPreview.tsx       # Print preview panel
├── ReportHeader.tsx             # Report header
├── ReportFooter.tsx             # Report footer
├── components/widgets/          # Reusable UI components
│   ├── ViewerToolbarButton.tsx
│   ├── ViewerSidebarPanel.tsx
│   ├── ViewerZoomControl.tsx
│   ├── ViewerSearchBar.tsx
│   └── ViewerPageIndicator.tsx
└── README.md
```

## Usage

### Basic Usage

```tsx
import { ReportViewer } from './reporting/viewer/ReportViewer';
import { ReportRegistry } from './reporting/html/framework/ReportRegistry';

// Import templates to register them
import './reporting/html/templates/ExecutiveTemplate';

const config = ReportFactory.create('executive-report', {
  name: 'Q4 2026 Executive Report',
  author: 'John Smith',
});

<ReportViewer config={config} sectionData={sectionData} />
```

### Standalone Viewer

```tsx
import { ReportViewer, ReportViewerProvider, useReportViewer } from './reporting/viewer/ReportViewer';

const MyViewer = () => {
  const { zoom, bookmarks, comments } = useReportViewer();
  return <div>Zoom: {zoom}%, Bookmarks: {bookmarks.length}</div>;
};

<ReportViewerProvider>
  <ReportViewer config={config} />
  <MyViewer />
</ReportViewerProvider>
```

## Context State

| Property | Type | Description |
|----------|------|-------------|
| zoom | number | Current zoom level (50-200) |
| zoomPreset | string | Active zoom preset |
| isFullscreen | boolean | Fullscreen mode |
| viewMode | string | normal / presentation / reading |
| activeSection | string | Currently active section |
| sidebarOpen | boolean | Sidebar visibility |
| activeSidebarPanel | string | Current sidebar panel |
| searchQuery | string | Current search query |
| bookmarks | array | Saved bookmarks |
| comments | array | Report comments |
| annotations | array | Text annotations |

## Integration

### HTML Reporting Framework (Prompt 016)

The viewer wraps `HtmlReport` to render report content:
```tsx
<ReportCanvas>
  <HtmlReport config={config} metadata={metadata} sectionData={sectionData} />
</ReportCanvas>
```

### Report Centre (Prompt 017)

Link to viewer from Report Centre:
```tsx
<a href={`/report-centre/viewer?report=${report.id}`}>View Report</a>
```

## Responsive Behaviour

| Breakpoint | Layout |
|-----------|--------|
| Desktop (≥1024px) | Full layout: sidebar + canvas + toolbar |
| Tablet (640-1023px) | Collapsible sidebar, full-width canvas |
| Mobile (<640px) | Hidden sidebar, stacked toolbar |
