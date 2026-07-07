# MAP AI Documentation Standards

| Field | Value |
|-------|-------|
| **Document** | MAP AI Documentation Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Architecture

AI must generate and maintain architecture documentation using C4 diagrams, ADRs, and design documents.

### C4 Diagram Generation

| Level | Description | AI Generation |
|-------|-------------|---------------|
| **Context** | System boundary and external actors | Generate from system requirements |
| **Container** | High-level technology choices | Generate from architecture decisions |
| **Component** | Internal components and relationships | Generate from codebase analysis |
| **Code** | Class diagrams and relationships | Generate from source code |

### C4 Context Diagram Template

```markdown
# System Context Diagram: MAP Platform

## Actors
- **Migration Engineer** — Initiates and monitors migrations
- **Compliance Officer** — Reviews audit reports
- **System Administrator** — Configures platform settings
- **Source System** — Provides data for migration
- **Target System** — Receives migrated data
- **Azure OpenAI** — Provides AI capabilities

## Relationships
- Migration Engineer → MAP: Initiates migrations
- MAP → Source System: Extracts data
- MAP → Target System: Loads data
- MAP → Azure OpenAI: Sends prompts
- MAP → Compliance Officer: Generates reports
```

### Architecture Decision Records (ADRs)

```markdown
# ADR-001: Use Azure SQL Managed Instance

## Status
Accepted

## Date
2026-07-15

## Context
MAP requires a scalable, managed SQL database with high availability
and compliance features for financial data.

## Decision
We will use Azure SQL Managed Instance as the primary database.

## Consequences

### Positive
- Fully managed, reduces operational overhead
- Built-in high availability and disaster recovery
- Native Azure integration
- Compliance certifications (SOC 2, PCI DSS)

### Negative
- Higher cost than self-managed SQL Server
- Less control over infrastructure
- Vendor lock-in

## Alternatives Considered
1. **Self-managed SQL Server** — Rejected due to operational overhead
2. **Azure SQL Database** — Rejected due to instance-level features needed
3. **PostgreSQL on Azure** — Rejected due to team expertise
```

### Design Document Template

```markdown
# Design Document: [Feature Name]

## Overview
[Brief description of the feature]

## Goals
- [Goal 1]
- [Goal 2]

## Non-Goals
- [Non-goal 1]
- [Non-goal 2]

## Architecture
[High-level architecture diagram and description]

## Data Model
[Entity relationship diagram and schema]

## API Design
[API endpoints and contracts]

## Security Considerations
[Security design decisions]

## Performance Considerations
[Performance requirements and design]

## Monitoring and Observability
[Logging, metrics, and alerting]

## Rollout Plan
[Deployment and feature flag strategy]

## Alternatives Considered
[Other approaches and why they were rejected]
```

---

## 2. API Documentation

AI must generate comprehensive API documentation using OpenAPI specifications.

### OpenAPI Specification Generation

```yaml
openapi: 3.0.3
info:
  title: MAP Migration API
  description: API for managing data migrations in MAP platform
  version: 1.0.0
  contact:
    name: MAP Team
    email: map-team@company.com

paths:
  /api/migrations:
    get:
      summary: List all migrations
      operationId: listMigrations
      tags:
        - Migrations
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, in-progress, completed, failed]
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 25
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MigrationList'
        '401':
          description: Unauthorized
        '500':
          description: Internal server error

    post:
      summary: Create a new migration
      operationId: createMigration
      tags:
        - Migrations
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMigrationRequest'
      responses:
        '201':
          description: Migration created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Migration'
        '400':
          description: Bad request
        '401':
          description: Unauthorized

components:
  schemas:
    Migration:
      type: object
      properties:
        id:
          type: string
          format: uuid
        sourceSystem:
          type: string
        targetSystem:
          type: string
        status:
          type: string
          enum: [pending, in-progress, completed, failed]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    CreateMigrationRequest:
      type: object
      required:
        - sourceSystem
        - targetSystem
      properties:
        sourceSystem:
          type: string
          minLength: 1
          maxLength: 100
        targetSystem:
          type: string
          minLength: 1
          maxLength: 100
```

### API Documentation Requirements

| Requirement | Description |
|-------------|-------------|
| **Endpoint Descriptions** | Clear description for each endpoint |
| **Parameter Documentation** | All parameters documented |
| **Request/Response Examples** | Include examples for all schemas |
| **Error Responses** | Document all error scenarios |
| **Authentication** | Document auth requirements |
| **Rate Limiting** | Document rate limits |
| **Versioning** | Document versioning strategy |

---

## 3. README Documentation

AI must generate comprehensive README files for projects and modules.

### Project README Template

