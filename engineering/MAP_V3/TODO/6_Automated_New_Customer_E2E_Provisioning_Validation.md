# TODO — Automated New-Customer E2E Provisioning & Validation

## Objective

Design and implement, after approval, an automated MAP Nexus end-to-end customer setup and validation process.

The objective is to allow us to repeatedly prove that a brand-new MAP Nexus customer can progress through the complete lifecycle:

New Tenant
→ Subscription
→ First Admin/User
→ Email Verification
→ Login
→ Project
→ Source Connection
→ Target Connection
→ Connection Test
→ Discovery
→ Dataset/Column Discovery
→ Mapping
→ Validation Controls
→ Validation Execution
→ Results
→ Evidence/Audit/Report

## IMPORTANT — INSPECT BEFORE IMPLEMENTING

Do NOT immediately create a new framework.

First inspect the existing MAP Nexus implementation and determine:

1. Existing tenant provisioning flow.
2. Existing subscription/trial creation.
3. Existing user/first-admin creation.
4. Existing email verification flow.
5. Existing project creation.
6. Existing system/connection configuration.
7. Existing credential/credential_ref mechanism.
8. Existing connection testing.
9. Existing discovery workflow.
10. Existing mapping workflow.
11. Existing rule/control discovery.
12. Existing execution workflow.
13. Existing results/reporting/evidence.
14. Existing automated tests/E2E tests.
15. Existing configuration/YAML/environment mechanisms.

Determine what can be reused.

Do not create duplicate onboarding, provisioning, connection, discovery, mapping or execution architecture.

## Design Requirement

Recommend a parameter-driven E2E mechanism rather than hard-coding customer/environment information.

Determine the appropriate configuration model, for example:

* customer/tenant information
* subscription/plan
* admin user
* source connection parameters
* target connection parameters
* credential references
* project information
* discovery configuration
* mapping configuration
* validation configuration

Secrets must NOT be stored in source code or committed configuration.

## Connection Support

The mechanism must support the connection types already successfully established by MAP Nexus.

Identify the exact parameters required for each supported connection type and determine whether the current frontend and backend already expose/configure those parameters correctly.

## Execution

The final mechanism should be capable of:

1. Creating a completely new test customer.
2. Creating the subscription/trial.
3. Creating the first admin.
4. Completing verification.
5. Creating a project.
6. Configuring source and target.
7. Testing connections.
8. Running discovery.
9. Creating/reviewing mappings.
10. Generating validation controls.
11. Running validation.
12. Collecting results.
13. Producing an auditable evidence package.

## Safety

The automation must clearly distinguish:

* test environment
* customer environment
* source
* target

It must never accidentally operate against a real customer tenant or production data.

## Phase 1 — READ ONLY

First produce a design/assessment only.

Do not implement anything.

Report:

* what existing components can be reused
* what parameters are required
* proposed configuration format
* secret handling
* execution sequence
* evidence output
* reset/cleanup strategy
* gaps requiring product changes

STOP after the design assessment.
