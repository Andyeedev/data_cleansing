# MAP MVP Code Quality Standards

| Field      | Value                              |
|------------|------------------------------------|
| Document   | MAP MVP Code Quality Standards     |
| Version    | 1.0                                |
| Date       | July 2026                          |
| Status     | Official                           |

---

## 1. Linting

### Configuration by Language

| Language    | Tool      | Config File              | CI Enforcement |
|------------|-----------|--------------------------|----------------|
| TypeScript  | ESLint    | `.eslintrc.js`           | Block merge    |
| Python      | Ruff      | `pyproject.toml`         | Block merge    |
| C#          | dotnet format | `.editorconfig`       | Block merge    |

### ESLint Configuration (TypeScript)

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:security/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react/jsx-no-duplicate-props': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### Ruff Configuration (Python)

```toml
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "UP", "S", "B", "A", "C4", "PT"]
```

### dotnet format (C#)

```xml
<!-- .editorconfig -->
[*.cs]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
dotnet_sort_system_directives_first = true
csharp_style_var_for_built_in_types = false:suggestion
```

---

## 2. Formatting

### Tool Configuration

| Language    | Formatter     | Config File              | CI Enforcement |
|------------|---------------|--------------------------|----------------|
| TypeScript  | Prettier      | `.prettierrc`            | Block merge    |
| Python      | Black         | `pyproject.toml`         | Block merge    |
| C#          | dotnet format | `.editorconfig`          | Block merge    |

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### Black Configuration (Python)

```toml
[tool.black]
line-length = 88
target-version = ["py311"]
```

### Formatting Rules

- All code formatted before commit (pre-commit hooks)
- CI rejects unformatted code
- No formatting debates: tool configuration is authoritative
- Review diffs include formatting changes only when intentional

---

## 3. Complexity

### Thresholds

| Metric                    | Maximum  | Enforcement |
|--------------------------|----------|-------------|
| Cyclomatic complexity    | 10       | CI gate     |
| Nesting depth            | 4        | CI gate     |
| Method length            | 30 lines | CI gate     |
| Class length             | 300 lines| CI gate     |
| Parameters per method    | 5        | Warning     |

### Measurement Tools

| Tool                  | Language    | Command                        |
|----------------------|-------------|--------------------------------|
| SonarQube            | All         | Integrated in CI               |
| ESLint complexity    | TypeScript  | `eslint --rule 'complexity: [\"error\", 10]'` |
| Radon                | Python      | `radon cc src/ -a -nc`        |
| CodeMetrics          | C#          | `dotnet format --verify-no-changes` |

### When Thresholds Are Exceeded

1. Extract method/function for logical blocks
2. Apply early returns to reduce nesting
3. Use strategy pattern for complex conditionals
4. Break large classes into smaller, focused classes

```csharp
// Before: complexity 15
public MigrationResult ProcessMigration(Job job)
{
    if (job != null)
    {
        if (job.Status == MigrationStatus.Pending)
        {
            if (job.SourceServer != null)
            {
                if (job.TargetServer != null)
                {
                    // deeply nested logic
                }
            }
        }
    }
}

// After: complexity 3
public MigrationResult ProcessMigration(Job job)
{
    if (job == null) throw new ArgumentNullException(nameof(job));
    if (job.Status != MigrationStatus.Pending) return MigrationResult.Skipped();
    if (job.SourceServer == null) return MigrationResult.Failed("No source");
    if (job.TargetServer == null) return MigrationResult.Failed("No target");

    return ExecuteMigration(job);
}
```

---

## 4. Maintainability

### Design Principles

| Principle                | Guideline                                 |
|------------------------|-------------------------------------------|
| Single Responsibility  | One class, one purpose                    |
| Low Coupling           | Minimize dependencies between components |
| High Cohesion          | Related logic belongs together            |
| Dependency Injection   | Constructor injection, interfaces over concrete types |
| Composition over Inheritance | Prefer small composable pieces    |

### Method Guidelines

- **Maximum 30 lines** per method (excluding blank lines and comments)
- **Maximum 5 parameters**; use objects for more
- **One level of abstraction** per method
- **Early returns** over nested conditionals
- **Descriptive names** over comments

### Class Guidelines

- **Maximum 300 lines** per class
- **Maximum 7 public methods** per class
- Group related methods together
- Separate concerns into different classes
- Use interfaces for testability

### Code Smells to Avoid

| Smell                       | Refactoring                              |
|----------------------------|------------------------------------------|
| Long method                | Extract method                           |
| Large class                | Extract class                            |
| Feature envy               | Move method to the class it depends on   |
| Data clump                 | Extract value object                     |
| Primitive obsession       | Replace with value objects               |
| Switch statements          | Replace with polymorphism                |
| Dead code                  | Delete immediately                       |
| Magic numbers             | Extract to named constants               |

---

## 5. Performance

### Database

| Rule                          | Implementation                          |
|------------------------------|-----------------------------------------|
| No N+1 queries               | Use eager loading, includes, projections|
| Parameterized queries        | EF Core LINQ or parameterized SQL       |
| Connection pooling            | Default pool settings, monitor usage    |
| Pagination                   | Never return unbounded result sets      |
| Indexing                     | Index frequently queried columns        |

```csharp
// N+1 problem - BAD
var jobs = await context.MigrationJobs.ToListAsync();
foreach (var job in jobs)
{
    var server = await context.Servers.FindAsync(job.ServerId); // N queries!
}

// Eager loading - GOOD
var jobs = await context.MigrationJobs
    .Include(j => j.Server)
    .ToListAsync(); // 1 query
```

