# MAP AI Coding Standards

| Field | Value |
|-------|-------|
| **Document** | MAP AI Coding Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Python

### Code Style

AI-generated Python code must follow PEP 8 and these additional standards:

```python
from typing import Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


def process_migration_file(
    file_path: Path,
    dry_run: bool = False,
    max_retries: int = 3
) -> dict[str, any]:
    """Process a migration file and return validation results.

    Args:
        file_path: Path to the migration file to process.
        dry_run: If True, validate without making changes.
        max_retries: Maximum number of retry attempts.

    Returns:
        Dictionary with validation status and details.

    Raises:
        FileNotFoundError: If the migration file does not exist.
        ValidationError: If the file format is invalid.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Migration file not found: {file_path}")

    logger.info("Processing migration file: %s", file_path)

    try:
        result = _validate_file(file_path)
        if not dry_run:
            result = _execute_migration(file_path)
        return {"status": "success", "details": result}
    except Exception as e:
        logger.error("Migration failed: %s", e)
        return {"status": "error", "message": str(e)}
```

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Type Hints** | All function signatures must include type hints |
| **Docstrings** | All public functions must have Google-style docstrings |
| **Async I/O** | Use `async/await` for I/O-bound operations |
| **Path Handling** | Use `pathlib.Path` instead of `os.path` |
| **String Formatting** | Use f-strings for string interpolation |
| **Error Handling** | Catch specific exceptions, log with context |
| **Logging** | Use `logging` module, not print statements |
| **Input Validation** | Validate all external inputs at function entry |
| **Dependencies** | Prefer standard library; justify third-party packages |

### AI Generation Rules

- Generate type hints for all parameters and return values
- Include comprehensive error handling with specific exceptions
- Use async I/O for file operations and HTTP requests
- Generate docstrings with Args, Returns, and Raises sections
- Include input validation for all public functions
- Use context managers for resource management
- Generate logging statements at appropriate levels

---

## 2. .NET

### Code Style

AI-generated .NET code must follow Clean Architecture and these standards:

```csharp
namespace MigrationAssurance.Core.Entities;

/// <summary>
/// Represents a migration validation record.
/// </summary>
public class MigrationRecord
{
    /// <summary>
    /// Gets or sets the unique identifier.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the migration source system.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string SourceSystem { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the validation status.
    /// </summary>
    public ValidationStatus Status { get; set; }

    /// <summary>
    /// Gets or sets the creation timestamp.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public interface IMigrationRepository
{
    Task<MigrationRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MigrationRecord>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<MigrationRecord> CreateAsync(MigrationRecord record, CancellationToken cancellationToken = default);
}
```

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Architecture** | Follow Clean Architecture (Domain, Application, Infrastructure, Presentation) |
| **DI** | Use dependency injection for all services |
| **Async/Await** | All I/O operations must be async |
| **Nullable Types** | Enable nullable reference types |
| **Documentation** | Include XML documentation on all public members |
| **Error Handling** | Use custom exceptions, implement global exception handler |
| **Validation** | Use FluentValidation or Data Annotations |
| **Logging** | Use ILogger with structured logging |

### AI Generation Rules

- Generate interfaces for all services and repositories
- Include dependency injection registration
- Use async/await for all I/O operations
- Generate XML documentation on all public members
- Implement proper error handling with custom exceptions
- Use nullable reference types throughout
- Follow SOLID principles in generated code
- Include unit tests with xUnit and Moq

---

## 3. React

### Code Style

AI-generated React code must use functional components and TypeScript:

