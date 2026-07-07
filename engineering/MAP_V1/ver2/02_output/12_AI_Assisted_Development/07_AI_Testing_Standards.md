# MAP AI Testing Standards

| Field | Value |
|-------|-------|
| **Document** | MAP AI Testing Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. AI-Generated Unit Tests

AI must generate comprehensive unit tests for all public methods and classes.

### Generation Requirements

| Requirement | Description |
|-------------|-------------|
| **Public Methods** | Test all public methods |
| **Edge Cases** | Generate tests for boundary conditions |
| **Error Scenarios** | Generate tests for all exception paths |
| **Null/Empty Inputs** | Test null, empty, and whitespace inputs |
| **Boundary Values** | Test minimum, maximum, and boundary values |
| **Positive Cases** | Test happy path scenarios |
| **Negative Cases** | Test invalid input scenarios |

### Test Template

```csharp
// AI-Generated Unit Test
public class MigrationValidatorTests
{
    private readonly Mock<IMigrationRepository> _repositoryMock;
    private readonly MigrationValidator _sut;

    public MigrationValidatorTests()
    {
        _repositoryMock = new Mock<IMigrationRepository>();
        _sut = new MigrationValidator(_repositoryMock.Object);
    }

    [Fact]
    public async Task ValidateAsync_WithValidRecord_ReturnsSuccess()
    {
        // Arrange
        var record = CreateValidMigrationRecord();
        _repositoryMock
            .Setup(x => x.GetByIdAsync(record.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(record);

        // Act
        var result = await _sut.ValidateAsync(record.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(ValidationStatus.Success, result.Status);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task ValidateAsync_WithInvalidId_ThrowsArgumentException(string? invalidId)
    {
        // Arrange & Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => _sut.ValidateAsync(invalidId));
    }

    [Fact]
    public async Task ValidateAsync_WhenRepositoryThrows_ReturnsFailure()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock
            .Setup(x => x.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DatabaseException("Connection failed"));

        // Act
        var result = await _sut.ValidateAsync(id);

        // Assert
        Assert.Equal(ValidationStatus.Failed, result.Status);
        Assert.Contains("Connection failed", result.ErrorMessage);
    }

    [Fact]
    public async Task ValidateAsync_WithNonExistentRecord_ReturnsNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock
            .Setup(x => x.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((MigrationRecord?)null);

        // Act
        var result = await _sut.ValidateAsync(id);

        // Assert
        Assert.Equal(ValidationStatus.NotFound, result.Status);
    }
}
```

### Python Unit Test Example

```python
import pytest
from unittest.mock import AsyncMock, patch
from migration_assurance.services import MigrationValidator

class TestMigrationValidator:
    """AI-generated unit tests for MigrationValidator."""

    def setup_method(self):
        """Set up test fixtures."""
        self.repository = AsyncMock()
        self.validator = MigrationValidator(self.repository)

    @pytest.mark.asyncio
    async def test_validate_valid_record_returns_success(self):
        """Test validation of a valid migration record."""
        # Arrange
        record = self._create_valid_record()
        self.repository.get_by_id.return_value = record

        # Act
        result = await self.validator.validate(record.id)

        # Assert
        assert result.status == "success"
        assert result.record_id == record.id

    @pytest.mark.asyncio
    async def test_validate_invalid_id_raises_error(self):
        """Test validation with invalid ID raises error."""
        # Arrange & Act & Assert
        with pytest.raises(ValueError, match="Invalid ID"):
            await self.validator.validate(None)

    @pytest.mark.asyncio
    async def test_validate_not_found_returns_not_found(self):
        """Test validation when record not found."""
        # Arrange
        self.repository.get_by_id.return_value = None

        # Act
        result = await self.validator.validate("non-existent-id")

        # Assert
        assert result.status == "not_found"

    def _create_valid_record(self):
        """Create a valid migration record for testing."""
        return MigrationRecord(
            id="test-id-123",
            source_system="TestSystem",
            status="pending"
        )
```

### Test Naming Convention

