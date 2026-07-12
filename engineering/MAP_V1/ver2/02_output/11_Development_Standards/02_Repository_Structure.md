# MAP Platform Repository Structure

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Document | MAP Platform Repository Structure        |
| Version  | 1.0                                      |
| Date     | July 2026                                |
| Status   | Official                                 |
| Owner    | MAP Platform Engineering                 |
| Scope    | Git repository layout and conventions    |

---

## 1. Root-Level Layout

```
map-platform/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE/
├── src/
│   ├── backend/
│   ├── frontend/
│   ├── shared/
│   └── ai/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── performance/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── development/
│   └── user/
├── infra/
│   ├── bicep/
│   ├── environments/
│   └── scripts/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── scripts/
├── pipelines/
│   ├── build/
│   └── release/
├── scripts/
├── tools/
├── examples/
├── assets/
├── configuration/
├── .editorconfig
├── .gitignore
├── .gitattributes
├── README.md
├── CHANGELOG.md
├── LICENSE
└── map-platform.sln
```

---

## 2. Detailed Folder Descriptions

### `.github/`

**Purpose:** GitHub-specific configuration for collaboration workflows, issue tracking, and pull request standards.

**What goes inside:**
- `workflows/` — GitHub Actions workflow YAML files for CI/CD pipelines
- `ISSUE_TEMPLATE/` — Markdown templates for bug reports, feature requests, and technical debt items
- `PULL_REQUEST_TEMPLATE/` — Markdown template defining PR description checklist and review criteria

**Naming conventions:**
- Workflow files: `{pipeline-name}.yml` (lowercase, hyphen-separated)
- Issue templates: `{type}.md` (e.g., `bug_report.md`, `feature_request.md`)
- PR template: `pull_request_template.md` (single template)

**When to use:**
- Add workflows for build, test, deploy, and release pipelines
- Create issue templates when team onboarding or triage processes change
- Update PR templates when review standards evolve

---

### `src/backend/`

**Purpose:** All backend application source code, organized by technology.

**What goes inside:**
- `Map.Api/` — Primary .NET 8 Web API project (controllers, services, middleware, configuration)
- Additional backend projects as the platform grows (workers, functions, shared libraries)

**Naming conventions:**
- Solution folders use PascalCase: `Map.Api`, `Map.Services`, `Map.Workers`
- One solution file (`map-platform.sln`) at root references all projects

**When to use:**
- Add new projects when introducing a new bounded context or deployment unit
- Use shared libraries under `src/shared/` for cross-cutting concerns

---

### `src/frontend/`

**Purpose:** All frontend application source code.

**What goes inside:**
- `map-web/` — React 18 + TypeScript SPA built with Vite

**Naming conventions:**
- Project folder: `map-web` (kebab-case)
- Source files: PascalCase for components, camelCase for utilities

**When to use:**
- Add frontend projects when introducing new UI applications or micro-frontends

---

### `src/shared/`

**Purpose:** Shared libraries used across multiple projects (backend, frontend, or AI).

**What goes inside:**
- `Map.Shared/` — Common DTOs, constants, utilities, extensions, and contracts shared between backend services
- Protobuf or gRPC contracts for inter-service communication
- Shared type definitions for frontend-backend contracts

**Naming conventions:**
- PascalCase for library folders: `Map.Shared`, `Map.Contracts`
- Mirror the naming pattern of the consuming projects

**When to use:**
- Extract when the same code is duplicated across two or more projects
- Create when a contract must be shared between services (API DTOs, event schemas)

---

### `src/ai/`

**Purpose:** AI and machine learning components, specifically Azure OpenAI integration.

**What goes inside:**
- `Map.AI/` — AI service wrappers, prompt templates, embedding services, and AI-related configuration
- Prompt management and template storage
- AI evaluation and testing utilities

**Naming conventions:**
- PascalCase for project folders: `Map.AI`
- Prompt template files: `{use_case}_prompt.md` (snake_case)

**When to use:**
- Add AI components when integrating new Azure OpenAI capabilities
- Create separate AI projects when models serve distinct bounded contexts

---

### `tests/unit/`

**Purpose:** Fast, isolated tests that verify individual components without external dependencies.

**What goes inside:**
- Unit tests for backend services, controllers, and utilities
- Unit tests for frontend components and hooks
- Test fixtures and mocks specific to unit testing
- One test project per source project: `Map.Api.Tests`, `Map.Services.Tests`

