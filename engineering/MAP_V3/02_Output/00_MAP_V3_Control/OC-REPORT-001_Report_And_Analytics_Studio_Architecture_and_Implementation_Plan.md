# OC-REPORT-001 — Report & Analytics Studio
## Architecture, Product and Implementation Plan

**Status:** PLAN ONLY — no code, no migrations, no commits.
**Revision:** **v2** — 27 Sep 2026. Option B selected; template architecture strengthened; built-in deterministic Report Assistant added as a V1 capability. See §0A.
**Prepared:** 2026-09-27
**Response to:** `engineering/MAP_V3/TODO/9_OC-REPORT-001 — Report_And_Analytics_Studio_Architecture_Plan.md`
**Related:** `engineering/MAP_V3/TODO/7_Centralised_Report Entitlement_Subscription_And_Report_Security.md`
**Screenshots:** `OC-REPORT-001_mockups/v2-option-b-dashboard-studio.png`, `v2-report-assistant.png`, `v2-option-c-analysis-workspace.png`, `v2-option-a-canvas-builder.png`

---

## 0A. Decision record (v2)

**Option B — Dashboard Studio — is selected for V1.** Options A and C are not discarded; their status changes.

| Option | v1 status | Rationale |
|---|---|---|
| **B — Dashboard Studio** | **SELECTED for V1** | Best capability-to-effort ratio; maps ~1:1 onto existing components; template-first gives the fastest route to a respectable first report; single filter model is the strongest security story; lowest scope-creep risk |
| **C — Analysis Workspace** | **V2** | Highest-value surface for the Data Analyst persona and the cheapest of the two non-canvas options. Defers cleanly behind a proven definition model |
| **A — Canvas Builder** | **DEFERRED** | Requires a dnd dependency, a grid coordinate schema and mandatory undo/redo. Not justified for V1; V1 cannot learn whether users want free-form layout |

### Four additions made in v2

1. **Template architecture strengthened** (§5A) — templates become first-class, versioned, centrally-maintained metadata with explicit instantiate/update semantics, entitlement filtering, and a curation quality gate.
2. **Built-in deterministic Report Assistant added as a V1 capability** (§5B) — a curated recipe catalogue, vendor-neutral, **no LLM, no external AI dependency, no AI API cost**. It proposes a report definition; it never queries data and never bypasses the DataSource allowlist.
3. **Blank report kept as a first-class V1 entry point** alongside the 4–5 curated templates.
4. **Product roadmap re-cut into V1 / V2 / V3** (§14, §21) with AI pushed to an optional, customer-selected or BYO-LLM V3 capability that generates definitions only through governed tools.

### On Python libraries for the data layer

The recommendation is **not** to add a Python AI library to build the Report Builder. Specifically:

| Library | Verdict for V1 | Rationale |
|---|---|---|
| **Any AI library** (transformers, langchain, sentence-transformers, an LLM SDK) | **Do not add** | The V1 assistant is metadata/rules-driven. There is no inference to perform. Adding a Python AI library to V1 would be dead weight and a supply-chain surface |
| **Plotly** | **Do not add in V1** | V1 renders charts client-side from the existing generalised components. Server-side image charts are a V2+ concern, and Plotly is a heavy dependency for no V1 benefit |
| **pandas** | **Do not add in V1** | V1 aggregation happens in SQL (§10.2); result sets are small JSON. pandas would be re-implementing in Python what the database should do |
| **Polars** | **Defer** | Introduce only if a real V1/V2 case appears where the result set legitimately exceeds what SQL should return — most plausibly the V2 matrix/pivot. Not a V1 dependency |

This **strengthens** rather than reverses the original plan: the v1 position was already "aggregation in SQL, no post-hoc Python aggregation," and the assistant confirms it — a deterministic metadata catalogue needs no data-science runtime at all.

---

## 0. Headline findings

Five findings dominate this plan and change its shape:

1. **There is a live cross-tenant data leak in the existing export API.** `GET /api/v1/execution/export/{batch_id}/csv|pdf` accepts any `batch_id` from the URL and calls neither `verify_batch_tenant` nor `resolve_tenant` (`app/api/routes/export_routes.py:12-47`). Every other batch-scoped endpoint in the codebase does verify. Any authenticated user of any tenant can export any other tenant's control execution data. **This is a P0 and it must be fixed before Report Studio ships anything.**
2. **Report entitlement is not enforced anywhere.** `require_entitlement` guards exactly two endpoints in the entire application, both for `"validation"` (`execution_routes.py:20`, `operations_execution_routes.py:32`). No report, dashboard, governance or admin endpoint checks an entitlement. Report visibility is enforced **only in the frontend**, via a hard-coded role→pack matrix that silently swallows fetch errors (`ReportSuitePage.tsx:41-79`).
3. **The permission vocabulary the brief asks me to design already exists — mostly.** `reports.create/read/update/delete/export` are all seeded. `reports:share` and `reports:schedule` do **not** exist anywhere in the repo. I must not silently add them.
4. **There is no saved-report model at all.** Zero hits for `report_definition`, `saved_report`, `report_version`, `report_share`, `report_schedule` in `app/`. A metadata schema is genuinely required — this is not duplication.
5. **MAP_V2 contains a ~300-file reporting application that is disconnected shell.** A report centre, document viewer, HTML/print framework with 7 templates, a scheduler, a 14-channel distribution centre and a 100-file AI module exist — but are unmounted, and the export is an `alert()` stub. This is the duplication trap this brief warns about. **Recommendation: do not port it.**

---

## 1. Product concept

### 1.1 What this is

Report & Analytics Studio is an **optional paid add-on** that lets an authorised user assemble, save, govern, share and schedule their own reports from MAP Nexus's own governed data — without waiting for MAP Nexus to hard-code a new report page for every question a customer asks.

It is a **metadata layer over data that already exists**, not a new analytics engine.

### 1.2 The problem it solves

Today MAP Nexus answers reporting questions by *hard-coding pages*. `ReportSuiteService` is 1,117 lines of Python containing 14 bespoke report builders (`app/services/report_suite_service.py:36-1117`). `reportSections.tsx` is a matching 1,000-line React file of hand-written presenters. Every new report is:

- a new builder method in a service that issues **raw `psycopg2` SQL**,
- a new method in a React presenter file,
- a new entry in a hard-coded role matrix,
- a new nav item in `navigation_routes.py`.

That is a three-to-five day engineering change per report, and it does not scale past roughly a dozen reports.

### 1.3 The core design bet

**The data is already governed. The presentation is not.**

Every report in MAP Nexus is derived from a small, stable set of governed sources: `engine.migration_control_summary`, `engine.migration_control_execution`, `engine.migration_control_exceptions`, `engine.control_registry`, `engine.migration_batch_registry`, `core.dataset_mappings`, `core.column_mappings`, `core.projects`. Tenant isolation, RBAC and entitlement enforcement already exist and are tested at those endpoints.

So the Studio's job is to let a user **compose a view over an already-authorised source**, and to make the saved composition a first-class, versioned, permission-checked object. If the source enforces the rules, the report inherits them — provided (and only provided) the Studio does not become a way to smuggle an un-authorised query through the front door.

### 1.4 What it is explicitly not

- Not a BI tool. No arbitrary SQL, no query language, no cross-tenant joins, no data warehouse.
- Not a replacement for the existing board packs. The 14 suite sections are curated, opinionated, pre-aggregated output; the Studio is exploratory and user-defined. They coexist.
- Not an AI product. The report definition is designed to be *AI-addressable later*; no AI ships in this package (see §14).
- Not a new permission or entitlement architecture. It consumes the existing one (§7, §9).

### 1.5 Success criteria

A Migration Lead on an Enterprise tenant can, without engineering help, build a "Failed controls by owner, last 10 batches, filtered to CRITICAL+HIGH" report, save it, share it with three colleagues, schedule it to their inbox every Monday, and export it to Excel — and a user in a different tenant who lacks `reports:read` gets a 403 from the API even if they paste the URL.

---

## 2. Existing reporting reconciliation

### 2.1 What exists in MAP_V3 (live, in `app/` + `frontend-mvp`)

| Layer | Artefact | Reality |
|---|---|---|
| API | `report_suite_routes.py` | **2 endpoints only**: `GET /reports/batches`, `GET /reports/suite` |
| API | `validation_report_routes.py` | 9 report-ish endpoints under `/api/v1/execution` (dashboard, risk, compliance, governance decision) |
| API | `governance_routes.py` | 6 endpoints (overview, audit, approvals, exceptions, compliance, reconciliation) — all Tenant Admin+ |
| API | `export_routes.py` | 2 endpoints (CSV, PDF) — **cross-tenant leak** |
| API | `dashboard_routes.py` | 5 read-only portfolio endpoints |
| API | `execution_history_routes.py` | 5 endpoints incl. `/history/{batch_id}/audit` |
| Service | `report_suite_service.py` | 1,117 lines, 14 builders, **raw `psycopg2`**, no ORM, no shared query layer |
| Service | `validation_report_service.py` + repo | Cleanest existing pattern: service + repository over 8 tables/views |
| Service | `export_service.py` | `csv` stdlib + `reportlab` canvas |
| Service | `governance_service.py` + repo | Reads execution-domain tables |
| Dead code | `audit_pack_service.py`, `audit_export.py` | Unrouted; `audit_pack_service` writes local files; `audit_export` uses unqualified legacy table names and only `print()`s |
| FE | `ReportSuitePage.tsx` + `reportSections.tsx` | 13-section nav, permission-gated, batch+tenant selectors, `window.print()` |
| FE | `reportWidgets.tsx` | **6 components**: `KpiBox`, `ReportCard`, `StatusPill`, `BarList`, `ScoreBar`, `EmptyState`, `LineChart` |
| FE | `ReportsPage.tsx` | Legacy per-batch view, 4 raw `apiGet` calls, `isAdmin` string check |
| FE | Nav | `navigation_routes.py:276-359` — 8 children under `/reports` |

### 2.2 Data sources available (the raw material)

Two distinct families, and **they are joined differently** — this is the single most important technical fact for the data-source design:

- **Batch-family** — joins through `engine.migration_batch_registry r JOIN core.projects p ON p.project_id::text = r.project_id WHERE p.tenant_id::text = %s`
- **Control-family** — `engine.control_registry` carries its own `tenant_id` column, filtered directly

`ReportSuiteService` uses both, inconsistently (`_build_audit_pack` filters `cr.tenant_id=%s` while `_build_operational` filters `mbr.tenant_id=%s`; `_resolve_batch` will fall back to a **global latest batch** when `tenant_id` is `None`).

### 2.3 What exists in MAP_V2 (dead, unmounted)

`MAP_V2/03_Source/frontend/src/reporting/` — 5 subsystems, ~100 files:

| Subsystem | Contents | Status |
|---|---|---|
| `centre/` | `ReportHome`, `ReportWorkspace`, `ReportExplorer`, `ReportPreview`, `ReportQueue`, `ReportHistory`, `ScheduledReports`, `SharedReports`, `ReportTemplates`, `ReportSearch`, `ReportFilters` | Unmounted shell |
| `viewer/` | 20-file document viewer: canvas, toolbar, outline, bookmarks, annotations, comments, search, zoom, fullscreen, print preview, properties | Unmounted shell |
| `html/` | Print framework + 7 templates (Executive, Migration, Validation, Governance, Risk, Security, Administration) + 11 section components | Unmounted shell |
| `scheduler/` | 14 components: calendar, timeline, queue, history, logs, statistics, templates, notifications | Unmounted shell |
| `distribution/` | 14 delivery channels (email, teams, sharepoint, onedrive, blob, datalake, portal, api, webhook, ftp, sftp, servicebus, eventgrid) | Unmounted shell |

Plus `MAP_V2/03_Source/frontend/src/ai/` (~100 files) including `ai/report-generator/` (`AIReportGenerator`, `CustomReportBuilder`, `ChartGenerator`, `NarrativeGenerator`, `DataStoryTeller`) and `ai/insights/`.

**Export is a stub:** `reporting/centre/ReportExplorer.tsx:37` calls `alert("... In a real system, this would trigger the Export Engine ...")`.

**Also note:** `MAP_V2/03_Source/frontend/src/portal/metadata/PortalMetadata.ts:27-409` defines a **second, conflicting permission vocabulary** (`dashboard:read`, `analytics:read`, `operations:read/manage`, `security:read/manage`, `ai:read/execute/manage` …) that has **no corresponding rows in `platform.permissions`**. This is frontend-only fiction and must not be treated as the permission model.

### 2.4 Reconciliation verdict

| Question | Answer |
|---|---|
| Is there a saved-report model? | **No.** Nothing exists. Metadata schema is required. |
| Is there a report scheduler? | **No.** `engine.migration_schedules` schedules *migration runs*, not report delivery. |
| Is there a report version/share model? | **No.** |
| Is there an Excel exporter? | **No**, in any form. `openpyxl` appears only in offline root scripts. |
| Is there a client-side chart library in `frontend-mvp`? | **No.** Every chart is hand-rolled SVG or CSS bars. |
| Is there a report entitlement check? | **No.** Frontend-only. |
| Is the existing export tenant-safe? | **No. P0 leak.** |
| Can `ReportSuiteService` be reused? | Its **aggregation logic** can be mined for metric definitions. Its **code** should not — raw SQL, 14 copies of the same join logic. |
| Can the report suite pages be reused? | Yes — as the curated "Board Packs" surface, untouched. |
| Is MAP_V2's reporting a foundation or a trap? | **Trap.** Reuse *concepts* (outline, section taxonomy, template names). Reuse *no code*. |

---

## 3. Proposed report model

Governed SaaS chain, stored as metadata:

```
Report  (the user-facing object: identity, owner, lifecycle)
 └─ ReportDefinition  (immutable snapshot: data source, components, filters, params)
     └─ DataSource     (allowlisted, versioned, tenant-scoped)
     └─ Component[]    (typed visualisation instances + field bindings + config)
     └─ Filter[]       (field, operator, value, scope: user vs saved)
     └─ Parameter[]    (runtime inputs, typed, defaulted)
 └─ Version           (immutable, monotonic, created_by, created_at, diffable)
 └─ Access            (owner / shared-with / published-to-tenant)
 └─ Schedule[]        (optional; V2)
 └─ ExportProfile[]   (optional; V1 formats only)
```

