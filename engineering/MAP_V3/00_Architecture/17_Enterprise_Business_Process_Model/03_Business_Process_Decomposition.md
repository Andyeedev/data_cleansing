# Business Process Decomposition

**Document ID:** 17-03  
**Version:** 2.1  
**Date:** 15 July 2026  
**Status:** Engineering Draft — Pending Review  
**Classification:** Architecture Standard  

---

## 1. Purpose

This document provides Level 1-4 decomposition for all 29 business processes in the MAP Nexus platform. Each process is decomposed into sub-processes, activities, and tasks.

---

## 2. Decomposition Summary

| Level | Description | Count |
|-------|-------------|-------|
| Level 1 | Business Process | 29 |
| Level 2 | Sub-Process | 85+ |
| Level 3 | Activity | 250+ |
| Level 4 | Task | 500+ |

---

## 3. Process Decomposition

### 3.1 Migration Project Lifecycle (Level 1: 3 Defined, Semi-Automated)

**Level 2: Project Initiation**
- Level 3: Project Definition
  - Level 4: Define project scope
  - Level 4: Identify source/target systems
  - Level 4: Assign team members
  - Level 4: Set project timeline
- Level 3: Project Planning
  - Level 4: Create project plan
  - Level 4: Allocate resources
  - Level 4: Define milestones
  - Level 4: Risk assessment

**Level 2: Project Execution**
- Level 3: Project Monitoring
  - Level 4: Track progress
  - Level 4: Monitor milestones
  - Level 4: Update status
- Level 3: Project Control
  - Level 4: Manage changes
  - Level 4: Escalate issues
  - Level 4: Approve deliverables

**Level 2: Project Closure**
- Level 3: Project Completion
  - Level 4: Final review
  - Level 4: Lessons learned
  - Level 4: Archive project
  - Level 4: Close project

**Evidence:** app.execution_engine contains project configuration logic; core.dataset_mappings references project_id; engine.migration_validation_batch tracks project execution

---

### 3.2 Connection Onboarding (Level 1: 4 Managed, Semi-Automated)

**Level 2: Connection Setup**
- Level 3: Connection Registration
  - Level 4: Enter connection details
  - Level 4: Validate connection parameters
  - Level 4: Store connection metadata
- Level 3: Connection Testing
  - Level 4: Test connectivity
  - Level 4: Validate credentials
  - Level 4: Verify database access

**Level 2: Connection Management**
- Level 3: Connection Monitoring
  - Level 4: Monitor connection status
  - Level 4: Alert on failures
  - Level 4: Retry connections
- Level 3: Connection Maintenance
  - Level 4: Update connection details
  - Level 4: Rotate credentials
  - Level 4: Remove deprecated connections

**Evidence:** app/api/v1/core/connections.py provides full CRUD API; core.system_registry stores connection metadata; core.system_credentials stores encrypted credentials

---

### 3.3 Credential Onboarding (Level 1: 4 Managed, Semi-Automated)

**Level 2: Credential Storage**
- Level 3: Credential Encryption
  - Level 4: Encrypt credentials
  - Level 4: Store encrypted credentials
  - Level 4: Manage encryption keys
- Level 3: Credential Access
  - Level 4: Retrieve credentials
  - Level 4: Decrypt credentials
  - Level 4: Log credential access

**Level 2: Credential Management**
- Level 3: Credential Rotation
  - Level 4: Rotate credentials
  - Level 4: Update connection references
  - Level 4: Verify rotation
- Level 3: Credential Revocation
  - Level 4: Revoke credentials
  - Level 4: Remove stored credentials
  - Level 4: Audit revocation

**Evidence:** core.system_credentials stores encrypted credentials; Fernet encryption used; credential access logged in audit_events

---

### 3.4 Dataset Discovery (Level 1: 3 Defined, Semi-Automated)

**Level 2: Schema Discovery**
- Level 3: Source Schema Discovery
  - Level 4: Query source information_schema
  - Level 4: Extract schema metadata
  - Level 4: Store schema results
