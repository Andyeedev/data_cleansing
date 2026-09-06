This document is a living MAP_V3 control document.

OpenCode must update it when:

A work package changes status
A decision is approved/rejected
A material implementation is completed
A new dependency is identified
A policy/implementation gap is resolved
A new work package is approved
MAP_V3 architecture materially changes

Do not remove completed tasks.

Completed tasks should retain:

Status
Decision
Commit/reference
Evidence
Completion date
Relevant notes

This preserves the MAP_V3 audit trail. OpenCode must not independently implement major security, architecture, commercial, tenancy or product changes without the required approval gate.

2. Non-Negotiable OpenCode Rules
2.1 Inspect before changing

OpenCode MUST inspect existing implementation before proposing new implementation.

Inspect, where relevant:

Existing source code
Database schema/migrations
Configuration
Existing policies
Documentation
Tests
Deployment configuration
Infrastructure-as-code
Existing tenant/subscription/billing work
Existing authentication/authorisation
Existing demo implementation
Git history
Branch/release structure

Do not assume a capability is missing because it is not immediately obvious.

2.2 Do not rebuild existing functionality

If a capability already exists:

Identify it.
Explain where it exists.
Assess whether it satisfies the requirement.
Identify any deficiency.
Recommend only the necessary change.

Do not replace functioning implementation merely because another implementation approach is preferred.

2.3 Preserve MAP_V2

MAP_V2 must remain recoverable as the final pre-MAP_V3 baseline.

Do not alter or destroy the preserved MAP_V2 baseline after it has been formally tagged/released.

2.4 One work package at a time

OpenCode must work on one assigned work package at a time.

It may identify dependencies or related gaps, but it must not start implementing unrelated work.

2.5 Investigation before implementation

Unless explicitly instructed otherwise, each work package follows:

DISCOVERY
    ↓
ASSESSMENT
    ↓
REPORT
    ↓
CHATGPT REVIEW
    ↓
APPROVAL
    ↓
IMPLEMENTATION
    ↓
TESTING
    ↓
EVIDENCE
    ↓
CHATGPT VALIDATION
    ↓
COMPLETE
3. Git / MAP_V2 Baseline Control

This is the first required workstream before MAP_V3 is created.

OC-GIT-001 — Review Existing Release Process
Objective

Understand and preserve the established MAP Nexus Git/release process.

Required starting references

The latest three releases are:

v5_05_task_management
v5_06_task_management
v5_07_task_management

The latest known release is:

v5_07_task_management

OpenCode instruction

Before making changes:

Locate and inspect the local Git repository.
Locate the three releases/branches/tags/structures above.
Inspect how v5_05_task_management, v5_06_task_management and v5_07_task_management were created and uploaded.
Determine:
Branch naming
Commit structure
Tag/release structure
Documentation structure
What is committed
What is excluded
How release versions are represented
How the latest release relates to the working tree
Identify the exact process that should be followed for the MAP_V2 baseline.
Do not invent a new release process unless the existing process is demonstrably unsuitable.
If there is uncertainty, report it before changing anything.
Required output

Produce:

Existing release process summary
Comparison of v5_05, v5_06 and v5_07
Recommended MAP_V2 Git strategy
Any risks/issues discovered
Proposed exact commands/actions
Proposed baseline tag/release name
Confirmation of what would remain untouched
Approval gate

ChatGPT approval required before executing the baseline publication if OpenCode identifies any material deviation from the established release process.

4. GitHub Publication of MAP_V2
OC-GIT-002 — Publish Final MAP_V2 Baseline
Objective

Safeguard the complete current MAP_V2 work online in GitHub before MAP_V3 is created.

OpenCode instruction
Establish exactly what constitutes the current local MAP_V2.
Check for:
Uncommitted changes
Untracked files
Missing documentation
Sensitive files
Secrets
Credentials
.env files
API keys
Private certificates
Generated files that should not be committed
Compare the intended repository contents against the latest release process.
Follow the established v5_07_task_management process.
Commit and push the complete approved MAP_V2 baseline to GitHub.
Do not expose secrets or credentials.
Do not delete existing Git history.
Do not overwrite previous releases.
Report the resulting commit hash.
Required output
MAP_V2 local baseline:
GitHub repository:
Branch:
Commit:
Files included:
Files intentionally excluded:
Security checks:
Push result:
5. Formal MAP_V2 Baseline Identification
OC-GIT-003 — Mark MAP_V2 as Final Baseline
Objective