```markdown
# MAP Migration Validation Engine

[![Build Status](https://dev.azure.com/org/project/_apis/build/status/map-validation?branchName=main)](https://dev.azure.com/org/project/_build/latest?definitionId=1&branchName=main)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=map-validation&metric=coverage)](https://sonarcloud.io/dashboard?id=map-validation)

## Overview

The MAP Migration Validation Engine provides automated validation of data migrations
across heterogeneous source systems. It supports batch processing, real-time
validation, and generates compliance reports.

## Features

- Automated data validation
- Real-time migration monitoring
- Compliance reporting
- AI-assisted validation rules
- Multi-source system support

## Prerequisites

- .NET 8 SDK
- Node.js 18+
- Azure SQL Managed Instance
- Azure OpenAI API key

## Quick Start

### Backend

```bash
# Clone the repository
git clone https://github.com/org/map-validation.git

# Navigate to backend
cd backend

# Restore dependencies
dotnet restore

# Run database migrations
dotnet ef database update

# Start the API
dotnet run --project src/MigrationAssurance.Api
```

### Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `ConnectionStrings:DefaultConnection` | Azure SQL MI connection string | Required |
| `AzureOpenAI:Endpoint` | Azure OpenAI endpoint URL | Required |
| `AzureOpenAI:ApiKey` | Azure OpenAI API key | Required |

## API Documentation

Once running, access the API documentation at:
- Swagger UI: `https://localhost:5001/swagger`
- OpenAPI Spec: `https://localhost:5001/swagger/v1/swagger.json`

## Development

### Running Tests

```bash
# Backend tests
dotnet test

# Frontend tests
npm test

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Format
npm run format
```

## Deployment

See [Deployment Guide](docs/deployment.md) for detailed deployment instructions.

## Contributing

See [Contributing Guide](CONTRIBUTING.md) for contribution guidelines.

## License

Proprietary - See [LICENSE](LICENSE) for details.
```

---

## 4. Release Notes

AI must generate release notes from commits and version information.

### Release Notes Template

```markdown
# Release Notes - v1.2.0

**Release Date:** July 15, 2026

## New Features

### Migration Validation Rules Engine
- Added configurable validation rules
- Support for custom validation logic
- Real-time rule execution

### Compliance Reporting
- Generated PDF compliance reports
- Export to Excel and CSV
- Scheduled report generation

## Improvements

### Performance
- Improved migration processing speed by 40%
- Optimized database queries
- Added connection pooling

### Security
- Updated dependency versions
- Added rate limiting
- Improved input validation

## Bug Fixes