**Naming conventions:**
- Test projects mirror source project names with `.Tests` suffix
- Test files match source file names with `Tests` suffix: `ValidationServiceTests.cs`
- Test methods: `{Method}_{Scenario}_{ExpectedResult}` (e.g., `Validate_MissingField_ReturnsError`)

**When to use:**
- Every production code file should have a corresponding test file
- Add tests for every bug fix (regression tests)
- Update tests when refactoring existing code

---

### `tests/integration/`

**Purpose:** Tests that verify interactions between components, including database access, API calls, and message handling.

**What goes inside:**
- Integration tests for API endpoints with database
- Service integration tests with external dependencies (mocked or containerized)
- Test infrastructure: database fixtures, test containers, API test servers

**Naming conventions:**
- Test projects: `{Project}.IntegrationTests`
- Test classes: `{Feature}IntegrationTests`
- Use `[Trait("Category", "Integration")]` for categorization

**When to use:**
- Test critical data flows end-to-end
- Validate API contracts with actual HTTP requests
- Verify database queries against real (test) database instances

---

### `tests/e2e/`

**Purpose:** End-to-end tests that validate complete user workflows through the UI and API layers.

**What goes inside:**
- Playwright or Cypress test suites for critical user journeys
- Test data setup and teardown scripts
- Page objects and test utilities for UI automation

**Naming conventions:**
- Test files: `{workflow}.spec.ts` (e.g., `migration-validation.spec.ts`)
- Page objects: `{PageName}.ts` (PascalCase)

**When to use:**
- Cover critical business workflows (login, migration validation, report generation)
- Run on every deployment to staging environments
- Supplement with manual exploratory testing for edge cases

---

### `tests/performance/`

**Purpose:** Load testing, stress testing, and performance benchmarking.

**What goes inside:**
- k6 or JMeter test scripts
- Performance benchmark configurations
- Baseline performance metrics and comparison reports

**Naming conventions:**
- Test scripts: `{scenario}.js` or `{scenario}.jmx`
- Benchmark files: `{Method}_Benchmark.cs`

**When to use:**
- Before major releases to validate performance requirements
- After significant code changes affecting critical paths
- Periodically to detect performance regressions

---

### `docs/architecture/`

**Purpose:** Architectural documentation, ADRs, diagrams, and system design documents.

**What goes inside:**
- Architecture Decision Records (ADRs)
- System architecture diagrams (Mermaid, PlantUML, or Excalidraw)
- Domain models and bounded context maps
- Integration architecture documentation
- Data flow diagrams

**Naming conventions:**
- ADRs: `adr-{number}-{title-slug}.md` (e.g., `adr-001-use-azure-sql-mi.md`)
- Diagrams: `{subject}.mmd` or `{subject}.puml`
- Architecture docs: `{topic}.md`

**When to use:**
- Record every significant architectural decision
- Update diagrams when system structure changes
- Document new integration patterns or data flows

---

### `docs/api/`

**Purpose:** API documentation, OpenAPI specifications, and API design guidelines.

**What goes inside:**
- OpenAPI/Swagger specification files
- API design guidelines and standards
- Endpoint documentation and examples
- SDK usage guides

**Naming conventions:**
- API specs: `map-api.{version}.yaml` (e.g., `map-api.v1.yaml`)
- Endpoint docs: `{resource}.md`

**When to use:**
- Update OpenAPI specs when adding or modifying endpoints
- Document API breaking changes and migration guides
- Maintain API changelog separate from application changelog

---

### `docs/development/`

**Purpose:** Developer onboarding, coding standards, and development workflow documentation.

**What goes inside:**
- This handbook and coding standards documents
- Setup and development environment guides
- Contributing guidelines
- Troubleshooting guides

**Naming conventions:**
- Guides: `{topic}.md` (e.g., `local-development-setup.md`)
- Standards: `{number}_{name}.md`

**When to use:**
- Update when development processes change
- Add guides when new tooling or frameworks are introduced
- Review and update quarterly for accuracy

---

### `docs/user/`

**Purpose:** User-facing documentation, help articles, and feature guides.

**What goes inside:**
- Feature documentation and how-to guides
- FAQ and troubleshooting articles
- Release notes and changelogs (user-facing)
- Onboarding tutorials

**Naming conventions:**
- Feature guides: `{feature-name}.md`
- Tutorials: `tutorial-{task}.md`
- FAQ: `faq-{topic}.md`