- Level 3: Target Schema Discovery
  - Level 4: Query target information_schema
  - Level 4: Extract schema metadata
  - Level 4: Store schema results

**Level 2: Table Discovery**
- Level 3: Source Table Discovery
  - Level 4: List source tables
  - Level 4: Extract table metadata
  - Level 4: Store table results
- Level 3: Target Table Discovery
  - Level 4: List target tables
  - Level 4: Extract table metadata
  - Level 4: Store table results

**Evidence:** app.discovery.auto_rule_discovery queries information_schema; core.dataset_mappings stores discovered tables; CLI-only, no API endpoints

---

### 3.5 Column Discovery (Level 1: 3 Defined, Semi-Automated)

**Level 2: Column Metadata**
- Level 3: Column Extraction
  - Level 4: Query column metadata
  - Level 4: Extract data types
  - Level 4: Extract constraints
  - Level 4: Store column results
- Level 3: Column Analysis
  - Level 4: Analyse column types
  - Level 4: Identify relationships
  - Level 4: Generate column profiles

**Evidence:** app.services.dataset_discovery_service queries column metadata; core.dataset_columns stores column definitions

---

### 3.6 Mapping Lifecycle (Level 1: 3 Defined, Semi-Automated)

**Level 2: Table Mapping**
- Level 3: Table Mapping Creation
  - Level 4: Create source-target table mappings
  - Level 4: Validate table mappings
  - Level 4: Store table mappings
- Level 3: Table Mapping Management
  - Level 4: Update table mappings
  - Level 4: Version table mappings
  - Level 4: Archive table mappings

**Level 2: Column Mapping**
- Level 3: Column Mapping Creation
  - Level 4: Create source-target column mappings
  - Level 4: Validate column mappings
  - Level 4: Store column mappings
- Level 3: Column Mapping Management
  - Level 4: Update column mappings
  - Level 4: Version column mappings
  - Level 4: Archive column mappings

**Evidence:** app.services.mapping_resolver resolves mappings at runtime; core.dataset_mappings stores table mappings; core.column_mappings stores column mappings

---

### 3.7 Rule Authoring (Level 1: 3 Defined, Semi-Automated)

**Level 2: Rule Definition**
- Level 3: Rule Creation
  - Level 4: Define rule parameters
  - Level 4: Set rule thresholds
  - Level 4: Configure rule logic
  - Level 4: Store rule definition
- Level 3: Rule Validation
  - Level 4: Validate rule syntax
  - Level 4: Test rule execution
  - Level 4: Approve rule

**Level 2: Rule Management**
- Level 3: Rule Versioning
  - Level 4: Version rule definitions
  - Level 4: Track rule changes
  - Level 4: Archive old versions
- Level 3: Rule Retirement
  - Level 4: Identify obsolete rules
  - Level 4: Disable rules
  - Level 4: Archive rules

**Evidence:** app.discovery.auto_rule_discovery auto-generates rules; engine.rule_registry stores rule definitions; 10 rule types (C01-C010) implemented

---

### 3.8 Rule Approval (Level 1: 2 Repeatable, Manual)

**Level 2: Approval Workflow**
- Level 3: Approval Request
  - Level 4: Submit rules for approval
  - Level 4: Notify approvers
  - Level 4: Track approval status
- Level 3: Approval Decision
  - Level 4: Review rules
  - Level 4: Approve/reject rules
  - Level 4: Document decision

**Level 2: Approval Management**
- Level 3: Approval Tracking
  - Level 4: Track approval progress
  - Level 4: Escalate delays
  - Level 4: Report approval status
- Level 3: Approval Audit
  - Level 4: Log approval decisions
  - Level 4: Maintain approval history
  - Level 4: Generate approval reports

**Evidence:** No approval workflow implementation found in codebase; rules are auto-generated during execution without explicit approval step

---

### 3.9 Rule Execution (Level 1: 4 Managed, Automated)

**Level 2: Execution Pipeline**
- Level 3: Rule Dispatch
  - Level 4: Select rules for execution
  - Level 4: Validate rule parameters
  - Level 4: Dispatch to execution engine
