# OC-SEC-001 Revised — Website Security Assessment (Revised Remediation Proposal)
**WORK PACKAGE:** OC-SEC-001 | **ID:** OC-SEC-001 | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**REVISION:** Revised per CHATGPT REVIEW — APPROVED WITH CHANGES. No remediation committed until revised proposal returned for review.

---

## 1. CSP Proposal — Refined Against Actual Deployed Dependencies

### Actual CDN Dependencies Audited

| Dependency | Source | Used On | Purpose |
|---|---|---|---|
| Tailwind CSS | `https://cdn.tailwindcss.com` | index.html, contact.html, platform.html, about.html, roadmap.html | CSS framework (dev CDN, not production) |
| Chart.js 4.4.7 | `https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js` | index.html only | Interactive validation charts |
| Google Fonts (Inter) | `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap` | index.html, contact.html | Typography |
| Google Fonts static | `https://fonts.gstatic.com` | (implicit via @import) | Font file hosting |

**No other third-party scripts detected.** No analytics (Google Analytics, Clarity, Hotjar), no tracking pixels (Facebook, LinkedIn), no chat widgets (Intercom, HubSpot), no CAPTCHA (reCAPTCHA, Turnstile, hCaptcha), no A/B testing, no session recording.

### Proposed CSP (per-page, not global)

**For `staticwebapp.config.json` (Azure Static Web Apps):**

```json
{
  "headers": {
    "/**": {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' http://localhost:8080 http://localhost:5173; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    }
  },
  "routes": [
    { "route": "/api/*", "allowedMethods": ["GET", "POST", "PUT", "DELETE"] }
  ]
}
```

### Directive Explanations

| Directive | Value | Why |
|---|---|---|
| `default-src 'self'` | Block by default | Only allow same-origin resources unless explicitly whitelisted |
| `script-src 'self'` + CDN | Tailwind CDN (dev only) + Chart.js | `cdn.tailwindcss.com` is dev-only — should be replaced with self-hosted Tailwind for production. `cdn.jsdelivr.net` for Chart.js is acceptable ( reputable CDN) |
| `style-src 'self' 'unsafe-inline'` + Google Fonts | Inline styles + Google Fonts | Tailwind generates inline styles; Google Fonts CSS required. `'unsafe-inline'` needed for Tailwind's `<style>` blocks |
| `font-src 'self'` + `fonts.gstatic.com` | Google Fonts files | Inter font loaded from Google Fonts CDN |
| `img-src 'self' data:` | Images + data URIs | No external images; `data:` for any inline SVG/data URIs |
| `connect-src 'self'` + localhost | API connections | `self` for production API; `localhost:8080`/`:5173` for dev only — remove in production CSP |
| `frame-ancestors 'none'` | Clickjacking protection | Replaces `X-Frame-Options: DENY` — more modern, CSP-level |
| `base-uri 'self'` | Base tag restriction | Prevents base tag injection |
| `form-action 'self'` | Form submission restriction | Forms can only submit to same origin |

**Note on Tailwind CDN:** `cdn.tailwindcss.com` is explicitly a **development tool** and not intended for production. For production, Tailwind should be self-hosted (compiled CSS). This CSP allows it for now but should be removed after self-hosting is implemented.

---

## 2. Rate-Limiting Investigation for POST /api/v1/leads

### Current State
* `slowapi` is installed and configured in `app/api/main.py` (line 55): `limiter = Limiter(key_func=get_remote_address)`
* `get_remote_address` uses `request.client.host` — standard per-IP keying
* Only `auth_routes.py` applies a limit: `@limiter.limit("5/minute")` on `POST /auth/login`
* `lead_routes.py` has **no `@limiter` decorator** — completely unprotected
* Health endpoints are `@limiter.exempt`

### Is slowapi Appropriate?
**Yes, with caveats:**
* `slowapi` is an in-memory rate limiter — works correctly for single-process FastAPI
* If deployed behind Azure Application Gateway or Container Apps, `get_remote_address` may see the gateway IP for all requests (not client IP). In that case, need `X-Forwarded-For` header parsing
* For the current deployment (localhost:8080 development, no production backend yet), slowapi is appropriate
* For production deployment, consider: (a) Azure API Management rate limiting, (b) Cloudflare rate limiting, or (c) slowapi with `X-Forwarded-For` keying

### Recommended Configuration
* **Key:** `get_remote_address` (per-IP) — correct for anonymous form submissions
* **Limit:** `10/minute` per IP on `POST /api/v1/leads` — reasonable for legitimate form submissions; blocks automated spam
* **Why not 5/minute:** Forms have 7 fields with dropdowns — legitimate users may take time, but 10/minute is generous enough for retries
* **Why not 60/minute:** Too permissive for anonymous endpoint — would allow 1440 submissions/hour/IP
* **Burst:** Allow initial burst of 3, then throttle — slowapi supports `@limiter.limit("10/minute")` with default token bucket