Create an unambiguous GitHub reference showing that this is the final MAP_V2 version immediately before MAP_V3.

OpenCode instruction

Investigate whether the best representation is:

Git tag
GitHub Release
Release branch
Version marker/documentation
Or a combination

The preferred approach should provide an immutable/reproducible reference to the exact MAP_V2 commit.

Suggested naming

OpenCode should assess a clear naming convention such as:

MAP_V2_FINAL

or

MAP_V2_FINAL_BASELINE

The exact name must be recommended by OpenCode after reviewing the existing release naming convention.

Important

Do not create the tag/release until the recommendation is reviewed if it differs from the established process.

Required output

Explain:

Recommended mechanism
Exact proposed name
Commit to be tagged/released
How future developers/OpenCode can identify MAP_V2
How MAP_V3 will be distinguished
6. MAP_V3 Creation
OC-GIT-004 — Create MAP_V3 From Final MAP_V2
Objective

Create a controlled MAP_V3 working baseline from the preserved final MAP_V2.

Preconditions

Must have:

Final MAP_V2 committed
Final MAP_V2 pushed to GitHub
Final MAP_V2 identified by immutable Git reference
No unresolved baseline integrity issue
OpenCode instruction
Use the final MAP_V2 commit as the starting point.
Create MAP_V3 using the existing project/release conventions.
Preserve MAP_V2 history.
Do not retrospectively alter MAP_V2.
Record the exact parent commit.
Document the relationship:
MAP_V2_FINAL_BASELINE
        |
        v
MAP_V3
Required output

Report:

MAP_V2 baseline commit
MAP_V3 starting commit
Branch name
Version convention
Files/folders created
Any changes made during creation
7. MAP_V3 TODO_LIST Location
OC-CTRL-001 — Determine Correct TODO_LIST Location
Objective

Determine where the MAP_V3 master task/control documentation belongs within the existing MAP Nexus document structure.

OpenCode instruction

OpenCode understands the existing MAP Nexus folder/document structure and must inspect it before deciding.

Review:

Existing documentation folders
Policy folders
Product documentation
Architecture documentation
Development/task documentation
Existing release/task-management structures
Any current master/index documents

Do not simply create a new folder at repository root.

Required output

Recommend:

Exact folder location
Exact folder name
Exact filename(s)
Why the location fits the existing structure
Whether MAP_V3_TODO_LIST should be:
a folder
a document
or a folder containing multiple control documents
Preferred direction

The master control concept should remain clearly identifiable as:

MAP_V3 TODO / Workstream Control

but OpenCode should determine the actual filesystem location and naming based on the existing project structure.

Approval

ChatGPT approval required before restructuring documentation.

8. Workstream Priority Structure

The following work packages are the initial MAP_V3 roadmap.

P0 — Security / Protection
OC-SEC-001 — Website Security Assessment

Assess and document:

DNS
Domain
HTTPS/TLS
Hosting
Security headers
Public endpoints
Admin access
Secrets
Forms
Dependencies
Vulnerabilities
Monitoring
Logging
Backup/recovery
Privacy/cookies
Email/contact exposure
WAF/DDoS where applicable
Deployment security

Initial task is assessment, not remediation.

OC-SEC-002 — MAP Nexus Product Security Assessment

Assess the actual product implementation.

Review:

Authentication
Authorisation
RBAC
Tenant isolation
API security
Session management
Database access
Credentials/secrets
Encryption
Audit logging
Input validation
Rate limiting
Error handling
Dependency security
Configuration
Production security
Monitoring
Security testing

Identify critical/high/medium/low findings.

9. P1 — Commercial / Product Architecture
OC-COM-001 — Subscription, Charges & Tenant Assessment
Objective

Determine the actual current state of:

Tenants
Subscriptions
Plans
Product entitlements
Charges
Billing
Payment integration
Trials
Renewal
Cancellation
Suspension
Reactivation
Feature access
Tenant lifecycle
Required investigation

OpenCode MUST first locate and review all existing:

Policy documents
Commercial requirements
Subscription documentation
Tenant documentation
Database models
APIs
Frontend implementation
Billing/charging implementation
Tests
Configuration
Previous work
Required output

Create:

Requirement
    ↓
Existing policy
    ↓
Existing implementation
    ↓
Evidence
    ↓
Status
    ↓
Gap
    ↓
Recommendation

Statuses:

IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
UNCLEAR
NOT APPLICABLE

No major commercial implementation should begin until the gap report has been reviewed.

