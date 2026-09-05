# MAP Nexus — 4-Week Soft Launch Plan
**Status:** Approved for Market Validation | Early Public Phase | Not Enterprise Launch
**Folder:** `engineering/MAP_V2/02_output/08_Soft_Launch/`

> Objective: Put MAP Nexus proposition in front of market, learn which industries/use cases respond most, find 2 design partners. Not development, not research.

## Positioning
**MAP Nexus — Migration Assurance & Data Validation**
> Helping organisations prove migrated data is correct, complete, reconciled, structurally valid and ready for cutover.

Early market-validation stage. Financial services is an important early validation segment (accuracy/reconciliation/governance critical) but not the product definition. Do not present as mature SaaS or banking-only. No claims of large customers, revenue, SOC2, production banking.    

## Capabilities (Public-Safe, High Level)
Migration assurance & data validation: financial and non-financial data migration validation, source-to-target, discovery, profiling, mapping, automated validation, reconciliation, quality, schema/referential, anomaly detection, governance, auditability, repeatable validation, cloud/hybrid, Snowflake/Azure SQL/PostgreSQL, Python data engineering. FS remains key early validation market.

**Evidence Translation:** `Successfully tested across Snowflake (Azure), Azure SQL and PostgreSQL with automated discovery, mapping and validation in isolated tenants.` — No `MAP_CERTIFICATION_SOURCE`, `CERT_SCHEMA`, `b8c16399...` etc.

## IP Protection (Must Not Publish)
`IVVRAYS-FS67669`, tenant/project/batch IDs, `MAP_CERT_*`, `CERT_SCHEMA`, `C01-C010`, `core.dataset_mappings`, Terraform `rg-*/kv-*/warehouse`, JWT/Key Vault implementation, `AdapterRegistry/ConnectionPoolManager`, exact SQL, proprietary mapping/rule logic. Public: `Automatically compares migrated datasets and identifies discrepancies before cutover.`

## Week 1 — Foundation + Positioning (Corrected per broader positioning)
- Review existing brand/LinkedIn/website/demo docs (see `MAP_Nexus_Week_1_Deliverables.md` for asset audit) — reuse, update FS-narrow claims to broad
- Founder LinkedIn: Edward Odewale, Founder MAP Nexus — data + migration + analytics + data engineering + migration assurance across FS, pharma, housing, government, enterprise
- Company presence: Draft `MAP Nexus — Migration Assurance & Data Validation` (broad), FS as early validation segment (check no duplicate)
- Website: Determine publish-now vs update vs private; landing sufficient with broad proposition
- **Deliverables:** Founder LinkedIn copy, Company-page copy, Banner, Website delta, Public positioning statement, Public-safe product description, Prohibited claims list, Private technical list

## Week 2 — First Public Content (2-3 founder-led posts) — Broad problem, FS as example
- **Post 1 Problem:** How do organisations know migrated data is actually correct? Is row-count enough? What happens when relationships/data quality wrong?
- **Post 2 What We're Building:** MAP Nexus — who for (organisations undertaking significant migrations, FS early focus), what does high-level, why created, founder learnings across FS/pharma/housing/government
- **Post 3 Build/Progress:** Discovery → Mapping → Validation workflow, anonymised results only (no identifiers)
- Do not reveal implementation. Founder (Edward Odewale) leads → Company Page as official presence. Financial services mentioned as early validation, not exclusive.

## Week 3 — Market Validation (Target: 10 discovery calls → 2 design partners)
Audience: Initial FS (challenger banks, building societies, insurers) **plus** pharma, government, housing, healthcare, enterprise — test which responds most. Roles: migration programme, head of data, data engineering, governance, transformation.
Proposition: `We're speaking with teams involved in data migration and validation to understand where reconciliation and migration assurance are still painful. I'd like to learn how you currently approach it.` (FS as example, not restriction)
Record: org type/sector, migration activity, validation approach, pain, manual effort, failures, tools, trial/partner interest. Do not publish interview data.

## Week 4 — Demo + Design Partner Conversion
Demo (10-15 min): 1 Problem 2 Source/target concept 3 Discovery 4 Mapping 5 Validation 6 Discrepancies 7 Reporting 8 Outcome 9 Discussion — Answers `How does MAP Nexus help me know migration is correct?` not implementation.
Target: 2 design partners, feedback on product/positioning/pricing, highest-value use cases. No pricing publish until feedback.

## Success Metrics (Not followers/likes)
LinkedIn conversations, discovery calls, contacts by sector (FS/pharma/government/housing/healthcare/enterprise), demo requests, partner discussions, partners secured, repeated problems/features, trial/willingness to pay. Key Q: `Which industry/use case confirms this is painful enough to want MAP Nexus?`

## What Not To Do
No major dev, redesign, rebuild website, large deck, paid ads, followers, unsupported enterprise/SOC2 claims, publishing architecture/identifiers/code.

## Operating Rule
1 Retrieve 2 Review 3 Reusable? 4 Outdated? 5 Needs update? 6 Produce asset 7 Stop 8 Ask approval before next public asset. Priority: Action → Feedback → Learning → Refinement.

## Source Docs Reviewed
`engineering/MAP_V1`, `engineering/MAP_V1/ver2/02_output` (Brand Kit, 07_Corporate_Identity, CG-*, FH-*), `engineering/MAP_V2/02_output` — full asset audit in Week 1 deliverables.
