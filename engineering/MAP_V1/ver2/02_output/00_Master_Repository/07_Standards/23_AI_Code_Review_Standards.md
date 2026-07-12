# MAP AI Code Review Standards

| Field | Value |
|-------|-------|
| **Document** | MAP AI Code Review Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Human Review

All AI-generated code must undergo human review before merge. AI is a tool to accelerate development, not replace human judgment.

### Mandatory Review Points

| Review Point | Description | Reviewer Responsibility |
|-------------|-------------|------------------------|
| **Business Logic** | Verify AI-generated logic matches requirements | Feature owner |
| **Edge Cases** | Confirm edge cases are handled appropriately | Senior developer |
| **Security** | Validate security posture of generated code | Security champion |
| **Performance** | Ensure performance meets expectations | Performance owner |
| **Maintainability** | Verify code is readable and maintainable | Team lead |
| **Architecture** | Confirm adherence to architectural patterns | Architect |

### Review Checklist

```markdown
## AI Code Review Checklist

### Functionality
- [ ] Code implements requirements correctly
- [ ] Edge cases are handled
- [ ] Error scenarios are addressed
- [ ] Output format matches specifications

### Security
- [ ] No secrets or hardcoded credentials
- [ ] Input validation is present
- [ ] SQL injection is prevented
- [ ] XSS vulnerabilities are addressed
- [ ] OWASP Top 10 considerations are met

### Performance
- [ ] No N+1 query problems
- [ ] Proper async/await usage
- [ ] Efficient data structures used
- [ ] Memory allocation is reasonable
- [ ] Caching opportunities identified

### Maintainability
- [ ] Code is readable and well-organized
- [ ] Naming conventions are followed
- [ ] Documentation is adequate
- [ ] Complexity is manageable
- [ ] DRY principle is respected

### Testing
- [ ] Unit tests are included
- [ ] Tests cover happy path and edge cases
- [ ] Tests are independent and deterministic
- [ ] Test naming is descriptive

### Architecture
- [ ] Follows Clean Architecture principles
- [ ] Proper separation of concerns
- [ ] Dependency injection is used
- [ ] SOLID principles are followed
```

### Review Process

1. **Developer** — Author reviews AI output for obvious issues
2. **Automated** — CI/CD pipeline runs automated checks
3. **Peer Review** — At least one team member reviews code
4. **Approval** — Reviewer approves with comments
5. **Merge** — Code is merged after approval

### Review Guidelines

| Guideline | Description |
|-----------|-------------|
| **Assume nothing** | Do not assume AI output is correct without verification |
| **Verify logic** | Test the logic mentally or with examples |
| **Check boundaries** | Verify edge cases and boundary conditions |
| **Validate assumptions** | Confirm AI's understanding matches requirements |
| **Document findings** | Record review decisions and rationale |
| **Provide feedback** | Give constructive feedback for prompt improvement |

---

## 2. Automated Review

Automated checks run on every commit and must pass before human review.

### Tool Configuration

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **SonarQube** | Code quality and security | `sonar-project.properties` |
| **ESLint** | JavaScript/TypeScript linting | `.eslintrc.js` |
| **Pylint/Ruff** | Python linting | `pyproject.toml` |
| **StyleCop** | .NET code style | `.editorconfig` |
| **Prettier** | Code formatting | `.prettierrc` |
| **Security Scanner** | Vulnerability detection | Azure DevOps pipeline |

### Quality Gates

| Metric | Threshold | Action on Failure |
|--------|-----------|-------------------|
| **Code Coverage** | ≥80% | Block merge |
| **Duplicated Lines** | ≤3% | Warning, block if >5% |
| **Maintainability Rating** | ≥A | Block merge |
| **Reliability Rating** | ≥A | Block merge |
| **Security Rating** | ≥A | Block merge |
| **Security Hotspots** | 0 | Block merge |

---

## 3. Security Review

All AI-generated code must be reviewed for security vulnerabilities.

