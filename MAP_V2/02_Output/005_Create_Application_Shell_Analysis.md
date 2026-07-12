# Prompt 005 Analysis: Create Enterprise Application Shell

**Analysis Date:** 2026-07-08  
**Status:** Ready for Implementation  
**Location:** `MAP_V2/02_Output/005_Create_Application_Shell_Analysis.md`

---

## 1. Executive Summary

Prompt 005 creates the **Enterprise Application Shell** — the persistent UI framework surrounding every page. It establishes a new `src/layout/` directory with 18 files: 4 layouts, 14 reusable shell components. No dashboards, reports, or business logic.

---

## 2. Current State vs Required State

### What Exists (Prompts 001-004)

| Component | Location | Status |
|-----------|----------|--------|
| MainLayout | `components/layout/MainLayout.tsx` | Basic version |
| Header | `components/layout/Header.tsx` | Basic version |
| Footer | `components/layout/Footer.tsx` | Basic version |
| Breadcrumb | `components/layout/Breadcrumb.tsx` | Basic version |
| Sidebar | `components/layout/Sidebar.tsx` + `navigation/Sidebar.tsx` | Two versions exist |
| ContentArea | `components/layout/ContentArea.tsx` | Basic version |
| LoadingSpinner | `components/common/LoadingSpinner.tsx` | Exists |
| ErrorPage | `components/common/ErrorPage.tsx` | Exists |

### What Prompt 005 Requires

| Component | Location | Status |
|-----------|----------|--------|
| `layout/` directory | `src/layout/` | **New** |
| ApplicationShell.tsx | `layout/` | **New** |
| MainLayout.tsx | `layout/` | **Move & enhance** |
| AuthLayout.tsx | `layout/` | **New** |
| BlankLayout.tsx | `layout/` | **New** |
| Header.tsx | `layout/` | **Move & enhance** |
| Sidebar.tsx | `layout/` | **Move & enhance** (reuse Prompt 003) |
| Footer.tsx | `layout/` | **Move & enhance** |
| Breadcrumb.tsx | `layout/` | **Move & enhance** |
| PageContainer.tsx | `layout/` | **New** |
| PageHeader.tsx | `layout/` | **New** |
| ContentArea.tsx | `layout/` | **Move & enhance** |
| StatusBar.tsx | `layout/` | **New** |
| EnvironmentBanner.tsx | `layout/` | **New** |
| QuickActions.tsx | `layout/` | **New** |
| NotificationPanel.tsx | `layout/` | **New** |
| GlobalSearch.tsx | `layout/` | **New** |
| UserProfileMenu.tsx | `layout/` | **New** |
| LoadingOverlay.tsx | `layout/` | **New** |
| ErrorBoundary.tsx | `layout/` | **New** |

---

## 3. Key Observations

**Overlapping Components:**
- `navigation/Sidebar.tsx` and `components/layout/Sidebar.tsx` both exist — Prompt 005 says "Reuse Prompt 003" for sidebar, so we consolidate into `layout/Sidebar.tsx`
- `components/layout/` files will be migrated to `layout/` (new top-level directory)

**Enhancement Required:**
- Existing Header/Footer/Breadcrumb are basic — Prompt 005 adds: Theme Toggle, Version, Environment Badge, User Profile Menu, Global Search, Notifications
- Existing MainLayout is minimal — needs ApplicationShell wrapper, StatusBar, EnvironmentBanner, QuickActions

---

## 4. Implementation Plan

### Phase 1: Create `src/layout/` directory
- Create the new `layout/` folder structure

### Phase 2: Create Layout Types (3 files)
- `MainLayout.tsx` — Authenticated pages (enhanced from existing)
- `AuthLayout.tsx` — Login/auth pages (new)
- `BlankLayout.tsx` — Splash/public pages (new)

