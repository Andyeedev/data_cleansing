# MAP MVP Build Specification - User Story Catalogue

**Document:** MAP MVP User Story Catalogue
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Story Catalogue Summary

| Epic | Stories | Total SP |
|------|---------|----------|
| E01: Foundation & Infrastructure | 6 | 21 |
| E02: Identity & Authentication | 5 | 21 |
| E03: Discovery & Inventory | 5 | 21 |
| E04: Validation Engine | 6 | 24 |
| E05: AI Insights | 5 | 17 |
| E06: Reporting & Dashboards | 5 | 18 |
| E07: Governance & Compliance | 4 | 13 |
| E08: Operations & Monitoring | 4 | 14 |
| **Total** | **40** | **149** |

---

## E01: Foundation & Infrastructure

### US-001: Azure Infrastructure Provisioning

**Epic:** E01 - Foundation & Infrastructure
**Description:** As a DevOps engineer, I want Azure infrastructure provisioned via Bicep templates so that environments are repeatable, consistent, and auditable.
**Priority:** P0
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. Bicep templates provision Container Apps, SQL MI, Redis, Key Vault, and Container Registry
2. `azd up` provisions a complete dev environment in under 15 minutes
3. All resources are tagged with environment, project, and cost center labels
4. Template parameters allow environment-specific customization (dev/staging/prod)
5. Infrastructure provisioning is idempotent and can be re-run safely

**Business Rules:**
- All resources must be provisioned in the same Azure region
- Key Vault must use soft delete and purge protection
- SQL MI must be configured with managed identity authentication
- Container Apps must be deployed to a VNET with private endpoints

**Dependencies:** None

**Definition of Done:**
- [ ] Bicep templates validated and tested
- [ ] Dev environment successfully provisioned
- [ ] Infrastructure documentation updated
- [ ] Cost estimates reviewed and approved

---

### US-002: CI/CD Pipeline Setup

**Epic:** E01 - Foundation & Infrastructure
**Description:** As a developer, I want a CI/CD pipeline that builds, tests, and deploys on every push to main so that I can validate changes immediately.
**Priority:** P0
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. GitHub Actions workflow builds .NET and React projects on every push
2. Unit tests execute automatically and report results
3. Build artifacts are published to Azure Container Registry
4. Successful builds deploy to dev environment automatically
5. Pipeline completes in under 8 minutes

**Business Rules:**
- Pipeline must run on Windows runners for .NET compatibility
- Build must fail if any unit test fails
- Deployments must use blue-green strategy for zero downtime
- Pipeline must cache NuGet packages and npm dependencies

**Dependencies:** US-001

**Definition of Done:**
- [ ] GitHub Actions workflow configured and tested
- [ ] Build, test, and deploy stages operational
- [ ] Pipeline documentation updated
- [ ] Team trained on pipeline usage

---

### US-003: Backend API Scaffolding

**Epic:** E01 - Foundation & Infrastructure
**Description:** As a developer, I want the .NET 8 API project scaffolded with health checks, dependency injection, and logging so that I can begin feature development immediately.
**Priority:** P0
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. .NET 8 Web API project compiles and runs with `dotnet run`
2. Health check endpoints return status for database, cache, and custom dependencies
3. Dependency injection container is configured with service lifetimes
4. Structured logging is configured with Serilog
5. Swagger/OpenAPI documentation is available in dev environment

**Business Rules:**
- Use top-level statements for Program.cs
- Configure nullable reference types globally
- Use ASP.NET Core minimal APIs for simple endpoints
- Follow REST naming conventions for endpoints

**Dependencies:** None

**Definition of Done:**
- [ ] Project compiles and runs
- [ ] Health checks operational
- [ ] Logging configured and tested
- [ ] Swagger UI accessible

---

### US-004: Frontend Project Scaffolding

**Epic:** E01 - Foundation & Infrastructure
**Description:** As a developer, I want the React 18 frontend project scaffolded with TypeScript, Vite, Fluent UI, and routing so that I can begin UI development immediately.
**Priority:** P0
**Complexity:** Low
**Story Points:** 3

**Acceptance Criteria:**
1. Vite + React 18 + TypeScript project compiles and runs with `npm run dev`
2. Fluent UI theme is configured with MAP brand colors
3. React Router is configured with placeholder routes
4. API client service layer is set up with Axios and interceptors
5. ESLint and Prettier are configured with consistent rules

**Business Rules:**
- Use functional components with hooks exclusively
- Use TypeScript strict mode
- Organize code by feature, not by file type
- All components must have TypeScript prop types

**Dependencies:** None

**Definition of Done:**
- [ ] Project compiles and runs
- [ ] Routing functional
- [ ] Styling applied
- [ ] Linting passes

---

### US-005: Database Provisioning and Migrations