### 3.1 The three-layer rule

This is the load-bearing decision in the whole design.

| Layer | Mutability | Who writes | Versioned |
|---|---|---|---|
| **DataSource** | Changes only via a platform migration | Platform team | Yes |
| **ReportDefinition** | Frozen once a Version is created | End user (via builder) | Yes |
| **Report (shell)** | Lifecycle only — name, status, access | Owner | No |

A saved report is a **pointer to a frozen definition**, never a live query. This means:

- Renaming a report is a cheap shell update; no re-derivation.
- Editing a report creates Version *n+1*; the old version remains reproducible and auditable.
- A report cannot "drift" silently as upstream data changes, because the definition is pinned and `generated_at` is always recorded.
- A definition can be re-pointed at a newer DataSource version, but only explicitly, producing a new Version.

### 3.2 DataSource — an allowlist, not a catalogue

A DataSource is **not** a SQL statement. It is a reference to a pre-registered, governed source:

```
DataSource
  key                ("validation.control_summary")
  schema_version     (int)
  tenant_scope       ("batch_family" | "control_family")  ← see §10.1
  grain              ("batch" | "control" | "entity" | "rule" | "batch_day")
  fields[]           (name, label, type, role: measure|dimension|timestamp, aggregations[])
  access_rule        (which endpoint/service resolves it)
  entitlement        (key required to read it)
  permission         (key required to read it)
```

Enabling a new DataSource is a **platform migration**, not a user action. Users compose from the allowlist. This is the control that makes "no unrestricted SQL" enforceable rather than aspirational.

### 3.3 Component (visualisation instance)

```
Component
  type        ("kpi" | "table" | "bar" | "line" | "pie" | "scatter" | "matrix" | "pivot" | "scorebar" | "barlist")
  title
  bindings    ({ measure, dimensions[], time_axis, series? } resolved against DataSource.fields)
  config      (type-specific: stacked?, orientation?, show_legend?, max_rows?, colour scale…)
  layout      (grid x, y, w, h)
  filter_refs[] (which Filter[] apply)
  rules       (conditional formatting: e.g. fail_rate > 5 → red)
```

### 3.4 Filter — saved vs. user

A critical distinction the brief implies but does not name:

- **Saved filter** — part of the definition; narrows the data for everyone who opens the report.
- **User filter** — runtime overlay; narrows the data for *this viewer only*; never persisted, never widens access.

The invariant: **a user filter may only ever narrow, never broaden.** The API must clamp any runtime filter against the definition's filter and against the caller's entitlements. A user must not be able to pass `?status=all` to escape a saved `status=FAILED` filter. This is enforced server-side by intersecting, never replacing.

---

## 4. Report types

Mapped to the brief's four families, with an explicit V1/later split and a data-source assignment. **Every type below is expressible with the existing governed tables — no new data engineering.**

### 4.1 Visual / analytical (component types)

| Type | Use case | Required shape | Existing component? | Server aggregation? |
|---|---|---|---|---|
| **KPI card** | Single headline number + status tone | 1 measure, optional delta | **Yes** — `KpiBox` | Yes |
| **Table** | Row-level detail, sortable, paginated | dimensions + measures | **Yes** — `DataTable` (currently unused by the suite; all suite tables are hand-rolled) | Yes |
| **Bar / column** | Compare across a category | 1 dimension, 1 measure | **Partial** — `BarList` (label+value only, no axes/series) | Yes |
| **Line / trend** | Movement over time | timestamp + 1–2 measures | **Partial** — `LineChart`, hardcoded 0–100 scale (`reportWidgets.tsx:117`) | Yes |
| **Pie / donut** | Composition, ≤6 slices | 1 dimension, 1 measure | **No** (hand-rolled SVG donut exists only in `DashboardPage.tsx:328-339`) | Yes |
| **Scatter** | Correlation between two measures | 2 measures + 1 dimension | **No** | Yes |
| **Matrix / crosstab** | Measure across two dimensions | 2 dimensions, 1 measure | **No** | Yes |
| **Pivot** | Ad-hoc group/roll-up | 1+ dimensions, N measures | **No** | Yes |

**Honest assessment:** of nine requested component types, the codebase can render **two** properly, two partially, and five not at all.

### 4.2 MAP Nexus operational (V1 — the highest-value set)

| Report | Grain | Primary source | Serves the brief's… |
|---|---|---|---|
| Migration validation | batch | `migration_control_summary` | operational |
| Exceptions register | rule | `migration_control_exceptions` | operational |
| Reconciliation (differences by dataset) | entity × rule | `migration_control_exceptions` | operational |
| Data quality / control outcomes | control | `migration_control_summary` + `control_registry` | operational |
| Governance posture | control | `migration_control_exceptions` | operational |
| Control execution status | control | `migration_control_execution` | operational |
| Execution history / throughput | batch | `migration_batch_registry` | operational |
| Audit trail | execution | `migration_control_execution` | operational |

**Recommended V1 catalogue: these eight.** They cover the brief's operational family, they are all already tenant-scoped in existing services, and they are what a Migration Lead or auditor actually asks for. Estimated coverage of the brief's stated demand: high.

### 4.3 Engineering

| Report | Grain | Primary source | V1? |
|---|---|---|---|
| Schema comparison | dataset/column | `core.dataset_columns` | Later |
| Data profiling | dataset | `core.dataset_mappings` | Later |
| Mapping analysis | mapping | `core.dataset_mappings`, `core.column_mappings` | Later |
| Technical diagnostics | system/connection | connection diagnostics service | Later |
| Execution performance | control | `migration_control_execution.execution_time_seconds` | **V1 candidate** (low marginal cost — column already exists) |

### 4.4 Executive

| Report | Grain | Primary source | V1? |
|---|---|---|---|
| Management summary | batch | composite of the above | **No** — this is the existing Executive Pack's job |
| Migration status | batch | `migration_batch_registry` | **V1 candidate** |
| Risk / issues summary | batch | `v_batch_risk_index` | **V1 candidate** |
| Governance posture | batch | `migration_control_summary` | **V1 candidate** |

### 4.5 The overlap rule (critical)

> **The Studio must not duplicate the 14 curated suite sections.**

`executive`, `operational`, `readiness`, `audit_pack` etc. are opinionated, pre-aggregated, narrative-grade output. The Studio is exploratory. A user who wants a curated board pack uses the existing pages. A user who wants "failed controls by owner across my last 10 batches" uses the Studio.

The Studio therefore sits **alongside** the Report Suite under `/reports`, not inside it. The existing `ReportSuitePage` is not modified.

---

## 5. Builder workflow

The brief specifies 12 steps. I propose reducing them to a **7-step happy path** with the 12 preserved as capabilities, because a 12-step wizard is the reason BI tools get abandoned.

### 5.1 Proposed flow

```
1. START         → pick a starting point: blank, or a template
2. SOURCE        → pick a DataSource from the allowlist (grouped by domain)
3. SHAPE         → pick fields: measures, dimensions, time axis
4. VISUALISE     → pick a component; config panel appears
5. REFINE        → filters (saved), layout, sort, conditional formatting
6. PREVIEW       → live preview with the tenant-scope banner
7. SAVE & GOVERN → name, description, version, access, export formats
```

Then, **only if you want them:** schedule (V2), share/publish.

### 5.2 Step mapping to the brief's 12

| Brief step | Where it lands |
|---|---|
| 1. Select report type | Step 1 (template) — folded into START |
| 2. Select authorised data source | Step 2 — **unchanged, and the security boundary** |
| 3. Select fields/metrics | Step 3 — unchanged |
| 4. Apply filters | Step 5 — moved later, because most users skip it |
| 5. Select visualisation | Step 4 — moved *before* filters, so filters apply to something visible |
| 6. Configure grouping/sorting | Step 5 |
| 7. Preview | Step 6 — unchanged |
| 8. Save | Step 7 |
| 9. Name/version | Step 7 — version is automatic and immutable |
| 10. Assign permissions | Step 7 — but see §7.4: access is *derived*, not hand-assigned |
| 11. Share/publish | Post-save action, not a wizard step |
| 12. Schedule/export | Post-save; schedule is V2 |

### 5.3 Two flow variants (this is exactly where the three UI options differ)

> **Resolved in v2: Option B is selected** (§0A). The variant discussion below is retained for the record.

The single biggest UX fork is **how step 2–4 are presented**:

- **Sequential wizard** (guided, one decision per screen) — best for first-time and infrequent users, worst for power users.
- **Single canvas with live panels** (everything visible, all decisions reversible) — best for power users, higher cognitive load for newcomers.

Option A takes the first. Option B sidesteps the choice with templates. Option C inverts it to be query-first. All three are costed in §27.

> **Resolved in v2: Option B is selected** (§0A). §5A specifies the template architecture that made it the recommendation, and §5B specifies the built-in assistant that makes it self-sufficient in V1.

---

## 5A. Template architecture (V1, strengthened in v2)

Templates are the adoption lever. If a user's first report looks respectable in under a minute, self-service reporting gets adopted; if it starts from a blank canvas, it does not. In v2 templates are promoted from a convenience to a **first-class, centrally-maintained product surface**.

### 5A.1 Templates are metadata, not code

A template is a **versioned, system-owned report definition** held in the same governed catalogue mechanism as reports and DataSources (§17.3). It is data, so:

- **Adding or retiring a template is a data change, not a code change** — the same maintainability property the whole design is built around.
- A template is **immutable once published**; a change produces a new template version.
- A template is **system-owned** — it has no tenant, no owner, and cannot be edited by a user.
- A template is **validated like any other definition** and must pass the curation quality gate (§5A.5) before shipping.

```
platform.report_templates
  template_key PK          ("migration_health_weekly")
  version INT              (monotonic per key)
  display_name, description, category
  definition JSONB         (a full report definition)
  required_data_sources[]  (must be a subset of the allowlist)
  required_entitlements[]  (union with the creating entitlement at use time)
  thumbnail_spec JSONB     (layout skeleton for the gallery card)
  is_active, is_featured
  created_by, created_at, changelog
  UNIQUE (template_key, version)
```

### 5A.2 V1 template set — 4 to 5, curated

Each is deliberately narrow, so that a user who recognises their question gets a correct report immediately.

| # | Template | Answers | Data sources | Gate |
|---|---|---|---|---|
| 1 | **Migration Health — Weekly** | "How is this week's migration doing?" | control_summary, exceptions | `basic_reporting` |
| 2 | **Control Failure Deep Dive** | "Why are controls failing, and whose?" | control_summary, exceptions, control_execution | `basic_reporting` |
| 3 | **Reconciliation** | "Where do source and target differ?" | exceptions (reconciliation projection) | `basic_reporting` |
| 4 | **Executive Status** | "What do I tell the board?" | batch, control_summary, risk_index | `advanced_reporting` |
| 5 | **Governance Posture** | "Are we in control, and what is open?" | control_summary, exceptions, governance_status | `governance` |

**Five is the cap for V1, and the cap is deliberate.** Each template is a curation liability: it must be validated against real data, kept in step with DataSource schema versions, and reviewed when a source changes. Ten half-maintained templates are worse than five good ones.

**Plus one non-template entry point: blank report.** Composing from an empty definition is a legitimate path and is required — templates will not cover every question, and a user with no escape hatch will abandon the product. But it is not the default and the gallery does not push it.

### 5A.3 Instantiate → editable definition

The template/definition boundary is the most important rule in this section:

> Instantiating a template **copies the full definition** into a new Report owned by the user. The user's copy is entirely editable. The template is untouched.

| Property | Behaviour |
|---|---|
| Copy semantics | **Full copy**, not a reference. The user's report never silently changes because a template changed |
| Ownership | New report, new owner, new ID, `draft` status |
| Editability | Total. The user is building *from* the template, not *inside* it |
| Provenance | Recorded: `derived_from_template = (template_key, version)` — displayed in the UI, not hidden |
| Diverge | Allowed and expected. Diverged reports are the normal case, not a mistake |

### 5A.4 Pin to template updates

A report records divergence state, and the user chooses:

| State | Meaning |
|---|---|
| **Pinned** | Report tracks the template. When a new template version ships, the report is offered an update: template delta → **preview diff → accept as a new report Version**. Never applied silently |
| **Diverged** | The user has edited enough that template updates no longer apply cleanly. Updates are no longer offered; provenance is retained for reference |

Pinned-by-default, with a one-click unpin, is the recommendation: it maximises the benefit of upstream template improvement while never taking control away from the user. Merge is **offered, never automatic** — a template update must never be able to silently alter someone's published report.

### 5A.5 Entitlement filtering and the curation gate

Two things make templates trustworthy:

1. **Templates are filtered by the viewer's entitlements before display.** A tenant without `advanced_reporting` is not shown the Executive Status template at all — not greyed out, not shown. This is the same single-source catalogue rule as §17.3, and it must hold for the gallery, the API, and the instantiate endpoint.
2. **Every template ships only after passing a curation gate**: valid against the live DataSources at its declared `schema_version`; reviewed by product for correctness *and* for whether it is a question customers actually ask; rendering correctly against a realistic dataset including empty and high-volume cases; carrying a `changelog` a user can read before accepting an update.

**A template that produces a wrong number is worse than no template.** Because templates are the default path, a defect propagates to every user who instantiates it. This is why the gate is a release blocker, not a review step.

### 5A.6 What templates must never do

- Never bypass entitlement filtering (§5A.5).
- Never introduce a DataSource outside the allowlist — `required_data_sources[]` is validated against it at template publish time.
- Never carry a tenant predicate in the definition.
- Never be mutated in place — new version, always.
- Never auto-apply an update to a user's report.

---

## 5B. Built-in Report Assistant (V1, added in v2)

### 5B.1 What it is

A **deterministic, rules-driven assistant** that turns a short user request into a valid, editable report definition.

It is **not** an AI model — not in v1, and not in name. It is a curated recipe catalogue, a weighted keyword matcher, and a small set of constrained questions. Three properties follow, and all three are the point:

