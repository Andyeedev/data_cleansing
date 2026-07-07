# MAP MVP Build Specification - Sprint Plan

**Document:** MAP MVP Sprint Plan
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Sprint Overview

| Sprint | Weeks | Focus | Story Points | Team Velocity Target |
|--------|-------|-------|-------------|---------------------|
| Sprint 0 | 1-2 | Foundation & Infrastructure | 21 SP | 10-11 SP/dev |
| Sprint 1 | 3-4 | Identity & Authentication | 21 SP | 10-11 SP/dev |
| Sprint 2 | 5-6 | Discovery & Inventory | 21 SP | 10-11 SP/dev |
| Sprint 3 | 7-8 | Validation Core | 24 SP | 12 SP/dev |
| Sprint 4 | 9-10 | AI & Reporting | 21 SP | 10-11 SP/dev |
| Sprint 5 | 11-12 | Governance & Polish | 21 SP | 10-11 SP/dev |
| **Total** | | | **129 SP** | |

---

## Sprint 0: Foundation & Infrastructure (Weeks 1-2)

### Objectives
Establish the complete Azure infrastructure, CI/CD pipelines, project scaffolding, and development environment. Deliver a working, deployable application skeleton that all subsequent sprints build upon.

### Features
- Azure subscription and resource group provisioning
- CI/CD pipeline with build, test, and deployment stages
- .NET 8 API project scaffolding with health check endpoint
- React 18 frontend project scaffolding
- Azure SQL Managed Instance provisioning
- Azure Container Apps environment setup

### User Stories

| Story ID | Description | SP |
|----------|-------------|-----|
| US-001 | As a DevOps engineer, I want Azure infrastructure provisioned via Bicep so that environments are repeatable and consistent | 5 |
| US-002 | As a developer, I want a CI/CD pipeline that builds, tests, and deploys on every push so that I can validate changes immediately | 3 |
| US-003 | As a developer, I want the .NET 8 API project scaffolded with health checks so that I can begin feature development | 3 |
| US-004 | As a developer, I want the React 18 frontend project scaffolded with TypeScript so that I can begin UI development | 3 |
| US-005 | As a DBA, I want Azure SQL MI provisioned with migration scripts so that data layer is ready for development | 5 |
| US-006 | As a developer, I want the development environment fully documented so that new team members can onboard quickly | 2 |

### Tasks Breakdown

**Infrastructure (8h)**
- [ ] Create Azure subscription and resource groups
- [ ] Write Bicep templates for Container Apps, SQL MI, Redis, Key Vault
- [ ] Configure Azure Container Registry
- [ ] Set up Application Insights and Log Analytics workspace

**CI/CD (6h)**
- [ ] Configure GitHub Actions workflow for .NET build
- [ ] Configure GitHub Actions workflow for React build
- [ ] Add unit test execution stage
- [ ] Configure deployment to Azure Container Apps (dev)

**Backend Scaffolding (6h)**
- [ ] Create solution structure with shared kernel
- [ ] Add health check endpoints (SQL, Redis, custom)
- [ ] Configure dependency injection container
- [ ] Set up Serilog logging

**Frontend Scaffolding (4h)**
- [ ] Create Vite + React + TypeScript project
- [ ] Configure Fluent UI theme
- [ ] Set up routing with React Router
- [ ] Add API client service layer

### Acceptance Criteria

1. `azd up` provisions a complete dev environment in under 15 minutes
2. Push to main triggers CI/CD pipeline that completes in under 8 minutes
3. API responds to `/health` with 200 OK and dependency status
4. Frontend loads in browser with Fluent UI styling
5. Database is accessible with initial migration applied

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Azure quota limits delay provisioning | High | Request quota increases in advance; use alternative regions |
| CI/CD pipeline configuration complexity | Medium | Start with minimal pipeline; iterate |
| SQL MI provisioning takes longer than expected | Medium | Use Azure SQL Server as fallback for dev |