**Epic:** E01 - Foundation & Infrastructure
**Description:** As a DBA, I want Azure SQL MI provisioned with Entity Framework Core migrations applied so that the data layer is ready for development.
**Priority:** P0
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. Azure SQL MI is provisioned with managed identity authentication
2. EF Core migrations create all initial tables (Tenants, Users, Resources, Findings)
3. Database seeding script creates default admin tenant and user
4. Connection string is retrieved from Key Vault at runtime
5. Migration scripts are versioned and can be applied to any environment

**Business Rules:**
- Use EF Core Code First with migrations
- All tables must have tenant_id column for multi-tenancy
- Use UUID for primary keys
- Include created_at and updated_at timestamps on all tables
- Enable audit logging for all data changes

**Dependencies:** US-001

**Definition of Done:**
- [ ] SQL MI provisioned and accessible
- [ ] Migrations applied successfully
- [ ] Seed data created
- [ ] Connection string configured in Key Vault

---

### US-006: Development Environment Documentation

**Epic:** E01 - Foundation & Infrastructure
**Description:** As a developer, I want comprehensive development environment documentation so that new team members can onboard quickly and existing members can reference setup procedures.
**Priority:** P1
**Complexity:** Low
**Story Points:** 2

**Acceptance Criteria:**
1. README.md includes prerequisites, setup instructions, and troubleshooting
2. Architecture diagram shows component relationships
3. API documentation is auto-generated and published
4. Contributing guide covers code standards, PR process, and review checklist
5. Environment variable reference is complete and up-to-date

**Business Rules:**
- Documentation must be maintained with code changes
- Use Mermaid for architecture diagrams
- Include screenshots for UI setup steps
- Provide estimated time for onboarding (target: < 2 hours)

**Dependencies:** US-001, US-002, US-003, US-004, US-005

**Definition of Done:**
- [ ] Documentation complete
- [ ] New team member can onboard using documentation only
- [ ] Documentation reviewed and approved
- [ ] Published to repository docs folder

---

## E02: Identity & Authentication

### US-007: Microsoft Entra ID SSO Integration

**Epic:** E02 - Identity & Authentication
**Description:** As a user, I want to sign in with my corporate Microsoft account using single sign-on so that I don't need separate credentials for MAP.
**Priority:** P0
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. User is redirected to Microsoft Entra ID login page on app access
2. After successful authentication, user receives JWT token with claims
3. JWT token contains user identity, tenant ID, and role assignments
4. Token refresh occurs automatically before expiration
5. Logout clears tokens and redirects to login page

**Business Rules:**
- Use Authorization Code Flow with PKCE for SPA authentication
- Tokens must be stored securely (httpOnly cookies or in-memory)
- Session timeout matches organizational policy (configurable)
- Multi-factor authentication is enforced by Entra ID policy

**Dependencies:** US-003, US-004

**Definition of Done:**
- [ ] Entra ID app registration configured
- [ ] OAuth flow implemented and tested
- [ ] JWT token validation working
- [ ] Session management functional

---

### US-008: Tenant and User Management

**Epic:** E02 - Identity & Authentication
**Description:** As an admin, I want to manage tenant users and roles through an admin portal so that I can control access to the platform.
**Priority:** P0
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Admin can view list of users in their tenant
2. Admin can invite new users by email address
3. Admin can assign roles (Admin, Migration Lead, Contributor, Viewer) to users
4. Admin can deactivate users and revoke access
5. User changes are reflected within 5 minutes across the platform

**Business Rules:**
- Only users with Admin role can manage users
- User invitations are sent via email through Entra ID
- Deactivated users are not deleted (audit trail)
- Maximum 100 users per tenant in MVP (scalability path planned)

**Dependencies:** US-007

**Definition of Done:**
- [ ] User list API and UI functional
- [ ] Invite flow working end-to-end
- [ ] Role assignment enforced
- [ ] Audit logging for user management actions

---

### US-009: Multi-Tenant Data Isolation

**Epic:** E02 - Identity & Authentication
**Description:** As a developer, I want tenant-scoped data isolation enforced at the data layer so that customer data is never cross-accessed between tenants.
**Priority:** P0
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. All database queries automatically filter by tenant_id
2. API endpoints cannot access data from other tenants
3. Background jobs run within tenant context
4. Cross-tenant data access attempts are logged and blocked
5. Data isolation is verified by integration tests

**Business Rules:**
- Use EF Core global query filters for tenant scoping
- Tenant context is extracted from JWT token claims
- Shared infrastructure (database) with row-level isolation
- Tenant data cannot be exported across tenant boundaries

**Dependencies:** US-005, US-007

**Definition of Done:**
- [ ] Query filters implemented and tested
- [ ] Cross-tenant isolation verified
- [ ] Integration tests pass
- [ ] Security review completed