| Property | Consequence |
|---|---|
| **Deterministic** | Same input always produces the same definition. Fully unit-testable, diffable, auditable, reproducible |
| **Vendor-neutral** | No external service, no LLM, no model hosting. Nothing to procure, nothing to audit, no data leaving the platform |
| **Zero marginal cost** | No API calls, so no per-use and no per-seat cost. The feature cannot become uneconomic at scale |

The V1 assistant therefore costs **nothing per report** and introduces **no AI supply chain**. That is exactly why it is a V1 capability and the AI Analyst is V3 (§14).

### 5B.2 How it works — three steps

```
1. MATCH A RECIPE       keywords / explicit pick → one curated recipe (always shown, never silent)
2. ANSWER 2–4 QUESTIONS  subject, group by, time window, severity — constrained choices, not free text
3. MATERIALISE          produce a full, editable report definition
```

Step 1 needs care. The matcher **always displays which recipe matched and on what**, and the user confirms or changes it. A silent inference would make the assistant feel magical and untrustworthy in equal measure; a confirmed match feels like a shortcut and stays auditable.

### 5B.3 The recipe catalogue — recipes are data

```
platform.report_assistant_recipes
  recipe_key PK           ("migration_health_weekly")
  display_name
  keywords[]              (ordered, weighted — "failed", "controls", "weekly", "owner")
  questions JSONB         (ordered: id, prompt, type=choice, options[], default)
  resulting_template_key  (usually instantiates a template from §5A.2)
  required_data_sources[]
  required_entitlements[]
  is_active, priority, created_at
```

**Adding a recipe is a row in this table, not a code change** — the same maintainability property as templates and the report catalogue. This is the payoff of doing the assistant as metadata rather than code: product can grow the assistant's coverage without engineering and without a release.

Because recipes are data, they inherit the same controls: entitlement-filtered before display, validated against the DataSource allowlist at publish time, and subject to the curation gate (§5A.5).

### 5B.4 The three steps, mapped to the security model

| Step | What the assistant may do | What it may never do |
|---|---|---|
| **Match** | Look up a recipe row; show the match and its keywords | Infer silently; match a recipe the caller is not entitled to |
| **Questions** | Offer constrained, allowlisted choices | Accept free text as a filter, field, table, or expression |
| **Materialise** | Emit a candidate definition | Write to the database — the definition goes through the same `validate → authorise → save` path as a hand-built one |

**The assistant is a client of the report-definition API, never a second path to data.** This is the identical invariant that governs the V3 AI Analyst (§14.3), and it is precisely why the V1 assistant is the right foundation: when the AI layer eventually arrives, it is a *different client of an already-governed API* rather than a new trust boundary.

Every assistant-produced report is **marked `origin = assistant`** and records its `recipe_key` and the user's answers. Two reasons: an audit can always tell how a report was made, and a defect in one recipe can be traced to every report derived from it.

### 5B.5 What the assistant deliberately does not do in V1

- No free-text filters, formulas, or expressions.
- No data preview **by the assistant** — the user previews inside the builder, through the normal authorised path.
- No inference of intent the user did not express.
- No cross-source joins, no cross-tenant reasoning, no narrative generation.
- No model of any kind.

Each of those is either a V2 assistant improvement or a V3 AI capability (§21), and each is additive.

### 5B.6 V2 assistant evolution — still no external AI

V2's "more sophisticated assistant" is **not** a jump to an LLM. It is the same architecture with more coverage:

- More recipes, including multi-source and governance recipes.
- Optional user-saved "assistant recipes" — save a question-and-answer pattern and reuse it.
- Multi-turn refinement: after materialising, "make it last 30 batches" or "group by control instead" re-derives **within the same constrained-choice model** by re-running the recipe with changed parameters.
- Free-text *intent* parsing via a rule/lexicon layer, still with confirmed matches.

Still deterministic where it counts, still zero API cost, still no data leaving the platform. The value is coverage and refinement, not inference.

### 5B.7 Effort and risk

The V1 assistant is **small**: one catalogue table, one seed set of recipes, a weighted keyword matcher, a constrained-question renderer, and a call into the existing `definition_validator` + instantiate path. It reuses the template architecture entirely — most recipes materialise a template and override a few parameters.

Its risks are ordinary product risks, not technical ones:

| Risk | Mitigation |
|---|---|
| Poor keyword match frustrates the user | Always show the match; allow explicit template pick; the gallery is a first-class path that does not require the assistant at all |
| Recipe drift from DataSource schema changes | Recipes validated against `schema_version` at publish; CI check that all recipes and templates still resolve |
| Users over-trust "assistant" framing | Position it as **Quick start / Recipe Assistant** in V1 copy. It is a wizard with memory, and the UI should not imply a model it does not use |
| Scope creep toward "just add AI" | V1 has no AI dependency by design; the V3 path is additive and opt-in. The rule is that V1 never gains an external AI call |

---

## 6. Saved-report lifecycle

### 6.1 Statuses

```
draft ──► published ──► archived
  │           │            │
  └───────────┴────────────┴──► deleted (soft, 30-day purge)
```

| Status | Visible to | Editable | Schedulable | In nav |
|---|---|---|---|---|
| `draft` | owner only | Yes | No | No |
| `published` | per Access model | New version only | Yes (V2) | Yes |
| `archived` | per Access model | No — restore only | No | No |
| `deleted` | owner (restore window) | No | No | No |

**Why `draft` is not merely a boolean flag on `published`:** a builder that forces you to name, version and permission a report before you have seen it work will not be used. Drafts are private by construction.

### 6.2 Operations

| Operation | Rule | Enforcement |
|---|---|---|
| **Create** | Owner = creator; tenant = creator's tenant; status = `draft` | Server |
| **Rename / re-describe** | Shell-only edit; does **not** create a Version | Server |
| **Edit definition** | Creates a new immutable Version; previous stays reproducible | Server |
| **Version** | Monotonic integer per report; auto-increment; no gaps | Server |
| **Duplicate / copy** | New Report, new owner, new ID, identical definition snapshot | Server |
| **Share** | Grants access; never grants *capability* (§7.4) | Server |
| **Publish** | `draft` → `published`; requires `reports:update` | Server |
| **Archive** | Hides from nav; data and history retained | Server |
| **Delete** | Soft delete + 30-day restore, then hard purge | Server |
| **Restore** | Within 30 days | Server |

### 6.3 Can existing tables support this?

**No — and this is now justified rather than assumed.** Reconciliation (§2) established there is no saved-report, definition, version, share or schedule table anywhere in `app/` or in the migrations. `platform.approval_requests` is a workflow queue, not a report store. `core.role_permissions` is a read-only compatibility pack and must not be extended.

A new `platform`-schema metadata set is required. Schema design is deferred to §17 and **requires a separate migration work package** — not this one.

---

## 7. Permission model

### 7.1 The existing vocabulary — checked, as instructed

The brief asked me to determine appropriate capabilities. Checking the seed first, as the brief requires:

`MAP_V2/03_Source/database/seed_platform_data.sql:88-93` — **`reports` resource already has five actions:**

| Capability | Status | Note |
|---|---|---|
| `reports:create` | **EXISTS** | Seeded |
| `reports:read` | **EXISTS** | Seeded |
| `reports:update` | **EXISTS** | Seeded |
| `reports:delete` | **EXISTS** | Seeded |
| `reports:export` | **EXISTS** | Seeded; already bridged to `advanced_reporting` |
| `reports:share` | **DOES NOT EXIST** | Proposal only |
| `reports:schedule` | **DOES NOT EXIST** | Proposal only |

**Correction to a prior working assumption:** an earlier reconciliation note in this workstream recorded that `reports:view` existed with duplicate rows. That is **wrong** — a full-repo search for `reports:view` / `reports.view` returns zero matches. There is no `read`/`view` duplication. The live database holds 57 permission rows while the two seed files define 54; the 3-row delta is **unaccounted for and must be reconciled before this add-on is designed against the catalogue.**

### 7.2 The seven-role problem

Four of the six seeded system roles have **zero permission grants**: Migration Lead, Data Analyst, Team Member, Viewer (`seed_platform_data.sql:9-15`; only Super Admin and Tenant Admin are granted, by the base seed and the Stage A delta).

This is disqualifying for a report product. The personas that matter most here are *exactly* the ungranted ones:

| Role | Grants today | Studio need |
|---|---|---|
| Migration Lead | **0** | `reports:read`, `reports:create`, `reports:update`, `reports:export` |
| Data Analyst | **0** | `reports:read`, `reports:create`, `reports:update`, `reports:export`, `reports:share` |
| Viewer | **0** | `reports:read` |
| Team Member | **0** | `reports:read` (probably) |

**A Report Studio with no analyst able to use it is not shippable.** Seeding these four roles is a **prerequisite**, not a nice-to-have — and it is a Stage A-style delta migration, separate from this work package.

### 7.3 Proposed capability mapping — no new architecture

| Capability | Maps to | Studio meaning |
|---|---|---|
| `reports:create` | existing | Create a report / draft |
| `reports:read` | existing | View a report you can access |
| `reports:update` | existing | Edit definition, publish, archive, rename |
| `reports:delete` | existing | Delete own; delete any (if granted) |
| `reports:export` | existing | Trigger any export |
| `reports:share` | **new — requires approval** | Share a report with other users |
| `reports:schedule` | **new — V2, requires approval** | Create a delivery schedule |

The only two genuinely new capabilities are `reports:share` and `reports:schedule`. Both are needed, and I recommend seeding `reports:share` in the same delta as the role grants; `reports:schedule` can wait until V2 actually ships, since a permission nobody can exercise is inventory debt.

### 7.4 Sharing does not grant capability — the anti-privilege-escalation rule

> Sharing a report gives a recipient **visibility of a result**, never the **ability to re-derive, widen or export it**.

Concretely, a recipient who lacks `reports:export` can view a shared report on screen but cannot export it. A recipient who lacks `reports:read` for the underlying DataSource **cannot be shared the report at all** — because a saved report is a projection of that source, and hiding the projection while serving the same data through a saved object would be a permission bypass.

This is the single most important security rule in the design, and it directly answers the brief's requirement: *"A user saving a report must not make its underlying data accessible to another user who would otherwise lack permission."*

**Enforcement: on every report read, evaluate the caller's effective permissions against the DataSource's required permission/entitlement — not just against the report's own ACL.** Shared or not, the request is evaluated identically.

---

## 8. Tenant and security model

### 8.1 The enforced invariant

> A report read is authorised **iff** all four hold:
> 1. Tenant: caller's resolved tenant == report's tenant (Super Admin may override via `resolve_tenant`, as everywhere else).
> 2. Object: caller is owner, or has an Access grant, or the report is published to their tenant.
> 3. Capability: caller holds the required `reports:*` permission for the operation.
> 4. Source: caller holds the DataSource's permission **and** the tenant's entitlement for it.

**Every save is also a *read* of the DataSource.** If you cannot read the source, you cannot build a report over it — enforced at definition-save time, not only at render time. Otherwise a user could persist a definition containing field references they are not entitled to see, and the definition itself would become a disclosure channel (a column list is information).

### 8.2 Tenant scope must be part of the DataSource, not the report

The two join families in §2.2 differ. A DataSource declares which one it uses, and the server always supplies the tenant predicate. **A report definition can never contain a tenant predicate** — a user cannot hard-code `tenant_id`, and cannot pass one that overrides the server's.

A saved report is **always** tenant-scoped: it belongs to the tenant of the batch/project/control family it queries. There is no cross-tenant report. Super Admin's "All Tenants" scope applies at *navigation* (it lists reports across tenants) and is never a stored scope.

### 8.3 The P0 that must be fixed first

`app/api/routes/export_routes.py:12-47`:

```python
@router.get("/{batch_id}/csv")
def export_csv(batch_id: str, current_user=Depends(get_current_user_with_tenant)):
    csv_data = export_service.export_csv(batch_id)   # ← batch_id straight from the URL
```

`get_current_user_with_tenant` (`dependencies.py:63-84`) only asserts the JWT carries a `tenant_id`. It does **not** verify the batch belongs to it. Compare `validation_report_routes.py:139-142` and `execution_history_routes.py:51-55`, which both call `verify_batch_tenant` first, and `report_suite_routes.py:34-53`, which does the same for the suite.

**Impact:** any authenticated user of any tenant can read any other tenant's `engine.migration_control_execution` rows via CSV, and the same via PDF.

**Required before any Studio work:** add `ExecutionHistoryService.verify_batch_tenant(batch_id, current_user["tenant_id"])` to both endpoints and return 404 on foreign batch (matching the existing convention — 404, not 403, so the API does not confirm the batch exists). Also fix the unbounded CSV (§12.3).

This is tracked separately as **OC-REPORT-001-R1** and should be treated as a standalone security fix, not blocked behind the add-on.

### 8.4 Other boundary weaknesses to carry into the design

| Finding | Location | Relevance to Studio |
|---|---|---|
| Report gating is frontend-only, swallows errors | `ReportSuitePage.tsx:41-79` | The Studio must not copy this pattern |
| No report endpoint checks an entitlement | whole app | §9 must be enforced at the Studio API |
| `/monitoring/alerts` global, any role containing "admin" | `monitoring_routes.py:11-15` | Not a Studio data source |
| Control CRUD is global, `require_admin` | `control_routes.py:63,86,100` | Out of scope; do not reuse as a source |
| No queryable admin audit store | — | A Studio needs a `report_audit` trail; see §17.4 |

---

## 9. Entitlement and add-on model

### 9.1 The existing model, checked first

`app/middleware/entitlement_middleware.py` — `DEFAULT_ENTITLEMENTS` defines **21 keys** across three tiers:

| Tier | Reporting-relevant keys |
|---|---|
| `professional` | `basic_reporting` |
| `enterprise` | `advanced_reporting`, `audit_trail`, `governance`, `reconciliation` |
| `enterprise_plus` | `advanced_reporting`, `enterprise_reporting`, `advanced_governance`, `enterprise_governance`, `ai_insights`, `custom_integrations`, `multi_region`, `sla` |

