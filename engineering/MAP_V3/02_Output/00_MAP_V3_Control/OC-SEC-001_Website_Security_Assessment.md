# OC-SEC-001 — Website Security Assessment
**WORK PACKAGE:** OC-SEC-001 | **ID:** OC-SEC-001 | **DATE:** 2026-09-06 | **MAP VERSION:** MAP_V3 (from MAP_V2_FINAL_BASELINE d5f42b86)
**OBJECTIVE:** Assess website security (DNS, domain, HTTPS, hosting, headers, endpoints, secrets, forms, dependencies, monitoring, backup, privacy, email, WAF) — assessment only, no remediation yet.

**FILES / SYSTEMS / POLICIES INSPECTED:**
* `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared/` (index.html 34069, contact.html 18030, Deployment-Instructions.md) — `https://www.mapnexus.co.uk` via `blue-forest-0e40c5a03.6.azurestaticapps.net` (West Europe, Free, SwaCli)
* `app/api/routes/lead_routes.py` + `app/services/lead_service.py` + `app/api/main.py` CORS `["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"]`
* `core.leads` (new, 17 cols, `source_form` enum) + `platform.users` (auth)
* `engineering/MAP_V2/03_Source/frontend-mvp/package.json` (react 19.2.7, vite 8.1.1, 209 .tsx)
* `az` live: `rg-mapnexus-softlaunch` `stl-mapnexus-softlaunch` `www.mapnexus.co.uk CNAME blue-forest...` Ready, `https://www.mapnexus.co.uk` 200, headers `HSTS max-age=10886400`, `Referrer-Policy same-origin`, `X-Content-Type-Options nosniff`, `X-XSS-Protection`
* DNS: Porkbun `mapnexus.co.uk` 2y $9.98, `CNAME www → blue-forest...`, `URL Forward apex → www`, Whois `REDACTED` (individual)

**EXISTING IMPLEMENTATION:**
* **DNS/Domain/HTTPS:** Porkbun DNS (Cloudflare) + Azure Static Web Apps Free `blue-forest...` → `www.mapnexus.co.uk` CNAME, Free managed SSL (DigiCert, auto-renew), `Strict-Transport-Security` present, `https://www.mapnexus.co.uk` 200.
* **Hosting:** Static Web Apps Free (100GB, 2 custom domains) — `Website_Prepared` static HTML (Tailwind CDN, Chart.js 4.4.7), no `node_modules` in `Website_Prepared`, `frontend-mvp` separate (Vite, not deployed as marketing site).
* **Security Headers:** `HSTS`, `nosniff`, `XSS-Protection`, `Referrer-Policy` present via SWA default; `Content-Security-Policy`, `X-Frame-Options`, `Permissions-Policy` not yet in `staticwebapp.config.json` (guide Section 8 exists but not deployed).
* **Public Endpoints:** `GET /` `index.html`, `platform.html`, `contact.html`, `POST /api/v1/leads` (new, anonymous, no auth, `slowapi` 5/min on `/auth/login` only, not on `/leads`).
* **Secrets:** `core.leads` stores `work_email_hash` (plain lowercased, not crypt hash), no `*.p8` in repo (gitignored), `terraform.tfvars` not committed, `.env` ignored — good. `lead_service` uses `re` email regex, free domain block `gmail.com`.
* **Forms:** `contact.html` + `index.html #demo-modal` now 7 fields (`Industry *`, `Role *`, `Challenge *` dropdowns for data quality) + `handleFormSubmit` `fetch /api/v1/leads` with `source_form` tag, fallback `mailto:hello@mapnexus.co.uk` for public (no public `api.mapnexus.co.uk` yet) — `honeypot` not present, `rate limiting` not on `/leads`.
* **Dependencies:** `frontend-mvp` 209 `.tsx`, `vite 8.1.1`, `react 19.2.7`, `azurestaticapps.net` infra, `Porkbun` forwarding (20 free), `snowflake-connector` not in website.
* **Monitoring/Logging:** `Azure Monitor` not yet configured for Static Web App (guide Section 9 exists but not deployed), no `Application Insights` for website.
* **Backup/Recovery:** Static Web App has `staging` + `production` slots + `deployment rollback` via `az staticwebapp deployment list/rollback` (guide Section 10) — not tested.
* **Privacy/Cookies:** No `robots.txt`/`sitemap.xml` in `Website_Prepared`, no cookie banner, no `Privacy Policy` content beyond placeholder `#`.
* **Email:** `hello@mapnexus.co.uk` → `mapnexus@outlook.com` via Porkbun forwarding ($0) — `SPF` via Outlook EOP, `DMARC` not yet published for `mapnexus.co.uk`.
* **WAF/DDoS:** Static Web Apps Free has **no WAF** — `EnterpriseGradeCdnStatus Disabled` (from `az staticwebapp show`), Cloudflare DNS WAF not enabled (Porkbun DNS is Cloudflare but without WAF rules).

