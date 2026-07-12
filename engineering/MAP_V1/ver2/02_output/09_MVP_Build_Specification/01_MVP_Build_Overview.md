# MAP MVP Build Specification - Overview

**Document:** MAP MVP Build Specification
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Purpose

The Migration Assurance Platform (MAP) is an Azure-native cloud migration validation platform designed to provide comprehensive pre-migration assessments, real-time validation, and post-migration verification for enterprise workloads moving to Azure. This document establishes the technical foundation, development standards, and engineering practices that govern the MVP build across a 20-week timeline with a 7-person development team organized into 7 sprints (Sprint 0 through Sprint 5).

The MVP delivers a production-ready platform that enables migration teams to execute validated, compliant cloud migrations with full observability, AI-assisted insights, and governance controls.

---

## Implementation Strategy

### Cloud-Native Architecture
MAP is built as a cloud-native application on Microsoft Azure, leveraging platform services to minimize operational overhead and maximize scalability. The platform runs on Azure Container Apps with autoscaling enabled, uses Azure SQL Managed Instance for persistent storage, and integrates Azure OpenAI for AI-powered insights.

### API-First Design
All platform capabilities are exposed through a well-defined RESTful API layer built on ASP.NET Core 8. This enables the React frontend, external integrations, and future mobile clients to interact with the platform through a consistent, versioned interface.

### Microservices Decomposition
The backend is decomposed into focused services with clear domain boundaries:
- **Validation Service** - Orchestrates check execution and findings management
- **Discovery Service** - Manages Azure resource scanning and inventory
- **AI Service** - Handles OpenAI integration and prompt management
- **Identity Service** - Manages authentication, authorization, and tenant isolation
- **Reporting Service** - Generates dashboards, reports, and exports

### Incremental Delivery
The platform is delivered incrementally across sprints, with each sprint producing deployable, testable increments. Sprint 0 delivers infrastructure, Sprint 1 delivers identity, and each subsequent sprint adds functional capabilities that build upon previous increments.

---

## Development Principles

| Principle | Description |
|-----------|-------------|
| **SOLID** | Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion applied across all services |
| **DRY** | Don't Repeat Yourself - shared libraries, common abstractions, and reusable components |
| **KISS** | Keep It Simple, Stupid - favor straightforward solutions over complex abstractions |
| **YAGNI** | You Aren't Gonna Need It - implement only what is required for the current sprint |
| **Twelve-Factor** | Configuration via environment variables, stateless processes, port binding, concurrency via scaling |
| **Security by Design** | Threat modeling, secure coding practices, least privilege access, encryption at rest and in transit |

---

## Technology Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Single-page application for migration dashboards and workflows |
| **UI Framework** | Fluent UI React | Microsoft design system components |
| **State Management** | TanStack Query | Server state management, caching, and synchronization |
| **Backend API** | .NET 8 / ASP.NET Core | RESTful API services, middleware, and domain logic |
| **ORM** | Entity Framework Core | Data access, migrations, and query composition |
| **Database** | Azure SQL Managed Instance | Persistent storage for platform, migration, and audit data |
| **Authentication** | Microsoft Entra ID | Enterprise SSO, OAuth 2.0, OpenID Connect |
| **Authorization** | Azure RBAC + Custom Policies | Role-based and policy-based access control |
| **AI** | Azure OpenAI (GPT-4) | Migration insights, risk analysis, and recommendations |
| **Container Hosting** | Azure Container Apps | Serverless container hosting with autoscaling |
| **Container Registry** | Azure Container Registry | Private Docker image storage |
| **CI/CD** | GitHub Actions | Continuous integration and deployment pipelines |
| **IaC** | Bicep / Terraform | Infrastructure as Code for Azure resource provisioning |
| **Monitoring** | Azure Monitor + Application Insights | Observability, tracing, and alerting |
| **Logging** | Azure Log Analytics | Centralized logging and query capabilities |
| **Secrets** | Azure Key Vault | Secure storage of secrets, certificates, and connection strings |
| **Caching** | Azure Redis Cache | Session management and performance optimization |
| **Messaging** | Azure Service Bus | Asynchronous message processing for long-running operations |
| **Storage** | Azure Blob Storage | Report storage, export files, and artifact management |