---

### US-010: Session Management and Token Refresh

**Epic:** E02 - Identity & Authentication
**Description:** As a user, I want my session to persist across browser tabs and refresh automatically so that I don't need to re-authenticate frequently.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. Session persists across browser tabs using shared token storage
2. Access token refreshes automatically before expiration
3. Refresh token rotation occurs on each refresh
4. Session expires after configurable idle timeout (default: 30 minutes)
5. Concurrent session limit is configurable (default: 5)

**Business Rules:**
- Access token lifetime: 1 hour
- Refresh token lifetime: 24 hours
- Idle timeout: 30 minutes (configurable)
- Token refresh uses silent iframe when possible

**Dependencies:** US-007

**Definition of Done:**
- [ ] Session persistence working
- [ ] Token refresh functional
- [ ] Idle timeout enforced
- [ ] Session limit enforced

---

### US-011: Custom Role Definitions

**Epic:** E02 - Identity & Authentication
**Description:** As an admin, I want to define custom roles with specific permissions so that I can match my organization's access model.
**Priority:** P2
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. Admin can create custom roles with selected permissions
2. Custom roles appear in role assignment dropdown
3. Custom role permissions are enforced at API level
4. Custom roles can be edited and deleted
5. Maximum 20 custom roles per tenant

**Business Rules:**
- Custom roles cannot grant permissions not in the base permission set
- Role names must be unique within a tenant
- Deleting a role removes it from all assigned users
- Built-in roles cannot be modified or deleted

**Dependencies:** US-008

**Definition of Done:**
- [ ] Custom role CRUD API and UI functional
- [ ] Custom role permissions enforced
- [ ] Role limits enforced
- [ ] Audit logging for role changes

---

## E03: Discovery & Inventory

### US-012: Azure Subscription Connection

**Epic:** E03 - Discovery & Inventory
**Description:** As a migration lead, I want to connect Azure subscriptions to MAP using service principal credentials so that I can discover resources to migrate.
**Priority:** P0
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. User can enter subscription ID and service principal credentials
2. Platform validates credentials and tests Azure Resource Manager access
3. Service principal credentials are stored securely in Key Vault
4. Multiple subscriptions can be connected per tenant
5. Connection status is displayed with last scan timestamp

**Business Rules:**
- Service principal must have Reader role on subscription
- Credentials are encrypted at rest using Key Vault
- Connection can be removed (with confirmation)
- Platform validates subscription access on each scan

**Dependencies:** US-005, US-007

**Definition of Done:**
- [ ] Subscription connection flow working
- [ ] Credentials stored securely
- [ ] Connection validation functional
- [ ] Multiple subscription support verified

---

### US-013: Resource Inventory Display

**Epic:** E03 - Discovery & Inventory
**Description:** As a user, I want to see a complete, browsable resource inventory so that I understand all Azure resources in my environment.
**Priority:** P0
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Resource inventory shows all discovered resources with key properties
2. Resources are grouped by resource group and subscription
3. Resource type icons and status are displayed
4. Resource detail view shows all ARM properties
5. Inventory loads within 3 seconds for 10,000 resources

**Business Rules:**
- Display resource name, type, status, location, and resource group
- Show resource-specific properties (VM size, SKU, etc.)
- Highlight resources with validation findings
- Support infinite scroll for large inventories

**Dependencies:** US-012

**Definition of Done:**
- [ ] Resource list and detail views functional
- [ ] Performance meets requirements
- [ ] Resource types correctly displayed
- [ ] UI responsive and accessible

---

### US-014: Dependency Mapping

**Epic:** E03 - Discovery & Inventory
**Description:** As a user, I want to see resource dependencies mapped visually so that I understand migration complexity and ordering requirements.
**Priority:** P1
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. Dependency graph shows direct relationships between resources
2. Graph is interactive (zoom, pan, click for details)
3. Dependent resources are highlighted in red
4. Dependency depth is configurable (1-5 levels)
5. Graph exports as PNG or SVG

**Business Rules:**
- Use D3.js or similar for graph visualization
- Dependencies include both ARM dependencies and custom mappings
- Circular dependencies are detected and flagged
- Graph layout is automatic (force-directed or hierarchical)

**Dependencies:** US-013

**Definition of Done:**
- [ ] Dependency graph rendering correctly
- [ ] Interaction and navigation functional
- [ ] Export working
- [ ] Performance acceptable for 500+ resource graphs

---

### US-015: Inventory Search and Filtering

**Epic:** E03 - Discovery & Inventory
**Description:** As a user, I want to search and filter the resource inventory so that I can find specific resources quickly.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. Full-text search returns results within 1 second
2. Filters available for resource type, location, status, resource group
3. Multiple filters can be combined (AND logic)
4. Search highlights matching text in results
5. Filter state is preserved across navigation