- Fixed race condition in parallel migrations (#123)
- Fixed memory leak in long-running processes (#125)
- Fixed timezone handling in reports (#128)

## Breaking Changes

- **API:** Removed deprecated `/api/v1/migrations` endpoint
- **Database:** Added new required columns to `MigrationRecords` table

## Migration Guide

### From v1.1.x to v1.2.0

1. Update connection string format
2. Run database migrations
3. Update API client code

## Known Issues

- Large file uploads may timeout on slow connections (#130)
- Reports may fail with special characters in data (#132)

## Contributors

- @developer1
- @developer2
- @developer3

## Full Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete changelog.
```

---

## 5. Technical Guides

AI must generate developer guides and setup instructions.

### Developer Guide Template

```markdown
# Developer Guide

## Getting Started

### Development Environment Setup

1. **Install Prerequisites**
   - Visual Studio 2022 or VS Code
   - .NET 8 SDK
   - Node.js 18+
   - Docker Desktop

2. **Clone Repository**
   ```bash
   git clone https://github.com/org/map-validation.git
   ```

3. **Configure Local Settings**
   ```bash
   cp appsettings.Development.example.json appsettings.Development.json
   # Edit with your local settings
   ```

4. **Start Development Services**
   ```bash
   docker-compose up -d
   ```

### Project Structure

```
map-validation/
├── backend/
│   ├── src/
│   │   ├── MigrationAssurance.Core/        # Domain models and interfaces
│   │   ├── MigrationAssurance.Application/ # Business logic
│   │   ├── MigrationAssurance.Infrastructure/ # Data access
│   │   └── MigrationAssurance.Api/         # API controllers
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/                     # React components
│   │   ├── hooks/                          # Custom hooks
│   │   ├── services/                       # API services
│   │   └── utils/                          # Utilities
│   └── tests/
└── docs/
```

### Coding Standards

See [AI Coding Standards](05_AI_Coding_Standards.md) for detailed coding standards.

### Git Workflow

1. Create feature branch from `main`
2. Make changes following coding standards
3. Write tests for new functionality
4. Run tests and ensure they pass
5. Create pull request
6. Address review feedback
7. Merge to `main`

### Debugging

#### Backend
- Use Visual Studio debugger
- Attach to running process
- Use logging for production debugging

#### Frontend
- Use Chrome DevTools
- Use React Developer Tools
- Use VS Code debugger

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Run `dotnet restore` and `npm install` |
| Tests fail | Check test data and mocks |
| API not responding | Verify connection strings |
| UI not loading | Check proxy configuration |
```

---

## 6. User Guides

AI must generate end-user documentation from features.

### User Guide Template

```markdown
# MAP User Guide

## Welcome

Welcome to the Migration Assurance Platform (MAP). This guide will help you
get started with validating your data migrations.

## Getting Started

### Logging In

1. Navigate to your MAP URL
2. Enter your credentials
3. Click "Sign In"

### Creating a Migration

1. Click "New Migration" in the dashboard
2. Select source system
3. Select target system
4. Configure validation rules
5. Click "Start Migration"

## Features

### Dashboard

The dashboard provides an overview of:
- Active migrations
- Recent completions
- Validation failures
- System health

### Migration Management

#### Viewing Migrations
- Use filters to narrow results
- Click on a migration for details
- Export migration data to CSV

#### Monitoring Progress
- View real-time progress
- See validation results
- Download detailed reports

### Validation Rules

#### Using Built-in Rules
1. Select validation category
2. Enable desired rules
3. Configure parameters
4. Apply to migration

#### Creating Custom Rules
1. Navigate to "Validation Rules"
2. Click "Create Rule"
3. Define rule logic
4. Test rule
5. Save and deploy

### Reporting

#### Generating Reports
1. Navigate to "Reports"
2. Select report type
3. Choose date range
4. Click "Generate"
5. Download report

#### Scheduling Reports
1. Select report type
2. Configure schedule
3. Set recipients
4. Save schedule

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Migration stuck | Check source system connectivity |
| Validation failed | Review validation rules |
| Report not generating | Check date range and filters |
| Login failed | Verify credentials with admin |

### Getting Help

- **Documentation:** [docs.map.company.com](https://docs.map.company.com)
- **Support:** support@map.company.com
- **Status Page:** status.map.company.com
```

---

## 7. Change Logs

AI must generate detailed change logs from git history.

### CHANGELOG Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Feature for bulk migration validation
- API endpoint for migration statistics

### Changed
- Improved validation rule engine performance

### Deprecated
- Legacy API v1 endpoints

### Removed
- Removed deprecated configuration options

### Fixed
- Fixed race condition in parallel processing

### Security
- Updated dependencies to patch vulnerabilities

## [1.2.0] - 2026-07-15

### Added
- Configurable validation rules engine
- Compliance reporting feature
- Real-time migration monitoring

### Changed
- Improved database query performance
- Updated UI to React 18

### Fixed
- Fixed memory leak in long-running processes
- Fixed timezone handling in reports

### Security
- Added rate limiting to API
- Improved input validation

## [1.1.0] - 2026-06-01

### Added
- Multi-source system support
- Export to CSV and Excel
- User role management

### Changed
- Improved error handling
- Updated documentation

### Fixed
- Fixed authentication issues
- Fixed pagination bugs

## [1.0.0] - 2026-04-01

### Added
- Initial release
- Basic migration validation
- API and UI
- User authentication
```

### AI Generation Rules

| Rule | Description |
|------|-------------|
| **Commit Analysis** | Analyze git commits for changes |
| **Categorization** | Categorize changes (Added, Changed, Fixed, etc.) |
| **Breaking Changes** | Identify and highlight breaking changes |
| **Version Bumping** | Suggest version bump based on changes |
| **Link Generation** | Generate links to issues and PRs |

---

## 8. Knowledge Base

AI must maintain a searchable knowledge base from documentation.

### Knowledge Base Structure

```markdown
# Knowledge Base

## Categories

### Getting Started
- [Installation Guide](getting-started/installation.md)
- [Quick Start Tutorial](getting-started/quick-start.md)
- [Configuration](getting-started/configuration.md)

### Architecture
- [System Overview](architecture/overview.md)
- [Component Design](architecture/components.md)
- [Data Flow](architecture/data-flow.md)

### Development
- [Coding Standards](development/coding-standards.md)
- [Git Workflow](development/git-workflow.md)
- [Testing Guide](development/testing.md)

### Operations
- [Deployment Guide](operations/deployment.md)
- [Monitoring](operations/monitoring.md)
- [Troubleshooting](operations/troubleshooting.md)

### API Reference
- [Authentication](api/authentication.md)
- [Endpoints](api/endpoints.md)
- [Error Codes](api/error-codes.md)

## Search Index

| Topic | Keywords | Documents |
|-------|----------|-----------|
| Installation | setup, install, prerequisites | Installation Guide |
| API | endpoints, REST, authentication | API Reference |
| Testing | unit tests, integration tests, E2E | Testing Guide |
| Deployment | release, CI/CD, pipeline | Deployment Guide |
| Troubleshooting | errors, debugging, issues | Troubleshooting |
```

### AI Knowledge Base Features

| Feature | Description |
|---------|-------------|
| **Auto-generation** | Generate knowledge base from code and docs |
| **Search** | Full-text search across all documentation |
| **Tagging** | Tag articles by topic and component |
| **Versioning** | Version knowledge base with releases |
| **Feedback** | Collect feedback on documentation quality |
| **Analytics** | Track documentation usage and gaps |
| **Updates** | Auto-update when code changes |
| **Validation** | Validate documentation accuracy |
