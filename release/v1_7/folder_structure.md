fs-migration-validation-engine/
│
├── app/
│   ├── main.py
│   ├── execution_engine.py
│   │
│   ├── core/
│   │   ├── db_manager.py
│   │   ├── rule_factory.py
│   │   ├── parameter_builder.py
│   │   ├── safe_sql_runner.py
│   │   └── config_loader.py
│   │
│   ├── discovery/
│   │   ├── auto_rule_discovery.py
│   │   ├── column_role_inference.py
│   │   └── rule_capability_checker.py
│   │
│   ├── rules/
│   │   ├── C01_rowcount_rule.py
│   │   ├── C02_sum_compare_rule.py
│   │   ├── C03_referential_integrity_rule.py
│   │   ├── C04_column_count_rule.py
│   │   ├── C05_null_check_rule.py
│   │   ├── C06_data_type_match_rule.py
│   │   ├── C07_duplicate_detection_rule.py
│   │   ├── C08_data_drift_detection_rule.py
│   │   ├── C09_referential_coverage_rule.py
│   │   └── C010_schema_drift_rule.py
│   │
│   ├── governance/
│   │   ├── governance_engine.py
│   │   └── anomaly_detector.py
│   │
│   ├── scoring/
│   │   └── scoring_engine.py
│   │
│   └── observability/
│       ├── exception_logger.py
│       └── control_summary_builder.py
│
│
├── config/
│   └── config.yaml
│
├── sql/
│   ├── engine_schema.sql
│   ├── governance_procedures.sql
│   └── seed_data.sql
│
├── docs/
│   ├── architecture.md
│   ├── rule_catalog.md
│   └── governance_model.md
│
├── tests/
│   └── test_engine_run.py
│
├── scripts/
│   └── run_engine.ps1
│
├── logs/
│   └── engine.log
│
├── requirements.txt
├── README.md
├── LICENSE
└── .gitignore