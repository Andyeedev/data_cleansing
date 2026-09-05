# 05_Terminology_Standard.md

# Master Architecture Consolidation — Phase A
# Terminology Standard

### MAP Nexus Enterprise Architecture

---

## Terminology Inconsistencies Found

| # | Inconsistent Terms | Documents Affected | Recommendation |
|---|-------------------|-------------------|----------------|
| 1 | "MAP Nexus™" vs "MAP Nexus" | 02, 15, 16, 17 | Standardize to "MAP Nexus" |
| 2 | "Migration Engine" / "Validation Engine" / "MAP Engine" | 03, 15, 13, 20 | Standardize to "MAP Nexus Engine" |
| 3 | "Financial Services Migration Validation Engine" | 11 | Deprecate; use "MAP Nexus Engine" |
| 4 | "Reporting Centre" vs "Report Centre" | 02, 15 | Standardize to "Report Centre" |
| 5 | "MAP Copilot" / "AI Copilot" | 00, 16, 17 | Standardize to "MAP Copilot" |
| 6 | "Enterprise Portal" vs "React Frontend" | 00, 15, 19 | Standardize to "Frontend" |

---

## Approved Terminology

### System Names

| Approved Term | Deprecated Terms | Usage |
|---------------|------------------|-------|
| **MAP Nexus** | MAP Nexus™ | Platform name |
| **MAP Nexus Engine** | Migration Engine, Validation Engine, MAP Engine, Financial Services Migration Validation Engine | Backend engine |
| **MAP Nexus Frontend** | Enterprise Portal, React Frontend, Portal | User interface |
| **MAP Nexus Database** | PostgreSQL Database, Engine Database | Data storage |

### Architecture Layers

| Approved Term | Usage |
|---------------|-------|
| **Blueprint Architecture** | Future-state architecture (Documents 00-13) |
| **Current State Architecture** | Evidence-based architecture (Documents 14-20) |
| **Presentation Layer** | Frontend (React, TypeScript) |
| **Application Layer** | API (FastAPI) |
| **Business Logic Layer** | Services, Rules, Governance |
| **Data Access Layer** | Repositories, Adapters |
| **Storage Layer** | PostgreSQL |

### Database Objects

| Approved Term | Usage |
|---------------|-------|
| **Schema** | Database schema (core, engine, platform, reporting, audit) |
| **Table** | Database table |
| **View** | Database view |
| **Function** | Database function |
| **Trigger** | Database trigger |
| **Index** | Database index |

### Components

| Approved Term | Deprecated Terms | Usage |
|---------------|------------------|-------|
| **Report Centre** | Reporting Centre | Reporting portal |
| **MAP Copilot** | AI Copilot | AI assistant |
| **Task Management Portal** | Task Portal | Task management |
| **Workflow Engine** | Workflow Service | Workflow execution |

---

## Naming Conventions

### Documents

| Convention | Example |
|------------|---------|
| **Blueprint** | `08_Security_Architecture.md` |
| **Current State** | `19_Enterprise_Solution_Architecture/11_Security_Architecture.md` |
| **Implementation** | `20_Enterprise_Implementation_Architecture/11_Security_Implementation.md` |

### Code

| Convention | Example |
|------------|---------|
| **Python modules** | `snake_case` (e.g., `workflow_service.py`) |
| **React components** | `PascalCase` (e.g., `WorkflowPortal.tsx`) |
| **Database tables** | `snake_case` (e.g., `workflow_definitions`) |
| **API endpoints** | `kebab-case` (e.g., `/api/v1/workflow-definitions`) |

---

## Deprecated Terms

| Deprecated Term | Replacement | Reason |
|-----------------|-------------|--------|
| MAP Nexus™ | MAP Nexus | Inconsistent trademark usage |
| Migration Engine | MAP Nexus Engine | Inconsistent naming |
| Validation Engine | MAP Nexus Engine | Inconsistent naming |
| MAP Engine | MAP Nexus Engine | Inconsistent naming |
| Financial Services Migration Validation Engine | MAP Nexus Engine | Too verbose |
| Reporting Centre | Report Centre | Inconsistent spelling |
| AI Copilot | MAP Copilot | Inconsistent naming |

---

**Version:** 1.0

**Status:** Phase A Review
