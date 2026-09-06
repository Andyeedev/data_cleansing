# OC-SEC-001 — Revised Implementation Proposal (Post-Review)
**WORK PACKAGE:** OC-SEC-001 | **ID:** OC-SEC-001 | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**REVISION:** Final implementation proposal after APPROVED WITH REQUIRED CHANGES review. No remediation to be committed until this proposal is explicitly approved.

---

## 1. Final Agreed Remediation List

| # | Change | Type | Priority | Blocked By | Deferred To |
|---|---|---|---|---|---|
| 1 | Self-host Tailwind CSS (compile, replace CDN) | Security | P0 | — | — |
| 2 | Create `staticwebapp.config.json` with CSP + security headers | Security | P0 | Item 1 (Tailwind must be self-hosted first) | — |
| 3 | Add `@limiter.limit("10/minute")` to `POST /api/v1/leads` | Security | P0 | Confirm client IP preservation in production proxy | — |
| 4 | Drop `work_email_hash` column, add dedup on `work_email` | Data Quality | P1 | Confirm no data migration needed | — |
| 5 | Add redirect rule for Azure hostname → `www.mapnexus.co.uk` | Security | P1 | Verify SWA redirect config (see Section 4) | — |
| 6 | Test rollback, document actual recovery time | Operations | P2 | — | — |
| 7 | robots.txt + sitemap.xml | SEO | DEFERRED | — | OC-SEC-005 (SEO work package) |
| 8 | Privacy Policy + Cookie Policy + consent + retention + GDPR | Privacy | DEFERRED | — | OC-SEC-003 |
| 9 | SPF + DMARC DNS records | Email Security | DEFERRED | — | OC-SEC-004 |
| 10 | WAF / DDoS protection | Security | DEFERRED | — | Future cloud deployment architecture |

---

## 2. P0/P1/P2 Priority

**P0 (Implement First):**
* Item 1: Self-host Tailwind CSS — eliminates CDN dependency, prerequisite for CSP
* Item 2: CSP + security headers via `staticwebapp.config.json`
* Item 3: Rate limiting on `POST /api/v1/leads`

**P1 (Implement After P0):**
* Item 4: Drop `work_email_hash`, add dedup
* Item 5: Azure hostname redirect

**P2 (Implement After P1):**
* Item 6: Rollback test

---

## 3. Exact Files Expected to Change

| File | Change | Type |
|---|---|---|
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/package.json` | **NEW** — npm project with `tailwindcss` dependency | New file |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/tailwind.config.js` | **NEW** — content paths scanning HTML files | New file |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/src/input.css` | **NEW** — `@tailwind base; @tailwind components; @tailwind utilities;` + custom classes from `<style>` blocks | New file |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/staticwebapp.config.json` | **NEW** — CSP headers, security headers, redirect rules | New file |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/index.html` | Replace `<script src="cdn.tailwindcss.com">` with `<link rel="stylesheet" href="styles.css">`, move `<style>` block contents to `src/input.css`, replace inline `onclick` with event listeners | Modified |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/contact.html` | Same as index.html | Modified |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/platform.html` | Same as index.html | Modified |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/about.html` | Same as index.html | Modified |
| `engineering/MAP_V3/02_output/08_Soft_Launch/Website_Prepared/roadmap.html` | Same as index.html | Modified |
| `app/api/routes/lead_routes.py` | Add `@limiter.limit("10/minute")` decorator to `create_lead` | Modified |
| `app/services/lead_service.py` | Remove `work_email_hash` from INSERT, add dedup check | Modified |
| `sql/schema/17_drop_work_email_hash.sql` | **NEW** — `ALTER TABLE core.leads DROP COLUMN work_email_hash;` | New file |

---

## 4. Database Migration Implications

### work_email_hash Removal

**Pre-change verification (已完成):**
* `work_email_hash` referenced in 15 matches total:
  * `lead_service.py` — 4 references (all in `create_lead` function: line 31 comment, line 32 assignment, line 34 INSERT, line 38 execute)
  * `OC-SEC-001_Website_Security_Assessment.md` — assessment references (documentation only)
  * `OC-SEC-002_Product_Security_Assessment.md` — assessment references (documentation only)
  * `16_Master_Status_Table.md` — status reference (documentation only)
* **No other Python code** references `work_email_hash`
* **No reports, views, or queries** use `work_email_hash` for deduplication
* **No future workflows** depend on it
* **Existing MAP_V2 data:** `work_email_hash` contains identical values to `work_email` (just lowercased). No data loss from dropping column.

**Migration approach:**
```sql
-- Migration: Drop redundant work_email_hash column
-- Safe: column contains identical data to work_email (lowercased copy)
-- No references in code, reports, or queries
ALTER TABLE core.leads DROP COLUMN IF EXISTS work_email_hash;
```

**Rollback approach:**
```sql
-- Rollback: Re-add work_email_hash column
ALTER TABLE core.leads ADD COLUMN work_email_hash VARCHAR(255);
UPDATE core.leads SET work_email_hash = work_email WHERE work_email_hash IS NULL;
```

**MAP_V2 preserved:** No changes to `engineering/MAP_V2`. Migration file lives in `engineering/MAP_V3/sql/schema/`.

---

## 5. Dependencies

| Dependency | Status | Detail |
|---|---|---|
| Tailwind CSS self-hosting (Item 1) | Must complete first | CSP depends on eliminating CDN |
| Client IP preservation (Item 3) | Must confirm before implementing | slowapi `get_remote_address` needs correct client IP |
| Azure SWA redirect verification (Item 5) | Must verify before implementing | Confirm redirect config syntax works |
| OC-SEC-003 (Privacy) | Deferred | Independent work package |
| OC-SEC-004 (Email Security) | Deferred | Independent work package |
| MAP_V2 unchanged | Must preserve | All changes to `engineering/MAP_V3` only |