10. Pre-Migration Product Capability
OC-PROD-001 — Pre-Migration Validation & Assurance Product Assessment
Objective

Extend the product model so MAP Nexus can support both pre-migration and post-migration assurance.

This is a new explicit requirement for MAP_V3 and must be treated as a product/commercial capability, not merely a technical configuration.

Business requirement

MAP Nexus must support customers who want:

Pre-migration validation and assurance
Post-migration validation and assurance
Both pre- and post-migration validation and assurance
Important distinction

A post-migration scenario normally has:

SOURCE SYSTEM
       |
       | migration
       v
TARGET SYSTEM

A pre-migration scenario may have:

SOURCE SYSTEM
       |
       | baseline / assessment
       v
PRE-MIGRATION ASSURANCE

Therefore, MAP must not assume every tenant has both a source and target system.

Tenant/product separation

OpenCode must investigate how the existing tenant model can distinguish:

Pre-migration-only tenant
Post-migration-only tenant
Combined pre + post migration tenant

Do not assume the current tenant structure is incapable of supporting this.

Commercial requirement

Pre-migration and post-migration assurance must be considered as potential product types / revenue streams.

The assessment must therefore determine how product type affects:

Tenant configuration
Entitlements
Features
Subscription
Charging
Billing
Usage
Reporting
Customer lifecycle
Upgrade/downgrade
Combined product packages
Required investigation

Search existing policies and implementation for evidence that this was previously documented or partially implemented.

Search for concepts including:

pre-migration
pre migration
baseline
source-only
post-migration
post migration
source/target
product type
subscription
charge
billing
entitlement
tenant
Required output

Determine:

Whether pre-migration capability already exists.
Whether the existing architecture supports source-only tenants.
Whether a new product classification is required.
Whether product type should be represented at tenant, subscription, entitlement or another appropriate level.
How pre/post/both should affect charging.
What existing policy already says.
What is missing from policy.
What is missing from implementation.
Recommended architecture.
Recommended commercial model.
Dependencies on OC-COM-001.
Important

Do not implement the charging/product model until the assessment is reviewed.

11. P1 — Cloud
OC-CLOUD-001 — Secure Cloud Architecture & Environment Assessment
Objective

Determine how MAP Nexus can be moved securely into cloud infrastructure and operate with proper environment separation.

Minimum environments
DEV
TEST
PRODUCTION

OpenCode should assess whether a separate UAT/STAGING environment is justified.

Assess
Azure architecture
Identity
RBAC
MFA
Least privilege
Network architecture
Environment isolation
Secrets management
Azure Key Vault
Database security
Storage
Application hosting
CI/CD
Infrastructure-as-code
Terraform
Configuration management
Monitoring
Logging
Backup
Disaster recovery
Production access
Developer access
Environment-specific credentials
Deployment promotion
Rollback
Security controls
Existing context

MAP Nexus has foundations involving Git/source control, branching, automated testing, Terraform/IaC and controlled deployment practices. Do not claim a mature CI/CD platform unless the implementation confirms it.

Required output

Provide:

Current architecture
Existing cloud assets
Proposed target architecture
Environment model
Security boundaries
Identity model
Deployment model
Secrets model
Data model
Backup/DR model
CI/CD recommendation
Risks
Costs where material
Implementation phases

Architecture must be approved before significant cloud migration work begins.

12. P1 — Governance
OC-GOV-001 — Policy vs Implementation Gap Audit
Objective

Compare MAP Nexus policies against actual implementation.

OpenCode instruction

For every material policy requirement:

POLICY REQUIREMENT
        ↓
ACTUAL IMPLEMENTATION
        ↓
EVIDENCE
        ↓
STATUS
        ↓
GAP / RISK
        ↓
RECOMMENDATION
Status values
IMPLEMENTED
PARTIAL
MISSING
CONTRADICTORY
UNCLEAR
NOT APPLICABLE
Rules
Do not rewrite policy merely to match current implementation.
Do not silently change requirements.
Do not assume implementation from documentation alone.
Do not assume documentation from implementation alone.
Flag conflicts for founder/technical-lead decision.
Output

Produce a formal gap register with severity and recommended remediation.

13. P1/P2 — Customer Demonstrations
OC-DEMO-001 — Customer Demo Security Assessment
Current context

MAP Nexus already has customer demonstration pages implemented in HTML with mock data and dashboard/reporting examples.

These demos must be treated as a controlled product surface even when the underlying data is mock data.

