# OC-REPORT-001 — Report & Analytics Studio
## On-Screen Implementation Summary (shareable)

**Status:** PLAN ONLY — no code, no migrations, no commits.
**Revision:** **v2** — Option B selected. Template architecture strengthened. Built-in deterministic Report Assistant added as a V1 capability.
**Companion doc (full 30-section plan):** `OC-REPORT-001_Report_And_Analytics_Studio_Architecture_and_Implementation_Plan.md`
**Screenshots (v2):** `v2-option-b-dashboard-studio.png`, `v2-report-assistant.png`, `v2-option-c-analysis-workspace.png`, `v2-option-a-canvas-builder.png`

---

## 1. The one-paragraph version

MAP Nexus answers reporting questions with **hard-coded pages** — a 1,117-line Python service containing 14 bespoke report builders over raw `psycopg2`, matched by a ~1,000-line React presenter file. Every new report is a multi-day engineering change. Report & Analytics Studio is an **optional paid add-on** that lets authorised users assemble, save, version, share and export their own reports from MAP Nexus's **already-governed** data — a metadata layer over data that already exists, not a new analytics engine.

---

## 2. Five findings that shape the plan

| # | Finding | Consequence |
|---|---|---|
| 1 | **`export_routes.py` has a live cross-tenant leak** — `batch_id` from the URL, no `verify_batch_tenant`, no `resolve_tenant`. Every other batch endpoint verifies. | **P0, fix first.** Nothing ships before this. |
| 2 | **Report entitlement is enforced nowhere.** `require_entitlement` guards 2 endpoints app-wide, both for `"validation"`. Report access is frontend-only, via a role matrix that **swallows fetch errors and fails open**. | Backend enforcement is a design requirement, not an enhancement. |
| 3 | **The permission vocabulary mostly exists already.** `reports:create/read/update/delete/export` are seeded. `reports:share` and `reports:schedule` do not exist. | Only 2 genuinely new capabilities. Do not invent more. |
| 4 | **4 of 6 seeded roles have zero permission grants** — including Migration Lead and Data Analyst. | A report product with no analyst able to use it is unshippable. |
| 5 | **Entitlement vocabulary drift** between `DEFAULT_ENTITLEMENTS` and the DB plan seed already caused a production outage. The corrective migration exists in docs but not in the repo. | Packaging a paid add-on on this is not viable until re-aligned. |

**Correction to an earlier note:** `reports:view` does **not** exist. There is no read/view duplication. Separately, the live DB has 57 permission rows vs 54 in the seed files — a 3-row unaccounted delta to reconcile.

---

## 3. What already exists (and is reused)

| Reuse as-is | Where |
|---|---|
| `KpiBox`, `ReportCard`, `StatusPill` | `reportWidgets.tsx:21,31,41` — used in 20+ pages |
| **`DataTable`** | `shared/DataTable.tsx:21` — full sortable/paginated table, **built but unused by every report page** |
| `BarList`, `LineChart` | `reportWidgets.tsx:77,117` — need generalising (no axes, hardcoded 0–100) |
| `resolve_tenant`, `verify_batch_tenant` | `dependencies.py:87`, `execution_history_service.py:22` — canonical scope primitives |
| `get_tenant_entitlements`, `require_entitlement`, `check_entitlement` | canonical entitlement layer |
| `TenantFilter`, `TenantContext`, `TenantSwitcher` | Phase C scope plumbing already correct |
| 14 existing report definitions | **Mine the metric definitions. Do not call the code.** |

**Do not reuse:** MAP_V2's ~200 reporting/AI files (unmounted shell; export is an `alert()` stub), `PortalMetadata.ts` (second permission vocabulary with no DB rows), `ReportSuiteService` code, `reportSections.tsx`, `core.role_permissions`.

---

## 4. Decision: Option B, with templates and a built-in assistant

**Option B — Dashboard Studio — is selected for V1.** Options A and C are not discarded; their status changes.

| Option | Status | Rationale |
|---|---|---|
| **B — Dashboard Studio** | **SELECTED for V1** | Best capability-to-effort ratio; maps ~1:1 onto existing components; template-first gives the fastest route to a respectable first report; single filter model is the strongest security story; lowest scope-creep risk |
| **C — Analysis Workspace** | **V2** | Highest-value surface for the Data Analyst persona, and the cheapest of the two non-canvas options. Defers cleanly behind a proven definition model |
| **A — Canvas Builder** | **DEFERRED** | Needs a dnd dependency, a grid coordinate schema and mandatory undo/redo. Not justified for V1, and V1 cannot learn whether users want free-form layout |

