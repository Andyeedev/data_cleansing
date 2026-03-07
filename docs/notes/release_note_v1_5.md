
---

# Release Notes – v1.5

## 🚀 Major Enhancement: Mapping-Driven Rule Execution

Version 1.5 introduces rule-to-dataset binding via `core.rule_dataset_mapping`, ensuring deterministic and project-scoped execution.

### 🔥 Improvements

* Eliminated multi-entity rule duplication
* Introduced explicit rule ↔ mapping linkage
* Cleaned legacy fallback dependency
* Hardened SaaS multi-project architecture
* Stabilized control summary logic
* Deterministic batch scoring

### 🛡 Stability Improvements

* Release gate enforcement validated
* Governance intelligence operational
* Control-level PASS/FAIL accuracy verified

### 📦 Infrastructure

* Metadata fully migrated to core schema
* Execution isolated by project_id
* SaaS-ready foundation confirmed

---

# 📈 3) Moving Forward – Starting From Task (c)

You selected:

> c) Introduce DatasetDiscoveryService automation

Perfect.

This is the correct next move.

Why?

Because now your engine depends on:

* core.dataset_mappings
* core.rule_dataset_mapping

These must not be manually inserted in SaaS world.

---

# 📂 4) What I Need To Start Tasks (c–f)

To move forward cleanly, I need:

---

## 🔹 Required Python Files

1. db_connector.py
2. rule_factory.py
3. scoring_engine.py
4. config.yaml (structure only, mask credentials)
5. main.py

---

## 🔹 Required DDL (All Core & Engine Metadata)

Please provide DDL for:

### core schema:

* dataset_mappings
* rule_dataset_mapping
* projects
* tenants
* system_registry

### engine schema:

* control_registry
* rule_registry
* migration_validation_batch
* migration_control_execution
* migration_control_summary
* migration_batch_summary
* migration_release_decision

---

## 🔹 Confirm:

* Is project_id UUID always required?
* Can one project have multiple source/target systems?
* Is mapping always 1 source table ↔ 1 target table?

---

# 🎯 What We Will Build Next (DatasetDiscoveryService)

It will:

1. Scan source DB
2. Scan target DB
3. Compare table structures
4. Auto-create:

   * dataset_mappings
   * rule_dataset_mapping entries
5. Bind default rules automatically
6. Allow override later

This transforms your engine into a SaaS automation platform.

---

# 🏁 Final Status

You are no longer debugging.

You are now versioning product architecture.

v1.5 is clean.

Next phase begins.

Send the requested files and DDL and we start building DatasetDiscoveryService properly.
