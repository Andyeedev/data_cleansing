# MAP Website — Comparative Analysis

**Date:** 30 June 2026
**Sites Analyzed:**
- **Main Site** — `02_output/03_Website_Transformation/` (port 8080)
- **Simplified Site** — `research/.../03_Website_Transformation_Simplified/` (port 8081)

---

## 1. Page Inventory

| Page | Main Site | Simplified Site | Notes |
|------|-----------|-----------------|-------|
| index.html | ✅ (880 lines) | ✅ (297 lines) | Main is 3× larger |
| platform.html | ✅ (620 lines) | ✅ (236 lines) | Main has architecture + capability matrix |
| solutions.html | ✅ (687 lines) | ❌ | **Missing from simplified** |
| industries.html | ✅ (590 lines) | ❌ | **Missing from simplified** |
| security.html | ✅ (650 lines) | ❌ | **Missing from simplified** |
| roadmap.html | ✅ (640 lines) | ✅ (209 lines) | Main has 8 features per release; simplified has 4 phases |
| about.html | ✅ (610 lines) | ✅ (226 lines) | Main has founder story; simplified has placeholder team |
| contact.html | ✅ (440 lines) | ✅ (174 lines) | Main has form validation + success state; simplified has alert() |
| color-preview.html | ✅ (280 lines) | ✅ (240 lines) | Both are dev-only utility pages |
| **Total pages** | **9** | **6** | **Main has 3 extra pages** |
| **Total lines** | **~5,697** | **~1,382** | **Main is ~4× larger** |

---

## 2. Navigation

| Aspect | Main Site | Simplified Site |
|--------|-----------|-----------------|
| Nav links | 8 (Home, Platform, Solutions, Industries, Security, Roadmap, About, Contact) | 5 (Home, Platform, About, Roadmap, Contact) |
| CTA button | "Contact Us" → opens modal | "Get Started" → link to contact.html |
| Active page indicator | Page-specific (some use `font-medium`, some use color) | `font-medium` only — no color distinction |
| Mobile menu | ✅ Hamburger toggle (`mobileMenuBtn` / `mobile-menu`) | ❌ **No mobile menu** — links hidden on mobile |
| Breadcrumbs | About, Roadmap pages only | Platform, About, Roadmap, Contact pages |
| Sticky nav | ✅ Fixed top with shadow on scroll | ✅ Fixed top (`bg-white shadow-sm fixed w-full top-0 z-50`) |

---

## 3. Design & Styling

| Aspect | Main Site | Simplified Site |
|--------|-----------|-----------------|
| CSS framework | Tailwind CDN + local `map-styles.css` (4,283 lines) | Tailwind CDN only — **no local CSS** |
| Shared JS | `map-scripts.js` (1,301 lines) | None — all inline |
| Font | Inter (Google Fonts) | Inter (Google Fonts) |
| Gradient | `#667eea → #764ba2` | `#667eea → #764ba2` ✅ Same |
| Theme | Light (white nav, gray-50 body) | Light (white nav, gray-50 body) ✅ Same |
| Footer | Dark (`bg-gray-900`), 4 columns, social icons | Dark (`bg-gray-900`), 4 columns, no social icons |
| Color config keys | ❌ **Inconsistent**: `primary/secondary`, `brand.start/end`, `map-blue/map-purple`, `gradient.start/end` across pages | ❌ Inconsistent: `primary/secondary` in some, `brand-start/brand-end` in others |

---

## 4. Content Depth — Page-by-Page

### index.html (Homepage)

