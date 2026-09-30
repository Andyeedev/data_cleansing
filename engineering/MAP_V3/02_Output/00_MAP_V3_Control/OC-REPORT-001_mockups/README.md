# OC-REPORT-001 — mockup and summary artefacts

**Status:** PLAN ONLY — design artefacts. No application code, migrations, or commits.

---

## Artefact index

### Current (v2) — matches the adopted direction

| File | What it shows | Status |
|---|---|---|
| `v2-option-b-dashboard-studio.html` / `.png` | **Option B — Dashboard Studio.** Curated-template gallery, section stack, section settings, and the Report Assistant panel docked in the right rail. Template provenance banner + "pin to template updates" | ✅ **SELECTED for V1** |
| `v2-report-assistant.html` / `.png` | **Built-in Report Assistant.** The "Create a report" start screen: 5 curated templates + blank report, entitlement gating, and the deterministic 3-step assistant (match recipe → constrained questions → resulting definition) | ✅ **SELECTED for V1** |
| `v2-option-c-analysis-workspace.html` / `.png` | **Option C — Analysis Workspace.** Filter rail, result set with switchable view lens, "unsaved definition" bar | 🔷 **V2** |
| `v2-option-a-canvas-builder.html` / `.png` | **Option A — Canvas Builder.** Component palette, 12-col grid, properties panel. Carries a "not selected" banner | ⛔ **DEFERRED** |
| `OC-REPORT-001_Onscreen_Summary_for_ChatGPT.md` | Shareable 11-section on-screen implementation summary | v2 |

### Superseded (v1) — retained for the record

| File | Note |
|---|---|
| `option-a-canvas-builder.html` / `.png` | v1 three-option comparison, pre-decision |
| `option-b-dashboard-studio.html` / `.png` | v1 Option B, before templates/assistant |
| `option-c-analysis-workspace.html` / `.png` | v1 Option C, pre-decision |
| `mockup.css` | Shared stylesheet used by all v1 and v2 mockups |

---

## What changed in v2

Founder decision: **keep Option B**, and add the built-in deterministic Report Assistant as a V1 capability.

| Change | Detail |
|---|---|
| **Option B selected** | D1 resolved. C → V2, A → deferred |
| **Template architecture strengthened** | Templates promoted to a first-class, versioned, centrally-maintained catalogue. Instantiate → editable definition, pin/diverged update semantics, entitlement-filtered gallery, curation gate. 4–5 templates + blank report |
| **Report Assistant added as V1** | Deterministic, rules-driven, vendor-neutral. Recipe catalogue + weighted keyword match + 2–4 constrained questions. **No LLM, no external AI, no AI API cost** |
| **Roadmap re-cut** | V1 templates + assistant → V2 analysis workspace, scatter/matrix/pivot, richer assistant, scheduling → V3 optional AI Analyst / Copilot, customer-selected or BYO LLM, governed tools only |
| **Library policy made explicit** | No Python AI library, no LLM SDK, no chart library, no pandas/Polars/Plotly in V1. Aggregation stays server-side SQL |
| **A and C re-labelled** | Not deleted — they are roadmap options, and both banners state their status so they cannot be mistaken for live designs |

---

## Full plan

`../OC-REPORT-001_Report_And_Analytics_Studio_Architecture_and_Implementation_Plan.md` (revision v2)

Key new sections: **§0A** decision record · **§5A** template architecture · **§5B** built-in Report Assistant · **§14** V1→V2→V3 assistant roadmap.

---

## Rendering notes

The mockups are **standalone HTML with no external dependencies** — no CDN, no build step, no framework. They open directly from disk in any browser and can be re-screenshotted at any viewport.

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$dir = (Resolve-Path "engineering\MAP_V3\02_Output\00_MAP_V3_Control\OC-REPORT-001_mockups").Path
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
    --window-size=1600,1000 --screenshot="$dir\v2-report-assistant.png" `
    ("file:///" + ($dir -replace '\\','/') + "/v2-report-assistant.html")
```

Mock data is fictional and illustrative; entity names, control IDs and exception IDs are not drawn from any customer dataset.
