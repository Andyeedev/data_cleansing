# Prompt 003 Analysis: Create Enterprise Navigation System

**Analysis Date:** 2026-07-08  
**Status:** Ready for Implementation  
**Location:** `MAP_V2\02_Output\003_Create_Navigation_Analysis.md`

---

## 1. Executive Summary

Prompt 003 creates a comprehensive enterprise navigation framework for MAP Nexus™. It replaces the existing basic navigation components with a professional, scalable system supporting future RBAC, responsive design, and enterprise patterns.

---

## 2. Current State vs Required State

### What Exists (Prompt 001)

| Component | Location | Status |
|-----------|----------|--------|
| Sidebar.tsx | `components/layout/` | Basic implementation |
| Header.tsx | `components/layout/` | Basic implementation |
| Footer.tsx | `components/layout/` | Basic implementation |
| Breadcrumb.tsx | `components/layout/` | Basic implementation |
| navigation.ts | `config/` | Simple config |

### What Prompt 003 Requires

| Component | Location | Purpose |
|-----------|----------|---------|
| NavigationProvider.tsx | `navigation/` | Context provider for nav state |
| Sidebar.tsx | `navigation/` | Collapsible sidebar with modes |
| TopNavigation.tsx | `navigation/` | Top bar with search, notifications |
| Footer.tsx | `navigation/` | Footer with version, copyright |
| Breadcrumb.tsx | `navigation/` | Auto-generated breadcrumbs |
| NavigationItem.tsx | `navigation/` | Individual menu item |
| NavigationGroup.tsx | `navigation/` | Grouped menu items |
| MobileNavigation.tsx | `navigation/` | Mobile drawer navigation |
| NavigationContext.tsx | `navigation/` | Navigation state context |
| navigation.config.ts | `navigation/` | Centralised config |
| navigation.types.ts | `navigation/` | TypeScript definitions |

---

## 3. Key Differences

| Feature | Current | Required |
|---------|---------|----------|
| Location | `components/layout/` | `navigation/` |
| Sidebar modes | Open/close only | Expanded/collapsed |
| Configuration | Basic array | Centralised with permissions |
| Types | Inline interfaces | Dedicated types file |
| Context | None | NavigationContext |
| Mobile | Basic responsive | Drawer navigation |
| Breadcrumb | Manual | Auto-generated from routes |
| RBAC | Not supported | Architecture ready |
| Notifications | Basic bell icon | Panel placeholder |
| Search | Basic input | Command palette placeholder |

---

## 4. Implementation Plan

### Phase 1: Create Navigation Directory & Types
- Create `src/navigation/` directory
- Create `navigation.types.ts` with all type definitions
- Create `navigation.config.ts` with centralised configuration

### Phase 2: Create Navigation Context
- Create `NavigationContext.tsx` with state management
- Create `NavigationProvider.tsx` with context provider

### Phase 3: Create Navigation Components
- Create `NavigationItem.tsx` - individual menu item
- Create `NavigationGroup.tsx` - grouped items with expand/collapse
- Create `Sidebar.tsx` - collapsible sidebar with modes
- Create `TopNavigation.tsx` - top bar with placeholders
- Create `Footer.tsx` - footer with version info
- Create `Breadcrumb.tsx` - auto-generated breadcrumbs
- Create `MobileNavigation.tsx` - mobile drawer

### Phase 4: Update Existing Files
- Update `MainLayout.tsx` to use new navigation
- Update `App.tsx` to wrap with NavigationProvider
- Update `index.css` with navigation styles

### Phase 5: Verify & Report
- Run build verification
- Generate implementation report

---

## 5. Navigation Configuration Structure

```typescript
// navigation.config.ts
interface NavigationConfig {
  items: NavigationItem[];
  settings: {
    sidebarCollapsedWidth: string;
    sidebarExpandedWidth: string;
    headerHeight: string;
    footerHeight: string;
  };
}

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  permission?: string;
  visible?: boolean;
  badge?: NavigationBadge;
  description?: string;
  children?: NavigationItem[];
}
```

---

## 6. Icon Mapping

| Area | Icon (Lucide React) |
|------|---------------------|
| Home | Home |
| Executive Dashboard | LayoutDashboard |
| Migration | Database |
| Validation | BadgeCheck |
| Governance | ShieldCheck |
| Risk | TriangleAlert |
| Reporting | BarChart3 |
| AI Assistant | Bot |
| Administration | Settings2 |
| Settings | Cog |
| Help | CircleHelp |

---

## 7. Responsive Behaviour

| Breakpoint | Sidebar | Top Nav | Mobile |
|------------|---------|---------|--------|
| Desktop (≥1024px) | Permanent, expandable | Full | N/A |
| Tablet (768-1023px) | Collapsible | Full | N/A |
| Mobile (<768px) | Hidden, drawer | Compact | Drawer |

---

## 8. Future RBAC Support

| Role | Visibility |
|------|------------|
| Executive | All areas |
| Project Manager | All areas |
| Migration Lead | Migration, Validation, Reports |
| Data Steward | Migration, Validation, Governance |
| Business User | Reports, Dashboard |
| DBA | Migration, Administration |
| Auditor | Governance, Risk, Audit |
| Administrator | All areas |