### Deliverables

- Working CI/CD pipeline on GitHub Actions
- Development environment running on Azure Container Apps
- Empty API with health check endpoint
- React frontend scaffolded with routing
- Azure SQL MI provisioned and accessible
- Infrastructure documentation

---

## Sprint 1: Identity & Authentication (Weeks 3-4)

### Objectives
Implement Microsoft Entra ID integration for SSO authentication, establish multi-tenant data model, implement role-based access control, and secure all API endpoints.

### Features
- Microsoft Entra ID OAuth 2.0/OpenID Connect integration
- Multi-tenant data model with row-level security
- Role-based access control (Admin, Migration Lead, Contributor, Viewer)
- JWT token management and refresh flow
- Tenant administration portal

### User Stories

| Story ID | Description | SP |
|----------|-------------|-----|
| US-007 | As a user, I want to sign in with my corporate Microsoft account so that I don't need separate credentials | 5 |
| US-008 | As an admin, I want to manage tenant users and roles so that I can control access to the platform | 5 |
| US-009 | As a developer, I want tenant-scoped data isolation so that customer data is never cross-accessed | 5 |
| US-010 | As a user, I want my session to persist across browser tabs so that I don't need to re-authenticate | 3 |
| US-011 | As an admin, I want to configure custom roles so that I can match my organization's access model | 3 |

### Tasks Breakdown

**Authentication (10h)**
- [ ] Register MAP application in Azure AD
- [ ] Configure OAuth 2.0/OpenID Connect middleware
- [ ] Implement JWT bearer authentication
- [ ] Add token refresh and silent renewal

**Multi-Tenancy (8h)**
- [ ] Design tenant data model (Tenants, TenantUsers, TenantRoles)
- [ ] Implement tenant context middleware
- [ ] Add EF Core global query filters for tenant scoping
- [ ] Create tenant seeding scripts

**RBAC (6h)**
- [ ] Define role constants and permission matrix
- [ ] Implement policy-based authorization handlers
- [ ] Add role assignment API endpoints
- [ ] Create admin UI for user/role management

**Testing & Security (4h)**
- [ ] Write integration tests for auth flow
- [ ] Add security headers middleware
- [ ] Validate token expiration and refresh
- [ ] Test cross-tenant isolation

### Acceptance Criteria

1. User can sign in via Entra ID and receive JWT token
2. API rejects requests without valid token (401 Unauthorized)
3. API enforces role-based permissions (403 Forbidden for unauthorized)
4. Data queries are automatically scoped to authenticated tenant
5. Admin can assign roles to users through admin portal

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Entra ID tenant configuration complexity | High | Leverage Azure AD app registrations template; involve identity team early |
| Multi-tenant query filter performance | Medium | Implement proper indexing; load test with multi-tenant queries |
| Token refresh edge cases | Medium | Implement comprehensive token lifecycle tests |

### Deliverables

- SSO login via Microsoft Entra ID
- Tenant isolation enforced across all data operations
- Role-based access control for all API endpoints
- Admin portal for user and role management
- Integration tests for authentication flows

---

## Sprint 2: Discovery & Inventory (Weeks 5-6)

### Objectives
Implement Azure resource scanning and discovery, build the resource inventory data model, map resource dependencies, and deliver a browsable inventory UI.

### Features
- Azure subscription connection via service principal
- Resource group and resource scanning using Azure Resource Manager API
- Dependency mapping using ARM graph relationships
- Inventory search, filter, and export
- Configurable scan scheduling

### User Stories

| Story ID | Description | SP |
|----------|-------------|-----|
| US-012 | As a migration lead, I want to connect Azure subscriptions so that I can discover resources to migrate | 5 |
| US-013 | As a user, I want to see a complete resource inventory so that I understand what exists in my environment | 5 |
| US-014 | As a user, I want to see resource dependencies so that I understand migration complexity | 5 |
| US-015 | As a user, I want to search and filter the inventory so that I can find specific resources quickly | 3 |
| US-016 | As a user, I want to export the inventory to Excel so that I can share it with my team | 3 |