### 4.1 Template architecture (V1, strengthened)

Templates are the **default path** in Option B, so they are promoted to a first-class, centrally-maintained surface — not a convenience.

**Templates are metadata, not code.** A template is a versioned, system-owned report definition in the same governed catalogue mechanism as reports and DataSources. **Adding or retiring a template is a data change, not a code change and not a release.**

| Rule | Detail |
|---|---|
| **4–5 templates, hard cap** | Migration Health Weekly · Control Failure Deep Dive · Reconciliation · Executive Status · Governance Posture. Each entitlement-gated. Five is a cap because each is a curation liability — ten half-maintained templates are worse than five good ones |
| **+ blank report** | First-class entry point, not pushed. Templates will not cover every question, and a user with no escape hatch will abandon the product |
| **Instantiate → editable definition** | Instantiating **copies the full definition** into a new user-owned report. The user's copy is entirely editable; the template is untouched. Provenance `(template_key, version)` is recorded and displayed |
| **Pin to template updates** | Pinned by default with one-click unpin. An update is **offered with a diff** and accepted as a new report Version — **never auto-applied** |
| **Entitlement-filtered before display** | No `advanced_reporting` → the Executive Status template is not shown at all, not greyed out. Same single-source catalogue rule for gallery, API and instantiate endpoint |
| **Curation gate = release blocker** | Valid against live DataSources at declared `schema_version`; product-reviewed for correctness *and* whether it is a question customers ask; renders correctly on empty and high-volume data; ships a readable changelog |

**A template that produces a wrong number is worse than no template** — because it is the default path, a defect propagates to everyone who instantiates it.

### 4.2 Built-in Report Assistant (V1, new)

A **deterministic, rules-driven** assistant that turns a short request into a valid, editable report definition. It is **not an AI model** — in v1 or in name. It is a curated recipe catalogue, a weighted keyword matcher, and a small set of constrained questions.

| Property | Consequence |
|---|---|
| **Deterministic** | Same input → same definition, always. Unit-testable, diffable, auditable, reproducible |
| **Vendor-neutral** | No external service, no LLM, no model hosting. Nothing to procure, nothing to audit, **no data leaving the platform** |
| **Zero marginal cost** | No API calls, so no per-report, per-seat or per-tenant cost. The feature cannot become uneconomic at scale |

**How it works — three steps:**

1. **Match a recipe.** Keywords or explicit pick → one curated recipe. The match and the matched-on keywords are **always shown; never applied silently**.
2. **Answer 2–4 questions.** Subject, group by, time window, severity — constrained allowlisted choices, not free text.
3. **Materialise** a full, editable report definition.

**Recipes are data.** `platform.report_assistant_recipes` — adding a recipe is a row, not a code change. Product can grow the assistant's coverage without engineering and without a release. Recipes inherit the same controls as templates: entitlement-filtered, allowlist-validated at publish, curation-gated.

**The assistant is a client of the report-definition API, never a second path to data.** It may emit a candidate definition; it may never write to the database directly. The definition goes through the identical `validate → authorise → save` path as a hand-built one. Every assistant-produced report is marked `origin = assistant` with its `recipe_key` and the user's answers recorded.

This is precisely why the deterministic V1 assistant is the right foundation: **when the AI layer arrives it is a different client of an already-governed API, not a new trust boundary.**

**V1 assistant deliberately does not:** accept free-text filters/formulas/expressions, preview data, infer unexpressed intent, join across sources, reason across tenants, generate narrative, or use any model.

**Naming caution:** calling a rules engine "AI" misleads users and drags in an AI-governance review the feature does not need. Recommend **"Report Assistant"** with determinism stated in-UI. Reserve "AI" for V3, where it is accurate.

### 4.3 Data-layer libraries — none in V1

| Library | Verdict | Rationale |
|---|---|---|
| **Any Python AI library** (transformers, langchain, an LLM SDK) | **Do not add** | The V1 assistant is metadata/rules-driven. There is no inference to perform. It would be dead weight and a supply-chain surface |
| **Plotly** | **Do not add in V1** | V1 renders charts client-side from generalised existing components. Server-side image charts are a V2+ concern |
| **pandas** | **Do not add in V1** | V1 aggregation happens in SQL; result sets are small JSON. pandas would re-implement in Python what the database should do |
| **Polars** | **Defer** | Only if a real case appears where the result set legitimately exceeds what SQL should return — most plausibly V2 matrix/pivot |

This **strengthens** the original position rather than reversing it: aggregation-in-SQL was already the v1 rule, and a deterministic metadata catalogue needs no data-science runtime at all.

