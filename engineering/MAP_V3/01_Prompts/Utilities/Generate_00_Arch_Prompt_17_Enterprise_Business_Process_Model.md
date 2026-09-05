# Prompt 17 – Enterprise Business Process Model

---

# Generate_00_Arch_Prompt_17_Enterprise_Business_Process_Model.md

# Prompt 17 (v2.1)

## Enterprise Business Process Model

### MAP Nexus Enterprise Architecture

---

## Objective

Using the latest MAP Nexus source code, database schemas, APIs, architecture documents, Prompt 16 Enterprise Capability Model (v2.x), and all previous architectural outputs, produce a **fully evidence-based Enterprise Business Process Model**.

This version supersedes Prompt 17 v2.0 and incorporates all review findings.

The objective is to document **how the enterprise operates**, not how the software is implemented.

Every statement must be derived from evidence in the repository.

No assumptions.

No invented processes.

No placeholder architecture.

---

# Scope

Generate a complete enterprise process architecture covering every business capability identified in Prompt 16.

The output must contain:

1. Executive Summary
2. End-to-End Business Process Catalogue
3. Business Process Decomposition
4. BPM Process Flows
5. Capability-to-Process Traceability
6. RACI Matrices
7. Process Maturity Assessment
8. Automation Assessment
9. Process Gap Analysis
10. Enterprise Process Improvement Roadmap

---

# Mandatory Review Updates (v2.1)

Apply the following corrections before generating any document.

---

## 1. Correct Customer Onboarding

The existing version incorrectly duplicates Authentication.

Customer Onboarding SHALL represent the complete lifecycle of onboarding a new customer organisation.

It should include activities such as:

* Customer registration
* Organisation creation
* Tenant provisioning
* Initial administrator creation
* Licence/subscription allocation
* Initial configuration
* Welcome notifications
* Platform activation

This is **NOT** the login process.

---

## 2. Authentication Process

Authentication SHALL only represent:

* Login
* Credential validation
* MFA (if implemented)
* JWT generation
* Refresh token lifecycle
* Session management
* Logout
* Authentication failure handling

No onboarding activities shall appear here.

---

## 3. Remove Duplicate Business Processes

Ensure every Level 1 process has a unique business purpose.

No duplicated lifecycle descriptions.

No duplicated triggers.

No duplicated outputs.

---

## 4. Tenant Management

Reassess maturity.

If APIs, metadata, configuration and tenant-aware architecture already exist, classify accordingly.

Do not classify as Manual simply because onboarding is not fully automated.

Differentiate between:

* Tenant lifecycle
* Tenant onboarding
* Tenant administration

---

## 5. Governance Integration

Governance shall explicitly reference integration with:

* Notifications
* Workflow
* Task Management
* Reporting
* Dashboard production
* Release Approval

Describe both:

Current implementation

and

Planned enterprise integration

where evidence exists.

---

## 6. Reporting

Retain evidence that reporting currently uses SQL views.

Where roadmap evidence exists, note that:

* Reporting API is planned
* Dashboard API is planned

Clearly distinguish:

Current State

Target State

---

## 7. Platform Service Alignment

Ensure complete alignment with Prompt 16 capability catalogue.

Platform Services shall include:

* Workflow
* Tasks
* Notifications
* Calendar/Scheduling
* Authentication
* Customer Onboarding

No overlap.

No duplicated responsibilities.

---

# Evidence Requirements

Every process SHALL include evidence.

Evidence may reference:

* Python modules
* API endpoints
* SQL tables
* Views
* Stored procedures
* Metadata
* Configuration
* Event subscriptions
* Platform services

If evidence does not exist, explicitly state:

"Not implemented"

or

"Planned"

Never fabricate evidence.

---

# Enterprise Rules

Document the business process.

Not code.

Not implementation detail.

Describe:

* Why the process exists
* Business objective
* Trigger
* Inputs
* Outputs
* Actors
* Owners
* Supporting roles
* Start event
* End event
* Business rules
* Dependencies
* Upstream processes
* Downstream processes
* Related capabilities
* Supporting systems
* Evidence

---

# Consistency Rules

All documents shall use identical:

* Process names
* Capability names
* Domain names
* Maturity levels
* Automation levels
* Ownership

Cross references must remain consistent throughout all reports.


--


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

Produce:

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

# Success Criteria

The completed Enterprise Business Process Model shall:

* Align 100% with Prompt 16 Capability Model
* Remove duplicated business processes
* Correct Customer Onboarding vs Authentication
* Reflect actual implementation evidence
* Clearly distinguish Current vs Target state
* Maintain enterprise architecture consistency
* Be suitable for formal architecture review and governance approval

---


# Production Promotion

After engineering review and explicit user approval, promote all:



to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └── 17_Enterprise_Business_Process_Model/
            (same files)



**Version:** 2.1

**Status:** Engineering Review Prompt