### OWASP Top 10 Checklist

| Vulnerability | Check | Status |
|--------------|-------|--------|
| **A01: Broken Access Control** | Verify authorization checks | [ ] |
| **A02: Cryptographic Failures** | Verify proper encryption | [ ] |
| **A03: Injection** | Verify parameterized queries | [ ] |
| **A04: Insecure Design** | Verify threat modeling | [ ] |
| **A05: Security Misconfiguration** | Verify secure defaults | [ ] |
| **A06: Vulnerable Components** | Verify dependency versions | [ ] |
| **A07: Auth Failures** | Verify authentication logic | [ ] |
| **A08: Data Integrity Failures** | Verify input validation | [ ] |
| **A09: Logging Failures** | Verify security logging | [ ] |
| **A10: SSRF** | Verify URL validation | [ ] |

### Security Anti-Patterns

| Anti-Pattern | Risk | Fix |
|-------------|------|-----|
| Hardcoded secrets | Secret exposure | Use Azure Key Vault |
| String concatenation SQL | SQL injection | Use parameterized queries |
| Unvalidated input | Injection attacks | Validate all inputs |
| Disabled CSRF | Cross-site request forgery | Enable anti-forgery tokens |
| Verbose errors | Information disclosure | Generic error messages |

---

## 4. Performance Review

AI-generated code must be reviewed for performance issues.

### Performance Anti-Patterns

| Anti-Pattern | Impact | Fix |
|-------------|--------|-----|
| **N+1 Queries** | Database overload | Use eager loading or batching |
| **Synchronous I/O** | Thread blocking | Use async/await |
| **Large Object Allocation** | Memory pressure | Use pooling or streaming |
| **Unbounded Queries** | Memory exhaustion | Use pagination |
| **Missing Indexes** | Slow queries | Add proper indexes |
| **Excessive Logging** | I/O overhead | Use async logging |
| **Tight Coupling** | Performance bottlenecks | Use dependency injection |

---

## 5. Architecture Review

AI-generated code must comply with architectural patterns and principles.

### Pattern Compliance

| Pattern | Description | Verification |
|---------|-------------|-------------|
| **Repository** | Data access abstraction | Verify interface usage |
| **Unit of Work** | Transaction management | Verify scope usage |
| **CQRS** | Command/Query separation | Verify query isolation |
| **Mediator** | Request handling | Verify mediator usage |
| **Decorator** | Cross-cutting concerns | Verify decorator pattern |
| **Strategy** | Algorithm encapsulation | Verify strategy pattern |

---

## 6. Maintainability Review

AI-generated code must be maintainable and readable.

### Code Smells

| Smell | Description | Fix |
|-------|-------------|-----|
| **Long Method** | Method too long | Extract method |
| **Large Class** | Class too large | Extract class |
| **Long Parameter List** | Too many parameters | Use parameter object |
| **Divergent Change** | Multiple reasons to change | Single Responsibility |
| **Shotgun Surgery** | Multiple places to change | Move logic to one place |
| **Feature Envy** | Method uses other class data | Move method |
| **Data Clumps** | Related data together | Extract class |

---

## 7. Approval Workflow

### Merge Criteria

| Criterion | Requirement | Evidence |
|-----------|-------------|----------|
| **Automated Checks** | All pass | Pipeline status |
| **Code Coverage** | ≥80% | Coverage report |
| **Security Scan** | No vulnerabilities | Scan report |
| **Peer Review** | Approved | PR approval |
| **Tests Passing** | All tests pass | Test results |
| **Documentation** | Updated | PR description |

### Rejection Criteria

| Criterion | Action |
|-----------|--------|
| **Security Vulnerability** | Reject immediately |
| **Architecture Violation** | Reject with explanation |
| **Insufficient Tests** | Request additional tests |
| **Poor Documentation** | Request documentation |
| **Performance Issues** | Reject with performance requirements |
| **Code Smells** | Request refactoring |
