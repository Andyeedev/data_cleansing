# MAP Platform Solution Structure

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Document | MAP Platform Solution Structure          |
| Version  | 1.0                                      |
| Date     | July 2026                                |
| Status   | Official                                 |
| Owner    | MAP Platform Engineering                 |
| Scope    | Project layout for all technology layers |

---

## 1. Python Project Structure

Used for: AI services, data processing pipelines, scripting utilities.

```
src/backend/map/
├── map/
│   ├── __init__.py              # Package marker, version info
│   ├── main.py                  # Application entry point
│   ├── config.py                # Configuration loading and validation
│   ├── models/                  # Data models and schemas
│   │   ├── __init__.py
│   │   ├── domain/              # Domain entities
│   │   ├── dto/                 # Data transfer objects
│   │   └── enums/               # Enumeration types
│   ├── services/                # Business logic layer
│   │   ├── __init__.py
│   │   ├── validation_service.py
│   │   └── migration_service.py
│   ├── api/                     # API layer (FastAPI/Flask)
│   │   ├── __init__.py
│   │   ├── routes/              # Route handlers
│   │   ├── middleware/          # Request/response middleware
│   │   └── dependencies.py      # Dependency injection
│   ├── core/                    # Core framework components
│   │   ├── __init__.py
│   │   ├── exceptions.py        # Custom exception classes
│   │   ├── events.py            # Event definitions and handlers
│   │   └── security.py          # Authentication and authorization
│   └── utils/                   # Shared utilities
│       ├── __init__.py
│       ├── date_utils.py
│       ├── string_utils.py
│       └── validators.py
├── tests/                       # Test suite
│   ├── __init__.py
│   ├── conftest.py              # Pytest fixtures
│   ├── unit/                    # Unit tests
│   │   └── test_*.py
│   ├── integration/             # Integration tests
│   │   └── test_*.py
│   └── e2e/                     # End-to-end tests
│       └── test_*.py
├── pyproject.toml               # Project metadata and dependencies
├── poetry.lock                  # Locked dependency versions
├── README.md                    # Project documentation
└── .env.example                 # Environment variable template
```

### Python Naming Conventions

| Element          | Convention          | Example                          |
| ---------------- | ------------------- | -------------------------------- |
| Packages         | snake_case          | `map.services.validation`        |
| Modules          | snake_case          | `validation_service.py`          |
| Classes          | PascalCase          | `ValidationService`              |
| Functions        | snake_case          | `validate_migration_data()`      |
| Variables        | snake_case          | `record_count`                   |
| Constants        | SCREAMING_SNAKE     | `MAX_RETRY_COUNT`                |
| Private members  | Leading underscore  | `_internal_method()`             |

### Key Python Principles

- Use type hints on all function signatures
- Prefer `dataclasses` or Pydantic models for data structures
- Use async/await for I/O-bound operations (FastAPI)
- Virtual environments per project — never install globally
- Pin exact dependency versions in `poetry.lock`

---

## 2. .NET Project Structure

Used for: Backend API, background workers, shared libraries.

```
src/backend/Map.Api/
├── Controllers/                 # API endpoint controllers
│   ├── MigrationController.cs
│   ├── ValidationController.cs
│   └── HealthController.cs
├── Services/                    # Business logic services
│   ├── Interfaces/              # Service interfaces
│   │   ├── IMigrationService.cs
│   │   └── IValidationService.cs
│   ├── MigrationService.cs
│   └── ValidationService.cs
├── Models/                      # Domain models
│   ├── Entities/                # Database entities
│   │   ├── MigrationJob.cs
│   │   └── ValidationResult.cs
│   └── Enums/                   # Enumeration types
│       └── MigrationStatus.cs
├── DTOs/                        # Data transfer objects
│   ├── Requests/                # API request DTOs
│   │   ├── StartMigrationRequest.cs
│   │   └── ValidateRequest.cs
│   ├── Responses/               # API response DTOs
│   │   ├── MigrationStatusResponse.cs
│   │   └── ValidationReportResponse.cs
│   └── Mapping/                 # AutoMapper profiles
│       └── MappingProfile.cs
├── Middleware/                   # Request pipeline middleware
│   ├── ExceptionHandlingMiddleware.cs
│   ├── CorrelationIdMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Extensions/                  # Service collection extensions
│   ├── ServiceCollectionExtensions.cs
│   └── ApplicationBuilderExtensions.cs
├── Filters/                     # Action and result filters
│   └── ValidationFilter.cs
├── Validators/                  # FluentValidation validators
│   ├── StartMigrationRequestValidator.cs
│   └── ValidateRequestValidator.cs
├── Program.cs                   # Application entry point
├── appsettings.json             # Base configuration
├── appsettings.Development.json # Development overrides
├── appsettings.Staging.json     # Staging overrides
├── appsettings.Production.json  # Production overrides
├── Directory.Build.props        # Shared MSBuild properties
├── Map.Api.csproj               # Project file
└── README.md                    # Project documentation
```

