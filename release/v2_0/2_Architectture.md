📊 2. ARCHITECTURE.md
Writing
Architecture – Financial Migration Validation Engine v2.0
Layers
1. Metadata Layer (core schema)
tenants
projects
system_registry
dataset_mappings
dataset_columns
rule_dataset_mapping
2. Execution Layer (engine schema)
control_registry
rule_registry
migration_batch_registry
migration_control_execution
migration_control_summary
3. Resilience Layer
checkpointing
retry engine
timeout control
dependency graph execution
Execution Flow
Batch Registered
Controls Loaded
Rules Discovered (AutoRuleDiscovery)
Parallel Execution
Checkpoints Saved
Results Stored
Governance Evaluated
Key Design Principles
Metadata-driven execution
Idempotent processing
Parallel-safe execution
Restartable batches
Extensible rule engine
Known Limitations (v2.0)
No automatic table discovery
No automatic column mapping
Manual onboarding required
Future Enhancements
Metadata discovery engine
Auto mapping layer
UI / API orchestration layer