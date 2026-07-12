# MAP MVP Testing Standards

| Field      | Value                          |
|------------|--------------------------------|
| Document   | MAP MVP Testing Standards      |
| Version    | 1.0                            |
| Date       | July 2026                      |
| Status     | Official                       |

---

## 1. Unit Testing

Unit tests verify individual components in isolation.

### Frameworks

| Language     | Framework | Runner  |
|-------------|-----------|---------|
| .NET 8      | xUnit     | dotnet test |
| Python      | pytest    | pytest  |
| React 18    | Jest      | npm test   |

### Requirements

- **Coverage threshold:** 80% line coverage minimum per project
- **Pattern:** Arrange–Act–Assert (AAA)
- **Scope:** One assertion per logical concept; one test per behavior
- **Isolation:** No shared mutable state between tests; dependencies mocked or stubbed

### Example (.NET)

```csharp
[Fact]
public void CalculateMigrationCost_WithValidInputs_ReturnsExpectedTotal()
{
    // Arrange
    var calculator = new MigrationCostCalculator();
    var estimate = new MigrationEstimate { ServerCount = 10, StorageGb = 500 };

    // Act
    var result = calculator.CalculateTotal(estimate);

    // Assert
    Assert.Equal(12500.00m, result.TotalCost);
}
```

### Example (Python)

```python
def test_calculate_migration_cost_with_valid_inputs_returns_expected_total():
    calculator = MigrationCostCalculator()
    estimate = MigrationEstimate(server_count=10, storage_gb=500)

    result = calculator.calculate_total(estimate)

    assert result.total_cost == 12500.00
```

### Example (React)

```typescript
it('renders migration status correctly', () => {
  render(<MigrationStatus status="in-progress" />);

  expect(screen.getByText('In Progress')).toBeInTheDocument();
});
```

---

## 2. Integration Testing

Integration tests verify interactions between components using real dependencies.

### TestContainer Dependencies

Use Testcontainers to spin up disposable instances of:

| Service              | Container Image                  | Purpose                      |
|---------------------|----------------------------------|------------------------------|
| Azure SQL MI        | mcr.microsoft.com/mssql/server  | Database integration tests   |
| Redis               | redis:7-alpine                   | Caching layer tests          |
| WireMock            | wiremock/wiremock                | External API simulation      |

### Database Tests

- Run against Testcontainer SQL instances, not shared dev databases
- Each test class gets its own container lifecycle
- Use EF Core migrations to schema-sync before tests
- Clean up data between test methods using transactions

### API Integration Tests

- Use `WebApplicationFactory<T>` for .NET API tests
- Override service registrations for test doubles
- Verify full request pipeline: routing, middleware, serialization

```csharp
[Fact]
public async Task GetMigrationJobs_ReturnsOkWithJobList()
{
    await using var factory = new TestWebApplicationFactory();
    var client = factory.CreateClient();

    var response = await client.GetAsync("/api/v1/migration-jobs");

    response.EnsureSuccessStatusCode();
    var jobs = await response.Content.ReadFromJsonAsync<List<MigrationJobDto>>();
    Assert.NotNull(jobs);
}
```

---

## 3. UI Testing

### End-to-End Testing (Playwright)

- Framework: Playwright for cross-browser E2E tests
- Browsers: Chromium, Firefox, WebKit
- Run on every pull request; full suite nightly
- Page Object Model pattern for all page interactions

```typescript
test('user can initiate migration validation', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="new-migration-btn"]');
  await page.fill('#source-server', 'sql-prod-01');
  await page.click('[data-testid="start-validation"]');

  await expect(page.locator('.status-badge')).toHaveText('Validating');
});
```

### Component Testing (React Testing Library)

- Test components in isolation with mocked providers
- Query by accessible roles, labels, and test IDs
- Avoid testing implementation details (state, hooks)

```typescript
it('displays validation progress bar', () => {
  render(<ValidationProgress percent={65} />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '65');
});
```

---

## 4. API Testing

### Contract Testing (Pact)

- Define consumer-driven contracts between frontend and backend
- Contracts versioned and shared via Pact Broker
- CI verifies provider satisfies all consumer contracts

### HTTP Integration Tests

- Validate request/response schemas against OpenAPI spec
- Test authentication and authorization headers
- Verify error response formats match documented error codes

### Test Categories

| Category          | Tool              | Frequency     |
|------------------|-------------------|---------------|
| Contract         | Pact              | Every PR      |
| Schema           | Schemathesis      | Nightly       |
| Load             | k6                | Weekly        |
| Security         | OWASP ZAP         | Weekly        |

---

## 5. Performance Testing

