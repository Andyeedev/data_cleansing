# SEO Metadata Reference — MAP Website

> Comprehensive SEO metadata for all 8 pages of the Migration Assurance Platform (MAP) website.
> Last updated: 2026-06-30

---

## Table of Contents

1. [Site-Wide SEO Settings](#1-site-wide-seo-settings)
2. [Page Metadata](#2-page-metadata)
   - 2.1 [Index / Home](#21-index--home)
   - 2.2 [Platform](#22-platform)
   - 2.3 [Solutions](#23-solutions)
   - 2.4 [Industries](#24-industries)
   - 2.5 [Security](#25-security)
   - 2.6 [Roadmap](#26-roadmap)
   - 2.7 [About](#27-about)
   - 2.8 [Contact](#28-contact)
3. [Internal Linking Strategy](#3-internal-linking-strategy)
4. [Image Alt Text Recommendations](#4-image-alt-text-recommendations)
5. [Robots.txt Recommendations](#5-robotstxt-recommendations)
6. [XML Sitemap Structure](#6-xml-sitemap-structure)
7. [Performance Optimisation Notes](#7-performance-optimisation-notes)
8. [Accessibility Considerations (WCAG 2.1 AA)](#8-accessibility-considerations-wcag-21-aa)
9. [Core Web Vitals Targets](#9-core-web-vitals-targets)

---

## 1. Site-Wide SEO Settings

| Setting | Value |
|---|---|
| Site URL | `https://www.map-platform.com` |
| Default locale | `en-GB` |
| Default image | `/images/og-default.png` (1200×630 px) |
| Site name | `MAP — Migration Assurance Platform` |
| Theme colour | `#764ba2` |
| Favicon | `/images/favicon.ico` (32×32) |
| Apple touch icon | `/images/apple-touch-icon.png` (180×180) |
| Schema.org type | `SoftwareApplication` (homepage), `Organization` (about) |
| Analytics ID | `G-XXXXXXXXXX` (GA4 placeholder) |
| GTM container | `GTM-XXXXXXX` (placeholder) |

---

## 2. Page Metadata

### 2.1 Index / Home

| Field | Value |
|---|---|
| **Page title** | `MAP — Migration Assurance Platform for Financial Services` |
| **Title length** | 55 chars |
| **Meta description** | `Ensure zero-data-loss financial migrations with MAP's automated validation engine, real-time reconciliation, and regulatory compliance tools.` |
| **Description length** | 140 chars |
| **Keywords** | `migration assurance platform, financial data migration, data validation, reconciliation, regulatory compliance, FCA, PRA` |

#### Open Graph Tags

```html
<meta property="og:title" content="MAP — Migration Assurance Platform for Financial Services" />
<meta property="og:description" content="Ensure zero-data-loss financial migrations with MAP's automated validation engine, real-time reconciliation, and regulatory compliance tools." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/" />
<meta property="og:image" content="https://www.map-platform.com/images/og-default.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="MAP — Migration Assurance Platform" />
<meta property="og:locale" content="en_GB" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@mapplatform" />
<meta name="twitter:title" content="MAP — Migration Assurance Platform for Financial Services" />
<meta name="twitter:description" content="Ensure zero-data-loss financial migrations with MAP's automated validation engine, real-time reconciliation, and regulatory compliance tools." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-default.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MAP — Migration Assurance Platform",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Automated validation engine for financial services data migrations with real-time reconciliation and regulatory compliance.",
  "url": "https://www.map-platform.com",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "GBP",
    "description": "Free consultation available"
  },
  "provider": {
    "@type": "Organization",
    "name": "MAP Platform Ltd",
    "url": "https://www.map-platform.com/about"
  }
}
```

#### Heading Hierarchy

```
H1: Migration Assurance Platform — Zero-Risk Financial Data Migrations
  H2: Why Leading Firms Choose MAP
    H3: Automated Validation
    H3: Real-Time Reconciliation
    H3: Regulatory Compliance
  H2: How MAP Works
    H3: Pre-Migration Analysis
    H3: Live Data Validation
    H3: Post-Migration Verification
  H2: Trusted by Financial Institutions
  H2: Get Started Today
```

---

### 2.2 Platform

| Field | Value |
|---|---|
| **Page title** | `Platform Overview — MAP Migration Validation Engine` |
| **Title length** | 52 chars |
| **Meta description** | `Explore MAP's migration validation engine: automated schema mapping, real-time data comparison, anomaly detection, and full audit trail capabilities.` |
| **Description length** | 146 chars |
| **Keywords** | `migration validation engine, schema mapping, data comparison, anomaly detection, audit trail, migration platform` |

#### Open Graph Tags

```html
<meta property="og:title" content="Platform Overview — MAP Migration Validation Engine" />
<meta property="og:description" content="Explore MAP's migration validation engine: automated schema mapping, real-time data comparison, anomaly detection, and full audit trail capabilities." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/platform" />
<meta property="og:image" content="https://www.map-platform.com/images/og-platform.png" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Platform Overview — MAP Migration Validation Engine" />
<meta name="twitter:description" content="Explore MAP's migration validation engine: automated schema mapping, real-time data comparison, anomaly detection, and full audit trail capabilities." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-platform.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/platform" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Platform Overview — MAP Migration Validation Engine",
  "description": "Explore MAP's migration validation engine with automated schema mapping, real-time data comparison, anomaly detection, and full audit trail capabilities.",
  "url": "https://www.map-platform.com/platform",
  "isPartOf": {
    "@type": "WebSite",
    "name": "MAP — Migration Assurance Platform",
    "url": "https://www.map-platform.com"
  }
}
```

#### Heading Hierarchy

```
H1: MAP Migration Validation Engine
  H2: Core Capabilities
    H3: Automated Schema Mapping
    H3: Real-Time Data Comparison
    H3: Anomaly Detection
    H3: Full Audit Trail
  H2: Architecture Overview
    H3: Data Ingestion Layer
    H3: Validation Engine
    H3: Reporting Dashboard
  H2: Integration Points
    H3: API Access
    H3: Database Connectors
    H3: File Import/Export
  H2: Platform Pricing
```

---

### 2.3 Solutions

| Field | Value |
|---|---|
| **Page title** | `Migration Solutions — Core Banking, Payments & Data` |
| **Title length** | 51 chars |
| **Meta description** | `Tailored migration solutions for core banking replacements, payment system upgrades, data warehouse transitions, and regulatory reporting migrations.` |
| **Description length** | 148 chars |
| **Keywords** | `core banking migration, payment system migration, data warehouse migration, regulatory reporting, financial migration solutions` |

#### Open Graph Tags

```html
<meta property="og:title" content="Migration Solutions — Core Banking, Payments & Data" />
<meta property="og:description" content="Tailored migration solutions for core banking replacements, payment system upgrades, data warehouse transitions, and regulatory reporting migrations." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/solutions" />
<meta property="og:image" content="https://www.map-platform.com/images/og-solutions.png" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Migration Solutions — Core Banking, Payments & Data" />
<meta name="twitter:description" content="Tailored migration solutions for core banking replacements, payment system upgrades, data warehouse transitions, and regulatory reporting migrations." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-solutions.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/solutions" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Migration Solutions — Core Banking, Payments & Data",
  "description": "Tailored migration solutions for core banking replacements, payment system upgrades, data warehouse transitions, and regulatory reporting migrations.",
  "url": "https://www.map-platform.com/solutions"
}
```

#### Heading Hierarchy

```
H1: Migration Solutions for Financial Services
  H2: Core Banking Migration
    H3: Temenos Transitions
    H3: Finastra Modernisation
    H3: Custom Core Replacements
  H2: Payment System Migration
    H3: SWIFT ISO 20022
    H3: CHAPS / BACS / Faster Payments
    H3: Card Processing Platforms
  H2: Data Warehouse Migration
    H3: Cloud Data Platform Transitions
    H3: Analytics Repository Migrations
  H2: Regulatory Reporting Migration
    H3: MiFID II / EMIR Reporting
    H3: Basel III / CRD IV Data
  H2: Request a Consultation
```

---

### 2.4 Industries

| Field | Value |
|---|---|
| **Page title** | `Industries — Banking, Insurance & Asset Management` |
| **Title length** | 51 chars |
| **Meta description** | `MAP serves retail banks, building societies, insurers, asset managers, and fintech firms with sector-specific migration validation frameworks.` |
| **Description length** | 141 chars |
| **Keywords** | `banking migration, insurance data migration, asset management migration, building society migration, fintech data migration` |

#### Open Graph Tags

```html
<meta property="og:title" content="Industries — Banking, Insurance & Asset Management" />
<meta property="og:description" content="MAP serves retail banks, building societies, insurers, asset managers, and fintech firms with sector-specific migration validation frameworks." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/industries" />
<meta property="og:image" content="https://www.map-platform.com/images/og-industries.png" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Industries — Banking, Insurance & Asset Management" />
<meta name="twitter:description" content="MAP serves retail banks, building societies, insurers, asset managers, and fintech firms with sector-specific migration validation frameworks." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-industries.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/industries" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Industries — Banking, Insurance & Asset Management",
  "description": "MAP serves retail banks, building societies, insurers, asset managers, and fintech firms with sector-specific migration validation frameworks.",
  "url": "https://www.map-platform.com/industries"
}
```

#### Heading Hierarchy

```
H1: Migration Solutions by Industry
  H2: Retail Banking
    H3: Customer Data Migration
    H3: Account & Product Migration
  H2: Building Societies
    H3: Mutual-to-Bank Transitions
    H3: Core System Replacements
  H2: Insurance
    H3: Policy Administration Systems
    H3: Claims Data Migration
  H2: Asset Management
    H3: Fund Accounting Migration
    H3: Client Portfolio Data
  H2: Fintech & Challenger Banks
    H3: Cloud-Native Migrations
    H3: API-First Data Transitions
  H2: Talk to Our Industry Experts
```

---

### 2.5 Security

| Field | Value |
|---|---|
| **Page title** | `Security & Compliance — FCA, GDPR & ISO 27001` |
| **Title length** | 47 chars |
| **Meta description** | `MAP meets FCA regulatory standards, GDPR requirements, and ISO 27001 certification with end-to-end encryption, audit logging, and access controls.` |
| **Description length** | 145 chars |
| **Keywords** | `FCA compliance, GDPR data migration, ISO 27001, financial data security, encryption, audit logging, regulatory compliance` |

#### Open Graph Tags

```html
<meta property="og:title" content="Security & Compliance — FCA, GDPR & ISO 27001" />
<meta property="og:description" content="MAP meets FCA regulatory standards, GDPR requirements, and ISO 27001 certification with end-to-end encryption, audit logging, and access controls." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/security" />
<meta property="og:image" content="https://www.map-platform.com/images/og-security.png" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Security & Compliance — FCA, GDPR & ISO 27001" />
<meta name="twitter:description" content="MAP meets FCA regulatory standards, GDPR requirements, and ISO 27001 certification with end-to-end encryption, audit logging, and access controls." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-security.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/security" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Security & Compliance — FCA, GDPR & ISO 27001",
  "description": "MAP meets FCA regulatory standards, GDPR requirements, and ISO 27001 certification with end-to-end encryption, audit logging, and access controls.",
  "url": "https://www.map-platform.com/security",
  "about": {
    "@type": "Thing",
    "name": "Financial Data Security Compliance"
  }
}
```

#### Heading Hierarchy

```
H1: Security & Regulatory Compliance
  H2: Compliance Framework
    H3: FCA Regulatory Requirements
    H3: PRA Supervisory Standards
    H3: GDPR Data Protection
  H2: Technical Security
    H3: Encryption at Rest and in Transit
    H3: Role-Based Access Control
    H3: Audit Logging & Immutable Records
  H2: Certifications & Assessments
    H3: ISO 27001
    H3: SOC 2 Type II
    H3: Penetration Testing
  H2: Data Residency & Sovereignty
  H2: Download Security Whitepaper
```

---

### 2.6 Roadmap

| Field | Value |
|---|---|
| **Page title** | `Product Roadmap — Upcoming Features & Releases` |
| **Title length** | 48 chars |
| **Meta description** | `View the MAP product roadmap: upcoming features including AI-assisted mapping, cloud-native deployment, expanded connectors, and enhanced reporting.` |
| **Description length** | 146 chars |
| **Keywords** | `product roadmap, migration platform features, AI data mapping, cloud migration, new connectors, product releases` |

#### Open Graph Tags

```html
<meta property="og:title" content="Product Roadmap — Upcoming Features & Releases" />
<meta property="og:description" content="View the MAP product roadmap: upcoming features including AI-assisted mapping, cloud-native deployment, expanded connectors, and enhanced reporting." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/roadmap" />
<meta property="og:image" content="https://www.map-platform.com/images/og-roadmap.png" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Product Roadmap — Upcoming Features & Releases" />
<meta name="twitter:description" content="View the MAP product roadmap: upcoming features including AI-assisted mapping, cloud-native deployment, expanded connectors, and enhanced reporting." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-roadmap.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/roadmap" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Product Roadmap — Upcoming Features & Releases",
  "description": "View the MAP product roadmap: upcoming features including AI-assisted mapping, cloud-native deployment, expanded connectors, and enhanced reporting.",
  "url": "https://www.map-platform.com/roadmap"
}
```

#### Heading Hierarchy

```
H1: MAP Product Roadmap
  H2: Q3 2026 — Current Quarter
    H3: AI-Assisted Schema Mapping
    H3: Enhanced Anomaly Detection
  H2: Q4 2026 — Next Quarter
    H3: Cloud-Native Deployment Option
    H3: Expanded Database Connectors
  H2: Q1 2027 — Planned
    H3: Advanced Reporting Dashboard
    H3: Multi-Tenant Support
  H2: Ongoing Initiatives
    H3: Performance Optimisations
    H3: Accessibility Improvements
  H2: Submit a Feature Request
```

---

### 2.7 About

| Field | Value |
|---|---|
| **Page title** | `About MAP — Our Team & Mission` |
| **Title length** | 31 chars |
| **Meta description** | `Learn about MAP's mission to eliminate data loss in financial migrations, founded by migration specialists with 20+ years of banking technology experience.` |
| **Description length** | 152 chars |
| **Keywords** | `about MAP, migration specialists, financial technology company, banking data experts, MAP team` |

#### Open Graph Tags

```html
<meta property="og:title" content="About MAP — Our Team & Mission" />
<meta property="og:description" content="Learn about MAP's mission to eliminate data loss in financial migrations, founded by migration specialists with 20+ years of banking technology experience." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/about" />
<meta property="og:image" content="https://www.map-platform.com/images/og-about.png" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="About MAP — Our Team & Mission" />
<meta name="twitter:description" content="Learn about MAP's mission to eliminate data loss in financial migrations, founded by migration specialists with 20+ years of banking technology experience." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-about.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/about" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About MAP — Our Team & Mission",
  "description": "Learn about MAP's mission to eliminate data loss in financial migrations, founded by migration specialists with 20+ years of banking technology experience.",
  "url": "https://www.map-platform.com/about",
  "mainEntity": {
    "@type": "Organization",
    "name": "MAP Platform Ltd",
    "foundingDate": "2023",
    "description": "Migration Assurance Platform for financial services",
    "url": "https://www.map-platform.com"
  }
}
```

#### Heading Hierarchy

```
H1: About MAP
  H2: Our Mission
    H3: Eliminating Data Loss in Financial Migrations
  H2: Our Story
    H3: Founded by Migration Specialists
    H3: 20+ Years of Banking Technology
  H2: Leadership Team
    H3: Chief Executive Officer
    H3: Chief Technology Officer
    H3: Head of Product
  H2: Company Values
    H3: Precision
    H3: Transparency
    H3: Compliance First
  H2: Join Our Team
```

---

### 2.8 Contact

| Field | Value |
|---|---|
| **Page title** | `Contact MAP — Request a Demo or Consultation` |
| **Title length** | 45 chars |
| **Meta description** | `Contact MAP to schedule a platform demo, discuss your migration requirements, or request a compliance consultation. Our team responds within 24 hours.` |
| **Description length** | 148 chars |
| **Keywords** | `contact MAP, schedule demo, migration consultation, financial data migration support, MAP sales` |

#### Open Graph Tags

```html
<meta property="og:title" content="Contact MAP — Request a Demo or Consultation" />
<meta property="og:description" content="Contact MAP to schedule a platform demo, discuss your migration requirements, or request a compliance consultation. Our team responds within 24 hours." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.map-platform.com/contact" />
<meta property="og:image" content="https://www.map-platform.com/images/og-contact.png" />
```

#### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Contact MAP — Request a Demo or Consultation" />
<meta name="twitter:description" content="Contact MAP to schedule a platform demo, discuss your migration requirements, or request a compliance consultation. Our team responds within 24 hours." />
<meta name="twitter:image" content="https://www.map-platform.com/images/og-contact.png" />
```

#### Canonical URL

```html
<link rel="canonical" href="https://www.map-platform.com/contact" />
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact MAP — Request a Demo or Consultation",
  "description": "Contact MAP to schedule a platform demo, discuss your migration requirements, or request a compliance consultation.",
  "url": "https://www.map-platform.com/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "MAP Platform Ltd",
    "email": "info@map-platform.com",
    "telephone": "+44-20-7946-0000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  }
}
```

#### Heading Hierarchy

```
H1: Contact MAP
  H2: Request a Demo
    H3: Platform Walkthrough
    H3: Custom Pricing Discussion
  H2: General Enquiries
    H3: Email Us
    H3: Call Us
  H3: Office Location
  H2: Partnership Opportunities
  H2: Support & Documentation
```

---

## 3. Internal Linking Strategy

### Navigation Links (present on every page)

| Source Page | Target Pages |
|---|---|
| All pages | index, platform, solutions, industries, security, roadmap, about, contact |
| Header | Logo → index |

### Cross-Page Link Matrix

| From → To | index | platform | solutions | industries | security | roadmap | about | contact |
|---|---|---|---|---|---|---|---|---|
| **index** | — | Platform Overview link | Solutions CTA | Industries preview | Trust badge link | — | Team section | Get Started CTA |
| **platform** | Home link | — | Use Cases link | Industry Fit link | Security features link | Upcoming Features | — | Try the Platform CTA |
| **solutions** | Home link | Technical Details | — | Industry Match link | Compliance link | — | Case Studies | Consultation CTA |
| **industries** | Home link | Platform by Sector | Solution Comparison | — | Regulatory Requirements | — | Our Experts | Talk to Specialist CTA |
| **security** | Home link | Security Architecture | Compliance Solutions | Industry Compliance | — | Security Roadmap | Our Team | Security Assessment CTA |
| **roadmap** | Home link | Platform Updates | Feature Releases | Industry Features | Security Enhancements | — | Our Vision | Feedback CTA |
| **about** | Home link | Our Platform | Our Solutions | Industries We Serve | Our Compliance | Product Direction | — | Join Us CTA |
| **contact** | Home link | Request Demo | Discuss Solutions | Industry Inquiry | Security Question | Feature Request | Meet the Team | — |

### Contextual Link Recommendations

- **index → platform**: Use "Explore the Platform" anchor text
- **index → solutions**: Use "View Migration Solutions" anchor text
- **index → industries**: Use "See Our Industry Expertise" anchor text
- **platform → security**: Use "Enterprise-Grade Security" anchor text
- **solutions → industries**: Use "Find Your Industry" anchor text
- **roadmap → platform**: Use "Current Platform Features" anchor text

### Breadcrumb Schema (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.map-platform.com/" },
    { "@type": "ListItem", "position": 2, "name": "Platform", "item": "https://www.map-platform.com/platform" },
    { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://www.map-platform.com/solutions" },
    { "@type": "ListItem", "position": 2, "name": "Industries", "item": "https://www.map-platform.com/industries" },
    { "@type": "ListItem", "position": 2, "name": "Security", "item": "https://www.map-platform.com/security" },
    { "@type": "ListItem", "position": 2, "name": "Roadmap", "item": "https://www.map-platform.com/roadmap" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.map-platform.com/about" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.map-platform.com/contact" }
  ]
}
```

---

## 4. Image Alt Text Recommendations

### Homepage Images

| Image | Alt Text | Notes |
|---|---|---|
| `hero-bg.svg` | `Abstract data flow visualisation representing secure migration processes` | Decorative background |
| `logo.svg` | `MAP — Migration Assurance Platform logo` | Brand asset |
| `icon-validation.svg` | `Automated data validation icon` | Feature icon |
| `icon-reconciliation.svg` | `Real-time reconciliation icon` | Feature icon |
| `icon-compliance.svg` | `Regulatory compliance shield icon` | Feature icon |
| `logo-client-1.svg` | `Client logo — [Client Name]` | Replace with real client |
| `logo-client-2.svg` | `Client logo — [Client Name]` | Replace with real client |
| `logo-client-3.svg` | `Client logo — [Client Name]` | Replace with real client |

### Platform Images

| Image | Alt Text |
|---|---|
| `platform-dashboard.png` | `MAP platform dashboard showing migration progress and validation metrics` |
| `platform-schema-mapping.png` | `Automated schema mapping interface displaying field matching` |
| `platform-reconciliation.png` | `Real-time reconciliation report with source-to-target comparison` |
| `platform-audit-trail.png` | `Immutable audit trail log with timestamps and user actions` |

### Solutions Images

| Image | Alt Text |
|---|---|
| `solution-core-banking.png` | `Core banking migration workflow diagram` |
| `solution-payments.png` | `Payment system migration architecture overview` |
| `solution-data-warehouse.png` | `Data warehouse migration pipeline visualisation` |
| `solution-regulatory.png` | `Regulatory reporting migration compliance checklist` |

### Industries Images

| Image | Alt Text |
|---|---|
| `industry-banking.png` | `Retail banking data migration illustration` |
| `industry-insurance.png` | `Insurance policy administration migration graphic` |
| `industry-asset-mgmt.png` | `Asset management fund accounting migration visual` |
| `industry-fintech.png` | `Fintech cloud-native migration architecture` |

### General Guidelines

- All images must have non-empty `alt` attributes
- Alt text should be concise (under 125 characters)
- Decorative images use `alt=""` and `role="presentation"`
- Complex diagrams include a text description nearby
- Decorative background images are not included in `alt` text

---

## 5. Robots.txt Recommendations

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /staging/
Disallow: /*.json$

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://www.map-platform.com/sitemap.xml
```

### Notes

- Block all non-production paths
- Allow all major crawlers full access to public pages
- Always reference the XML sitemap
- No `Crawl-delay` directive (not needed for modern crawlers)

---

## 6. XML Sitemap Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <url>
    <loc>https://www.map-platform.com/</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://www.map-platform.com/platform</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.map-platform.com/solutions</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.map-platform.com/industries</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.map-platform.com/security</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.map-platform.com/roadmap</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://www.map-platform.com/about</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://www.map-platform.com/contact</loc>
    <lastmod>2026-06-30</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>
```

---

## 7. Performance Optimisation Notes

### Image Optimisation

| Technique | Implementation |
|---|---|
| Format | WebP with PNG fallback |
| Lazy loading | `loading="lazy"` on below-fold images |
| Responsive sizes | `srcset` and `sizes` attributes |
| Max width | Hero images constrained to 1920px |
| Compression | 80% quality for WebP, 85% for JPEG |

### CSS / JS Optimisation

| Technique | Implementation |
|---|---|
| CSS minification | Enable via build pipeline |
| JS code splitting | Route-based chunking |
| Critical CSS | Inline above-fold styles |
| Font loading | `font-display: swap` for web fonts |
| Preconnect | `<link rel="preconnect">` for CDN origins |

### Caching Strategy

| Resource | Cache-Control |
|---|---|
| HTML pages | `no-cache, must-revalidate` |
| CSS / JS (hashed) | `public, max-age=31536000, immutable` |
| Images | `public, max-age=2592000` |
| Fonts | `public, max-age=31536000, immutable` |
| API responses | `private, no-store` |

### Network Optimisation

| Technique | Implementation |
|---|---|
| Brotli compression | Enable on Azure Static Web Apps |
| HTTP/2 | Enabled by default on Azure |
| Preload critical assets | `<link rel="preload">` for hero images |
| DNS prefetch | `<link rel="dns-prefetch">` for external domains |

---

## 8. Accessibility Considerations (WCAG 2.1 AA)

### Perceivable

| Criterion | Implementation |
|---|---|
| 1.1.1 Non-text Content | All images have meaningful `alt` text; decorative images use `alt=""` |
| 1.3.1 Info and Relationships | Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, `<article>`) |
| 1.3.2 Meaningful Sequence | DOM order matches visual order |
| 1.4.1 Use of Colour | Colour not sole means of conveying information; text has 4.5:1 contrast ratio minimum |
| 1.4.3 Contrast (Minimum) | Body text: 7:1 (AAA); large text: 4.5:1 (AA) |
| 1.4.4 Resize Text | Page remains functional at 200% zoom |
| 1.4.10 Reflow | No horizontal scrolling at 320px width |

### Operable

| Criterion | Implementation |
|---|---|
| 2.1.1 Keyboard | All interactive elements reachable and operable via keyboard |
| 2.1.2 No Keyboard Trap | Focus can be moved away from any component |
| 2.4.1 Bypass Blocks | Skip-to-content link as first focusable element |
| 2.4.2 Page Titled | Unique, descriptive `<title>` for each page |
| 2.4.3 Focus Order | Logical tab order following visual layout |
| 2.4.6 Headings and Labels | Descriptive headings and form labels |
| 2.5.3 Label in Name | Accessible name matches visible label |

### Understandable

| Criterion | Implementation |
|---|---|
| 3.1.1 Language of Page | `lang="en"` on `<html>` element |
| 3.2.1 On Focus | No unexpected context changes on focus |
| 3.2.3 Consistent Navigation | Navigation order consistent across all pages |
| 3.3.1 Error Identification | Form validation errors identified in text |
| 3.3.2 Labels or Instructions | Form fields have visible labels and helper text |

### Robust

| Criterion | Implementation |
|---|---|
| 4.1.1 Parsing | Valid HTML without duplicate IDs |
| 4.1.2 Name, Role, Value | ARIA roles and labels on custom components |

### Accessibility Testing Checklist

- [ ] Keyboard-only navigation test
- [ ] Screen reader test (NVDA / VoiceOver)
- [ ] Colour contrast audit (axe-core)
- [ ] Focus indicator visibility check
- [ ] Form error handling verification
- [ ] Skip link functionality
- [ ] Heading hierarchy validation
- [ ] Image alt text review

---

## 9. Core Web Vitals Targets

| Metric | Target | Current Status |
|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 s | To be measured post-deployment |
| **FID** (First Input Delay) | ≤ 100 ms | To be measured post-deployment |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | To be measured post-deployment |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | To be measured post-deployment |
| **TTFB** (Time to First Byte) | ≤ 800 ms | To be measured post-deployment |
| **FCP** (First Contentful Paint) | ≤ 1.8 s | To be measured post-deployment |
| **TBT** (Total Blocking Time) | ≤ 200 ms | To be measured post-deployment |

### Measurement Tools

| Tool | Purpose |
|---|---|
| Lighthouse | Local performance audit |
| PageSpeed Insights | Real-world field data |
| Chrome DevTools Performance panel | Detailed loading analysis |
| Azure Application Insights | Production monitoring |
| WebPageTest | Multi-location testing |

### Optimisation Strategies

| Strategy | Target Metric |
|---|---|
| Image lazy loading | LCP, FCP |
| Code splitting | TBT, FID |
| Font preload | FCP, LCP |
| Layout stability fixes | CLS |
| Service worker caching | TTFB, LCP |
| Server-side rendering | TTFB, FCP |

---

*End of SEO Metadata Reference.*
