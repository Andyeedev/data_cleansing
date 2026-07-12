# MAP AI Repository Structure

| Field | Value |
|-------|-------|
| **Document** | MAP AI Repository Structure |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## Overview

The MAP AI repository structure organizes all AI-related artifacts including prompts, generated code, templates, knowledge base, and validation results.

---

## Directory Structure

```
map-platform/
├── prompts/
│   ├── architecture/
│   ├── development/
│   ├── testing/
│   ├── documentation/
│   ├── security/
│   └── templates/
├── prompt-library/
│   ├── README.md
│   ├── CONTRIBUTING.md
│   └── categories/
├── ai/
│   ├── generated/
│   ├── validated/
│   └── rejected/
├── examples/
│   ├── python/
│   ├── dotnet/
│   ├── react/
│   └── sql/
├── templates/
│   ├── prompts/
│   ├── code/
│   └── documentation/
├── knowledge/
│   ├── architecture/
│   ├── decisions/
│   └── lessons/
├── validation/
│   ├── test-results/
│   └── quality-reports/
└── ai-config.yaml
```

---

## prompts/

### Naming Convention

```
prompts/<category>/<domain>/<short-description>.md
```

### Subdirectories

| Directory | Purpose | When to Use |
|-----------|---------|-------------|
| `architecture/` | Architecture analysis and design prompts | System design, ADR generation |
| `development/` | Code generation and refactoring prompts | Feature development, bug fixes |
| `testing/` | Test generation and validation prompts | Unit tests, integration tests |
| `documentation/` | Documentation generation prompts | API docs, READMEs, runbooks |
| `security/` | Security analysis and hardening prompts | Vulnerability scanning, security review |
| `templates/` | Base templates for creating new prompts | Starting point for new prompt development |

---

## ai/

### Subdirectories

| Directory | Purpose | Lifecycle |
|-----------|---------|-----------|
| `generated/` | Raw AI outputs awaiting review | Temporary, deleted after validation |
| `validated/` | AI outputs that passed review | Permanent, linked to source code |
| `rejected/` | AI outputs that failed review | Retained for 90 days for analysis |

---

## examples/

### Subdirectories

| Directory | Contents |
|-----------|----------|
| `python/` | Python examples for data processing scripts |
| `dotnet/` | .NET 8 examples for backend services |
| `react/` | React 18 + TypeScript examples for frontend |
| `sql/` | Azure SQL MI query and migration examples |

---

## File Naming Conventions Summary

| Artifact Type | Convention | Example |
|---------------|-----------|---------|
| Prompt files | `<category>/<domain>/<name>.md` | `development/dotnet/generate-api.md` |
| AI artifacts | `<status>/<project>/<module>/<name>-<ts>.<ext>` | `generated/map-platform/validator/Service-20260701.cs` |
| Examples | `<tech>/<pattern>/` | `react/hooks/use-migration-status/` |
| Templates | `<type>/<name>.<ext>` | `code/dotnet-service.yaml` |
| Knowledge | `<type>/<name>.md` | `lessons/2026-07-01-ef-core-performance.md` |
| Quality reports | `<date>/<id>-report.yaml` | `2026-07-01/QR-001-report.yaml` |