### Tasks Breakdown

**Subscription Connection (8h)**
- [ ] Create service principal registration flow
- [ ] Implement Azure Resource Manager API client
- [ ] Add subscription enumeration and validation
- [ ] Store connection metadata securely in Key Vault

**Resource Scanning (10h)**
- [ ] Implement resource group scanner
- [ ] Implement resource type-specific scanners (VMs, SQL, App Services, etc.)
- [ ] Add parallel scanning with rate limiting
- [ ] Implement incremental scan (delta detection)

**Dependency Mapping (6h)**
- [ ] Parse ARM dependency relationships
- [ ] Build dependency graph data structure
- [ ] Implement transitive dependency detection
- [ ] Store dependency graph in database

**Inventory UI (8h)**
- [ ] Build resource inventory table with sorting/filtering
- [ ] Implement resource detail view with dependency graph
- [ ] Add subscription selector and resource group filter
- [ ] Create export to Excel functionality

### Acceptance Criteria

1. Platform connects to Azure subscription using service principal credentials
2. All resource types within scope are discovered and inventoried
3. Resource dependencies are correctly mapped and displayed
4. Inventory search returns results within 2 seconds for 10,000+ resources
5. Inventory can be exported to Excel with all resource properties

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| ARM API rate limits during large scans | High | Implement exponential backoff and parallel throttling |
| Large subscription scanning performance | Medium | Use background workers; show progress indicators |
| Resource type coverage gaps | Medium | Prioritize top 20 Azure resource types; extensible scanner architecture |

### Deliverables

- Connected Azure subscriptions with service principal authentication
- Complete resource inventory with all discovered resources
- Dependency graph showing resource relationships
- Searchable, filterable inventory UI
- Excel export functionality

---

## Sprint 3: Validation Core (Weeks 7-8)

### Objectives
Build the validation engine that executes checks against discovered resources, generates findings with severity levels, calculates health scores, and provides a findings management interface.

### Features
- Check execution engine with extensible check framework
- Pre-built validation checks (network, security, performance, cost)
- Findings management with severity, status, and remediation
- Health score calculation per resource, resource group, and subscription
- Validation run orchestration and history

### User Stories

| Story ID | Description | SP |
|----------|-------------|-----|
| US-017 | As a migration lead, I want to run validation checks against my resources so that I identify migration risks | 5 |
| US-018 | As a user, I want to see findings categorized by severity so that I can prioritize remediation | 5 |
| US-019 | As a user, I want to see health scores for my environment so that I understand overall migration readiness | 5 |
| US-020 | As a user, I want to track finding status so that I can manage remediation progress | 3 |
| US-021 | As a user, I want to view validation run history so that I can track improvement over time | 3 |
| US-022 | As a developer, I want to create custom checks so that I can extend validation capabilities | 3 |

### Tasks Breakdown

**Validation Engine (12h)**
- [ ] Design check execution pipeline
- [ ] Implement check runner with parallel execution
- [ ] Add check registry and discovery
- [ ] Implement check result serialization

**Pre-built Checks (10h)**
- [ ] Network validation checks (NSG rules, public IPs, DNS)
- [ ] Security validation checks (RBAC, encryption, key management)
- [ ] Performance validation checks (VM sizing, storage IOPS)
- [ ] Cost optimization checks (reserved instances, right-sizing)

**Findings Management (6h)**
- [ ] Design findings data model
- [ ] Implement findings CRUD API
- [ ] Add severity classification and filtering
- [ ] Create findings list and detail UI

**Health Scoring (6h)**
- [ ] Design scoring algorithm (weighted severity model)
- [ ] Implement per-resource scoring
- [ ] Implement aggregation scoring (resource group, subscription)
- [ ] Add scoring trend tracking

