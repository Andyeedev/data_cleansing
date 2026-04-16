📄 Architecture.md
## Architecture

ExecutionEngine
 ├── DBConnector (Engine DB)
 ├── Adapters (Source/Target)
 ├── Intelligence Pipeline
 │    ├── Profiling
 │    ├── Matching
 │    ├── FK Inference
 │    ├── Graph
 │    ├── Scoring
 │    └── Explainability
 ├── Rule Engine (C01–C10)
 └── Governance + Scoring

Multi-SaaS:
- project_id scoped
- batch_id scoped