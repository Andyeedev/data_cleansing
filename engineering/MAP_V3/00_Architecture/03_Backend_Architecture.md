MAP Nexus™ Enterprise Platform
Backend Architecture

Version: 2.0

Document: 03_Backend_Architecture.md

Status: Draft 1.0

Classification: Internal Architecture

Purpose

This document defines the backend architecture of the MAP Nexus™ Enterprise Platform.

The backend provides all business services required by the Portal through a secure API-first architecture.

It encapsulates business logic, validation, governance, reporting, security, orchestration and AI integration while isolating the Portal from implementation details.

This document defines the logical architecture only.

Backend Vision

The backend shall operate as a collection of independent business services that communicate through published interfaces.

Each service shall own its business capability while remaining loosely coupled to other services.

The backend shall support future cloud-native deployment and horizontal scaling.

Architectural Principles

The backend follows these principles.

API First

Every business capability is exposed through REST APIs.

The Portal never communicates directly with the database.

Service Ownership

Each business capability owns its logic.

Services never manipulate another service's internal data directly.

Stateless Processing

Business services remain stateless wherever practical.

Persistent state resides within the repository layer.

Independent Deployment

Services shall be deployable independently in future enterprise deployments.

Reusable Business Logic

Business logic shall exist only once.

It must never be duplicated across services.

Backend Layers
Presentation Layer (Portal)

↓

REST API Layer

↓

Business Services

↓

Core Engine

↓

Repository Layer

↓

PostgreSQL
Business Domains

The backend is organised around business capabilities.

Operations Domain

Responsible for migration execution support.

Includes:

Migration Services
Validation Services
Data Quality Services

Purpose:

Provide operational visibility throughout migration activities.

Governance Domain

Responsible for governance and compliance.

Includes:

Governance Services
Risk Services
Audit Services

Purpose:

Ensure migration control and regulatory compliance.

Insights Domain

Responsible for information delivery.

Includes:

Reporting Services
Dashboard Services
Analytics Services
MAP Copilot Services

Purpose:

Transform validated data into business intelligence.

Platform Domain

Responsible for platform management.

Includes:

Authentication
User Management
Administration
Configuration
Notification

Purpose:

Operate the platform securely.

Backend Service Catalogue
Migration Service

Responsibilities

Migration metadata
Programme tracking
Milestones
Status
Validation Service

Responsibilities

Validation execution
Rule processing
Exceptions
Results

Uses the existing MAP Engine.

Data Quality Service

Responsibilities

Completeness
Accuracy
Consistency
Duplicate analysis
Governance Service

Responsibilities

Issues
Approvals
Exceptions
Audit trail
Risk Service

Responsibilities

Risk assessment
Readiness scoring
Heat maps
Risk trends
Reporting Service

Responsibilities

Executive reports
Operational reports
Technical reports
Scheduled reports
Dashboard Service

Responsibilities

Prepare dashboard-ready datasets.

The Dashboard Service never renders HTML.

Rendering belongs to the Portal.

MAP Copilot Service

Responsibilities

Prompt orchestration
Context retrieval
AI provider routing
Response formatting

The service is provider-independent.

Notification Service

Responsibilities

Alerts
Emails
Teams notifications (future)
Scheduled reminders
Administration Service

Responsibilities

Users
Roles
Configuration
Licensing (future)
Tenant management
Service Communication

Services communicate using REST APIs.

Future support may include event-driven messaging where beneficial.

Direct database sharing between services is prohibited.

Request Flow
Portal

↓

REST API

↓

Business Service

↓

Core Engine

↓

Repository

↓

PostgreSQL

↓

Response

↓

Portal
Existing MAP Engine

The existing validation engine becomes a core backend service.

It is not rewritten.

It is encapsulated within the backend architecture.

Responsibilities remain:

Rule execution
Metadata validation
Schema comparison
Business validation
Reconciliation

The backend extends the engine rather than replacing it.

Error Handling

All services shall return standardised responses.

Responses include:

Success
Warning
Validation Error
Business Error
System Error

Internal implementation details must never be exposed.

Logging

Backend services generate:

Audit logs
Diagnostic logs
Security logs
Performance metrics

Future integration with Azure Monitor is supported.

Security

The backend does not authenticate users directly.

Authentication is delegated to the Authentication Service.

Every request is authorised before business processing begins.

Scalability

The backend is designed for horizontal scaling.

Business services may be deployed independently based on workload.

Stateless services enable elastic scaling in Azure.

Future Enhancements

Future backend capabilities include:

Event Bus
Workflow Engine
Integration Framework
Partner Extensions
Marketplace Services
Background Job Processing
Success Criteria

The backend architecture is complete when:

Business domains are defined.
Service responsibilities are isolated.
Existing MAP Engine is incorporated.
API-first communication is established.
Backend services remain modular.
Future cloud deployment is supported.
Related Documents
00_Master_Roadmap.md
01_Product_Architecture.md
02_Portal_Architecture.md
04_API_Architecture.md
05_Database_Architecture.md
06_AI_Architecture.md
07_Reporting_Architecture.md
08_Security_Architecture.md
09_Deployment_Architecture.md
10_Implementation_Roadmap.md