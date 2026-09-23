# OC-E2E-001 — MAP Nexus Product UI/Admin Integration Audit

**DATE:** 2026-09-17  
**STATUS:** PROPOSED — INVESTIGATION / VALIDATION ONLY  
**PROJECT:** MAP_V3  
**OBJECTIVE:** Audit the UI/Admin integration of MAP Nexus to identify gaps in the end-to-end product lifecycle.  

---  

## 1. Purpose  
MAP Nexus includes UI/Admin functionality for managing tenants, projects, and system connections. This audit validates that these UI/Admin features work cohesively within the existing product lifecycle.  

This audit is part of OC-E2E-001 and focuses specifically on the UI/Admin integration aspects of the product lifecycle.  

---  

## 2. Critical Rule — No Fixes During First Audit  
During the first audit:  

**DO NOT:**  
- modify application code  
- modify database schema  
- create new product functionality  
- redesign existing workflows  
- create duplicate models  
- create duplicate services  
- bypass application functionality  
- silently work around defects  
- change authentication/security controls  
- change subscription/entitlement logic  
- change validation engine behaviour  

If a step fails, **stop at that point where appropriate, record the failure and continue investigation only where doing so does not invalidate the evidence.** Do not fix the problem during this work package.  

The purpose is to establish an honest baseline of the current implementation.  

---  

## 3. First Inspect MAP_V3  
Inspect the existing UI/Admin implementation and documentation:  

- canonical MAP_V3 TODO/workstream structure  
- tenant lifecycle UI/Admin interfaces  
- user lifecycle UI/Admin interfaces  
- invitation flow UI/Admin interfaces  
- email verification UI/Admin interfaces  
- authentication UI/Admin interfaces  
- projects UI/Admin interfaces  
- systems UI/Admin interfaces  
- credentials/connections UI/Admin interfaces  
- subscription lifecycle UI/Admin interfaces  
- plans and entitlements UI/Admin interfaces  
- Stripe integration UI/Admin interfaces  
- website lead/contact registration flow UI/Admin interfaces  
- onboarding UI/Admin interfaces  
- discovery UI/Admin interfaces  
- dataset inventory UI/Admin interfaces  
- mappings UI/Admin interfaces  
- validation UI/Admin interfaces  
- reconciliation UI/Admin interfaces  
- results UI/Admin interfaces  
- reporting UI/Admin interfaces  
- audit UI/Admin interfaces  
- existing E2E/integration tests UI/Admin interfaces  
- existing test fixtures UI/Admin interfaces  
- existing environment/configuration documentation  

Do not assume filenames or locations. Identify the existing canonical implementation and documentation.  

---  

## 4. E2E Lifecycle to Validate  
Attempt to execute this lifecycle using the existing product UI/Admin interfaces.  

### Stage 1 — Customer Entry  
Determine the currently supported customer-entry mechanism via UI/Admin.  

Test the existing supported path, rather than inventing a new one.  

Possible path:  

- **Website registration/lead → Super Admin review**  
- **Super Admin creates/invites tenant administrator**  

Record which path is actually supported.  

---  

## 5. Tenant Lifecycle  
Validate:  

1. Tenant creation  
2. Tenant status  
3. Subscription association  
4. First administrator creation/invitation  
5. Invitation email  
6. Invitation acceptance  
7. Email verification  
8. Login  

Confirm that no password is emailed.  

Confirm tenant identity/isolation is derived from the authoritative authentication/session mechanism.  

---  

## 6. Subscription / Stripe Test Mode  
Validate the existing subscription implementation using **Stripe Test Mode**.  

Do not redesign the Stripe integration.  

Determine exactly what configuration is currently required.  

Required configuration includes the existing MAP Nexus variables:  

```text  
STRIPE_SECRET_KEY  
STRIPE_PUBLISHABLE_KEY  
STRIPE_WEBHOOK_SECRET  
STRIPE_PRICE_PROFESSIONAL_MONTHLY  
STRIPE_PRICE_PROFESSIONAL_ANNUAL  
STRIPE_PRICE_ENTERPRISE_MONTHLY  
STRIPE_PRICE_ENTERPRISE_ANNUAL  
STRIPE_PRICE_ENTERPRISE_PLUS_MONTHLY  
STRIPE_PRICE_ENTERPRISE_PLUS_ANNUAL  
```  

## Stripe Test Environment  

If a Stripe Test account/configuration is not currently available:  

**DO NOT invent credentials or modify application code.**  

Document exactly what is required to establish the test environment.  

If the available environment permits safe creation of Stripe Test Mode Products/Prices through the existing Stripe integration or approved tooling, document the procedure.  

Do not create production Stripe resources.  

Do not expose secrets in:  