```text
Method_Scenario_ExpectedResult

Examples:
ValidateAsync_WithValidRecord_ReturnsSuccess
ValidateAsync_WithInvalidId_ThrowsArgumentException
ValidateAsync_WhenRepositoryThrows_ReturnsFailure
ValidateAsync_WithNonExistentRecord_ReturnsNotFound
```

---

## 2. AI-Generated Integration Tests

AI must generate integration tests for component interactions and external dependencies.

### Generation Requirements

| Requirement | Description |
|-------------|-------------|
| **Component Interactions** | Test component communication |
| **External Dependencies** | Mock external services |
| **Database Operations** | Test data access layer |
| **API Endpoints** | Test endpoint behavior |
| **Message Queues** | Test message handling |
| **File Operations** | Test file I/O operations |

### Integration Test Template

```csharp
// AI-Generated Integration Test
public class MigrationServiceIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public MigrationServiceIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetMigrations_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/migrations");

        // Assert
        response.EnsureSuccessStatusCode();
        var migrations = await response.Content.ReadFromJsonAsync<List<MigrationDto>>();
        Assert.NotNull(migrations);
    }

    [Fact]
    public async Task CreateMigration_WithValidData_ReturnsCreated()
    {
        // Arrange
        var request = new CreateMigrationRequest
        {
            SourceSystem = "TestSystem",
            TargetSystem = "TargetSystem"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/migrations", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var migration = await response.Content.ReadFromJsonAsync<MigrationDto>();
        Assert.NotNull(migration);
        Assert.Equal("TestSystem", migration.SourceSystem);
    }
}
```

### Python Integration Test Example

```python
import pytest
from httpx import AsyncClient
from migration_assurance.main import app

@pytest.fixture
async def client():
    """Create test client."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_get_migrations_returns_success(client):
    """Test GET /api/migrations returns success."""
    # Act
    response = await client.get("/api/migrations")

    # Assert
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_create_migration_with_valid_data_returns_created(client):
    """Test POST /api/migrations with valid data."""
    # Arrange
    request_data = {
        "source_system": "TestSystem",
        "target_system": "TargetSystem"
    }

    # Act
    response = await client.post("/api/migrations", json=request_data)

    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["source_system"] == "TestSystem"
```

---

## 3. AI-Generated UI Tests

AI must generate Playwright tests from user stories and component specifications.

### Generation Requirements

| Requirement | Description |
|-------------|-------------|
| **User Stories** | Generate tests from user stories |
| **Component Specs** | Test component behavior |
| **Accessibility** | Test ARIA attributes and keyboard navigation |
| **Responsive Design** | Test across viewports |
| **Error States** | Test error display and handling |
| **Loading States** | Test loading indicators |

### Playwright Test Template

```typescript
// AI-Generated Playwright Test
import { test, expect } from '@playwright/test';

test.describe('Migration List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/migrations');
  });

  test('displays migration records', async ({ page }) => {
    // Assert
    await expect(page.locator('[data-testid="migration-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="migration-item"]').first()).toBeVisible();
  });

  test('filters migrations by search term', async ({ page }) => {
    // Arrange
    const searchInput = page.locator('[data-testid="search-input"]');

    // Act
    await searchInput.fill('Production');
    await page.waitForTimeout(300); // Debounce

    // Assert
    const items = page.locator('[data-testid="migration-item"]');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toContainText('Production');
    }
  });

  test('displays loading state while fetching', async ({ page }) => {
    // Arrange - Mock slow response
    await page.route('**/api/migrations', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
        headers: { 'Content-Type': 'application/json' },
      });
    });

    // Act
    await page.goto('/migrations');

    // Assert
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
  });

  test('displays error state on failure', async ({ page }) => {
    // Arrange - Mock error response
    await page.route('**/api/migrations', route => {
      route.fulfill({ status: 500 });
    });

    // Act
    await page.goto('/migrations');

    // Assert
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to load migrations');
  });

  test('is accessible via keyboard navigation', async ({ page }) => {
    // Act
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Assert
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused();
  });
});
```

---

## 4. AI-Generated API Tests

AI must generate comprehensive API endpoint tests.

### Generation Requirements

