# MAP MVP .NET Standards

| Field    | Value              |
| -------- | ------------------ |
| Document | MAP MVP .NET Standards |
| Version  | 1.0                |
| Date     | July 2026          |
| Status   | Official           |

---

## 1. .NET Version

- Target **.NET 8** (Long-Term Support) for all backend services and libraries.
- Use **C# 12** language features including primary constructors, collection expressions, default lambda parameters, and inline arrays.
- Keep SDK and language versions consistent across all projects in the solution.
- Plan migration to .NET 9 upon GA release for non-LTS features.

## 2. Solution Structure

Follow **Clean Architecture** principles with clearly defined layers:

```
MAP.sln
├── src/
│   ├── MAP.Domain/              # Entities, value objects, domain events
│   ├── MAP.Application/         # Use cases, interfaces, DTOs
│   ├── MAP.Infrastructure/      # EF Core, external services, messaging
│   └── MAP.Api/                 # Controllers, middleware, startup
├── tests/
│   ├── MAP.Domain.Tests/
│   ├── MAP.Application.Tests/
│   ├── MAP.Infrastructure.Tests/
│   └── MAP.Api.Tests/
└── docs/
```

- The solution file (`MAP.sln`) sits at the repository root.
- Source projects live under `src/`; test projects live under `tests/`.
- Each layer has its own project with explicit dependency direction (Api → Application → Domain; Infrastructure → Domain).

## 3. Projects

- **One project per architectural layer** — no multi-targeting or mixed concerns.
- A **shared kernel** project (`MAP.SharedKernel`) holds cross-cutting concerns: base entities, common interfaces, extension methods, and shared constants.
- Infrastructure depends on Domain (not the reverse). Application defines interfaces; Infrastructure implements them.
- Keep project references minimal and explicit.

## 4. Naming Conventions

- **Namespaces:** `Company.MAP.Module` pattern (e.g., `Company.MAP.Migration`, `Company.MAP.Validation`).
- **Folders:** Plural for collections of related items (e.g., `Controllers`, `Services`, `Repositories`).
- **Types:** Singular (e.g., `MigrationService`, not `MigrationServices`).
- **Interfaces:** Prefix with `I` (e.g., `IMigrationService`, `IValidator`).
- **Files:** Match the type name exactly (one type per file).
- **Private fields:** `_camelCase` prefix.
- **Local variables and parameters:** `camelCase`.

## 5. Configuration

- Use `appsettings.json` as the base configuration file.
- Use **environment-specific overrides** (`appsettings.Development.json`, `appsettings.Production.json`).
- Leverage the **Options pattern** (`IOptions<T>`, `IOptionsSnapshot<T>`, `IOptionsMonitor<T>`) for strongly-typed configuration.
- Never store secrets in configuration files — use Azure Key Vault or User Secrets in development.
- Validate configuration at startup using `ValidateDataAnnotations()` or custom validation.

```csharp
services.Configure<MigrationOptions>(
    configuration.GetSection("Migration"));
```

## 6. Dependency Injection

- Use the **built-in .NET DI container** — no third-party containers unless a critical feature gap exists.
- Register services **by interface** to enable testing and replaceability.
- Default to **Scoped** lifetime for request-bound services; use Singleton for stateless services and Transient for lightweight, stateless factories.
- Use extension methods to organize registrations by feature module:

```csharp
public static class MigrationServiceExtensions
{
    public static IServiceCollection AddMigrationServices(
        this IServiceCollection services)
    {
        services.AddScoped<IMigrationService, MigrationService>();
        services.AddScoped<IMigrationValidator, MigrationValidator>();
        return services;
    }
}
```

## 7. Minimal APIs

- Use **Minimal APIs** for simple, focused endpoints with minimal routing logic.
- Use **Controllers** for complex endpoints requiring filters, model binding conventions, or extensive middleware.
- Use **Carter** for grouping Minimal API endpoints by feature module.
- Prefer Minimal APIs for new microservices; prefer Controllers for monolithic API layers with rich conventions.

```csharp
app.MapPost("/api/migrations", async (CreateMigrationRequest request, IMigrationService service) =>
{
    var result = await service.CreateAsync(request);
    return Results.Created($"/api/migrations/{result.Id}", result);
});
```

## 8. Clean Architecture

### Domain Layer
- Contains **entities**, **value objects**, **domain events**, and **aggregate roots**.
- No dependencies on infrastructure or application frameworks.
- Business rules and invariants are enforced here.

### Application Layer
- Contains **use cases**, **command/query handlers**, and **service interfaces**.
- Defines contracts (interfaces) that infrastructure implements.
- Orchestrates domain objects to fulfill business operations.

### Infrastructure Layer
- Implements persistence via **Entity Framework Core**.
- Integrates external services (Azure Service Bus, Blob Storage, etc.).
- Cross-cutting concerns (logging, caching, email) live here.

### API Layer
- Exposes the application to external consumers via HTTP/REST.
- Contains controllers, middleware, filters, and startup configuration.
- Maps HTTP requests to application use cases and returns responses.

## 9. Recommended Libraries

| Category          | Library              | Purpose                              |
| ----------------- | -------------------- | ------------------------------------ |
| ORM               | Entity Framework Core | Data access and migration           |
| Mediator          | MediatR              | CQRS pipeline and mediator pattern   |
| Validation        | FluentValidation     | Input validation with rules          |
| Logging           | Serilog              | Structured logging with sinks        |
| Resilience        | Polly                | Retry, circuit breaker, timeout      |
| Mapping           | Mapster              | Object-to-object mapping (faster than AutoMapper) |
| Serialization     | System.Text.Json      | JSON serialization (built-in)        |
| API Documentation | Swashbuckle / NSwag  | OpenAPI/Swagger generation           |
| Testing           | xUnit + Moq          | Unit testing and mocking             |

## 10. Top 5 .NET Frameworks / Patterns

| Feature                | ASP.NET Core Minimal | ASP.NET Core MVC   | Carter             | Clean Arch Template | Vertical Slice       |
| ---------------------- | -------------------- | ------------------ | ------------------ | ------------------- | -------------------- |
| Type                   | API framework        | API framework      | Minimal API routing| Solution template    | Architectural pattern|
| Complexity             | Low                  | Medium             | Low                | High                | Medium               |
| Conventions            | Minimal              | Rich (filters, etc)| Minimal           | Full                | Feature-based        |
| Best For               | Microservices, simple APIs | Complex APIs with conventions | Feature-grouped Minimal APIs | Large enterprise apps | Feature isolation |
| Learning Curve         | Low                  | Medium             | Low                | High                | Medium               |
| Separation of Concerns | Manual               | Implicit           | Manual             | Enforced            | Enforced per feature |
| Testability            | High                 | High               | High               | Very High           | Very High            |

**Recommendation:** Use **ASP.NET Core Minimal APIs** with **Carter** for MAP backend services. This aligns with our lightweight microservice architecture, provides clean feature grouping, and pairs well with the MediatR pipeline for CQRS.