### .NET Naming Conventions

| Element          | Convention          | Example                          |
| ---------------- | ------------------- | -------------------------------- |
| Namespaces       | PascalCase          | `Map.Api.Services`               |
| Classes          | PascalCase          | `ValidationService`              |
| Interfaces       | PascalCase + I      | `IValidationService`             |
| Methods          | PascalCase          | `ValidateAsync()`                |
| Properties       | PascalCase          | `MigrationStatus`                |
| Parameters       | camelCase           | `migrationId`                    |
| Local variables  | camelCase           | `recordCount`                    |
| Private fields   | camelCase + _       | `_dbContext`                     |
| Constants        | PascalCase          | `MaxRetryCount`                  |
| Enum values      | PascalCase          | `MigrationStatus.InProgress`     |

### Key .NET Principles

- Use dependency injection for all service dependencies
- Prefer `IOptions<T>` pattern for configuration binding
- Use `CancellationToken` in all async methods
- Implement `IDisposable` / `IAsyncDisposable` for resource cleanup
- Use `MediatR` for CQRS patterns in complex domains

---

## 3. React Frontend Structure

Used for: Single-page application, user interface.

```
src/frontend/map-web/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Base UI components (buttons, inputs, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   └── shared/              # Shared composite components
│   │       ├── DataTable.tsx
│   │       ├── StatusBadge.tsx
│   │       └── ErrorBoundary.tsx
│   ├── features/                # Feature-specific modules
│   │   ├── auth/                # Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   ├── migration/           # Migration validation feature
│   │   │   ├── components/
│   │   │   │   ├── MigrationDashboard.tsx
│   │   │   │   ├── MigrationList.tsx
│   │   │   │   └── MigrationDetail.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMigrations.ts
│   │   │   │   └── useMigrationStatus.ts
│   │   │   ├── api/
│   │   │   │   └── migrationApi.ts
│   │   │   ├── types/
│   │   │   │   └── migration.types.ts
│   │   │   └── utils/
│   │   │       └── migrationHelpers.ts
│   │   ├── validation/          # Validation rules feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   └── types/
│   │   └── reports/             # Reporting feature
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── api/
│   │       └── types/
│   ├── hooks/                   # Shared custom hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useApiCall.ts
│   │   └── useMediaQuery.ts
│   ├── lib/                     # Utility libraries and configurations
│   │   ├── api.ts               # API client configuration
│   │   ├── auth.ts              # Auth configuration
│   │   ├── queryClient.ts       # React Query client setup
│   │   └── constants.ts         # Application constants
│   ├── styles/                  # Global styles and themes
│   │   ├── globals.css          # Global CSS imports
│   │   ├── themes/              # Theme definitions
│   │   └── tailwind/            # Tailwind CSS extensions
│   ├── types/                   # Global TypeScript types
│   │   ├── index.d.ts           # Global type declarations
│   │   └── api.types.ts         # Shared API types
│   ├── App.tsx                  # Root application component
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts            # Vite type definitions
├── public/                      # Static assets served directly
│   ├── favicon.ico
│   ├── logo.svg
│   └── robots.txt
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.ts               # Vite build configuration
├── postcss.config.js            # PostCSS configuration
├── .eslintrc.cjs                # ESLint configuration
├── .prettierrc                  # Prettier configuration
└── README.md                    # Project documentation
```

### React Naming Conventions

| Element          | Convention          | Example                          |
| ---------------- | ------------------- | -------------------------------- |
| Component files  | PascalCase          | `MigrationDashboard.tsx`         |
| Hook files       | camelCase + use     | `useMigrations.ts`               |
| Utility files    | camelCase           | `migrationHelpers.ts`            |
| Type files       | camelCase + .types  | `migration.types.ts`             |
| API files        | camelCase + Api     | `migrationApi.ts`                |
| CSS classes      | kebab-case          | `migration-card`                 |
| Components       | PascalCase          | `<MigrationDashboard />`         |
| Custom hooks     | PascalCase return   | `const data = useMigrations()`   |
| Props interfaces | PascalCase + Props  | `MigrationListProps`              |