- source code  
- Git  
- logs  
- evidence documents  
- screenshots  
- ChatGPT/OpenCode output  

---  

## 7. Project Lifecycle  
Validate:  

**Tenant → Project → Project selection/context**  

Confirm:  

* project creation  
* project listing  
* project selection  
* ProjectContext  
* project isolation  
* tenant/project relationship  

Test that a user cannot operate against another project within the same tenant where project isolation is required.  

---  

## 8. System / Connection Lifecycle  
Validate:  

**Project → System → Credential/Connection**  

Test:  

* source system creation  
* target system creation  
* system ownership  
* connection/credential creation  
* credential resolution  
* connection validation  
* source/target distinction  
* project isolation  

Do not create another credential model.  

Do not expose credential secrets in evidence.  

---  

## 13. Azure Source and Target Test Databases  
Create or provision **two controlled Azure SQL test databases** for this E2E exercise:  

* one SOURCE  
* one TARGET  

Use the existing MAP Nexus supported connection mechanism.  

The databases must contain controlled sample migration data sufficient to exercise the validation lifecycle.  

At minimum include:  

* primary-key data  
* numeric metric data  
* matching records  
* deliberately mismatched records  
* missing/extra records where appropriate  
* representative columns/types  
* enough rows to demonstrate actual discovery and validation  

The source and target datasets must be documented so that expected validation outcomes are known in advance.  

### Important  

These are **E2E test resources**, not a new MAP Nexus architecture.  

Do not modify MAP Nexus to accommodate them.  

Document:  

* Azure resource names  
* database names  
* schema/table names  
* test-data purpose  
* expected results  
* connection configuration requirements  
* cleanup/deletion procedure  

Do not place credentials/secrets in the evidence.  

---  

## 15. Discovery  
Run the existing Discovery workflow.  

Validate:  

**Connection → Discovery → Datasets → Columns**  

Confirm:  

* source discovery  
* target discovery  
* project ownership  
* dataset inventory  
* column discovery  
* data types  
* primary-key/inferred roles where applicable  
* discovery evidence/history where supported  

Record exactly what is discovered.  

---  

## 12. Mapping  
Run the existing mapping workflow.  

Validate:  

**Datasets → Table Mapping → Column Mapping**  

Confirm:  

* source dataset  
* target dataset  
* source/target table mapping  
* column mapping  
* mapping persistence  
* project isolation  
* compatibility with the existing validation engine  

Do not create a second mapping model.  

---  

## 13. Validation  
Run the existing validation lifecycle.  

Validate:  

* rule/control generation or assignment  
* validation execution  
* reconciliation  
* mismatches  
* failures  
* successful controls  
* execution status  
* checkpoints/recovery where practical  
* results  

The deliberately mismatched test data must produce the expected validation findings.  

---  

## 14. Reporting / Evidence  
Validate the existing reporting flow.  

Confirm that the lifecycle produces usable evidence for:  

* execution  
* control results  
* reconciliation  
* exceptions  
* governance/audit information  
* export/report output  

Determine whether the resulting evidence is sufficient to demonstrate:  

> migrated data is correct, complete, reconciled and ready for cutover  

Do not enhance reporting during this work package.  

---  

## 14. Security / Isolation Validation  
During the E2E lifecycle, verify where existing implementation allows:  

* tenant isolation  
* project isolation  
* authentication  
* authorisation  
* credential protection  
* no password leakage  
* no credential leakage  
* no token leakage  
* audit trail  
* subscription/entitlement enforcement  

Do not perform destructive security testing.  

Record any observed weakness as a finding.  

---  

## 15. Evidence Requirements  
For every lifecycle stage record:  

| Stage              | Result            | Evidence | Notes |  
| ------------------ | ----------------- | -------- | ----- |  
| Customer entry     | PASS/FAIL/BLOCKED | Evidence |       |  
| Tenant             | PASS/FAIL/BLOCKED | Evidence |       |  
| Invitation         | PASS/FAIL/BLOCKED | Evidence |       |  
| Email verification | PASS/FAIL/BLOCKED | Evidence |       |  
| Login              | PASS/FAIL/BLOCKED | Evidence |       |  
| Subscription       | PASS/FAIL/BLOCKED | Evidence |       |  
| Stripe             | PASS/FAIL/BLOCKED | Evidence |       |  
| Project            | PASS/FAIL/BLOCKED | Evidence |       |  
| Source system      | PASS/FAIL/BLOCKED | Evidence |       |  
| Target system      | PASS/FAIL/BLOCKED | Evidence |       |  
| Connections        | PASS/FAIL/BLOCKED | Evidence |       |  
| Discovery          | PASS/FAIL/BLOCKED | Evidence |       |  
| Mapping            | PASS/FAIL/BLOCKED | Evidence |       |  
| Validation         | PASS/FAIL/BLOCKED | Evidence |       |  
| Results            | PASS/FAIL/BLOCKED | Evidence |       |  
| Reporting          | PASS/FAIL/BLOCKED | Evidence |       |  