---

## 6. Test Plan

### Item 1: Tailwind Self-Hosting
* Verify `npm install` succeeds in `Website_Prepared/`
* Verify `npx tailwindcss -i src/input.css -o dist/styles.css` produces valid CSS
* Verify all 6 HTML pages render correctly with compiled CSS (visual comparison)
* Verify no `cdn.tailwindcss.com` references remain in HTML
* Verify all Tailwind utility classes are preserved in compiled output

### Item 2: CSP + Security Headers
* Verify `staticwebapp.config.json` is valid JSON (< 20KB)
* Verify CSP header is returned on all pages (`curl -I https://www.mapnexus.co.uk`)
* Verify no console errors from blocked resources
* Verify Chart.js still loads (whitelisted in CSP)
* Verify Google Fonts still load (whitelisted in CSP)
* Verify `frame-ancestors 'none'` prevents iframe embedding
* Verify forms still submit correctly

### Item 3: Rate Limiting
* Verify `POST /api/v1/leads` returns HTTP 200 for first 10 requests from same IP
* Verify `POST /api/v1/leads` returns HTTP 429 for 11th request within 1 minute
* Verify `GET /api/v1/leads` is NOT rate-limited (list endpoint)
* Verify `POST /auth/login` still has existing 5/minute limit
* Verify legitimate form submission still works after rate limit reset (wait 1 minute)

### Item 4: work_email_hash Removal
* Verify `core.leads` table no longer has `work_email_hash` column
* Verify `POST /api/v1/leads` still creates leads correctly
* Verify duplicate email detection works (if dedup implemented)
* Verify existing lead data is intact (full_name, work_email, etc.)

### Item 5: Azure Hostname Redirect
* Verify `https://blue-forest-0e40c5a03.6.azurestaticapps.net` returns HTTP 301
* Verify redirect destination is `https://www.mapnexus.co.uk`
* Verify `https://www.mapnexus.co.uk` still returns HTTP 200 (no redirect loop)
* Verify no redirect chain (single 301, not 301→301→200)

### Item 6: Rollback Test
* Execute a known change to the deployed website
* Execute rollback via Azure Portal → Deployment history → Promote previous
* Document: time to execute, steps required, success verification
* Capture evidence (screenshot or CLI output)

---

## 7. Rollback Plan

### Item 1: Tailwind Self-Hosting
* **Rollback:** Restore original HTML files with CDN `<script>` tag
* **Risk:** Low — static files, no database changes
* **Evidence:** Git commit history shows original files

### Item 2: CSP + Security Headers
* **Rollback:** Remove or rename `staticwebapp.config.json` (SWA ignores config if file missing)
* **Risk:** Low — headers are additive, removal restores default behavior
* **Evidence:** SWA deployment history

### Item 3: Rate Limiting
* **Rollback:** Remove `@limiter.limit("10/minute")` decorator from `lead_routes.py`
* **Risk:** Low — decorator is additive, removal restores unprotected state
* **Evidence:** Git commit history

### Item 4: work_email_hash Removal
* **Rollback:** Re-add column via rollback SQL (see Section 4)
* **Risk:** MEDIUM — data migration, but column was redundant
* **Evidence:** Rollback SQL documented

### Item 5: Azure Hostname Redirect
* **Rollback:** Remove redirect route from `staticwebapp.config.json`
* **Risk:** Low — redirect is additive
* **Evidence:** SWA deployment history

---

## 8. Evidence Required

| Item | Evidence | How to Capture |
|---|---|---|
| 1 | Compiled CSS file size, visual comparison screenshots | Build output + browser screenshots |
| 2 | `curl -I` showing CSP header, browser console clean | CLI output + browser DevTools |
| 3 | HTTP 429 response on 11th request, HTTP 200 on 1st | curl/Postman test output |
| 4 | `pg_dump` schema before/after, lead creation test | SQL output + API test |
| 5 | `curl -I` showing 301 redirect, 200 on custom domain | CLI output |
| 6 | Rollback execution time, steps, success verification | Documentation + screenshots |

---

## 9. Items Deferred

| Item | Deferred To | Reason |
|---|---|---|
| robots.txt + sitemap.xml | OC-SEC-005 (SEO work package) | Reclassified as SEO, not security |
| Privacy Policy + Cookie Policy + consent + GDPR | **OC-SEC-003** | Separate assessment required |
| SPF + DKIM + DMARC | **OC-SEC-004** | Separate assessment required, investigate email architecture first |
| WAF / DDoS protection | Future cloud deployment architecture | Production-readiness requirement, not soft-launch |

---

## 10. Architectural Decisions Requiring Approval

| Decision | Options | Recommendation | Needs Approval |
|---|---|---|---|
| Tailwind version | v3 (closer to CDN behavior) vs v4 (matches frontend-mvp) | **v3** — simpler for static HTML, no build framework needed | YES |
| Inline event handlers | Keep `onclick` (requires `unsafe-inline` for script-src) vs external JS | **External JS** — eliminates `unsafe-inline` requirement | YES |
| CSP enforcement | Report-Only first vs enforcing immediately | **Report-Only** for 7 days, then enforcing | YES |
| Rate limit key | Per-IP only vs per-IP + per-session | **Per-IP** — simplest, appropriate for anonymous endpoint | NO (already agreed) |

---

**CRITICAL: No remediation from OC-SEC-001 shall be committed or deployed until this revised implementation proposal is returned and explicitly approved.**

**MAP_V2 must remain unchanged. All work within `engineering/MAP_V3`.**
