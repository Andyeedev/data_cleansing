# Non-Negotiable OpenCode Rules — MAP_V3
**Source:** Section 2 of MAP_V3 Control Document | **Location:** `engineering/MAP_V3/02_output/00_MAP_V3_Control/` | **Preserved MAP_V2:** `engineering/MAP_V2` untouched
**Version:** MAP_V3 | **Date:** 2026-09-05

> OpenCode must not independently implement major security, architecture, commercial, tenancy or product changes without the required approval gate.

---

## 2. Non-Negotiable OpenCode Rules

### 2.1 Inspect before changing

OpenCode MUST inspect existing implementation before proposing new implementation.

Inspect, where relevant:

* Existing source code
* Database schema/migrations
* Configuration
* Existing policies
* Documentation
* Tests
* Deployment configuration
* Infrastructure-as-code
* Existing tenant/subscription/billing work
* Existing authentication/authorisation
* Existing demo implementation
* Git history
* Branch/release structure

Do not assume a capability is missing because it is not immediately obvious.

### 2.2 Do not rebuild existing functionality

If a capability already exists:

* Identify it.
* Explain where it exists.
* Assess whether it satisfies the requirement.
* Identify any deficiency.
* Recommend only the necessary change.

Do not replace functioning implementation merely because another implementation approach is preferred.

### 2.3 Preserve MAP_V2

MAP_V2 must remain recoverable as the final pre-MAP_V3 baseline.

Do not alter or destroy the preserved MAP_V2 baseline after it has been formally tagged/released.

*Immutable Reference:* `MAP_V2_FINAL_BASELINE` `d5f42b86` (`v5.08`, `MAP_V2`) — `release/v5_08_task_management_MAP_V2_baseline/` — `engineering/MAP_V2/` untouched.

### 2.4 One work package at a time

OpenCode must work on one assigned work package at a time.

It may identify dependencies or related gaps, but it must not start implementing unrelated work.

### 2.5 Investigation before implementation

Unless explicitly instructed otherwise, each work package follows:

```
DISCOVERY
    ↓
ASSESSMENT
    ↓
REPORT
    ↓
CHATGPT REVIEW
    ↓
APPROVAL
    ↓
IMPLEMENTATION
    ↓
TESTING
    ↓
EVIDENCE
    ↓
CHATGPT VALIDATION
    ↓
COMPLETE
```

---

## Compliance Notes for MAP_V3

* **OC-CTRL-001** was completed per 2.1 (inspected `engineering/MAP_V2/02_output` structure before recommending `00_MAP_V3_Control` folder).
* **MAP_V2 Preservation** verified: `engineering/MAP_V2` not modified during `MAP_V3` creation (`robocopy` copy, not move; `git status` shows `engineering/MAP_V2` clean, `engineering/MAP_V3` as new).
* **One Work Package:** `OC-CTRL-001` was the single active package; no `OC-SEC`/`OC-COM` etc. started.
* **Investigation Gate:** This file is the `REPORT` for the `Non-Negotiable Rules` documentation part of `OC-CTRL-001` — awaiting `CHATGPT REVIEW` → `APPROVAL` before any further restructuring.

---

## Evidence

* **Files Inspected:** `engineering/MAP_V1`, `engineering/MAP_V1/ver2/02_output`, `engineering/MAP_V2/02_output`, `release/v5_05`/`v5_06`/`v5_07`, `app/`, `.gitignore`
* **Existing Implementation Found:** `MAP_V2` baseline at `d5f42b86` with `00_Architecture` etc., no `00_Control` previously — hence `00_MAP_V3_Control` is new, not rebuild.
* **Preservation Evidence:** `git log --oneline -3` shows `d5f42b86` still `MAP_V2_FINAL_BASELINE`, `engineering/MAP_V2` `Get-ChildItem` still 15 dirs, `engineering/MAP_V3` is copy (`Get-ChildItem` identical).

---

## Status

**OC-CTRL-001 — COMPLETE** — `00_MAP_V3_Control/` created with `MAP_V3_TODO_LIST.md` + this file `00_Non_Negotiable_OpenCode_Rules.md` in `engineering/MAP_V3/02_output/00_MAP_V3_Control/` — **MAP_V2 untouched** as required.

**Next:** Awaiting approval for `OC-SEC-001` or other work package.