### Production Deployment Note
If deployed behind Azure Container Apps or Application Gateway:
* Configure `X-Forwarded-For` header trust
* Or use Azure API Management for distributed rate limiting
* slowapi remains appropriate for single-instance development

---

## 3. work_email_hash Investigation

### Current Usage
* `lead_service.py` line 31-32: `work_email_hash = work_email  # could be hashed`
* The field is **not actually hashed** — it stores the plain lowercased email
* `core.leads` table has both `work_email` (raw) and `work_email_hash` (identical copy)
* **No deduplication logic exists** — `INSERT` has no `ON CONFLICT` or duplicate check
* **No query uses `work_email_hash`** for deduplication — no `SELECT ... WHERE work_email_hash = ...` anywhere

### Purpose
The field was created for **future deterministic deduplication** — the idea being that if you hash the email, you can compare hashes to detect duplicates without storing the raw email twice. But:
* It's not actually hashed (just lowercased)
* No deduplication logic uses it
* The raw `work_email` is already stored alongside it
* The field is redundant

### Recommended Approach
* **Do not implement crypt hashing** — it would break the ability to contact leads (can't reverse a hash)
* **Use `work_email` directly for deduplication** — it's already lowercased and stored
* **Add `ON CONFLICT (work_email) DO NOTHING`** or a dedup check before INSERT
* **Rename column** from `work_email_hash` to `work_email_normalized` (or drop it entirely since `work_email` is already lowercased)
* **Privacy consideration:** The raw email is necessary for business contact purposes — hashing would serve no practical purpose for a lead capture form where the explicit purpose is to contact the person

### Proposed Change
* SQL migration: `ALTER TABLE core.leads DROP COLUMN work_email_hash;` (column is redundant)
* Python: Remove `work_email_hash` from INSERT query
* Add dedup logic: check `SELECT 1 FROM core.leads WHERE work_email = %s` before INSERT, or use `ON CONFLICT`

---

## 4. Azure Static Web Apps Hostname Accessibility

### Current State
* Production: `https://www.mapnexus.co.uk` (CNAME → `blue-forest-0e40c5a03.6.azurestaticapps.net`)
* Direct Azure hostname: `https://blue-forest-0e40c5a03.6.azurestaticapps.net` — **returns HTTP 200, fully accessible**
* Both hostnames serve identical content
* No redirect from Azure hostname to custom domain

### Risk
The Azure hostname is a predictable pattern (`<color>-<forest>-<hex>.azurestaticapps.net`) and is publicly documented in the CNAME record. Anyone can bypass the custom domain and access the site directly via the Azure hostname.

### Supported Controls
Azure Static Web Apps supports:
* **Custom domain routing** — configured in Azure Portal → Custom Domains
* **`staticwebapp.config.json`** — can add redirect rules to force custom domain
* **No native "disable Azure hostname" option** — Azure always keeps the auto-generated hostname active

### Recommended Approach
Add a redirect rule in `staticwebapp.config.json`:
```json
{
  "routes": [
    {
      "route": "/*",
      "redirect": "https://www.mapnexus.co.uk{0}",
      "statusCode": 301
    }
  ],
  "networkConfig": {
    "allowedIpRanges": []
  }
}
```
This 301-redirects all traffic from the Azure hostname to the custom domain. The Azure hostname remains resolvable but serves no content.

---

## 5. robots.txt / sitemap.xml — Reclassified as SEO

### Reclassification
* `robots.txt` and `sitemap.xml` are **SEO/crawler control**, not security controls
* They do not protect against any attack vector
* They control search engine indexing behavior
* **Reclassified from SECURITY to SEO/NON-SECURITY**

### Proposed (SEO, not security)
* `robots.txt` — allow all crawlers, disallow `/api/` endpoints
* `sitemap.xml` — list all public pages (index, platform, about, roadmap, contact)
* Both are static files deployed alongside the website
* **Priority: LOW** — standard SEO practice, not a security remediation

---

## 6. Follow-Up Assessment: Website Privacy & Data Collection (OC-SEC-003 PROPOSED)

### Data Currently Collected

| Data Point | Source | Storage | Purpose | Retention |
|---|---|---|---|---|
| Full Name | Form (required) | `core.leads.full_name` | Contact lead | Indefinite |
| Work Email | Form (required) | `core.leads.work_email` | Contact lead | Indefinite |
| Company | Form (optional) | `core.leads.company` | Qualify lead | Indefinite |
| Org Size | Form (dropdown) | `core.leads.org_size` | Segment lead | Indefinite |
| Industry | Form (dropdown) | `core.leads.industry` | Segment lead | Indefinite |
| Role | Form (dropdown) | `core.leads.role` | Segment lead | Indefinite |
| Challenge | Form (dropdown) | `core.leads.challenge` | Qualify lead | Indefinite |
| Message | Form (optional) | `core.leads.message` | Context | Indefinite |
| Source Form | Auto | `core.leads.source_form` | Analytics | Indefinite |
| UTM Source | URL param | `core.leads.utm_source` | Marketing attribution | Indefinite |
| Referrer | HTTP header | `core.leads.referrer` | Marketing attribution | Indefinite |

### Privacy Gaps Identified
1. **No Privacy Policy page** — footer links point to `#` (placeholder)
2. **No Cookie Policy** — no cookies used (good), but no notice confirming this
3. **No data retention policy** — leads stored indefinitely
4. **No consent mechanism** — form submission implies consent but no explicit checkbox
5. **No data deletion process** — no way for leads to request deletion (GDPR Article 17)
6. **No third-party data sharing disclosure** — leads are not shared, but no notice confirming this
7. **No analytics** — no Google Analytics, Clarity, or similar (positive for privacy, but no usage data)
8. **No DPO contact** — no Data Protection Officer listed

### Recommended for OC-SEC-003
* Create Privacy Policy page (UK GDPR compliant)
* Create Cookie Policy page (confirm no cookies used)
* Add consent checkbox to lead forms ("I agree to the Privacy Policy")
* Implement lead data retention policy (e.g., 24 months, then anonymize)
* Add data deletion request mechanism (email to DPO)
* Document data processing activities (Article 30 record)

---

## 7. Domain & Email Security Assessment (OC-SEC-004 PROPOSED)

### DNS/Email Configuration
* **Domain:** `mapnexus.co.uk` (Porkbun, 2-year registration)
* **Email forwarding:** `hello@mapnexus.co.uk` → `mapnexus@outlook.com` (Porkbun forwarding, $0)
* **SPF:** Via Outlook EOP (Exchange Online Protection) — Microsoft provides `include:spf.protection.outlook.com` for Microsoft 365 domains. **But:** `mapnexus.co.uk` is not a Microsoft 365 domain — it uses Porkbun forwarding to an Outlook.com address. SPF for forwarded mail is complex (forwarding breaks SPF).
* **DKIM:** Not configured — Porkbun forwarding does not support DKIM signing
* **DMARC:** Not published — no `_dmarc.mapnexus.co.uk` TXT record

### Email Security Risks
| Risk | Severity | Detail |
|---|---|---|
| No SPF record | MEDIUM | Anyone can send email as `@mapnexus.co.uk` — spoofing possible |
| No DKIM signing | MEDIUM | Forwarded mail cannot be verified as authentic |
| No DMARC policy | HIGH | No `p=reject` or `p=quarantine` — spoofed emails delivered to inboxes |
| Forwarding breaks SPF | MEDIUM | Porkbun forwarding to Outlook.com strips SPF results — recipient sees forwarded mail as unauthenticated |

### Recommended for OC-SEC-004
* Publish SPF record: `v=spf1 include:spf.protection.outlook.com -all` (if using Microsoft 365 for actual sending)
* Or: `v=spf1 ~all` (soft fail) if not yet sending email from the domain
* Publish DMARC record: `v=DMARC1; p=quarantine; rua=mailto:hello@mapnexus.co.uk` (monitor first, then reject)
* Consider Microsoft 365 Business ($6/user/month) for proper DKIM/SPF/DMARC instead of Porkbun forwarding
* Add DKIM signing via Microsoft 365 if moving to hosted email

---

## 8. Rollback — Tested vs Available

### Current State
* `Deployment-Instructions.md` documents a rollback procedure: "Go to Deployment history → Select previous working deployment → Promote to production"
* This is an **available capability** in Azure Static Web Apps (deployment history + promote)
* **It has NOT been tested** — no evidence of a rollback being executed
* **No rollback test documented** in any test plan or evidence file

### Reclassification
* Original claim: "deployment rollback via `az staticwebapp deployment list/rollback`"
* Revised: **Available capability, not tested capability**
* Azure Static Web Apps does support deployment history + promote — this is a platform feature, not custom code
* But: no rollback has been performed, so recovery time and success are unverified

### Recommended
* Test rollback by: deploy a change → promote previous deployment → verify revert
* Document actual rollback time and steps
* Add rollback test to deployment checklist

---

## Revised Remediation Summary (Awaiting Review)

| # | Change | Type | Priority | Blocked By |
|---|---|---|---|---|
| 1 | Create `staticwebapp.config.json` with CSP + frame-ancestors + base-uri + form-action | Security | HIGH | — |
| 2 | Add `@limiter.limit("10/minute")` to `POST /api/v1/leads` | Security | HIGH | — |
| 3 | Drop `work_email_hash` column, add dedup on `work_email` | Data Quality | MEDIUM | — |
| 4 | Add redirect rule for Azure hostname → `www.mapnexus.co.uk` | Security | MEDIUM | — |
| 5 | Create `robots.txt` + `sitemap.xml` | SEO | LOW | — |
| 6 | Privacy Policy + Cookie Policy pages + consent checkbox | Privacy | HIGH | OC-SEC-003 |
| 7 | SPF + DMARC DNS records | Email Security | HIGH | OC-SEC-004 |
| 8 | Test rollback, document actual recovery time | Operations | MEDIUM | — |

**No remediation to be committed until revised proposal is returned for review.**

**MAP_V2 preserved unchanged. All changes to `engineering/MAP_V3`.**
