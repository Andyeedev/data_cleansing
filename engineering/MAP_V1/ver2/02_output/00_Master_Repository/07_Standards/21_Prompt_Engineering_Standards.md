# MAP Prompt Engineering Standards

| Field | Value |
|-------|-------|
| **Document** | MAP Prompt Engineering Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Prompt Structure

Every prompt used in MAP AI-assisted development must follow a consistent structure to ensure reproducibility and quality.

### Required Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **System Message** | Defines AI role and behavioral boundaries | "You are a senior .NET developer working on a financial migration platform." |
| **Context** | Provides relevant background information | Project architecture, tech stack, constraints |
| **Instruction** | Clear, specific task description | "Generate a repository class for Account entity with CRUD operations" |
| **Output Format** | Defines expected response structure | "Return C# code with XML documentation and async/await pattern" |
| **Examples** | Few-shot examples for complex tasks | Input/output pairs demonstrating desired behavior |

### Prompt Template Structure

```text
[SYSTEM MESSAGE]
You are a [role] with expertise in [domain].

[CONTEXT]
Project: MAP (Migration Assurance Platform)
Tech Stack: [relevant technologies]
Constraints: [relevant limitations]

[TASK]
[Specific instruction]

[OUTPUT FORMAT]
[Expected format and structure]

[EXAMPLES]
[1-3 input/output examples if applicable]
```

### Quality Checklist

- [ ] Role is clearly defined
- [ ] Context is relevant and sufficient
- [ ] Instruction is unambiguous
- [ ] Output format is specified
- [ ] Examples are provided for complex tasks
- [ ] Constraints and edge cases are noted

---

## 2. Reusable Templates

### Code Generation Template

```text
Generate [language] code for [functionality].

Requirements:
- Follow [style guide] conventions
- Use [patterns/principles]
- Handle [error scenarios]
- Include [documentation/testing]

Output: [File type and format]
```

### Test Generation Template

```text
Generate unit tests for [component/method].

Coverage targets:
- Happy path scenarios
- Edge cases: [list specific edge cases]
- Error scenarios: [list error scenarios]
- Boundary conditions: [specify boundaries]

Framework: [xUnit/NUnit/etc.]
Mocking: [Moq/NSubstitute/etc.]
```

### Documentation Template

```text
Generate documentation for [component/feature].

Include:
- Purpose and overview
- Prerequisites
- Usage examples
- API reference
- Troubleshooting section
- Related components
```

### Code Review Template

```text
Review the following [language] code for:
- Security vulnerabilities
- Performance issues
- Code quality and maintainability
- Pattern compliance
- Error handling

Provide specific, actionable feedback with line references.
```

### Refactoring Template

```text
Refactor [component] to improve [goal].

Constraints:
- Maintain existing public API
- Ensure backward compatibility
- Follow [architectural pattern]
- Preserve test coverage

Current code: [paste code]
```

---

## 3. Context Management

### Principles

1. **Relevant Files Only** — Include only files directly related to the task. Avoid dumping entire codebases into prompts.
2. **Limit Context Size** — Keep context under 8,000 tokens per prompt. Summarize larger codebases.
3. **Use Summaries** — For large codebases, provide architectural summaries rather than raw source.
4. **Structured Context** — Organize context with clear labels and sections.

### Context Organization

```text
[Architecture Summary]
Brief overview of system design and patterns.

[Relevant Code]
File: src/services/AccountService.cs (key methods only)
File: src/models/Account.cs

[Related Components]
AccountRepository — data access layer
AccountValidator — business rules

[Constraints]
- Must use async/await
- Must implement IAccountService interface
- Must follow repository pattern
```

### Context Sizing Guidelines

| Context Type | Max Tokens | When to Use |
|-------------|-----------|-------------|
| Single function | 1,000 | Bug fixes, small changes |
| Single class | 2,000 | Feature additions, refactoring |
| Module | 4,000 | Cross-cutting features |
| System-wide | 8,000 | Architecture decisions |

---

## 4. Prompt Versioning

### Semantic Versioning

All prompts must be versioned using semantic versioning: `MAJOR.MINOR.PATCH`

| Version Change | When |
|---------------|------|
| **MAJOR** | Breaking changes to prompt structure or output format |
| **MINOR** | New capabilities, additional examples, improved instructions |
| **PATCH** | Typo fixes, minor clarifications, example updates |

### Version Format

```text
[category]-[purpose]-v[MAJOR].[MINOR].[PATCH]

Examples:
code-generation-dotnet-repository-v1.0.0
test-generation-unit-test-v1.2.1
review-security-checklist-v2.0.0
```

### Changelog Format

```markdown
## v1.2.0 — 2026-07-15
### Added
- Support for async/await pattern in repository generation
- Example for error handling scenarios

### Changed
- Updated output format to include XML documentation

### Fixed
- Corrected namespace convention in examples
```

### A/B Testing

- Test prompt variations with development team
- Track success rate (correct output on first attempt)
- Measure developer time saved per task
- Document which prompts perform best for specific tasks

---

## 5. Prompt Documentation

Every prompt in the library must include:

| Field | Description | Example |
|-------|-------------|---------|
| **Purpose** | What the prompt accomplishes | "Generates CRUD repository classes" |
| **Inputs** | Required input parameters | Entity name, database context, interface requirements |
| **Outputs** | Expected output format and content | C# interface and implementation files |
| **Examples** | 1-2 input/output examples | See template section |
| **Limitations** | Known limitations and edge cases | Does not generate complex queries |
| **Owner** | Team member responsible for maintenance | @team-lead |
| **Version** | Current version number | v1.2.0 |
| **Last Updated** | Date of last modification | 2026-07-15 |
| **Success Rate** | Percentage of successful first-attempt outputs | 92% |

### Documentation Template

```markdown
# Prompt: [category]-[purpose]-v[X.Y.Z]

## Purpose
[What this prompt does]

## Inputs
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|

## Output Format
[Description of expected output]

## Examples
### Example 1
**Input:** ...
**Output:** ...

## Limitations
- [Known limitation 1]
- [Known limitation 2]

## Owner
[Name/team responsible]

## Changelog
[Recent changes]
```

---

## 6. Prompt Libraries

### Organization Structure

```text
prompts/
├── code-generation/
│   ├── python/
│   ├── dotnet/
│   └── react/
├── test-generation/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── documentation/
│   ├── api-docs/
│   ├── readme/
│   └── changelogs/
├── review/
│   ├── security/
│   ├── performance/
│   └── quality/
├── refactoring/
│   ├── patterns/
│   └── cleanup/
└── architecture/
    ├── decisions/
    └── diagrams/
```

### Tagging System

Each prompt must include tags for discoverability:

| Tag Type | Examples |
|----------|---------|
| **Language** | `python`, `dotnet`, `react`, `sql` |
| **Task** | `generate`, `review`, `refactor`, `test` |
| **Complexity** | `simple`, `medium`, `complex` |
| **Domain** | `migration`, `validation`, `reporting`, `security` |

### Rating System

| Rating | Criteria |
|--------|----------|
| ⭐⭐⭐⭐⭐ | >95% first-attempt success, no manual fixes needed |
| ⭐⭐⭐⭐ | 85-95% success, minor manual adjustments |
| ⭐⭐⭐ | 70-85% success, moderate manual fixes |
| ⭐⭐ | 50-70% success, significant manual intervention |
| ⭐ | <50% success, needs complete rewrite |

### Search and Discovery

- Prompts are searchable by name, tags, and description
- Weekly review of prompt usage and effectiveness
- Deprecate prompts with consistently low ratings
- Promote high-performing prompts to team templates

---

## 7. Prompt Naming

### Naming Convention

```text
[category]-[purpose]-v[version]
```

### Components

| Component | Description | Examples |
|-----------|-------------|---------|
| **category** | Functional area | `code-gen`, `test-gen`, `review`, `docs`, `refactor` |
| **purpose** | Specific task | `dotnet-repo`, `react-component`, `unit-test`, `openapi` |
| **version** | Semantic version | `v1.0.0`, `v2.1.3` |

### Examples

| Prompt Name | Description |
|-------------|-------------|
| `code-gen-dotnet-repository-v1.0.0` | Generates .NET repository classes |
| `code-gen-react-component-v1.2.0` | Generates React functional components |
| `test-gen-unit-xunit-v1.1.0` | Generates xUnit unit tests |
| `review-security-owasp-v2.0.0` | Reviews code for OWASP vulnerabilities |
| `docs-openapi-spec-v1.0.1` | Generates OpenAPI specifications |

### Deprecation Naming

When deprecating a prompt:

```text
[original-name]-DEPRECATED-[YYYY-MM-DD]
```

---

## 8. Prompt Quality

### Quality Dimensions

| Dimension | Description | Measurement |
|-----------|-------------|-------------|
| **Clarity** | Instructions are unambiguous | Zero misinterpretations in testing |
| **Specificity** | Output requirements are precise | Output matches expected format 100% |
| **Testability** | Results can be validated | Passes automated validation checks |
| **Reproducibility** | Consistent output across runs | Same input produces equivalent output |
| **Completeness** | Covers all requirements | No missing features in output |
| **Maintainability** | Easy to update and improve | Changelog shows regular updates |

### Quality Assurance Process

1. **Author** — Create prompt following template
2. **Test** — Run with 5+ representative inputs
3. **Review** — Peer review by team member
4. **Validate** — Check against quality dimensions
5. **Publish** — Add to prompt library
6. **Monitor** — Track success rate and feedback

### Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Vague instructions | Inconsistent output | Be specific about requirements |
| Missing constraints | Unacceptable output | List all constraints explicitly |
| No examples | Misunderstood format | Include 1-2 input/output examples |
| Too much context | Diluted focus | Include only relevant context |
| No versioning | Broken changes | Version all prompts |
| No documentation | Discoverability issues | Document purpose, inputs, outputs |
| No owner | Abandoned prompts | Assign clear ownership |

### Quality Metrics

| Metric | Target | Review Frequency |
|--------|--------|-----------------|
| First-attempt success rate | >85% | Weekly |
| Developer satisfaction score | >4.0/5.0 | Monthly |
| Time saved per task | >30% | Monthly |
| Prompt library coverage | >90% common tasks | Quarterly |
