Filename: OC-COM-001f_VALIDATION_CAPACITY_RESOURCE_PROTECTION.md
Folder: engineering/MAP_V3/04_Documentation/Commercial/

Future capacity scope
We have agreed a future MAP Nexus capability that MUST NOT be forgotten.

Create a **scope/specification only** for a future work package covering:

**Validation Capacity, Fair-Use & Resource Protection**

Context / commercial decision:

* Professional = £25,000/year + one-off implementation fee.
* Professional entitlement currently includes:

  * 3 projects
  * 5 users
  * 6 systems (2 source/target systems per project)
* Validation is included in the subscription.
* Customers should NOT be charged per validation rerun.
* Customers should be able to rerun validation repeatedly during a migration.
* Reruns are therefore subject to capacity/fair-use controls, NOT an arbitrary number-of-runs limit.
* Exceptionally large or complex workloads may require additional capacity and/or separately quoted professional services.
* A large customer system must NOT be allowed to overwhelm MAP Nexus or degrade other tenants.

Future capability should investigate/specify:

1. Validation workload/capacity measurement.
2. Fair-use model.
3. Maximum/concurrent validation workload by plan.
4. Job queueing, throttling and controlled worker execution.
5. CPU/memory/database protection.
6. Query timeout/cancellation and expensive-query protection.
7. Large dataset handling without loading entire datasets into application memory.
8. Tenant isolation and protection from one customer consuming shared resources.
9. How an oversized job is detected and what happens:

   * run normally,
   * queue/throttle,
   * require additional capacity,
   * or require a bespoke commercial quote.
10. Monitoring, metrics, audit and operational alerts.
11. Commercial relationship between:

* subscription,
* one-off implementation/onboarding,
* included validation capacity,
* additional capacity/professional services.

12. Benchmarking required before setting actual numeric limits.

IMPORTANT:

* This is a FUTURE capability only.
* Do NOT implement anything.
* Do NOT modify database schema, code, pricing, entitlements or execution behaviour.
* Do NOT invent numeric capacity limits.
* Inspect the existing MAP_V3 architecture and execution engine sufficiently to identify where this capability would integrate.
* Reuse existing execution, concurrency, timeout, checkpointing and recovery architecture where appropriate; do not propose a second execution architecture.
* Do not create a second entitlement/capacity model if an existing model can be extended.
* Preserve the current Professional/Enterprise/Enterprise Plus commercial structure.
* The goal is to ensure this requirement is formally captured so it cannot be forgotten.

First inspect the existing MAP_V3 TODO/workstream/document structure and place the scope in the existing canonical location rather than creating a parallel tracking mechanism.

Return:

1. Exact file/location created.
2. Proposed work-package ID/title.
3. Short scope.
4. Existing MAP_V3 components this will eventually integrate with.
5. Dependencies.
6. Classification of implementation size/complexity.
7. Explicit statement that no implementation/code/schema/pricing changes were made.
