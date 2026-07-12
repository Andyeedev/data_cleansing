# 03_Website_Transformation — Site Analysis

**Document:** Site Analysis
**Date:** 30 June 2026
**Status:** Complete

---

# 1. Overview

**Location:** `02_output/03_Website_Transformation/`
**Source:** `01_source/website/existing/saas-landing-page.html` (1,228 lines, EduFlow education platform)
**Transformation:** EduFlow School & Training Management Platform → MAP (Migration Assurance Platform) enterprise SaaS website

---

# 2. Source Website

| Metric | Value |
|--------|-------|
| Original product | EduFlow School & Training Management |
| Original structure | Single-page application |
| Original lines | 1,228 |
| CSS framework | Tailwind CSS via CDN |
| Font | Inter |
| Colour scheme | Indigo-purple (#667eea → #764ba2) |

---

# 3. Output Files

## 3.1 HTML Pages (8 + 1 utility)

| # | File | Lines | Purpose |
|---|------|-------|---------|
| 1 | index.html | 915 | Home — hero, dashboard mockup, trust stats, 6 modules, 6 pillars, industries, FAQ, CTA |
| 2 | platform.html | 556 | Platform — architecture diagram, 20-row capability matrix, 4 engines, evidence repo, dashboards |
| 3 | solutions.html | 646 | Solutions — 6 solution areas, integration ecosystem, demo modal |
| 4 | industries.html | 464 | Industries — 6 verticals (Banking, Insurance, Asset Mgmt, Healthcare, Gov, Tech) |
| 5 | security.html | 641 | Security — Entra ID, RBAC matrix, Zero Trust, encryption, Azure security, compliance |
| 6 | roadmap.html | 489 | Roadmap — 4 releases (R1-R4), 8 features each, timeline UI |
| 7 | about.html | 400 | About — founder profile, mission, vision, Why MAP Exists, values |
| 8 | contact.html | 397 | Contact — form with enquiry types, FAQ accordion, JSON-LD |
| 9 | color-preview.html | 242 | Colour scheme preview (16 options) — design utility |
| | **Total HTML** | **~4,750** | |

## 3.2 CSS/JS (Shared)

| File | Lines | Purpose |
|------|-------|---------|
| css/map-styles.css | 3,686 | Comprehensive CSS — utilities, animations, responsive, modals, components |
| js/map-scripts.js | 1,078 | Modals, FAQ accordion, scroll animations, mobile menu, form handlers, toasts |

## 3.3 Supporting Documents

| File | Lines | Purpose |
|------|-------|---------|
| SEO-Metadata.md | 788 | Title tags, meta descriptions, OG tags, JSON-LD for all pages |
| Deployment-Instructions.md | 495 | Azure Static Web Apps + GitHub Actions CI/CD guide |
| Migration-Report.md | 455 | Full transformation record from EduFlow to MAP |

## 3.4 Analysis Documents

| File | Lines | Purpose |
|------|-------|---------|
| analysis/Site-Comparison-Analysis.md | 308 | Comparative analysis vs 03_Website_Transformation_Simplified |
| analysis/Site-Analysis.md | This file | Current site analysis |

---

# 4. Page Summaries

## index.html — Home (915 lines)
- Navigation: fixed top nav, 7 links + "Contact Us" modal button, mobile hamburger menu
- Hero: gradient background, 2-col (text + dashboard mockup with bar chart)
- Trust stats: 10,000+ Migrations, 99.9% Uptime, 500+ Clients, 24/7 Support
- Pain points: Data Loss, Downtime, Compliance (3 cards)
- How it works: 5-step timeline
- ROI Calculator: interactive sliders
- Integration grid: platform logos
- Testimonials: 3 cards
- 6 Platform Modules: Discovery, Mapping, Validation, Governance, Reporting, AI
- 6 Pillars: Compliance, Risk, Assurance, Quality, Governance, Intelligence
- Industries section: 6 verticals
- FAQ accordion
- CTA gradient banner
- Footer: 4-column dark footer with social icons
- **Features:** Demo modal, scroll-fade animations, countUp, back-to-top, cookie consent

## platform.html — Platform (556 lines)
- Breadcrumb navigation
- Hero: gradient, "The MAP Platform"
- Architecture diagram: 3-step flow (Discovery → Mapping → Validation)
- 4 Feature cards: Intelligent Discovery, Risk Prediction, Cost Optimization, Compliance
- AI Readiness Timeline: 4 milestones
- **Features:** Interactive capability matrix, vertical architecture diagram

## solutions.html — Solutions (646 lines)
- Hero: gradient, "Migration Solutions"
- 6 Solution areas: Migration Assurance, Governance, Validation, Executive Reporting, Delivery Assurance, Programme Intelligence
- Integration Ecosystem: AWS, Azure, GCP, Snowflake
- Demo Request modal + Free Trial modal
- **Features:** Section IDs for anchor linking, modal forms

## industries.html — Industries (464 lines)
- Hero: gradient, "Industry Solutions"
- 6 Industry verticals: Financial Services, Healthcare, Retail, Manufacturing, Government, Media
- Each with icon, description, features list, CTA
- Demo modal
- **Features:** Alternating white/gray section backgrounds

## security.html — Security (641 lines)
- Breadcrumb navigation
- Hero: gradient, "Enterprise-Grade Security"
- Security Architecture: 4 principles
- Microsoft Entra ID: 5 cards
- RBAC permissions table (Role × Permission matrix)
- Zero Trust Architecture
- Encryption standards
- Azure Security features
- Compliance frameworks: SOC 2, ISO 27001, HIPAA, FedRAMP
- **Features:** RBAC matrix, comprehensive security content

## roadmap.html — Roadmap (489 lines)
- Breadcrumb navigation
- Hero: gradient, "Product Roadmap"
- 4 Releases: MVP (R1), R2, R3, R4 Enterprise Scale
- Each release with 8 feature cards
- Timeline UI with vertical line + dot indicators
- **Features:** Color-coded quarters, release status badges

## about.html — About (400 lines)
- Breadcrumb navigation
- Hero: gradient, "About MAP"
- Mission statement
- Vision with quote block
- Why MAP Exists: 3 stat cards (70%, 60%, 45%)
- Human Cost comparison: Without MAP vs With MAP
- Founder profile: 15+ years, £50B+ value
- 4 Values: Trust, Assurance, Intelligence, Compliance
- **Features:** Founder profile with gradient avatar

## contact.html — Contact (397 lines)
- Breadcrumb navigation
- Hero: gradient, "Get in Touch"
- Contact form: name, email, company, enquiry type, message
- FAQ accordion
- JSON-LD structured data (ContactPage schema)
- **Features:** HTML5 form validation, enquiry type dropdown

## color-preview.html — Colour Preview (242 lines)
- 16 gradient colour scheme options in 4 families
- Purple, Blue, Teal/Green, Warm/Bold
- **Features:** Not a public-facing page — design utility

---

# 5. Navigation Structure

| Element | Desktop | Mobile |
|---------|---------|--------|
| Links | Home, Platform, Solutions, Industries, Security, Roadmap, About | Same |
| CTA | "Contact Us" → demo modal button | Same |
| Active state | `border-b-2 border-primary pb-1` underline + color | Same |
| Mobile menu | Hamburger toggle (`mobileMenuBtn`) | Slide-down menu |

---

# 6. Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| CSS framework | Tailwind CDN + local map-styles.css | Same as original EduFlow site |
| Colour scheme | Indigo-purple (#667eea → #764ba2) | User preferred original over Azure blue |
| Structure | Multi-page (8 pages) | Enterprise SaaS standard |
| Animations | Scroll-fade, countUp | Matches original patterns |
| Modals | Demo Request | Original pattern reused |
| FAQ | Accordion with JS | Original pattern reused |
| Dashboard mockup | CSS-only bar chart | Hero visual placeholder |
| Contact CTA | Modal button (not nav link) | Reduces nav clutter, captures leads |
| Active nav | Consistent underline | Visual clarity for current page |

---

# 7. Tailwind Config Patterns

| Page | Config Key Pattern |
|------|-------------------|
| index.html | `primary: '#667eea', secondary: '#764ba2'` |
| platform.html | `primary: '#667eea', secondary: '#764ba2'` |
| solutions.html | `brand-start: '#667eea', brand-end: '#764ba2'` |
| industries.html | `primary: '#667eea', secondary: '#764ba2'` |
| security.html | `primary: '#667eea', secondary: '#764ba2'` |
| roadmap.html | `map-blue: '#667eea', map-purple: '#764ba2'` |
| about.html | `map-primary: '#667eea', map-secondary: '#764ba2'` |
| contact.html | `primary: '#667eea', secondary: '#764ba2'` |

**Note:** Gradient values are consistent (#667eea → #764ba2) but config key names vary across pages.

---

# 8. Issues Identified

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Tailwind config key inconsistency across pages | Medium | ⚠️ Cosmetic — gradient values consistent |
| 2 | map-scripts.js contains EduFlow template code (ROI calculator, student references) | Low | ⚠️ Unused code — no functional impact |
| 3 | Placeholder content (founder name, stats) | Low | ⚠️ Needs manual completion |
| 4 | JSON-LD only in contact.html | Low | Other pages rely on SEO doc |
| 5 | Duplicate modal systems (inline vs map-scripts.js) | Low | ⚠️ Inline overrides shared JS |

---

# 9. Key Metrics

| Metric | Value |
|--------|-------|
| HTML pages | 8 + 1 utility |
| Total HTML lines | ~4,750 |
| CSS lines | 3,686 |
| JS lines | 1,078 |
| Industry verticals | 6 |
| Solution areas | 6 |
| Security features documented | 8 |
| Roadmap releases | 4 (8 features each) |
| Supporting documents | 3 |
| Analysis documents | 2 |
| Colour scheme options | 16 |

---

*End of Site Analysis*