### 4.4 V1 / V2 / V3

| Release | Capability | External AI? | API cost |
|---|---|---|---|
| **V1** | 4–5 curated templates · blank report · **built-in deterministic Report Assistant** · template → editable definition | **No** | **None** |
| **V2** | **Richer Analysis Workspace (Option C)** · scatter / matrix / pivot · **more sophisticated assistant** (more recipes, saved user recipes, multi-turn refinement — still no external AI) · scheduling & distribution · customer-grade PDF | **No** | **None** |
| **V3** | **Optional MAP Nexus AI Analyst / Copilot** · customer-selected or BYO LLM · generates Report Studio definitions **through governed tools only** | **Yes, opt-in** | Customer's |

**The invariant governing all three releases:** the assistant — rules-driven or model-driven — is a **client of the report-definition API, never a second path to data.** One validator, no privileged path. If the V3 AI ever gained a direct data path, it would be a separate security work package and would invalidate the design.

**V3 tool set (planning only):** `list_datasources` · `describe_fields` · `validate_definition` · `instantiate_template` · `save_definition`. Never raw SQL, never arbitrary query, never direct table access. Output is always a candidate definition the user confirms; `origin = ai` recorded with model and prompt reference. `ai_insights` already exists as an `enterprise_plus` entitlement, so V3 packaging is largely wiring an existing key.

**V2's "more sophisticated assistant" is not a jump to an LLM** — it is the same architecture with more coverage, still deterministic where it counts and still zero API cost. The value is coverage and refinement, not inference.

---

## 5. On-screen implementation plan (phases)

| Phase | Frontend work | Depends on |
|---|---|---|
| **0 — fixes** | None | R1 leak fix, entitlement re-alignment, role grants, permission delta |
| **1 — data foundation** | None | `DataSourceResolver` + `AggregationEngine` + `definition_validator`. Definition in → governed JSON out, no UI |
| **2 — read-only Studio** | `ReportListPage`, `ReportViewer`, catalogue-driven nav, route guards. Seed hand-authored definitions so it has content on day one | Phase 1 |
| **3 — builder + templates + assistant** | **Option B builder**, `TemplateGallery` (5 templates + blank), `ReportAssistantPanel` (deterministic), `TemplateUpdateBanner`, live preview, draft→published lifecycle, versioning, `ShareDialog`, `ExportMenu`. **No external AI, no AI API cost** | Phase 2 validated on real data |
| **4 — hardening** | Export row caps surfaced, audit trail, `max_rows` enforcement | Phase 3 |
| **V2** | `AnalysisWorkspace` (Option C), scatter/matrix/pivot, richer assistant, `SchedulePage` | V1 proven |
| **V3** | Optional AI Analyst / Copilot, customer-selected or BYO LLM, governed tools only | V2 proven; opt-in |

### New frontend components (V1)

| Component | Purpose |
|---|---|
| `useReportCatalog` | Entitlements/permissions for nav + route guards |
| `useReportDefinition` | Definition fetch + optimistic edits |
| `useReportQuery` | `useQuery` wrapper with tenant + saved + runtime filters |
| `ReportListPage` | Catalogue: mine / shared / published |
| **Builder (Option B)** | The authoring surface |
| `ReportViewer` | Read-only render of a saved definition |
| Component renderers | Generalise `BarList` + `LineChart`; add donut; **wire up the existing `DataTable`** |
| **`TemplateGallery`** | 5 curated templates + blank, entitlement-filtered |
| **`ReportAssistantPanel`** | Deterministic recipe match + constrained questions + definition preview |
| **`TemplateUpdateBanner`** | Pinned/diverged state, diff preview, accept-as-new-version |
| `ShareDialog` | Access management, capability-aware |
| `ExportMenu` | Format selection, gated by `reports:export` |
| Nav integration | Replace hard-coded 8 children with catalog-driven |

### New routes

```
/reports/studio                    → ReportListPage
/reports/studio/new                → TemplateGallery + Report Assistant
/reports/studio/:reportId/edit     → Builder
/reports/studio/:reportId/view     → ReportViewer
/reports/studio/:reportId/versions → Version history
/reports/studio/:reportId/access   → Sharing
```

`/reports/suite/**` is **untouched**. Studio is a sibling, not a replacement.

### Frontend constraints