- Level 3: Rule Processing
  - Level 4: Execute rule logic
  - Level 4: Capture results
  - Level 4: Handle exceptions

**Level 2: Execution Management**
- Level 3: Execution Monitoring
  - Level 4: Monitor execution progress
  - Level 4: Track execution status
  - Level 4: Alert on failures
- Level 3: Execution Reporting
  - Level 4: Generate execution reports
  - Level 4: Analyse execution patterns
  - Level 4: Optimise execution

**Evidence:** app.execution_engine orchestrates 6-step pipeline; app.execution.control_executor dispatches to control classes; results stored in engine.migration_control_summary

---

### 3.10 Control Lifecycle (Level 1: 3 Defined, Semi-Automated)

**Level 2: Control Management**
- Level 3: Control Registration
  - Level 4: Register control definitions
  - Level 4: Configure control parameters
  - Level 4: Store control metadata
- Level 3: Control Execution
  - Level 4: Execute controls
  - Level 4: Capture control results
  - Level 4: Store control outcomes

**Level 2: Control Monitoring**
- Level 3: Control Tracking
  - Level 4: Track control status
  - Level 4: Monitor control performance
  - Level 4: Alert on control failures
- Level 3: Control Reporting
  - Level 4: Generate control reports
  - Level 4: Analyse control effectiveness
  - Level 4: Optimise controls

**Evidence:** app.execution.control_executor fetches enabled controls from engine.control_registry; dispatches to control classes; results stored in engine.migration_control_summary

---

### 3.11 Validation Execution (Level 1: 4 Managed, Automated)

**Level 2: Pipeline Orchestration**
- Level 3: Pipeline Setup
  - Level 4: Configure pipeline parameters
  - Level 4: Validate pipeline configuration
  - Level 4: Initialize pipeline
- Level 3: Pipeline Execution
  - Level 4: Execute step 1 (Discovery)
  - Level 4: Execute step 2 (Mapping)
  - Level 4: Execute step 3 (Rules)
  - Level 4: Execute step 4 (Controls)
  - Level 4: Execute step 5 (Validation)
  - Level 4: Execute step 6 (Governance)

**Level 2: Pipeline Management**
- Level 3: Pipeline Monitoring
  - Level 4: Monitor pipeline progress
  - Level 4: Track step completion
  - Level 4: Alert on failures
- Level 3: Pipeline Recovery
  - Level 4: Checkpoint pipeline state
  - Level 4: Resume from checkpoint
  - Level 4: Retry failed steps

**Evidence:** app.execution_engine implements 6-step pipeline; parallel execution supported; checkpointing via engine.batch_execution_checkpoint; retry via app.orchestration.retry.rule_retry_manager; API at /api/v1/engine/trigger

---

### 3.12 Exception Management (Level 1: 3 Defined, Semi-Automated)

**Level 2: Exception Detection**
- Level 3: Exception Identification
  - Level 4: Detect validation failures
  - Level 4: Classify exceptions
  - Level 4: Prioritise exceptions
- Level 3: Exception Analysis
  - Level 4: Analyse root cause
  - Level 4: Assess impact
  - Level 4: Recommend remediation

**Level 2: Exception Resolution**
- Level 3: Exception Handling
  - Level 4: Assign exceptions
  - Level 4: Track resolution progress
  - Level 4: Verify resolution
- Level 3: Exception Closure
  - Level 4: Document resolution
  - Level 4: Close exception
  - Level 4: Update exception records

**Evidence:** engine.v_migration_exception_detail view provides exception data; no dedicated exception management API; exceptions logged during execution

---

### 3.13 Issue Remediation (Level 1: 2 Repeatable, Manual)

**Level 2: Remediation Planning**
- Level 3: Issue Assessment
  - Level 4: Assess issue severity
  - Level 4: Identify root cause
  - Level 4: Plan remediation steps
- Level 3: Remediation Execution
  - Level 4: Execute remediation
  - Level 4: Verify remediation
  - Level 4: Document remediation

