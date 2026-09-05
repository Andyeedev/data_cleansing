# Azure Cloud Database Integration & Connection Validation — Implementation Task

## Objective

Set up a controlled Azure test environment for MAP and register the resulting databases through the existing MAP Connection Management system.

The purpose is to prove that MAP can:

1. Provision Azure databases.
2. Create realistic migration-validation test data.
3. Register source and target connections in MAP.
4. Successfully connect to both databases from MAP.
5. Discover schemas/tables/columns.
6. Execute existing validation/discovery functionality against the cloud databases.
7. Delete and recreate the Azure test databases when required.

This is a **test/integration environment**, not production infrastructure.

---

# 1. Mandatory Stop Gate

Before making changes:

1. Inspect the existing MAP codebase.
2. Locate the existing:

   * Client management
   * Project management
   * Connection management
   * Connection/database models
   * Connection API
   * Connection UI
   * Credential/secret handling
   * Database discovery
   * Dataset discovery
   * Migration execution
   * Existing PostgreSQL source/target connection implementation
3. Determine exactly how a source and target connection are currently registered.
4. Reuse existing functionality wherever possible.

**Do NOT create a second connection-management system.**

If existing functionality can support Azure PostgreSQL and Azure SQL by configuration/extension, extend it rather than creating duplicate services, models, routes, hooks, or database tables.

Do not modify existing application architecture until the assessment is complete.

---

# 2. Azure Test Environment

Create two Azure database environments for the first test client/project:

```text
Client 1
└── Project 001
    ├── Source: Azure PostgreSQL
    └── Target: Azure SQL
```

The databases must be real Azure resources and accessible from the MAP development environment.

Use Azure resources appropriate for a development/test workload and minimise unnecessary cost.

Before provisioning, inspect the repository for existing Terraform/Azure infrastructure conventions and reuse them where practical.

Prefer infrastructure-as-code so the databases can be destroyed and recreated reliably.

---

# 3. Required Azure Resources

Provision:

### Source

Azure Database for PostgreSQL — Flexible Server

```text
database_type = AZURE_POSTGRESQL
role = SOURCE
```

### Target

Azure SQL Database

```text
database_type = AZURE_SQL
role = TARGET
```

Configure networking/firewall/security so MAP can connect securely from the approved development environment.

Do NOT expose the databases broadly to the public internet unnecessarily.

Document:

* Azure resource names
* Resource group
* Region
* Server/database names
* Ports
* Authentication method
* Firewall/network configuration
* Required environment variables
* How to connect
* How to destroy
* How to recreate

Do NOT commit passwords, connection strings containing passwords, or secrets to Git.

---

# 4. Credential Management

Inspect the existing MAP credential architecture first.

If MAP already supports secure credential references, use it.

If Azure Key Vault integration already exists, use Azure Key Vault.

Otherwise:

* Do not introduce plaintext database passwords into source code.
* Do not commit secrets.
* Use environment variables or the existing secret-reference mechanism for the development test.
* Clearly document the credential reference.

The final MAP connection record should contain a reference to credentials rather than storing the password directly where possible.

---

# 5. MAP Connection Registration

The Azure databases MUST be registered through the existing MAP Connection Management system.

Create:

```text
Client 1
└── Project 001
    ├── Connection: Client1-Project001-AzurePostgreSQL-Source
    │   Type: Azure PostgreSQL
    │   Role: SOURCE
    │
    └── Connection: Client1-Project001-AzureSQL-Target
        Type: Azure SQL
        Role: TARGET
```

Do not manually bypass MAP's connection-management layer unless the existing architecture requires it.

The registration must use the same connection-management mechanisms used by the existing local PostgreSQL connections.

Verify that MAP can:

* Save the connection
* Retrieve the connection
* Test the connection
* Report connection success/failure
* Identify source vs target
* Associate the connection with Client 1 / Project 001

---

# 6. Second Test Configuration

Also prepare the MAP configuration structure for:

```text
Client 2
└── Project 002
    ├── Source: PostgreSQL
    └── Target: Azure PostgreSQL
```

Do not provision unnecessary additional Azure resources unless required.

The objective is to prove that the connection-management model supports different database types and cloud/local combinations.

If an existing local PostgreSQL database can be reused for Client 2, use it.

Register:

```text
Client2-Project002-PostgreSQL-Source
Client2-Project002-AzurePostgreSQL-Target
```

---

# 7. Test Data

Create **10 sample tables** designed specifically for migration-validation testing.

Each table must contain **5 rows initially**.

The tables must cover different validation scenarios rather than being 10 copies of the same structure.

Use realistic financial/business data.

Recommended scenarios:

### Table 1 — Customers

Purpose:

* Primary key
* Text fields
* Basic row-count validation

Columns:

```text
customer_id
customer_name
email
status
created_at
```

### Table 2 — Accounts

Purpose:

* Foreign key relationship
* Numeric balances

```text
account_id
customer_id
account_type
balance
currency
```

### Table 3 — Transactions

Purpose:

* Numeric aggregation
* Financial reconciliation

```text
transaction_id
account_id
transaction_date
transaction_type
amount
```

### Table 4 — Products

Purpose:

* Standard reference data
* Text/code validation

```text
product_id
product_code
product_name
category
unit_price
```

### Table 5 — Orders

Purpose:

* Parent/child relationship
* Numeric totals

```text
order_id
customer_id
order_date
order_status
order_total
```

### Table 6 — Order Items

Purpose:

* Foreign keys
* Quantity/value calculations

```text
order_item_id
order_id
product_id
quantity
line_total
```

### Table 7 — Employee Records

Purpose:

* Date fields
* Nullable values
* Text validation

```text
employee_id
employee_name
department
salary
employment_status
```

### Table 8 — Branches

Purpose:

* Geographic/reference data

```text
branch_id
branch_code
branch_name
region
active_flag
```

### Table 9 — Account Snapshots

Purpose:

* Numeric data drift
* Date-based reconciliation

```text
snapshot_id
account_id
snapshot_date
opening_balance
closing_balance
```

### Table 10 — Customer Risk

Purpose:

* Boolean/status fields
* Nullable values
* Data-type validation

```text
risk_id
customer_id
risk_score
risk_category
review_required
```

Every table must contain exactly 5 initial test rows.

Where practical, create relationships using foreign keys.

---

# 8. Migration Scenarios

The test data must allow MAP's existing validation rules to detect controlled differences between source and target.

Create documented scenarios for:

1. Exact match
2. Row-count mismatch
3. Missing target row
4. Duplicate primary key
5. Numeric balance mismatch
6. Null-value difference
7. Data-type difference
8. Referential-integrity difference
9. Column-count/schema difference
10. Data drift

Initially load the target with matching data.

Then provide scripts/data modifications that deliberately introduce each scenario.

Do NOT permanently corrupt the baseline dataset.

The preferred structure is:

```text
azure-test-data/
├── baseline/
├── scenarios/
│   ├── rowcount_mismatch.sql
│   ├── duplicate_key.sql
│   ├── numeric_drift.sql
│   ├── null_difference.sql
│   ├── datatype_difference.sql
│   ├── referential_integrity.sql
│   ├── schema_difference.sql
│   └── ...
└── reset/
```

---

# 9. Reset Capability

The environment MUST be reproducible.

Provide scripts/commands to:

```text
create Azure databases
        ↓
create schemas/tables
        ↓
load 5 baseline rows per table
        ↓
register connections in MAP
        ↓
test connectivity
        ↓
run validation tests
        ↓
reset test data
        ↓
destroy Azure databases
        ↓
recreate Azure databases
```

There must be a clear way to reset the test data to the original baseline.

---

# 10. Destroy/Recreate Capability

We MUST be able to delete and recreate both Azure databases.