- **V1: no new dependencies.** No chart library, no dnd, no dataframe library, **no AI/LLM SDK**. Hand-rolled/generalised components only. V2 adds `recharts ^3.9.2` for scatter/matrix/pivot (already pinned in two sibling `package.json` files, currently unused).
- **`TenantContext` scope must be in the `useQuery` key** — switching tenants must not serve stale cross-tenant data. Real hazard given Phase C just introduced scope switching.
- **Guards are usability, not security.** Every guard needs an API that denies independently. The viewer must handle a 403 from `/data` gracefully rather than assuming readability.
- **Template gallery must be entitlement-filtered server-side**, not just hidden client-side.
- **Do not copy** the suite's `fallbackRoleMap` pattern — it fails open.

---

## 6. Security rules that drive the UI

1. **A report read is authorised iff all four hold:** tenant match ∧ object access (owner/shared/published) ∧ `reports:*` capability ∧ **DataSource permission + entitlement**.
2. **Sharing grants visibility, never capability.** A recipient lacking `reports:export` views on screen but gets 403 on export.
3. **A report cannot be shared with a user who lacks the DataSource's permission** — hiding the projection while serving the data would be a bypass.
4. **Every save is also a read** of the DataSource — enforced at save, not just render, or a definition's field list becomes a disclosure channel.
5. **Runtime filters may only narrow, never broaden.** The API intersects; it never replaces. A user must not pass `?status=all` to escape a saved filter.
6. **No unrestricted SQL.** DataSources are an allowlist; enabling one is a platform migration, not a user action.
7. **Saved reports are always tenant-scoped.** No cross-tenant report, ever. Super Admin "All Tenants" is a navigation scope, never a stored one.
8. **Every read / export / share / delete is audited** to a queryable trail.

---

## 7. V1 scope

**In:** **Option B builder** · **4–5 curated templates** · **blank report** · **built-in deterministic Report Assistant** (no LLM, no external AI, no AI API cost) · **template → editable definition** with pin/update semantics · on-screen report · full saved lifecycle (draft/published/archived/versioned/copied/soft-deleted) · tenant isolation + RBAC + source-level re-authorisation · central report catalogue driving nav **and** backend · 8 operational data sources · components: KPI, table, bar, line, donut, score bar · CSV (reuse existing exporter) + Excel (only new formatter) · capability-aware sharing · audit trail.

**Out:** scheduling & distribution (V2) · customer-grade PDF (existing `reportlab` output has a hard `LIMIT 50`) · scatter/matrix/pivot (V2) · **Analysis Workspace / Option C (V2)** · cross-tenant reports (never) · arbitrary SQL (never) · **any external AI or LLM dependency (never in V1)** · **any Python AI library (never in V1)** · **pandas / Polars / Plotly (none in V1)** · **AI API cost (none)** · public/external sharing · template/recipe curation admin UI (V2 follow-on).

---

## 8. Top risks

| Risk | Mitigation |
|---|---|
| **Existing export leak (live)** | Fix as a standalone urgent item, not behind this add-on |
| **Entitlement drift** | Re-align DB seed; add CI assertion that seeded keys ⊆ `DEFAULT_ENTITLEMENTS` keys |
| **4 roles ungranted** | Seed before Studio ships |
| **Sharing as escalation vector** | Rule 3 above, enforced server-side on **every** read |
| **Raw-SQL service pattern is the codebase default** | Make `DataSourceResolver` the only sanctioned path from definition → result |
| **Two tenant-join families** (`batch` vs `control` families differ) | Scope family declared per DataSource; a wrong mapping is a leak |
| **Unbounded results** | `max_rows` mandatory on every component type; cap CSV and surface `truncated` |
| **No queryable admin audit store** | Build one shared table with the deferred E13a work, not two |
| **A wrong template number is worse than no template** | Curation gate as a release blocker (§4.1) — templates are the default path, so a defect propagates to every user |
| **Template/recipe drift from DataSource schema changes** | Validate against `schema_version` at publish; CI check that all templates and recipes still resolve |
| **"Assistant" over-trust** | Position as Recipe Assistant / Quick start; never imply a model. It is a wizard with memory |
| **Scope creep toward "just add AI"** | V1 has no AI dependency by design. The rule: **V1 never gains an external AI call** |

**Discrepancies found:** report catalogue is three-way inconsistent (nav 8 / service 14 / docs 13) · suite gating fails open · `migration_pack` missing from the frontend pack map · two `EmptyState` signatures · two `MetricCard` components · `/reports/templates` and `/reports/distribution` are dead routes · `recharts` + `ag-grid` declared but never imported · `reportlab` PDF silently truncates at 50 rows · `governance/audit` is a projection, not a log.

---

## 9. Founder decisions

