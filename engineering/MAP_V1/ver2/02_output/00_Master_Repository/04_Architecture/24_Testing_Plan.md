# Testing Plan

**Document:** MAP MVP Testing Plan
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

MAP employs a multi-layered testing strategy covering unit, integration, security, performance, and user acceptance testing. Automation is prioritized throughout the pipeline, with manual testing reserved for exploratory and UAT scenarios.

---

## Unit Testing

### Framework and Tooling
- **Framework:** xUnit 2.x
- **Mocking:** Moq 4.x
- **Assertions:** FluentAssertions for readable test output
- **Code Coverage:** Coverlet with Cobertura output
- **Coverage Target:** >80% line coverage, >70% branch coverage

### Pattern: AAA (Arrange, Act, Assert)
```csharp
[Fact]
public async Task ValidateMigration_WithExpiredCertificate_ReturnsFailureResult()
{
    // Arrange
    var migration = MigrationBuilder.WithExpiredCertificate().Build();
    var validator = new MigrationValidator(_mockCertService.Object);

    // Act
    var result = await validator.ValidateAsync(migration);

    // Assert
    result.Should().BeFalse();
    result.Errors.Should().Contain(e => e.Code == "CERT_EXPIRED");
}
```

### Naming Convention
```
Method_Scenario_ExpectedResult
```

**Examples:**
- `ValidateMigration_WithNullInput_ThrowsArgumentNullException`
- `RiskScoreCalculator_HighComplexityRisk_ReturnsScoreAbove80`
- `CheckRepository_WhenDatabaseUnavailable_ThrowsTransientException`

### Test Data Builders
```csharp
public class MigrationBuilder
{
    private Migration _migration = new Migration
    {
        Id = Guid.NewGuid(),
        Name = "Test Migration",
        Status = MigrationStatus.Pending,
        SourceEnvironment = EnvironmentBuilder.Production().Build(),
        TargetEnvironment = EnvironmentBuilder.Staging().Build()
    };

    public MigrationBuilder WithStatus(MigrationStatus status)
    {
        _migration.Status = status;
        return this;
    }

    public MigrationBuilder WithExpiredCertificate()
    {
        _migration.CertificateExpiry = DateTime.UtcNow.AddDays(-1);
        return this;
    }

    public Migration Build() => _migration;
}
```

### Unit Test Organization
```
tests/
├── unit/
│   ├── MAP.Core.Tests/
│   ├── MAP.Application.Tests/
│   ├── MAP.Infrastructure.Tests/
│   ├── MAP.AI.Tests/
│   └── MAP.Api.Tests/
```

---

## Integration Testing

### API Integration Tests
- **Framework:** WebApplicationFactory<T> with TestServer
- **Scope:** Full HTTP request pipeline including middleware, auth, and routing
- **Data:** Test database with seeded data, reset per test class
- **Assertions:** Response status codes, headers, JSON schema validation

```csharp
public class ValidationEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task POST_ValidMigration_Returns201WithId()
    {
        var client = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddScoped<IDatabaseContext, TestDatabaseContext>();
            });
        }).CreateClient();

        var response = await client.PostAsJsonAsync("/api/v1/migrations", validMigrationDto);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var result = await response.Content.ReadFromJsonAsync<MigrationResponse>();
        result.Id.Should().NotBeEmpty();
    }
}
```

### Database Integration Tests
- **Framework:** Testcontainers for Azure SQL Edge
- **Scope:** Entity Framework migrations, query logic, transaction behavior
- **Pattern:** Each test gets a fresh database instance
- **Seeding:** Dedicated seed scripts per test scenario

```csharp
public class MigrationRepositoryTests : IAsyncLifetime
{
    private readonly TestcontainerDatabase _database;

    [Fact]
    public async Task SaveAsync_PersistsMigrationWithCorrectRelationships()
    {
        using var context = CreateContext();
        var repo = new MigrationRepository(context);

        await repo.SaveAsync(testMigration);

        var saved = await context.Migrations
            .Include(m => m.Checks)
            .FirstOrDefaultAsync(m => m.Id == testMigration.Id);

        saved.Should().NotBeNull();
        saved.Checks.Should().HaveCount(3);
    }
}
```

### Azure Service Integration Tests
- **Azure Service Bus:** Test namespace with message publisher/subscriber tests
- **Azure OpenAI:** Mocked responses for deterministic testing, real calls in integration environment
- **Azure Key Vault:** Test vault with secret rotation validation
- **Azure Cache for Redis:** Embedded Redis for local testing