Assess
Public accessibility
Authentication
Demo accounts
Roles/permissions
Session expiry
Link expiry
Password handling
Session timeout
Rate limiting
Abuse prevention
Demo tenant isolation
Mock-data safety
Reset mechanism
Monitoring
Demo/prod separation
Access to source/assets
API exposure
Customer-specific demo environments
Automatic disablement
Auditability
Business requirement

Determine how a prospect could receive temporary demo access safely.

Potential model to investigate:

Prospect
   ↓
Temporary demo access
   ↓
Restricted permissions
   ↓
Isolated demo tenant
   ↓
Expiry
   ↓
Automatic disablement

Do not implement this model without first assessing the existing demo architecture.

14. P2 — Website & Product Readiness
OC-READY-001 — Additional Commercial / Operational Readiness Gap Assessment

OpenCode should identify material gaps not already covered by the defined work packages.

Potential areas include:

Privacy
Terms
Data processing
Customer onboarding
Customer offboarding
Data deletion
Backup/restore
Disaster recovery
Incident response
Vulnerability management
Dependency management
Release/change management
Operational monitoring
Support process
Production runbooks
Security evidence
Logging and retention
Business continuity
Customer access management

This is an assessment task.

OpenCode must avoid generating an uncontrolled generic "best practice" list. Findings must be relevant to MAP Nexus's actual architecture, product and commercial stage.

15. Suggested Execution Order
Stage 0 — Baseline Protection
OC-GIT-001 Review existing release process
OC-GIT-002 Publish MAP_V2 baseline
OC-GIT-003 Mark final MAP_V2 baseline
OC-GIT-004 Create MAP_V3
OC-CTRL-001 Determine TODO_LIST location
Stage 1 — P0 Security
OC-SEC-001 Website security assessment
OC-SEC-002 Product security assessment
Stage 2 — P1 Commercial/Product
OC-COM-001 Subscription, charges & tenant assessment
OC-PROD-001 Pre/post-migration product assessment
OC-GOV-001 Policy vs implementation audit
Stage 3 — P1 Cloud
OC-CLOUD-001 Secure cloud/environment assessment
Stage 4 — Demo
OC-DEMO-001 Customer demo security assessment
Stage 5 — Additional readiness
OC-READY-001 Additional readiness gap assessment

The exact sequence may change if a dependency is identified and approved.

16. Master Status Table
ID	Priority	Work Package	Status	OpenCode Report	ChatGPT Decision	Implementation	Validation
OC-GIT-001	P0	Review Git release process	NOT STARTED	—	—	—	—
OC-GIT-002	P0	Publish MAP_V2 baseline	BLOCKED	—	—	—	—
OC-GIT-003	P0	Mark MAP_V2 final baseline	BLOCKED	—	—	—	—
OC-GIT-004	P0	Create MAP_V3	BLOCKED	—	—	—	—
OC-CTRL-001	P0	Determine TODO_LIST location	BLOCKED	—	—	—	—
OC-SEC-001	P0	Website security	NOT STARTED	—	—	—	—
OC-SEC-002	P0	Product security	NOT STARTED	—	—	—	—
OC-COM-001	P1	Subscription/charges/tenants	NOT STARTED	—	—	—	—
OC-PROD-001	P1	Pre/post migration products	NOT STARTED	—	—	—	—
OC-GOV-001	P1	Policy vs implementation	NOT STARTED	—	—	—	—
OC-CLOUD-001	P1	Secure cloud environments	NOT STARTED	—	—	—	—
OC-DEMO-001	P1/P2	Customer demo security	NOT STARTED	—	—	—	—
OC-READY-001	P2	Additional readiness	NOT STARTED	—	—	—	—
17. OpenCode Reporting Standard

Every work package report must contain:

WORK PACKAGE:
ID:
DATE:
MAP VERSION:

OBJECTIVE:

FILES / SYSTEMS / POLICIES INSPECTED:

EXISTING IMPLEMENTATION:

FINDINGS:

RISKS:

GAPS:

DEPENDENCIES:

RECOMMENDATION:

PROPOSED CHANGES:

FILES EXPECTED TO CHANGE:

DATABASE CHANGES:

SECURITY IMPACT:

BACKWARD COMPATIBILITY IMPACT:

TEST PLAN:

EVIDENCE REQUIRED:

QUESTIONS / DECISIONS REQUIRED:

STATUS:
18. Approval States

ChatGPT / founder review uses these decisions:

APPROVED

Proceed with the proposed implementation.

APPROVED WITH CHANGES

Proceed only after incorporating the specified changes.

REJECTED