| Requirement | Description |
|-------------|-------------|
| **Endpoint Coverage** | Test all API endpoints |
| **Request Validation** | Test request validation |
| **Response Validation** | Test response schemas |
| **Error Codes** | Test all error scenarios |
| **Authentication** | Test auth requirements |
| **Authorization** | Test permission checks |

### API Test Template

```csharp
// AI-Generated API Test
public class MigrationControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public MigrationControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetMigrations_ReturnsOkWithList()
    {
        // Act
        var response = await _client.GetAsync("/api/migrations");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("[", content);
    }

    [Fact]
    public async Task GetMigration_WithValidId_ReturnsOk()
    {
        // Arrange
        var id = await CreateMigrationAsync();

        // Act
        var response = await _client.GetAsync($"/api/migrations/{id}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetMigration_WithInvalidId_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/migrations/invalid-id");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateMigration_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var request = new { };

        // Act
        var response = await _client.PostAsJsonAsync("/api/migrations", request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private async Task<string> CreateMigrationAsync()
    {
        var request = new CreateMigrationRequest
        {
            SourceSystem = "TestSystem",
            TargetSystem = "TargetSystem"
        };
        var response = await _client.PostAsJsonAsync("/api/migrations", request);
        var migration = await response.Content.ReadFromJsonAsync<MigrationDto>();
        return migration!.Id;
    }
}
```

---

## 5. AI-Generated Performance Tests

AI must generate k6 performance scripts from performance requirements.

### Generation Requirements

| Requirement | Description |
|-------------|-------------|
| **Load Profiles** | Define realistic load patterns |
| **Response Times** | Set performance thresholds |
| **Throughput** | Define expected throughput |
| **Error Rates** | Set acceptable error rates |
| **Resource Usage** | Monitor CPU and memory |
| **Scalability** | Test under increasing load |

### k6 Test Template

```javascript
// AI-Generated Performance Test
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const requestDuration = new Trend('request_duration');

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate under 1%
    errors: ['rate<0.01'],
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'https://api.map.dev.local';

  // Test GET /api/migrations
  const getResponse = http.get(`${BASE_URL}/api/migrations`);
  check(getResponse, {
    'GET /api/migrations status is 200': (r) => r.status === 200,
    'GET /api/migrations response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(getResponse.status !== 200);
  requestDuration.add(getResponse.timings.duration);

  // Test POST /api/migrations
  const payload = JSON.stringify({
    sourceSystem: 'LoadTest',
    targetSystem: 'Target',
  });
  const postResponse = http.post(`${BASE_URL}/api/migrations`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(postResponse, {
    'POST /api/migrations status is 201': (r) => r.status === 201,
    'POST /api/migrations response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  errorRate.add(postResponse.status !== 201);

  sleep(1);
}
```

---

## 6. AI-Generated Regression Tests

AI must select and generate relevant regression tests based on code changes.

### Generation Requirements

| Requirement | Description |
|-------------|-------------|
| **Change Analysis** | Analyze code changes for impact |
| **Test Selection** | Select relevant existing tests |
| **Test Generation** | Generate new tests for changes |
| **Impact Analysis** | Identify affected components |
| **Risk Assessment** | Prioritize high-risk areas |
| **Coverage Gap** | Identify coverage gaps |

### Regression Test Selection

```python
# AI-Generated Regression Test Selection
def select_regression_tests(changed_files: list[str]) -> list[str]:
    """Select relevant regression tests based on code changes."""
    
    test_mapping = {
        'src/services/migration.py': [
            'tests/unit/test_migration_service.py',
            'tests/integration/test_migration_api.py',
        ],
        'src/models/record.py': [
            'tests/unit/test_record_model.py',
            'tests/integration/test_record_repository.py',
        ],
        'src/api/routes.py': [
            'tests/integration/test_api_endpoints.py',
            'tests/e2e/test_user_flows.py',
        ],
    }
    
    selected_tests = set()
    for file in changed_files:
        if file in test_mapping:
            selected_tests.update(test_mapping[file])
    
    return list(selected_tests)
```