The reporting ladder is **already well-shaped**: basic → advanced → enterprise. `PERMISSION_ENTITLEMENT` (`rbac.py:15-17`) already contains exactly one mapping, `reports.export → advanced_reporting`, and `role_service.py:285-292` uses `check_entitlement` to stop a non-Super-Admin from *granting* a permission whose entitlement they lack.

**That is a real foundation. Use it. Do not replace it.**

### 9.2 The drift that must be fixed before packaging

The DB seed `OC-COM-001a_commercial_schema.sql:31-42` seeds plan entitlements in a **completely different vocabulary**:

| Middleware (`DEFAULT_ENTITLEMENTS`) | DB seed (`platform.plans.entitlements`) |
|---|---|
| `validation`, `mapping`, `discovery` | `migration`, `data_quality`, `discovery` |
| `basic_reporting`, `advanced_reporting`, `enterprise_reporting` | `reporting: "basic"`, `reporting: "advanced"` |
| `email_support`, `priority_support` | `support: "standard"`, `support: "priority"` |
| `audit_trail`, `governance`, `reconciliation` | *(absent)* |

**This has already caused a production outage.** A route gated on `require_entitlement("migration")` — a key that existed only in the DB seed — became unreachable for every tenant. It is documented in `_e2e_results.txt:151-163` and was fixed by switching the route to `"validation"`. The middleware was updated; **the DB seed was never re-aligned, and the corrective migration documented in the Phase 3/4 evidence packs does not exist in the repo.**

`get_tenant_entitlements` (`entitlement_middleware.py:36-56`) resolves the *latest subscription's* `entitlements` dict if present, else falls back to `DEFAULT_ENTITLEMENTS[tier]`. So today a tenant gets one vocabulary or the other depending on which row wins — meaning **`advanced_reporting` may or may not be present on an Enterprise tenant that is paying for it.**

> **Packaging a paid add-on on top of a vocabulary that is known to be unstable is not viable.** Entitlement realignment is a **prerequisite**, tracked as **OC-REPORT-001-R2**.

### 9.3 Recommended add-on packaging — extend, never invent

The brief asks to consider five separable capability groups. My recommendation is that **three of the five already exist** and only two are genuinely new:

| Brief's group | Disposition | Entitlement |
|---|---|---|
| **Report Studio** (self-service building) | **NEW** | reuse `basic_reporting`? **No** — needs its own gate |
| **Advanced Analytics** (scatter/matrix/pivot) | **NEW** | `advanced_reporting` already exists and is the natural home |
| **Engineering Reports** | **NEW** | fold into `advanced_reporting` for V1 |
| **Report Distribution/Scheduling** | **NEW** | `enterprise_reporting` is the natural home (V2) |
| **AI-assisted Analytics** | Already provisioned | `ai_insights` **already exists** on `enterprise_plus` |

**Recommendation:** introduce exactly **one** new entitlement key, `report_studio`, and place it on `enterprise` and `enterprise_plus`. Map the rest onto the existing three:

- Creating/editing any Studio report → `report_studio`
- Using scatter/matrix/pivot → `advanced_reporting` (existing)
- Scheduling/distribution → `enterprise_reporting` (existing)
- AI features → `ai_insights` (existing)

**One new key, not five.** The brief's five-way split is the right *product* segmentation but the wrong *schema* segmentation; over-splitting the entitlement set is what produced the current drift. Founder decision **D3** (§28).

### 9.4 Entitlement must be checked at the Studio API, per DataSource

Not once per report — **per DataSource per request.** A report may aggregate two sources at different tiers (e.g. control summary at `advanced_reporting`, audit trail at `audit_trail`). The endpoint computes the union of required entitlements across the definition's sources and requires all of them. A report is not "partially entitled" — it is either renderable or 402/403.

---

## 10. Data-source architecture

### 10.1 The tenant-scope declaration (the subtle one)

Because the batch-family and control-family tables are joined to tenants by different paths (§2.2), **every DataSource must declare its scope model** and the server must apply the correct predicate. This is not cosmetic: getting it wrong is a cross-tenant leak, and `ReportSuiteService` currently does it two different ways.

```python
BATCH_FAMILY = "engine.migration_batch_registry r JOIN core.projects p ON p.project_id::text = r.project_id WHERE p.tenant_id::text = %(tenant)s"
CONTROL_FAMILY = "engine.control_registry cr WHERE cr.tenant_id = %(tenant)s"
```

### 10.2 The query pipeline

```
ReportDefinition
  → resolve DataSource(s) by key + schema_version        (allowlist; reject unknown)
  → apply server tenant predicate (never from the definition)
  → intersect saved filters with caller's user filters     (narrow-only, §3.4)
  → apply parameter substitutions (typed, validated, allowlisted operators)
  → build aggregation from component bindings              (server-side, not post-hoc)
  → execute against the governed source                    (parameterised; read-only)
  → post-process: conditional formatting rules, max_rows
  → shape response { meta, series[], columns[], rows, truncated }
```

**Aggregation must happen in SQL.** Fetching rows and aggregating in Python would be correct-but-futile at scale and would re-create the raw-SQL-in-a-handler pattern that produced the current 1,117-line service. Aggregations are restricted to a fixed allowlist (`count`, `sum`, `avg`, `min`, `max`, `count_distinct`, `pass_rate`, `fail_rate`) — no SQL expressions, no `CASE` injection, no user-supplied functions.

### 10.3 The shared query layer — mandatory, not optional

`ReportSuiteService` already demonstrates the failure mode: 14 builders, raw `psycopg2`, the same three-table join re-derived roughly a dozen times, inconsistent tenant predicates, hardcoded control metadata (`ctrl_meta C01..C010` at `:215-226` and `:912-995`).

**The Studio requires exactly one new component: a governed `DataSourceResolver` + `AggregationEngine`.** Its explicit job is to become the *only* sanctioned path from a report definition to a result set, so that:

- tenant predicates are written once,
- the operator/aggregation allowlist is enforced once,
- every query is parameterised and read-only,
- it is testable in isolation against the §7.4 escalation case.

The existing `validation_report_service.py` + repository pattern is the closest thing to the right shape in the codebase and should be the template.

### 10.4 V1 DataSource allowlist (proposed, 8 sources)

| Key | Grain | Tables | Scope family |
|---|---|---|---|
| `migration.batch` | batch | `migration_batch_registry` | batch |
| `migration.control_summary` | batch × control | `migration_control_summary`, `control_registry` | batch |
| `migration.control_execution` | control | `migration_control_execution`, `control_registry` | batch |
| `migration.exceptions` | rule | `migration_control_exceptions`, `control_registry` | batch |
| `migration.governance_status` | batch | `migration_governance_status` | batch |
| `migration.risk_index` | batch | `v_batch_risk_index` | batch |
| `migration.reconciliation` | entity × rule | `migration_control_exceptions` | batch |
| `core.mapping_coverage` | dataset / column | `dataset_mappings`, `column_mappings` | batch |

Every one is already tenant-scoped in an existing service. **Zero new data engineering required for V1.**

---

## 11. Visualisation architecture

### 11.1 Principle: reuse first, add only what earns its place

The brief says *"do not create a chart catalogue without purpose."* The reconciliation shows the codebase can already render 2 of the 9 requested types. So:

| Decision | Rationale |
|---|---|
| **Reuse `KpiBox`, `ReportCard`, `StatusPill`, `DataTable` as-is** | Zero cost, already used across ~20 pages |
| **Generalise `BarList`** | Add axes/series/orientation; it is label+value-only today (`reportWidgets.tsx:77`) |
| **Generalise `LineChart`** | Remove the hardcoded 0–100 axis; support multi-series, nullable gaps |
| **Add pie/donut** | Reuse the hand-rolled SVG approach from `DashboardPage.tsx:328-339` |
| **Add scatter, matrix, pivot** | **V2.** Each needs real charting capability and carries real cost |
| **Do not add a chart library for V1** | `frontend-mvp` has no chart dependency. Adding `recharts` is a **founder decision (D5)**, not a default — see below |

### 11.2 The chart-library decision

`frontend-mvp/package.json` has **7 dependencies, zero of them charting**. Every chart is hand-rolled SVG or CSS bars.

Elsewhere in the repo, `recharts ^3.9.2` and `ag-grid-community/ag-grid-react ^36.0.0` are declared in `MAP_V2/03_Source/frontend/package.json` and `MAP_V3/03_Source/frontend/package.json` — but **zero imports of either anywhere in the source.** They are declared and unused.

Hand-rolling a scatter or a pivot in raw SVG is a mistake. Hand-rolling the *three* V1 chart types on top of the existing components is defensible. So:

- **V1: no new dependency.** Generalise the two existing components; add donut in the existing style. This keeps the bundle small and matches the codebase's established pattern.
- **V2 (scatter/matrix/pivot): adopt a library.** `recharts` is the lowest-friction candidate — already version-pinned at `^3.9.2` in two sibling package.json files, so it is at least a known-compatible major.

Founder decision **D5** (§28). If the founder prefers a library from V1, the V1 estimate grows and the "no new deps" property is lost.

### 11.3 Component-type contract

Every component type must declare, per the brief:

| Field | Example (`bar`) |
|---|---|
| `use_case` | Compare a measure across a category |
| `required_data_shape` | `{ dimension: string, measure: string, series?: string[] }` |
| `existing_component` | `BarList` (partial) |
| `server_aggregation_required` | Yes |
| `min_points / max_points` | 1 / 50 |
| `max_rows` | 200 (V1) |

`max_rows` is mandatory on every type. Unbounded rendering is how the current CSV export became a memory risk.

---

## 12. Export architecture

### 12.1 What exists — and the brief says do not rebuild it

| Format | Mechanism | Status |
|---|---|---|
| **On-screen** | React components | Exists |
| **CSV** | `export_service.py:8-37`, stdlib `csv` + `StringIO` | Exists, **unbounded**, **leaky** |
| **PDF** | `export_service.py:39-104`, `reportlab` canvas | Exists, **hard `LIMIT 50`**, naive pagination, no header/footer |
| **Excel** | — | **Does not exist anywhere** |
| **Print/PDF** | `window.print()` (`ReportSuitePage.tsx:131-136`) | Exists (client) |

### 12.2 V1 formats

| Format | V1? | Rationale |
|---|---|---|
| On-screen | **Yes** | The core deliverable |
| CSV | **Yes — via the existing exporter** | Brief says don't rebuild. Reuse `export_service.export_csv`, adding tenant verification + a row cap |
| Excel | **Yes, minimal** | Enterprise buyers expect it; it is the only genuinely new formatter. `openpyxl` is already a known dependency in the repo's offline scripts |
| PDF | **Later** | `reportlab` output is not fit for a customer-facing deliverable. Do not ship a bad PDF in V1 |
| Print | **Later** | `window.print()` is fine for ad-hoc, not for a distributed artefact |

### 12.3 The two export defects to fix regardless

1. **Tenant leak** — §8.3. P0.
2. **Unbounded CSV** — `export_csv` has no `LIMIT` (`export_service.py:8-37`), streams the whole `migration_control_execution` set for a batch into a `StringIO` in memory. Needs a row cap and a `truncated` flag in the response contract.

A cap silently truncating a compliance export is a **correctness** problem, not just a performance one. The response must say so explicitly.

### 12.4 Export must be permission-gated and re-authorised

`reports:export` already exists and is already bridged to `advanced_reporting` (`rbac.py:15-17`). Export is the operation most likely to be used for exfiltration, so it re-runs the **full** §8.1 check — including the DataSource source check — and is written to an audit trail (§17.4).

---

## 13. Scheduling recommendation

**Recommendation: defer scheduling to V2. Do not build it in V1.**

### 13.1 What exists

**No report scheduling exists.** `engine.migration_schedules` + `schedule_execution_log` schedule **migration execution runs**, not report delivery. `/reports/templates` and `/reports/distribution` are `ReportsPage` aliases with no forms and no API (`AppRoutes.tsx:162-163`).

### 13.2 Why defer

1. **The brief instructs it:** *"If not, identify scheduling as a later capability rather than unnecessarily expanding V1."*
2. It needs a durable worker, retry/DLQ semantics, timezone handling, per-recipient authorisation at delivery time, and an audit trail for "who received what, when" — a subsystem in its own right.
3. Delivery is where the permission model gets hardest: a report shared to 10 people must be re-authorised for each recipient at send time, because entitlements change.
4. `reports:schedule` does not exist as a permission, and seeding a permission for a feature that has not shipped is inventory debt.

### 13.3 V2 shape (for planning only)

```
Schedule
  report_id, tenant_id, cron (or simple interval), timezone
  delivery_targets[]  (email | portal | webhook)
  recipient_rule      (owner | explicit[] | report_access_group)
  format             (csv | xlsx | pdf)
  revalidate_at_delivery: true   ← mandatory, non-negotiable
```

`migration_schedules` provides a workable pattern for calendar/stats/queue, but **report schedules are a different concern and should be a different table.** Reusing the execution scheduler for delivery would couple two lifecycles that should not move together.

---

## 14. AI compatibility and the V1 → V2 → V3 assistant roadmap

**Revised in v2.** The original plan treated AI as a single future concern. It is now split across three releases, with the deliberate property that **V1 and V2 have no AI dependency at all.**

### 14.1 The progression

| Release | Capability | External AI? | API cost | Notes |
|---|---|---|---|---|
| **V1** | **Built-in deterministic Report Assistant** (§5B) | **No** | **None** | Curated recipe catalogue + weighted keyword match + 2–4 constrained questions. Materialises a template into an editable definition |
| **V2** | **Richer Analysis Workspace** + more sophisticated assistant | **No** | **None** | Option C surface; scatter / matrix / pivot; more recipes, saved user recipes, multi-turn refinement within the constrained-choice model (§5B.6) |
| **V3** | **Optional MAP Nexus AI Analyst / Copilot** | **Yes — customer-selected or BYO LLM** | Customer's | Optional and opt-in. Generates Report Studio definitions **through governed tools only** |

### 14.2 Why the V1 assistant is not AI — and why that is a feature

It is easy to read "assistant" and expect a model. V1 is deliberately not one, for four reasons that all point the same way:

1. **No external dependency** — nothing to procure, audit, or take offline. A regulated financial-services customer can adopt V1 without an AI governance review.
2. **No AI API cost** — no per-report, per-seat, or per-tenant charge. Self-service reporting cannot become uneconomic at scale.
3. **Determinism** — same input, same definition, always. A governed, auditable product surface is far easier to certify without a model in the path.
4. **No hallucination surface** — the assistant can only propose combinations that already exist in the allowlist and the template library. It cannot invent a field, a filter, or a source.

What V1 loses versus an LLM is breadth of intent understanding. That is an acceptable trade for the first release, and it is recoverable later by *adding a client to an API that already exists* — which is the whole architectural point of §5B.4.

### 14.3 The invariant that governs all three releases

> **The assistant — rules-driven or model-driven — is a client of the report-definition API. It is never a second path to data.**

Concretely, in every release:

| Property | How it is enforced |
|---|---|
| No executable fragments in a definition | Structured component/filter/binding records. Nothing to inject |
| DataSources addressable by stable key + schema version | `migration.reconciliation@1` — a client resolves a name to a key; **no client ever writes SQL** |
| Every field has a machine-readable type and role | `measure` / `dimension` / `timestamp`, with aggregations enumerated |
| One validator, no privileged path | `validate(definition) → errors[]`, called identically by the builder UI, the save API, the V1 assistant and (in V3) the AI Analyst |
| Authorisation re-run server-side | Whatever produced the definition, `/data` and `/export` re-evaluate the full §8.1 check. A definition is inert until saved, and re-checked on every read |
| Source access is never widened by authoring | A user cannot save a definition referencing fields or sources they cannot read (§8.1) |

The V3 AI Analyst is therefore **a different client of an already-governed API**, not a new trust boundary. If it ever gained a direct data path, it would be a separate security work package and would invalidate this section.

### 14.4 V3 shape (for planning only — not implemented here)

```
AI Analyst / Copilot  (optional, opt-in, entitlement-gated)
  provider: customer-selected (Azure OpenAI, AWS Bedrock, ...) or BYO endpoint
  governance: tenant-configured; no MAP Nexus-operated model by default
  tools exposed — ONLY:
      list_datasources()          (entitlement-filtered)
      describe_fields(key)        (entitlement-filtered)
      validate_definition(def)    (the same validator)
      instantiate_template(key)
      save_definition(def)        (the same authorised save path)
  never exposed: raw SQL, arbitrary query, direct table access
```

The AI's output is a **candidate definition**, which the user reviews and confirms in the builder. It is never auto-published, and every AI-produced report is marked `origin = ai` with the model and prompt reference retained for audit.

**`ai_insights` already exists** as an `enterprise_plus` entitlement (`entitlement_middleware.py:6-28`), so V3 packaging is largely a matter of wiring an existing key rather than introducing a new one.

### 14.5 Naming caution

Because the V1 assistant is not a model, naming it "AI" in the product would be misleading and would create an AI-governance review burden for a feature that has no AI in it. Recommend **"Report Assistant"** in product copy, with the deterministic and vendor-neutral nature stated in the UI. Reserve "AI Analyst / Copilot" for V3, where it is accurate.

---

## 15. Existing code and components reusable

### 15.1 Reuse as-is

| Artefact | Location | Use |
|---|---|---|
| `KpiBox` | `reportWidgets.tsx:21` | KPI component |
| `ReportCard` | `reportWidgets.tsx:31` | Panel wrapper |
| `StatusPill` | `reportWidgets.tsx:41` | Status tone (colour map is already comprehensive) |
| `DataTable` | `shared/DataTable.tsx:21` | Table component — sortable, paginated, `render` cells. **Already built, currently unused by any report page** |
| `TenantFilter` | `shared/TenantFilter.tsx:9` | SA tenant scoping |
| `MetricCard`, `StatusBadge`, `Pagination`, `EmptyState` | `shared/` | General admin UI |
| `resolve_tenant` | `dependencies.py:87-99` | Canonical SA tenant override |
| `verify_batch_tenant` | `execution_history_service.py:22-42` | Canonical batch ownership check |
| `get_tenant_entitlements` | `entitlement_middleware.py:36-56` | Canonical effective entitlement read |
| `require_entitlement` | `entitlement_middleware.py:82-84` | Canonical entitlement guard |
| `check_entitlement` | `role_service.py:285-292` | Stops privilege escalation via grants |
| `validate(definition)` shape | `validation_report_service.py` + repository | The service/repository split pattern to copy |
| Existing 14 report definitions | `ReportSuiteService` | **Metric definitions and business logic to mine** — not code to call |
| Permission/role APIs | `permissions_routes.py`, `role_routes.py` | Access grant UI reuse |

`DataTable` is the most notable find: a full sortable/paginated table component already exists and **no report page uses it** — every report table is hand-rolled `<table>` markup. The Studio should standardise on it.

### 15.2 Reuse concepts only, no code

| From | Concept worth keeping |
|---|---|
| MAP_V2 `viewer/` | Document outline, bookmarks, section navigation, properties panel |
| MAP_V2 `html/templates/` | The 7 template names — a good V1 template set |
| MAP_V2 `centre/` | The centre/workspace/detail information architecture |
| MAP_V2 `scheduler/` | Calendar + queue + history mental model |
| `navigation_routes.py:276-359` | The existing report catalogue and capability-ID pattern |

### 15.3 Do not reuse

| Artefact | Why |
|---|---|
| MAP_V2 `reporting/**` (all ~100 files) | Unmounted shell; export is an `alert()` stub; no data layer |
| MAP_V2 `ai/**` (~100 files) | Unmounted; not in scope |
| `PortalMetadata.ts` | Second, DB-nonexistent permission vocabulary — actively misleading |
| `ReportSuiteService` code | Raw `psycopg2`, 1,117 lines, inconsistent tenant predicates, hardcoded `C01..C010` |
| `reportSections.tsx` | 1,000 lines of hard-coded presenters; anti-pattern for a builder |
| `core.role_permissions` | Read-only legacy compat pack |
| `ReportSuitePage` gating logic | Frontend-only, error-swallowing — the thing to replace, not extend |
| `audit_pack_service.py`, `audit_export.py` | Dead, unrouted, legacy table names |

---

## 16. New components and services required

| # | Component | Layer | Purpose | V1? |
|---|---|---|---|---|
| 1 | `report_catalog_service` | backend | **Central** report→entitlement→permission matrix. Answers *"can this tenant/user access this report?"* for both frontend and backend. Satisfies TODO 7's core requirement | **Yes** |
| 2 | `DataSourceResolver` | backend | Allowlist resolution + canonical tenant predicate per scope family | **Yes** |
| 3 | `AggregationEngine` | backend | Allowlisted operators/aggregations → parameterised read-only SQL | **Yes** |
| 4 | `definition_validator` | backend | `validate(definition, principal) → errors[]`. Single authority for UI *and* future AI | **Yes** |
| 5 | `report_definition_service` | backend | CRUD, versioning, lifecycle, access evaluation | **Yes** |
| 6 | `report_query_service` | backend | Pipeline: resolve → scope → filter-intersect → aggregate → shape | **Yes** |
| 7 | `report_export_service` | backend | Wrap/reuse `export_service`; add xlsx; cap rows; emit `truncated` | **Yes** |
| 8 | `report_audit_service` | backend | Queryable audit trail for report create/read/share/export/delete | **Yes** |
| 9 | `useReportCatalog` | frontend | Entitlements/permissions for nav and route guards | **Yes** |
| 10 | `useReportDefinition` | frontend | Definition fetch + optimistic edits | **Yes** |
| 11 | `useReportQuery` | frontend | `useQuery` wrapper with tenant + saved + user filters | **Yes** |
| 12 | `ReportListPage` | frontend | Catalogue: my reports / shared / published | **Yes** |
| 13 | Builder (one of A/B/C) | frontend | The authoring surface | **Yes** |
| 14 | `ReportViewer` | frontend | Read-only render of a saved definition | **Yes** |
| 15 | Component renderers | frontend | Extend `BarList`, `LineChart`; add donut; wire `DataTable` | **Yes** |
| 16 | `ShareDialog` | frontend | Access management, capability-aware | **Yes** |
| 17 | `ExportMenu` | frontend | Format selection, gated by `reports:export` | **Yes** |
| 18 | Report nav integration | frontend | Replace hard-coded 8 children with catalog-driven | **Yes** |
| 19 | `report_template_service` | backend | Versioned template catalogue; instantiate → editable definition; pin/update semantics; entitlement filtering (**v2 §5A**) | **Yes** |
| 20 | `report_assistant_service` | backend | Deterministic recipe match, constrained questions, definition materialisation (**v2 §5B**) | **Yes** |
| 21 | TemplateGallery | frontend | Template picker + blank report, entitlement-filtered (**v2 §5A**) | **Yes** |
| 22 | ReportAssistantPanel | frontend | Recipe match + questions + resulting-definition preview (**v2 §5B**) | **Yes** |
| 23 | TemplateUpdateBanner | frontend | Pinned/diverged state, diff preview, accept-as-new-version (**v2 §5A.4**) | **Yes** |
| 24 | Scatter / matrix / pivot renderers | frontend | V2 | No |
| 25 | AnalysisWorkspace | frontend | Option C surface — V2 (**v2 §0A**) | No |
| 26 | `report_schedule_service` + worker | backend | V2 | No |
| 27 | `SchedulePage` | frontend | V2 | No |
| 28 | Advanced assistant (V2) | backend | More recipes, saved user recipes, multi-turn refinement — still no external AI (**v2 §5B.6**) | No |
| 29 | AI Analyst / Copilot | backend + frontend | V3 — optional, customer-selected or BYO LLM, governed tools only (**v2 §14.4**) | No |

**V1 count: 23 items.** Items 1–8 (backend) and 19–20 (template + assistant services) carry the weight; 9–18 and 21–23 are thin. A realistic V1 is **two core backend services plus template/assistant catalogues and one builder** — not a framework.

**Explicitly absent from V1, by decision:** any Python AI library, any LLM SDK, any charting or dataframe library (§0A). No external AI dependency and no AI API cost.

---

## 17. Database impact

**No migrations are created in this work package.** The following is the *assessment* of what a future migration must contain, produced only because §2 reconciliation established no existing table can serve this purpose.

### 17.1 Schema

Proposed `platform` schema (it is configuration metadata, not tenant business data):

```
platform.report_catalog
  report_key PK, display_name, category, description,
  data_source_key, required_permission, required_entitlement,
  is_active, sort_order, created_at, updated_at
  -- static seed: the centrally-maintained catalogue TODO 7 asks for

platform.reports
  id PK, tenant_id FK, owner_user_id FK,
  report_key FK, title, description, status, visibility,
  current_version_id FK, created_at, updated_at, deleted_at

platform.report_definitions          -- immutable
  id PK, report_id FK, version_no INT, schema_version INT,
  definition JSONB, created_by FK, created_at,
  UNIQUE (report_id, version_no)

platform.report_data_sources          -- the allowlist
  key PK, schema_version INT, scope_family, grain,
  fields JSONB, required_permission, required_entitlement,
  is_active, created_at, updated_at

platform.report_access
  report_id FK, grantee_user_id FK NULL, grantee_role_id FK NULL,
  access_level ('view'|'contribute'), granted_by FK, granted_at
```

### 17.1a Two additional catalogue tables (v2 — templates and assistant recipes)

```
platform.report_templates                  -- §5A.1
  template_key PK, version INT, display_name, description, category,
  definition JSONB, required_data_sources[], required_entitlements[],
  thumbnail_spec JSONB, is_active, is_featured,
  created_by, created_at, changelog
  UNIQUE (template_key, version)

platform.report_assistant_recipes          -- §5B.3
  recipe_key PK, display_name, keywords[],
  questions JSONB, resulting_template_key,
  required_data_sources[], required_entitlements[],
  is_active, priority, created_at
```

Both are **static, centrally-maintained, system-owned, tenant-less** reference data — the same shape and purpose as `platform.report_catalog`. They exist so that **adding a template or a recipe is a data change, not a code change and not a release.** They are seeded by migration in V1 and thereafter maintained by product through an admin surface (a follow-on, not in V1 scope).

### 17.2 Design notes

- **JSONB for definitions, not normalised columns.** A definition is a tree read and written as a unit, never queried field-wise. Normalising it would add joins and buy nothing. Validate structure in application code (`definition_validator`), **not** by trusting the JSONB.
- **`platform`, not `core`/`engine`.** It is platform configuration, consistent with `platform.permissions` and `platform.plans`. It keeps tenant business data and platform metadata cleanly separated.
- **Tenant isolation:** every `reports` row carries `tenant_id`; every query filters on it. `report_definitions` and `report_access` inherit via join — consider `RLS` to match the project's isolation posture.
- **Soft delete:** `deleted_at` + 30-day purge, per §6.2.

### 17.3 The catalogue table is the real prize

`platform.report_catalog` is a **static, centrally-maintained** table: report key, category, required permission, required entitlement, active flag. It answers *"can this tenant/user access this report?"* with one query, and it means **adding or retiring a report is a data change, not a code change** — precisely the maintainability goal in TODO 7 §128.

It also lets the same logic serve the frontend (nav, route guards) and the backend (endpoint authorization) from **one** source, which is the anti-duplication requirement.

### 17.4 Audit trail

A report add-on without a queryable audit trail is a compliance liability: *"who exported this reconciliation report, when, and what did it contain?"* must be answerable.

No suitable store exists — `governance/audit` is a projection of `engine.migration_control_execution` (execution events, not admin actions) and E13 added only cookie attribution to a log-only middleware. So `platform.report_audit` is required:

```
platform.report_audit
  id PK, tenant_id, actor_user_id, action, report_id NULL,
  data_source_keys TEXT[], filter_summary JSONB, row_count INT,
  format NULL, outcome, ip, user_agent, created_at
  -- append-only; no update/delete path
```

This overlaps with the deferred **D-E13a** admin audit migration. **Recommendation: build one admin audit table and have E13a and Report Studio share it, rather than creating two.** Founder decision **D6** (§28).

### 17.5 Prerequisite migrations (not part of this package)