Do not implement the proposal.

MORE INFORMATION REQUIRED

Continue investigation; no implementation yet.

DEFERRED

The work package is valid but intentionally postponed because of priority/dependency.

19. Implementation Evidence Standard

When OpenCode says a task is complete, it must provide evidence.

Depending on the work package this may include:

Tests
Test results
Screenshots
Logs
Git commit
Changed files
Database migration results
Security scan results
Configuration evidence
Deployment evidence
Architecture diagrams
Policy mapping
Before/after behaviour
Rollback information

"Implemented" without evidence is not sufficient for a completed security, architecture or commercial work package.

20. Backward Compatibility

MAP_V3 must preserve existing MAP Nexus functionality unless a change has been explicitly approved.

For every material change OpenCode must state:

What existing behaviour is affected
Why the change is required
Whether existing tenants are affected
Whether existing data is affected
Whether existing APIs are affected
Whether existing reports are affected
Whether existing rules/controls are affected
Migration requirements
Rollback approach
21. Product Model Direction

MAP Nexus should evolve from being understood only as a post-migration validation platform toward a broader Migration Assurance platform supporting different customer assurance stages.

Conceptually:

                    MAP Nexus
                        |
             Migration Assurance
                        |
          +-------------+-------------+
          |             |             |
       PRE-MIGRATION  POST-MIGRATION  BOTH
          |             |             |
       Baseline       Validation     End-to-end
       Assurance      & Assurance    Assurance
          |             |             |
          +-------------+-------------+
                        |
                 Product / Revenue
                    Model
                        |
              Subscription / Charges

This is a product-direction principle, not permission to implement the model without assessment.

The existing policies must be checked first to determine whether this concept has already been documented.

22. Security / IP Protection Rules

OpenCode must never place the following into public-facing website, LinkedIn, demo or customer-facing material without explicit approval:

Source code
SQL
Internal architecture
Tenant identifiers
Customer information
Credentials
Secrets
Internal infrastructure details
Proprietary algorithms
Internal rule IDs
Internal control IDs
Private database structures
API keys
Connection strings

Current public positioning remains broad:

Migration Assurance & Data Validation

Modern cloud, hybrid and enterprise data environments

Current validated environments may be described as including:

Snowflake
Azure SQL
PostgreSQL

but MAP Nexus must not be positioned as limited to those technologies.

23. MAP_V2 / MAP_V3 Documentation Principle

MAP_V2 represents the final baseline before this next phase.

MAP_V3 represents controlled advancement.

The relationship must remain obvious to:

Edward
ChatGPT
OpenCode
Future developers
Future AI agents

A future agent should be able to determine:

What was MAP_V2?
What was the final MAP_V2 commit?
What changed in MAP_V3?
Why did it change?
Who/what approved it?
What evidence proves the change?

This traceability is a core requirement of the MAP_V3 development process.

24. First Instruction to OpenCode

OpenCode should begin with OC-GIT-001 only.

Initial instruction

Review the existing MAP Nexus Git/release process, specifically v5_05_task_management, v5_06_task_management and v5_07_task_management.

Treat the current MAP_V2 local folder as the final MAP_V2 candidate baseline.

Do not create MAP_V3 yet.

Do not modify product functionality.

Do not implement security, billing, tenancy, cloud or product changes.

First determine exactly how the last three releases were structured and published, how the current MAP_V2 state should be committed and pushed to GitHub, and how we should formally identify the resulting commit as the final MAP_V2 baseline before MAP_V3 is created.

Also inspect the existing documentation/policy folder structure and make an initial recommendation for where the future MAP_V3_TODO_LIST should live, but do not restructure it yet.

Report your findings using the MAP Nexus OpenCode Reporting Standard in this document.

Stop after the investigation and report. Do not proceed to OC-GIT-002 until the findings have been reviewed and approved.

25. Current Overall Status

MAP_V2: Existing final development baseline — awaiting formal GitHub baseline protection.

MAP_V3: Not yet created.

GitHub baseline: Must be established first.

MAP_V3 TODO location: OpenCode must investigate and recommend.

Security work: Not yet assessed under this workstream.

Commercial/subscription/tenant work: Existing implementation and policies must be reviewed before further development.

Pre/post migration product model: Newly elevated to an explicit MAP_V3 product/commercial work package.

Cloud migration: Assessment required before implementation.

Customer demos: Existing HTML/mock-data demos require a dedicated security/access assessment.

Governance: Policy-vs-implementation audit required.

26. Document Maintenance

