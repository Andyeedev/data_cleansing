# MAP_CLI_MVP_Execution_Plan.md

At the start of every phase, require you to perform this check:


1) Never modify approved policy documents. Treat them as read-only. All work must trace back to the approved policies. If the policies are insufficient or inconsistent, stop and report the issue instead of making assumptions.

2) Before making any changes, verify whether the requested work already exists in the approved architecture or policy. Reuse existing approved work whenever possible. Do not recreate, redesign, or duplicate approved artefacts. If inconsistencies are found, stop and report them instead of making assumptions.

3) Verification always precedes implementation. If verification is incomplete or policy coverage is uncertain, stop and produce a report instead of writing code.
---


# Authoritative Source

Approved architecture defines capability intent and constraints.
It does not imply that every implementation detail already exists.
Where implementation details are absent from approved architecture, the execution tool must report the gap and stop rather than infer the design.


Every implementation item must include a traceability reference back to the originating approved policy document and section. If no traceability exists, stop and report the gap instead of implementing.


Approved Policy Scope:

All documents under:

engineering/
└── MAP_V2/
    └── 00_Architecture/

are authoritative.
The executing agent must read all documents relevant to the requested phase.

The agent must not assume that a single document contains the complete requirement.

Begin with the Master Architecture Index (or Master Roadmap if that's your top-level document), then follow all referenced architecture documents. The implementation tool is responsible for determining the complete dependency chain. It must not ask the user which documents to read.



When referring to architecture, always use the approved document names and paths under engineering/MAP_V2/00_Architecture/. Never refer to documents by prompt numbers or conversation references.

The execution tool shall not state which documents are relevant until the dependency chain has been traversed. Any list of relevant documents must be the result of that traversal, not an assumption.
---


# MAP CLI Alignment Rule

The approved policy is the authority. The current MAP CLI implementation is the current implementation. If they differ, the policy takes precedence. The implementation must never redefine the policy.

- Every approved policy capability must be traceable to one or more MAP CLI capabilities.

- Every MAP CLI capability must be traceable back to the approved policy.

- If a policy item cannot be mapped to MAP CLI, report it as Policy Not Implementable.

- If a MAP CLI capability has no corresponding approved policy, report it as CLI Not Governed.

- No implementation may proceed until this bidirectional traceability has been verified.

- The execution tool must not infer new enterprise capabilities from the current implementation. Existing code may only be used to verify implementation status against the approved policy.


## Canonical Capability Rule

Each business capability shall exist only once within the approved architecture.

If the same capability is found represented multiple times (different names, menus, workflows or implementations), the execution tool shall:

- identify all duplicates;
- trace each duplicate back to the approved architecture;
- nominate the canonical capability;
- record all duplicates in the Capability Verification Report;
- do not merge or remove duplicates without explicit approval.

## Duplicate Capability Handling Rule

Duplicate capabilities found in existing implementations must not be automatically removed, merged, or preserved as separate capabilities.

The execution tool shall:

- identify duplicate capability representations;
- trace each representation back to approved policy sources;
- determine whether duplicates represent:
  - the same canonical capability,
  - different capability scopes,
  - legacy implementation artefacts,
  - or unresolved policy ambiguity;
- record findings in the Capability Verification Report.

If duplication exists because the approved policy is ambiguous or inconsistent, record the issue as a Policy Gap.

No capability consolidation, deletion, renaming, or redesign shall occur without explicit architecture approval.

---

# Produce a Baseline Inventory:

- Current MAP CLI implementation status (inventory only)
- Current backend implementation status (inventory only)
- Current frontend implementation status (inventory only)
- Current database implementation status (inventory only)

No assessment, recommendations or implementation decisions are permitted during the baseline inventory.


---


# Existing Implementation Assessment

The current frontend, backend and MAP CLI are implementation artefacts, not the architectural authority.

Any existing metadata, navigation, contracts or behaviour found in the implementation must be treated as implementation-specific until verified against the approved policy.

Do not treat existing implementation as the enterprise standard.
Report all deviations from policy.


---
# MAP CLI Runtime section app/
- Location of the MAP CLI project:
- How to run it : python -m app.main run --config config.yaml 
- The approved policy is the authoritative source of capability requirements. The MAP CLI engine (app/) is the authoritative implementation of currently implemented capabilities. Any gaps between policy requirements and CLI implementation must be reported and resolved before frontend implementation.

---

# Phase Execution Rule

The execution tool shall not include implementation plans, recommendations, assumptions, or summaries for future phases. Its response shall be limited to the currently executing phase only. Future phases may only be referenced where explicitly required by the current phase.

The execution tool shall not ask the user whether to proceed with the first phase. Execution begins with Phase 1. Approval is required only after completion of the current phase.

The execution tool shall not produce an overall implementation analysis, programme summary, architecture summary, current-state assessment, or multi-phase implementation plan. The response shall contain only the activities, findings, and report required for the currently executing phase.

When executing a phase, the response shall contain only:

- the verification activities for that phase;
- the findings from that phase;
- the required report for that phase;
- any policy or implementation gaps discovered during that phase.

The execution tool shall not include:

- programme summaries;
- phase summaries;
- implementation roadmaps;
- future phase descriptions;
- future work;
- clarification questions unless execution of the current phase is impossible.

When executing a phase, the execution tool shall not discuss findings, blockers, architecture elements, implementation status, or reports belonging to later phases. Such items shall only appear during the phase in which they are verified.

The execution tool shall execute one phase only.

It shall not analyse, plan, design or speculate about later phases except where explicitly required by the current phase.

At the completion of each phase it shall:

- Produce the required report.
- State whether the phase passed or failed.
- List any policy gaps or implementation gaps.
- Stop execution.
- Wait for explicit user approval before proceeding.

---

###  Phase 1 – Freeze Current Frontend

The frontend-mvp directory must not be created during Phase 1.
Creation begins only in Phase 4 after all approval gates are passed.

The frozen frontend must not be used as an architectural or design authority. It may only be assessed during Phase 5 for potential reuse of approved presentation-only components.
Goal

- Freeze the entire existing frontend. No new functionality may be added. It becomes a read-only reference implementation. Only inventory and comparison activities are permitted.
- Mark it as Reference Only.
- No new functionality.
- Inventory reusable UI components.



Gate
➡ Wait for approval before proceeding.

- Produce a Freeze Report.
- Reports directory creation may occur only when the first approved phase report is produced.

---


###  Phase 2 – Extract capabilities from the approved policy, then verify each capability against the current MAP CLI implementation. The approved policy remains the authoritative source.

Goal

- Capability extraction shall begin at the business capability level defined by the approved policy. Drill down to CLI, API, metadata, database and frontend only where necessary to prove complete traceability.
- Identify anything missing.
- Produce a Capability Verification Report showing:
- Covered
- Missing
- Ambiguous
- Duplicate


Gate
➡ Wait for approval.


---


###  Phase 3 – Verify Capability Mapping

Goal
Verify every capability has complete mappings:

- Policy
- CLI Command
- Metadata
- Database
- Runtime Generation
- Frontend Consumer
- Existing implementation metadata may exist within the current frontend. It may be examined only to assess implementation alignment with the approved policy. Do not treat any implementation file, structure or contract as an architectural source or implementation target. 
Phase 3.5 must verify whether these structures align with the approved MAP CLI metadata contract. It must not be assumed to be the target contract.

Produce a Mapping Matrix.
If any capability cannot be fully traced from Policy → CLI → Metadata → Database → Runtime → Frontend, record the gap in the Mapping Matrix.
Do not implement, infer, or resolve missing mappings during this phase.
If the gap prevents Phase 4 progression, mark the phase recommendation as Do Not Proceed.


No implementation.

Gate
➡ Wait for approval.


---

###  Phase 3.5 – MAP CLI Specification Verification

Goal:

Audit the current MAP CLI implementation against the approved policy. Determine which capabilities are already implemented, which are partially implemented, and which approved policy capabilities are not yet implemented by the current MAP CLI. 
Identify whether approved policy capabilities are:
- Implemented by MAP CLI
- Partially implemented by MAP CLI
- Not implemented by MAP CLI

Where gaps exist, record the gap.
Do not design new CLI commands or capability extensions during this phase.


Verify whether an approved metadata contract exists. If none is found, record the finding in the Policy Gap Report. Do not conclude that it is missing until verification is complete. 
Phase 4 cannot proceed until the architecture owner approves a resolution through the approved architecture change process.


- No code changes. If CLI gaps are found, produce a gap report and wait for approval before proposing any CLI changes. Do not continue to Phase 4 until the CLI gap has been resolved or an explicit implementation decision has been approved.
- Do not assume the current command set is complete.
- Verify whether an approved metadata contract, command structure and runtime lifecycle exist.
If missing:
- Record the gap.
- Do not design replacements.
- Do not implement alternatives.

- If required architecture elements do not exist, record the gap only.
Do not design replacement architecture, define new contracts, or propose implementation details during this phase.
Any architecture changes must be handled through the approved architecture change process.

- Do not define, redesign or implement them during this phase.
- Treat all approved architecture documents as read-only.
- If gaps are found:

Create:

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
            └── Policy_Gap_Report.md (only if required)

- Do not edit the policy.


Produce:
MAP_CLI_MVP_Phase_03_5_CLI_Specification_Report.md

Gate: Wait for approval before Phase 4.

# Each report must include:

- Verified against policy
- Deviations found
- Decisions required
- Recommendation (Proceed / Do Not Proceed)
---


### Phase 4 – Implement the frontend foundation using the verified MAP CLI specification and capability mapping produced in Phases 2, 3 and 3.5.

# The new frontend location is fixed and must not change without architecture approval.

Lopcation:

MAP_V2/
└── 03_Source/
    ├── frontend/          (FROZEN - reference only)
    └── frontend-mvp/      (new implementation)

- Do not replace the old frontend.
- Do not clone the old frontend.
- Copy only approved dependencies/patterns after Phase 5 reuse decision.
- Phase 4 shall not begin until the metadata contract, CLI capability mapping, and any Policy Gap Report have been explicitly approved.


# Goal
Create only the foundation:

- Shell
- Layout
- Routing
- Theme
- Dynamic Navigation
- Metadata Renderer

No business pages.
Navigation must be driven only by an approved metadata contract that has been verified and accepted through the Phase 3.5 approval gate.

If no approved metadata contract exists, Phase 4 cannot proceed


--

Gate
➡ Wait for approval.

---


###  Phase 5 – Reuse Approved Presentation Components


Goal
Compare old frontend with policy.

Reuse only:

- Layouts
- Styling
- Generic UI components

Reject:

- Hardcoded logic
- Hardcoded navigation
- Hardcoded workflows
- Business logic

Produce a Reuse Decision Report.

- No component may be reused simply because it exists.
- Every reused component must include a reuse justification showing:
i) the component is presentation-only and contains no unapproved business logic, and
ii) it does not conflict with approved architecture principles.

Traceability should reference the relevant architecture area where applicable.

Gate
➡ Wait for approval.

---

After engineering review and explicit user approval, promote approved reports only:

Save every report to:


engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── Reports/
        └── MAP_CLI_MVP_Phase_01_Frontend_Freeze_Report.md
        ├── MAP_CLI_MVP_Phase_02_Capability_Verification_Report.md
        ├── MAP_CLI_MVP_Phase_03_Mapping_Verification_Report.md
        ├── MAP_CLI_MVP_Phase_04_Foundation_Report.md
        └── MAP_CLI_MVP_Phase_05_Component_Reuse_Report.md


---


# Approval gate

At the end of every phase, include a mandatory instruction:

STOP. Do not continue to the next phase. Produce the report, wait for user approval, and only proceed after explicit approval.