**When to use:**
- Update with every feature release
- Add user guides when new features are shipped
- Review and prune outdated documentation quarterly

---

### `infra/bicep/`

**Purpose:** Azure infrastructure-as-code definitions using Bicep.

**What goes inside:**
- Bicep templates for all Azure resources
- Module definitions for reusable infrastructure components
- Parameter files for different environments

**Naming conventions:**
- Main templates: `{resource-type}.bicep` (e.g., `container-app.bicep`, `sql-mi.bicep`)
- Modules: `modules/{resource-name}.bicep`
- Parameters: `{template}.{environment}.parameters.bicepparam`

**When to use:**
- Every Azure resource must be defined in Bicep
- Create modules when resource patterns are reused across environments
- Update templates when infrastructure requirements change

---

### `infra/environments/`

**Purpose:** Environment-specific configuration and parameter overrides.

**What goes inside:**
- Parameter files for dev, staging, and production environments
- Environment-specific configuration (SKU sizes, replica counts, feature flags)
- Environment provisioning scripts

**Naming conventions:**
- Parameter files: `{environment}.parameters.bicepparam`
- Config files: `{environment}.json` or `{environment}.yaml`

**When to use:**
- Create parameter files for each deployment environment
- Update when environment-specific requirements change
- Add new environments as deployment targets are added

---

### `infra/scripts/`

**Purpose:** Infrastructure management and operational scripts.

**What goes inside:**
- Environment provisioning and teardown scripts
- Database migration and seeding scripts
- Monitoring and alerting setup scripts
- Cost optimization and cleanup scripts

**Naming conventions:**
- Scripts: `{action}-{resource}.ps1` or `{action}-{resource}.sh`
- Use PowerShell for cross-platform compatibility

**When to use:**
- Automate repetitive infrastructure tasks
- Create scripts for disaster recovery procedures
- Document operational runbooks

---

### `database/migrations/`

**Purpose:** Database schema migration files maintaining full version history.

**What goes inside:**
- Flyway or EF Core migration files
- Schema change scripts with up/down migrations
- Migration documentation and impact analysis

**Naming conventions:**
- Flyway: `V{number}__{description}.sql` (e.g., `V001__Create_validation_tables.sql`)
- EF Core: `{Timestamp}_{MigrationName}.cs`
- Never modify committed migration files

**When to use:**
- Create migrations for every schema change
- Include rollback (down) migrations for all changes
- Test migrations against development and staging databases before production

---

### `database/seeds/`

**Purpose:** Reference data and initial data population scripts.

**What goes inside:**
- Reference data inserts (countries, currencies, validation rules)
- Default configuration data
- Test data generators

**Naming conventions:**
- Seed files: `{table_name}_seed.sql` or `{number}_{description}_seed.sql`
- Use deterministic data for reproducible test environments

**When to use:**
- Seed reference data on environment setup
- Create seed data for development and testing environments
- Never seed production with test data

---

### `database/scripts/`

**Purpose:** Database utility and maintenance scripts.

**What goes inside:**
- Backup and restore scripts
- Performance analysis queries
- Data cleanup and archival scripts
- Health check queries

**Naming conventions:**
- Scripts: `{action}_{object}.sql` (e.g., `analyze_index_usage.sql`)

**When to use:**
- Automate database maintenance tasks
- Document complex query patterns
- Create scripts for data repair and reconciliation

---

### `pipelines/build/`

**Purpose:** CI pipeline definitions for building, testing, and validating code.

**What goes inside:**
- Build pipeline YAML files
- Test execution configurations
- Code quality and security scan definitions
- Artifact packaging definitions

**Naming conventions:**
- Pipeline files: `{project}.ci.yml` or `{trigger}.build.yml`
- Keep pipelines modular with template references

**When to use:**
- Create pipelines for each deployable artifact
- Update when build requirements change
- Add quality gates as standards evolve

---

### `pipelines/release/`

**Purpose:** CD pipeline definitions for deploying to various environments.

**What goes inside:**
- Release pipeline YAML files for each environment
- Deployment strategies (blue-green, canary, rolling)
- Approval and gate configurations
- Rollback procedures

**Naming conventions:**
- Pipeline files: `{project}.{environment}.deploy.yml`
- Strategy files: `{strategy}.yml`

**When to use:**
- Create pipelines for each deployment target
- Update when deployment strategies change
- Add approval gates for production deployments