| ID | Item | Why blocking |
|---|---|---|
| **OC-REPORT-001-R1** | Fix `export_routes` tenant verification | P0 leak (§8.3) |
| **OC-REPORT-001-R2** | Re-align `platform.plans.entitlements` to `DEFAULT_ENTITLEMENTS` | Packaging on unstable vocabulary (§9.2) |
| **OC-REPORT-001-R3** | Seed grants for Migration Lead, Data Analyst, Team Member, Viewer | Studio unusable without them (§7.2) |
| **OC-REPORT-001-R4** | Reconcile the 57-vs-54 permission row delta | Catalogue integrity (§7.1) |

---

## 18. API impact

All under a new `/api/v1/reports/studio` prefix so the existing `/api/v1/reports/suite` and `/api/v1/execution/export` contracts are untouched.

| Method | Path | Permission | Entitlement | Notes |
|---|---|---|---|---|
| `GET` | `/reports/studio/catalog` | `reports:read` | any reporting | Drives nav + guards. **Cached; not per-tenant-filtered** |
| `GET` | `/reports/studio/reports` | `reports:read` | any reporting | List; `?scope=mine\|shared\|published\|all`; tenant-scoped |
| `POST` | `/reports/studio/reports` | `reports:create` | `report_studio` | Creates `draft`; **validates the definition against caller sources** |
| `GET` | `/reports/studio/reports/{id}` | `reports:read` + access | union of definition sources | |
| `PATCH` | `/reports/studio/reports/{id}` | `reports:update` + ownership | `report_studio` | Shell fields only; status transitions |
| `PUT` | `/reports/studio/reports/{id}/definition` | `reports:update` + ownership | `report_studio` | **Creates a new immutable version** |
| `GET` | `/reports/studio/reports/{id}/versions` | `reports:read` + access | — | Version history |
| `POST` | `/reports/studio/reports/{id}/duplicate` | `reports:create` | `report_studio` | New report, new owner |
| `DELETE` | `/reports/studio/reports/{id}` | `reports:delete` + ownership | — | Soft delete |
| `GET` | `/reports/studio/reports/{id}/data` | `reports:read` + access + **source check** | union of definition sources | **The core read. Re-evaluates §8.1 on every call** |
| `GET` | `/reports/studio/datasources` | `reports:read` | any reporting | Allowlist, filtered by caller entitlement |
| `POST` | `/reports/studio/datasources/{key}/fields/preview` | `reports:read` | source entitlement | Field/shape introspection for the builder |
| `GET` | `/reports/studio/reports/{id}/export?format=` | `reports:export` + source check | source entitlement | `csv` (reused), `xlsx` (new) |
| `GET` | `/reports/studio/reports/{id}/access` | `reports:read` + ownership | — | |
| `POST` | `/reports/studio/reports/{id}/access` | `reports:share` **(new)** | `report_studio` | Capability-aware grant (§7.4) |
| `DELETE` | `/reports/studio/reports/{id}/access/{principal}` | `reports:share` **(new)** | `report_studio` | |
| `GET` | `/reports/studio/audit` | `reports:read` | `audit_trail` | Tenant report audit trail |
| V2 | `/reports/studio/reports/{id}/schedules` | `reports:schedule` **(new)** | `enterprise_reporting` | Deferred |

### 18.1 Authorization middleware

A single `require_report_access(principal, report_id, operation, definition=None)` dependency must serve every one of these. Authorization must **not** be re-implemented per route — that is how the current codebase ended up with three different auth patterns (A/B/C/D) and a leak in pattern C.

Every endpoint follows the same shape:

```python
principal = Depends(get_current_user_with_tenant)
tenant    = Depends(resolve_tenant)          # SA override, as everywhere
...
entitlements = get_tenant_entitlements(tenant)      # canonical vocabulary
report      = load_report(report_id, tenant)        # tenant-filtered
assert_status(report, 'published' | owner-only)
assert_permission(principal, required_permission)
assert_entitlements(entitlements, required_entitlements)  # union over definition sources
assert_source_access(principal, definition)         # §7.4 — the escalation guard
```

### 18.2 Response contract

```json
{
  "meta": {
    "report_id": "...", "version": 3, "generated_at": "...",
    "tenant_id": "...", "data_sources": [{"key": "...", "version": 1}],
    "truncated": false, "row_count": 128,
    "applied_filters": {...}, "warnings": []
  },
  "components": [
    {"id": "c1", "type": "bar", "data": {"dimension": "owner", "measure": "fail_count"}},
    {"id": "c2", "type": "table", "columns": [...], "rows": [...]}
  ]
}
```

`meta` is not decoration: `version`, `generated_at`, `data_sources` and `truncated` are what make a report defensible in an audit, and `truncated` is what keeps a capped export honest.

---

## 19. Frontend impact

### 19.1 New routes

```
/reports/studio                      → ReportListPage
/reports/studio/new                  → Builder (template or blank)
/reports/studio/:reportId/edit       → Builder (loads current version)
/reports/studio/:reportId/view       → ReportViewer
/reports/studio/:reportId/versions   → Version history
/reports/studio/:reportId/access     → Sharing
```

`/reports/suite/**` and `/reports/**` are **untouched**. Studio is a sibling.

### 19.2 Reuse

`KpiBox`, `ReportCard`, `StatusPill`, `DataTable`, `TenantFilter`, `MetricCard`, `StatusBadge`, `Pagination`, `EmptyState`, `useReportCatalog`, `useReportDefinition`, `useReportQuery`, `TenantSwitcher` (Phase C — correct scope plumbing already exists), and the `TenantContext` `sessionStorage` scope.

### 19.3 Replace

The hard-coded 8-child report nav in `navigation_routes.py:276-359` and the error-swallowing matrix in `ReportSuitePage.tsx:41-79` should be superseded by catalog-driven nav **for the Studio surface only**. The curated suite keeps its own matrix until a separate work package migrates it — but TODO 7's "one entitlement controls nav, tabs, routes *and* backend" requirement means the suite's frontend-only gating is a **known open gap** that should be scheduled, not silently inherited.

### 19.4 Route guards

Guards use `useReportCatalog` and are **usability controls, not the security boundary** (§8). Every guard must have a real API behind it that denies independently. The builder needs guards for `reports:create`/`update`, the share dialog for `reports:share`, the export menu for `reports:export` — and the viewer must handle a 403 from `/data` gracefully rather than assuming the report is readable.

### 19.5 State and data fetching

`@tanstack/react-query ^5.101.2` is already a dependency. The Studio should use it consistently: `useReportQuery` keyed on `[reportId, version, tenantScope, userFilters]`, with the **current `TenantContext` scope in the query key** so switching tenants cannot serve stale cross-tenant data. This is a real hazard given Phase C just introduced scope switching.

### 19.6 Dependency impact

- **V1: none.** Hand-rolled/generalised components only.
- **V2: `recharts ^3.9.2`** for scatter/matrix/pivot (already pinned in sibling package.json files, unused).
- **Optional V1: `openpyxl` is backend**; the frontend needs no export library because export is server-side.

---

## 20. Implementation phases

Each phase is independently shippable. Phases 0–1 are **prerequisites**, not Studio work.

### Phase 0 — Security & integrity fixes (blocking, standalone)

| Item | Why |
|---|---|
| **R1** Fix `export_routes` tenant verification | P0 cross-tenant leak (§8.3) |
| **R2** Re-align plan entitlements to `DEFAULT_ENTITLEMENTS` | Prevents a repeat of the `"migration"` outage (§9.2) |
| **R3** Seed role grants for the 4 ungranted roles | Studio unusable without an analyst (§7.2) |
| **R4** Reconcile the 57-vs-54 permission delta | Catalogue integrity (§7.1) |
| Add `LIMIT` + `truncated` to CSV export | Memory/DoS + correctness (§12.3) |

**These are not part of Report Studio and should be merged on their own timeline.** The Studio should not be the vehicle for a security fix.

### Phase 1 — Governed data foundation (no UI)

- `platform.report_catalog`, `report_data_sources` migrations
- Seed the 8 V1 DataSources and the V1 report catalogue
- `DataSourceResolver` with the two scope families
- `AggregationEngine` with the allowlisted operator/aggregation set
- `definition_validator`
- Tests: tenant isolation, escalation (§7.4), filter intersection narrow-only, parameter allowlist

**Exit:** a definition in, governed JSON out — no UI.

### Phase 2 — Read-only Studio (viewer first, builder later)

- `platform.reports`, `report_definitions`, `report_access` migrations
- `report_definition_service`, `report_query_service`, `report_catalog_service`
- `/reports/studio/**` read endpoints
- `ReportListPage`, `ReportViewer`, catalogue-driven nav, route guards
- Seed a few hand-authored V1 report definitions so the Studio has content on day one

**Exit:** users can *view* saved governed reports. Deliberately no authoring yet — this validates the model against real data before the builder is built on it.

### Phase 3 — Builder (Option B) + templates + assistant

- The chosen builder surface (Option B, §0A)
- `platform.report_templates` + `report_assistant_recipes` migrations, seeded with the 5 V1 templates (§5A.2) and their recipes (§5B.3)
- `report_template_service` (instantiate → editable definition, pin/update semantics, entitlement filtering)
- `report_assistant_service` (deterministic recipe match → constrained questions → materialised definition)
- `TemplateGallery`, `ReportAssistantPanel`, `TemplateUpdateBanner`
- Live preview against `/data`
- Draft → published lifecycle, versioning, duplicate/archive
- `ShareDialog` (requires `reports:share`)
- `ExportMenu` (CSV reuse + xlsx new)

**Exit:** a user picks a template or uses the assistant, gets a fully editable report, then saves, versions, shares and exports it. **No external AI dependency and no AI API cost** (§14.1).

### Phase 4 — Hardening & audit

- `platform.report_audit` (or shared E13a table) + writers on create/read/share/export/delete
- Export row caps surfaced in the UI
- `reports:schedule` **not** seeded
- Rate/size limits, `max_rows` enforcement, slow-query guard

### Phase 5 (V2) — Scheduling & distribution

- `reports:schedule` permission, `report_schedule_service`, worker
- `SchedulePage`
- Re-authorisation at delivery time
- PDF renderer (replace the `reportlab` canvas output)

### Phase 6 (V2) — Richer analysis, assistant, distribution

- AnalysisWorkspace (Option C) + scatter / matrix / pivot, `recharts`
- More sophisticated assistant — still **no external AI** (§5B.6)
- `reports:schedule` permission, `report_schedule_service`, worker
- `SchedulePage`; re-authorisation at delivery time
- PDF renderer (replace the `reportlab` canvas output)

### Phase 7 (V3) — Optional AI Analyst / Copilot

- `ai_insights`-gated, tenant-configured provider (customer-selected or BYO LLM)
- Governed tool set only: `list_datasources` / `describe_fields` / `validate_definition` / `instantiate_template` / `save_definition`
- No raw SQL, no direct table access; candidate definitions always user-confirmed; `origin = ai` recorded
- **Additive and opt-in.** V1 and V2 are unaffected and remain fully functional without it

---

## 21. V1 vs later capabilities

### 21.1 V1 — the deliberately small first version

| Capability | Included | Note |
|---|---|---|
| **Builder = Option B (Dashboard Studio)** | **Yes** | **Selected in v2** (§0A) |
| **4–5 curated templates** | **Yes** | Versioned, entitlement-filtered, curation-gated (§5A.2) |
| **Blank report** | **Yes** | First-class entry point, not pushed |
| **Built-in deterministic Report Assistant** | **Yes** | **Added in v2** (§5B). No LLM, no external AI, **no AI API cost** |
| **Template → editable definition** | **Yes** | Full copy, user-owned, provenance recorded (§5A.3) |
| On-screen report | **Yes** | Core deliverable |
| Saved reports (draft/published/archived/versioned/copied/deleted) | **Yes** | Full lifecycle |
| Tenant isolation + RBAC + source-level re-authorisation | **Yes** | Non-negotiable |
| Central report catalogue driving nav **and** backend | **Yes** | Satisfies TODO 7's core goal |
| 8 operational DataSources | **Yes** | No new data engineering |
| Components: KPI, table, bar, line, donut, score bar | **Yes** | Reuse/generalise |
| CSV + Excel export | **Yes** | Reuse CSV; xlsx is the only new formatter |
| Share with capability checks | **Yes** | Needs `reports:share` |
| Report audit trail | **Yes** | Compliance requirement |
| Scheduling | **No** | V2 (§13) |
| Distribution/webhook | **No** | V2 |
| PDF | **No** | Existing renderer is not customer-grade |
| Scatter / matrix / pivot | **No** | V2 |
| **Analysis Workspace (Option C)** | **No** | **V2** (§0A) |
| Cross-tenant report | **No** | Never (§8.2) |
| Arbitrary SQL | **No** | Never |
| **Any external AI / LLM dependency** | **No** | **Never in V1** (§14.1) |
| **Any Python AI library** | **No** | **Never in V1** (§0A) |
| **AI API cost** | **None** | By design |
| Public/external sharing | **No** | Out of scope |

### 21.2 V1 acceptance test

> A Data Analyst on an Enterprise tenant opens Report Studio, sees five curated templates, picks **Migration Health — Weekly**, adjusts one section, and publishes. They then ask the assistant "show me failed controls for the last 10 batches"; it confirms the matched recipe, asks four constrained questions, and produces a **second, fully editable** report. They share the first report with a colleague who **lacks `reports:export`** — the colleague can view it on screen but is refused an export with a 403. A user in a different tenant receives 404 on the report ID. Removing that tenant's `advanced_reporting` makes the read return 403 and the nav entry disappear.

That single test exercises templates, the deterministic assistant, tenant isolation, object access, capability separation, source-level re-authorisation, entitlement enforcement and the catalogue.

---

## 22. Risks and discrepancies

### 22.1 Blocking / high

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R-1 | **`export_routes` cross-tenant leak** (live) | Any tenant can export any other tenant's control data | **R1, Phase 0, before anything else** (§8.3) |
| R-2 | **Entitlement vocabulary drift** DB vs middleware | Paid add-on gated on an unstable vocabulary; already caused one outage | R2 re-alignment; add a startup/CI assertion that seeded plan keys ⊆ `DEFAULT_ENTITLEMENTS` keys |
| R-3 | **4 of 6 roles have zero grants** | No analyst can use the product | R3 seeding (§7.2) |
| R-4 | **Sharing is an escalation vector** | A shared report hands a restricted user restricted data | §7.4 source-level re-authorisation on **every** read, non-negotiable; dedicated tests |
| R-5 | **57 vs 54 permission rows** | Catalogue integrity unknown | R4 reconciliation before add-on design is finalised |
| R-6 | **No queryable admin audit store** | Cannot answer "who exported what" | Phase 4; share one table with E13a (D6) |

