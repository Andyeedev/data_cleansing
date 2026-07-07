# MAP AI Repository Structure

| Field | Value |
|-------|-------|
| **Document** | MAP AI Repository Structure |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## Overview

The MAP AI repository structure organizes all AI-related artifacts including prompts, generated code, templates, knowledge base, and validation results. This structure lives alongside the main MAP platform codebase.

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

### Purpose

Contains reusable prompt templates organized by domain. Prompts are versioned and reviewed following the governance process.

### Naming Convention

```
prompts/<category>/<domain>/<short-description>.md
```

**Examples:**
```
prompts/development/dotnet/generate-api-controller.md
prompts/testing/react/component-test-scaffold.md
prompts/security/dotnet/sql-injection-check.md
prompts/architecture/microservice-decomposition.md
prompts/documentation/api-endpoint-docs.md
```

### Subdirectories

| Directory | Purpose | When to Use |
|-----------|---------|-------------|
| `architecture/` | Architecture analysis and design prompts | System design, ADR generation, component decomposition |
| `development/` | Code generation and refactoring prompts | Feature development, bug fixes, refactoring |
| `testing/` | Test generation and validation prompts | Unit tests, integration tests, performance tests |
| `documentation/` | Documentation generation prompts | API docs, READMEs, runbooks, changelogs |
| `security/` | Security analysis and hardening prompts | Vulnerability scanning, security review, compliance |
| `templates/` | Base templates for creating new prompts | Starting point for new prompt development |

### File Format

Each prompt file contains:

```markdown
---
id: prompt-001
version: 1.2
category: development
domain: dotnet
risk_level: medium
created: 2026-07-01
updated: 2026-07-01
author: ai-champion
tags: [api, controller, rest]
---

# Prompt Title

## Context
[When to use this prompt]

## Prompt
[The actual prompt template]

## Expected Output
[Description of expected output format]

## Validation Criteria
[How to verify the output]

## Examples
[Sample inputs and outputs]
```

---

## prompt-library/

### Purpose

A curated, searchable collection of validated prompts with documentation, usage statistics, and contribution guidelines.

### Naming Convention

```
prompt-library/categories/<category>/<prompt-name>.md
```

### Files

| File | Purpose |
|------|---------|
| `README.md` | Library overview, search instructions, quick start |
| `CONTRIBUTING.md` | How to contribute new prompts, review process |
| `categories/<category>/<prompt>.md` | Individual validated prompts |

### Prompt Library Entry Format

```markdown
---
library_id: PL-001
prompt_id: prompt-001
title: Generate .NET API Controller
category: development
subcategory: dotnet
difficulty: intermediate
acceptance_rate: 87%
usage_count: 142
avg_quality_score: 4.2/5
---

# Prompt Title

## Description
[What this prompt does]

## Usage Instructions
[How to use effectively]

## Input Parameters
[Required and optional parameters]

## Sample Output
[Example of expected output]

## Known Limitations
[Known failure modes or constraints]

## Changelog
- v1.2 (2026-07-01): Improved handling of complex types
- v1.1 (2026-06-15): Added authentication support
- v1.0 (2026-06-01): Initial version
```

---

## ai/

### Purpose

Stores AI-generated artifacts organized by validation status.

### Naming Convention

```
ai/<status>/<project>/<module>/<artifact-name>-<timestamp>.<ext>
```

### Subdirectories

| Directory | Purpose | Lifecycle |
|-----------|---------|-----------|
| `generated/` | Raw AI outputs awaiting review | Temporary, deleted after validation |
| `validated/` | AI outputs that passed review | Permanent, linked to source code |
| `rejected/` | AI outputs that failed review | Retained for 90 days for analysis |

### Generated Artifacts Tracking

Each artifact in `ai/generated/` includes a metadata file:

```yaml
artifact_id: AI-2026-07-01-001
prompt_id: prompt-001
prompt_version: 1.2
user: john.doe
timestamp: 2026-07-01T14:30:00Z
risk_level: medium
status: pending_review
project: map-platform
module: migration-validator
output_file: MigrationValidator-2026-07-01-143000.cs
```

---

## examples/

### Purpose

Verified, working examples demonstrating AI-assisted development patterns for each technology in the MAP stack.

### Naming Convention