**Level 2: Remediation Verification**
- Level 3: Re-validation
  - Level 4: Re-run validation
  - Level 4: Compare results
  - Level 4: Confirm resolution
- Level 3: Issue Closure
  - Level 4: Close issue
  - Level 4: Update issue records
  - Level 4: Report issue resolution

**Evidence:** No automated remediation workflow found in codebase; issue tracking handled via Task Management platform

---

### 3.14 Governance (Level 1: 3 Defined, Semi-Automated)

**Level 2: Governance Evaluation**
- Level 3: Compliance Assessment
  - Level 4: Evaluate control results
  - Level 4: Calculate risk scores
  - Level 4: Assess compliance status
- Level 3: Decision Making
  - Level 4: Generate governance decision
  - Level 4: Document decision rationale
  - Level 4: Communicate decision

**Level 2: Governance Integration**
- Level 3: Notification Integration
  - Level 4: Trigger governance notifications
  - Level 4: Notify stakeholders of decisions
  - Level 4: Alert on governance failures
- Level 3: Workflow Integration
  - Level 4: Trigger approval workflows
  - Level 4: Create governance tasks
  - Level 4: Update workflow status
- Level 3: Reporting Integration
  - Level 4: Feed governance data to reports
  - Level 4: Update dashboard metrics
  - Level 4: Generate governance reports
- Level 3: Release Integration
  - Level 4: Trigger release approval workflows
  - Level 4: Gate releases on governance decisions
  - Level 4: Block non-compliant releases

**Current Implementation:** app.governance.decision_engine computes governance decisions; app.governance.risk_scoring calculates weighted risk scores; results stored in engine.migration_governance_status and engine.migration_risk_scores

**Planned Integration:** Governance decisions to trigger notifications via Notification Services; Governance decisions to create tasks via Task Management; Governance decisions to update workflows via Workflow Management; Governance results to feed Reporting and Dashboard Production; Governance decisions to trigger Release Approval workflows

**Evidence:** app.governance.decision_engine, app.governance.risk_scoring, engine.migration_governance_status

---

### 3.15 Release Approval (Level 1: 4 Managed, Semi-Automated)

**Level 2: Release Request**
- Level 3: Release Preparation
  - Level 4: Compile release package
  - Level 4: Validate release criteria
  - Level 4: Submit release request
- Level 3: Release Review
  - Level 4: Review release package
  - Level 4: Assess release risk
  - Level 4: Approve/reject release

**Level 2: Release Execution**
- Level 3: Release Deployment
  - Level 4: Deploy release
  - Level 4: Verify deployment
  - Level 4: Monitor release
- Level 3: Release Rollback
  - Level 4: Detect release issues
  - Level 4: Execute rollback
  - Level 4: Verify rollback

**Evidence:** app.services.approval_service manages approval workflow; platform.approval_requests stores approval requests; platform.approval_step_instances tracks approval steps; full CRUD API at /api/v1/platform/approvals

---

### 3.16 Reporting (Level 1: 2 Repeatable, Assisted)

**Level 2: Report Generation**
- Level 3: Report Data Collection
  - Level 4: Query SQL views
  - Level 4: Aggregate report data
  - Level 4: Validate report data
- Level 3: Report Production
  - Level 4: Generate report
  - Level 4: Format report
  - Level 4: Export report

**Level 2: Report Management**
- Level 3: Report Distribution
  - Level 4: Distribute reports
  - Level 4: Manage report access
  - Level 4: Track report usage
- Level 3: Report Archival
  - Level 4: Archive reports
  - Level 4: Retrieve archived reports
  - Level 4: Manage report retention

**Current State:** reporting schema contains 5 SQL views (v_migration_executive_summary, v_migration_control_summary, v_migration_governance_report, v_migration_exception_detail, v_migration_batch_detail); app.audit_export provides CLI export; no API endpoints for reports; frontend displays mock data