---

## Repository Structure

```
fs-migration-validation-engine/
├── src/
│   ├── api/                          # .NET 8 Backend Services
│   │   ├── Map.Api/                  # Main API host project
│   │   │   ├── Controllers/          # API controllers
│   │   │   ├── Middleware/           # Request pipeline middleware
│   │   │   ├── Filters/             # Action and result filters
│   │   │   └── Program.cs           # Application entry point
│   │   ├── Map.Validation/          # Validation service library
│   │   │   ├── Checks/              # Check implementations
│   │   │   ├── Engine/              # Check execution engine
│   │   │   └── Scoring/             # Health score calculations
│   │   ├── Map.Discovery/           # Discovery service library
│   │   │   ├── Scanners/            # Azure resource scanners
│   │   │   ├── Inventory/           # Inventory management
│   │   │   └── Dependency/          # Dependency mapping
│   │   ├── Map.AI/                  # AI insights service library
│   │   │   ├── Prompts/             # Prompt templates
│   │   │   ├── Analysis/            # AI analysis logic
│   │   │   └── Providers/           # OpenAI provider abstraction
│   │   ├── Map.Identity/            # Identity and auth library
│   │   │   ├── Authentication/      # Auth handlers and middleware
│   │   │   ├── Authorization/       # Policy providers and handlers
│   │   │   └── Tenancy/             # Multi-tenant isolation
│   │   ├── Map.Reporting/           # Reporting service library
│   │   │   ├── Generators/          # Report generation logic
│   │   │   ├── Templates/           # Report templates
│   │   │   └── Export/              # PDF/Excel export logic
│   │   └── Map.Shared/              # Shared kernel library
│   │       ├── Models/              # Domain models and DTOs
│   │       ├── Extensions/          # Extension methods
│   │       ├── Results/             # Result pattern implementation
│   │       └── Validation/          # FluentValidation rules
│   ├── web/                          # React 18 Frontend
│   │   ├── src/
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── features/            # Feature-sliced modules
│   │   │   │   ├── discovery/       # Discovery feature
│   │   │   │   ├── validation/      # Validation feature
│   │   │   │   ├── ai-insights/     # AI insights feature
│   │   │   │   ├── reporting/       # Reporting feature
│   │   │   │   └── governance/      # Governance feature
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── services/            # API client services
│   │   │   ├── store/               # Global state (Zustand)
│   │   │   ├── types/               # TypeScript type definitions
│   │   │   └── utils/               # Utility functions
│   │   ├── public/                   # Static assets
│   │   ├── index.html
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── shared/                       # Shared TypeScript/TS types
│       ├── models/                   # Shared domain models
│       └── contracts/                # API contract definitions
├── tests/
│   ├── unit/                         # Unit tests
│   │   ├── Map.Validation.Tests/
│   │   ├── Map.Discovery.Tests/
│   │   └── web.test/
│   ├── integration/                  # Integration tests
│   │   ├── Map.Api.Tests/
│   │   └── Map.Integration.Tests/
│   └── e2e/                          # End-to-end tests
│       └── cypress/
├── infra/                            # Infrastructure as Code
│   ├── modules/                      # Bicep modules
│   │   ├── container-app/
│   │   ├── sql-managed-instance/
│   │   ├── key-vault/
│   │   └── redis/
│   ├── environments/                 # Environment-specific configs
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── main.bicep                    # Root infrastructure template
├── docs/                             # Documentation
│   ├── architecture/                 # Architecture decision records
│   ├── api/                          # OpenAPI specifications
│   └── runbooks/                     # Operational runbooks
├── .github/                          # GitHub configuration
│   └── workflows/                    # CI/CD pipelines
├── .opencode/                        # OpenCode configuration
├── opencode.json                     # Project configuration
└── README.md
```

