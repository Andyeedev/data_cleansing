# Prompt 17 – Enterprise Business Process Model

---



# Generate_00_Arch_Prompt_17_Enterprise_Business_Process_Model.md

## Objective

Produce the **Enterprise Business Process Model** for the MAP Platform.

This prompt builds directly on:

- Prompt 15 – Enterprise Capability Model
- Prompt 16 – Enterprise Business Capability Model

Prompt 15 identified the platform capabilities.

Prompt 16 organised those capabilities into business capability domains.

**Prompt 17 defines HOW those capabilities work together as end-to-end business processes.**

This is an enterprise architecture deliverable, **not** a software design document.

---

# Required Output Location

Create

```
00_Architecture/
    17_Enterprise_Business_Process_Model/
```

Create

```
02_Outputs/
    17_Enterprise_Business_Process_Model/
```

Both folders must contain identical deliverables.

---

# Required Analysis

Using ONLY the existing source code, configuration, APIs, database schema, workflows and documentation:

Identify every genuine business process implemented by the platform.

Do NOT invent processes.

Do NOT assume future functionality.

---

# Process Discovery

Discover complete end-to-end business processes including (where implemented):

- Customer onboarding
- Tenant onboarding
- Migration project lifecycle
- Connection onboarding
- Credential onboarding
- Metadata discovery
- Dataset discovery
- Column discovery
- Mapping lifecycle
- Rule authoring
- Rule approval
- Rule execution
- Control lifecycle
- Validation execution
- Exception management
- Issue remediation
- Governance
- Release approval
- Reporting
- Dashboard production
- Notifications
- Scheduling
- Workflow management
- Task management
- User lifecycle
- Role administration
- Security administration
- Audit lifecycle
- Platform administration

Only include processes supported by evidence.

---

# Process Definition

For every business process document:

- Purpose
- Business objective
- Trigger
- Inputs
- Outputs
- Actors
- Primary owner
- Supporting roles
- Start event
- End event
- Business rules
- Dependencies
- Upstream processes
- Downstream processes
- Related business capabilities
- Supporting systems
- Evidence

Avoid implementation details inside the process description.

---

# Business Process Decomposition

Decompose every process into

Level 1

Business Process

↓

Level 2

Sub-process

↓

Level 3

Activities

↓

Level 4

Tasks

Only decompose where supported by evidence.

---

# BPM Flow

Produce BPM style process flows.

Include

Start

Activities

Decision points

Exception paths

Approval gates

Completion

Do not generate BPMN XML.

ASCII/text diagrams only.

---

# Capability Traceability

Create a complete matrix

Business Capability

↓

Business Process

↓

Sub-process

↓

Activity

Every capability identified in Prompt 16 must appear.

No orphan capabilities.

---

# Process Ownership

Produce RACI matrices.

Include

Responsible

Accountable

Consulted

Informed

Only use actual platform roles.

---

# Process Maturity Assessment

Assess each process using evidence.

Level 1 Initial

Level 2 Repeatable

Level 3 Defined

Level 4 Managed

Level 5 Optimised

Every maturity assessment must include justification.

Do NOT invent scores.

---

# Automation Assessment

For every process identify

Manual

Semi-automated

Fully automated

Supported by evidence.

---

# Gap Analysis

Identify

Manual activities

Duplicate activities

Approval bottlenecks

Missing integrations

Workflow gaps

Governance gaps

Security gaps

Audit gaps

Notification gaps

Only identify gaps supported by evidence.

---


# Required Deliverables

Produce the following markdown documents.
# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └── 17_Enterprise_Business_Process_Model/
        

---
# Deliverables

Generate

01_Executive_Summary.md

02_End_to_End_Business_Process_Catalogue.md

03_Business_Process_Decomposition.md

04_BPM_Process_Flows.md

05_Capability_to_Process_Traceability.md

06_RACI_Matrices.md

07_Process_Maturity_Assessment.md

08_Automation_Assessment.md

09_Process_Gap_Analysis.md

10_Enterprise_Process_Improvement_Roadmap.md

---

# Mandatory Rules

- Use evidence only.
- Do not invent processes.
- Do not invent maturity scores.
- Do not invent automation levels.
- Separate business architecture from technical implementation.
- Keep API/database references in traceability sections only.
- Every capability from Prompt 16 must map to one or more business processes.
- Every recommendation must reference supporting evidence.
- Maintain complete consistency with Prompts 15 and 16.




---
# Production Promotion

After engineering review and explicit user approval, promote all:



to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── 17_Enterprise_Business_Process_Model/
            (same files)




---
# Output Format

Generate only markdown.

Create each document separately.

No placeholders.

No TODOs.

No omissions.

Each document must be publication quality.