### Key React Principles

- Use functional components with hooks exclusively
- Prefer React Query for server state management
- Co-locate related files (components, hooks, types, API) within feature folders
- Use TypeScript strict mode — no `any` types
- Extract reusable logic into custom hooks

---

## 4. Microservices Structure

Used for: Independent services that can be deployed and scaled separately.

```
src/backend/
├── Map.Api/                     # Primary API gateway
├── Map.Migration.Worker/        # Background migration processor
│   ├── Workers/
│   │   └── MigrationWorker.cs
│   ├── Services/
│   ├── Models/
│   ├── Program.cs
│   └── Map.Migration.Worker.csproj
├── Map.Validation.Worker/       # Validation rule processor
│   ├── Workers/
│   │   └── ValidationWorker.cs
│   ├── Rules/
│   │   ├── IValidationRule.cs
│   │   ├── CompletenessRule.cs
│   │   ├── IntegrityRule.cs
│   │   └── ConsistencyRule.cs
│   ├── Services/
│   ├── Program.cs
│   └── Map.Validation.Worker.csproj
└── Map.Reporting.Worker/        # Report generation worker
    ├── Workers/
    │   └── ReportWorker.cs
    ├── Generators/
    ├── Services/
    ├── Program.cs
    └── Map.Reporting.Worker.csproj
```

### Microservices Principles

- Each service owns its database schema — no shared databases
- Communicate via async events (Azure Service Bus) where possible
- Use synchronous REST or gRPC only when immediate response is required
- Each service has its own CI/CD pipeline and deployment
- Shared contracts live in `src/shared/Map.Contracts/`

---

## 5. Shared Libraries Structure

Used for: Code shared across multiple projects.

```
src/shared/
├── Map.Shared/                  # Common utilities and extensions
│   ├── Extensions/
│   │   ├── StringExtensions.cs
│   │   ├── DateTimeExtensions.cs
│   │   └── CollectionExtensions.cs
│   ├── Helpers/
│   │   ├── Guard.cs
│   │   ├── JsonHelper.cs
│   │   └── CryptoHelper.cs
│   ├── Constants/
│   │   ├── ErrorCodes.cs
│   │   └── AppConstants.cs
│   ├── Results/
│   │   ├── Result.cs
│   │   └── Result{T}.cs
│   └── Map.Shared.csproj
├── Map.Contracts/                # Shared DTOs and event contracts
│   ├── Events/
│   │   ├── MigrationStartedEvent.cs
│   │   ├── ValidationCompletedEvent.cs
│   │   └── ReportGeneratedEvent.cs
│   ├── DTOs/
│   │   ├── MigrationDto.cs
│   │   └── ValidationResultDto.cs
│   └── Map.Contracts.csproj
└── Map.Infrastructure/           # Cross-cutting infrastructure
    ├── Logging/
    │   └── CorrelationIdEnricher.cs
    ├── Telemetry/
    │   └── TelemetryService.cs
    └── Map.Infrastructure.csproj
```

### Shared Library Principles

- Minimize dependencies in shared libraries — they propagate to all consumers
- Shared libraries should be stable — breaking changes require coordinated updates
- Never put business logic in shared libraries — only cross-cutting concerns
- Use semantic versioning for shared libraries

---

## 6. Database Structure

Used for: Schema management, data seeding, and database operations.

```
database/
├── migrations/                  # Schema migrations
│   ├── flyway.conf              # Flyway configuration
│   ├── V001__Create_core_tables.sql
│   ├── V002__Create_validation_tables.sql
│   ├── V003__Add_migration_status_enum.sql
│   └── V004__Create_reporting_views.sql
├── seeds/                       # Reference data
│   ├── countries_seed.sql
│   ├── validation_rules_seed.sql
│   └── default_config_seed.sql
└── scripts/                     # Utility scripts
    ├── backup_database.sql
    ├── analyze_performance.sql
    ├── archive_old_records.sql
    └── health_check.sql
```

### Database Conventions

- Migrations are forward-only — never modify committed migrations
- Each migration has a rollback strategy documented in comments
- Seed data uses `MERGE` statements for idempotent execution
- Scripts include documentation comments explaining purpose and impact
- All schema changes require code review and staging validation