**Business Rules:**
- Search indexes resource name, type, and tags
- Filters are combinable and removable
- Search supports wildcards (* for any characters)
- Recent searches are saved per user

**Dependencies:** US-013

**Definition of Done:**
- [ ] Search functionality working
- [ ] Filters functional and combinable
- [ ] Performance meets requirements
- [ ] Search UX intuitive and responsive

---

### US-016: Inventory Export to Excel

**Epic:** E03 - Discovery & Inventory
**Description:** As a user, I want to export the resource inventory to Excel so that I can share it with my team and perform offline analysis.
**Priority:** P2
**Complexity:** Low
**Story Points:** 3

**Acceptance Criteria:**
1. Export includes all resources with selected properties
2. Excel file is formatted with headers, filters, and conditional formatting
3. Export respects current search filters
4. Export completes within 30 seconds for 10,000 resources
5. Download link expires after 24 hours

**Business Rules:**
- Export is generated as background job for large datasets
- User is notified when export is ready for download
- Export includes timestamp and user information
- Maximum export size: 100,000 resources

**Dependencies:** US-013, US-015

**Definition of Done:**
- [ ] Export generates valid Excel file
- [ ] All resource properties included
- [ ] Export respects filters
- [ ] Download link secure and expiring

---

## E04: Validation Engine

### US-017: Validation Check Execution

**Epic:** E04 - Validation Engine
**Description:** As a migration lead, I want to run validation checks against my discovered resources so that I can identify migration risks before they become issues.
**Priority:** P0
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. User can select which check suites to run (network, security, performance, cost)
2. Validation runs execute against all discovered resources
3. Progress is displayed during validation execution
4. Results are available within 10 minutes for 5,000 resources
5. Validation runs can be triggered manually or on schedule

**Business Rules:**
- Validation runs are recorded with timestamp, user, and parameters
- Running validation displays real-time progress
- Only one validation run can execute per tenant at a time
- Validation results are stored permanently for history

**Dependencies:** US-013, US-007

**Definition of Done:**
- [ ] Check execution engine functional
- [ ] Check suites selectable and configurable
- [ ] Progress indicators working
- [ ] Results stored and accessible

---

### US-018: Findings Management

**Epic:** E04 - Validation Engine
**Description:** As a user, I want to see validation findings categorized by severity so that I can prioritize remediation efforts.
**Priority:** P0
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Findings are displayed with severity (Critical, High, Medium, Low, Info)
2. Findings can be sorted by severity, resource, check name, and date
3. Finding detail shows full description, affected resource, and remediation steps
4. Findings can be filtered by severity, status, resource type, and resource group
5. Finding count and severity distribution are shown in summary

**Business Rules:**
- Severity is determined by check type and impact assessment
- Findings include unique ID, title, description, and remediation guidance
- Finding status tracks lifecycle: Open → In Progress → Resolved/Dismissed
- Findings are linked to the validation run that created them

**Dependencies:** US-017

**Definition of Done:**
- [ ] Findings list and detail views functional
- [ ] Severity classification correct
- [ ] Filtering and sorting working
- [ ] Summary statistics accurate

---

### US-019: Health Score Calculation

**Epic:** E04 - Validation Engine
**Description:** As a user, I want to see health scores for my environment so that I can understand overall migration readiness at a glance.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Health scores are calculated for each resource, resource group, and subscription
2. Scores range from 0-100 with color-coded status (Green/Yellow/Red)
3. Scores are weighted by finding severity (Critical findings reduce score more)
4. Score trends are tracked over time with history chart
5. Score calculation is transparent (formula available to user)

**Business Rules:**
- Score formula: 100 - (weighted sum of finding severities)
- Weight: Critical=10, High=5, Medium=2, Low=1, Info=0
- Minimum score: 0, Maximum score: 100
- Score updates when findings change status
- Score thresholds: Green (80-100), Yellow (50-79), Red (0-49)

**Dependencies:** US-018

**Definition of Done:**
- [ ] Scoring algorithm implemented
- [ ] Scores calculated and displayed
- [ ] Score history tracked
- [ ] Score thresholds and colors correct

---

### US-020: Finding Status Tracking

**Epic:** E04 - Validation Engine
**Description:** As a user, I want to track finding status and add comments so that I can manage remediation progress across my team.
**Priority:** P1
**Complexity:** Low
**Story Points:** 3

**Acceptance Criteria:**
1. Finding status can be updated (Open, In Progress, Resolved, Dismissed)
2. Comments can be added to findings with timestamp and author
3. Status changes are logged in finding history
4. Dismissed findings can be restored to Open status
5. Bulk status update is supported for multiple findings

**Business Rules:**
- Only users with Contributor or Admin role can change status
- Dismissed findings require a reason (dropdown + free text)
- Resolved findings require verification before closure
- All status changes are audit logged

