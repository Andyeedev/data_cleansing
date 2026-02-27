fs-migration-validation-engine/
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── app/
│   ├── main.py
│   ├── config_loader.py
│   ├── db_connector.py
│   ├── execution_engine.py
│   ├── scoring_engine.py
│   └── logger.py
│
├── rules/
│   ├── C01/
│   │   ├── completeness_check.sql
│   ├── C02/
│   │   ├── financial_reconciliation.sql
│   ├── C03/
│   ├── C04/
│   ├── C05/
│   ├── C06/
│   ├── C07/
│   ├── C08/
│   ├── C09/
│   └── C10/
│
├── metadata/
│   ├── control_seed.sql
│   ├── rule_seed.sql
│
├── config/
│   ├── client_config.yaml
│
└── README.md
