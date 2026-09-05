# Generate_00_Arch_Prompt_21_Enterprise_Runtime_Metadata_Contract

Task: Resolve Policy Gap PG-1 only.

Context:
Phase 3.5 verified that no approved runtime metadata contract exists within the approved MAP architecture.

Objective:
Create a new architecture document that defines the canonical runtime metadata contract used by MAP.

Requirements:
- Architecture only.
- No implementation.
- No code.
- No database changes unless absolutely required.
- Must fit the existing MAP architecture.
- Must not redesign the platform.
- Define only the minimum metadata required for:
  - capability identification
  - routing
  - navigation
  - permissions
  - API mapping
  - frontend generation
  - CLI/API/frontend traceability

Deliverables:
1. New architecture document.
2. Cross references to existing architecture documents.
3. Any architecture updates required.
4. State whether navigation is part of this metadata contract or requires a separate architecture document.

Do not modify existing implementation.
Do not create frontend designs.
Do not invent new business capabilities.


---
# Required Deliverables

Produce a draft document.
# Working Output

Generate artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └──21_Enterprise_Runtime_Metadata_Contract.md


---


# Production Promotion

Only promote to production after engineering review draft document:

to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └──21_Enterprise_Runtime_Metadata_Contract.md
            
















# Generate_00_Arch_Prompt_20_Enterprise_Implementation_Architecture.md

---

# PROMPT 20 — ENTERPRISE IMPLEMENTATION ARCHITECTURE

You are acting as a **Senior Enterprise Architect, Technical Architect, Software Architect, DevOps Architect, Security Architect, Database Architect and Technical Documentation Specialist**.

Your task is to document the **current implemented implementation architecture** of the MAP Nexus platform.

This is the **final architecture document** in the Architecture Documentation series.

This prompt documents **how the implemented solution is physically constructed, configured, executed and deployed**, based entirely on repository evidence.

---

# Objective

Produce a complete technical description of the implemented platform including:

* implementation architecture
* physical implementation
* repository implementation
* execution implementation
* configuration implementation
* infrastructure implementation
* deployment implementation
* build implementation
* operational implementation

Document **only what exists today**.

---

# Evidence Sources

Analyse the repository including:

* Python source
* React source
* SQL
* Docker
* Docker Compose
* GitHub Actions
* Terraform
* YAML
* JSON
* configuration files
* package.json
* requirements.txt
* pyproject.toml
* environment files
* startup scripts
* shell scripts
* PowerShell scripts
* database scripts

Every statement must be supported by evidence.

---

# Mandatory Rules

## Repository Only

Document only implemented functionality.

If something is not present, state:

> Not currently implemented.

Do not speculate.

---

## No Recommendations

Do NOT include

* improvements
* redesign
* future architecture
* roadmap
* target state
* technical debt recommendations

This prompt is documentation only.

---

## Exact Values

Do not estimate.

Examples:

✔ Python 3.11.8

✔ React 19.2.7

✔ PostgreSQL 15

✔ Docker Compose v2

If the version cannot be determined:

> Version not identified.

Never use:

* latest
* approximately
* around
* ~
* assumed

---

## Evidence Required

Every section must reference repository evidence.

Example

Evidence:

Dockerfile

docker/docker-compose.yml

package.json

requirements.txt

app/main.py


---

# Required Deliverables

Produce the following markdown documents.
# Working Output

Generate all artefacts into the temporary engineering output area.

engineering/
└── MAP_V2/
    └── 02_Output/
        └──20_Enterprise_Implementation_Architecture/
---



## 01_Executive_Summary.md

Include

* implementation overview
* runtime summary
* deployment summary
* build summary
* implementation statistics

---

## 02_Runtime_Implementation.md

Document

* application startup
* process lifecycle
* runtime flow
* execution sequence
* background workers
* scheduled tasks
* thread usage
* async execution

Provide Mermaid sequence diagrams.

---

## 03_Build_Architecture.md

Document

Backend

* Python packaging
* requirements
* dependency installation

Frontend

* npm
* Vite
* TypeScript compilation
* build output

---

## 04_Deployment_Implementation.md

Document

Current deployment implementation.

Include

* Docker
* Docker Compose
* container layout
* startup order
* exposed ports
* mounted volumes
* environment variables

If cloud deployment scripts exist

document them.

---

## 05_Infrastructure_Implementation.md

Document implemented infrastructure.

Examples

* Terraform
* Azure resources
* networking
* storage
* compute
* security groups

Document only repository evidence.

---

## 06_Configuration_Implementation.md

Document

* YAML
* JSON
* environment variables
* application configuration
* runtime configuration
* feature flags

Include configuration hierarchy.

---

## 07_Database_Implementation.md

Document

Current implementation.

Include

* schemas
* physical organisation
* naming conventions
* indexes
* constraints
* triggers
* functions
* views
* sequences

Reference Prompt 18 where appropriate.

---

## 08_Backend_Implementation.md

Describe implementation of

* packages
* modules
* services
* repositories
* adapters
* dependency injection
* factories
* registries

Include package dependency diagrams.

---

## 09_Frontend_Implementation.md

Document

* application structure
* portals
* routing
* layouts
* components
* hooks
* services
* API layer
* authentication
* dashboard framework

---

## 10_Execution_Implementation.md

Document

actual execution pipeline.

Include

* batch execution
* rule execution
* control execution
* orchestration
* retry
* checkpoint
* governance

Provide Mermaid sequence diagrams.

---

## 11_Security_Implementation.md

Document

implemented

* JWT
* authentication
* RBAC
* middleware
* Fernet encryption
* audit logging
* CORS
* secrets
* password hashing

No recommendations.

---

## 12_Logging_Audit_Implementation.md

Document

implemented

* logging
* audit
* monitoring
* diagnostics
* telemetry

Document log locations and formats where available.

---

## 13_CICD_Implementation.md

Document

implemented

* GitHub Actions
* build pipelines
* testing
* deployment workflow

If absent

state

> Not currently implemented.

---

## 14_Directory_Implementation.md

Provide an implementation-focused repository structure.

Include only architecturally significant folders.

Use a clean tree with omitted sections shown as:

```
...
```

---

## 15_Implementation_Dependency_Graph.md

Produce Mermaid diagrams showing

* package dependencies
* module dependencies
* service dependencies
* execution dependencies

---

## 16_Implementation_Statistics.md

Provide factual repository statistics.

Examples

* Python modules
* React files
* API routes
* Services
* Components
* Database schemas
* Tables
* Views
* Docker files
* Workflow definitions

Only use counts that can be derived from repository evidence.

---

## 17_Implementation_Decision_Record.md

Document implementation decisions visible in the repository.

Examples

* Factory Pattern
* Registry Pattern
* Adapter Pattern
* Layered Architecture
* DAG Execution
* Multi-tenant Design

For each include

* decision
* implementation
* evidence

---

## Diagram Requirements

Use Mermaid for

* runtime flow
* deployment
* dependency graphs
* execution pipeline
* package structure
* startup sequence

Do not use ASCII diagrams.

---

# Final Instruction

This is the **final architecture prompt**.

The documentation produced must accurately describe the **implemented MAP Nexus platform**, providing an authoritative implementation baseline for future engineering work.

No redesign.

No assumptions.

No recommendations.

Evidence only.


---


# Production Promotion

After engineering review and explicit user approval, promote all:



to

engineering/
└── MAP_V2/
    └── 00_Architecture/
        └──20_Enterprise_Implementation_Architecture/
            (same files)
