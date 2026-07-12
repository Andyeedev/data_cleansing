# MAP AI Prompt Library Specification

| Field | Value |
|-------|-------|
| **Document** | MAP AI Prompt Library Specification |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Owner** | MAP Engineering Team |

---

## 1. Overview

This document defines the standard prompt categories, naming conventions, versioning strategy, and template structure for the MAP AI Prompt Library.

---

## 2. Prompt Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Architecture | Design decisions, patterns, diagrams | `arch-decision-v1.0.0` |
| Development | Code generation, refactoring | `dev-generate-service-v1.0.0` |
| Testing | Test generation, analysis | `test-unit-python-v1.0.0` |
| Documentation | Doc generation, review | `doc-api-endpoint-v1.0.0` |
| UX | UI generation, accessibility | `ux-component-react-v1.0.0` |
| Security | Security review, hardening | `sec-review-code-v1.0.0` |
| DevOps | Pipeline, deployment | `devops-deploy-azure-v1.0.0` |
| Product | Requirements, user stories | `prod-user-story-v1.0.0` |
| Business | Analysis, strategy | `biz-market-analysis-v1.0.0` |
| Marketing | Content, campaigns | `mkt-blog-post-v1.0.0` |
| Operations | Monitoring, incident | `ops-incident-analysis-v1.0.0` |

---

## 3. Naming Convention

**Pattern:** `[category]-[purpose]-v[major].[minor].[patch]`

| Component | Description | Example |
|-----------|-------------|---------|
| `category` | One of the defined categories (lowercase) | `dev` |
| `purpose` | Short hyphenated description of the prompt's goal | `generate-service` |
| `major` | Breaking changes to prompt structure | `1` |
| `minor` | New examples, improved accuracy | `0` |
| `patch` | Typo fixes, minor adjustments | `0` |

**Full Example:** `dev-generate-service-v1.2.3`

---

## 4. Versioning Strategy

| Level | Change Type | Example |
|-------|-------------|---------|
| **Major** | Breaking changes to prompt structure, output format, or system message | v1.0.0 -> v2.0.0 |
| **Minor** | New examples added, improved accuracy, additional context | v1.0.0 -> v1.1.0 |
| **Patch** | Typo fixes, minor wording adjustments, formatting cleanup | v1.0.0 -> v1.0.1 |

---

## 5. Prompt Template Structure

Every prompt in the library must follow this standard template:

```
# Prompt: [Name]
## Purpose
## Category
## Version
## System Message
## Context
## Instruction
## Output Format
## Examples
## Limitations
## Owner
## Last Updated
```

### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| Name | Yes | Human-readable prompt name |
| Purpose | Yes | What this prompt accomplishes |
| Category | Yes | One of the 11 defined categories |
| Version | Yes | Semantic version following the naming convention |
| System Message | Yes | Role and behavioral instructions for the AI |
| Context | Yes | Background information and constraints |
| Instruction | Yes | Specific task instructions |
| Output Format | Yes | Expected structure of the response |
| Examples | Yes | At least one input/output example |
| Limitations | Yes | Known constraints and failure modes |
| Owner | Yes | Responsible team or individual |
| Last Updated | Yes | Date of last modification |

---

## 6. Prompt Lifecycle Management

### 6.1 Storage

- Prompts stored in `prompts/` directory organized by category
- Each prompt is a Markdown file following the standard template
- Metadata tracked in `prompts/manifest.json`

### 6.2 Review Process

1. Author creates or updates prompt
2. Peer review by category owner
3. Testing with sample inputs
4. Approval and version bump
5. Publication to prompt library

### 6.3 Deprecation

- Deprecated prompts marked with `Status: Deprecated`
- Replaced by alternative prompt documented
- Retained for historical reference for 12 months

---

## 7. Quality Standards

| Standard | Requirement |
|----------|-------------|
| Template Compliance | 100% of prompts follow standard template |
| Example Coverage | Minimum 1 example per prompt |
| Version Accuracy | Version reflects actual changes |
| Owner Assignment | Every prompt has an assigned owner |
| Last Updated | Date is current within 90 days |
| Limitation Disclosure | All known limitations documented |