```
examples/<technology>/<pattern-name>/
```

### Subdirectories

| Directory | Contents |
|-----------|----------|
| `python/` | Python examples for data processing scripts |
| `dotnet/` | .NET 8 examples for backend services |
| `react/` | React 18 + TypeScript examples for frontend |
| `sql/` | Azure SQL MI query and migration examples |

### Example Structure

Each example directory contains:

```
<pattern-name>/
├── README.md           # Description and usage
├── src/                # Source code
├── tests/              # Associated tests
├── prompt.md           # Prompt used to generate
├── metadata.yaml       # Example metadata
└── lessons.md          # Lessons learned
```

---

## templates/

### Purpose

Reusable templates for generating AI artifacts. Templates are parameterized and version-controlled.

### Subdirectories

| Directory | Purpose |
|-----------|---------|
| `prompts/` | Meta-templates for creating new prompts |
| `code/` | Code structure templates for generation |
| `documentation/` | Documentation templates for generation |

### Template Format

Templates use mustache-style placeholders:

```markdown
# {{project_name}} - {{component_name}}

## Overview
{{description}}

## API Endpoints
{{#endpoints}}
- `{{method}} {{path}}` — {{description}}
{{/endpoints}}

## Configuration
{{#config_options}}
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `{{key}}` | {{type}} | {{default}} | {{description}} |
{{/config_options}}
```

---

## knowledge/

### Purpose

Accumulated knowledge from AI-assisted development including decisions, lessons learned, and architectural context.

### Subdirectories

| Directory | Purpose | Naming |
|-----------|---------|--------|
| `architecture/` | Architecture context for AI prompts | `<component>-context.md` |
| `decisions/` | Architecture Decision Records involving AI | `ADR-<number>-<title>.md` |
| `lessons/` | Retrospective insights and learnings | `<date>-<topic>.md` |

### Knowledge Entry Format

```markdown
---
id: KNOW-001
type: lesson
date: 2026-07-01
author: ai-champion
tags: [performance, dotnet, ef-core]
---

# Lesson Title

## Context
[What was happening]

## What Happened
[What occurred]

## Impact
[What was the effect]

## Recommendation
[What should be done differently]

## Prompt Updates
[Which prompts were updated as a result]
```

---

## validation/

### Purpose

Stores test results and quality reports for AI-generated artifacts.

### Subdirectories

| Directory | Purpose |
|-----------|---------|
| `test-results/` | CI/CD test results for AI-generated code |
| `quality-reports/` | Quality assessment reports and trends |

### Test Results Format

```
validation/test-results/<date>/<artifact-id>-results.xml
```

### Quality Report Format

```yaml
report_id: QR-2026-07-01
period: weekly
generated: 2026-07-01T23:59:59Z
metrics:
  total_generations: 45
  acceptance_rate: 0.84
  hallucination_rate: 0.04
  avg_review_time_minutes: 12
  defects_found: 2
  defects_per_generation: 0.044
```

---

## ai-config.yaml

### Purpose

Central configuration file for AI tooling, model selection, and governance settings.

### Structure

```yaml
# MAP AI Configuration
version: "1.0"
environment: production

models:
  code_generation:
    provider: azure-openai
    deployment: gpt-4o
    max_tokens: 4096
    temperature: 0.3
  documentation:
    provider: azure-openai
    deployment: gpt-4o
    max_tokens: 8192
    temperature: 0.5
  analysis:
    provider: azure-openai
    deployment: gpt-4o
    max_tokens: 4096
    temperature: 0.2

governance:
  auto_approve_low_risk: true
  reviewer_required: true
  committee_threshold: high
  max_tokens_per_user_per_day: 100000
  max_cost_per_month_usd: 5000

quality:
  min_acceptance_rate: 0.80
  max_hallucination_rate: 0.05
  min_test_coverage: 0.80
  min_quality_score: 3.5

logging:
  enabled: true
  retention_days: 1095
  fields:
    - interaction_id
    - timestamp
    - user_id
    - tool
    - prompt_hash
    - output_hash
    - risk_level
    - approval_status

integrations:
  azure_devops:
    enabled: true
    project: map-platform
  azure_openai:
    endpoint: https://map-openai.openai.azure.com/
    api_version: "2024-02-01"
  github:
    enabled: false
```

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