**Dependencies:** US-018

**Definition of Done:**
- [ ] Status update functional
- [ ] Comments system working
- [ ] History tracking accurate
- [ ] Bulk update working

---

### US-021: Validation Run History

**Epic:** E04 - Validation Engine
**Description:** As a user, I want to view validation run history so that I can track improvement over time and compare results.
**Priority:** P1
**Complexity:** Low
**Story Points:** 3

**Acceptance Criteria:**
1. List of all validation runs with date, duration, and summary
2. Run detail shows all findings from that specific run
3. Comparison view shows score and finding changes between runs
4. Runs can be filtered by date range and status
5. Historical data is retained for 12 months

**Business Rules:**
- Each run has unique ID and timestamp
- Run summary includes finding count by severity and health score
- Comparison highlights new, resolved, and unchanged findings
- Runs cannot be deleted (audit trail)

**Dependencies:** US-017, US-019

**Definition of Done:**
- [ ] Run history list functional
- [ ] Run detail view working
- [ ] Comparison view accurate
- [ ] Data retention policy implemented

---

### US-022: Custom Check Creation

**Epic:** E04 - Validation Engine
**Description:** As a developer, I want to create custom validation checks so that I can extend MAP validation capabilities for specific requirements.
**Priority:** P2
**Complexity:** High
**Story Points:** 3

**Acceptance Criteria:**
1. Custom checks can be defined using a JSON schema
2. Custom checks are validated before deployment
3. Custom checks appear alongside built-in checks in validation runs
4. Custom check results are indistinguishable from built-in checks
5. Custom checks can be shared across tenants

**Business Rules:**
- Custom checks must define: name, description, severity, resource types, logic
- Custom checks are versioned (v1, v2, etc.)
- Maximum 50 custom checks per tenant
- Custom checks are sandboxed (no external API calls)

**Dependencies:** US-017

**Definition of Done:**
- [ ] Check definition schema published
- [ ] Check validation working
- [ ] Custom checks execute in validation runs
- [ ] Check versioning functional

---

## E05: AI Insights

### US-023: AI-Powered Finding Explanations

**Epic:** E05 - AI Insights
**Description:** As a migration lead, I want AI-generated insights for each validation finding so that I understand the business impact and recommended mitigation strategies.
**Priority:** P1
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. Each finding has an AI-generated explanation accessible via button click
2. Explanation includes risk description, impact assessment, and mitigation steps
3. AI response includes confidence score (High, Medium, Low)
4. AI explanations are cached to reduce token consumption
5. Users can provide feedback on AI explanation quality (thumbs up/down)

**Business Rules:**
- AI explanations are generated on-demand (not pre-generated)
- Responses are cached for 24 hours per finding
- Token usage is tracked per tenant with configurable limits
- Low-confidence responses are flagged for human review

**Dependencies:** US-018, US-007

**Definition of Done:**
- [ ] Azure OpenAI integration working
- [ ] Finding explanations generated correctly
- [ ] Caching implemented
- [ ] Feedback mechanism functional

---

### US-024: Migration Effort Estimation

**Epic:** E05 - AI Insights
**Description:** As a user, I want AI-generated migration effort estimates so that I can plan timelines, resources, and budgets accurately.
**Priority:** P1
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. Effort estimates are provided per resource and per resource group
2. Estimates include person-hours, complexity level, and recommended team size
3. Estimates consider dependencies, resource types, and validation findings
4. Estimates include confidence interval (low, medium, high range)
5. Estimates can be exported to project planning tools

**Business Rules:**
- Estimates are based on historical migration data and AI analysis
- Confidence intervals are provided (±20% for high, ±40% for low)
- Estimates update when findings or dependencies change
- Estimates are not binding commitments (disclaimer included)

**Dependencies:** US-019, US-014, US-023

**Definition of Done:**
- [ ] Effort estimation algorithm implemented
- [ ] Estimates displayed per resource and group
- [ ] Confidence intervals accurate
- [ ] Export functionality working

---

### US-025: AI Insights Dashboard

**Epic:** E05 - AI Insights
**Description:** As a user, I want a dedicated AI insights dashboard so that I can view AI-generated recommendations, risk summaries, and optimization suggestions in one place.
**Priority:** P2
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. Dashboard displays AI-generated risk summary for entire environment
2. Top 10 migration risks are highlighted with mitigation recommendations
3. Cost optimization opportunities are listed with estimated savings
4. Dashboard refreshes data every 15 minutes
5. Insights can be filtered by resource type and severity

**Business Rules:**
- AI insights are generated from aggregated validation findings
- Cost estimates use Azure Pricing API for accuracy
- Insights are cached and regenerated on validation run completion
- Dashboard is read-only (no editing of AI suggestions)