| Section | Main Site | Simplified Site |
|---------|-----------|-----------------|
| Hero | Full-width gradient, 2-col (text + dashboard mockup), 2 CTAs | Gradient, 2-col (text + mock widget with bar chart) |
| Stats bar | 4 metrics (10,000+ Migrations, 99.9% Uptime, 500+ Clients, 24/7 Support) | None |
| Pain points | 3 cards (Data Loss, Downtime, Compliance) | None |
| How it works | 5-step timeline | None |
| ROI Calculator | ✅ Interactive calculator with sliders | ❌ None |
| Integration grid | ✅ Platform logos | None |
| Testimonials | 3 cards | None |
| Value props | 6 module cards (Discovery, Mapping, Validation, Governance, Reporting, AI) | 6 value cards (Accelerate, Reduce Risk, Compliance, Visibility, AI-Powered, Security) |
| Azure section | ❌ None | ✅ 4 Azure services (Entra ID, Key Vault, Container Apps, OpenAI) |
| CTA | Gradient banner | Gradient banner |

### platform.html

| Section | Main Site | Simplified Site |
|---------|-----------|-----------------|
| Hero | Full gradient, title + subtitle | Page header with breadcrumb |
| Architecture | 3-step flow diagram (Discovery → Mapping → Validation) | None |
| Capability matrix | ✅ 20-row detailed matrix | None |
| Feature cards | 4 arch cards (Intelligent Discovery, Risk Prediction, Cost Optimization, Compliance) | 5 capability cards (Discovery, Validation, Governance, Reporting, AI) |
| Platform engines | 4 engines (Discovery, Validation, Governance, Reporting) | None |
| Evidence repo | ✅ Detailed section | None |
| Dashboards | 3 dashboard types | None |
| AI timeline | ✅ 4 AI evolution milestones | None |
| CTA | Gradient banner | Contact Us + Learn More |

### about.html

| Section | Main Site | Simplified Site |
|---------|-----------|-----------------|
| Mission | ✅ | ✅ (same text) |
| Vision | ✅ With quote block | ✅ Plain text |
| Why MAP exists | 3 stat cards (70%, 60%, 45%) + "Human Cost" comparison | 3 stat cards (70%, 60%, 45%) only |
| Founder | ✅ Single founder profile, 15+ years, £50B+ value | ✅ Placeholder (`[Founder Name]`, `[Initials]`) |
| Team | None | ✅ 4 placeholder team members |
| Values | 4 values (Trust, Assurance, Intelligence, Compliance) | 4 values (Trust, Assurance, Intelligence, Compliance) |

### roadmap.html

| Section | Main Site | Simplified Site |
|---------|-----------|-----------------|
| Timeline | 4 releases (R1-R4), 8 features each, Q1 2026–Q4 2027 | 4 phases (MVP→AI), 4-5 features each, Q3 2026–2028+ |
| Detail level | Feature names + descriptions per item | Feature names only (bullet list) |
| Visual style | Card-based with color-coded quarters | Vertical timeline with left border |

### contact.html

| Section | Main Site | Simplified Site |
|---------|-----------|-----------------|
| Form fields | Name, Email, Company, Enquiry type dropdown, Message | Name, Email, Organisation, Message |
| Validation | ✅ Full JS validation (required fields, email regex, success state) | ❌ `alert("Thank you!")` only |
| Contact info | FAQ accordion, enquiry types | Email (placeholder), LinkedIn (placeholder), Location |
| Offices | None | None |
| JSON-LD | ✅ ContactPage schema | ❌ None |

---

## 5. JavaScript Functionality

| Feature | Main Site | Simplified Site |
|---------|-----------|-----------------|
| Shared JS file | `map-scripts.js` (1,301 lines) | None |
| Mobile menu | ✅ Hamburger toggle | ❌ Not implemented |
| Modals | ✅ Demo request + Free trial modals | ❌ None |
| FAQ accordion | ✅ `toggleFaq()` | ❌ None |
| Scroll animations | ✅ IntersectionObserver on `.fade-in` | ⚠️ Observer exists but targets `.animate-on-scroll` (unused class) — **broken** |
| Back-to-top | ✅ Button appears on scroll | ❌ None |
| Cookie consent | ✅ Banner with accept/decline | ❌ None |
| Form validation | ✅ Full validation with error states | ❌ `alert()` only |
| ROI Calculator | ✅ Interactive sliders | ❌ None |
| CountUp animation | ✅ Statistics animate on scroll | ❌ None |
| Tab functionality | ✅ Platform page tabs | ❌ None |
| Toast notifications | ✅ Success/error/warning/info toasts | ❌ None |
| Lazy loading | ✅ Image lazy loading | ❌ None |
| Smooth scroll | ✅ Anchor links smooth scroll | ❌ None |

