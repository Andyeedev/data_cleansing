# Proposed Naming Convention for OC-COM-001d Documents

## Convention Format
`OC-COM-001d_PHASE#_d_SCOPENAME_TYPE`

Where:
- `OC-COM-001d` = Workstream identifier (fixed)
- `PHASE#` = Phase number (0-6)
- `d` = Workstream identifier (d for OC-COM-001d)
- `SCOPENAME` = Descriptive scope label (snake_case)
- `TYPE` = Document type (spec, evidence, audit_report, assessment, checklist, migration, evidence_report)

---

## Current Files → Proposed New Names

### Phase 0 - Gate & Specification

| Current Name | Proposed New Name | Type |
|--------------|-------------------|------|
| OC-COM-001d_Audit_Report.md | `OC-COM-001d_PHASE0_d_audit_report` | audit_report |
| OC-COM-001d_SaaS_Customer_Experience_Implementation.md | `OC-COM-001d_PHASE0_d_implementation_spec` | spec |

### Phase 1 - P0 Correctness

| Current Name | Proposed New Name | Type |
|--------------|-------------------|------|
| OC-COM-001d_PHASE1_COMPLETE.md | `OC-COM-001d_PHASE1_d_tenant_project_isolation_complete` | evidence_report |
| OC-COM-001d_PHASE1_EVIDENCE.md | `OC-COM-001d_PHASE1_d_tenant_project_isolation_evidence` | evidence |

### Phase 2 - P1 Journey (Welcome/Onboarding)

| Current Name | Proposed New Name | Type |
|--------------|-------------------|------|
| (embedded in main spec) | `OC-COM-001d_PHASE2_d_welcome_onboarding_wizard_evidence` | evidence |

### Phase 3 - P2 Subscription/Billing

| Current Name | Proposed New Name | Type |
|--------------|-------------------|------|
| (embedded in main spec §19) | `OC-COM-001d_PHASE3_d_subscription_billing_evidence` | evidence |
| OC-COM-001d_Phase_3_Approved_Check_List.md | `OC-COM-001d_PHASE3_d_subscription_billing_checklist` | checklist |
| OC-COM-001d_Phase3_subscription_status.sql | `OC-COM-001d_PHASE3_d_subscription_status_migration` | migration |

### Phase 4 - P3 Usage UX

| Current Name | Proposed New Name | Type |
|--------------|-------------------|------|
| (in main spec §20) | `OC-COM-001d_PHASE4_d_dashboard_limits_evidence` | evidence |
| (in main spec §20) | `OC-COM-001d_PHASE4_d_onboarding_limits_evidence` | evidence |
| (in main spec §20) | `OC-COM-001d_PHASE4_d_subscription_pricing_evidence` | evidence |

### Phase 5 - P4 Suspension UX

| Current Name | Proposed New Name | Type |
|--------------|-------------------|------|
| (to be created) | `OC-COM-001d_PHASE5_d_suspended_blocked_screens_evidence` | evidence |
| (to be created) | `OC-COM-001d_PHASE5_d_session_expiry_evidence` | evidence |
| (to be created) | `OC-COM-001d_PHASE5_d_hardening_verification_evidence` | evidence |

### Phase 6 - Tests + Evidence

| Current Name | Proposed New Name | Type |
|--------------|-------------------|------|
| (to be created) | `OC-COM-001d_PHASE6_d_full_test_suite_evidence` | evidence |

---

### Migration Files (in engineering/MAP_V3/02_Output/00_MAP_V3_Control/migrations/)

| Current Name | Proposed New Name |
|--------------|-------------------|
| OC-COM-001a_commercial_schema.sql | `OC-COM-001a_PHASE1_d_commercial_schema_migration` |
| OC-COM-001b_stripe_columns.sql | `OC-COM-001b_PHASE1_d_stripe_columns_migration` |
| OC-COM-001d_Phase3_subscription_status.sql | `OC-COM-001d_PHASE3_d_subscription_status_migration` |
| OC-SEC-005_add_token_version.sql | `OC-SEC-005_PHASE1_d_token_version_migration` |

---

### Related Workstreams (for reference)

| Workstream | Example New Name |
|------------|------------------|
| OC-COM-001a | `OC-COM-001a_PHASE1_a_commercial_schema_spec` |
| OC-COM-001b | `OC-COM-001b_PHASE1_b_stripe_billing_spec` |
| OC-COM-001c | `OC-COM-001c_PHASE0_c_saas_lifecycle_architecture_spec` |
| OC-COM-001e | `OC-COM-001e_PHASE0_e_identity_access_lifecycle_spec` |
| OC-PROD-001 | `OC-PROD-001_PHASE0_prod_pre_post_migration_assessment` |

---

## Benefits of This Convention

1. **Sortable** - Files sort naturally by phase then scope
2. **Self-documenting** - Phase, workstream, scope, and type all in filename
3. **Searchable** - Easy to find all Phase 3 files: `OC-COM-001d_PHASE3_*`
4. **Type clarity** - Instantly know if it's a spec, evidence, checklist, migration, etc.
5. **Workstream isolation** - `d` prefix prevents collision with a/b/c/e workstreams

---

## Implementation Notes

- Only rename files in `engineering/MAP_V3/02_Output/00_MAP_V3_Control/` and `.../migrations/`
- Update any internal references in markdown files after rename
- Keep the main spec (`OC-COM-001d_SaaS_Customer_Experience_Implementation.md`) as the canonical Phase 0 spec but rename to `OC-COM-001d_PHASE0_d_implementation_spec`
- Evidence files from each phase get their own file rather than embedded in main spec