### Impact Analysis

| Change Type | Impact Level | Required Tests |
|-------------|-------------|----------------|
| **API Endpoint** | High | API tests, integration tests, E2E tests |
| **Business Logic** | High | Unit tests, integration tests |
| **Data Model** | High | Unit tests, integration tests, migration tests |
| **UI Component** | Medium | Unit tests, UI tests |
| **Configuration** | Low | Integration tests |
| **Documentation** | None | No tests required |

---

## 7. AI-Generated Security Tests

AI must generate OWASP-related security test cases.

### Generation Requirements

| Requirement | Description |
|-------------|-------------|
| **OWASP Top 10** | Test for OWASP vulnerabilities |
| **Authentication** | Test auth bypass attempts |
| **Authorization** | Test privilege escalation |
| **Input Validation** | Test injection attacks |
| **Data Exposure** | Test data leakage |
| **Session Management** | Test session security |

### Security Test Template

```python
# AI-Generated Security Test
import pytest
from httpx import AsyncClient

class TestSecurity:
    """AI-generated security tests."""

    @pytest.mark.asyncio
    async def test_sql_injection_prevented(self, client: AsyncClient):
        """Test SQL injection is prevented."""
        # Arrange
        malicious_payload = "'; DROP TABLE migrations; --"

        # Act
        response = await client.get(f"/api/migrations?search={malicious_payload}")

        # Assert
        assert response.status_code == 400  # Bad request

    @pytest.mark.asyncio
    async def test_xss_prevented(self, client: AsyncClient):
        """Test XSS is prevented."""
        # Arrange
        malicious_payload = "<script>alert('xss')</script>"

        # Act
        response = await client.post("/api/migrations", json={
            "sourceSystem": malicious_payload
        })

        # Assert
        assert response.status_code == 400  # Bad request

    @pytest.mark.asyncio
    async def test_unauthorized_access_prevented(self, client: AsyncClient):
        """Test unauthorized access is prevented."""
        # Act
        response = await client.get("/api/admin/migrations")

        # Assert
        assert response.status_code == 401  # Unauthorized

    @pytest.mark.asyncio
    async def test_path_traversal_prevented(self, client: AsyncClient):
        """Test path traversal is prevented."""
        # Arrange
        malicious_payload = "../../etc/passwd"

        # Act
        response = await client.get(f"/api/files/{malicious_payload}")

        # Assert
        assert response.status_code in [400, 403, 404]  # Not 200
```

---

## 8. Coverage Expectations

### Coverage Targets

| Test Type | Coverage Target | Measurement |
|-----------|----------------|-------------|
| **Unit Tests** | ≥80% | Code coverage report |
| **Integration Tests** | ≥60% | API endpoint coverage |
| **E2E Tests** | 100% critical paths | User journey coverage |
| **Performance Tests** | All critical endpoints | Response time thresholds |
| **Security Tests** | OWASP Top 10 | Vulnerability scan results |

### Coverage Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Line Coverage** | ≥80% | SonarQube |
| **Branch Coverage** | ≥70% | SonarQube |
| **Function Coverage** | ≥85% | SonarQube |
| **Mutation Score** | ≥60% | Stryker |

### Coverage Reporting

```yaml
# Coverage Report Configuration
coverage:
  unit:
    target: 80
    threshold: 75  # Block if below
  integration:
    target: 60
    threshold: 50
  e2e:
    target: 100
    paths:
      - login
      - create_migration
      - validate_migration
      - generate_report
```

### Coverage Enforcement

| Coverage Level | Action |
|---------------|--------|
| **Above Target** | ✅ Merge allowed |
| **Between Threshold and Target** | ⚠️ Warning, merge allowed |
| **Below Threshold** | ❌ Merge blocked |
| **Critical Path Not Covered** | ❌ Merge blocked |

### Coverage Improvement

| Scenario | Action |
|----------|--------|
| **Low Coverage** | Generate additional tests |
| **Uncovered Branches** | Generate branch-specific tests |
| **Untested Edge Cases** | Generate edge case tests |
| **Missing Error Tests** | Generate error scenario tests |