**Dependencies:** US-023, US-019

**Definition of Done:**
- [ ] Dashboard layout implemented
- [ ] Risk summary functional
- [ ] Cost optimization displayed
- [ ] Filtering working

---

### US-026: Prompt Template Management

**Epic:** E05 - AI Insights
**Description:** As an admin, I want to manage AI prompt templates so that I can customize and optimize AI responses for my specific migration scenarios.
**Priority:** P2
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. Prompt templates are stored as versioned JSON files
2. Admin can edit prompt templates through the UI
3. Prompt changes take effect immediately (no redeployment needed)
4. Prompt versions are tracked with change history
5. Prompt testing capability allows previewing responses

**Business Rules:**
- Prompt templates must include placeholder variables for resource context
- Template syntax is validated before saving
- Maximum 100 prompt templates per tenant
- Templates are scoped to resource types (VM, SQL, App Service, etc.)

**Dependencies:** US-023

**Definition of Done:**
- [ ] Template storage and retrieval working
- [ ] Template editor functional
- [ ] Versioning implemented
- [ ] Testing capability available

---

### US-027: AI Cost Tracking and Limits

**Epic:** E05 - AI Insights
**Description:** As an admin, I want to track AI token usage and set spending limits so that I can control costs and avoid unexpected charges.
**Priority:** P2
**Complexity:** Low
**Story Points:** 1

**Acceptance Criteria:**
1. Token usage is tracked per tenant per day
2. Usage dashboard shows current month consumption and cost
3. Configurable spending limit per tenant (default: $500/month)
4. Alert notification when usage reaches 80% and 100% of limit
5. AI features are disabled when limit is reached

**Business Rules:**
- Usage data is updated in near-real-time (5-minute lag)
- Limit alerts sent via email to tenant admins
- Usage history retained for 12 months
- Admin can request limit increase through support

**Dependencies:** US-023, US-008

**Definition of Done:**
- [ ] Usage tracking implemented
- [ ] Dashboard displaying current usage
- [ ] Limits enforced
- [ ] Alerts functional

---

## E06: Reporting & Dashboards

### US-028: Executive Summary Dashboard

**Epic:** E06 - Reporting & Dashboards
**Description:** As an executive, I want a real-time dashboard showing migration readiness at a glance so that I can monitor progress without diving into details.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Dashboard displays overall health score with trend chart
2. Key metrics visible: total resources, findings by severity, compliance %
3. Dashboard loads within 3 seconds
4. Data refreshes in real-time (WebSocket or polling)
5. Dashboard is responsive and works on mobile devices

**Business Rules:**
- Dashboard shows data for connected subscriptions only
- Metrics are calculated from latest validation run
- Trend chart shows last 30 days of data
- Dashboard supports multiple time ranges (7d, 30d, 90d)

**Dependencies:** US-019, US-007

**Definition of Done:**
- [ ] Dashboard layout implemented
- [ ] Real-time data updates working
- [ ] Mobile responsive
- [ ] Performance meets requirements

---

### US-029: Detailed Findings Report

**Epic:** E06 - Reporting & Dashboards
**Description:** As a user, I want a detailed findings report that includes all validation results, resource details, and dependency information so that I can perform in-depth analysis.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Report includes all findings with full detail and remediation steps
2. Report includes resource inventory with properties
3. Report includes dependency graph visualization
4. Report is filterable and searchable
5. Report can be generated for specific time periods

**Business Rules:**
- Reports are generated as background jobs
- Large reports (>1000 findings) are paginated
- Report includes table of contents and summary section
- Report data is point-in-time (snapshots at generation time)

**Dependencies:** US-018, US-014

**Definition of Done:**
- [ ] Report generation working
- [ ] All sections included
- [ ] Filtering and search functional
- [ ] Background generation for large reports

---

### US-030: PDF Report Generation

**Epic:** E06 - Reporting & Dashboards
**Description:** As a user, I want to generate PDF reports so that I can share findings with stakeholders who don't have MAP access.
**Priority:** P2
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. PDF reports include executive summary, findings, and recommendations
2. PDF is formatted with MAP branding (logo, colors, headers)
3. PDF includes charts and graphs for visual summary
4. PDF generation completes within 30 seconds
5. PDF is downloadable and shareable

**Business Rules:**
- PDF uses QuestPDF or similar library for generation
- PDF includes page numbers, table of contents, and bookmarks
- PDF is accessible (screen reader compatible)
- PDF includes generation date and data snapshot timestamp

**Dependencies:** US-029

**Definition of Done:**
- [ ] PDF generation working
- [ ] Branding applied correctly
- [ ] Charts and graphs included
- [ ] Download functionality working

---

### US-031: Scheduled Report Delivery

