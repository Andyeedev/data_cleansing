# MAP Platform Coding Standards

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Document | MAP Platform Coding Standards            |
| Version  | 1.0                                      |
| Date     | July 2026                                |
| Status   | Official                                 |
| Owner    | MAP Platform Engineering                 |
| Scope    | Code quality, naming, formatting, and conventions |

---

## 1. General Principles

### Readability over Cleverness

Write code that the next engineer can understand without a decoder ring. Clever one-liners that obscure intent are bugs waiting to happen. Clarity is kindness.

```csharp
// Bad: Clever but unclear
var result = items.Where(x => x.IsValid).Select(x => x.Value).Sum();

// Good: Clear intent
var validItemValues = items
    .Where(item => item.IsValid)
    .Select(item => item.Value);
var totalValue = validItemValues.Sum();
```

### Explicit over Implicit

State intent clearly. Avoid relying on language quirks, default behaviors, or hidden conventions. The reader should not need to run code in their head to understand it.

```typescript
// Bad: Implicit boolean
const isActive = user.status;

// Good: Explicit boolean
const isUserActive = user.status === 'active';
```

### Fail Fast

Validate inputs at boundaries. Throw exceptions early rather than allowing invalid state to propagate. Fail with clear error messages that identify what went wrong and where.

```csharp
public async Task<MigrationResult> StartMigrationAsync(StartMigrationRequest request)
{
    ArgumentNullException.ThrowIfNull(request);
    
    if (string.IsNullOrWhiteSpace(request.MigrationId))
        throw new ArgumentException("Migration ID is required.", nameof(request));
    
    // Proceed with valid inputs
}
```

### Minimal Magic

Avoid excessive framework magic, dynamic dispatch, and implicit behaviors. Explicit configuration is preferred over convention that hides behavior. When magic is necessary, document it thoroughly.

---

## 2. Naming Conventions

### C# / .NET

| Element               | Convention           | Example                          |
| --------------------- | -------------------- | -------------------------------- |
| Namespace             | PascalCase           | `Map.Api.Services`               |
| Class                 | PascalCase           | `ValidationService`              |
| Interface             | I + PascalCase       | `IValidationService`             |
| Method                | PascalCase           | `ValidateAsync()`                |
| Property              | PascalCase           | `MigrationStatus`                |
| Field (private)       | _camelCase           | `_dbContext`                     |
| Field (readonly)      | _camelCase           | `_maxRetryCount`                 |
| Parameter             | camelCase            | `migrationId`                    |
| Local variable        | camelCase            | `recordCount`                    |
| Constant              | PascalCase           | `MaxRetryCount`                  |
| Enum                  | PascalCase           | `MigrationStatus`                |
| Enum value            | PascalCase           | `MigrationStatus.InProgress`     |
| Event                 | PascalCase + On      | `OnMigrationCompleted`           |
| Generic type param    | T or T + PascalCase  | `TEntity`, `TResponse`           |
| Extension class       | PascalCase + Extensions | `StringExtensions`            |

### TypeScript / React

| Element               | Convention           | Example                          |
| --------------------- | -------------------- | -------------------------------- |
| Component             | PascalCase           | `MigrationDashboard`             |
| Component file        | PascalCase.tsx       | `MigrationDashboard.tsx`         |
| Hook                  | camelCase + use      | `useMigrations`                  |
| Hook file             | camelCase.ts         | `useMigrations.ts`               |
| Utility function      | camelCase            | `formatDate()`                   |
| Utility file          | camelCase.ts         | `dateUtils.ts`                   |
| Interface             | PascalCase           | `MigrationProps`                 |
| Type alias            | PascalCase           | `MigrationStatus`                |
| Enum                  | PascalCase           | `enum MigrationStatus`           |
| Enum value            | PascalCase           | `MigrationStatus.InProgress`     |
| Constant              | SCREAMING_SNAKE      | `API_BASE_URL`                   |
| CSS class             | kebab-case           | `migration-card`                 |
| CSS variable          | kebab-case           | `--color-primary`                |
| Props interface       | PascalCase + Props   | `MigrationListProps`             |
| Event handler         | handle + PascalCase  | `handleMigrationClick`           |
| Boolean prop          | is/has/can + Adj     | `isLoading`, `hasError`          |

### Python

