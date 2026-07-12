# Prompt 014: Create Security Portal — Analysis

**Prompt:** `engineering/MAP_V2/01_Prompts/Workstream_02_Portal_Framework/014_Create_Security_Portal.md`  
**Status:** Pending Approval  
**Date:** 2026-07-09

---

## 1. What the Prompt Asks For

Create a **Security Portal** — a centralized interface for monitoring, configuring and managing all platform security capabilities.

**Scope:** Presentation framework only. No backend, authentication, encryption, APIs, or database.

### Pages Required (16)

| # | Page | Purpose |
|---|------|---------|
| 1 | SecurityOverview | Executive dashboard: Security Health Score, Active Sessions, Failed Logins, MFA Adoption, Credential/Certificate/Encryption/Compliance Status, Threat Summary |
| 2 | CredentialManagement | Credential Repository, Health, Rotation, Secret References, Expiration Monitoring |
| 3 | EncryptionManagement | Encryption Status, Algorithms, Data Protection, Key Rotation, Policies |
| 4 | KeyManagement | Key Inventory, Rotation, Expiration, Azure Key Vault Integration, HSM Integration |
| 5 | CertificateManagement | Certificates, Expiry, Trusted Certificates, TLS Configuration, Rotation |
| 6 | IdentityProviders | Microsoft Entra ID, Azure AD, OAuth Providers, OpenID Connect, Local Auth |
| 7 | AuthenticationPolicies | Password Policies, Session Policies, Login Policies, Access Policies, Lockout Policies |
| 8 | MultiFactorAuthentication | Authenticator Apps, SMS Verification, Email Verification, Hardware Tokens, MFA Compliance |
| 9 | SessionManagement | Active Sessions, Timeout, Concurrent Sessions, History, Forced Logout |
| 10 | ApiSecurity | API Keys, OAuth Clients, Service Accounts, Rate Limits, API Audit |
| 11 | AuditLogs | Login History, Administrative Changes, Credential Activity, Configuration Changes, User Activity |
| 12 | SecurityEvents | Critical Alerts, Failed Logins, Suspicious Activity, Security Incidents, Event Timeline |
| 13 | ThreatMonitoring | Security Monitoring, Threat Intelligence, Risk Alerts, Security Dashboard, Incident Overview |
| 14 | ComplianceStatus | GDPR, ISO 27001, SOC 2, Internal Policies, Compliance Score |
| 15 | SecurityDashboard | Threat Feed, Active Alerts, Security KPIs, AI Recommendations, Compliance Status, Security Timeline |

### Navigation (15 items)
Security Overview, Credentials, Encryption, Keys, Certificates, Identity Providers, Authentication, MFA, Sessions, API Security, Audit Logs, Security Events, Threat Monitoring, Compliance, Security Dashboard

### Widgets to Use
KPI Widget, Status Widget, Timeline Widget, Grid Widget, Notification Widget, AI Summary Widget, Metric Widget

### AI Placeholder Widgets (5)
AI Threat Summary, Security Recommendations, Risk Analysis, Compliance Insights, Predictive Threat Detection

---

## 2. What Already Exists

| Item | Location | Status |
|------|----------|--------|
| `securityPortal` definition | `src/portal/metadata/PortalMetadata.ts:243-269` | ⚠️ Minimal — 3 nav items, 3 widgets |
| Existing route | `PortalRoutes.tsx` | ❌ No `/security` routes currently |
| Widget Framework | `src/components/widgets/` | ✅ Complete |

### Registered Widget Types (from WidgetRegistry)
| Type | Component |
|------|-----------|
| `kpi` | KPIWidget |
| `status` | StatusWidget |
| `metric` | MetricWidget |
| `grid` | GridWidget |
| `notification` | NotificationWidget |
| `timeline` | TimelineWidget |
| `ai-summary` | AISummaryWidget |
| `ai-insight` | AIInsightWidget |
| `ai-recommendation` | AIRecommendationWidget |
| `task` | TaskWidget |

---

## 3. Implementation Plan

### 3.1 Create Files (19 new files)

```
src/portal/types/SecurityMetrics.ts              — Types
src/portal/hooks/useSecurityDashboard.ts         — Hook
src/portal/security/SecurityPortal.tsx           — Portal with route-based rendering
src/portal/security/SecurityOverview.tsx         — 9 KPI widgets
src/portal/security/CredentialManagement.tsx     — 5 status widgets
src/portal/security/EncryptionManagement.tsx     — 5 status widgets
src/portal/security/KeyManagement.tsx            — 5 status widgets
src/portal/security/CertificateManagement.tsx    — 5 status widgets
src/portal/security/IdentityProviders.tsx        — 5 status widgets
src/portal/security/AuthenticationPolicies.tsx   — 5 status widgets
src/portal/security/MultiFactorAuthentication.tsx — 5 status widgets
src/portal/security/SessionManagement.tsx        — 5 status widgets
src/portal/security/ApiSecurity.tsx              — 5 status widgets
src/portal/security/AuditLogs.tsx                — 5 status widgets
src/portal/security/SecurityEvents.tsx           — 5 status widgets
src/portal/security/ThreatMonitoring.tsx         — 5 status widgets
src/portal/security/ComplianceStatus.tsx         — 5 status widgets
src/portal/security/SecurityDashboard.tsx        — 6 widgets (KPI, status, timeline, ai-summary)
src/portal/security/SecurityNavigation.tsx       — 15-item navigation
```