**Epic:** E06 - Reporting & Dashboards
**Description:** As a user, I want to schedule automatic report generation and email delivery so that I receive regular updates without manual effort.
**Priority:** P2
**Complexity:** Low
**Story Points:** 3

**Acceptance Criteria:**
1. User can schedule reports (daily, weekly, monthly)
2. Reports are generated at scheduled time and emailed to recipients
3. Email includes report summary and download link
4. Schedule can be modified or cancelled
5. Failed report deliveries are logged and retried

**Business Rules:**
- Reports are generated using Azure Functions timer triggers
- Email delivery uses Azure Communication Services or SendGrid
- Recipients can be internal or external (with tenant admin approval)
- Failed deliveries are retried 3 times before marking as failed

**Dependencies:** US-030

**Definition of Done:**
- [ ] Scheduling UI functional
- [ ] Report generation on schedule working
- [ ] Email delivery functional
- [ ] Retry logic working

---

### US-032: Dashboard Customization

**Epic:** E06 - Reporting & Dashboards
**Description:** As a user, I want to customize my dashboard layout and widgets so that I can focus on the metrics most important to my role.
**Priority:** P2
**Complexity:** Medium
**Story Points:** 2

**Acceptance Criteria:**
1. User can add, remove, and rearrange dashboard widgets
2. Widget library includes 10+ predefined widget types
3. Custom layout is saved per user
4. Dashboard reset option returns to default layout
5. Widgets load independently (no full page reload)

**Business Rules:**
- Widget types: Health Score, Finding Summary, Resource Count, Trend Chart, Top Risks, etc.
- Maximum 12 widgets per dashboard
- Widget sizes: Small (1x1), Medium (2x1), Large (2x2)
- Default layout is role-based (Executive vs. Technical)

**Dependencies:** US-028

**Definition of Done:**
- [ ] Widget library implemented
- [ ] Drag-and-drop layout working
- [ ] Layout persistence functional
- [ ] Default layouts defined

---

## E07: Governance & Compliance

### US-033: Policy Definition Engine

**Epic:** E07 - Governance & Compliance
**Description:** As a compliance officer, I want to define governance policies using a declarative language so that I can enforce organizational standards across all migrations.
**Priority:** P2
**Complexity:** High
**Story Points:** 5

**Acceptance Criteria:**
1. Policy definitions use JSON/YAML schema with clear syntax
2. Policies can target specific resource types and properties
3. Policy conditions support AND/OR/NOT logic
4. Policy definitions are validated before deployment
5. Maximum 100 policies per tenant

**Business Rules:**
- Policy schema is versioned and backward compatible
- Policies include: name, description, severity, target, conditions, remediation
- Built-in policies cover Azure best practices
- Custom policies cannot conflict with built-in policies

**Dependencies:** US-013, US-017

**Definition of Done:**
- [ ] Policy schema defined and documented
- [ ] Policy parser implemented
- [ ] Policy validation working
- [ ] Built-in policy library created

---

### US-034: Compliance Evaluation

**Epic:** E07 - Governance & Compliance
**Description:** As a user, I want compliance scores calculated against defined policies so that I understand regulatory and organizational readiness.
**Priority:** P2
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Compliance scores are calculated per resource, resource group, and subscription
2. Scores reflect policy violations weighted by severity
3. Compliance trends are tracked over time
4. Compliance report shows all policy violations with details
5. Compliance scores update after each validation run

**Business Rules:**
- Compliance score = 100 - (weighted policy violations / total applicable policies * 100)
- Compliance thresholds: Compliant (90-100%), Partial (70-89%), Non-Compliant (<70%)
- Compliance data is retained for 12 months
- Compliance reports can be exported to PDF

**Dependencies:** US-033, US-019

**Definition of Done:**
- [ ] Compliance scoring implemented
- [ ] Trend tracking working
- [ ] Compliance report functional
- [ ] Export capability working

---

### US-035: Remediation Guidance

**Epic:** E07 - Governance & Compliance
**Description:** As a user, I want non-compliant resources linked to specific remediation steps so that I know exactly how to fix compliance violations.
**Priority:** P2
**Complexity:** Medium
**Story Points:** 3

**Acceptance Criteria:**
1. Each policy violation links to remediation guidance
2. Remediation steps are specific and actionable
3. Remediation includes estimated effort and complexity
4. Remediation links to Azure documentation where available
5. Remediation progress can be tracked

**Business Rules:**
- Remediation guidance is curated and maintained by platform team
- Guidance includes step-by-step instructions
- Guidance includes PowerShell/CLI scripts where applicable
- Guidance is versioned and updated with policy changes

**Dependencies:** US-033, US-034

**Definition of Done:**
- [ ] Remediation guidance linked to all policies
- [ ] Guidance is actionable and accurate
- [ ] Azure documentation links working
- [ ] Progress tracking functional

---