### 22.2 Medium

| # | Risk | Mitigation |
|---|---|---|
| R-7 | **Raw-SQL service pattern** — the codebase's default is `psycopg2` in a handler; the Studio's whole value is *governed* access | Make `DataSourceResolver` + `AggregationEngine` the only sanctioned path; lint/review against direct `psycopg2` in report routes |
| R-8 | **`migration_control_execution` volume** — large per batch; unbounded CSV and heatmap queries | Row caps, `truncated` flag, `max_rows`, slow-query guard, indexes reviewed in Phase 1 |
| R-9 | **Two tenant-join families** (`batch` vs `control`) | Scope family declared per DataSource (§10.1); a wrong mapping is a leak — test every source in isolation |
| R-10 | **Hardcoded control metadata `C01..C010`** in `ReportSuiteService` | DataSource fields come from `control_registry` where possible, not hardcoded maps |
| R-11 | **Definition JSONB drift** across versions | `schema_version` on every definition + one `definition_validator` that refuses unknown shapes |
| R-12 | **Builder is a large surface** — scope creep toward a BI tool | Hard V1 line (§21). No query language, no joins across sources, no cross-tenant |
| R-13 | **Filters could broaden access** if implemented as replacement | Intersect, never replace; test that a user filter cannot widen a saved filter |
| R-14 | **Tenant scope in a `useQuery` key** — Phase C scope switching is new | Scope in the query key (§19.5); explicit cross-tenant test |
| R-15 | **Unbounded component types** (huge pivot) | `max_rows` mandatory on every component type (§11.3) |

### 22.3 Discrepancies found during reconciliation

| Discrepancy | Detail |
|---|---|
| Report catalogue is **three-way inconsistent** | `navigation_routes.py` = 8 children; `ReportSuiteService` = 14 sections; TODO 7 = 13 reports. `quality`/`readiness`/`issues` exist in the payload but have no nav entry |
| Suite gating uses `fallbackRoleMap` when the permission fetch fails | A permissions outage **widens** report access to a hard-coded matrix (`ReportSuitePage.tsx:71-76`) — fail-open |
| `migration_pack` missing from the frontend pack map | `AuthContext.tsx:171-182` `packPermissions` has no `migration_pack`, yet the suite ships a `migration_pack` section |
| `usePackPermission` has 2 call sites, none in report pages | The pack system is vestigial; the suite uses its own matrix instead |
| `empty` state components have **two different signatures** | `reportWidgets.EmptyState({message?,title?,description?})` vs `shared/EmptyState({title,message,description,action,icon})` |
| `/reports/templates` and `/reports/distribution` are **dead routes** | Both render `ReportsPage`; no API, no UI (`AppRoutes.tsx:162-163`) |
| `recharts` + `ag-grid` **declared but never imported** in two package.json files | Dead dependencies; do not assume charting is solved anywhere |
| `reportlab` PDF has a hard `LIMIT 50` | Silent truncation in a compliance export — a correctness defect |
| `governance/audit` is a **projection**, not an audit log | Reads `engine.migration_control_execution`, `user_email` hardcoded `'SYSTEM'` |
| Two different `MetricCard` components | `shared/MetricCard.tsx` and a local one in `ReportsPage.tsx:461` |
| Report tables are hand-rolled despite `DataTable` existing | `DataTable` is unused by every report page |

---

## 23. Acceptance criteria

### 23.1 Reconciliation (this package)

- [x] Existing report pages, APIs, services, components inspected and listed
- [x] Existing permission vocabulary checked **before** proposing capabilities
- [x] Existing entitlement/subscription model checked **before** proposing an add-on
- [x] Existing export and scheduling mechanisms assessed
- [x] Existing saved-configuration/report models checked
- [x] MAP_V2 reporting/AI assets assessed for reuse
- [x] No duplicate reporting logic proposed
- [x] No code, migration or commit produced

### 23.2 Security (V1 implementation gate)

- [ ] Tenant Admin cannot read another tenant's report by direct URL → 404
- [ ] User without `reports:read` gets 403 from `/reports/studio/**` even with a valid report ID
- [ ] User without `reports:export` can view a shared report but export returns 403
- [ ] **A report shared with a user who lacks the DataSource's permission is not readable at all**
- [ ] Every `/data` and `/export` call re-evaluates source-level permissions
- [ ] A user filter cannot broaden a saved filter (intersection verified server-side)
- [ ] Every save validates the definition against the caller's own source access
- [ ] Entitlement checked per DataSource per request; missing entitlement → 403 + nav entry gone
- [ ] Every read/export/share/delete written to a queryable audit trail
- [ ] No endpoint accepts user-supplied SQL, table names, or aggregation expressions
- [ ] Definitions pinned to a `schema_version`; unknown shapes rejected
- [ ] **Pre-existing `export_routes` leak fixed and regression-tested**

### 23.3 Functional (V1)

- [ ] Create/edit a report with all 7 V1 component types
- [ ] Apply saved filters; verify runtime filters narrow only
- [ ] Preview before save
- [ ] Save as draft; draft invisible to other users
- [ ] Publish; appears in catalogue nav
- [ ] Edit a published report → new version; v1 still reproducible
- [ ] Duplicate; archive; soft-delete; restore within 30 days
- [ ] Share with an individual and with a role, capability-aware
- [ ] Export CSV (reused exporter) and Excel (new), both capped with `truncated` surfaced
- [ ] Filtered by tenant context; switching tenant cannot serve stale data

### 23.4 Maintainability (the TODO 7 goal)

- [ ] Adding a report to the catalogue is a **data change**, not a code change
- [ ] Retiring a report is a `is_active` flag
- [ ] Nav, route guards and backend authorization all read **one** catalogue
- [ ] Frontend hiding ≠ security: every denial is enforced at the API
- [ ] Subscription change alters access without a redeploy
- [ ] A tenant entitlement change is reflected in nav and API consistently

### 23.5 Non-goals for V1 — explicit

- [ ] No arbitrary SQL or query language
- [ ] No cross-tenant report or cross-tenant joins
- [ ] No scheduling or distribution
- [ ] No customer-grade PDF
- [ ] No scatter/matrix/pivot
- [ ] No AI generation
- [ ] No public/external sharing

---

# UI design options

Three genuinely different approaches. All render the same underlying definition; they differ in **how the user authors it**.

> **✅ DECIDED in v2: Option B is selected for V1.** The full comparison is retained below for the record, and for the V2 decision on Option C.
>
> | Option | Status | Screenshot (v2) |
> |---|---|---|
> | A — Canvas Builder | **Deferred** — not selected | `OC-REPORT-001_mockups/v2-option-a-canvas-builder.png` |
> | **B — Dashboard Studio** | **SELECTED for V1** | `OC-REPORT-001_mockups/v2-option-b-dashboard-studio.png` |
> | C — Analysis Workspace | **V2** | `OC-REPORT-001_mockups/v2-option-c-analysis-workspace.png` |
> | Report Assistant *(new in v2)* | **SELECTED for V1** | `OC-REPORT-001_mockups/v2-report-assistant.png` |

---

## Option A — Canvas Builder

**Metaphor:** a design canvas. Component palette on the left, live canvas in the middle, properties panel on the right. Drag from palette onto a grid.

### A.1 Concept

Direct manipulation. You see the report as it will look, and you manipulate it spatially. Closest mental model: Canva / Looker Studio / Power BI report authoring.

```
+----------------------------------------------------------------------+
| Reports > Studio > New report                          [Save draft]  |
+----------------+--------------------------------+-------------------+
| ADD COMPONENT  |                                | PROPERTIES        |
|                |   +------+ +------+ +------+   |                   |
|  [KPI]         |   | Total| | Pass | | Fail |   | Component: Bar    |
|  [Table]       |   | 128  | |  96  | |  32  |   |------------------|
|  [Bar]         |   +------+ +------+ +------+   | Title  [______]  |
|  [Line]        |                                | Measure [_Fail__]|
|  [Donut]       |   [Controls failed by owner]   | Dimension[_Owner_]|
|  [Score bar]   |   |  ███████████  Ann            | Sort    [Count d]|
|  [Bar list]    |   |  ██████       Raj            | Stacked [  No  ]  |
|                |   |  ████         Mei            | Max rows [ 50 ]   |
| DATA SOURCE    |                                |                   |
|  validation.   |   [Exceptions by control]       | CONDITIONAL       |
|  exceptions v1 |   |  C01  | 12  | OPEN |       | [x] Highlight > 5 |
|                |   |  C02  |  4  | OPEN |       |   in red          |
| FIELDS         |   +-------------------------+   |                   |
|  owner  (dim)  |                                | FILTERS (saved)   |
|  control(dim)  |   [Fail rate trend - 10 bch]  | severity [CRIT,HI]|
|  fail_count    |   |  \__                     | | batch    [last 10]|
|    (measure)   |   |     \__/\__               | + Add filter       |
|                |   |  5%   8%   3%              |                   |
|                |   +-------------------------+   | [Preview] [Reset] |
+----------------+--------------------------------+-------------------+
| Data source: validation.exceptions v1 | Tenant: Acme Financial | v3 |
+----------------------------------------------------------------------+
```

### A.2 Interaction

1. Drag a component type from the palette onto the canvas.
2. A properties panel appears; bind measure and dimension from the DataSource field list.
3. Saved filters are declared in the right panel and immediately re-scope every component.
4. Live preview — the canvas **is** the preview. One screen, no wizard.
5. Layout is explicit: resize, reorder, grid positions are part of the definition.

### A.3 Strengths

- **Zero abstraction.** What you see is the report. No mode-switching.
- Best fit for the requested component set — scatter/matrix/pivot drop straight into the same grid in V2.
- Power users can iterate fast; everything is one gesture away.
- Easiest path to a real V2: the canvas is where new components land with no new UX.

### A.4 Weaknesses

- **Highest build cost.** Drag-drop, grid layout, resize, selection, snapping, undo — each is real work, and `frontend-mvp` has **no** dnd dependency (§11.2), so this is net-new.
- **Cognitive load.** Blank canvas + 7 component types + a field tree is intimidating for a first-time user.
- Layout metadata bloats definitions (a grid-position schema to version and validate).
- Undo/redo is effectively mandatory and is a significant sub-project.

### A.5 Cost profile

Highest frontend cost. Backend cost identical to B and C.

---

## Option B — Dashboard Studio

**Metaphor:** assemble from pre-built report sections on a page, like the existing `ReportCard` + `KpiBox` pattern. Start from a template, add sections, configure each.

### B.1 Concept

Section-based, template-first. The report is a vertical stack of typed sections. Minimal spatial freedom — a section is full-width or half-width, and order is the only layout decision. Guided configuration per section.

```
+----------------------------------------------------------------------+
| Reports > Studio > Migration Health Weekly          [Edit] [Share]   |
| [Export v]                                          [Published v2]  |
+----------------------------------------------------------------------+
| Template: "Migration Health - Weekly"                  (3 sections)   |
+----------------------------------------------------------------------+
| +------------------------------------------------------------------+ |
| | KEY METRICS                                        [Edit] [x]  | |
| +------------------------------------------------------------------+ |
| | +----------+ +----------+ +----------+ +----------+             | |
| | | BATCHES  | | CONTROLS | | PASS RATE| | OPEN HIGH|             | |
| | |    10    | |   1,284  | |   92.4%  | |    17    |             | |
| | +----------+ +----------+ +----------+ +----------+             | |
| +------------------------------------------------------------------+ |
| | Failed controls by owner                         [Edit] [x]    | |
| +------------------------------------------------------------------+ |
| |  Owner  | Controls | Failed | Pass rate | Trend                     | |
| |  Ann    |     312  |     24 |     92.3% | #### 78                  | |
| |  Raj    |     298  |     31 |     89.6% | ###  76                  | |
| |  Mei    |     241  |     18 |     92.5% | ##   78                  | |
| +------------------------------------------------------------------+ |
| | Fail rate trend - last 10 batches                   [Edit] [x]    | |
| +------------------------------------------------------------------+ |
| |   8% |      ___                                            | |
| |   5% |  ___|   |___     ___                               | |
| |   3% |_|             |_|                                 | |
| |     +-------------------------------------------------------| |
| |      b1  b2  b3  b4  b5  b6  b7  b8  b9  b10                | |
| +------------------------------------------------------------------+ |
| +------------------------------------------------------------------+ |
| FILTERS (apply to all sections)  [severity: CRITICAL,HIGH v]        |
| [batch: last 10 v]  [Search results...]                           |
+----------------------------------------------------------------------+
|  Data sources: control_summary v1, exceptions v1  |  Acme Financial |
+----------------------------------------------------------------------+
```

### B.2 Interaction

1. Pick a template ("Migration Health - Weekly", "Control Failure Deep Dive", "Reconciliation", "Executive Status", "Blank").
2. Add sections from a typed list; each section declares which DataSource and which fields it needs.
3. Click **Edit** on one section → a focused panel: measures, dimensions, filters, sort, chart options. No canvas, no dragging.
4. Drag-to-reorder sections only (optional, low-cost).
5. Filters at the bottom apply to all sections — the "one filter, whole report" mental model.

### B.3 Strengths

- **Strongest match to the existing codebase.** Sections *are* `ReportCard` + `KpiBox` + `DataTable`, which already exist and are already proven in 20+ pages.
- **Fastest to a good first result.** A template gives an instant, respectable report; most users never enter the editor.
- **Lowest build cost of the three.** No grid engine, no coordinate system, no selection model.
- **Filters-as-a-block is a better security story** — one filter set, one definition, one thing to validate.
- Lowest risk of scope creep into a BI tool.

### B.4 Weaknesses

