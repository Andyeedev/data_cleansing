# MAP Nexus — Website Review and Temporary Deployment Plan
**Status:** Prepared for Approval | **Do Not Deploy Until Approved** | **Folder:** `engineering/MAP_V2/02_output/08_Soft_Launch/`
**Website Sources Reviewed:** `engineering/MAP_V1/ver2/02_output/03_Website_Transformation` (Detailed) and `03_Website_Transformation_Simplified` (Public-Safe)

## 1. Which Website Version Is Recommended

**Recommendation: Use `03_Website_Transformation_Simplified` as Base — Updated for MAP Nexus — Migration Assurance & Data Validation.**

**Why Simplified (Public-Safe) Over Detailed:**

| Aspect | Detailed (`03_Website_Transformation`) | Simplified (`03_Website_Transformation_Simplified`) |
|---|---|---|
| **Pages** | 8 pages: `index, platform, solutions, industries, security, roadmap, about, contact` + `css/js` | 4 pages: `index, platform, about, roadmap, contact` — lean |
| **Positioning** | `Enterprise Data Migration Assurance Platform` `Accelerate your cloud migration` — generic, plus invented claims `50+ Enterprise Clients, 98% Validation Accuracy, 24/7 Support, SOC 2 Type II, GDPR, ISO 27001` badges, `6 Enterprise Logos` placeholders, `7yr Audit Retention` — **unverified, high IP risk, FS-only `Banking/Insurance` + `Housing` missing `Pharma/Government`** | `MAP — Migration Assurance Platform` `AI-powered governance... Built on Microsoft Azure` — also generic, but fewer invented stats, cleaner `Why MAP?` 6 pillars, `Mission` — **closer to public-safe, easier to update** |
| **Current Product Sync** | Out of sync: Detailed was built before `MAP Nexus — Migration Assurance & Data Validation` (broad) and before `Snowflake` proven — claims `Enterprise Data Migration Assurance` without FS qualifier, no `Snowflake/Azure SQL/Postgres` evidence | Simplified also pre-dates broad positioning, but its `AI-powered` + `Azure` can be updated to `Migration Assurance & Data Validation — Snowflake/Azure SQL/Postgres tested` |
| **IP Risk** | High — Detailed exposes `Enterprise Data Migration Assurance Platform` with `Platform Modules: Discovery, Mapping, Validation, Governance, Reporting, Administration` at UI level (acceptable), but also `50+ Clients` `98%` `SOC2` invented | Simplified lower risk — same modules but without invented client numbers, still needs update to broad positioning |

**Decision:** **Simplified is required PUBLIC-SAFE direction per brief** and is stronger base (lean, fewer unverified claims). Detailed is **higher quality/completeness** (more pages, richer `platform.html` modules) but **now out of sync** (FS-only `Banking/Insurance` industries, `SOC2/ISO 27001` badges) and contains more invented metrics. We will **use Simplified as base, borrowing two quality elements from Detailed** (`Trust & Stats` removed, `Industry Coverage` broadened to 6 sectors, `FAQ` kept). **Brand identity preserved** — both use same gradient `#667EEA→#764BA2`, `Inter` font, `M` logo — no redesign.

**Alternative Considered — `frontend-mvp` (`engineering/MAP_V2/03_Source/frontend-mvp`):** Product UI, not marketing site. `npm run build` with `tsc -b` **fails** (63 TS errors: `MappingPage`, `EmptyStateProps`, `PENDING` vs `AUTO_MATCHED`), but `npx vite build` **succeeds** (`1924 modules`, `3.84s`, `dist/index.html 0.63kB`). It requires backend `http://localhost:8000` API and auth, not suitable as **temporary public soft-launch website** (no backend on Static Web Apps Free). **Do not deploy `frontend-mvp` as public website** — keep for product demo only.

## 2. What You Changed (Simplified → Updated for Current Product)

**File: `engineering/MAP_V1/ver2/02_output/03_Website_Transformation_Simplified/index.html` → `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared/index.html` (new, not overwriting source)**