### Acceptance Criteria

1. Validation engine executes all registered checks against resource inventory
2. Findings are generated with correct severity levels (Critical, High, Medium, Low, Info)
3. Health scores accurately reflect the distribution and severity of findings
4. Findings can be updated with status changes and comments
5. Validation runs complete within 10 minutes for 5,000 resource inventory

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Check complexity varies widely | Medium | Implement check framework with common abstractions; start with simpler checks |
| Large inventory validation performance | High | Use background workers; implement check batching and parallelism |
| False positive rate in checks | Medium | Include confidence scoring; allow finding dismissal with reason |

### Deliverables

- Validation engine with extensible check framework
- 15+ pre-built validation checks
- Findings management interface
- Health score dashboard
- Validation run history and comparison

---

## Sprint 4: AI & Reporting (Weeks 9-10)

### Objectives
Integrate Azure OpenAI for intelligent migration insights, build real-time dashboards, and implement report generation with PDF/Excel export capabilities.

### Features
- Azure OpenAI integration with managed identity
- AI-powered risk explanations and recommendations
- Migration effort estimation
- Real-time executive dashboard
- PDF and Excel report generation

### User Stories

| Story ID | Description | SP |
|----------|-------------|-----|
| US-023 | As a migration lead, I want AI-generated insights for findings so that I understand the impact and mitigation | 5 |
| US-024 | As a user, I want migration effort estimates so that I can plan timelines and resources | 5 |
| US-025 | As an executive, I want a real-time dashboard so that I can monitor migration readiness at a glance | 5 |
| US-026 | As a user, I want to generate PDF reports so that I can share findings with stakeholders | 3 |
| US-027 | As a user, I want to schedule report generation so that I receive regular updates automatically | 3 |

### Tasks Breakdown

**AI Integration (10h)**
- [ ] Register Azure OpenAI resource and deploy GPT-4 model
- [ ] Implement OpenAI client with managed identity
- [ ] Create prompt templates for finding explanations
- [ ] Add response caching and token usage tracking

**AI Features (6h)**
- [ ] Implement risk explanation generation per finding
- [ ] Add migration effort estimation algorithm
- [ ] Create AI insights dashboard
- [ ] Implement confidence scoring for AI responses

**Dashboards (6h)**
- [ ] Build executive summary dashboard
- [ ] Implement real-time data refresh (SignalR)
- [ ] Add drill-down navigation from summary to detail
- [ ] Create migration readiness trend charts

**Report Generation (6h)**
- [ ] Implement PDF report generation (QuestPDF or similar)
- [ ] Add Excel report generation (EPPlus or similar)
- [ ] Create report template system
- [ ] Implement report scheduling and email delivery

### Acceptance Criteria

1. AI generates accurate risk explanations for each validation finding
2. Migration effort estimates are within 30% of manual estimates
3. Dashboard loads within 3 seconds and refreshes in real-time
4. PDF reports include all findings, scores, and recommendations
5. Reports can be generated on-demand or on a schedule

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Azure OpenAI token costs | Medium | Implement caching; limit prompt scope; track usage budgets |
| AI response quality and consistency | High | Iterate on prompts; add response validation; allow manual overrides |
| Report generation performance for large datasets | Medium | Implement report generation as background job; show progress |

### Deliverables

- Azure OpenAI integration with managed identity authentication
- AI-generated insights for all validation findings
- Real-time executive dashboard with drill-down
- PDF report generation
- Excel export with all platform data

---

## Sprint 5: Governance & Polish (Weeks 11-12)

### Objectives
Implement the policy engine for compliance evaluation, conduct UAT, optimize performance, resolve critical bugs, and prepare for general availability.

### Features
- Declarative policy definition language
- Compliance evaluation engine
- Policy compliance scoring
- UAT bug fixes and polish
- Performance optimization
- GA preparation and documentation