### 3.2 Modify Files (3 existing files)

| File | Change |
|------|--------|
| `src/portal/metadata/PortalMetadata.ts` | Update `securityPortal`: 15 nav items, 20+ widgets |
| `src/portal/routing/PortalRoutes.tsx` | Import `SecurityPortal`, add 16 routes (`/security`, `/security/overview`, ..., `/security/dashboard`) |
| `src/navigation/navigation.config.ts` | Update `securityItem` with 15 sub-items |

### 3.3 Widget Usage by Page

| Page | Widgets Used |
|------|--------------|
| SecurityOverview | KPI (9) |
| CredentialManagement | Status (5) |
| EncryptionManagement | Status (5) |
| KeyManagement | Status (5) |
| CertificateManagement | Status (5) |
| IdentityProviders | Status (5) |
| AuthenticationPolicies | Status (5) |
| MultiFactorAuthentication | Status (5) |
| SessionManagement | Status (5) |
| ApiSecurity | Status (5) |
| AuditLogs | Status (5) |
| SecurityEvents | Status (5) |
| ThreatMonitoring | Status (5) |
| ComplianceStatus | Status (5) |
| SecurityDashboard | KPI (3) + Status (2) + Timeline (1) + AI Summary (1) = 7 |

**Total widgets:** ~87

---

## 4. Testing Plan

### 4.1 Build Verification
```bash
cd MAP_V2\03_Source\frontend
npm run build
```
Expected: Build passes with no TypeScript errors.

### 4.2 Manual Testing
```bash
npm run dev
```
Open `http://localhost:5173/security`

| Test | Expected Result |
|------|-----------------|
| Navigate to `/security` | Security Portal loads with Overview page |
| Click "Overview" in sidebar | 9 KPI cards displayed |
| Click "Credentials" | 5 status cards displayed |
| Click "Encryption" | 5 status cards displayed |
| Click "Keys" | 5 status cards displayed |
| Click "Certificates" | 5 status cards displayed |
| Click "Identity Providers" | 5 status cards displayed |
| Click "Authentication" | 5 status cards displayed |
| Click "MFA" | 5 status cards displayed |
| Click "Sessions" | 5 status cards displayed |
| Click "API Security" | 5 status cards displayed |
| Click "Audit Logs" | 5 status cards displayed |
| Click "Security Events" | 5 status cards displayed |
| Click "Threat Monitoring" | 5 status cards displayed |
| Click "Compliance" | 5 status cards displayed |
| Click "Security Dashboard" | 7 widgets displayed |
| Check sidebar navigation | 15 items visible under "Security" |
| Check header/footer | No duplication (MainLayout provides) |
| Resize to tablet | Grid adapts to 2 columns |
| Resize to mobile | Grid adapts to 1 column |
| Keyboard navigation | All links focusable, Enter activates |

### 4.3 Regression Testing
- Executive Portal still works (`/dashboard/executive`)
- Operations Portal still works (`/operations`)
- Migration Portal still works (`/migration`)
- Governance Portal still works (`/governance`)
- Reporting Portal still works (`/reports`)
- Navigation sidebar shows all portals correctly

---

## 5. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Route conflicts with existing `/security` route | No existing routes — safe to add |
| Widget type mismatches | Use only proven widget types: `kpi`, `status`, `metric`, `grid`, `notification`, `timeline`, `ai-summary` |
| Navigation.config.ts missing icon imports | Verify `Shield`, `Key`, `Lock`, `FileCheck`, etc. are imported |

---

## 6. Acceptance Criteria Checklist

| Criterion | How to Verify |
|-----------|---------------|
| Security Portal operational | Navigate to `/security`, page loads |
| Security navigation complete | 15 items visible in sidebar |
| Security Dashboard created | `/security/dashboard` shows 7 widgets |
| Widget Framework fully utilised | 87 widgets using WidgetRenderer |
| Placeholder pages created | 15 pages all rendering widgets |
| Security modules established | 15 modules (Credentials, Encryption, Keys, etc.) |
| Responsive behaviour implemented | Test at 1440px, 768px, 375px widths |
| Accessibility implemented | Tab through all links, check ARIA labels |
| Ready for Prompt 015 | Build passes, all pages functional |

---

## 7. Deliverable

Save report to: `MAP_V2/02_Output/014_Create_Security_Portal_Report.md`

---

## 8. Recommendation

**Approve implementation.** This prompt follows the exact same pattern as Prompts 009-013:
- Portal component with route-based rendering
- 15 pages using Widget Framework
- Navigation component
- PortalMetadata update
- PortalRoutes update
- navigation.config.ts update

No new architectural decisions required. Purely additive.