### Async I/O

- All I/O operations must be async (HTTP, database, file system)
- Use `IAsyncEnumerable` for streaming large datasets
- Avoid `.Result` or `.Wait()` on async methods
- Configure `ConfigureAwait(false)` in library code

### Caching Strategy

| Cache Type       | Technology           | TTL        | Use Case               |
|----------------|---------------------|-----------|------------------------|
| In-memory       | IMemoryCache         | 5 min     | Reference data         |
| Distributed     | Redis                | 15 min    | Shared state           |
| HTTP            | Response caching     | Per-route | API responses          |
| CDN             | Azure CDN            | 1 hour    | Static assets          |

### Benchmarking

```csharp
[MemoryDiagnoser]
[SimpleJob(RuntimeMoniker.Net80)]
public class MigrationServiceBenchmarks
{
    [Benchmark]
    public async Task<MigrationResult> ValidateConnection_Benchmark()
    {
        return await _service.ValidateConnectionAsync(_testRequest);
    }
}
```

---

## 6. Reliability

### Retry Policies

```csharp
services.AddHttpClient<IAzureOpenAIClient, AzureOpenAIClient>()
    .AddPolicyHandler(Policy
        .Handle<HttpRequestException>()
        .OrResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: attempt =>
                TimeSpan.FromSeconds(Math.Pow(2, attempt))));
```

### Circuit Breaker

```csharp
var circuitBreakerPolicy = Policy
    .Handle<HttpRequestException>()
    .CircuitBreakerAsync(
        exceptionsAllowedBeforeBreaking: 5,
        durationOfBreak: TimeSpan.FromSeconds(30),
        onBreak: (exception, duration) =>
            _logger.LogWarning("Circuit open for {Duration}s", duration.TotalSeconds),
        onReset: () =>
            _logger.LogInformation("Circuit closed"));
```

### Graceful Degradation

- Return cached data when live data is unavailable
- Provide partial results when some services fail
- Queue operations for retry when downstream is down
- Display user-friendly error messages, never stack traces

### Health Checks

```csharp
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false // Liveness: is the process running?
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

---

## 7. Accessibility

### WCAG 2.2 AA Compliance

| Criterion                  | Implementation                          |
|--------------------------|-----------------------------------------|
| Color contrast           | Minimum 4.5:1 for normal text          |
| Keyboard navigation      | All interactive elements focusable      |
| Screen reader support    | ARIA labels, semantic HTML              |
| Focus indicators         | Visible focus rings on all interactive  |
| Form labels              | Associated labels for all inputs        |
| Error identification     | Clear error messages linked to fields   |
| Text resizing            | Support up to 200% zoom                 |

### Automated Testing

```typescript
// axe-core integration with Playwright
import AxeBuilder from '@axe-core/playwright';

test('has no accessibility violations', async ({ page }) => {
  await page.goto('/dashboard');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Manual Audit Schedule

- **Quarterly:** Full manual accessibility audit
- **Per feature:** Accessibility review in PR checklist
- **Tools:** axe DevTools, WAVE, NVDA/VoiceOver testing

---

## 8. Technical Debt

### Tracking

- All technical debt tracked in backlog as `tech-debt` label
- Each debt item includes impact assessment and proposed resolution
- Debt items prioritized by risk and impact on velocity

### Capacity Allocation

| Activity                      | Capacity   |
|------------------------------|------------|
| New features                 | 60%        |
| Bug fixes                    | 20%        |
| Technical debt / refactoring | 20%        |

### Refactoring Sprints

- Every 4th sprint includes dedicated refactoring time
- Refactoring targets identified from SonarQube hotspots
- No new features during refactoring sprint
- All refactoring includes test coverage

### Debt Metrics

| Metric                        | Target        |
|------------------------------|---------------|
| SonarQube maintainability    | A rating      |
| Technical debt ratio         | < 5%          |
| Code duplication             | < 3%          |
| Debt items in backlog        | < 20          |

---

## 9. Quality Gates

### CI Quality Gate Requirements

| Gate                       | Threshold              | Enforcement |
|--------------------------|------------------------|-------------|
| Code coverage            | ≥ 80%                  | Block merge |
| Bugs                     | 0                      | Block merge |
| Vulnerabilities          | 0                      | Block merge |
| Security hotspots        | 0 unresolved           | Block merge |
| Code smells              | 0 new                  | Block merge |
| Duplication              | < 3%                   | Warning     |
| Maintainability rating   | A                      | Block merge |
| All tests passing        | 100%                   | Block merge |
| Linting errors           | 0                      | Block merge |
| Formatting               | 100% compliant         | Block merge |
| Cyclomatic complexity    | ≤ 10 per method        | Block merge |
| Nesting depth            | ≤ 4 levels             | Block merge |

### SonarQube Quality Gate

```yaml
# sonar-project.properties
sonar.qualitygate.wait=true
sonar.coverage.exclusions=**/Program.cs,**/Startup.cs,**/*.Tests/**
sonar.cpd.exclusions=**/*.Tests/**
```

### Pre-Commit Hooks

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run linting
dotnet format --verify-no-changes
npm run lint

# Run formatting check
prettier --check "src/**/*.{ts,tsx}"

# Run type checking
npm run typecheck

echo "All quality checks passed"
```

### PR Merge Requirements

- [ ] All CI checks passing
- [ ] Code coverage ≥ 80%
- [ ] SonarQube quality gate passed
- [ ] No merge conflicts
- [ ] At least 1 human approval
- [ ] Branch up to date with main
- [ ] No unresolved review comments