| Element               | Convention           | Example                          |
| --------------------- | -------------------- | -------------------------------- |
| Module                | snake_case           | `validation_service.py`          |
| Class                 | PascalCase           | `ValidationService`              |
| Function              | snake_case           | `validate_data()`                |
| Method                | snake_case           | `get_migration_status()`         |
| Parameter             | snake_case           | `migration_id`                   |
| Variable              | snake_case           | `record_count`                   |
| Constant              | SCREAMING_SNAKE      | `MAX_RETRY_COUNT`                |
| Private method        | _snake_case          | `_internal_validate()`           |
| Type variable         | PascalCase           | `TResponse`                      |
| Package               | snake_case           | `map.services`                   |

---

## 3. Comments

### Why, Not What

Comments explain *why* code exists, not *what* it does. The code itself shows what it does; comments provide the context that code cannot.

```csharp
// Bad: Describes what the code does
// Increment retry counter
retryCount++;

// Good: Explains why this approach was chosen
// Exponential backoff prevents thundering herd on Azure SQL MI
// during peak migration validation windows (see ADR-012)
retryCount++;
```

### Document Public APIs

Every public method, class, and interface must have XML documentation comments (C#), docstrings (Python), or JSDoc (TypeScript). Documentation should describe purpose, parameters, return values, and exceptions.

```csharp
/// <summary>
/// Validates a migration job against all configured validation rules.
/// </summary>
/// <param name="migrationId">The unique identifier of the migration job to validate.</param>
/// <param name="cancellationToken">Token to cancel the operation.</param>
/// <returns>A validation report containing pass/fail status for each rule.</returns>
/// <exception cref="InvalidOperationException">Thrown when the migration job is not found.</exception>
public async Task<ValidationReport> ValidateMigrationAsync(
    string migrationId,
    CancellationToken cancellationToken = default)
{
    // Implementation
}
```

### Avoid Obvious Comments

Do not comment the obvious. These comments add noise without value:

```csharp
// Bad: Obvious comments
// Constructor
public MigrationService(IMigrationRepository repository) { }

// Increment counter
counter++;

// Check if valid
if (isValid) { }

// Good: No comments needed — the code is self-documenting
```

### Keep Comments Current

Stale comments are worse than no comments. When code changes, update or remove associated comments. A comment that contradicts the code it describes is a lie.

---

## 4. Documentation

### C# / .NET — XML Documentation

Use XML documentation comments (`///`) on all public members. Enable documentation warnings in the build:

```xml
<PropertyGroup>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>$(NoWarn);1591</NoWarn>
</PropertyGroup>
```

### Python — Docstrings

Use Google-style docstrings on all public functions, classes, and methods:

```python
def validate_migration_data(
    migration_id: str,
    rules: list[ValidationRule]
) -> ValidationResult:
    """Validate migration data against configured rules.

    Args:
        migration_id: Unique identifier for the migration job.
        rules: List of validation rules to apply.

    Returns:
        Validation result with pass/fail status and details.

    Raises:
        MigrationNotFoundError: If migration_id does not exist.
        ValidationError: If rules contain invalid configuration.
    """
```

### TypeScript — JSDoc

Use JSDoc comments on all public functions, interfaces, and types:

```typescript
/**
 * Validates migration data against configured rules.
 * 
 * @param migrationId - Unique identifier for the migration job
 * @param rules - Validation rules to apply
 * @returns Promise resolving to validation result
 * @throws {MigrationNotFoundError} When migration is not found
 */
async function validateMigrationData(
  migrationId: string,
  rules: ValidationRule[]
): Promise<ValidationResult> {
  // Implementation
}
```

### Project-Level Documentation

Every project must have a `README.md` containing:

- Project purpose and scope
- Prerequisites and setup instructions
- Build and run commands
- Testing instructions
- Configuration options
- Links to related documentation

---

## 5. Formatting

### Indentation

| Language            | Spaces | Tabs | Notes                           |
| ------------------- | ------ | ---- | ------------------------------- |
| C#                  | 4      | No   | Visual Studio default           |
| TypeScript          | 2      | No   | Prettier default                |
| React JSX           | 2      | No   | Prettier default                |
| Python              | 4      | No   | PEP 8 standard                  |
| JSON                | 2      | No   | Compact, readable               |
| YAML                | 2      | No   | No tabs, ever                   |
| Bicep               | 2      | No   | Azure Bicep standard            |
| SQL                 | 4      | No   | Consistent with code editors    |

### Line Length

Maximum line length: **120 characters** for code. Documentation and comments may extend to 150 characters for readability. Break long lines at logical points:

```csharp
// Good: Break at logical point
var validationResult = await _validationService
    .ValidateMigrationAsync(migrationId, cancellationToken);
```

### Trailing Commas

Use trailing commas in multi-line constructs. This reduces diff noise when adding new items:

```typescript
// Good: Trailing comma
const config = {
  apiUrl: 'https://api.map.dev',
  timeout: 30000,
  retries: 3,  // trailing comma
};
```

```json
{
  "name": "map-platform",
  "version": "1.0.0",  // trailing comma
}
```

### Blank Lines

- One blank line between methods
- One blank line after class-level declarations
- No multiple consecutive blank lines
- One blank line at end of file

### Braces

Same-line opening brace (K&R style) for C#, TypeScript, and C-like languages:

```csharp
public class MigrationService : IMigrationService
{
    public async Task<MigrationResult> StartMigrationAsync(StartMigrationRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }
    }
}
```

---

## 6. File Naming

### General Rules

- Match the primary class or component name (PascalCase for classes, kebab-case for config)
- Use language-standard extensions (`.cs`, `.ts`, `.tsx`, `.py`)
- Be descriptive but concise
- Avoid abbreviations unless universally understood

### By Language

| Language    | Convention              | Example                          |
| ----------- | ----------------------- | -------------------------------- |
| C#          | PascalCase.cs           | `ValidationService.cs`           |
| TypeScript  | PascalCase.ts           | `MigrationStatus.ts`             |
| TSX         | PascalCase.tsx          | `MigrationDashboard.tsx`         |
| Python      | snake_case.py           | `validation_service.py`          |
| Config      | kebab-case.{ext}        | `appsettings.json`               |
| Test        | Match source + Tests    | `ValidationServiceTests.cs`      |
| Styles      | kebab-case.{ext}        | `migration-card.css`             |
| Markdown    | UPPER_SNAKE.md or kebab | `README.md`, `local-setup.md`    |

### File Naming Anti-Patterns

```bash
# Bad
MyClass.cs          # Also a folder
myservice.cs        # Inconsistent casing
service_new_v2.cs   # Version in filename
temp.cs             # Temp files in source control
helper(1).cs        # Download artifacts

# Good
MigrationService.cs
migration-service.ts
validation_rules_seed.sql
adr-001-use-azure-sql-mi.md
```

---

## 7. Folder Naming

### General Rules

- Use kebab-case for all folder names at all levels
- Exception: C# project folders use PascalCase to match namespace conventions
- Keep folder names lowercase for cross-platform compatibility
- Use descriptive, singular nouns

### By Context

| Context             | Convention      | Example                          |
| ------------------- | --------------- | -------------------------------- |
| C# projects         | PascalCase      | `Map.Api`, `Map.Shared`          |
| C# source folders   | PascalCase      | `Controllers/`, `Services/`      |
| TypeScript folders  | kebab-case      | `migration-worker/`              |
| Feature folders     | kebab-case      | `features/migration/`            |
| Config folders      | kebab-case      | `environments/`, `pipelines/`    |
| Root folders        | kebab-case      | `src/`, `tests/`, `docs/`        |

### Folder Naming Anti-Patterns

```bash
# Bad
MyProject/          # Spaces or special characters
my_project/         # Underscores in non-Python projects
camelCase/          # Inconsistent casing
utils/              # Too vague
misc/               # Never use misc
common/             # Too generic
shared_stuff/       # Underscores and unclear

# Good
map-api/
migration-validation/
environments/
pipelines/
database/migrations/
```

---

## 8. Namespaces

### C# Namespace Convention

Mirror folder structure with `Company.Product.Module` pattern:

```
src/backend/Map.Api/Controllers/MigrationController.cs
→ namespace Map.Api.Controllers;

src/backend/Map.Api/Services/ValidationService.cs
→ namespace Map.Api.Services;

src/shared/Map.Shared/Helpers/Guard.cs
→ namespace Map.Shared.Helpers;
```

### Namespace Rules

- Namespaces mirror folder structure exactly
- Use file-scoped namespaces (C# 10+):
  ```csharp
  namespace Map.Api.Services;
  
  public class ValidationService : IValidationService
  {
  }
  ```
- No `using` aliases except to resolve ambiguity
- Organize `using` directives alphabetically

### TypeScript Module Organization

```typescript
// Import order: external, then internal, then relative
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api';
import { MigrationCard } from '@/components/ui/MigrationCard';

import type { Migration } from '../types/migration.types';
```

---

## 9. Dependency Management

### Version Pinning

Pin all dependency versions to exact versions or use lock files. Never use floating versions in production:

```json
// package.json — Good
{
  "dependencies": {
    "react": "18.3.1",
    "@tanstack/react-query": "5.51.1"
  }
}
```

```xml
<!-- .csproj — Good -->
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.6" />
```

### Audit Regularly

Run security audits on every build. Automate dependency updates with Dependabot or Renovate:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "nuget"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/src/frontend/map-web"
    schedule:
      interval: "weekly"
```

### Minimize Dependencies

Every dependency is a liability. Before adding a dependency:

1. Is there a built-in solution?
2. Can this be implemented in under 100 lines?
3. Is the dependency actively maintained?
4. Does it have a permissive license?
5. What is the dependency's dependency tree?

### Prefer Official Packages

Use official Microsoft, Google, and React packages over community alternatives:

| Use                               | Instead of                        |
| --------------------------------- | --------------------------------- |
| `Microsoft.Extensions.Http`       | `RestSharp`                       |
| `System.Text.Json`                | `Newtonsoft.Json`                 |
| `FluentValidation`                | Manual validation                 |
| `Polly`                           | Custom retry logic                |
| `Serilog`                         | `log4net`, `NLog`                 |

---

## 10. Configuration Management

### Environment Variables

Use environment variables for environment-specific values. Never hardcode environment-specific URLs, connection strings, or keys:

```csharp
// Good: Environment-driven configuration
var connectionString = _configuration.GetConnectionString("MapDatabase");
var openAiEndpoint = _configuration["AzureOpenAI:Endpoint"];
```

### appsettings.json Hierarchy

```
appsettings.json                    # Base defaults (committed)
appsettings.Development.json        # Local development (gitignored)
appsettings.Staging.json            # Staging (deployed via pipeline)
appsettings.Production.json         # Production (deployed via pipeline)
```

### Configuration Validation

Validate configuration at application startup. Fail immediately if required configuration is missing:

```csharp
builder.Services.AddOptions<AzureOpenAIOptions>()
    .Configure(options =>
    {
        options.Endpoint = builder.Configuration["AzureOpenAI:Endpoint"]
            ?? throw new InvalidOperationException("Azure OpenAI endpoint is not configured.");
        options.DeploymentName = builder.Configuration["AzureOpenAI:DeploymentName"]
            ?? throw new InvalidOperationException("Azure OpenAI deployment name is not configured.");
    })
    .Validate(options => !string.IsNullOrEmpty(options.Endpoint), "Azure OpenAI endpoint is required.")
    .ValidateOnStart();
```

### Never Hardcode

```csharp
// Bad
var endpoint = "https://myopenai.openai.azure.com/";

// Good
var endpoint = _configuration["AzureOpenAI:Endpoint"];
```

---

## 11. Secrets Management

### Never in Code

Secrets, keys, passwords, and connection strings must never appear in source code, configuration files committed to source control, or log output.

### Azure Key Vault

Production secrets are stored in Azure Key Vault and accessed via:

1. Managed Identity (preferred)
2. Azure SDK SecretClient with credential
3. Key Vault provider for configuration

```csharp
// Production: Azure Key Vault
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{keyVaultName}.vault.azure.net/"),
    new DefaultAzureCredential());
```

### User Secrets (Development)

Use .NET User Secrets for local development:

```bash
# Initialize user secrets
dotnet user-secrets init --project src/backend/Map.Api

# Set a secret
dotnet user-secrets set "AzureOpenAI:ApiKey" "your-dev-key" --project src/backend/Map.Api
```

```json
// ~/.microsoft/usersecrets/{id}/secrets.json
{
  "AzureOpenAI:ApiKey": "your-dev-key",
  "ConnectionStrings:MapDatabase": "Server=..."
}
```

### Secret Scanning

Enable secret scanning in GitHub and CI/CD pipelines. Block commits containing detected secrets:

```yaml
# .github/workflows/secret-scan.yml
- name: Scan for secrets
  uses: trufflesecurity/trufflehog@main
  with:
    extra_args: --only-verified
```

---

## 12. Logging

### Structured Logging

Use structured logging with named properties. Never use string interpolation in log messages:

```csharp
// Bad: String interpolation
_logger.LogInformation($"Processing migration {migrationId}");

// Good: Structured logging
_logger.LogInformation("Processing migration {MigrationId}", migrationId);
```

### Correlation IDs

Every request must carry a correlation ID through all service layers. Use the `CorrelationIdMiddleware` to extract or generate correlation IDs:

```csharp
// Middleware extracts or generates correlation ID
app.UseCorrelationId();

// Usage in service
_logger.LogInformation("Starting validation for {MigrationId} [CorrelationId: {CorrelationId}]",
    migrationId, correlationId);
```

### Log Levels

| Level       | When to Use                                    | Example                                          |
| ----------- | ---------------------------------------------- | ------------------------------------------------ |
| Trace       | Extremely detailed diagnostic information      | SQL query parameters, full request payloads      |
| Debug       | Internal state during development              | Method entry/exit, variable values               |
| Information | Normal application operation                    | Request processed, migration started             |
| Warning     | Unexpected but handled conditions              | Retry attempted, fallback configuration used     |
| Error       | Failed operations requiring attention          | API call failed, validation rule threw exception |
| Critical    | System-threatening failures                     | Database connection lost, out of memory          |

### No Sensitive Data

Never log passwords, tokens, connection strings, or PII:

```csharp
// Bad: Logging sensitive data
_logger.LogInformation("Connecting with {ConnectionString}", connectionString);

// Good: Log non-sensitive identifiers only
_logger.LogInformation("Connecting to database {DatabaseServer}", databaseServer);
```

---

## 13. Error Handling

### Custom Exceptions

Define domain-specific exceptions for business logic errors:

```csharp
public class MigrationNotFoundException : Exception
{
    public string MigrationId { get; }

    public MigrationNotFoundException(string migrationId)
        : base($"Migration '{migrationId}' was not found.")
    {
        MigrationId = migrationId;
    }
}

public class ValidationRuleException : Exception
{
    public string RuleName { get; }

    public ValidationRuleException(string ruleName, string message)
        : base($"Validation rule '{ruleName}': {message}")
    {
        RuleName = ruleName;
    }
}
```

### Result Pattern

Use the Result pattern for operations that can fail without throwing exceptions:

```csharp
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }
    public IReadOnlyList<string> Errors { get; }

    public static Result<T> Success(T value) => new(true, value, null, Array.Empty<string>());
    public static Result<T> Failure(string error) => new(false, default, new[] { error });
    public static Result<T> Failure(IReadOnlyList<string> errors) => new(false, default, null, errors);
}
```

### Global Exception Handler

Use middleware for global exception handling. Never catch exceptions in individual controllers unless re-throwing or transforming:

```csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        var response = exception switch
        {
            MigrationNotFoundException => Results.NotFound(new { error = exception.Message }),
            ValidationRuleException => Results.BadRequest(new { error = exception.Message }),
            ArgumentException => Results.BadRequest(new { error = exception.Message }),
            _ => Results.StatusCode(500)
        };
        
        await response.ExecuteAsync(context);
    });
});
```

### Meaningful Error Messages

Error messages must be actionable. Include what went wrong, why, and what to do about it:

```csharp
// Bad
throw new Exception("Error occurred");