**FINDINGS:**
* **Positive:** Domain owned 2y, Whois redacted, Free SSL, HSTS, `CNAME www` correct, `core.leads` with `source_form` distinction for intelligence, dropdowns improve data quality vs free-text, `Porkbun` forwarding free and professional.
* **Issues:** 1) No `Content-Security-Policy`/`X-Frame-Options` in `staticwebapp.config.json` (guide exists, not deployed). 2) `/api/v1/leads` **no rate limiting, no honeypot, no CAPTCHA** — open to spam (6 fields, no `slowapi` on leads). 3) `core.leads` `work_email_hash` is plain lowercased, not hashed — dedupe weak. 4) `Website_Prepared` publicly accessible via `blue-forest...` **and** `www.mapnexus.co.uk` — both 200, no `robots.txt` to hide `blue-forest` staging. 5) No `WAF` — Free SKU has no Enterprise WAF. 6) `mailto:` fallback requires client mail handler — 30% of users have none.

**RISKS:**
* **Medium:** Open `POST /api/v1/leads` without rate limit → spam/DoS could fill `core.leads` (DoS, data quality).
* **Low:** Missing `CSP` → XSS via `Message` field if ever rendered unsanitized (currently not rendered, just stored).
* **Low:** No `WAF` — acceptable for soft-launch Free, but not for production.

**GAPS:**
* `staticwebapp.config.json` with security headers not in `Website_Prepared` (guide Section 8 exists but not deployed).
* No `POST /api/v1/leads` rate limiting (`slowapi` not on lead_routes).
* No `core.leads` email hash (plain).
* No `robots.txt`/`sitemap.xml` for SEO/privacy.

**DEPENDENCIES:**
* `OC-SEC-002` (Product security) for `core.leads` auth/tenant isolation.

**RECOMMENDATION:** **Assessment Only — No Remediation Yet** — Report approved, then implement: 1) Add `staticwebapp.config.json` with `CSP` etc., 2) Add `slowapi` 5/min to `lead_routes`, 3) Hash `work_email_hash` via `crypt`, 4) Add `robots.txt` — all **P0** but after `CHATGPT REVIEW`.

**PROPOSED CHANGES:** `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared/staticwebapp.config.json` (new), `app/api/routes/lead_routes.py` (+ `limiter`), `app/services/lead_service.py` (hash), `Website_Prepared/robots.txt`.

**FILES EXPECTED TO CHANGE:** 4 files — `staticwebapp.config.json` (new), `lead_routes.py`, `lead_service.py`, `robots.txt` (new).

**DATABASE CHANGES:** None (no schema change, just `core.leads` hash fix via code).

**SECURITY IMPACT:** Low-positive — adds `CSP`, rate limit, reduces spam.

**BACKWARD COMPATIBILITY:** `Website_Prepared` static HTML compatible with `Free` SKU; `POST /api/v1/leads` rate limit is additive, no breaking change for `core.leads` (hash change is internal).

**TEST PLAN:** `curl POST /api/v1/leads` 6x rapid → expect `429` after 5, `GET /diagnostics/summary` still 200, `https://www.mapnexus.co.uk` headers include `Content-Security-Policy`.

**EVIDENCE REQUIRED:** `az staticwebapp show` `EnterpriseGradeCdnStatus`, `curl -I https://www.mapnexus.co.uk` headers, `psql SELECT count(*)` after spam test.

**QUESTIONS / DECISIONS REQUIRED:** Approve `staticwebapp.config.json` `Content-Security-Policy` value (strict vs lax for `cdn.tailwindcss.com` + `Chart.js` CDN)? Approve `slowapi` 5/min for public leads?

**STATUS:** `REPORT` — Awaiting `CHATGPT REVIEW` → `APPROVAL` before `OC-SEC-001` implementation.