```tsx
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const MigrationRecordSchema = z.object({
  id: z.string().uuid(),
  sourceSystem: z.string().min(1).max(100),
  status: z.enum(['pending', 'in-progress', 'completed', 'failed']),
  createdAt: z.string().datetime(),
});

type MigrationRecord = z.infer<typeof MigrationRecordSchema>;

interface MigrationListProps {
  filter?: string;
  onSelect: (id: string) => void;
}

export function MigrationList({ filter, onSelect }: MigrationListProps) {
  const { data: records, isLoading, error } = useQuery({
    queryKey: ['migrations', filter],
    queryFn: () => fetchMigrations(filter),
  });

  const filteredRecords = useMemo(() => {
    if (!records) return [];
    return records.filter(r => 
      !filter || r.sourceSystem.toLowerCase().includes(filter.toLowerCase())
    );
  }, [records, filter]);

  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading migrations</div>;

  return (
    <ul>
      {filteredRecords.map(record => (
        <li key={record.id} onClick={() => handleSelect(record.id)}>
          {record.sourceSystem} - {record.status}
        </li>
      ))}
    </ul>
  );
}
```

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Components** | Functional components only, no class components |
| **Hooks** | Use custom hooks for shared logic |
| **TypeScript** | Strict mode enabled, proper typing everywhere |
| **Server State** | Use React Query for server state management |
| **Error Boundaries** | Wrap feature components in error boundaries |
| **Performance** | Use memo, useCallback, useMemo where appropriate |
| **Forms** | Use controlled components or React Hook Form |
| **Testing** | Write tests with React Testing Library |

### AI Generation Rules

- Generate functional components with TypeScript interfaces
- Include proper prop types with JSDoc comments
- Use React Query for data fetching and caching
- Generate custom hooks for reusable logic
- Include error boundaries and loading states
- Use proper cleanup in useEffect hooks
- Generate accessible components (ARIA attributes)
- Include component tests with React Testing Library

---

## 4. SQL

### Code Style

AI-generated SQL must follow security and performance best practices:

```sql
-- Parameterized query example (do not concatenate user input)
CREATE PROCEDURE usp_GetMigrationRecords
    @SourceSystem NVARCHAR(100) = NULL,
    @Status INT = NULL,
    @PageSize INT = 25,
    @PageNumber INT = 1
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        mr.Id,
        mr.SourceSystem,
        mr.Status,
        mr.CreatedAt,
        mr.UpdatedAt
    FROM dbo.MigrationRecords mr
    WHERE 
        (@SourceSystem IS NULL OR mr.SourceSystem = @SourceSystem)
        AND (@Status IS NULL OR mr.Status = @Status)
    ORDER BY mr.CreatedAt DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    -- Total count for pagination
    SELECT COUNT(*) AS TotalCount
    FROM dbo.MigrationRecords mr
    WHERE 
        (@SourceSystem IS NULL OR mr.SourceSystem = @SourceSystem)
        AND (@Status IS NULL OR mr.Status = @Status);
END
GO

-- Proper indexing
CREATE NONCLUSTERED INDEX IX_MigrationRecords_SourceSystem_Status 
ON dbo.MigrationRecords (SourceSystem, Status)
INCLUDE (CreatedAt, UpdatedAt);
```

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Queries** | Always use parameterized queries |
| **Indexing** | Create proper indexes for query patterns |
| **Migrations** | Use EF Core migrations or Flyway |
| **Raw SQL** | Avoid raw SQL; use ORM when possible |
| **Constraints** | Include proper CHECK, UNIQUE, FOREIGN KEY constraints |
| **Validation** | Validate data at database level with constraints |
| **Performance** | Avoid SELECT *, use specific columns |
| **Security** | Implement row-level security where needed |

### AI Generation Rules

- Generate parameterized queries only
- Include proper indexing suggestions
- Generate migration scripts with up/down operations
- Include data validation constraints
- Avoid SELECT * in generated queries
- Use proper JOIN syntax
- Generate stored procedures for complex operations
- Include execution plans for complex queries

---

## 5. Infrastructure

### Code Style

AI-generated infrastructure code must use IaC templates:

```bicep
// Azure SQL Managed Instance for MAP
@description('Azure SQL Managed Instance name')
param sqlMiName string

@description('Environment name')
@allowed([
  'dev'
  'staging'
  'prod'
])
param environment string

@description('Administrator login name')
@secure()
param administratorLogin string

@description('Administrator login password')
@secure()
param administratorLoginPassword string

var location = resourceGroup().location
var tags = {
  environment: environment
  project: 'MAP'
  managedBy: 'bicep'
}

resource sqlMi 'Microsoft.Sql/managedInstances@2023-08-01-preview' = {
  name: sqlMiName
  location: location
  tags: tags
  sku: {
    name: 'GP_Gen5_4'
    tier: 'GeneralPurpose'
  }
  properties: {
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    vCores: 4
    storageSizeInGB: 32
    licenseType: 'LicenseIncluded'
  }
}

output sqlMiId string = sqlMi.id
output sqlMiFqdn string = sqlMi.properties.fullyQualifiedDomainName
```

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Templates** | Use Bicep or Terraform for Azure resources |
| **Comments** | Include descriptions for all parameters and resources |
| **Naming** | Follow Azure naming conventions |
| **Parameterization** | Make all environment-specific values parameters |
| **Security** | Use Key Vault references for secrets |
| **Tagging** | Apply consistent resource tags |
| **Validation** | Include parameter validation |
| **Documentation** | Generate README with deployment instructions |

