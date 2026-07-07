# MAP Presentation Engine
## Acceptance Test Guide
Version 2.0 | July 2026

---

# OBJECTIVE

Create a complete User Acceptance Test (UAT) and System Acceptance Test (SAT) guide for the MAP Presentation Engine.

This guide enables someone with no prior knowledge of MAP to verify that every generated output is complete, professional, internally consistent, and ready for external use.

---

# TEST ENVIRONMENT

| Field | Value |
|-------|-------|
| Date | |
| Tester | |
| Version | 2.0 |
| Operating System | |
| Browser | |
| Resolution | |
| Internet Connected | Yes / No |
| Output Folder Tested | |

---

# MODULE 01 — Demonstration Execution Engine

## Purpose
Generate demo scenario data and build the HTML demo package.

## Expected Output
- JSON data files for dashboard rendering
- HTML demo package with navigation

## Output Folder
`MAP_Demo/`

## Files Expected
- `dashboard_data/data/*.json` (9 files)
- `Demo/index.html`
- `Demo/dashboard/index.html`
- `Demo/css/style.css`
- `Demo/js/data.js`
- `Demo/js/dashboard.js`

## How to Open
Open `Demo/index.html` in Microsoft Edge or Chrome.

## How to Test
1. Open `Demo/index.html`
2. Verify landing page loads
3. Click every navigation tile
4. Verify every dashboard opens
5. Verify charts render correctly
6. Disconnect internet and verify offline mode works

## What Good Looks Like
- Landing page loads within 2 seconds
- All 8 dashboards render correctly
- Charts display data accurately
- Navigation works smoothly
- No console errors

## Common Problems
- Missing Chart.js library
- Broken navigation links
- Console errors

## Pass/Fail Checklist
- [ ] Landing page loads
- [ ] All 8 dashboards open
- [ ] Charts render correctly
- [ ] Navigation works
- [ ] Offline mode works
- [ ] No console errors
- [ ] No localhost references
- [ ] No developer messages

---

# MODULE 02 — UI Refinement

## Purpose
Refine CSS and HTML for enterprise presentation quality.

## Expected Output
- Refined CSS with design tokens
- Accessible HTML with ARIA attributes

## Output Folder
`MAP_Demo/Demo/`

## Files Expected
- `css/style.css` (1128+ lines)
- `dashboard/index.html` (335+ lines)
- `js/dashboard.js` (476+ lines)

## How to Open
Open `dashboard/index.html` in browser.

## How to Test
1. Open `dashboard/index.html`
2. Verify responsive design at 1440px, 1024px, 768px, 480px
3. Verify keyboard navigation works
4. Verify high contrast mode
5. Check for ARIA attributes

## What Good Looks Like
- Professional typography (Segoe UI)
- Azure colour palette consistent
- Responsive at all breakpoints
- Keyboard accessible
- Print stylesheet works

## Common Problems
- Missing design tokens
- Inconsistent spacing
- Broken responsive layout

## Pass/Fail Checklist
- [ ] CSS loads correctly
- [ ] Typography is Segoe UI
- [ ] Colours match Azure palette
- [ ] Responsive at 1440px
- [ ] Responsive at 1024px
- [ ] Responsive at 768px
- [ ] Responsive at 480px
- [ ] Keyboard navigation works
- [ ] Print stylesheet works

---

# MODULE 03 — MAP Demo Package

## Purpose
Enterprise demo package with branded dashboards and reports.

## Expected Output
- Complete demo package with navigation
- 8 HTML executive reports
- Landing page and About page

## Output Folder
`MAP_Demo/`

## Files Expected
- `Launch_MAP.html`
- `Landing.html`
- `About_MAP.html`
- `README.html`
- `dashboard/index.html`
- `reports/*.html` (8 files)
- `version/version.json`
- `Demo_Package_Report.md`

## How to Open
Open `Launch_MAP.html` in browser.

## How to Test
1. Open `Launch_MAP.html`
2. Verify branded splash screen loads
3. Click through to Landing Page
4. Navigate to every dashboard view
5. Open every report
6. Verify About MAP page
7. Test in Edge, Chrome, Firefox
8. Disconnect internet and verify offline mode

## What Good Looks Like
- Professional branded appearance
- All dashboards accessible
- All 8 reports generate correctly
- Navigation works across all pages
- Offline mode functional