---

## 6. SEO & Meta

| Aspect | Main Site | Simplified Site |
|--------|-----------|-----------------|
| Meta descriptions | ✅ All pages | ✅ All pages (except color-preview) |
| Open Graph tags | ❌ None | ✅ index.html only |
| Canonical URLs | ❌ None | ✅ index.html only |
| JSON-LD structured data | ✅ contact.html (ContactPage) | ❌ None |
| Keywords meta | ❌ None | ✅ index.html only |
| Sitemap reference | ✅ In SEO-Metadata.md | ❌ None |

---

## 7. Shared Components

| Component | Main Site | Simplified Site |
|-----------|-----------|-----------------|
| Nav bar | All pages (slight variations) | All pages (consistent) |
| Footer | 4-column dark footer | 4-column dark footer (no social icons) |
| Hero pattern | Gradient bg + white text | Gradient bg + white text |
| CTA pattern | Gradient banner at bottom | Gradient banner at bottom |
| Modals | Demo + Trial modals (solutions, about pages) | None |
| Breadcrumbs | Some pages | Most pages |

---

## 8. Issues & Quality

### Main Site Issues
1. ❌ **Tailwind config inconsistency** — 5 different naming patterns for the same colors across pages
2. ❌ **map-scripts.js is EduFlow template** — Contains ROI calculator, student references, EduFlow-specific code
3. ❌ **Duplicate modal systems** — Inline `openModal()` in index.html vs `map-scripts.js` version (conflict)
4. ❌ **Inconsistent modal IDs** — `demoModal` vs `demo-modal` across pages
5. ❌ **Missing modals on some pages** — platform.html, industries.html, security.html, roadmap.html lack modals
6. ⚠️ **Heavy CSS** — 4,283-line CSS file mostly unused utility classes
7. ⚠️ **About page founder** — Single founder profile (not a team)

### Simplified Site Issues
1. ❌ **No mobile menu** — Navigation broken on mobile devices
2. ❌ **Scroll animations broken** — JS observes `.animate-on-scroll` but no elements use that class
3. ❌ **Placeholder content** — `[Founder Name]`, `[your-email@domain.com]`, `[linkedin.com/in/yourprofile]`
4. ❌ **Contact form non-functional** — Just shows `alert()`
5. ❌ **Missing 3 pages** — No Solutions, Industries, or Security pages
6. ⚠️ **No shared CSS/JS files** — All code duplicated across 6 HTML files
7. ⚠️ **No SEO meta tags** — Missing Open Graph, canonical, JSON-LD (except index)
8. ⚠️ **No cookie consent, no back-to-top, no toasts**

---

## 9. Recommendation Summary

| Criterion | Winner | Reason |
|-----------|--------|--------|
| **Page coverage** | Main (9 pages) | Has Solutions, Industries, Security |
| **Content depth** | Main | 4× more content, detailed matrices, calculators |
| **Mobile support** | Main | Has hamburger menu toggle |
| **JavaScript features** | Main | Modals, FAQ, scroll animations, validation, toasts |
| **Code consistency** | Simplified | Fewer files = fewer inconsistencies |
| **Code cleanliness** | Simplified | No template leftover code |
| **Maintainability** | Simplified | Simpler codebase, no external CSS/JS dependencies |
| **SEO** | Mixed | Main has JSON-LD; Simplified has Open Graph |
| **Production readiness** | Neither | Both have placeholders, broken features |

### Key Takeaway
The **Main Site** has significantly more content and features but suffers from template code pollution and inconsistency. The **Simplified Site** is cleaner but incomplete and has broken interactivity. A production site should combine the Main Site's content/features with the Simplified Site's cleaner code structure, while adding the missing mobile menu, fixing scroll animations, and replacing all placeholder content.