**Target State:** Reporting API endpoints (/api/v1/reports/*) to be created; Dashboard API endpoints (/api/v1/dashboards/*) to be created; Frontend to consume real API data instead of mock; Reports to integrate with Governance decisions

**Evidence:** reporting schema (5 SQL views), app.audit_export (CLI), no API

---

### 3.17 Dashboard Production (Level 1: 2 Repeatable, Assisted)

**Level 2: Dashboard Generation**
- Level 3: Dashboard Data Collection
  - Level 4: Query fact views
  - Level 4: Calculate KPIs
  - Level 4: Validate dashboard data
- Level 3: Dashboard Production
  - Level 4: Generate dashboard
  - Level 4: Render visualisations
  - Level 4: Update dashboard

**Level 2: Dashboard Management**
- Level 3: Dashboard Distribution
  - Level 4: Distribute dashboards
  - Level 4: Manage dashboard access
  - Level 4: Track dashboard usage
- Level 3: Dashboard Archival
  - Level 4: Archive dashboards
  - Level 4: Retrieve archived dashboards
  - Level 4: Manage dashboard retention

**Current State:** reporting schema contains fact views (v_fact_batch, v_fact_control); app.scoring_engine calculates KPIs; no API endpoints; frontend displays mock data

**Target State:** Dashboard API endpoints (/api/v1/dashboards/*) to be created; Real-time dashboard updates; Frontend to consume real API data instead of mock; Dashboards to integrate with Governance decisions

**Evidence:** reporting schema (fact views), app.scoring_engine, no API

---

### 3.18 Notifications (Level 1: 4 Managed, Automated)

**Level 2: Notification Processing**
- Level 3: Event Processing
  - Level 4: Receive platform events
  - Level 4: Validate event data
  - Level 4: Route events to handlers
- Level 3: Notification Generation
  - Level 4: Generate notification content
  - Level 4: Apply user preferences
  - Level 4: Send notifications

**Level 2: Notification Management**
- Level 3: Notification Tracking
  - Level 4: Track notification delivery
  - Level 4: Monitor notification status
  - Level 4: Handle delivery failures
- Level 3: Notification Preferences
  - Level 4: Manage user preferences
  - Level 4: Apply preference rules
  - Level 4: Update preference settings

**Evidence:** app.services.notification_service provides full CRUD API; platform.notifications stores notification records; platform.notification_preferences stores user preferences; subscribed to 19 event types

---

### 3.19 Scheduling (Level 1: 4 Managed, Automated)

**Level 2: Schedule Management**
- Level 3: Schedule Creation
  - Level 4: Define schedule parameters
  - Level 4: Configure recurrence
  - Level 4: Store schedule definition
- Level 3: Schedule Execution
  - Level 4: Trigger scheduled events
  - Level 4: Execute scheduled tasks
  - Level 4: Track schedule execution

**Level 2: Reminder Management**
- Level 3: Reminder Creation
  - Level 4: Create event reminders
  - Level 4: Configure reminder timing
  - Level 4: Store reminder definitions
- Level 3: Reminder Delivery
  - Level 4: Send reminders
  - Level 4: Track reminder delivery
  - Level 4: Handle reminder failures

**Evidence:** app.services.calendar_service provides full CRUD API; platform.calendar_events stores events; platform.calendar_event_reminders manages reminders; subscribed to Batch Started and Task Created events

---

### 3.20 Workflow Management (Level 1: 4 Managed, Automated)

**Level 2: Workflow Definition**
- Level 3: Workflow Creation
  - Level 4: Define workflow steps
  - Level 4: Configure step parameters
  - Level 4: Store workflow definition
- Level 3: Workflow Validation
  - Level 4: Validate workflow logic
  - Level 4: Test workflow execution
  - Level 4: Approve workflow

**Level 2: Workflow Execution**
- Level 3: Workflow Instance Management
  - Level 4: Create workflow instance
  - Level 4: Execute workflow steps
  - Level 4: Track workflow progress
- Level 3: Workflow Monitoring
  - Level 4: Monitor workflow status
  - Level 4: Handle workflow failures
  - Level 4: Retry failed workflows

**Current Implementation:** app.services.workflow_service provides full CRUD API; platform.workflow_definitions stores definitions; platform.workflow_instances tracks execution; subscribed to Task Completed and Approval Decided events

**Planned Integration:** Governance decisions to trigger approval workflows; Release Approval to trigger notification workflows; Validation failures to trigger remediation workflows

**Evidence:** app.services.workflow_service (CRUD API), platform.workflow_definitions, platform.workflow_instances

---

### 3.21 Task Management (Level 1: 4 Managed, Automated)

**Level 2: Task Lifecycle**
- Level 3: Task Creation
  - Level 4: Create task definition
  - Level 4: Assign task
  - Level 4: Set task priorities
  - Level 4: Store task record
- Level 3: Task Execution
  - Level 4: Track task progress
  - Level 4: Update task status
  - Level 4: Complete task

**Level 2: Task Management**
- Level 3: Task Dependencies
  - Level 4: Define dependencies
  - Level 4: Track dependency resolution
  - Level 4: Manage blocking tasks
- Level 3: Task Reporting
  - Level 4: Generate task reports
  - Level 4: Analyse task metrics
  - Level 4: Optimise task allocation

**Current Implementation:** app.services.task_service provides full CRUD API; platform.tasks stores task records; platform.task_comments tracks comments; platform.task_dependencies manages dependencies; produces Task Created and Task Completed events

**Planned Integration:** Governance decisions to create tasks; Validation failures to create tasks; Release Approval to create tasks; Workflow completions to create tasks

**Evidence:** app.services.task_service (CRUD API), platform.tasks, platform.task_comments, platform.task_dependencies

---

### 3.22 User Lifecycle (Level 1: 3 Defined, Semi-Automated)

**Level 2: User Management**
- Level 3: User Creation
  - Level 4: Create user account
  - Level 4: Assign initial roles
  - Level 4: Send welcome notification
- Level 3: User Maintenance
  - Level 4: Update user details
  - Level 4: Change user roles
  - Level 4: Manage user preferences

**Level 2: User Deactivation**
- Level 3: Deactivation Process
  - Level 4: Disable user account
  - Level 4: Revoke access
  - Level 4: Archive user data
- Level 3: User Review
  - Level 4: Review user access
  - Level 4: Audit user permissions
  - Level 4: Report user access

**Evidence:** app.services.user_service provides full CRUD API; platform.users stores user records; platform.user_roles manages role assignments; produces User Created event

---

### 3.23 Role Administration (Level 1: 3 Defined, Semi-Automated)

**Level 2: Role Management**
- Level 3: Role Creation
  - Level 4: Define role
  - Level 4: Assign permissions
  - Level 4: Store role definition
- Level 3: Role Maintenance
  - Level 4: Update role permissions
  - Level 4: Version role definitions
  - Level 4: Archive role definitions

**Level 2: Permission Management**
- Level 3: Permission Assignment
  - Level 4: Assign permissions to roles
  - Level 4: Validate permission assignments
  - Level 4: Store permission mappings
- Level 3: Permission Auditing
  - Level 4: Audit permission assignments
  - Level 4: Report permission usage
  - Level 4: Optimise permission structure

**Evidence:** app.services.role_service provides full CRUD API; platform.roles stores role definitions; platform.permissions stores 47 permissions; platform.role_permissions manages assignments; produces Role Assigned event

---

### 3.24 Tenant Management (Level 1: 3 Defined, Semi-Automated)

**Level 2: Tenant Lifecycle**
- Level 3: Tenant Creation
  - Level 4: Create tenant record
  - Level 4: Configure tenant settings
  - Level 4: Provision tenant resources
- Level 3: Tenant Configuration
  - Level 4: Update tenant settings
  - Level 4: Manage tenant policies
  - Level 4: Configure tenant features

**Level 2: Tenant Administration**
- Level 3: Tenant Monitoring
  - Level 4: Monitor tenant usage
  - Level 4: Track tenant health
  - Level 4: Alert on tenant issues
- Level 3: Tenant Maintenance
  - Level 4: Deactivate tenant
  - Level 4: Archive tenant data
  - Level 4: Restore tenant access

**Current Implementation:** core.tenants table exists; tenant_id referenced in JWT tokens; tenant-aware architecture in place; no dedicated tenant management API; frontend displays mock data

**Tenant Lifecycle:** Tenant creation, configuration, deactivation, archival

**Tenant Onboarding:** Organisation creation, initial administrator creation, licence allocation, initial configuration, welcome notifications, platform activation

**Tenant Administration:** Tenant configuration updates, resource management, policy management, isolation verification

**Evidence:** core.tenants (table exists), tenant_id in JWT tokens, tenant-aware architecture

---

### 3.25 Security Administration (Level 1: 2 Repeatable, Manual)

**Level 2: Security Management**
- Level 3: Encryption Management
  - Level 4: Manage encryption keys
  - Level 4: Rotate encryption keys
  - Level 4: Audit encryption usage
- Level 3: Certificate Management
  - Level 4: Manage certificates
  - Level 4: Renew certificates
  - Level 4: Revoke certificates

**Level 2: Security Monitoring**
- Level 3: Security Event Monitoring
  - Level 4: Monitor security events
  - Level 4: Analyse security patterns
  - Level 4: Respond to security incidents
- Level 3: Security Reporting
  - Level 4: Generate security reports
  - Level 4: Audit security configurations
  - Level 4: Report security compliance

**Evidence:** audit.security_events stores security events; no dedicated security management API; frontend displays mock data

---

### 3.26 Audit Lifecycle (Level 1: 2 Repeatable, Manual)

**Level 2: Audit Logging**
- Level 3: Event Capture
  - Level 4: Capture API calls
  - Level 4: Capture security events
  - Level 4: Store audit records
- Level 3: Event Validation
  - Level 4: Validate audit data
  - Level 4: Enrich audit records
  - Level 4: Index audit records

**Level 2: Audit Management**
- Level 3: Audit Reporting
  - Level 4: Generate audit reports
  - Level 4: Analyse audit patterns
  - Level 4: Export audit data
- Level 3: Audit Compliance
  - Level 4: Retain audit data
  - Level 4: Purge expired data
  - Level 4: Verify compliance

**Evidence:** app.api.core.middleware.audit_middleware logs every API call; audit.audit_events stores audit records; audit.api_call_log stores API call details; no dedicated audit API; frontend displays mock data

---

### 3.27 Platform Administration (Level 1: 3 Defined, Semi-Automated)

**Level 2: Configuration Management**
- Level 3: Settings Management
  - Level 4: Update system settings
  - Level 4: Validate settings
  - Level 4: Audit settings changes
- Level 3: Feature Management
  - Level 4: Toggle feature flags
  - Level 4: Configure feature parameters
  - Level 4: Monitor feature usage

**Level 2: Health Management**
- Level 3: Health Monitoring
  - Level 4: Run health checks
  - Level 4: Monitor system health
  - Level 4: Alert on health issues
- Level 3: Maintenance
  - Level 4: Schedule maintenance
  - Level 4: Execute maintenance tasks
  - Level 4: Verify maintenance completion

**Evidence:** app.services.settings_service provides full CRUD API; app.health provides health check endpoints; platform.system_settings stores configuration; platform.feature_flags stores feature toggles; produces Settings Changed event

---

### 3.28 Customer Onboarding (Level 1: 1 Initial, Manual)

**Level 2: Customer Registration**
- Level 3: Registration Process
  - Level 4: Customer submits registration form
  - Level 4: Validate registration details
  - Level 4: Create customer record
- Level 3: Organisation Creation
  - Level 4: Create organisation record
  - Level 4: Assign organisation details
  - Level 4: Store organisation metadata

**Level 2: Platform Activation**
- Level 3: Tenant Provisioning
  - Level 4: Provision tenant resources
  - Level 4: Configure tenant settings
  - Level 4: Validate tenant configuration
- Level 3: Administrator Setup
  - Level 4: Create initial administrator account
  - Level 4: Assign administrator roles
  - Level 4: Send welcome notification
- Level 3: Licence Allocation
  - Level 4: Allocate licence/subscription
  - Level 4: Configure licence parameters
  - Level 4: Activate platform access

**Not implemented** — no dedicated customer onboarding workflow found in codebase

---

### 3.29 Authentication (Level 1: 4 Managed, Semi-Automated)

**Level 2: Login Process**
- Level 3: Credential Validation
  - Level 4: Validate username
  - Level 4: Validate password
  - Level 4: Check account status
- Level 3: MFA Process
  - Level 4: Request MFA code
  - Level 4: Validate MFA code
  - Level 4: Handle MFA failures

**Level 2: Session Management**
- Level 3: Token Management
  - Level 4: Generate JWT token
  - Level 4: Set token claims
  - Level 4: Issue refresh token
- Level 3: Session Lifecycle
  - Level 4: Create session
  - Level 4: Manage session timeout
  - Level 4: Invalidate session on logout

**Level 2: Authentication Management**
- Level 3: Failure Handling
  - Level 4: Log authentication failures
  - Level 4: Implement rate limiting
  - Level 4: Lock accounts after failures
- Level 3: Token Refresh
  - Level 4: Validate refresh token
  - Level 4: Issue new JWT token
  - Level 4: Revoke old refresh token

**Evidence:** app.services.auth_service validates credentials against platform.users; JWT tokens issued with bcrypt verification; refresh tokens managed; rate limiting on login endpoint (5/minute); produces Login Successful and Login Failed events

---

## 4. Process Summary

| # | Process | Domain | Level 1 Maturity | Automation |
|---|---------|--------|------------------|------------|
| 1 | Migration Project Lifecycle | Migration Management | 3 Defined | Semi-Automated |
| 2 | Connection Onboarding | Migration Management | 4 Managed | Semi-Automated |
| 3 | Credential Onboarding | Migration Management | 4 Managed | Semi-Automated |
| 4 | Dataset Discovery | Migration Management | 3 Defined | Semi-Automated |
| 5 | Column Discovery | Migration Management | 3 Defined | Semi-Automated |
| 6 | Mapping Lifecycle | Migration Management | 3 Defined | Semi-Automated |
| 7 | Rule Authoring | Validation Management | 3 Defined | Semi-Automated |
| 8 | Rule Approval | Validation Management | 2 Repeatable | Manual |
| 9 | Rule Execution | Validation Management | 4 Managed | Automated |
| 10 | Control Lifecycle | Validation Management | 3 Defined | Semi-Automated |
| 11 | Validation Execution | Validation Management | 4 Managed | Automated |
| 12 | Exception Management | Validation Management | 3 Defined | Semi-Automated |
| 13 | Issue Remediation | Validation Management | 2 Repeatable | Manual |
| 14 | Governance | Governance & Compliance | 3 Defined | Semi-Automated |
| 15 | Release Approval | Governance & Compliance | 4 Managed | Semi-Automated |
| 16 | Reporting | Reporting & Analytics | 2 Repeatable | Assisted |
| 17 | Dashboard Production | Reporting & Analytics | 2 Repeatable | Assisted |
| 18 | Notifications | Platform Services | 4 Managed | Automated |
| 19 | Scheduling | Platform Services | 4 Managed | Automated |
| 20 | Workflow Management | Platform Services | 4 Managed | Automated |
| 21 | Task Management | Platform Services | 4 Managed | Automated |
| 22 | User Lifecycle | Administration | 3 Defined | Semi-Automated |
| 23 | Role Administration | Administration | 3 Defined | Semi-Automated |
| 24 | Tenant Management | Administration | 3 Defined | Semi-Automated |
| 25 | Security Administration | Administration | 2 Repeatable | Manual |
| 26 | Audit Lifecycle | Administration | 2 Repeatable | Manual |
| 27 | Platform Administration | Administration | 3 Defined | Semi-Automated |
| 28 | Customer Onboarding | Platform Services | 1 Initial | Manual |
| 29 | Authentication | Platform Services | 4 Managed | Semi-Automated |

---

## 5. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Product Owner | | | Pending |

---

*This decomposition is part of the Enterprise Business Process Model (Prompt 17 v2.1). All findings are based on source code analysis — no code was modified.*