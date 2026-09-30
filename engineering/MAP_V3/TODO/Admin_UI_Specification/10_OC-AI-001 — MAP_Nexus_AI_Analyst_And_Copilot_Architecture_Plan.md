Prepare an architecture and implementation plan for a future premium MAP Nexus capability:

# I Analyst / Copilot

# OC-AI-001 — MAP Nexus AI Analyst And Copilot Architecture Plan

THIS IS A PLAN-ONLY REQUEST.

Do NOT implement.
Do NOT create migrations.
Do NOT modify code.
Do NOT commit.

## Objective

Design an AI-assisted analysis capability similar conceptually to an enterprise Copilot.

The user should be able to use natural language to investigate their authorised MAP Nexus data and eventually create analysis/report outputs.

Example capabilities:

* analyse validation results
* investigate failed controls
* explain reconciliation differences
* identify anomalies
* compare migration runs
* analyse datasets
* summarise governance findings
* answer questions about authorised migration data
* recommend further analysis
* generate report definitions for Report & Analytics Studio

Example request:

"Show me the datasets with the largest reconciliation differences."

or:

"Why did this control fail?"

or:

"Create a report showing the top migration exceptions."

## CRITICAL: EXISTING AI IMPLEMENTATION

There is already an AI chatbot implementation in:

`MAP_V2\03_Source\frontend`

Before proposing anything:

1. Inspect the existing implementation.
2. Identify frontend components.
3. Identify backend services/API calls.
4. Identify model/provider integration.
5. Identify prompt handling.
6. Identify authentication/security.
7. Identify whether any useful code can be migrated/reused.
8. Identify what should NOT be reused.

Do NOT create a second chatbot architecture without first reconciling the existing implementation.

## CUSTOMER-OWNED / CUSTOMER-CONFIGURED LLM

The target premium capability should support high-end customers configuring their own approved LLM provider/model.

Evaluate an architecture such as:

Customer
→ MAP Nexus AI Gateway
→ Customer-approved LLM provider
→ MAP Nexus governed tools/data
→ response

MAP Nexus should not need to own or train the customer's model.

Determine how the platform could support provider/model configuration without coupling the product to one LLM vendor.

Do not assume a particular provider.

## SECURITY PRINCIPLE

The LLM must NEVER receive unrestricted database access.

Do NOT design:

AI → arbitrary SQL → database

Prefer:

AI
→ authorised MAP Nexus tool
→ existing MAP Nexus service
→ existing RBAC/tenant/object/entitlement enforcement
→ controlled result
→ AI

The AI must operate under the same:

Role
→ Permission
→ Entitlement
→ Tenant/Object Scope

model already approved for MAP Nexus.

## AI tool architecture

Evaluate a controlled tool catalogue such as:

* get validation results
* get failed controls
* get reconciliation differences
* get dataset metadata
* get mapping information
* get governance findings
* compare validation runs
* retrieve authorised report data
* create report definition
* explain result

Determine which existing APIs/services can be reused.

Do not duplicate business logic inside the AI layer.

## Tenant isolation

The AI must never allow a user to prompt their way around tenant security.

For example:

A Tenant Admin belonging to Tenant A must not be able to ask:

"Show me Tenant B's results."

The AI gateway/tool layer must enforce the same backend authorization as normal UI/API access.

Super Admin tenant context must follow the approved Phase C tenant-view model.

## Custom model configuration

Assess how enterprise customers could configure:

* provider
* model
* endpoint where applicable
* API credential/reference
* model capabilities
* token/context limits
* enabled tools
* usage limits

Credentials must use the existing approved credential/security approach.

Do NOT store raw provider API keys in ordinary application tables unless the existing security architecture explicitly supports that.

## AI usage controls

Assess requirements for:

* tenant-level AI entitlement
* user permissions
* usage limits
* token/cost tracking
* request history
* audit logging
* rate limiting
* model selection
* disabled tools
* administrator controls

Use the existing entitlement architecture.

Do not invent a second subscription system.

## AI conversation history

Assess whether conversations should be:

* temporary
* saved
* user-owned
* tenant-owned
* shareable
* auditable
* exportable

Recommend the simplest V1 model.

## Report Studio integration

The future architecture should allow:

User:
"Analyse the failed reconciliation controls."

AI:
analysis

User:
"Turn that into a report."

AI:
creates a governed Report & Analytics Studio definition.

The AI should create a report definition/configuration, not bypass the reporting system.

## Explainability

Assess how AI responses can show supporting evidence:

* dataset
* batch
* control
* rule
* metric
* source
* timestamp

Avoid presenting unsupported conclusions as facts.

## Enterprise positioning

Treat AI as a premium/add-on capability.

Potential commercial structure:

* AI Analyst
* AI Copilot
* Customer Model / BYO-LLM
* Advanced AI Analytics

These are proposals only.

Reconcile with the existing subscription/entitlement architecture.

## Required output

Return:

1. Existing MAP_V2 AI reconciliation
2. Existing MAP_V3 AI capabilities
3. Recommended AI architecture
4. Customer-owned LLM architecture
5. AI Gateway design
6. Tool/function architecture
7. Security model
8. RBAC integration
9. Tenant isolation
10. Entitlement/add-on model
11. Credential/security model
12. Conversation model
13. Usage/cost controls
14. Audit model
15. Report Studio integration
16. Existing code/services reusable
17. New components/services required
18. Database impact
19. API impact
20. Frontend impact
21. V1 capability scope
22. Later capability roadmap
23. Risks/discrepancies
24. Acceptance criteria

## HARD ARCHITECTURAL RULES

Do not create:

* a second validation engine
* a second reporting engine
* a second permission system
* a second tenant-security model
* unrestricted AI database access
* a second chatbot implementation without reconciling MAP_V2 first

The AI is an orchestration/analysis layer over existing MAP Nexus capabilities.

No implementation.
No migration.
No commit.
