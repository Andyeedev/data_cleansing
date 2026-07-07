# Phase 2.10 — Demo Script

**Version:** 2.0  
**Product:** FS Migration Validation Engine  
**Duration:** 10–15 minutes

---

## Objective

Demonstrate how the FS Migration Validation Engine automates data migration validation for Financial Services — from schema discovery through 10 validation controls, objective scoring, release gate enforcement, and audit-ready exports.

---

## Demo Flow

| Section | Duration |
|---------|----------|
| Introduction & Problem | 1 min |
| Platform Overview | 2 mins |
| Schema Discovery | 2 mins |
| Validation Execution (C01–C010) | 3 mins |
| Scoring & Release Gates | 2 mins |
| Audit Export | 2 mins |
| API Integration | 1 min |
| Closing & Business Value | 2 mins |
| **Total** | **~15 minutes** |

---

## 1. Opening (1 Minute)

> "Financial Services institutions migrating data between systems face a critical challenge: how to ensure accuracy, completeness, and regulatory compliance when millions of records are in motion.
>
> Traditional approaches rely on manual sampling, spreadsheets, and custom scripts — which are slow, error-prone, and fail regulatory scrutiny.
>
> The FS Migration Validation Engine automates this process — providing complete validation coverage, objective scoring, governance, and audit-ready evidence."

---

## 2. Platform Overview (2 Minutes)

Show the CLI interface and explain the architecture:

```
FS Migration Validation Engine v1.4
├── 10 Migration Controls (C01–C010)
├── Automated Scoring Engine
├── Release Gate Enforcement
├── Audit Export (CSV)
├── REST API (FastAPI)
└── Docker Deployment
```

> "The engine runs as a CLI tool, REST API, or Docker container. It connects to source and target databases, runs 10 standardised validation controls, scores the results, enforces release gates, and produces audit-ready CSV exports."

---

## 3. Schema Discovery (2 Minutes)

Show the discovery command:

```bash
python app/main.py discover --config config.yaml
```

Highlight:
- Automated connection to source and target databases
- Schema metadata extraction
- Table, column, and relationship discovery

> "The discovery engine automatically connects to source and target databases, extracts schema information, and builds a metadata repository. No manual schema documentation required."

---

## 4. Validation Execution (3 Minutes)

Show the run command:

```bash
python app/main.py run --config config.yaml
```

Walk through controls being executed:

| Control | Description | Example Output |
|---------|-------------|----------------|
| C01 | Row count reconciliation | "PASS — Source: 1,234,567 vs Target: 1,234,567" |
| C02 | Data type validation | "PASS — All column types match" |
| C03 | Nullability check | "PASS — All constraints satisfied" |
| C04 | Primary key integrity | "PASS — No duplicates" |
| C05 | Foreign key integrity | "PASS — All references valid" |
| C06 | Business rule validation | "3 WARNINGS — See exception register" |
| C07–C010 | Additional controls | "PASS / WARN / FAIL per control" |

> "Each control runs independently with failure isolation. Results are captured with unique batch IDs for full traceability. The control dependency DAG ensures correct execution order — C02 waits for C01, C09 waits for C03."

---

## 5. Scoring & Release Gates (2 Minutes)

Show the scoring output:

```
Batch: ae40b96c-20da-4972-bb29-bff3c2451ae0
Overall Score: 87/100
Controls Passed: 8/10
Controls Warning: 2/10
Controls Failed: 0/10

RELEASE GATE: PASSED (minimum 80% threshold met)
Migration: APPROVED
```

> "The scoring engine produces objective, repeatable quality metrics. The release gate enforces a minimum quality threshold — if the score drops below 80%, the migration is blocked."

---

## 6. Audit Export (2 Minutes)

Show the export command:

```bash
python app/main.py export --config config.yaml --batch-id <id>
```

Show sample CSV output:

```
batch_id,control_id,status,score,exceptions,timestamp
ae40...,C01,PASS,100,0,2026-06-23 10:00:00
ae40...,C02,PASS,100,0,2026-06-23 10:00:05
ae40...,C06,WARN,70,3,2026-06-23 10:00:30
```

> "Every validation execution produces a complete audit trail — suitable for regulatory review. No manual evidence gathering required."

---

## 7. API Integration (1 Minute)

Show a sample API call:

```bash
curl -X POST https://api.example.com/api/v1/validate \
  -H "Content-Type: application/json" \
  -d '{"project_id": "ae40...", "controls": ["C01","C02"]}'
```

> "The FastAPI REST API enables integration with existing CI/CD pipelines, deployment workflows, and enterprise toolchains."

---

## 8. Closing Summary (2 Minutes)

> "In just a few minutes, we've demonstrated:
>
> ✅ **Automated schema discovery** — No manual analysis required
> ✅ **10 structured validation controls** — Complete, standardised coverage
> ✅ **Objective scoring** — Repeatable quality metrics
> ✅ **Release gate governance** — Automated migration approval/blocking
> ✅ **Audit-ready exports** — CSV evidence for regulatory review
>
> The platform is Azure-native, Docker-deployable, and purpose-built for regulated Financial Services data migration.
>
> Our mission is to transform data migration validation from a manual, high-risk exercise into an automated, governed, and audit-ready process."

---

## Demo Environment Requirements

| Item | Details |
|------|---------|
| **Engine** | Running instance of FS Migration Validation Engine |
| **Databases** | Source and target PostgreSQL databases with demo data |
| **Configuration** | `config.yaml` with DemoBank settings |
| **CLI** | Terminal with Python environment activated |
| **Sample Data** | `sql/demo/` — demo source and target data scripts |
| **Backup** | `engine_backup.sql`, `source_backup.sql`, `target_backup.sql` |

---

## Key Messages to Reinforce

1. **Purpose-built for Financial Services** — Not a generic ETL tool
2. **Automated and repeatable** — Same inputs, same outputs, every time
3. **Governance-first** — Release gates, audit trails, compliance built-in
4. **Lightweight deployment** — Docker-native, deploy in minutes
5. **Azure-native** — Built for the Microsoft ecosystem
6. **Enterprise-ready** — Secure, scalable, auditable