Prefer Terraform or the repository's existing infrastructure-as-code approach.

Provide documented commands such as:

```text
provision
destroy
recreate
seed
reset
test-connection
```

The exact commands should follow the existing repository tooling.

Do not implement destructive commands without making the target environment explicit.

For example, never allow a generic `destroy` command to accidentally target production Azure resources.

---

# 11. MAP Connectivity Test

After provisioning and registration, test from MAP:

### Test A

```text
Azure PostgreSQL → Azure SQL
```

Verify:

* TCP/network connectivity
* Authentication
* Database connection
* Schema discovery
* Table discovery
* Column discovery
* Dataset mapping compatibility
* Existing validation engine compatibility

### Test B

```text
PostgreSQL → Azure PostgreSQL
```

Verify the same capabilities where applicable.

Record the results.

---

# 12. Existing MAP Functionality Must Be Reused

Before creating anything, specifically inspect and reuse:

* Connection Management
* Client/Project management
* Connection models
* Connection APIs
* Connection UI
* Database adapters
* PostgreSQL adapter
* SQL Server/Azure SQL adapter if present
* Dataset discovery
* Rule discovery
* Validation execution
* Existing Terraform/Azure configuration

Do not create duplicate implementations.

If Azure SQL can use an existing SQL Server adapter, extend/use that adapter rather than creating an entirely separate implementation.

If Azure PostgreSQL can use the existing PostgreSQL adapter, extend/use it rather than duplicating PostgreSQL connectivity.

---

# 13. Deliverables

Before implementation, create:

```text
Phase_12_Cloud_Connection_Integration/
├── 12_0_Scope_Document.md
├── 12_1_Work_Breakdown_Structure.md
├── 12_2_Assessment.md
├── 12_3_Azure_Architecture.md
├── 12_4_Implementation_Plan.md
├── 12_5_Minimum_Change_Proposal.md
├── 12_6_Test_Data_Scenarios.md
└── 12_7_Approval_Record.md
```

**STOP after these governance documents are created.**

Do NOT provision Azure resources or modify MAP code until the implementation plan and minimum-change proposal have been approved.

After approval, implement the approved plan.

At completion create:

```text
12_8_Closure_Report.md
12_9_Connection_Test_Report.md
12_10_Azure_Destroy_Recreate_Runbook.md
```

---

# 14. Mandatory Governance

Follow:

`00_Mandatory_Implementation_Gates.md`

The following gates are mandatory:

1. Existing implementation assessment
2. Existing frontend/backend connection-management review
3. Azure architecture review
4. Minimum-change proposal
5. Explicit approval
6. Implementation
7. Verification
8. Closure report

No implementation before explicit approval.

---

# 15. Final Success Criteria

The task is complete only when:

* [ ] Azure PostgreSQL exists
* [ ] Azure SQL exists
* [ ] Both are reachable from MAP
* [ ] Both are registered in MAP Connection Management
* [ ] Client 1 / Project 001 source and target are correctly associated
* [ ] Client 2 / Project 002 connection structure is registered
* [ ] 10 test tables exist
* [ ] Each table contains 5 baseline rows
* [ ] Source and target baseline data match
* [ ] Controlled validation scenarios exist
* [ ] MAP can discover the cloud schemas/tables
* [ ] MAP can execute validation against the cloud databases
* [ ] Reset capability works
* [ ] Destroy capability works
* [ ] Recreate capability works
* [ ] No secrets committed to Git
* [ ] No duplicate connection-management architecture created
* [ ] All governance and closure documents are complete


## Strategy Revision: 

12_8_Connection_Adapter_Integration_Strategy.md supersedes the connection-combination approach wherever the two conflict. All future Phase 12 implementation must follow the connection-by-connection adapter strategy.


## Critical Instruction

**Do not start coding or provisioning immediately.**

First inspect the existing MAP implementation and produce the governance documents and minimum-change proposal.

STOP and wait for explicit approval before making changes.