### US-036: Compliance Reporting

**Epic:** E07 - Governance & Compliance
**Description:** As an admin, I want compliance reports generated for audit purposes so that I can demonstrate regulatory readiness to auditors.
**Priority:** P2
**Complexity:** Low
**Story Points:** 3

**Acceptance Criteria:**
1. Compliance report includes all policies and their compliance status
2. Report shows compliance history and trend analysis
3. Report includes detailed violation listing with remediation status
4. Report can be generated as PDF or Excel
5. Report includes digital signature for audit trail integrity

**Business Rules:**
- Reports are generated point-in-time (data snapshot)
- Reports include generation metadata (date, user, data range)
- Reports can be scheduled for regular generation
- Reports are stored for 7 years (regulatory requirement)

**Dependencies:** US-034, US-030

**Definition of Done:**
- [ ] Compliance report template created
- [ ] PDF and Excel export working
- [ ] Scheduling capability available
- [ ] Report storage and retrieval working

---

## E08: Operations & Monitoring

### US-037: Application Monitoring and Telemetry

**Epic:** E08 - Operations & Monitoring
**Description:** As an operations engineer, I want comprehensive application monitoring with Application Insights so that I can detect and diagnose issues proactively.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. All API requests are tracked with response time and status code
2. Dependencies (database, cache, external services) are monitored
3. Exceptions are captured with full stack traces
4. Custom business events are tracked (validation runs, AI calls)
5. Monitoring dashboard is accessible in Azure Portal

**Business Rules:**
- Application Insights is configured with connection string from Key Vault
- Telemetry includes correlation ID for distributed tracing
- Sampling rate is configurable (default: 20% in production)
- PII is never logged in telemetry

**Dependencies:** US-001

**Definition of Done:**
- [ ] Application Insights configured
- [ ] Request tracking working
- [ ] Dependency tracking working
- [ ] Exception capture functional
- [ ] Dashboard accessible

---

### US-038: Health Check System

**Epic:** E08 - Operations & Monitoring
**Description:** As an operations engineer, I want health check endpoints that validate all platform components so that I can detect service degradation immediately.
**Priority:** P1
**Complexity:** Low
**Story Points:** 3

**Acceptance Criteria:**
1. Health endpoint checks database connectivity
2. Health endpoint checks Redis cache availability
3. Health endpoint checks Azure OpenAI connectivity
4. Health status returns component-level detail (healthy/degraded/unhealthy)
5. Health checks run every 30 seconds and are logged

**Business Rules:**
- Health checks are lightweight (< 100ms total)
- Individual component timeouts: 5 seconds
- Health check results are cached for 30 seconds
- Unhealthy components trigger alerts

**Dependencies:** US-003

**Definition of Done:**
- [ ] Health check endpoints implemented
- [ ] Component checks working
- [ ] Health status accurate
- [ ] Alerting configured for unhealthy status

---

### US-039: Alerting and Notification System

**Epic:** E08 - Operations & Monitoring
**Description:** As an operations engineer, I want configurable alerting rules that notify the team of degraded performance or failures so that issues are addressed before customers are impacted.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. Alert rules are configurable for response time, error rate, and resource usage
2. Alerts are sent via email and Microsoft Teams webhook
3. Alert escalation rules notify management after 30 minutes
4. Alert history is retained for 90 days
5. Alert rules can be silenced during maintenance windows

**Business Rules:**
- Alert thresholds are configurable per metric
- Alert cooldown period: 5 minutes (prevent alert storms)
- Alert channels: Email, Teams, PagerDuty (future)
- Critical alerts page on-call engineer immediately

**Dependencies:** US-037, US-038

**Definition of Done:**
- [ ] Alert rules configured
- [ ] Email notifications working
- [ ] Teams webhook functional
- [ ] Alert history accessible
- [ ] Maintenance window silence working

---

### US-040: Audit Logging

**Epic:** E08 - Operations & Monitoring
**Description:** As an admin, I want comprehensive audit logging of all platform activities so that I can track user actions and meet compliance requirements.
**Priority:** P1
**Complexity:** Medium
**Story Points:** 5

**Acceptance Criteria:**
1. All API requests are logged with user, action, timestamp, and result
2. Data changes (create, update, delete) are logged with before/after values
3. Authentication events (login, logout, token refresh) are logged
4. Audit logs are searchable and filterable
5. Audit logs are retained for 2 years

**Business Rules:**
- Audit logs are immutable (append-only)
- Logs include correlation ID for request tracing
- PII is masked in audit logs (email, IP address)
- Audit log access requires Admin role

**Dependencies:** US-005, US-007

**Definition of Done:**
- [ ] Audit logging implemented
- [ ] All events captured
- [ ] Search and filter working
- [ ] Retention policy enforced
- [ ] Access control enforced
