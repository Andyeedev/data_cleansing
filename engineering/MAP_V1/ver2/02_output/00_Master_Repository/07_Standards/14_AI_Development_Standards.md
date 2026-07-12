# MAP MVP AI Development Standards

| Field      | Value                              |
|------------|------------------------------------|
| Document   | MAP MVP AI Development Standards   |
| Version    | 1.0                                |
| Date       | July 2026                          |
| Status     | Official                           |

---

## 1. Prompt Engineering

### Principles

- **Clear instructions:** State the desired outcome explicitly; avoid ambiguous language
- **Context injection:** Provide relevant file contents, error messages, and code snippets
- **Structured output:** Request specific formats (JSON, tables, code blocks)
- **Few-shot examples:** Include 2-3 examples of expected input/output pairs

### Prompt Template

```
## Task
[Clear description of what needs to be done]

## Context
- Relevant files: [file paths]
- Current error: [error message]
- Framework/library versions: [versions]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Example Input
[code or scenario]

## Expected Output
[desired result format]
```

### Best Practices

| Practice                        | Example                                      |
|--------------------------------|----------------------------------------------|
| Be specific about language     | "In C# .NET 8..." not "In code..."          |
| Include constraints            | "Must use async/await, no Thread.Sleep"      |
| Reference existing patterns    | "Follow the pattern in MigrationService.cs"  |
| Request error handling         | "Include null checks and try-catch"          |
| Ask for tests                  | "Include xUnit tests for happy and error paths"|

---

## 2. Context Management

### Providing Context

- Share only files relevant to the task at hand
- Include file paths and line numbers for specific locations
- Provide error messages and stack traces in full
- Share relevant type definitions and interfaces

### Context Limits

| Source                  | Recommended Maximum     |
|------------------------|------------------------|
| Single prompt           | 8,000 tokens           |
| Total conversation      | 32,000 tokens          |
| Files included          | 5-10 most relevant     |
| Code snippets           | Under 200 lines each   |

### Summarization Strategy

- For large codebases, summarize architecture first
- Reference specific files rather than pasting entire contents
- Use `grep` and `read` tools to fetch relevant sections on demand
- Maintain a running summary of decisions made in the conversation

---

## 3. Code Review Expectations

### AI-Generated Code Standards

AI-generated code must meet the **exact same standards** as human-written code:

| Standard                | Requirement                              |
|------------------------|------------------------------------------|
| Code style             | Matches existing project conventions     |
| Test coverage          | 80% minimum, same as hand-written code   |
| Security               | No vulnerabilities, follows secure coding|
| Documentation          | XML/JSDoc comments on public APIs        |
| Error handling         | Graceful degradation, proper exceptions  |
| Performance            | No regressions, follows performance budgets|

### Review Checklist

- [ ] Code does what was requested
- [ ] Follows existing patterns in the codebase
- [ ] No hardcoded values that should be configurable
- [ ] Proper error handling and edge cases covered
- [ ] No unnecessary complexity or over-engineering
- [ ] Tests are meaningful, not just happy-path
- [ ] No security vulnerabilities introduced
- [ ] Dependencies are appropriate and licensed correctly

---

## 4. Verification

### Testing AI-Generated Code

- **Run all existing tests** to ensure no regressions
- **Write new tests** for AI-generated functionality
- **Test edge cases:** null inputs, empty collections, boundary values
- **Verify behavior** matches requirements, not just syntax

### Verification Checklist

```
1. Code compiles/builds successfully
2. All existing tests pass
3. New tests written and passing
4. Manual verification of key scenarios
5. Security scan clean (Snyk, SonarQube)
6. No new linting warnings or errors
```

### Edge Cases to Verify

- Null and empty inputs
- Concurrent access scenarios
- Large dataset handling
- Network failure / timeout conditions
- Permission denied scenarios
- Invalid user input

---

## 5. Security

### Prompt Security Rules

| Rule                                         | Rationale                              |
|---------------------------------------------|-----------------------------------------|
| Never paste secrets into prompts            | Secrets may be logged or stored         |
| Never include API keys or connection strings| Risk of exposure in training data       |
| Review generated code for injection risks   | SQL injection, XSS, command injection   |
| Validate all AI-generated queries           | Parameterized queries required          |
| Check for hardcoded credentials             | Should never appear in any code         |

### Security Review of AI Output

- Verify no secrets, tokens, or keys in generated code
- Check for SQL injection vulnerabilities
- Validate input sanitization is present
- Confirm authentication/authorization checks
- Review for SSRF, XXE, or path traversal risks

### Safe Prompting Practices

```markdown
# DO - Describe the pattern without exposing secrets
"Write a method that reads a connection string from Azure Key Vault"

# DO NOT - Paste actual secrets
"Write a method that connects to Server=myserver;User Id=admin;Password=s3cret!"
```

---

## 6. Human Approval

### Required Approvals

| Change Type                  | Approval Required               |
|-----------------------------|----------------------------------|
| New feature code            | 1 human reviewer                 |
| Security-related changes    | 2 human reviewers + security team|
| Infrastructure changes      | 2 human reviewers + DevOps lead  |
| AI model configuration      | Tech lead + product owner        |
| Database schema changes     | DBA + tech lead                  |

### Merge Requirements

- All AI-generated code goes through standard PR process
- PR description must note AI involvement: "Generated with AI assistance"
- Automated tests must pass before review
- Reviewer must verify AI output against requirements
- No auto-merge for AI-generated code

### Approval Workflow

```
1. Developer generates code with AI
2. Developer writes tests and verifies locally
3. PR created with "AI-assisted" label
4. Automated CI checks run
5. Human reviewer inspects code
6. Approval and merge
```

---

## 7. Limitations

### Known AI Limitations in Development

| Limitation                              | Mitigation                              |
|----------------------------------------|------------------------------------------|
| May hallucinate APIs or methods         | Verify against official documentation   |
| May not understand business context     | Provide domain-specific context in prompts|
| May produce plausible but incorrect code | Always test thoroughly                  |
| May miss subtle security issues        | Run security scans, manual review       |
| May not follow latest API changes       | Specify exact framework version in prompts|
| May over-engineer simple solutions      | Review for complexity, simplify as needed|
| May not account for performance         | Profile and benchmark critical paths    |

### When Not to Use AI

- Security-critical authentication/authorization code (review extra carefully)
- Financial calculation logic (requires domain expert verification)
- Compliance-related code (requires legal/compliance review)
- Database migration scripts (requires DBA review)
- Infrastructure-as-code for production (requires DevOps review)

---

## 8. Responsible AI Usage

### Transparency Requirements

- All PRs with AI-generated code must be labeled
- Documentation must note AI tools used in development
- Sprint reports should include AI contribution metrics
- Team members should be aware of AI usage in the project

### Ethical Guidelines

- Do not use AI to misrepresent authorship
- Do not use AI to automate tasks that require human judgment without review
- Do not use AI-generated code to bypass security reviews
- Always give appropriate credit to AI tools

### Documentation

```markdown
## AI Tool Usage Log

| Date       | Tool          | Purpose                        | Reviewer      |
|-----------|---------------|--------------------------------|---------------|
| 2026-07-01 | GitHub Copilot| Migration service boilerplate  | J. Smith      |
| 2026-07-02 | Claude        | Architecture decision analysis | A. Johnson    |
```

### Metrics to Track

- Percentage of code generated with AI assistance
- Bug rate in AI-generated vs human-written code
- Review time for AI-generated PRs
- Security vulnerability rate by code origin