### Phase 3: Create Shell Components (14 files)
- `ApplicationShell.tsx` — Master wrapper
- `Header.tsx` — Enhanced with search, notifications, profile, theme toggle
- `Sidebar.tsx` — Reuse Prompt 003 navigation
- `Footer.tsx` — Version, environment, copyright
- `Breadcrumb.tsx` — Auto-generated from route
- `PageContainer.tsx` — Responsive page wrapper
- `PageHeader.tsx` — Title, subtitle, actions
- `ContentArea.tsx` — Scrollable content container
- `StatusBar.tsx` — Connection/status bar
- `EnvironmentBanner.tsx` — Dev/Test/UAT/Prod indicator
- `QuickActions.tsx` — Placeholder action panel
- `NotificationPanel.tsx` — Placeholder notifications
- `GlobalSearch.tsx` — Placeholder search
- `UserProfileMenu.tsx` — Dropdown with settings/profile/logout
- `LoadingOverlay.tsx` — Full-screen loader
- `ErrorBoundary.tsx` — React Error Boundary

### Phase 4: Update App.tsx
- Import new layouts from `layout/`
- Wrap routes with appropriate layouts

### Phase 5: Verify & Report
- Run build verification
- Generate completion report

---

## 5. Application Shell Structure

```
--------------------------------------------------
Environment Banner
--------------------------------------------------
Header (Logo, Search, Notifications, Profile, Theme Toggle)
--------------------------------------------------
Sidebar | Breadcrumb
        | Page Header
        | Quick Actions
        | Content Area
        | Footer
--------------------------------------------------
```

---

## 6. Files Summary

| Category | Count | Files |
|----------|-------|-------|
| Layouts | 3 | MainLayout, AuthLayout, BlankLayout |
| Shell Components | 14 | ApplicationShell, Header, Sidebar, Footer, Breadcrumb, PageContainer, PageHeader, ContentArea, StatusBar, EnvironmentBanner, QuickActions, NotificationPanel, GlobalSearch, UserProfileMenu, LoadingOverlay, ErrorBoundary |
| **Total New** | **17** | |

---

## 7. Testing Instructions

| Test | Command/Action | Expected Result |
|------|----------------|-----------------|
| Build | `npm run build` | No errors |
| Type check | `npx tsc --noEmit` | No TypeScript errors |
| Dev server | `npm run dev` | Starts on `:5173` |
| Desktop layout | View any page | Sidebar + Header + Content + Footer |
| Mobile layout | Resize <768px | Drawer navigation, responsive header |
| Environment banner | Check top of page | Shows "Development" |
| Global search | Click search in header | Placeholder search panel |
| Notifications | Click bell icon | Placeholder notification panel |
| User profile | Click user avatar | Dropdown with Settings/Profile/Logout |
| Theme toggle | Click toggle in header | Toggles light/dark (placeholder) |
| Error boundary | Throw error in component | Shows error page with retry |
| Auth layout | Visit `/login` | No sidebar, centered form |
| Breadcrumb | Navigate to sub-page | Shows Home > Section > Page |

---

## 8. Acceptance Criteria

| Criteria | Status |
|----------|--------|
| ✓ Application Shell created | Pending |
| ✓ MainLayout operational | Pending |
| ✓ AuthLayout operational | Pending |
| ✓ BlankLayout operational | Pending |
| ✓ Header complete | Pending |
| ✓ Footer complete | Pending |
| ✓ Breadcrumb operational | Pending |
| ✓ Error Boundary created | Pending |
| ✓ Responsive behaviour implemented | Pending |
| ✓ Ready for Prompt 006 | Pending |

---

## 9. Estimated Effort

| Phase | Time |
|-------|------|
| Directory & Layout Types | 20 min |
| Shell Components (14 files) | 60 min |
| App.tsx Updates | 10 min |
| Testing & Fixes | 20 min |
| Report Generation | 10 min |
| **Total** | **~2 hours** |

---

*Analysis saved to: `MAP_V2/02_Output/005_Create_Application_Shell_Analysis.md`*
