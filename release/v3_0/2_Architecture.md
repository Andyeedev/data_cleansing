Architecture Highlights
Engine DB = source of truth
Client DB connections resolved dynamically
No hardcoded source/target configs
Version

v3.0 (Stable baseline)


---

## 📄 `Architecture.md`

```md
# Architecture (v3.0)

## Layers

### 1. Execution Engine
- Orchestrates batch execution
- Handles DAG dependencies
- Supports checkpoint recovery

### 2. Connection Resolver
- Reads system_registry
- Builds adapters dynamically
- Injects credentials

### 3. Database Adapters
- Postgres (active)
- SQL Server (disabled for now)
- Extensible factory pattern

### 4. Rule Engine
- Auto rule discovery
- Control execution
- Result persistence

### 5. Governance Layer
- Scoring engine
- Release gate enforcement
- Anomaly detection

---

## Data Flow

config.yaml
   ↓
engine_db (Postgres)
   ↓
system_registry
   ↓
connection_resolver
   ↓
adapters (SOURCE / TARGET)
   ↓
execution_engine
   ↓
rule execution
   ↓
results + governance

---

## Key Tables
- system_registry
- system_credentials
- control_registry
- migration_batch_registry
- migration_control_execution
- batch_execution_checkpoint

---

## Design Principles
- DB-driven configuration
- Loose coupling via adapters
- Fault tolerance via checkpoints
- Extensibility for new DB types