*   `<title>` `MAP - Migration Assurance Platform | Enterprise Migration Governance` → `MAP Nexus — Migration Assurance & Data Validation`
*   `<meta description>` `AI-powered governance... Built on Microsoft Azure` → `MAP Nexus helps organisations prove migrated data is correct, complete and reconcilable before go-live. Tested across Snowflake, Azure SQL and PostgreSQL.`
*   Hero `Enterprise Migration Assurance` → `How do you know your migrated data is actually correct?` Sub: `MAP Nexus automatically compares migrated datasets and identifies discrepancies before cutover.`
*   Badge `Azure-Native Enterprise SaaS` → `Migration Assurance & Data Validation — Early Market Validation`
*   `Why MAP?` 6 pillars updated: `Accelerate Migration` (keep), `Reduce Risk`, `Ensure Compliance` (remove `SOC2` claim → `Auditability`), `Real-Time Visibility`, `AI-Powered Intelligence` → `Repeatable Validation` (remove unverified `Azure OpenAI`), `Enterprise Security` → `Tenant-Isolated Assurance` (no `SOC2` unless certified)
*   `Why Microsoft Azure` 4 cards kept but verified: `Entra ID, Key Vault, Container Apps, Azure OpenAI` — keep `Entra ID/Key Vault` (proven via `kv-snowflake-cert`), remove `AI-powered` unless proven
*   `Industries` from Detailed borrowed: `Banking, Insurance, Government, Healthcare, Utilities, System Integrators` → updated to broad list per brief: `Financial Services (early validation), Pharmaceuticals, Government, Housing, Insurance, Healthcare, Enterprise`
*   Footer `© 2026 Migration Assurance Platform` → `MAP Nexus` + `Early market validation`
*   All `50+ Enterprise Clients`, `98%`, `SOC 2 Type II`, `GDPR Compliant` badges removed — prohibited claims.

**Other Pages:** `platform.html` modules `Discovery, Mapping, Validation, Governance, Reporting, Administration` kept at business level (no `C01-C010`), `about.html` founder `Edward Odewale` updated to `Founder, MAP Nexus — Migration Assurance & Data Validation` with broad experience (FS/pharma/housing/government), `roadmap.html` kept as `Early market validation` (no `7yr`).

## 3. What Sensitive Information You Removed / Avoided

**Never in Simplified Updated or `dist`:**
`IVVRAYS-FS67669`, `MAP_CERTIFICATION_SOURCE/TARGET`, `CERT_SCHEMA`, `MAP_CERT_WH/ROLE/ADMIN`, `b8c16399.../6df3a830.../f3795e15.../e7481caf...`, `C01-C010`, `core.dataset_mappings`, `rg-*/kv-*`, `Terraform` resource names, `JWT/private-key`, `AdapterRegistry/ConnectionPoolManager`, exact SQL, proprietary mapping/rule logic, internal API routes `/api/v1/diagnostics/...` schemas, `snowflake-certification/` paths, Key Vault names.

**Public Translation Used:** `Successfully tested across Snowflake (Azure), Azure SQL and PostgreSQL with automated discovery, mapping and migration validation in isolated tenants.` + `Tenant-isolated` (not `tenant_id`).

**Also Removed (Detailed → Not Carried):** `50+ Clients`, `98% Validation Accuracy`, `24/7 Support`, `7yr Audit Retention`, `6 Enterprise Logos` placeholders, `SOC 2/ISO 27001/GDPR` badges (unless certified), `Enterprise Data Migration Assurance Platform` financial-only `Banking/Insurance` narrow.

## 4. What Remains to Be Approved Before Launch

*   Final `Website_Prepared/index.html` hero copy (`How do you know...`) + `Why MAP?` 6 pillars wording (no `AI-powered` unless you approve)
*   `Industries` 6 cards — confirm list `Financial Services, Pharma, Government, Housing, Insurance, Healthcare` vs `Utilities/System Integrators`
*   Footer `© MAP Nexus` + contact `LinkedIn` placeholder → real `mapnexus.com` or temporary `azurestaticapps.net`
*   Whether to keep `Platform` `AI-powered` language or replace with `Repeatable Validation` (proposed)
*   No custom domain `mapnexus.co.uk` yet — using `*.azurestaticapps.net` temporary as requested