Use:  

* PASS = works as intended  
* FAIL = existing implementation does not work as intended  
* BLOCKED = cannot test because an external/configuration prerequisite is missing  
* NOT APPLICABLE = genuinely outside the current product scope  

---  

## 16. Classify Every Gap  
Every problem discovered must be classified as exactly one of:  

### A. Product Implementation Gap  
Required core functionality does not exist or does not work.  

### B. Configuration Gap  
Functionality exists but required configuration is missing.  

### C. Environment/Infrastructure Gap  
Required environment/resource is missing.  

### D. External Dependency  
Stripe, Azure, SMTP or another external dependency prevents testing.  

### E. Defect  
Existing functionality is implemented but behaves incorrectly.  

### F. Documentation Gap  
Functionality exists but the required setup/use is undocumented or unclear.  

### G. Scope Decision Required  
It is unclear whether the capability is intended to be part of MAP Nexus.  

Do not classify something as an implementation gap simply because the current test environment is not configured.  

---  

## 18. No Immediate Remediation  
For every gap, provide:  

* description  
* evidence  
* affected lifecycle stage  
* classification  
* severity  
* business impact  
* security impact  
* dependency  
* whether it blocks E2E completion  
* recommended next action  

Do not implement the recommended action.  

---  

## 19. Final E2E Assessment  
Produce a final assessment answering:  

### Can MAP Nexus currently complete the full lifecycle?  

**YES / PARTIALLY / NO**  

Then identify:  

1. Core functionality that demonstrably works  
2. Core functionality that does not work  
3. Configuration required  
4. Infrastructure required  
5. External dependencies  
5. Product gaps  
5. Defects  
8. Security concerns  
9. Documentation gaps  
10. Scope decisions required  
11. Critical blockers  
12. Non-critical gaps  
13. Recommended remediation order  

---  

## 20. Final Product Readiness Assessment  
Provide a separate high-level assessment against:  

### Customer Lifecycle  
- Tenant onboarding  
- User invitation  
- Email verification  
- Authentication  

### Commercial Lifecycle  
- Plans  
- Subscription  
- Checkout/payment  
- Stripe integration  
- Entitlements  
- Limits  
- Cancellation/payment state  

### Platform Lifecycle  
- Tenant  
- Project  
- System  
- Credentials/connections  

### Migration Lifecycle  
- Discovery  
- Dataset inventory  
- Mapping  
- Validation  
- Results  
- Reporting  
- Audit/evidence  

### Operational Lifecycle  
- Errors  
- Retry/recovery  
- Checkpointing  
- Isolation  
- Monitoring/logging where currently implemented  

Give each category:  

**READY / PARTIALLY READY / NOT READY**  

with evidence.  

---  

## 20. Required Deliverables  
Create/update only the appropriate canonical E2E documentation location after inspecting the existing structure.  

Produce:  

1. **E2E execution evidence**  
2. **E2E findings/gap assessment**  
3. **Azure test database setup documentation**  
4. **Stripe Test Mode setup/configuration requirements**  
5. **Final MAP Nexus lifecycle readiness assessment**  

Do not create duplicate documentation structures.  

---  

## 24. Completion Gate  
This work package is complete only when:  

* [ ] Existing MAP_V3 implementation inspected  
* [ ] Existing lifecycle documented  
* [ ] E2E lifecycle attempted  
* [ ] Azure source database available  
* [ ] Azure target database available  
* [ ] Controlled test data documented  
* [ ] Stripe Test Mode requirements identified  
* [ ] Stripe lifecycle tested where configuration permits  
* [ ] Tenant lifecycle tested  
* [ ] Invitation tested  
* [ ] Email verification tested  
* [ ] Subscription tested  
* [ ] Project tested  
* [ ] Systems tested  
* [ ] Connections tested  
* [ ] Discovery tested  
* [ ] Mapping tested  
* [ ] Validation tested  
* [ ] Results tested  
* [ ] Reporting tested  
* [ ] Security/isolation observations recorded  
* [ ] Every gap classified  
* [ ] No fixes implemented during baseline run  
* [ ] Final readiness assessment produced  

---  

## 24. Final Rule  
**Do not implement anything discovered during this E2E exercise.**  

The objective is to establish an honest, evidence-based answer to:  

> **“Can MAP Nexus currently operate as a complete product from customer onboarding through migration validation and evidence?”**  

Only after ChatGPT reviews the E2E evidence will remediation work packages be authorised.  

(End of file - total 653 lines)