
# 00_MASTER_PLATFORM_INTELLIGENCE_RESTORATION_PROMPT


Objective

The objective of this master prompt is to analyse the Phase 10 Frontend Restoration Specification and generate a set of focused implementation prompts organised by functional workstream.

Each generated prompt must be:

self-contained
implementation-ready
based only on the sections assigned to that workstream
preserve all technical detail
preserve traceability back to the original specification
avoid duplication with other workstreams
clearly identify dependencies on other prompts


---------

## Add 10Y Inventory

Just like Phase 09 had

09Y_Current_Application_Inventory.md

Phase 10 should have

Phase 10 should inventory platform assets, not just backend code.

For example::

10Y_Current_Platform_Inventory.md

1. REST APIs

2. Background Workers

3. Scheduler Jobs

4. Rule Engine Modules

5. AI Modules

6. SDKs

7. CLI Commands

8. Infrastructure

9. Security Services

10. Monitoring Components

11. Databases

12. Message Queues

13. Event Bus

14. Integrations

15. External Dependencies

16. Deployment Pipelines

17. Configuration

18. Feature Flags

Otherwise OpenCode has nothing to compare against.

---------

## Naming Consistency

One typo:

10F_Enterprise_Security.md

should obviously be

10F_Enterprise_Security.md

---------

## Objective

Analyse the Phase 10 Platform Intelligence & Enterprise Operations Specification and produce a complete implementation package comprising architecture outputs, implementation guidance, and governance-ready workstreams suitable for independent execution by OpenCode.






The generated prompts will be used independently by OpenCode to implement each workstream.

---------

## Implementation Directive – Mandatory

> **This section is governed by `10Z_Implementation_Governance.md`. Refer to that document for all implementation rules, gap analysis templates, definition of done, testing requirements, and coding standards.**
> 
> **All rules in the governance document are mandatory. No implementation may begin until the gap analysis has been completed.**


---------
# 10A – Intelligent Automation
    depends on
        Rule Engine
        Metadata Registry

Build on the metadata-driven engine by introducing intelligent assistance rather than replacing existing rule logic.

Examples:

Automatic rule recommendations
Suggested source/target mappings
Duplicate mapping detection
Orphan column detection
Impact analysis before execution
AI-assisted rule explanations (optional, behind feature flags)

depends on
        Rule Engine

---------
# 10B – Enterprise Monitoring
    depends on
        Scheduler
        Workers

Expand operational visibility.

Examples:

Live dashboards
Queue monitoring
Worker health
Execution throughput
SLA monitoring
Performance analytics
Capacity planning


---------
# 10C – Data Lineage & Traceability
    depends on
        Metadata
        Execution Engine
        
One of the biggest differentiators for enterprise migration tools.

Examples:

Source → Target lineage
Control execution lineage
Rule dependency graph
Dataset relationship visualisation
Audit lineage
End-to-end traceability


---------
# 10D – Self-Service Tenant Administration
    depends on
        RBAC
        Authentication

Reduce manual administration.

Examples:

Tenant onboarding wizard
Project templates
Environment cloning
Backup/restore
Import/export metadata
Tenant lifecycle management


---------
# 10E – DevOps & Deployment
    depends on
        Infrastructure
        Monitoring

Complete the operational lifecycle.

Examples:

CI/CD
Infrastructure as Code enhancements
Blue/green deployment
Health checks
Secrets management
Configuration management
Environment promotion


---------
# 10F – Enterprise Security
    depends on
        Authentication
        RBAC
        
Although security has been considered throughout, this phase would consolidate advanced enterprise capabilities.

Examples:

SSO (SAML/OIDC)
MFA integration
Fine-grained audit logging
Session management
API key management
Security dashboards
Compliance reporting


---------
# 10G – Platform SDK & Integrations
    depends on
        REST API

Turn the platform into an ecosystem.

Examples:

REST SDK
Python SDK
PowerShell SDK
CLI enhancements
Webhooks
Event bus
Integration marketplace
Plugin architecture




---

# Inputs


MAP_V2/
│
├── 01_prompts/
│   └── utilities/
│      └──  Phase_10_Platform_Intelligence_Enterprise_Operations_Restoration/
│           00_MASTER_PLATFORM_INTELLIGENCE_RESTORATION_PROMPT.md
│
│           10A_Intelligent_Automation.md
│           10B_Enterprise_Monitoring.md
│           10C_Data_Lineage_And_Traceability.md
│           10D_Self_Service_Tenant_Administration.md
│           10E_DevOps_And_Deployment.md
│           19F_Enterprise_Security.md
│           10G_Platform_SDK_And_Integrations.md
            10Y_Current_Platform_Inventory.md
            10Z_Implementation_Governance.md


---

# Production Promotion

After engineering review and explicit user approval, promote only:


to


└── 00_outputs/
    └── utilities/
        └── phase_10_Platform_Intelligence_Enterprise_Operations/
            