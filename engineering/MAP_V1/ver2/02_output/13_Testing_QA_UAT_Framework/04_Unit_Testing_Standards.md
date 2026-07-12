# Unit Testing Standards

---

| Field | Value |
|---|---|
| **Document Title** | Unit Testing Standards for MAP (Migration Assurance Platform) |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal / Confidential |
| **Owner** | MAP Quality Engineering Team |
| **Approved By** | MAP Architecture Review Board |
| **Last Revised** | 02 July 2026 |
| **Review Cycle** | Quarterly |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Objectives](#2-objectives)
3. [Scope](#3-scope)
4. [Definitions and Terminology](#4-definitions-and-terminology)
5. [Coverage Targets](#5-coverage-targets)
6. [Naming Conventions](#6-naming-conventions)
7. [Test Structure: Arrange-Act-Assert Pattern](#7-test-structure-arrange-act-assert-pattern)
8. [Mocking Standards](#8-mocking-standards)
9. [Fixtures and Test Data Management](#9-fixtures-and-test-data-management)
10. [Test Isolation](#10-test-isolation)
11. [Recommended Tools and Frameworks](#11-recommended-tools-and-frameworks)
12. [Best Practices](#12-best-practices)
13. [Test Categories](#13-test-categories)
14. [Code Coverage Measurement](#14-code-coverage-measurement)
15. [Test Maintenance](#15-test-maintenance)
16. [Continuous Integration Integration](#16-continuous-integration-integration)
17. [Dependencies and References](#17-dependencies-and-references)
18. [Revision History](#18-revision-history)
19. [Approval](#19-approval)

---

## 1. Purpose

This document defines the comprehensive unit testing standards for the **Migration Assurance Platform (MAP)**. It establishes uniform practices, conventions, and quality gates that all development teams must follow when authoring, maintaining, and reviewing unit tests within the MAP codebase.

Unit testing is the foundation of the MAP quality assurance strategy. By enforcing consistent standards at the lowest level of the testing pyramid, we ensure that individual components, functions, and methods behave correctly in isolation before they are composed into higher-level integrations.

These standards apply to:

- All production source code within MAP repositories
- All shared libraries and utility modules
- All data transformation and validation logic
- All API endpoint handlers and service layer classes
- All configuration and migration orchestration modules

### 1.1 Why Unit Testing Standards Matter in MAP

MAP operates in the financial services domain where data integrity, regulatory compliance, and operational reliability are non-negotiable. A single defect in a data migration pipeline can propagate downstream and affect thousands of financial records. Unit testing standards serve as the first line of defense against such defects by ensuring:

- Every critical path is exercised by automated tests
- Business logic is validated against expected behavior before integration
- Regression risks are minimized during refactoring cycles
- Code reviews have a measurable quality baseline to evaluate

---

## 2. Objectives

The objectives of this unit testing standards document are organized into four pillars:

### 2.1 Code Quality Assurance

- Ensure all production code is backed by corresponding unit tests
- Establish measurable quality gates that block defective code from merging
- Provide a shared understanding of what constitutes a well-tested component
- Reduce the density of defects discovered in later testing phases

### 2.2 Bug Prevention

- Catch defects at the earliest possible point in the development lifecycle
- Validate boundary conditions, edge cases, and error scenarios
- Prevent regression through comprehensive test suites
- Reduce the cost of defect remediation by catching issues before integration

### 2.3 Living Documentation

- Unit tests serve as executable specifications for component behavior
- Test names communicate intent and expected outcomes clearly
- Test suites document the contract of each public API and function
- New team members can understand system behavior by reading tests

### 2.4 Refactoring Support

- Provide confidence to refactor code without introducing regressions
- Enable safe code evolution through comprehensive safety nets
- Support continuous improvement of code quality and architecture
- Allow teams to adopt new patterns without fear of breaking existing functionality

---

## 3. Scope

### 3.1 In Scope

| Component Category | Coverage Requirement | Priority |
|---|---|---|
| Data Validation Modules | 95% line / 90% branch | Critical |
| Migration Orchestration Engine | 90% line / 85% branch | Critical |
| API Service Layer | 85% line / 75% branch | High |
| Business Logic Classes | 85% line / 75% branch | High |
| Utility and Helper Functions | 80% line / 70% branch | Standard |
| Configuration Handlers | 75% line / 65% branch | Standard |
| UI Presentation Logic | 70% line / 60% branch | Standard |

### 3.2 Out of Scope

- End-to-end tests (covered in E2E Testing Standards document)
- Performance and load testing (covered in Performance Testing Standards)
- Security penetration testing (covered in Security Testing Standards)
- Manual exploratory testing procedures

---

## 4. Definitions and Terminology

| Term | Definition |
|---|---|
| **Unit Test** | A test that validates the behavior of a single function, method, or class in isolation, with all dependencies mocked or stubbed |
| **Test Case** | A single execution of a test function that exercises a specific scenario |
| **Test Suite** | A collection of related test cases organized by module or feature |
| **Fixture** | Predefined test data and state setup that provides a consistent environment for test execution |
| **Mock** | A test double that simulates the behavior of a real dependency and can verify interactions |
| **Stub** | A test double that provides predetermined responses to method calls |
| **Spy** | A test double that records calls made to it for later verification |
| **Test Coverage** | A metric measuring the percentage of source code exercised by tests |
| **Branch Coverage** | A metric measuring the percentage of conditional branches executed by tests |
| **Line Coverage** | A metric measuring the percentage of source code lines executed by tests |
| **Flaky Test** | A test that produces inconsistent results (pass/fail) without code changes |
| **Test Pyramid** | A model suggesting a large base of unit tests, fewer integration tests, and even fewer E2E tests |
| **AAA Pattern** | Arrange-Act-Assert: the standard structure for unit test methods |

---

## 5. Coverage Targets

### 5.1 Mandatory Coverage Thresholds

MAP enforces the following minimum coverage thresholds as quality gates in the CI/CD pipeline:

| Metric | Minimum Target | Stretch Target | Critical Modules |
|---|---|---|---|
| **Line Coverage** | ≥ 80% | ≥ 90% | ≥ 95% |
| **Branch Coverage** | ≥ 70% | ≥ 80% | ≥ 90% |
| **Function Coverage** | ≥ 85% | ≥ 95% | ≥ 98% |
| **Mutation Score** | ≥ 60% | ≥ 75% | ≥ 85% |

### 5.2 Module-Level Requirements

```
Module                          | Line Coverage | Branch Coverage | Enforcement
--------------------------------|---------------|-----------------|------------
data_validation/                | 95%           | 90%             | Hard gate
migration_engine/               | 90%           | 85%             | Hard gate
api_services/                   | 85%           | 75%             | Hard gate
business_logic/                 | 85%           | 75%             | Hard gate
utils/                          | 80%           | 70%             | Soft gate
config/                         | 75%           | 65%             | Soft gate
ui_components/                  | 70%           | 60%             | Soft gate
```

### 5.3 Enforcement Rules

- **Hard gate**: Build fails if coverage falls below threshold. PR cannot be merged.
- **Soft gate**: Build produces a warning. Coverage must be addressed within two sprint cycles.
- **New code**: New files must meet 80% line / 70% branch coverage from the date of creation.
- **Existing code**: Coverage must not decrease when files are modified.

### 5.4 Coverage Exclusions

The following code patterns may be excluded from coverage calculations:

- Auto-generated code (protobuf definitions, ORM models, API clients)
- Logging statements and instrumentation code
- Type definitions and interface declarations
- Configuration constants and enumerations
- Third-party library wrapper code that adds no business logic

---

## 6. Naming Conventions

### 6.1 Test Function Naming

All test functions must follow the convention:

```
test_[function_name]_[scenario]_[expected_result]
```

**Pattern Breakdown:**

| Component | Description | Example |
|---|---|---|
| `test_` | Prefix identifying the function as a test | `test_` |
| `[function_name]` | Name of the function or method under test | `validate_account` |
| `[scenario]` | Description of the test scenario | `with_invalid_format` |
| `[expected_result]` | Expected outcome of the test | `raises_error` |

### 6.2 Naming Examples

```python
# Positive scenarios
test_validate_account_number_with_valid_format_returns_true
test_validate_account_number_with_empty_string_returns_false
test_calculate_transfer_fee_with_amount_over_threshold_applies_premium_rate
test_parse_date_with_iso_format_returns_datetime_object
test_connect_to_database_with_valid_credentials_returns_connection
test_transform_record_with_null_values_applies_defaults

# Negative scenarios
test_validate_account_number_with_special_characters_raises_validation_error
test_process_batch_with_empty_input_returns_empty_result
test_execute_migration_with_connection_timeout_raises_timeout_error
test_format_currency_with_negative_amount_raises_value_error

# Edge cases
test_validate_account_number_with_maximum_length_returns_true
test_validate_account_number_with_minimum_length_returns_true
test_calculate_fee_with_zero_amount_returns_zero
test_parse_date_with_leap_year_feb_29_returns_correct_date
```

### 6.3 Test Class Naming

```python
class TestAccountValidator:
    """Tests for AccountValidator class."""

class TestMigrationOrchestrator:
    """Tests for MigrationOrchestrator class."""

class TestBatchProcessor:
    """Tests for BatchProcessor class."""

class TestDataTransformer:
    """Tests for DataTransformer class."""
```

### 6.4 Test Module/File Naming

```
test_[module_name].py          # Python
[ModuleName]Tests.cs           # C# / .NET
[module-name].test.ts          # TypeScript / Jest
[module-name].spec.ts          # TypeScript / Vitest (spec variant)
```

### 6.5 Test Directory Structure

```
tests/
├── unit/
│   ├── data_validation/
│   │   ├── test_account_validator.py
│   │   ├── test_transaction_validator.py
│   │   └── test_record_transformer.py
│   ├── migration_engine/
│   │   ├── test_orchestrator.py
│   │   ├── test_batch_processor.py
│   │   └── test_state_manager.py
│   ├── api_services/
│   │   ├── test_migration_controller.py
│   │   └── test_validation_service.py
│   └── utils/
│       ├── test_date_utils.py
│       └── test_currency_utils.py
├── integration/
├── fixtures/
│   ├── sample_records.json
│   ├── test_accounts.json
│   └── migration_configs.yaml
└── conftest.py
```

---

## 7. Test Structure: Arrange-Act-Assert Pattern

### 7.1 Pattern Overview

Every unit test MUST follow the **Arrange-Act-Assert (AAA)** pattern. This pattern provides a clear, readable structure that separates setup, execution, and verification phases.

### 7.2 Pattern Sections

| Section | Purpose | Guidelines |
|---|---|---|
| **Arrange** | Set up test prerequisites | Create objects, configure mocks, prepare test data |
| **Act** | Execute the function under test | Single method call that triggers the behavior |
| **Assert** | Verify the expected outcome | Assert against expected values, verify mock interactions |

### 7.3 Implementation Examples

#### Python (pytest)

```python
def test_validate_account_number_with_valid_format_returns_true():
    # Arrange
    validator = AccountValidator()
    account_number = "1234567890"

    # Act
    result = validator.validate(account_number)

    # Assert
    assert result is True


def test_calculate_transfer_fee_with_domestic_transfer_applies_correct_rate():
    # Arrange
    calculator = FeeCalculator(rate_table=DEFAULT_DOMESTIC_RATES)
    transfer = Transfer(
        source_account="ACC001",
        destination_account="ACC002",
        amount=Decimal("1000.00"),
        currency="USD",
        transfer_type="DOMESTIC"
    )

    # Act
    fee = calculator.calculate(transfer)

    # Assert
    assert fee.amount == Decimal("15.00")
    assert fee.currency == "USD"
    assert fee.rate == Decimal("0.0015")


def test_process_migration_batch_with_invalid_state_raises_error():
    # Arrange
    processor = BatchProcessor()
    batch = Batch(
        batch_id="BATCH-001",
        state="INVALID_STATE",
        records=[]
    )

    # Act & Assert
    with pytest.raises(InvalidBatchStateError) as exc_info:
        processor.process(batch)
    assert "Invalid batch state: INVALID_STATE" in str(exc_info.value)
```

#### C# / .NET (xUnit)

```csharp
public class AccountValidatorTests
{
    [Fact]
    public void TestValidateAccountNumber_WithValidFormat_ReturnsTrue()
    {
        // Arrange
        var validator = new AccountValidator();
        var accountNumber = "1234567890";

        // Act
        var result = validator.Validate(accountNumber);

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("ABC")]
    [InlineData("123")]
    public void TestValidateAccountNumber_WithInvalidInput_ReturnsFalse(string input)
    {
        // Arrange
        var validator = new AccountValidator();

        // Act
        var result = validator.Validate(input);

        // Assert
        Assert.False(result);
    }
}
```

#### TypeScript (Jest/Vitest)

```typescript
describe('AccountValidator', () => {
  it('test_validate_account_number_with_valid_format_returns_true', () => {
    // Arrange
    const validator = new AccountValidator();
    const accountNumber = '1234567890';

    // Act
    const result = validator.validate(accountNumber);

    // Assert
    expect(result).toBe(true);
  });

  it('test_validate_account_number_with_empty_string_returns_false', () => {
    // Arrange
    const validator = new AccountValidator();
    const accountNumber = '';

    // Act
    const result = validator.validate(accountNumber);

    // Assert
    expect(result).toBe(false);
  });
});
```

### 7.4 Section Guidelines

- **Arrange section**: May contain multiple lines. Group related setup operations. Use helper functions for complex setup.
- **Act section**: MUST contain exactly one logical operation. Do not mix multiple function calls.
- **Assert section**: MUST contain at least one assertion. Multiple assertions are acceptable when verifying a single logical outcome.
- **Comments**: Use `# Arrange`, `# Act`, `# Assert` comments to clearly delineate sections in Python. In other languages, use equivalent comment markers.

---

## 8. Mocking Standards

### 8.1 When to Mock

| Scenario | Mock? | Rationale |
|---|---|---|
| Database calls | Yes | Avoid I/O, ensure isolation |
| External API calls | Yes | Prevent network dependency, control responses |
| File system operations | Yes | Ensure test portability and speed |
| Time-dependent logic | Yes | Make tests deterministic |
| Complex object creation | Use factory | Reduce test setup complexity |
| Random number generation | Yes | Ensure reproducibility |
| Internal service dependencies | Yes | Isolate unit from component interactions |
| Pure functions | No | No dependencies to mock |
| Value objects | No | Behavior should be self-contained |

### 8.2 Mock Boundaries

Mocks MUST be placed at the following boundaries:

1. **External system boundaries**: Databases, message queues, third-party APIs, file systems
2. **Time boundaries**: System clock, timers, scheduled operations
3. **Network boundaries**: HTTP clients, WebSocket connections, gRPC clients
4. **Process boundaries**: Child processes, system commands, shell operations
5. **Randomness boundaries**: UUID generators, random number generators, cryptographic operations

### 8.3 Mock Verification

All mocks should be verified for:

- **Call count**: Verify the mock was called the expected number of times
- **Arguments**: Verify the mock received the expected arguments
- **Call order**: Verify mocks were called in the expected sequence (when order matters)
- **No unexpected calls**: Verify the mock was not called with unexpected arguments

### 8.4 Mocking Examples

#### Python (pytest-mock / unittest.mock)

```python
from unittest.mock import Mock, patch, MagicMock
import pytest


class TestMigrationOrchestrator:
    def test_execute_migration_with_valid_batch_commits_all_records(self, mocker):
        # Arrange
        orchestrator = MigrationOrchestrator()
        mock_db = mocker.patch('migration_engine.orchestrator.DatabaseClient')
        mock_validator = mocker.patch('migration_engine.orchestrator.RecordValidator')

        batch = BatchFactory.create(records=5)
        mock_validator.validate.return_value = True
        mock_db.commit.return_value = None

        # Act
        result = orchestrator.execute(batch)

        # Assert
        assert result.status == "COMPLETED"
        assert result.records_migrated == 5
        mock_validator.validate.assert_called_times(5)
        mock_db.commit.assert_called_once()

    def test_execute_migration_with_validation_failure_rolls_back(self, mocker):
        # Arrange
        orchestrator = MigrationOrchestrator()
        mock_db = mocker.patch('migration_engine.orchestrator.DatabaseClient')
        mock_validator = mocker.patch('migration_engine.orchestrator.RecordValidator')

        batch = BatchFactory.create(records=5)
        mock_validator.validate.side_effect = [True, True, False, True, True]
        mock_db.rollback.return_value = None

        # Act
        result = orchestrator.execute(batch)

        # Assert
        assert result.status == "FAILED"
        assert result.records_migrated == 2
        mock_db.rollback.assert_called_once()
        mock_db.commit.assert_not_called()

    def test_execute_migration_with_connection_timeout_retries(self, mocker):
        # Arrange
        orchestrator = MigrationOrchestrator(max_retries=3)
        mock_db = mocker.patch('migration_engine.orchestrator.DatabaseClient')

        mock_db.connect.side_effect = [
            ConnectionTimeoutError,
            ConnectionTimeoutError,
            Mock()
        ]

        batch = BatchFactory.create(records=1)

        # Act
        result = orchestrator.execute(batch)

        # Assert
        assert result.status == "COMPLETED"
        assert mock_db.connect.call_count == 3
```

#### C# / .NET (Moq)

```csharp
public class MigrationOrchestratorTests
{
    private readonly Mock<IDatabaseClient> _mockDb;
    private readonly Mock<IRecordValidator> _mockValidator;
    private readonly MigrationOrchestrator _orchestrator;

    public MigrationOrchestratorTests()
    {
        _mockDb = new Mock<IDatabaseClient>();
        _mockValidator = new Mock<IRecordValidator>();
        _orchestrator = new MigrationOrchestrator(
            _mockDb.Object,
            _mockValidator.Object);
    }

    [Fact]
    public void TestExecuteMigration_WithValidBatch_CommitsAllRecords()
    {
        // Arrange
        var batch = BatchFactory.Create(recordCount: 5);
        _mockValidator.Setup(v => v.Validate(It.IsAny<Record>()))
                      .Returns(true);

        // Act
        var result = _orchestrator.Execute(batch);

        // Assert
        Assert.Equal("COMPLETED", result.Status);
        Assert.Equal(5, result.RecordsMigrated);
        _mockValidator.Verify(v => v.Validate(It.IsAny<Record>()),
                             Times.Exactly(5));
        _mockDb.Verify(d => d.Commit(), Times.Once);
    }

    [Fact]
    public void TestExecuteMigration_WithValidationFailure_RollsBack()
    {
        // Arrange
        var batch = BatchFactory.Create(recordCount: 5);
        var callCount = 0;
        _mockValidator.Setup(v => v.Validate(It.IsAny<Record>()))
                      .Returns(() => ++callCount != 3);

        // Act
        var result = _orchestrator.Execute(batch);

        // Assert
        Assert.Equal("FAILED", result.Status);
        Assert.Equal(2, result.RecordsMigrated);
        _mockDb.Verify(d => d.Rollback(), Times.Once);
        _mockDb.Verify(d => d.Commit(), Times.Never);
    }
}
```

### 8.5 Anti-Patterns to Avoid

| Anti-Pattern | Problem | Correct Approach |
|---|---|---|
| Mocking everything | Tests become fragile and coupled to implementation | Mock only external boundaries |
| Mocking value objects | Adds unnecessary complexity | Use real objects for simple data classes |
| Verifying implementation details | Tests break on refactoring | Verify behavior, not implementation |
| Over-specifying mock behavior | Tests become hard to maintain | Use flexible matchers where appropriate |
| Shared mock state between tests | Causes test interdependence | Create fresh mocks in each test |

---

## 9. Fixtures and Test Data Management

### 9.1 Fixture Setup

Fixtures provide consistent, reusable test data and environment configuration.

#### Python (pytest fixtures)

```python
import pytest
from decimal import Decimal


@pytest.fixture
def sample_account():
    """Provide a valid sample account for testing."""
    return Account(
        account_id="ACC-TEST-001",
        account_holder="John Doe",
        account_type="CHECKING",
        balance=Decimal("10000.00"),
        currency="USD",
        status="ACTIVE",
        created_date=datetime(2025, 1, 1)
    )


@pytest.fixture
def sample_batch():
    """Provide a sample migration batch with test records."""
    return Batch(
        batch_id="BATCH-TEST-001",
        state="PENDING",
        records=[
            Record(id="R001", data={"key": "value1"}),
            Record(id="R002", data={"key": "value2"}),
            Record(id="R003", data={"key": "value3"}),
        ],
        metadata={"source": "TEST", "target": "TEST"}
    )


@pytest.fixture
def mock_database(mocker):
    """Provide a mocked database client."""
    mock_db = mocker.patch('data_access.DatabaseClient')
    mock_db.connect.return_value = True
    mock_db.disconnect.return_value = None
    mock_db.is_connected.return_value = True
    yield mock_db
    mock_db.disconnect.assert_called_once()


@pytest.fixture(autouse=True)
def reset_test_state():
    """Automatically reset test state before each test."""
    yield
    # Teardown: clear any global state
    cache.clear()
    reset_global_counters()
```

### 9.2 Teardown

```python
@pytest.fixture
def database_connection():
    """Provide a database connection with proper cleanup."""
    conn = create_test_connection()
    yield conn
    # Teardown
    conn.rollback()
    conn.close()


@pytest.fixture
def temporary_file(tmp_path):
    """Provide a temporary file with automatic cleanup."""
    file_path = tmp_path / "test_data.csv"
    file_path.write_text("id,name,value\n1,test,100\n")
    yield file_path
    # Teardown: pytest's tmp_path handles cleanup automatically
```

### 9.3 Shared Fixtures (conftest.py)

```python
# tests/unit/conftest.py

import pytest
from faker import Faker

fake = Faker()


@pytest.fixture(scope="session")
def app_config():
    """Provide application configuration for the entire test session."""
    return AppConfig(
        environment="TEST",
        database_url="sqlite:///:memory:",
        log_level="DEBUG"
    )


@pytest.fixture(scope="function")
def fresh_account_repository(app_config):
    """Provide a fresh in-memory account repository per test."""
    return InMemoryAccountRepository(config=app_config)


@pytest.fixture(scope="module")
def sample_accounts():
    """Provide a set of sample accounts for the module."""
    return [
        AccountFactory.create(account_type="CHECKING"),
        AccountFactory.create(account_type="SAVINGS"),
        AccountFactory.create(account_type="INVESTMENT"),
    ]


@pytest.fixture
def valid_transfer_request():
    """Provide a valid transfer request."""
    return TransferRequest(
        source_account="ACC-001",
        target_account="ACC-002",
        amount=Decimal("500.00"),
        currency="USD",
        idempotency_key=str(uuid.uuid4())
    )
```

### 9.4 Factory Patterns

```python
# tests/factories.py

import factory
from faker import Faker

fake = Faker()


class AccountFactory(factory.Factory):
    class Meta:
        model = Account

    account_id = factory.LazyFunction(lambda: f"ACC-{fake.uuid4()[:8]}")
    account_holder = factory.LazyFunction(fake.name)
    account_type = factory.Iterator(["CHECKING", "SAVINGS", "INVESTMENT"])
    balance = factory.LazyFunction(lambda: Decimal(str(fake.pydecimal(
        left_digits=6, right_digits=2, positive=True
    ))))
    currency = factory.Iterator(["USD", "EUR", "GBP"])
    status = factory.Iterator(["ACTIVE", "INACTIVE", "FROZEN"])
    created_date = factory.LazyFunction(fake.date_time_between)


class BatchFactory(factory.Factory):
    class Meta:
        model = Batch

    batch_id = factory.LazyFunction(lambda: f"BATCH-{fake.uuid4()[:8]}")
    state = "PENDING"
    records = factory.LazyFunction(lambda: [
        RecordFactory() for _ in range(3)
    ])
    metadata = factory.LazyFunction(lambda: {
        "source": fake.word(),
        "target": fake.word(),
        "timestamp": fake.iso8601()
    })


class RecordFactory(factory.Factory):
    class Meta:
        model = Record

    id = factory.LazyFunction(lambda: f"REC-{fake.uuid4()[:8]}")
    data = factory.LazyFunction(lambda: {
        "name": fake.word(),
        "value": fake.pydecimal(left_digits=4, right_digits=2, positive=True),
        "timestamp": fake.iso8601()
    })


# Usage in tests
def test_process_batch_with_multiple_records():
    batch = BatchFactory(records=RecordFactory.build_batch(size=10))
    # ...
```

### 9.5 Parameterized Tests

```python
import pytest


@pytest.mark.parametrize("input_value,expected", [
    ("1234567890", True),
    ("0000000001", True),
    ("1234567890123456", True),   # Max length
    ("", False),                   # Empty
    ("123", False),                 # Too short
    ("12345678901234567", False),  # Too long
    ("ABCDEF1234", False),         # Contains letters
    ("1234-5678-90", False),       # Contains hyphens
    (None, False),                  # Null
])
def test_validate_account_number_various_inputs(input_value, expected):
    # Arrange
    validator = AccountValidator()

    # Act
    result = validator.validate(input_value)

    # Assert
    assert result == expected


@pytest.mark.parametrize("amount,currency,expected_fee", [
    (Decimal("100.00"), "USD", Decimal("1.50")),
    (Decimal("1000.00"), "USD", Decimal("15.00")),
    (Decimal("100.00"), "EUR", Decimal("1.20")),
    (Decimal("0.01"), "USD", Decimal("0.01")),
    (Decimal("0.00"), "USD", Decimal("0.00")),
])
def test_calculate_fee_various_amounts(amount, currency, expected_fee):
    # Arrange
    calculator = FeeCalculator()

    # Act
    fee = calculator.calculate(amount, currency)

    # Assert
    assert fee == expected_fee
```

---

## 10. Test Isolation

### 10.1 No Shared State

Each test MUST be completely independent and must not depend on the execution order or results of other tests.

| Principle | Implementation |
|---|---|
| No shared mutable state | Each test creates its own data and objects |
| No test ordering dependencies | Tests must pass in any order |
| No shared database records | Use transaction rollback or in-memory databases |
| No shared file system artifacts | Use temporary directories with cleanup |
| No shared network resources | Mock all external services |

### 10.2 Deterministic Tests

Tests MUST produce the same result every time they are executed. Sources of non-determinism must be eliminated:

| Non-Deterministic Source | Mitigation Strategy |
|---|---|
| Current date/time | Mock `datetime.now()` or inject clock |
| Random numbers | Seed the generator or mock `random` |
| UUIDs | Use fixed UUIDs or mock `uuid.uuid4()` |
| Network latency | Mock network calls |
| File system ordering | Sort results before comparison |
| Database query ordering | Always specify ORDER BY, or sort in test |
| Concurrent execution | Use proper synchronization in tests |

```python
# BAD: Non-deterministic test
def test_create_transaction_with_current_timestamp():
    tx = Transaction.create(amount=100)
    assert tx.created_at.date() == datetime.now().date()  # Flaky!

# GOOD: Deterministic test
def test_create_transaction_with_current_timestamp(mocker):
    fixed_time = datetime(2026, 7, 1, 12, 0, 0)
    mocker.patch('datetime.datetime', return_value=fixed_time)
    tx = Transaction.create(amount=100)
    assert tx.created_at == fixed_time
```

### 10.3 Fast Execution

Unit tests MUST execute quickly to provide rapid feedback:

| Threshold | Classification | Action |
|---|---|---|
| < 100ms | Fast | Normal |
| 100ms - 500ms | Acceptable | Monitor |
| 500ms - 1s | Slow | Investigate and optimize |
| > 1s | Unacceptable | Must be fixed or moved to integration tests |

### 10.4 Isolation Checklist

Before submitting a test, verify:

- [ ] Test does not read or write to shared file system locations
- [ ] Test does not depend on environment variables (unless set in fixture)
- [ ] Test does not depend on execution order
- [ ] Test does not use real database connections
- [ ] Test does not make real network calls
- [ ] Test cleans up after itself (fixtures handle teardown)
- [ ] Test completes within 500ms

---

## 11. Recommended Tools and Frameworks

### 11.1 Python

| Tool | Purpose | MAP Usage |
|---|---|---|
| **pytest** | Test framework | Primary test runner |
| **pytest-cov** | Coverage measurement | Code coverage reporting |
| **pytest-mock** | Mocking utilities | Mock creation and management |
| **pytest-asyncio** | Async test support | Async function testing |
| **pytest-xdist** | Parallel execution | Test suite acceleration |
| **pytest-timeout** | Test timeout enforcement | Prevent hanging tests |
| **hypothesis** | Property-based testing | Edge case discovery |
| **faker** | Test data generation | Realistic test data creation |
| **factory_boy** | Test fixture factories | Complex object creation |
| **responses** | HTTP mocking | External API call simulation |
| **freezegun** | Time mocking | Date/time-dependent logic |

```python
# pytest.ini configuration
[pytest]
testpaths = tests/unit
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    --strict-markers
    --tb=short
    --cov=src
    --cov-report=html
    --cov-report=term
    --cov-fail-under=80
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    smoke: marks tests as smoke tests
```

### 11.2 C# / .NET

| Tool | Purpose | MAP Usage |
|---|---|---|
| **xUnit** | Test framework | Primary test framework |
| **NUnit** | Alternative test framework | Legacy module testing |
| **MSTest** | Microsoft test framework | Compatibility testing |
| **Moq** | Mocking framework | Dependency mocking |
| **FluentAssertions** | Assertion library | Readable assertions |
| **AutoFixture** | Test data generation | Complex object creation |
| **Coverlet** | Code coverage | Coverage measurement |
| **BenchmarkDotNet** | Performance testing | Performance regression detection |

```csharp
// .runsettings configuration
<RunSettings>
  <DataCollectionRunSettings>
    <DataCollectors>
      <DataCollector friendlyName="XPlat Code Coverage">
        <Configuration>
          <Exclude>[xunit.*]*</Exclude>
          <Exclude>[*.Tests]*</Exclude>
          <Include>[MAP.*]*</Include>
          <ExcludeByAttribute>Obsolete,GeneratedCode,CompilerGenerated</ExcludeByAttribute>
        </Configuration>
      </DataCollector>
    </DataCollectors>
  </DataCollectionRunSettings>
</RunSettings>
```

### 11.3 JavaScript / TypeScript

| Tool | Purpose | MAP Usage |
|---|---|---|
| **Jest** | Test framework | React component testing |
| **Vitest** | Test framework | Modern alternative for ESM |
| **React Testing Library** | Component testing | UI component validation |
| **MSW** | API mocking | Service worker mocking |
| **Sinon** | Mocking/stubbing | General mocking utilities |
| **nyc/istanbul** | Code coverage | Coverage measurement |
| **Playwright** | Browser testing | E2E component testing |

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 85,
        statements: 80,
      },
    },
  },
});
```

### 11.4 Tool Selection Matrix

| Criteria | Python | .NET | TypeScript |
|---|---|---|---|
| **Primary Framework** | pytest | xUnit | Vitest |
| **Mocking** | pytest-mock | Moq | Vitest mocks |
| **Coverage** | pytest-cov | Coverlet | c8/v8 |
| **Assertions** | assert / pytest | xUnit Assert / FluentAssertions | expect |
| **Async** | pytest-asyncio | xUnit async | Vitest async |
| **Parameterize** | @pytest.mark.parametrize | [Theory] / [InlineData] | test.each |

---

## 12. Best Practices

### 12.1 One Assertion Per Test (Logical)

Each test should verify one logical behavior. Multiple assertions are acceptable when they verify a single logical outcome.

```python
# GOOD: One logical behavior with related assertions
def test_create_account_with_valid_data_sets_all_fields():
    # Arrange
    data = AccountData(name="John", type="CHECKING")

    # Act
    account = AccountService.create(data)

    # Assert
    assert account.name == "John"           # Same logical outcome
    assert account.type == "CHECKING"       # Same logical outcome
    assert account.status == "ACTIVE"       # Same logical outcome
    assert account.created_at is not None   # Same logical outcome


# BAD: Multiple unrelated logical behaviors
def test_account_operations():
    account = create_account()
    assert account.status == "ACTIVE"
    account.debit(100)                       # Different behavior!
    assert account.balance == 900            # Different behavior!
    account.freeze()                         # Different behavior!
    assert account.status == "FROZEN"       # Different behavior!
```

### 12.2 Test Independence

Every test must be runnable independently without depending on other tests.

```python
# GOOD: Each test is self-contained
class TestAccountValidator:
    def test_valid_account_number(self):
        validator = AccountValidator()
        assert validator.validate("1234567890") is True

    def test_invalid_account_number(self):
        validator = AccountValidator()
        assert validator.validate("ABC") is False


# BAD: Tests depend on shared state
class TestAccountValidator:
    def test_setup_accounts(self):
        self.accounts = [create_account() for _ in range(5)]

    def test_first_account_valid(self):
        assert self.accounts[0].is_valid()  # Depends on setup_accounts!
```

### 12.3 Clear and Descriptive Naming

Test names MUST clearly communicate what is being tested and the expected outcome.

```python
# GOOD: Clear, descriptive names
def test_migrate_batch_with_partial_failure_marks_records_as_failed():
def test_validate_record_with_missing_required_field_raises_validation_error():
def test_calculate_fee_with_zero_amount_returns_zero_fee():
def test_connect_to_database_with_invalid_credentials_raises_auth_error():

# BAD: Vague, unclear names
def test_migrate():
def test_validation():
def test_fee_calculation():
def test_error_handling():
```

### 12.4 Edge Cases and Boundary Values

Every function must have tests covering:

| Category | Description | Example |
|---|---|---|
| **Happy path** | Normal, expected input | Valid account number |
| **Boundary minimum** | Minimum allowed value | Min length string |
| **Boundary maximum** | Maximum allowed value | Max length string |
| **Boundary off-by-one** | Just outside allowed range | Min - 1, Max + 1 |
| **Empty/Null** | Empty string, null, None | Empty input |
| **Special characters** | Unexpected characters | `!@#$%^&*()` |
| **Negative values** | Below zero | -1, -100.00 |
| **Zero** | Exact zero | 0, 0.00 |
| **Overflow** | Very large values | MAX_INT, Decimal overflow |
| **Unicode** | Non-ASCII characters | `日本語`, `émojis 🔥` |

### 12.5 Avoid Magic Numbers

```python
# BAD: Magic numbers
def test_batch_limit():
    batch = create_batch(101)  # What is 101?
    assert batch.is_over_limit()

# GOOD: Named constants
MAX_BATCH_SIZE = 100

def test_batch_limit():
    batch = create_batch(MAX_BATCH_SIZE + 1)
    assert batch.is_over_limit()
```

### 12.6 Test Data Builders

```python
# BAD: Verbose test data creation
def test_process_large_batch():
    batch = Batch(
        id="BATCH-001",
        state="PENDING",
        records=[
            Record(id="R001", data={"field1": "val1", "field2": "val2"}),
            Record(id="R002", data={"field1": "val3", "field2": "val4"}),
            # ... 50 more records
        ],
        metadata={"source": "TEST"}
    )

# GOOD: Builder pattern
def test_process_large_batch():
    batch = (BatchBuilder()
             .with_id("BATCH-001")
             .with_state("PENDING")
             .with_records(count=50)
             .with_metadata(source="TEST")
             .build())
```

### 12.7 Documentation Through Tests

```python
class TestAccountTransferRules:
    """Tests documenting business rules for account transfers."""

    def test_transfer_within_same_bank_does_not_require_approval(self):
        """Business Rule: Transfers between accounts at the same bank
        are processed automatically without manager approval."""
        # ...

    def test_transfer_exceeding_daily_limit_requires_approval(self):
        """Business Rule: Any transfer exceeding $10,000 in a single day
        requires manager approval before processing."""
        # ...

    def test_international_transfer_requires_swift_code(self):
        """Business Rule: International transfers must include a valid
        SWIFT/BIC code for the destination institution."""
        # ...
```

---

## 13. Test Categories

### 13.1 Category Overview

| Category | Description | Priority | Automation |
|---|---|---|---|
| Happy Path | Normal, expected behavior | Critical | 100% |
| Edge Cases | Boundary conditions and unusual inputs | High | 100% |
| Error Handling | Error scenarios and recovery | High | 100% |
| Boundary Values | Min/max limits and thresholds | High | 100% |
| State Transitions | State machine behavior | Medium | 100% |
| Concurrency | Thread safety and race conditions | Medium | Best effort |
| Security | Input validation and injection prevention | Critical | 100% |

### 13.2 Happy Path Tests

Validate that the function works correctly with valid, expected inputs.

```python
def test_create_account_with_valid_data_returns_active_account():
    """Happy Path: Creating an account with all valid fields."""
    service = AccountService()
    data = AccountData(
        name="John Doe",
        account_type="CHECKING",
        initial_deposit=Decimal("1000.00")
    )

    account = service.create(data)

    assert account.id is not None
    assert account.name == "John Doe"
    assert account.status == "ACTIVE"
    assert account.balance == Decimal("1000.00")
```

### 13.3 Edge Case Tests

Validate behavior at the boundaries of expected input ranges.

```python
def test_validate_account_number_with_exactly_10_characters_returns_true():
    """Edge Case: Account number at exact maximum length."""
    validator = AccountValidator()
    account_number = "1" * 10  # Exactly 10 characters

    assert validator.validate(account_number) is True


def test_validate_account_number_with_11_characters_returns_false():
    """Edge Case: Account number one character over maximum."""
    validator = AccountValidator()
    account_number = "1" * 11  # One over the limit

    assert validator.validate(account_number) is False


def test_calculate_fee_with_minimum_transfer_amount():
    """Edge Case: Minimum transfer amount that incurs a fee."""
    calculator = FeeCalculator()
    fee = calculator.calculate(Decimal("0.01"), "USD")

    assert fee >= Decimal("0.00")
```

### 13.4 Error Handling Tests

Validate that errors are properly caught, logged, and propagated.

```python
def test_connect_to_database_with_invalid_url_raises_connection_error():
    """Error Handling: Invalid database URL."""
    client = DatabaseClient()

    with pytest.raises(ConnectionError) as exc_info:
        client.connect("invalid-url")

    assert "Invalid database URL" in str(exc_info.value)


def test_process_batch_with_corrupt_data_logs_error_and_continues():
    """Error Handling: Corrupt record in batch does not halt processing."""
    processor = BatchProcessor()
    batch = BatchFactory.create(records=[
        RecordFactory.create(data={"valid": True}),
        RecordFactory.create(data={"corrupt": True}),
        RecordFactory.create(data={"valid": True}),
    ])

    result = processor.process(batch)

    assert result.status == "PARTIAL"
    assert result.records_processed == 3
    assert result.records_failed == 1
    assert len(result.errors) == 1
    assert "DataCorruptionError" in result.errors[0].error_type


def test_transform_record_with_missing_required_field_raises_validation_error():
    """Error Handling: Missing required field."""
    transformer = RecordTransformer()
    record = RecordFactory.create(data={"optional_field": "value"})

    with pytest.raises(ValidationError) as exc_info:
        transformer.transform(record)

    assert "required_field" in str(exc_info.value)
```

### 13.5 Boundary Value Tests

```python
@pytest.mark.parametrize("amount,expected_result", [
    (Decimal("0.00"), "ZERO_AMOUNT"),
    (Decimal("0.01"), "VALID"),
    (Decimal("9999.99"), "VALID"),
    (Decimal("10000.00"), "VALID"),
    (Decimal("10000.01"), "REQUIRES_APPROVAL"),
    (Decimal("99999999.99"), "VALID"),
    (Decimal("100000000.00"), "EXCEEDS_LIMIT"),
])
def test_transfer_amount_boundaries(amount, expected_result):
    """Boundary Values: Validate transfer amount boundaries."""
    validator = TransferValidator()

    result = validator.validate_amount(amount)

    assert result == expected_result
```

### 13.6 State Transition Tests

```python
def test_batch_lifecycle_pending_to_in_progress_to_completed():
    """State Transition: Normal batch lifecycle."""
    batch = BatchFactory.create(state="PENDING")
    processor = BatchProcessor()

    processor.start(batch)
    assert batch.state == "IN_PROGRESS"

    processor.complete(batch)
    assert batch.state == "COMPLETED"


def test_batch_lifecycle_pending_to_in_progress_to_failed():
    """State Transition: Batch failure."""
    batch = BatchFactory.create(state="PENDING")
    processor = BatchProcessor()

    processor.start(batch)
    assert batch.state == "IN_PROGRESS"

    processor.fail(batch, reason="Data validation error")
    assert batch.state == "FAILED"
    assert batch.failure_reason == "Data validation error"


def test_batch_cannot_transition_from_completed_to_pending():
    """State Transition: Invalid state transition."""
    batch = BatchFactory.create(state="COMPLETED")
    processor = BatchProcessor()

    with pytest.raises(InvalidStateTransitionError):
        processor.transition(batch, "PENDING")
```

---

## 14. Code Coverage Measurement

### 14.1 Coverage Tools

| Language | Tool | Output Formats |
|---|---|---|
| Python | pytest-cov / coverage.py | HTML, XML, JSON, terminal |
| C# / .NET | Coverlet + ReportGenerator | HTML, Cobertura, lcov |
| TypeScript | c8 / v8 / Istanbul | HTML, lcov, json-summary |

### 14.2 Coverage Configuration

```ini
# .coveragerc (Python)
[run]
source = src
branch = True
omit =
    */tests/*
    */__pycache__/*
    */migrations/*
    */auto_generated/*

[report]
precision = 2
fail_under = 80
show_missing = True
exclude_lines =
    pragma: no cover
    def __repr__
    if __name__ == .__main__
    raise NotImplementedError
    pass
    except ImportError

[html]
directory = htmlcov

[xml]
output = coverage.xml
```

### 14.3 Coverage Reports

Coverage reports MUST include:

1. **Terminal summary**: Quick overview during CI/CD
2. **HTML report**: Detailed drill-down for developers
3. **XML report**: Machine-readable for quality gates
4. **JSON summary**: Dashboard integration

### 14.4 Coverage Enforcement

```yaml
# CI/CD pipeline configuration
coverage_check:
  stage: test
  script:
    - pytest --cov=src --cov-report=xml --cov-fail-under=80
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
    paths:
      - htmlcov/
  rules:
    - if: '$CI_MERGE_REQUEST_ID'
      when: always
```

### 14.5 Coverage Metrics Dashboard

| Metric | Current | Target | Status |
|---|---|---|---|
| Overall Line Coverage | 82% | ≥ 80% | ✅ Passing |
| Overall Branch Coverage | 73% | ≥ 70% | ✅ Passing |
| data_validation/ | 96% | ≥ 95% | ✅ Passing |
| migration_engine/ | 91% | ≥ 90% | ✅ Passing |
| api_services/ | 86% | ≥ 85% | ✅ Passing |
| business_logic/ | 87% | ≥ 85% | ✅ Passing |
| utils/ | 82% | ≥ 80% | ✅ Passing |
| config/ | 76% | ≥ 75% | ✅ Passing |
| Mutation Score | 65% | ≥ 60% | ✅ Passing |

---

## 15. Test Maintenance

### 15.1 Refactoring Tests

When refactoring test code:

1. **Run full test suite before refactoring** to establish a baseline
2. **Refactor incrementally** — change one thing at a time
3. **Run tests after each change** to catch regressions
4. **Extract shared helpers** into fixture modules
5. **Consolidate duplicate test logic** into factory functions
6. **Review test names** after refactoring to ensure they remain accurate

### 15.2 Flaky Test Management

| Symptom | Root Cause | Resolution |
|---|---|---|
| Intermittent failures | Non-deterministic inputs | Mock time/random/UUIDs |
| Passes locally, fails in CI | Environment differences | Standardize test environment |
| Slow execution | Expensive operations | Mock I/O, use in-memory stores |
| Order-dependent | Shared mutable state | Isolate tests, reset fixtures |
| Network-dependent | Real API calls | Mock all external calls |

### 15.3 Flaky Test Policy

1. **Detection**: CI system tags tests that fail intermittently
2. **Quarantine**: Flaky tests are moved to a quarantine suite
3. **Resolution**: Team must fix or delete quarantined tests within 2 sprints
4. **Escalation**: Unresolved flaky tests after 2 sprints require architecture review

### 15.4 Test Debt Tracking

```yaml
# test-debt.yaml
test_debt:
  - id: TD-001
    module: migration_engine/orchestrator.py
    issue: Missing edge case tests for concurrent batch processing
    priority: High
    created: 2026-06-15
    due: 2026-07-15
    assigned_to: Team Migration

  - id: TD-002
    module: api_services/validators.py
    issue: Flaky test in test_validate_batch_with_large_dataset
    priority: Medium
    created: 2026-06-20
    due: 2026-07-20
    assigned_to: Team API
```

### 15.5 Test Review Checklist

When reviewing test code, verify:

- [ ] Test follows AAA pattern with clear sections
- [ ] Test name follows naming convention and describes behavior
- [ ] Test is independent and has no shared state
- [ ] Test completes within 500ms
- [ ] Mocks are used appropriately (not over-mocked)
- [ ] Assertions verify behavior, not implementation
- [ ] Edge cases and error scenarios are covered
- [ ] No magic numbers or hardcoded test data
- [ ] Fixtures are used for shared setup
- [ ] Test documentation explains business rule being validated

---

## 16. Continuous Integration Integration

### 16.1 CI Pipeline Configuration

```yaml
# .gitlab-ci.yml / GitHub Actions equivalent
stages:
  - lint
  - test
  - coverage
  - quality_gate

unit_tests:
  stage: test
  script:
    - pip install -r requirements-test.txt
    - pytest tests/unit/
      --cov=src
      --cov-branch
      --cov-report=xml:coverage.xml
      --cov-report=html:htmlcov
      --junitxml=test-results.xml
      -v
  artifacts:
    when: always
    paths:
      - htmlcov/
      - coverage.xml
      - test-results.xml
    reports:
      junit: test-results.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

coverage_check:
  stage: coverage
  script:
    - python scripts/check_coverage.py --min-line=80 --min-branch=70
  dependencies:
    - unit_tests

quality_gate:
  stage: quality_gate
  script:
    - python scripts/quality_gate.py
  dependencies:
    - unit_tests
    - coverage_check
  rules:
    - if: '$CI_MERGE_REQUEST_ID'
```

### 16.2 Pre-commit Hooks

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run affected tests
pytest --co -q tests/unit/ | head -20
if [ $? -ne 0 ]; then
    echo "Test collection failed. Please check your test files."
    exit 1
fi

# Run linting on test files
ruff check tests/
if [ $? -ne 0 ]; then
    echo "Linting failed on test files."
    exit 1
fi
```

### 16.3 Branch Protection Rules

| Rule | Configuration |
|---|---|
| Require status checks | `unit_tests`, `coverage_check` |
| Require branches to be up to date | Yes |
| Require review from code owners | Yes |
| Require conversation resolution | Yes |
| Require signed commits | Yes |
| Require linear history | Yes |

---

## 17. Dependencies and References

### 17.1 Related MAP Documents

| Document | Batch | Relationship |
|---|---|---|
| Development Standards | Batch 11 | Code quality foundation that unit tests validate |
| AI Integration Standards | Batch 12 | AI-generated code requires equivalent test coverage |
| Integration Testing Standards | Batch 13 | Builds upon unit test foundations |
| E2E Testing Standards | Batch 13 | System-level validation complementing unit tests |
| Security Testing Standards | Batch 13 | Security-focused validation at unit level |

### 17.2 External References

- pytest Documentation: https://docs.pytest.org/
- xUnit Documentation: https://xunit.net/
- Jest Documentation: https://jestjs.io/
- Vitest Documentation: https://vitest.dev/
- Martin Fowler - TestPyramid: https://martinfowler.com/articles/testPyramid.html
- Working Effectively with Legacy Code - Michael Feathers
- Google Testing Best Practices: https://testing.googleblog.com/

### 17.3 Standards References

| Standard | Description |
|---|---|
| IEEE 829 | Standard for Software Test Documentation |
| ISO/IEC/IEEE 29119 | Software Testing Standards |
| ISTQB Foundation | International Software Testing Qualifications |
| OWASP Testing Guide | Security testing best practices |

---

## 18. Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | 15 June 2026 | MAP Quality Engineering | Initial draft |
| 0.2 | 22 June 2026 | MAP Quality Engineering | Added mocking standards, fixture patterns |
| 0.3 | 28 June 2026 | MAP Architecture Board | Review feedback incorporated |
| 0.9 | 01 July 2026 | MAP Quality Engineering | Final review version |
| **1.0** | **02 July 2026** | **MAP Quality Engineering** | **Official release** |

### 18.1 Change Log Summary

- **v0.1**: Initial framework with AAA pattern, naming conventions, and coverage targets
- **v0.2**: Expanded mocking standards, fixture management, factory patterns, and test categories
- **v0.3**: Added CI integration, test maintenance, flaky test management, and quality gates
- **v0.9**: Incorporated stakeholder feedback, refined coverage thresholds, added .NET and TypeScript sections
- **v1.0**: Finalized all sections, added code examples for all three languages, approval signatures

---

## 19. Approval

### 19.1 Document Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| MAP Quality Engineering Lead | _________________ | _________________ | ____/____/2026 |
| MAP Chief Architect | _________________ | _________________ | ____/____/2026 |
| MAP Development Director | _________________ | _________________ | ____/____/2026 |
| MAP Release Manager | _________________ | _________________ | ____/____/2026 |

### 19.2 Review Approval

| Reviewer | Role | Comments | Approved |
|---|---|---|---|
| _________________ | Senior Developer | _________________ | ☐ Yes ☐ No |
| _________________ | QA Lead | _________________ | ☐ Yes ☐ No |
| _________________ | DevOps Engineer | _________________ | ☐ Yes ☐ No |
| _________________ | Security Analyst | _________________ | ☐ Yes ☐ No |

### 19.3 Next Scheduled Review

| Field | Value |
|---|---|
| Review Date | October 2026 |
| Review Owner | MAP Quality Engineering Team |
| Review Scope | All sections, coverage thresholds, tool versions |

---

## Appendix A: Quick Reference Card

### Naming Convention Cheat Sheet

```
Pattern:  test_[function_name]_[scenario]_[expected_result]

Examples:
  test_validate_account_with_valid_input_returns_true
  test_calculate_fee_with_zero_amount_returns_zero
  test_connect_to_database_with_timeout_raises_error
  test_parse_date_with_iso_format_returns_datetime
```

### AAA Pattern Template

```python
def test_[function]_[scenario]_[result]():
    # Arrange
    # Set up objects, mocks, test data

    # Act
    # Call the function under test

    # Assert
    # Verify the expected outcome
```

### Coverage Requirements Summary

| Module | Line | Branch | Enforcement |
|---|---|---|---|
| data_validation/ | 95% | 90% | Hard |
| migration_engine/ | 90% | 85% | Hard |
| api_services/ | 85% | 75% | Hard |
| business_logic/ | 85% | 75% | Hard |
| utils/ | 80% | 70% | Soft |
| config/ | 75% | 65% | Soft |

---

*End of Document*

*This document is the property of MAP (Migration Assurance Platform). Unauthorized distribution is prohibited.*