## Common Problems
- Missing reports
- Broken navigation
- Console errors
- Missing assets

## Pass/Fail Checklist
- [ ] Launch_MAP.html loads
- [ ] Landing page loads
- [ ] All 8 dashboards open
- [ ] All 8 reports load
- [ ] About MAP page loads
- [ ] Navigation works
- [ ] Offline mode works
- [ ] No localhost references
- [ ] No VS Code references
- [ ] No PostgreSQL references
- [ ] No broken links
- [ ] No missing charts
- [ ] No missing assets

---

# MODULE 04 — Product Rendering & Media Pack

## Purpose
Media library with dashboard renders, hero images, and brand assets.

## Expected Output
- 50+ HTML render templates
- SVG logos and icons
- Media guide

## Output Folder
`MAP_Demo/Media/`

## Files Expected
- `Full/templates/*.html` (10 files)
- `Hero/templates/*.html` (7 files)
- `Website/templates/*.html` (6 files)
- `Brochure/templates/*.html` (5 files)
- `Pitch_Deck/templates/*.html` (8 files)
- `LinkedIn/templates/*.html` (7 files)
- `Cards/templates/*.html` (4 files)
- `Logos/*.svg` (2 files)
- `Icons/*.svg` (1 file)
- `base.css`
- `Media_Guide.html`
- `Media_Pack_Report.md`

## How to Open
Open `Media_Guide.html` in browser.

## How to Test
1. Open `Media_Guide.html`
2. Verify media guide loads
3. Check all template directories exist
4. Verify SVG logos render
5. Check base.css loads
6. Verify no external dependencies

## What Good Looks Like
- Professional template designs
- Azure colour palette consistent
- MAP Nexus branding on all assets
- SVG logos render correctly
- No external CDN dependencies

## Common Problems
- Missing templates
- Broken SVG rendering
- External CDN references
- Missing brand consistency

## Pass/Fail Checklist
- [ ] Media guide loads
- [ ] All template directories exist
- [ ] SVG logos render
- [ ] Icons render
- [ ] base.css loads
- [ ] Azure colours consistent
- [ ] MAP branding present
- [ ] No browser chrome
- [ ] No developer artefacts
- [ ] No external dependencies

---

# MODULE 05 — Product Brochure

## Purpose
16-page enterprise product brochure.

## Expected Output
- Interactive HTML brochure (A4 Portrait)
- Print-to-PDF ready

## Output Folder
`MAP_Demo/Product_Brochure/`

## Files Expected
- `MAP_Product_Brochure.html`
- `Product_Brochure_Report.md`
- `version/version.json`

## How to Open
Open `MAP_Product_Brochure.html` in browser.

## How to Test
1. Open `MAP_Product_Brochure.html`
2. Verify cover page loads
3. Scroll through all 16 pages
4. Verify print CSS works (Ctrl+P)
5. Check all sections present
6. Verify MAP Nexus branding

## What Good Looks Like
- Professional 16-page brochure
- Consistent Azure branding
- Print CSS produces clean PDF
- All sections present
- No technical implementation details

## Common Problems
- Missing pages
- Broken print CSS
- Inconsistent branding
- Missing sections

## Pass/Fail Checklist
- [ ] Brochure opens
- [ ] Cover page loads
- [ ] All 16 pages present
- [ ] Print CSS works
- [ ] Suitable for CIO
- [ ] Suitable for Microsoft
- [ ] Suitable for customer
- [ ] No technical details
- [ ] No localhost references

---

# MODULE 06 — Investor Pack

## Purpose
15-slide investor presentation with speaker notes.

## Expected Output
- Interactive HTML presentation (16:9)
- Executive Summary (2 pages)
- Investor One-Pager (1 page)
- Speaker notes

## Output Folder
`MAP_Demo/Investor_Pack/`

## Files Expected
- `MAP_Investor_Deck.html`
- `Investor_Executive_Summary.html`
- `Investor_One_Pager.html`
- `Investor_Pack_Report.md`
- `version/version.json`

## How to Open
Open `MAP_Investor_Deck.html` in browser.

## How to Test
1. Open `MAP_Investor_Deck.html`
2. Navigate through all 15 slides
3. Test keyboard navigation (arrows, space)
4. Test click navigation
5. Toggle speaker notes (N key)
6. Test fullscreen mode (F key)
7. Open Executive Summary
8. Open One-Pager