---

### `scripts/`

**Purpose:** Developer utility scripts for common tasks.

**What goes inside:**
- Development environment setup scripts
- Code generation scripts
- Database utility scripts
- Build helper scripts

**Naming conventions:**
- Scripts: `{action}-{target}.ps1` or `{action}-{target}.sh`
- Include brief description in script header comments

**When to use:**
- Automate repetitive developer tasks
- Create scripts when onboarding new developers
- Consolidate scripts when duplicates emerge

---

### `tools/`

**Purpose:** Internal tooling, code generators, and development utilities.

**What goes inside:**
- Custom CLI tools for the project
- Code generators (scaffold, DTO generation, API client generation)
- Development-time utilities and helpers

**Naming conventions:**
- Tool projects: `{ToolName}.csproj` or `{tool-name}/package.json`
- Organize by tool name, not by function

**When to use:**
- Build tools that improve developer productivity
- Create generators when manual code patterns emerge
- Package tools as NuGet packages or npm packages for internal distribution

---

### `examples/`

**Purpose:** Sample code, integration examples, and reference implementations.

**What goes inside:**
- API usage examples
- Integration pattern samples
- Code snippets for documentation
- Template projects for new features

**Naming conventions:**
- Example folders: `{use-case}/` (lowercase, hyphen-separated)
- Example files: `{description}.{ext}`

**When to use:**
- Create examples for complex integration patterns
- Add sample code when documentation requires it
- Update examples when APIs or patterns change

---

### `assets/`

**Purpose:** Static assets including images, diagrams, and design resources.

**What goes inside:**
- Architecture diagrams and screenshots
- Logo and brand assets
- Design mockups and wireframes
- Static resources for documentation

**Naming conventions:**
- Images: `{descriptive-name}.{png|svg|jpg}`
- Use lowercase, hyphen-separated for web compatibility
- Organize by type: `images/`, `diagrams/`, `icons/`

**When to use:**
- Add assets referenced by documentation
- Update diagrams when architecture changes
- Maintain design asset library for consistency

---

### `configuration/`

**Purpose:** Application configuration files and settings templates.

**What goes inside:**
- Feature flag definitions
- Configuration templates for different environments
- Application settings schemas
- Integration configuration files

**Naming conventions:**
- Config files: `{app}.{environment}.json` or `{app}.{environment}.yaml`
- Feature flags: `feature-flags.{environment}.json`
- Schema files: `{config-type}.schema.json`

**When to use:**
- Define configuration templates for new services
- Update when application settings structure changes
- Maintain configuration documentation alongside files

---

## 3. Root-Level Files

### `.editorconfig`

Defines consistent formatting rules across all editors. Includes indentation, line endings, charset, and trailing whitespace settings. Every developer must use this file.

### `.gitignore`

Comprehensive ignore patterns for all technologies in the project. Must be maintained as new tools and frameworks are added. Never ignore files that should be tracked (e.g., `.bicepparam` files, pipeline templates).

### `.gitattributes`

Defines Git attributes for binary files, line endings, and diff behavior. Ensures consistent behavior across operating systems and Git clients.

### `README.md`

Project overview, quick start guide, and navigation to detailed documentation. Must include project description, prerequisites, setup instructions, and links to contributing guidelines.

### `CHANGELOG.md`

User-facing changelog following [Keep a Changelog](https://keepachangelog.com/) format. Updated with every release. Categorized by Added, Changed, Deprecated, Removed, Fixed, Security.

### `LICENSE`

Project license file. Must be present in every repository. Typically MIT for open-source or proprietary license for internal projects.

### `map-platform.sln`

Visual Studio solution file referencing all .NET projects. Generated and maintained by .NET tooling. Do not manually edit — use `dotnet sln` commands to add or remove projects.

---

## 4. Repository Conventions

### Branch Strategy

- `main` — Production-ready code, protected with required reviews
- `develop` — Integration branch for feature work
- `feature/{ticket-id}-{description}` — Feature branches
- `bugfix/{ticket-id}-{description}` — Bug fix branches
- `hotfix/{ticket-id}-{description}` — Emergency production fixes
- `release/{version}` — Release preparation branches

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`

### Pull Request Standards

- Title follows commit message format
- Description references related issues
- Self-review checklist completed
- All CI checks pass
- At least one peer review approved
- No merge conflicts
- Documentation updated if applicable
