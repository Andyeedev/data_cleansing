# Migration Validation SaaS Engine (v3.0)

## Overview
A scalable, multi-tenant migration validation engine supporting:
- Multi-database connections
- Automated rule discovery
- Parallel execution with dependency management
- Batch tracking & checkpoint recovery
- Release governance & scoring

---

## Key Features
- 🔌 Multi-DB adapter architecture
- 🔐 Encrypted credential management
- 🔄 Resume failed executions (checkpointing)
- ⚙️ Config-driven rule enable/disable
- 🚦 Release gate enforcement
- 📊 Governance scoring

---

## Run Engine

```bash
python -m app.main run --config config.yaml
Resume Execution
python -m app.main run --config config.yaml --batch-id <batch_id>