---

## Coding Standards

### C# Conventions

| Rule | Standard |
|------|----------|
| **Naming** | PascalCase for types, methods, properties, and events |
| **Private Fields** | _camelCase with underscore prefix |
| **Interfaces** | I prefix (e.g., IValidationService) |
| **Async Methods** | Async suffix (e.g., GetValidationResultAsync) |
| **Parameters** | camelCase |
| **Constants** | PascalCase or UPPER_SNAKE_CASE |
| **Nullable Reference Types** | Enabled globally |
| **Expression-Bodied Members** | Single-line expressions |
| **Pattern Matching** | Preferred over null checks and type casts |
| **Nullable Parameters** | Use nullable annotations (?) |

### TypeScript Conventions

| Rule | Standard |
|------|----------|
| **Naming** | camelCase for variables and functions |
| **Components** | PascalCase, one component per file |
| **Types/Interfaces** | PascalCase, prefixed with I for interfaces (optional) |
| **Enums** | PascalCase with PascalCase members |
| **File Organization** | Feature-sliced structure with barrel exports |
| **Props** | Always typed, destructured in function parameters |
| **State** | Immutably updated, no direct mutations |
| **Imports** | Grouped: external → internal → relative, separated by blank lines |

### File Organization

- One class/interface per file
- Files named after the primary export (e.g., `ValidationService.cs`)
- Tests mirror source structure (e.g., `ValidationServiceTests.cs`)
- Feature components grouped by domain, not by type

---

## Definition of Done (DoD)

A User Story is considered **Done** when ALL of the following are complete:

- [ ] Code is complete and compiles without errors
- [ ] All acceptance criteria are met
- [ ] Unit tests written and passing (>80% coverage for new code)
- [ ] Integration tests written and passing for API endpoints
- [ ] Code reviewed and approved by at least one team member
- [ ] Documentation updated (API docs, README, inline comments where needed)
- [ ] Deployed to staging environment and verified
- [ ] No blocking bugs or unresolved issues
- [ ] Security scan completed with no high/critical findings
- [ ] Performance benchmarks met for specified scenarios

---

## Definition of Ready (DoR)

A User Story is considered **Ready** for Sprint planning when ALL of the following are true:

- [ ] Story is clearly defined with a specific user role, action, and benefit
- [ ] Acceptance criteria are specific, measurable, and testable
- [ ] Dependencies identified and either resolved or scheduled
- [ ] Estimated by the team with agreed-upon story points
- [ ] UI/UX designs provided (if applicable)
- [ ] API contracts defined (if applicable)
- [ ] Data requirements specified
- [ ] Non-functional requirements documented (performance, security)
- [ ] Story fits within a single sprint

---

## Release Strategy

### Blue-Green Deployments
Production uses blue-green deployment with Azure Container Apps revision management. New versions are deployed alongside existing versions, validated, and then traffic is switched. Rollback is achieved by reverting traffic routing.

### Feature Flags
All new features are gated behind feature flags managed through Azure App Configuration. This enables:
- Progressive rollout to user segments
- A/B testing for AI prompt variations
- Quick disable of problematic features without redeployment
- Environment-specific feature toggling

### Semantic Versioning
MAP follows Semantic Versioning (SemVer 2.0):
- **Major** (X.0.0): Breaking API changes or major architectural shifts
- **Minor** (0.X.0): New features with backward compatibility
- **Patch** (0.0.X): Bug fixes and security patches

### Release Cadence
- **Sprint Releases**: Internal builds deployed to staging after each sprint
- **Release Candidates**: 1-2 weeks of stabilization before GA
- **Production Releases**: Monthly release windows with emergency patches as needed
