# Prompt 17 – Enterprise Business Process Model

---

# Generate_00_Arch_Prompt_17_Enterprise_Business_Process_Model_v2

## Objective

Produce a complete **Enterprise Business Process Model** for the MAP Nexus Enterprise Migration Assurance Platform.

This prompt follows **Prompt 16 – Enterprise Business Capability Model** and transforms business capabilities into complete end-to-end enterprise business processes.

This is **NOT** a software design exercise.

This is **NOT** a workflow implementation exercise.

This is an **Enterprise Business Architecture exercise** that documents how the organisation operates using the MAP Nexus platform.

---

# Scope

Produce a complete business process architecture including:

* Enterprise Process Catalogue
* End-to-End Business Processes
* Process Decomposition
* BPM Process Flows
* Capability-to-Process Traceability
* RACI Matrices
* Process Ownership
* Process Maturity
* Process Automation Assessment
* Process KPIs
* Business Event Model
* Business Rules
* Decision Points
* Process Integration
* Gap Analysis
* Improvement Roadmap

The deliverables must be suitable as enterprise governance documentation.

---

# Mandatory Principles

## 1. Evidence First

Every statement shall be supported by one of the following:

* Existing source code
* Existing database schema
* Existing APIs
* Existing services
* Existing documentation
* Explicit business requirements

Where evidence does not exist:

State clearly

**"Not evidenced in current implementation."**

Do NOT invent functionality.

---

## 2. Separate Current State from Recommendations

Every report must distinguish between:

### Current State

What exists today.

### Target State

What should exist.

### Recommendation

How to close the gap.

Never mix current implementation with future recommendations.

---

## 3. Enterprise Scope

Clearly distinguish between:

* MAP Nexus Product Processes
* MAP Operating Organisation Processes
* Customer Processes
* External Enterprise Processes

Do not classify missing ITIL processes as product gaps unless they are explicitly within project scope.

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
# Required Reports

Generate:

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

11_Process_Ownership_Model.md

12_Business_Event_Model.md

13_Process_KPI_Framework.md

14_BPMN_Enterprise_Model.md

---

# Additional Mandatory Requirements

## Process Ownership

Every process must identify:

* Executive Sponsor
* Business Owner
* Process Owner
* Data Owner
* Application Owner
* Technical Owner
* Operational Owner
* Support Owner

---

## Business KPIs

Every major process shall include measurable KPIs.

Examples include:

* Cycle Time
* Lead Time
* Throughput
* SLA
* Success Rate
* Failure Rate
* Rework %
* Automation %
* Average Resolution Time
* Approval Time
* User Adoption
* Customer Satisfaction (where applicable)

Each KPI must include:

* Definition
* Formula
* Data Source
* Measurement Frequency
* Target Value (where evidenced)
* Owner

---

## Business Event Model

Identify formal enterprise events.

Examples:

* Migration Requested
* Project Created
* Connection Verified
* Dataset Discovered
* Mapping Approved
* Rule Approved
* Validation Started
* Validation Completed
* Governance Calculated
* Release Approved
* Report Generated
* Project Closed

For each event include:

* Trigger
* Producer
* Consumer
* Payload
* Business Meaning
* Downstream Processes

---

## BPMN Alignment

In addition to text flow diagrams, provide BPMN-aligned descriptions using:

* Start Events
* End Events
* Intermediate Events
* Human Tasks
* Service Tasks
* Exclusive Gateways
* Parallel Gateways
* Message Events
* Timer Events
* Exception Paths

Formal BPMN XML is not required.

---

## Capability Traceability

Every process shall reference the corresponding Capability IDs from Prompt 16.

No orphan capabilities.

No orphan processes.

Provide complete many-to-many traceability.

---

## Automation Assessment

Automation must be assessed independently from maturity.

Automation Levels:

0 Manual

1 Assisted

2 Semi-Automated

3 Automated

4 Self-Healing

Provide evidence for each assessment.

---

## Maturity Assessment

Use CMMI-style maturity:

1 Initial

2 Repeatable

3 Defined

4 Managed

5 Optimised

Every maturity score must include supporting evidence.

---

## Gap Analysis Rules

Classify gaps as:

* Missing Product Process
* Missing Enterprise Process
* Manual Activity
* Integration Gap
* Automation Gap
* Governance Gap
* Data Gap
* KPI Gap
* Ownership Gap

Every gap must include:

* Evidence
* Business Impact
* Recommendation
* Priority

---

## Improvement Roadmap

Recommendations must be evidence-based.

Avoid unsupported effort estimates.

If estimates are provided they must clearly state:

"Indicative estimate based on architectural assessment."

Organise improvements into:

* Quick Wins
* Short Term
* Medium Term
* Long Term

Each recommendation shall identify:

* Business Value
* Dependencies
* Risks
* Expected Outcome

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


# Output Quality Requirements

The resulting reports shall:

* Be internally consistent
* Use identical terminology throughout
* Clearly separate Current State and Target State
* Avoid speculation
* Avoid invented functionality
* Reference evidence wherever possible
* Be suitable for enterprise governance approval
* Be suitable as long-term architecture policy documentation

The completed Prompt 17 v2 deliverables should represent the definitive Enterprise Business Process Model for MAP Nexus.

















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