### Framework: k6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};
```

### Baseline Metrics

| Metric                     | Target          |
|---------------------------|-----------------|
| API response time (p95)   | < 500ms         |
| Page load (LCP)           | < 2.5s          |
| Error rate                | < 1%            |
| Concurrent users          | 500+            |

### Performance Budgets

- Lighthouse CI integrated into PR checks
- Bundle size budgets enforced per route
- Regression alerts on threshold breaches

---

## 6. Security Testing

### Automated Scanning

| Tool        | Type              | Frequency    |
|------------|-------------------|--------------|
| OWASP ZAP  | DAST              | Weekly       |
| Snyk       | SCA (deps)        | Every PR     |
| Trivy      | Container scan    | Every build  |
| SonarQube  | SAST              | Every PR     |

### Manual Security Activities

- Quarterly penetration testing by external vendor
- Annual threat modeling review
- Responsible disclosure program

---

## 7. Coverage Targets

| Test Type       | Target          | Enforcement    |
|----------------|-----------------|----------------|
| Unit           | ≥ 80%           | CI gate        |
| Integration    | ≥ 60%           | CI gate        |
| E2E            | Critical paths  | Nightly run    |
| Contract       | 100% of APIs    | CI gate        |

- Coverage reports generated by `coverlet` (.NET), `coverage` (Python), `jest --coverage` (React)
- Reports published to CI artifacts and tracked over time
- Drops below threshold block the merge pipeline

---

## 8. Test Naming

### Convention

```
Method_Scenario_ExpectedResult
```

### Examples

```csharp
[Fact]
public void ValidateConnection_WithInvalidCredentials_ThrowsUnauthorizedException()

[Fact]
public void GetMigrationJob_WhenJobExists_ReturnsJobDetails()

[Theory]
[InlineData("")]
[InlineData(null)]
public void StartMigration_WithEmptySourceServer_ThrowsArgumentException(string source)
```

### Rules

- Use underscores to separate logical segments
- Be descriptive enough to understand failure from the name alone
- Use present tense for the method under test
- Boolean assertions: `Returns`, `Is`, `Should`
- Exception assertions: `Throws`, `Rejects`

---

## 9. Mocking

### Unit Tests

| Language | Framework | Usage                         |
|----------|-----------|-------------------------------|
| .NET     | Moq       | Interface mocking, setup/verify |
| Python   | unittest.mock | Patching, MagicMock      |
| React    | Jest mocks | Module, function mocking    |

### Integration Tests

- **Testcontainers** for real infrastructure (SQL, Redis, etc.)
- No mocking of internal services in integration tests
- Override only external/unavailable dependencies

### External Services

- **WireMock** for simulating third-party APIs
- Record/replay for deterministic tests
- Fault injection for resilience testing

### Rules

- Mock at the boundary, not the implementation
- Prefer interfaces over concrete types for testability
- Verify interactions only when behavior matters
- Reset mocks between tests

---

## 10. Fixtures

### xUnit Fixtures

```csharp
public class DatabaseFixture : IAsyncLifetime
{
    public SqlContainer Container { get; private set; }
    public string ConnectionString => Container.ConnectionString;

    public async Task InitializeAsync()
    {
        Container = new SqlBuilder().WithImage("mcr.microsoft.com/mssql/server:2022-latest").Build();
        await Container.StartAsync();
    }

    public async Task DisposeAsync()
    {
        await Container.DisposeAsync();
    }
}
```

### Test Data Builders

```csharp
public class MigrationJobBuilder
{
    private MigrationJob _job = new()
    {
        Id = Guid.NewGuid(),
        Name = "Test Migration",
        Status = MigrationStatus.Pending,
        CreatedAt = DateTime.UtcNow
    };

    public MigrationJobBuilder WithStatus(MigrationStatus status)
    {
        _job.Status = status;
        return this;
    }

    public MigrationJobBuilder WithServerCount(int count)
    {
        _job.ServerCount = count;
        return this;
    }

    public MigrationJob Build() => _job;
}
```

### Shared Setup

- Use `IClassFixture<T>` for shared state across test class
- Use `ICollectionFixture<T>` for shared infrastructure
- Avoid `IDisposable` for cleanup; prefer async disposal

---

## 11. Automation

### CI Integration

```yaml
# GitHub Actions example
- name: Run Unit Tests
  run: dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage

- name: Check Coverage
  run: |
    COVERAGE=$(cat ./coverage/*/coverage.cobertura.xml | grep 'line-rate' | head -1 | grep -oP '[0-9.]+')
    if (( $(echo "$COVERAGE < 0.80" | bc -l) )); then
      echo "Coverage $COVERAGE below 80% threshold"
      exit 1
    fi
```

### Parallel Execution

- Unit tests: full parallelism within project
- Integration tests: parallel across test classes, sequential within fixture
- E2E tests: serialized per browser, parallel across browsers
- Use `xUnit` parallelism attributes to control execution order

### Flaky Test Management

- Track flaky tests in a tagged list (`[Trait("Category", "Flaky")]`)
- Quarantine flaky tests: run separately, not blocking PRs
- Weekly review of flaky test list; fix or delete
- Maximum 5 flaky tests at any time; new flaky tests require immediate fix or removal

### Test Results

- Publish JUnit XML results to CI
- Dashboard for test trends: pass rate, duration, flakiness
- Alert on regression in test execution time