| # | Decision | Recommendation | Status |
|---|---|---|---|
| **D1** | Which builder UX? | **B for V1; C → V2; A deferred** | ✅ **DECIDED (v2)** |
| **D2** | Keep the curated Report Suite separate from the Studio? | **Yes** — curated vs exploratory; merging couples two lifecycles | Blocking |
| **D3** | Entitlement packaging | **1 new key** (`report_studio`); map rest onto existing `advanced_reporting` / `enterprise_reporting` / `ai_insights` | Blocking |
| **D4** | Seed `reports:share` / `reports:schedule`? | **share = yes** (Phase 3); **schedule = no** until V2 ships | Blocking |
| **D5** | Chart library in V1? | **None in V1**; `recharts` in V2 | Blocking |
| **D6** | One shared audit table with E13a, or report-specific? | **One shared table** | Gates Phase 4 |
| **D7** | Excel in V1? | **Yes** — only new formatter | Open |
| **D8** | Template curation ownership | **Seed by migration in V1**; product admin UI as a follow-on (V2 priority — templates are the default path) | Open |
| **D9** | Role grants now (Phase 0) or Stage A follow-up? | **Phase 0** | Blocking |
| **D10** | Is PDF in scope? | **Omit in V1** — existing output is not customer-grade | Open |
| **D11** | How many templates in V1? | **4–5**, each entitlement-gated and curation-passed. More is a curation liability, not a feature | Open |
| **D12** | Report Assistant naming | **"Report Assistant"**, determinism stated in-UI. Calling a rules engine "AI" misleads users and drags in an AI-governance review the feature does not need | Open |
| **D13** | Pinned vs diverged template default | **Pinned by default, one-click unpin**; updates offered with a diff, never auto-applied | Open |
| **D14** | V3 AI model hosting | **Customer-selected or BYO, tenant-configured.** No MAP Nexus-operated model by default — required for regulated financial-services adoption | Gates V3 |
| **D15** | Data-layer library policy | **None in V1.** Aggregation is server-side SQL; no Python AI library, no dataframe or server-chart library. Reconsider Polars only for real matrix/pivot | Open |

---

## 10. The V1 acceptance test

> A Data Analyst on an Enterprise tenant opens Report Studio, sees **five curated templates**, picks **Migration Health — Weekly**, adjusts one section, and publishes. They then ask the assistant *"show me failed controls for the last 10 batches"*; it confirms the **matched recipe** and its keywords, asks four **constrained questions**, and produces a **second, fully editable** report. They share the first report with a colleague who **lacks `reports:export`** — the colleague can view it on screen but is refused an export with a 403. A user in a different tenant receives 404 on the report ID. Removing that tenant's `advanced_reporting` makes the read return 403 **and** the nav entry disappear — while a tenant without it is never shown the Executive Status template in the first place.

One path exercising templates, the deterministic assistant, entitlement-filtered discovery, tenant isolation, object access, capability separation, source-level re-authorisation, entitlement enforcement and the catalogue.

---

## 11. If you are ChatGPT and reading this

Option B is now **decided**, so the highest-value critique is no longer "which option" but the decisions layered on top of it. Useful things to stress-test or challenge:

1. **Is the template model right?** Specifically: full-copy-on-instantiate is safe but means pinned reports drift from templates. Is the pinned/diverged split the right reconciliation, or should a template be a live base layer with per-report overrides?
2. **Does a deterministic recipe assistant actually deliver enough value in V1** to be worth building, or is it a novelty that the template gallery already covers? The counter-argument is that "grid by 2-4 questions" is what converts a vague intent into a *correct* definition, which templates cannot do.
3. **Is the "share grants visibility, never capability" rule enforceable in practice** — can rule 3 in §6 (a report cannot be shared with someone lacking the DataSource's permission) be bypassed where the *report* is narrower than the *source*?
4. **Is the curation gate sustainable?** Five templates plus recipes is a permanent product liability, and templates are the default path. Is 4–5 the right cap, and should the curation admin UI be pulled into V1 rather than deferred?
5. **Is one new entitlement key sufficient**, or does that under-segment a real commercial offer now that templates and assistant are separately valuable?
6. **Is Phase 1 (data foundation) correctly sized** relative to Phase 3? Is "viewer before builder" right, or does it delay value too long given the templates and assistant are what users actually feel?
7. **Any risk in the `DataSource` allowlist** I have underweighted — the two tenant-join families, and the fact that a new DataSource is code + migration, not config?
8. **Is deferring all AI to V3 the right commercial call?** Does a deterministic assistant in V1 give away the AI differentiation, or is it a credible on-ramp that makes V3 additive rather than disruptive?
9. **Anything in the existing codebase** that would make the reconciliation in §3 wrong, or that indicates a fourth UI option I have missed?