## What Good Looks Like
- Professional 15-slide deck
- All slides render correctly
- Speaker notes work
- Navigation works
- Executive Summary is 2 pages
- One-Pager is 1 page

## Common Problems
- Missing slides
- Broken navigation
- Speaker notes not working
- Keyboard shortcuts not working

## Pass/Fail Checklist
- [ ] Deck opens
- [ ] All 15 slides present
- [ ] Keyboard navigation works
- [ ] Click navigation works
- [ ] Speaker notes toggle
- [ ] Fullscreen mode works
- [ ] Executive Summary loads
- [ ] One-Pager loads
- [ ] Professional appearance
- [ ] Investor ready

---

# MODULE 07 — Sales Demo Package

## Purpose
Complete sales demonstration package with guides and scripts.

## Expected Output
- Sales Demo Guide
- Interactive Demo Launcher
- FAQ (20 questions)
- Objection Handling Guide
- Scenario Library

## Output Folder
`MAP_Demo/Sales_Demo/`

## Files Expected
- `Sales_Demo_Guide.html`
- `Interactive_Demo/index.html`
- `FAQ.html`
- `Objection_Handling.html`
- `Scenario_Library.html`
- `Sales_Demo_Report.md`
- `version/version.json`

## How to Open
Open `Sales_Demo_Guide.html` in browser.

## How to Test
1. Open `Sales_Demo_Guide.html`
2. Verify guide loads with all sections
3. Open Interactive Demo Launcher
4. Verify 6 audience type buttons
5. Open FAQ
6. Verify 20 questions present
7. Open Objection Handling
8. Verify 8 objections present
9. Open Scenario Library
10. Verify 7 scenarios present

## What Good Looks Like
- Professional demo guide
- All 10 demo sections present
- Interactive launcher works
- FAQ has 20 questions
- Objection Handling has 8 objections
- Scenario Library has 7 scenarios

## Common Problems
- Missing sections
- Broken interactive elements
- Missing questions
- Missing scenarios

## Pass/Fail Checklist
- [ ] Demo guide loads
- [ ] All 10 sections present
- [ ] Interactive launcher works
- [ ] 6 audience types present
- [ ] FAQ has 20 questions
- [ ] Objection Handling has 8 objections
- [ ] Scenario Library has 7 scenarios
- [ ] Professional appearance
- [ ] Business focused

---

# MODULE 08 — Website & Digital Content Pack

## Purpose
Complete website content pack with pages, SEO, and email templates.

## Expected Output
- 38 content files
- 8 feature pages
- 8 industry pages
- 7 landing pages
- SEO pack
- Email templates
- FAQ (30 questions)
- CTA library

## Output Folder
`MAP_Demo/Website_Content/`

## Files Expected
- `Home.md`
- `Platform.md`
- `Technology.md`
- `Why_MAP.md`
- `Features/*.md` (8 files)
- `Industries/*.md` (8 files)
- `Founder/*.md` (5 files)
- `Landing_Pages/*.md` (7 files)
- `SEO/SEO_Pack.md`
- `Email/Email_Templates.md`
- `FAQ.md`
- `CTAs.md`
- `Reports/Website_Content_Report.md`
- `Version/version.json`

## How to Open
Open any `.md` file in text editor or Markdown viewer.

## How to Test
1. Verify all directories exist
2. Count all files (should be 38+)
3. Open Home.md and verify content
4. Open FAQ.md and count questions (30)
5. Open SEO_Pack.md and verify meta tags
6. Open Email_Templates.md and verify 6 templates
7. Check for forbidden references

## What Good Looks Like
- All 38 files present
- Content is professional
- SEO metadata complete
- Email templates functional
- FAQ has 30 questions
- CTAs have 7 variants

## Common Problems
- Missing files
- Inconsistent content
- Missing SEO metadata
- Broken formatting

## Pass/Fail Checklist
- [ ] All directories exist
- [ ] All 38 files present
- [ ] Home.md content complete
- [ ] Platform.md content complete
- [ ] 8 feature pages present
- [ ] 8 industry pages present
- [ ] 5 founder bios present
- [ ] 7 landing pages present
- [ ] SEO pack complete
- [ ] 6 email templates present
- [ ] 30 FAQ questions present
- [ ] 7 CTA variants present
- [ ] No localhost references
- [ ] Professional language