- **Least flexible.** Adding a scatter next to a KPI means a new section type, not a new arrangement.
- Exotic layouts (two charts side-by-side) are awkward without a grid.
- Templates must be curated and maintained — a real ongoing cost, though a small one.
- The "no dragging anywhere" position may frustrate power users.

### B.5 Cost profile

Lowest frontend cost. Best ratio of shipped capability to effort. Backend identical to A and C.

---

## Option C — Analysis Workspace

**Metaphor:** a workbench. A filter rail, a data grid, and a results panel where you change one dimension at a time and watch everything update. Query-first: you shape the data, then pick how to see it.

### C.1 Concept

Left-to-right analytical flow: **scope → shape → view**. The defining behaviour is *fast iteration on a single result set* — change a filter, watch the same query re-render in a different visualisation. Report saving is a secondary action ("save this view").

```
+----------------------------------------------------------------------+
| Reports > Studio > Analysis Workspace                [Save as report]|
+---------------------+---------------------------------------------+
| SCOPE               |                                             |
|                     |  [KPI] [Table] [Bar] [Line] [Donut] [Save]   |
| Data source         |  ================= VIEW ====================  |
|  migration.         |                                             |
|  exceptions      v1 |   Controls failed, last 10 batches           |
|                     |                                             |
| Filters             |   +--------+ +--------+ +--------+ +--------+ |
|  severity           |   |  1,284 | |  92.4% | |   124  | |   17   | |
|   [x] CRITICAL      |   | controls| |  pass  | |  failed| |  open  | |
|   [x] HIGH          |   +--------+ +--------+ +--------+ +--------+ |
|   [ ] MEDIUM        |      controls       pass rate   failed    open |
|                     |                                             |
|  owner              |   By owner                                 |
|   [x] Ann  [x] Raj  |   Ann  ####################################  | |
|   [ ] Mei  [ ] Tom  |   Raj  ###############################       | |
|                     |   Mei  #####################                 | |
|  batch              |   Tom  #########                              | |
|   [x] last 10    v  |                                             |
|                     |   +------+------+-------+-------+-------+    |
| Fields              |   | owner| failed| total | pass% | trend |    |
|   dim ── owner      |   | Ann  |    24 |   312 | 92.3% |   78  |    |
|   dim ── control    |   | Raj  |    31 |   298 | 89.6% |   76  |    |
|   dim ── rule       |   | Mei  |    18 |   241 | 92.5% |   78  |    |
|   mea ── fail_count |   | Tom  |     9 |   190 | 95.3% |   78  |    |
|   mea ── pass_rate  |   +------+------+-------+-------+-------+    |
|                     |                                             |
| Group by  [owner v] |   Showing 124 of 124 rows                  |
| Sort     [fail desc] |   Data: exceptions v1 | Acme Financial      |
+---------------------+---------------------------------------------+
| Definition draft (not saved) - 5 filters, 2 dims, 1 measure        |
+----------------------------------------------------------------------+
```

### C.2 Interaction

1. Choose a DataSource in the left rail. Fields appear grouped as dimensions and measures.
2. Apply filters. Add dimensions and measures. **The view updates on every change** — switch KPI → Table → Bar → Line against the *same* result set.
3. `Group by` and `Sort` sit above the view as dropdowns, not as buried config.
4. **"Save as report"** captures the current state (data source, filters, fields, chosen visualisation) as a draft.

### C.3 Strengths

- **Fastest path to an answer.** For the primary persona — an analyst asking a question right now — this is the best of the three by a wide margin.
- **The result set is primary**, which composes naturally with a server-side `AggregationEngine`; visualisation is a lens on one query, not a separate component definition.
- Lowest layout complexity: no grid, no coordinates. Field list + filter rail + one view.
- **Saving becomes a natural byproduct** rather than a wizard step — the user saves once they have an answer worth keeping.
- Cleanest mapping to the brief's steps 3–6 (fields, filters, visualisation, grouping/sorting) which are all *one panel* here.

### C.4 Weaknesses

- **Weakest authoring model.** It is excellent for "answer this question" and mediocre for "compose a considered management report" — sections, ordering, and deliberate composition are awkward.
- Single-result-set focus means **multi-section reports are unnatural**; the "Management Summary" use case is weak here.
- The filter rail can look like a query builder, inviting the "is this arbitrary SQL?" question. Must be visually constrained to the allowlist.
- Requires the most careful state management to keep the filter/field/view triad consistent.

### C.5 Cost profile

Moderate. No grid engine, but the live-recompute UX needs `react-query` orchestration and a clear field-type system.

---

## 24. UX option comparison

| Dimension | A — Canvas | B — Dashboard Studio | C — Analysis Workspace |
|---|---|---|---|
| Build cost | **Highest** | **Lowest** | Moderate |
| New dnd dependency | **Required** | Optional (reorder only) | Not required |
| Time to first good report | Slow | **Fastest** (templates) | **Fastest** (for analysts) |
| First-time user | Weak | **Strongest** | Moderate |
| Power user | **Strongest** | Moderate | **Strongest** for querying |
| Multi-section reports | **Strong** | **Strongest** | Weak |
| Ad-hoc analysis | Moderate | Weak | **Strongest** |
| Matches existing components | Good | **Best** (they *are* sections) | Good |
| V2 extensibility (scatter/pivot) | **Best** | Good (new section type) | Good |
| Fit to brief's steps 3–6 | Good | Moderate | **Best** |
| Scope-creep risk | **Highest** (BI tool) | **Lowest** | Moderate |
| Undo/redo needed | **Yes (mandatory)** | No | Partially |

**Nothing prevents combining them** — B's catalogue, A's canvas and C's analysis pane share one definition model. But that is a **V3** conversation; V1 should pick one.

---

## 25. Existing code and components reusable — summary

Covered in §15. Headline: **7 components and 5 backend primitives are reusable as-is**; `DataTable` is the sleeper find (built, unused by every report page). MAP_V2's ~200 reporting/AI files are **concept references, not code**, and `PortalMetadata.ts` is actively misleading.

## 26. New components and services required — summary

Covered in §16. Headline (v2): **23 items for V1**, but the real weight is items 1–8 plus the two catalogue services (`report_template_service`, `report_assistant_service`). The frontend items are thin. A realistic V1 is **two core backend services + template and recipe catalogues + one builder** — not a framework.

**Explicitly absent from V1 by decision (§0A, §14.1):** any Python AI library, any LLM SDK, any charting or dataframe library, and any external AI API call.

## 27. Implementation cost shape

| Phase | Backend | Frontend | Migration | Notes |
|---|---|---|---|---|
| **0 — fixes** | Small | None | 4 small | Standalone; **R1 is urgent** |
| **1 — data foundation** | **Heavy** | None | 2 tables | Resolver + engine + validator. The real engineering |
| **2 — read-only studio** | Medium | Medium | 3 tables | Viewer validates the model on real data |
| **3 — builder + templates + assistant** | Medium | **Heavy** | 2 tables | Option B, 5 templates, recipes, deterministic assistant. The frontend is the bulk |
| **4 — hardening** | Medium | Small | 1 table | Audit |
| **5 — scheduling (V2)** | Heavy | Medium | 1 table | Worker, delivery, re-auth |
| **6 — V2 richer analysis** | Medium | **Heavy** | None | AnalysisWorkspace, scatter/matrix/pivot, `recharts`, smarter assistant |
| **7 — V3 AI Analyst** | Heavy | Medium | None | Optional, BYO LLM, governed tools only |

**Honest note:** Phases 1–2 are the load-bearing work and are **not** the builder. The single most important sequencing decision in this plan is that the governed data foundation ships and is validated **before** anyone builds a UI on top of it. Building the builder first would put the most complex and most expensive surface on top of the least-validated layer.

---

# Final recommendation

## 28. Recommended position

**ADOPTED (v2): Option B — Dashboard Studio — for V1, with 4–5 curated templates, a blank report, and a built-in deterministic Report Assistant. Option C's analysis workspace moves to V2. Option A's canvas is deferred indefinitely.**

Reasoning:

1. **B has the best capability-to-effort ratio and the lowest scope-creep risk.** The brief says *"keep the first implementation deliberately simple"* and *"do not over-engineer the first version."* A is the opposite of that instruction.
2. **B maps almost 1:1 onto components that already exist and are already proven** (`ReportCard`, `KpiBox`, `DataTable`, `StatusPill`). It is the only option that can largely be *composed* rather than built.
3. **Templates are the fastest route to a respectable first report**, which is what makes adoption likely — the dominant risk for a self-service feature.
4. **B's filter model is the strongest security story** — one filter set, one definition, one validation surface, versus A's per-component filter references.
5. **C is the right answer for the highest-value persona** (the Data Analyst) and is the cheapest of the two non-canvas options. Adding it after the model is proven is low risk.
6. **A's grid canvas needs a dnd dependency, a coordinate schema, and undo/redo.** None of that is justified until we know users want free-form layout, and V1 has no way to learn that.
7. **One new entitlement key (`report_studio`), not five** — the brief's five-way product split is right, but five schema keys is what produced the current vocabulary drift.

### Do first, regardless of the UI choice

1. **Fix the `export_routes` cross-tenant leak.** It is live, it is severe, and it has nothing to do with this add-on.
2. **Re-align plan entitlements with `DEFAULT_ENTITLEMENTS`** and add a CI assertion that they cannot drift again.
3. **Seed the four ungranted roles**, or the Studio ships with no user.
4. **Reconcile the permission-row delta.**

### Sequence

Phase 0 → Phase 1 (data foundation) → Phase 2 (read-only viewer) → founder validates the model on real data → Phase 3 (Option B builder + templates + deterministic assistant) → Phase 4 (audit hardening) → V2 (Analysis Workspace, scatter/matrix/pivot, richer assistant, scheduling) → V3 (optional AI Analyst / Copilot, BYO LLM, governed tools only).

**Do not build the builder before the data foundation is proven.**

---

## 29. Founder decisions required

| # | Decision | Options | Recommendation | Blocking? |
|---|---|---|---|---|
| **D1** | **Which builder UX?** | A Canvas / B Dashboard Studio / C Analysis Workspace | **✅ DECIDED (v2): B for V1.** C → V2. A deferred | **Resolved** |
| **D2** | **Is the curated Report Suite kept separate from the Studio?** | Keep separate / merge Studio into suite | **Keep separate.** The suite is curated; the Studio is exploratory. Merging couples two lifecycles | **Yes** |
| **D3** | **Entitlement packaging** | 1 new key `report_studio` / 5 new keys per the brief / no new key (fold into `advanced_reporting`) | **1 new key**; map the rest onto existing `advanced_reporting` / `enterprise_reporting` / `ai_insights` | **Yes** — gates the catalogue |
| **D4** | **Seed `reports:share` and `reports:schedule`?** | Both / share only / neither | **`reports:share` yes** (Phase 3); **`reports:schedule` no** until V2 ships | **Yes** — gates Phase 3 |
| **D5** | **Chart library in V1?** | Hand-roll (no new dep) / adopt `recharts` in V1 / `recharts` in V2 | **Hand-roll V1** (only KPI/table/bar/line/donut needed); **`recharts` in V2** for scatter/matrix/pivot | **Yes** — gates Phase 3 estimate |
| **D6** | **Audit: one shared admin audit table, or report-specific?** | Shared with E13a / separate `report_audit` | **One shared table** for E13a + Report Studio. Two audit tables is a compliance smell | No — gates Phase 4 |
| **D7** | **Excel in V1?** | Yes (`openpyxl`) / defer to V2 | **Yes.** The only new formatter; enterprise expectation | No |
| **D8** | **Template curation ownership** | Product curates via admin UI in V1 / migrations only in V1 / product curates from day one | **Seed by migration in V1**, add a product admin surface as a follow-on. Templates are the default path, so a curation UI is the V2 priority | No |
| **D9** | **Are the 4 ungranted roles granted now (Phase 0) or under Stage A follow-up?** | Phase 0 / separate Stage A delta | **Phase 0** — the Studio is unusable otherwise | **Yes** |
| **D10** | **Is PDF in scope at all?** | Reuse `reportlab` / rebuild in V2 / omit | **Omit in V1.** Existing output has a hard `LIMIT 50` and is not customer-grade | No |
| **D11** | **How many templates in V1?** *(new in v2)* | 3 / 4–5 / 8+ | **4–5**, each entitlement-gated and curation-passed. More is a curation liability, not a feature | No |
| **D12** | **Report Assistant naming** *(new in v2)* | "AI Assistant" / "Report Assistant" | **"Report Assistant"** in V1 copy, with determinism stated in-UI. Calling a rules engine "AI" misleads users and drags in an AI-governance review the feature does not need (§14.5) | No |
| **D13** | **Pinned vs diverged template default** *(new in v2)* | Pinned / diverged / ask every time | **Pinned by default, one-click unpin**, updates offered with a diff and never auto-applied (§5A.4) | No |
| **D14** | **V3 AI model hosting** *(new in v2)* | MAP Nexus-operated / customer-selected provider / BYO only | **Customer-selected or BYO, tenant-configured.** No MAP Nexus-operated model by default — required for regulated financial-services adoption | No — gates V3 only |
| **D15** | **Data-layer library policy** *(new in v2)* | Add pandas / Polars / Plotly / none in V1 | **None in V1.** Aggregation is server-side SQL; no Python AI library, no dataframe or server-chart library. Reconsider Polars only if a real matrix/pivot case appears | No |

---

## 30. Explicitly out of scope for this package

- No code, migrations, schema or config changes
- No commits or pushes
- No changes to the existing Report Suite, `ReportSuiteService`, or `reportSections.tsx`
- No new entitlement architecture
- No new permission architecture
- **No AI implementation of any kind** — no LLM, no external AI service, no Python AI library, no AI API cost. The V1 Report Assistant is metadata/rules-driven (§5B) and the AI Analyst is V3 (§14)
- No data-layer dataframe or server-charting library (no pandas / Polars / Plotly in V1) (§0A)
- No scheduling or distribution implementation
- No PDF or Excel implementation
- No template or recipe curation admin surface in V1 (seeded by migration; a follow-on — D8)
- No remediation of R1–R4 here — those are separate work packages, R1 urgent on its own timeline