Initially all roles have identical visibility.

---

## 9. Testing Instructions

### Test 1: Build Verification
```bash
cd MAP_V2\03_Source\frontend
npm run build
```
**Expected:** Build completes without errors

---

### Test 2: Start Dev Server
```bash
npm run dev
```
**Expected:** Server starts on `http://localhost:5173`

---

### Test 3: Sidebar Functionality

| Test | Action | Expected |
|------|--------|----------|
| Expand/Collapse | Click collapse button | Sidebar toggles width |
| Active state | Click menu item | Item highlights blue |
| Expandable items | Click Migration | Submenu expands |
| Hover effects | Hover menu item | Background changes |
| Mobile | Resize <768px | Sidebar becomes drawer |

---

### Test 4: Top Navigation

| Test | Action | Expected |
|------|--------|----------|
| Logo | Check header | MAP logo visible |
| Search | Check header | Search input visible |
| Notifications | Check header | Bell icon with badge |
| User menu | Check header | User avatar visible |
| Theme toggle | Check header | Placeholder visible |

---

### Test 5: Breadcrumb

| Test | Action | Expected |
|------|--------|----------|
| Home | Navigate to `/` | Breadcrumb shows "Home" |
| Section | Navigate to `/migration` | Shows "Home > Migration" |
| Page | Navigate to `/migration/jobs` | Shows "Home > Migration > Jobs" |
| Click | Click breadcrumb item | Navigates to that route |

---

### Test 6: Footer

| Test | Action | Expected |
|------|--------|----------|
| Copyright | Check footer | © 2026 MAP Nexus™ |
| Version | Check footer | Version 2.0.0 |
| Environment | Check footer | Environment placeholder |

---

### Test 7: Mobile Navigation

| Test | Action | Expected |
|------|--------|----------|
| Hamburger | Click hamburger icon | Drawer slides in |
| Overlay | Click outside drawer | Drawer closes |
| Menu items | Click menu item | Drawer closes, navigates |
| Close | Click X button | Drawer closes |

---

### Test 8: Keyboard Navigation

| Test | Action | Expected |
|------|--------|----------|
| Tab | Press Tab | Focus moves through items |
| Enter | Press Enter on item | Item activated |
| Escape | Press Escape | Drawer closes |
| Arrow keys | Arrow keys in menu | Focus moves between items |

---

### Test 9: Accessibility

| Test | Action | Expected |
|------|--------|----------|
| ARIA labels | Inspect elements | Labels present |
| Screen reader | Use screen reader | Content announced |
| Focus indicators | Tab through | Focus visible |
| High contrast | Check colours | Contrast AA compliant |

---

## 10. Files to Create

| File | Purpose |
|------|---------|
| `navigation/navigation.types.ts` | Type definitions |
| `navigation/navigation.config.ts` | Centralised config |
| `navigation/NavigationContext.tsx` | Navigation context |
| `navigation/NavigationProvider.tsx` | Context provider |
| `navigation/NavigationItem.tsx` | Menu item component |
| `navigation/NavigationGroup.tsx` | Grouped items |
| `navigation/Sidebar.tsx` | Collapsible sidebar |
| `navigation/TopNavigation.tsx` | Top navigation bar |
| `navigation/Footer.tsx` | Footer component |
| `navigation/Breadcrumb.tsx` | Auto-generated breadcrumb |
| `navigation/MobileNavigation.tsx` | Mobile drawer |
| `navigation/index.ts` | Barrel export |

---

## 11. Files to Update

| File | Change |
|------|--------|
| `components/layout/MainLayout.tsx` | Use new navigation |
| `App.tsx` | Wrap with NavigationProvider |
| `index.css` | Add navigation styles |

---

## 12. Acceptance Criteria Checklist

| Criteria | Status |
|----------|--------|
| ✓ Sidebar operational | Pending |
| ✓ Top navigation operational | Pending |
| ✓ Footer operational | Pending |
| ✓ Breadcrumb operational | Pending |
| ✓ Navigation configuration centralised | Pending |
| ✓ Placeholder routes working | Pending |
| ✓ Responsive behaviour implemented | Pending |
| ✓ Future RBAC supported | Pending |
| ✓ No authentication implemented | Pending |
| ✓ Ready for Prompt 004 | Pending |

---

## 13. Dependencies

| Dependency | Status |
|------------|--------|
| Theme System (Prompt 002) | ✓ Complete |
| React Router | ✓ Installed |
| Lucide React | ✓ Installed |
| TypeScript | ✓ Configured |

---

## 14. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking existing navigation | Keep old components, swap at layout level |
| Import path changes | Update all imports systematically |
| Type conflicts | Use dedicated navigation types |
| Mobile responsiveness | Test at each breakpoint |

---

## 15. Estimated Effort

| Phase | Time |
|-------|------|
| Types & Config | 15 min |
| Context & Provider | 20 min |
| Navigation Components | 45 min |
| Layout Updates | 20 min |
| Testing & Fixes | 30 min |
| Report Generation | 10 min |
| **Total** | **~2.5 hours** |

---

## 16. Ready for Implementation

All analysis complete. Awaiting go-ahead to proceed.

---

*Analysis saved to: `MAP_V2\02_Output\003_Create_Navigation_Analysis.md`*