---

# MODULE 09 — Microsoft Partner Ready Pack

## Purpose
(Reserved for future implementation)

## Expected Output
(Reserved)

## Pass/Fail Checklist
- [ ] Reserved for future module

---

# MODULE 10 — Enterprise Proposal Pack

## Purpose
(Reserved for future implementation)

## Expected Output
(Reserved)

## Pass/Fail Checklist
- [ ] Reserved for future module

---

# GLOBAL TESTS

## Brand Review

### Verify
- [ ] MAP logo present in all outputs
- [ ] Azure colour palette consistent
- [ ] Segoe UI font used throughout
- [ ] Consistent colours across modules
- [ ] Consistent spacing across modules

### Colour Palette
| Colour | Hex | Usage |
|--------|-----|-------|
| Primary Blue | #0078D4 | Headers, CTAs |
| Dark Blue | #003B75 | Backgrounds |
| Green | #107C10 | Success, Positive |
| Yellow | #FFB900 | Warnings, Highlights |
| Red | #D13438 | Errors, Critical |
| Purple | #5C2D91 | Features, Accent |

---

## Terminology Review

### Verify Consistent Use Of
- [ ] MAP Nexus™ (not MAP, not Nexus alone)
- [ ] Migration Readiness (not data readiness)
- [ ] Validation Centre (not validation center)
- [ ] Governance Centre (not governance center)
- [ ] Migration Status (not migration progress)
- [ ] Executive Dashboard (not leader dashboard)

### Never Use
- [ ] Issue Dashboard
- [ ] Pipeline Blocked
- [ ] Developer wording
- [ ] Technical jargon
- [ ] Marketing hype

---

## Search Review

### Search All Generated Files For
| Term | Expected | Status |
|------|----------|--------|
| localhost | Not found | |
| postgres | Not found | |
| password | Not found | |
| debug | Not found | |
| TODO | Not found | |
| developer | Not found | |
| VS Code | Not found | |
| terminal | Not found | |
| sample | Not found | |
| example | Not found | |
| placeholder | Not found | |
| lorem | Not found | |

---

## Consistency Review

### Verify Identical Across All Modules
- [ ] Mission statement
- [ ] Vision statement
- [ ] Founder profile
- [ ] Azure positioning
- [ ] Product roadmap
- [ ] Business model
- [ ] Problem statement
- [ ] Solution statement

---

## Performance Review

### Measure
| Metric | Target | Actual |
|--------|--------|--------|
| Landing page load | < 2 seconds | |
| Dashboard load | < 3 seconds | |
| Report load | < 2 seconds | |
| Browser responsiveness | Immediate | |

---

## Professional Review

### Ask
- [ ] Would Microsoft approve this?
- [ ] Would I send this to a customer?
- [ ] Would I present this to a CIO?
- [ ] Would I show this to investors?

---

# OUTPUT ACCESS

## Module Access Guide

| Module | Folder | Primary File | Recommended Browser |
|--------|--------|--------------|---------------------|
| 01 | Demo/ | index.html | Edge/Chrome |
| 02 | Demo/ | dashboard/index.html | Edge/Chrome |
| 03 | MAP_Demo/ | Launch_MAP.html | Edge/Chrome |
| 04 | MAP_Demo/Media/ | Media_Guide.html | Edge/Chrome |
| 05 | MAP_Demo/Product_Brochure/ | MAP_Product_Brochure.html | Edge/Chrome |
| 06 | MAP_Demo/Investor_Pack/ | MAP_Investor_Deck.html | Edge/Chrome |
| 07 | MAP_Demo/Sales_Demo/ | Sales_Demo_Guide.html | Edge/Chrome |
| 08 | MAP_Demo/Website_Content/ | Home.md | Text Editor |

---

# TEST REPORT

## Auto-Generate
- Modules Tested: [count]
- Modules Passed: [count]
- Modules Failed: [count]
- Issues Found: [count]
- Recommendations: [list]
- Overall Readiness Score: [score]
- Ready for Release: Yes / No

---

# FUTURE EXPANSION

This guide is designed so Modules 09, 10 and future modules can be added without changing existing numbering.

To add a new module test:
1. Copy an existing module section
2. Update the module number
3. Update purpose, files, and test steps
4. Update pass/fail checklist