---

## 7. Infrastructure Structure

Used for: Azure resource definitions and environment management.

```
infra/
├── bicep/                       # Bicep templates
│   ├── main.bicep               # Primary deployment template
│   ├── modules/
│   │   ├── container-app.bicep
│   │   ├── sql-mi.bicep
│   │   ├── key-vault.bicep
│   │   ├── app-insights.bicep
│   │   └── service-bus.bicep
│   └── README.md
├── environments/                 # Environment parameters
│   ├── dev.bicepparam
│   ├── staging.bicepparam
│   └── production.bicepparam
└── scripts/                     # Infrastructure operations
    ├── deploy-environment.ps1
    ├── teardown-environment.ps1
    ├── rotate-secrets.ps1
    └── cost-report.ps1
```

### Infrastructure Conventions

- All infrastructure is defined as code — no manual Azure portal changes
- Environments are defined by parameter files, not separate templates
- Infrastructure changes follow the same PR review process as code changes
- Cost estimates are required for new resource proposals

---

## 8. Testing Structure

Used for: All test types organized by scope and purpose.

```
tests/
├── unit/
│   ├── Map.Api.Tests/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Validators/
│   │   └── Helpers/
│   ├── Map.Services.Tests/
│   └── Map.Shared.Tests/
├── integration/
│   ├── Map.Api.IntegrationTests/
│   │   ├── Fixtures/
│   │   │   ├── WebApplicationFactory.cs
│   │   │   └── DatabaseFixture.cs
│   │   ├── Tests/
│   │   └── Helpers/
│   └── Map.Worker.IntegrationTests/
├── e2e/
│   ├── playwright.config.ts
│   ├── fixtures/
│   ├── pages/
│   └── tests/
│       ├── migration-workflow.spec.ts
│       └── validation-workflow.spec.ts
└── performance/
    ├── k6/
    │   ├── load-test.js
    │   └── stress-test.js
    └── benchmarks/
        ├── Map.Services.Benchmarks/
        └── BenchmarkDotNet.config.json
```

### Testing Conventions

- Test project names mirror source projects with `.Tests` suffix
- Test classes are public, non-static, and have parameterless constructors
- Test methods follow `{Method}_{Scenario}_{Expected}` naming
- Use `[Fact]` for simple tests, `[Theory]` for parameterized tests
- Integration tests use real databases via test containers
- E2E tests run against staging environments only

---

## 9. Documentation Structure

Used for: All project documentation.

```
docs/
├── architecture/
│   ├── adr-001-use-azure-sql-mi.md
│   ├── adr-002-react-frontend.md
│   ├── system-architecture.md
│   ├── data-flow.md
│   └── security-architecture.md
├── api/
│   ├── map-api.v1.yaml
│   ├── authentication.md
│   └── error-codes.md
├── development/
│   ├── local-setup.md
│   ├── coding-standards.md
│   ├── pull-request-guide.md
│   └── troubleshooting.md
└── user/
    ├── getting-started.md
    ├── migration-validation-guide.md
    ├── reporting-guide.md
    └── faq.md
```

### Documentation Conventions

- Every document has a title, version, date, and status
- Technical documents use Mermaid diagrams for visual representation
- API documentation is generated from code annotations where possible
- Documentation is reviewed with the same rigor as code

---

## 10. Cross-Cutting Concerns

### Configuration Hierarchy

```
appsettings.json                    # Base defaults
├── appsettings.Development.json    # Local development overrides
├── appsettings.Staging.json        # Staging environment
└── appsettings.Production.json     # Production environment
```

Environment variables override configuration files. Secrets are never stored in configuration files — use Azure Key Vault or user-secrets.

### Logging Standards

All projects use structured logging with correlation IDs. Log levels:

| Level       | Usage                                           |
| ----------- | ----------------------------------------------- |
| Trace       | Detailed diagnostic information                 |
| Debug       | Internal state during development               |
| Information | Normal application operation                     |
| Warning     | Unexpected but handled conditions               |
| Error       | Failed operations requiring attention           |
| Critical    | System-threatening failures requiring immediate action |

### Authentication Flow

```
Browser → React App → Microsoft Entra ID → Access Token → .NET API
```

All API calls include Bearer token in Authorization header. Token validation happens in middleware. No custom authentication logic.