### Test Containers
```yaml
# docker-compose.test.yml
services:
  sql:
    image: mcr.microsoft.com/azure-sql-edge:latest
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "TestPass123!"
    ports:
      - "1433:1433"
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

## Security Testing

### SAST: SonarQube
- **Trigger:** Every PR and nightly build
- **Quality Gate:** No new critical or blocker issues
- **Rules:** Sonar way + custom MAP rules for secrets, SQL injection, XSS
- **Reporting:** PR comments with findings, dashboard for trends

### DAST: OWASP ZAP
- **Scope:** All public-facing API endpoints
- **Frequency:** Weekly scheduled scans + pre-release
- **Baseline:** Full scan establishes baseline, incremental scans compare
- **Alert Threshold:** No high or critical alerts pass to production

### Dependency Scan: Snyk
- **Scope:** NuGet packages (backend), npm packages (frontend), Docker base images
- **Frequency:** Every build + daily monitoring
- **Policy:** No known critical vulnerabilities in production dependencies
- **Auto-fix:** Automated PRs for minor and patch updates

### Container Scan: Trivy
- **Scope:** All Docker images built in CI
- **Severity Threshold:** CRITICAL and HIGH vulnerabilities block deployment
- **Base Image Policy:** Only approved base images from Microsoft Container Registry
- **SBOM:** Generated for each image, stored with build artifacts

### Secret Scan: GitLeaks
- **Scope:** Full repository history
- **Pre-commit Hook:** Prevents secrets from being committed
- **CI Pipeline:** Scans entire repo on every push
- **Allowlist:** Known false positives documented and allowlisted

---

## Performance Testing

### Load Testing with k6

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Steady state
    { duration: '2m', target: 100 },  // Peak load
    { duration: '5m', target: 100 },  // Sustained peak
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.map.internal/api/v1/migrations');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

### Stress Testing
- **Target:** 2x expected peak load for 30 minutes
- **Metrics:** Response time degradation, error rate, resource utilization
- **Auto-scaling Validation:** Confirm Container Apps scale correctly under stress
- **Breaking Point:** Document system limits and failure modes

### Baseline Metrics

| Metric | Target | Threshold |
|--------|--------|-----------|
| API Response Time (p50) | <200ms | <300ms |
| API Response Time (p95) | <500ms | <800ms |
| API Response Time (p99) | <1000ms | <1500ms |
| Throughput | >500 req/s | >300 req/s |
| Error Rate | <0.1% | <1% |
| AI Inference (p95) | <2000ms | <3000ms |

### Performance Budgets
- Frontend bundle size: <200KB gzipped
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3.0s

---

## User Acceptance Testing

### UAT Plan Template
```markdown
## UAT Test Plan: [Feature Name]
**Version:** [Version]
**Tester:** [Name]
**Date:** [Date]

### Objectives
- Validate feature meets acceptance criteria
- Confirm usability for target user persona
- Identify edge cases not covered by automated tests

### Test Scenarios
| ID | Scenario | Steps | Expected Result | Status |
|----|----------|-------|-----------------|--------|
| UAT-001 | [Description] | 1. Step 1<br>2. Step 2 | [Expected] | ☐ |

### Sign-Off Criteria
- [ ] All critical scenarios pass
- [ ] No P1/P2 defects open
- [ ] Performance within budget
- [ ] Accessibility requirements met
```

### Test Scenarios
1. **Migration Setup:** Create, configure, and launch a new migration validation
2. **Check Execution:** Run validation checks and review results
3. **Finding Management:** Triage, assign, and resolve findings
4. **AI Recommendations:** Review AI-generated insights and suggestions
5. **Reporting:** Generate and export migration status reports
6. **User Management:** Add team members, assign roles, manage permissions

### Acceptance Criteria Validation
- Each feature story includes Gherkin acceptance criteria
- Automated acceptance tests validate criteria in CI
- Manual UAT confirms usability and business intent
- Acceptance criteria traceability matrix maintained

### Sign-Off Process
1. QA team completes test execution and documents results
2. Product owner reviews test summary and defect report
3. Stakeholder review meeting for go/no-go decision
4. Formal sign-off document recorded with version and date
5. Sign-off archived in release documentation

---

## Regression Testing

### Automated Regression Suite
- **Scope:** All previously fixed bugs and feature interactions
- **Execution:** Nightly on develop, full suite before releases
- **Maintenance:** Tests removed when feature is deprecated, updated when behavior changes intentionally
- **Reporting:** Regression pass/fail trend dashboard

### Smoke Tests
- **Scope:** Critical user journeys (login, create migration, run checks, view results)
- **Execution:** Every deployment to staging and production
- **Duration:** <5 minutes
- **Failure Policy:** Block deployment on smoke test failure

### Critical Path Tests
1. User authentication and authorization
2. Migration project creation and configuration
3. Validation check execution and result retrieval
4. Finding creation and resolution workflow
5. Report generation and export
6. AI insight generation and display

---

## Automation Strategy

### CI Integration
```
PR Created → Unit Tests + SAST + Dependency Scan → Code Review
    ↓
Merge to Develop → Integration Tests + Smoke Tests → Deploy to Dev
    ↓
Nightly → Full Regression + Performance Tests
    ↓
Release Branch → UAT + Security Scan + Load Tests → Deploy to Staging
    ↓
Main Merge → Smoke Tests + Health Checks → Deploy to Production
```

### Test Reporting
- **Tool:** Allure Report or ReportPortal for centralized test reporting
- **Metrics:** Pass rate, flaky rate, execution time trends, coverage trends
- **Notifications:** Slack/Teams alerts for test failures on main and release branches
- **Dashboard:** Real-time test status visible to all team members

### Flaky Test Management
- **Detection:** Tests with >5% flaky rate flagged automatically
- **Quarantine:** Flaky tests moved to quarantine suite, not blocking CI
- **Resolution:** Dedicated sprint capacity to fix or remove flaky tests
- **Threshold:** <1% flaky rate target before promotion to critical path

### Test Data Management
- **Synthetic Data:** Generated via Bogus/Faker for unit and integration tests
- **Anonymized Production Data:** Used for staging and performance testing
- **Data Seeding:** Dedicated seed scripts per test scenario
- **Cleanup:** Automatic teardown after test execution, no shared state between test runs
- **Compliance:** No real PII in test environments, GDPR-compliant synthetic data only