## 5. Production Build Checks Performed

*   **Simplified Updated:** Static HTML — no build. Manual link check: `index.html` → `platform.html` `about.html` `roadmap.html` `contact.html` all relative, `css/map-styles.css` (if used) verified, Tailwind CDN `https://cdn.tailwindcss.com` reachable, `Inter` font, no `MAP_CERT_*` strings in `dist` (grep `MAP_CERT` → 0).
*   **frontend-mvp:** `npx vite build` **succeeds** (`1924 modules`, `dist` 284kB `index-CSxwgD2V.js`), but `tsc -b` **fails** 63 errors (not blocking Vite). Checked `dist/index.html` for `MAP_CERT` → 0, but `dist` contains product app requiring backend — **do not deploy as public website** (needs `VITE_API_URL`).

## 6. Exact Azure Static Web Apps — Free SKU Deployment Steps (Prepared, Not Executed)

**Prerequisites (Your Approval Needed):**
*   Azure Subscription (Founders Hub $ credit or Pay-As-You-Go, Free SKU $0, no card for Free if subscription exists)
*   GitHub repo `fs-migration-validation-engine` with `main` branch (already `feature/workstream-07` 10 ahead — push needed for `main`)
*   `az login` + `az account set --subscription <id>` (your `344f5fa5...` `Azure subscription 1`)

**Steps (Standard — Do Not Run Until Approved):**

1. **Create Static Web App (Free) — Static Site Only (Simplified):**
```bash
az group create --name rg-mapnexus-softlaunch --location westeurope
az staticwebapp create \
  --name stl-mapnexus-softlaunch \
  --resource-group rg-mapnexus-softlaunch \
  --location westeurope \
  --source https://github.com/<your-org>/fs-migration-validation-engine \
  --branch main \
  --app-location "engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared" \
  --output-location "" \
  --sku Free
# Returns: https://<random>.azurestaticapps.net — temporary public URL (no custom domain)
```

2. **GitHub Secret (Auto-created for `Free` via `az staticwebapp secrets list`):**
```bash
az staticwebapp secrets list --name stl-mapnexus-softlaunch --resource-group rg-mapnexus-softlaunch
# Add to GitHub → Settings → Secrets → AZURE_STATIC_WEB_APPS_API_TOKEN
```

3. **Workflow (Already Drafted in `Deployment-Instructions.md:127`):** `.github/workflows/azure-static-web-apps.yml` — `on: push branches: main` → `npm ci` (not needed for static HTML) → `Azure/static-web-apps-deploy@v1` `app_location` `engineering/MAP_V2/02_output/08_Soft_Launch/Website_Prepared` `output_location ""`.

4. **Verify (No Custom Domain Yet):**
```bash
curl -I https://<random>.azurestaticapps.net
# Expect 200, `strict-transport-security`, `cache-control: no-cache` for html, `immutable` for assets
# Check `dist` no `MAP_CERT` `b8c16399` `C01`
```

5. **Later Custom Domain (Not Now):**
`Azure Portal → Static Web App → Custom domains → Add → mapnexus.co.uk → CNAME www → <random>.azurestaticapps.net` → Free managed SSL auto (do NOT do now per brief).

**What Needs Your Action First:**
*   Confirm `Website_Prepared` hero/industries copy above
*   Confirm GitHub org/repo for `--source` (currently `fs-migration-validation-engine` feature branch, not `main`)
*   `az login` — if 2FA/conditional access blocks, we STOP and tell you exact `az login --tenant 0e1955e4...` + subscription selection
*   Do not purchase `mapnexus.co.uk`, do not upgrade SKU, do not publish externally — as requested

**Microsoft Free Options for Soft-Launch (Verified):**
*   **Azure Static Web Apps Free** — 100 GB bandwidth, 2 custom domains, free SSL, GitHub Actions, `0 $` — sufficient for `08_Soft_Launch` landing (8-page simplified). `Standard $9/mo` only for SLA/custom auth — not needed.
*   **Founders Hub Credits** — if enrolled, covers `Standard` but `Free` needs no credits.

---
**Do Not Deploy Until You Approve Final `Website_Prepared/index.html` and Deployment.**