### User Stories

| Story ID | Description | SP |
|----------|-------------|-----|
| US-028 | As a compliance officer, I want to define governance policies so that I can enforce organizational standards | 5 |
| US-029 | As a user, I want to see compliance scores so that I understand regulatory readiness | 5 |
| US-030 | As a user, I want non-compliant resources linked to remediation guidance so that I know how to fix issues | 3 |
| US-031 | As a user, I want the platform to perform well with large inventories so that it scales to my environment | 3 |
| US-032 | As an admin, I want comprehensive audit logging so that I can track all platform activity | 5 |

### Tasks Breakdown

**Policy Engine (10h)**
- [ ] Design policy definition language (JSON/YAML schema)
- [ ] Implement policy parser and validator
- [ ] Create policy evaluation engine
- [ ] Build built-in policy library (Azure best practices)

**Compliance (6h)**
- [ ] Implement compliance scoring algorithm
- [ ] Add compliance trend tracking
- [ ] Create compliance dashboard
- [ ] Link non-compliant resources to remediation guidance

**Performance & Polish (8h)**
- [ ] Profile and optimize API response times
- [ ] Implement database query optimization
- [ ] Add pagination for large result sets
- [ ] Optimize frontend bundle size and loading

**GA Preparation (6h)**
- [ ] Complete UAT bug fixes
- [ ] Update API documentation (OpenAPI spec)
- [ ] Create user guide and onboarding documentation
- [ ] Finalize monitoring and alerting rules

### Acceptance Criteria

1. Policy engine evaluates resources against defined compliance rules
2. Compliance scores are accurate and trackable over time
3. API response times are under 500ms for 95th percentile
4. Platform handles 10,000+ resources without degradation
5. All critical and high-severity bugs are resolved

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| UAT feedback requires significant rework | High | Time-box UAT; prioritize critical fixes; defer non-critical items |
| Performance issues with large datasets | Medium | Load test early; implement pagination and lazy loading |
| Policy engine complexity | Medium | Start with simple rule evaluation; iterate based on feedback |

### Deliverables

- Policy engine with declarative policy definitions
- Compliance evaluation and scoring
- Remediation guidance linked to findings
- Performance-optimized platform
- Complete documentation (user guide, API docs, runbooks)
- Production-ready deployment

---

## Sprint Velocity Tracking

| Sprint | Planned SP | Completed SP | Velocity | Notes |
|--------|-----------|-------------|----------|-------|
| Sprint 0 | 21 | - | - | Infrastructure setup |
| Sprint 1 | 21 | - | - | Identity implementation |
| Sprint 2 | 21 | - | - | Discovery implementation |
| Sprint 3 | 24 | - | - | Validation core |
| Sprint 4 | 21 | - | - | AI & reporting |
| Sprint 5 | 21 | - | - | Governance & polish |
| **Total** | **129** | **-** | **-** | |

## Risk Register

| Risk ID | Risk Description | Probability | Impact | Mitigation | Owner |
|---------|-----------------|-------------|--------|------------|-------|
| R01 | Azure quota limits delay infrastructure provisioning | Low | High | Request quota increases early; use alternative regions | DevOps |
| R02 | Entra ID configuration complexity | Medium | High | Leverage templates; involve identity team | Backend Lead |
| R03 | ARM API rate limits during large scans | High | Medium | Exponential backoff; parallel throttling | Backend |
| R04 | AI token costs exceed budget | Medium | Medium | Implement caching; track usage; limit scope | AI Lead |
| R05 | UAT feedback requires major rework | Medium | High | Time-box UAT; prioritize critical fixes | Product Owner |
| R06 | Performance issues with large inventories | Medium | High | Load test early; implement pagination | Full Team |
| R07 | Team member availability during 20-week timeline | Low | High | Cross-train team; maintain bus factor > 1 | Scrum Master |
