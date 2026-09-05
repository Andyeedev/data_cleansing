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