### AI Generation Rules

- Generate Bicep templates for Azure resources
- Include parameter descriptions and allowed values
- Use secure parameters for secrets
- Include resource tagging
- Generate outputs for important resource properties
- Include deployment scripts or CI/CD pipeline definitions
- Generate documentation for deployment procedures
- Include cost estimates where possible

---

## 6. Tests

### Code Style

AI-generated tests must follow the AAA pattern:

```csharp
// .NET xUnit example
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
        _repositoryMock.Verify(
            x => x.GetByIdAsync(record.Id, It.IsAny<CancellationToken>()), 
            Times.Once);
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

    private static MigrationRecord CreateValidMigrationRecord() => new()
    {
        Id = Guid.NewGuid(),
        SourceSystem = "TestSystem",
        Status = ValidationStatus.Pending,
        CreatedAt = DateTimeOffset.UtcNow
    };
}
```

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Pattern** | Arrange-Act-Assert (AAA) pattern |
| **Naming** | Descriptive names: Method_Scenario_ExpectedResult |
| **Independence** | Tests must not depend on execution order |
| **Edge Cases** | Include boundary conditions and edge cases |
| **Error Scenarios** | Test all error paths and exception handling |
| **Mocking** | Mock external dependencies, not internal logic |
| **Coverage** | Aim for 80%+ code coverage |
| **Assertions** | One logical assertion per test |

### AI Generation Rules

- Generate tests using AAA pattern
- Use descriptive test names
- Generate edge case tests for all boundary conditions
- Generate error scenario tests for all exception paths
- Mock external dependencies (databases, APIs, file systems)
- Generate parametric tests for multiple input combinations
- Include test data builders or factories
- Generate both positive and negative test cases

---

## 7. Documentation

### Code Style

AI-generated documentation must be clear, concise, and accurate:

```markdown
# Migration Validation Service

## Overview

The Migration Validation Service provides automated validation of data migrations
across heterogeneous source systems. It supports batch processing, real-time
validation, and generates compliance reports.

## Prerequisites

- .NET 8 SDK
- Azure SQL Managed Instance connection
- Azure OpenAI API key

## Quick Start

```bash
# Clone the repository
git clone https://github.com/org/map-validation.git

# Restore dependencies
dotnet restore

# Run tests
dotnet test

# Start the service
dotnet run --project src/MigrationAssurance.Api
```

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `ConnectionStrings:DefaultConnection` | Azure SQL MI connection string | Required |
| `AzureOpenAI:Endpoint` | Azure OpenAI endpoint URL | Required |
| `AzureOpenAI:ApiKey` | Azure OpenAI API key | Required |

## Troubleshooting

### Issue: Connection timeout
**Solution:** Verify network connectivity to Azure SQL MI and check firewall rules.

### Issue: Authentication failure
**Solution:** Verify Azure OpenAI credentials in Azure Key Vault.
```

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Clarity** | Write for the intended audience |
| **Conciseness** | Avoid unnecessary verbosity |
| **Accuracy** | Verify all information is current |
| **Examples** | Include practical code examples |
| **Prerequisites** | List all requirements |
| **Troubleshooting** | Include common issues and solutions |
| **Versioning** | Document version-specific information |

### AI Generation Rules

- Generate documentation appropriate for the audience
- Include practical, runnable examples
- Generate troubleshooting sections for common issues
- Include prerequisites and setup instructions
- Use consistent formatting and structure
- Generate API documentation from code comments
- Include diagrams for complex architectures
- Keep documentation close to the code it describes