// Bad
throw new Exception("Invalid input");

// Good
throw new ArgumentException(
    $"Migration ID '{migrationId}' is not in a valid format. " +
    $"Expected a GUID (e.g., 'a1b2c3d4-e5f6-7890-abcd-ef1234567890').",
    nameof(migrationId));
```

### Exception Hierarchy

```
System.Exception
├── Map.Domain.Exceptions (business logic)
│   ├── MigrationNotFoundException
│   ├── ValidationRuleException
│   ├── InvalidMigrationStateException
│   └── DuplicateMigrationException
├── Map.Infrastructure.Exceptions (infrastructure)
│   ├── DatabaseConnectionException
│   ├── ExternalServiceException
│   └── ConfigurationException
└── Map.Api.Exceptions (API layer)
    ├── InvalidRequestException
    ├── UnauthorizedAccessException
    └── RateLimitExceededException
```

---

## Appendix: Linter and Formatter Configuration

### C# (.editorconfig)

```ini
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{csproj,json,yml,yaml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.cs]
csharp_style_namespace_declarations = file_scoped:suggestion
csharp_using_directive_placement = outside_namespace:warning
dotnet_style_qualification_for_field = false:warning
dotnet_style_qualification_for_property = false:warning
dotnet_style_qualification_for_method = false:warning
dotnet_style_qualification_for_event = false:warning
```

### TypeScript (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### TypeScript (tsconfig.json strict settings)

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```
