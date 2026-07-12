# Test Data Management — Migration Assurance Platform (MAP)

| Field | Value |
|-------|-------|
| **Document** | Test Data Management |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Owner** | MAP Data Engineering & QA Team |
| **Classification** | Internal |
| **Platform** | Migration Assurance Platform (MAP) |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Terminology](#3-terminology)
4. [Synthetic Data Generation](#4-synthetic-data-generation)
5. [Anonymisation & PII Handling](#5-anonymisation--pii-handling)
6. [Data Masking](#6-data-masking)
7. [Seed Data Management](#7-seed-data-management)
8. [Refresh Strategy](#8-refresh-strategy)
9. [Data Ownership & Governance](#9-data-ownership--governance)
10. [Compliance & Regulatory](#10-compliance--regulatory)
11. [Test Data Lifecycle](#11-test-data-lifecycle)
12. [Data Profiles & Patterns](#12-data-profiles--patterns)
13. [Recommended Tools](#13-recommended-tools)
14. [Best Practices](#14-best-practices)
15. [Dependencies](#15-dependencies)
16. [Appendices](#16-appendices)
17. [Revision History](#17-revision-history)
18. [Approval](#18-approval)

---

## 1. Purpose

### 1.1 Objective

This document defines the authoritative test data management (TDM) standards for the **Migration Assurance Platform (MAP)**. It establishes processes, controls, and governance mechanisms that ensure test data is created, maintained, refreshed, and retired in a manner that supports rigorous testing while protecting sensitive information and maintaining regulatory compliance.

### 1.2 Goals

| Goal | Description |
|------|-------------|
| **G1** | Provide realistic, high-quality test data that exercises all migration scenarios |
| **G2** | Protect personally identifiable information (PII) through systematic anonymisation and masking |
| **G3** | Enable deterministic, reproducible test execution through version-controlled data |
| **G4** | Reduce test environment costs through efficient data provisioning and lifecycle management |
| **G5** | Maintain compliance with GDPR, CCPA, and financial services data regulations |
| **G6** | Establish clear ownership and governance accountability for all test data assets |

### 1.3 Audience

- Data Engineers & Data Architects
- QA / Test Engineers
- Migration Architects
- Database Administrators
- Compliance & Audit Teams
- DevOps / SRE Engineers
- Security Officers
- Product Owners

### 1.4 Normative References

| Reference | Description |
|-----------|-------------|
| Batch 08 — Database Architecture | Canonical database design, schemas, partitioning strategies |
| Batch 14 — Data Testing | Data testing standards, validation, reconciliation |
| DAMA DMBOK | Data management body of knowledge |
| ISO 27001 | Information security management |
| ISO 25012 | Data quality model |
| OWASP Testing Guide | Application security testing practices |

---

## 2. Scope

### 2.1 In Scope

| Area | Coverage |
|------|----------|
| Synthetic Data | Generation of realistic test datasets for all MAP modules |
| Anonymisation | PII detection, classification, and protection in test data |
| Masking | Static masking, dynamic masking, and tokenisation techniques |
| Seed Data | Reference data, configuration data, lookup tables, master data |
| Refresh Strategy | Scheduled and on-demand data refresh procedures |
| Data Governance | Ownership, accountability, lifecycle, and compliance |
| Tooling | Recommended tools, frameworks, and automation platforms |
| Profiles | Data patterns, constraints, relationships, and distributions |

### 2.2 Out of Scope

| Area | Rationale |
|------|-----------|
| Production data provisioning | Production data management governed separately |
| Application-level test data | Unit test fixtures managed within application codebases |
| Infrastructure provisioning | Cloud resource provisioning covered in Batch 05 |
| Business intelligence data | BI reporting data managed by analytics teams |

---

## 3. Terminology

| Term | Definition |
|------|------------|
| **TDM** | Test Data Management — the discipline of provisioning test data |
| **PII** | Personally Identifiable Information — data that can identify an individual |
| **Synthetic Data** | Artificially generated data that mimics real-world patterns |
| **Data Masking** | Process of obfuscating sensitive data while preserving structure |
| **Tokenisation** | Replacing sensitive data with non-reversible tokens |
| **Static Masking** | One-time, permanent transformation of data at rest |
| **Dynamic Masking** | Real-time, query-level data transformation for consumers |
| **Seed Data** | Baseline reference and configuration data required for system operation |
| **Data Profile** | Statistical and structural description of a dataset |
| **Gold Copy** | Authoritative, validated version of test data |
| **Data Fabric** | Integrated data management layer across environments |
| **Lineage** | Record of data origin, transformations, and usage |
| **Data Vault** | Controlled storage area for versioned test datasets |
| **PII Scanner** | Automated tool that detects and classifies sensitive data |

---

## 4. Synthetic Data Generation

### 4.1 Overview

Synthetic data generation produces realistic, artificially created datasets that simulate production data characteristics without exposing actual sensitive information. For MAP, synthetic data is the primary mechanism for populating non-production environments.

### 4.2 Data Generation Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Rule-Based** | Generates data from explicit business rules and constraints | Reference data, lookup tables |
| **Statistical** | Uses statistical distributions to create realistic numeric data | Financial amounts, quantities |
| **Machine Learning** | Trains models on production patterns to generate new records | Complex, multi-field datasets |
| **Template-Based** | Fills predefined structures with randomised values | Forms, documents, reports |
| **Schema-Driven** | Reads database schemas and generates conforming records | Database migration testing |
| **Property-Based** | Generates data based on property specifications and invariants | Edge case discovery |

### 4.3 Realism Requirements

| Dimension | Requirement | Validation Method |
|-----------|-------------|-------------------|
| **Distribution** | Numeric fields must match production distributions | Kolmogorov-Smirnov test |
| **Correlation** | Related fields must maintain realistic correlations | Pearson correlation coefficient |
| **Temporal** | Date/time patterns must reflect real business cycles | Seasonal decomposition analysis |
| **Cardinality** | Cardinality of categorical fields must match production | Frequency distribution comparison |
| **Null Patterns** | Null/missing data patterns must be realistic | Null percentage validation |
| **Volume** | Dataset sizes must match or exceed production volumes | Record count and storage metrics |

### 4.4 Synthetic Data Generation Example

```python
# MAP Synthetic Data Generator — Customer Migration Records
from faker import Faker
from dataclasses import dataclass, field
from typing import List, Optional
from decimal import Decimal
import random
from datetime import date, timedelta

fake = Faker('en_GB')

@dataclass
class CustomerRecord:
    customer_id: str
    first_name: str
    last_name: str
    date_of_birth: date
    national_id: str
    email: str
    phone: str
    address_line_1: str
    address_line_2: Optional[str]
    city: str
    postcode: str
    country: str
    account_opened: date
    credit_limit: Decimal
    account_status: str
    risk_rating: str

@dataclass
class SyntheticDataGenerator:
    """Generate realistic customer records for MAP migration testing."""
    
    record_count: int
    seed: int = 42
    _records: List[CustomerRecord] = field(default_factory=list)
    
    def __post_init__(self):
        random.seed(self.seed)
        Faker.seed(self.seed)
    
    def generate(self) -> List[CustomerRecord]:
        status_weights = {'ACTIVE': 0.7, 'INACTIVE': 0.15, 'CLOSED': 0.1, 'SUSPENDED': 0.05}
        risk_weights = {'LOW': 0.5, 'MEDIUM': 0.3, 'HIGH': 0.15, 'CRITICAL': 0.05}
        
        for i in range(self.record_count):
            dob = fake.date_of_birth(minimum_age=18, maximum_age=90)
            account_opened = fake.date_between(start_date='-20y', end_date='today')
            
            credit_limit = Decimal(str(random.choice([
                500, 1000, 2000, 5000, 10000, 25000, 50000, 100000
            ])))
            
            record = CustomerRecord(
                customer_id=f"CUST{str(i + 1).zfill(8)}",
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                date_of_birth=dob,
                national_id=fake.ssn(),
                email=fake.email(),
                phone=fake.phone_number(),
                address_line_1=fake.street_address(),
                address_line_2=fake.secondary_address() if random.random() > 0.4 else None,
                city=fake.city(),
                postcode=fake.postcode(),
                country='GB',
                account_opened=account_opened,
                credit_limit=credit_limit,
                account_status=random.choices(
                    list(status_weights.keys()),
                    weights=list(status_weights.values())
                )[0],
                risk_rating=random.choices(
                    list(risk_weights.keys()),
                    weights=list(risk_weights.values())
                )[0]
            )
            self._records.append(record)
        
        return self._records
    
    def get_statistics(self) -> dict:
        if not self._records:
            return {}
        
        statuses = {}
        risks = {}
        credit_limits = []
        
        for r in self._records:
            statuses[r.account_status] = statuses.get(r.account_status, 0) + 1
            risks[r.risk_rating] = risks.get(r.risk_rating, 0) + 1
            credit_limits.append(float(r.credit_limit))
        
        return {
            'total_records': len(self._records),
            'status_distribution': statuses,
            'risk_distribution': risks,
            'credit_limit_stats': {
                'mean': sum(credit_limits) / len(credit_limits),
                'min': min(credit_limits),
                'max': max(credit_limits)
            }
        }
```

### 4.5 Data Generation Matrix

| MAP Module | Dataset | Volume (Test) | Volume (UAT) | Generation Method |
|------------|---------|---------------|---------------|-------------------|
| Customer Migration | Customer master | 50,000 | 500,000 | Schema-driven + Statistical |
| Account Migration | Account records | 150,000 | 1,500,000 | Rule-based + Template |
| Transaction Migration | Transaction history | 1,000,000 | 10,000,000 | Statistical + ML |
| Loan Migration | Loan portfolios | 25,000 | 250,000 | Property-based |
| Document Migration | Document metadata | 200,000 | 2,000,000 | Template-based |
| Reference Data | Codes and lookups | 5,000 | 5,000 | Rule-based (seed) |

---

## 5. Anonymisation & PII Handling

### 5.1 PII Classification

| Classification | Examples | Handling Requirement |
|----------------|----------|---------------------|
| **Level 1 — Critical** | National ID, passport numbers, biometrics | Must never appear in test data; use fully synthetic equivalents |
| **Level 2 — Sensitive** | Name, email, phone, address | Must be anonymised or masked before test use |
| **Level 3 — Internal** | Employee IDs, internal codes | Tokenisation or pseudonymisation acceptable |
| **Level 4 — Public** | Product names, codes, public rates | No anonymisation required |

### 5.2 PII Detection Methods

| Method | Description | Tool |
|--------|-------------|------|
| **Pattern Matching** | Regex-based detection of structured PII (SSN, email, etc.) | Custom scanner |
| **Contextual Analysis** | NLP-based detection of unstructured PII in text fields | spaCy / Presidio |
| **Schema Annotation** | Metadata-driven classification from data dictionaries | MAP TDM portal |
| **Statistical Profiling** | Anomaly detection for unusual data patterns | Great Expectations |
| **Manual Review** | Expert review for edge cases and ambiguous fields | Data stewards |

### 5.3 Anonymisation Techniques

| Technique | Reversibility | Security Level | Use Case |
|-----------|---------------|----------------|----------|
| **Redaction** | None | High | Remove PII entirely (e.g., `***REDACTED***`) |
| **Pseudonymisation** | Reversible with key | Medium | Replace with consistent fake values |
| **Generalisation** | None | Medium | Reduce precision (e.g., age ranges) |
| **Perturbation** | None | Low-Medium | Add noise to numeric values |
| **Aggregation** | None | High | Summarise data to prevent individual identification |
| **k-Anonymity** | None | Medium-High | Ensure each record is indistinguishable from k-1 others |

### 5.4 PII Handling Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PII HANDLING WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   DETECT     │───▶│  CLASSIFY    │───▶│   APPLY      │      │
│  │   PII        │    │  PII Level   │    │   MASKING    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   PII        │    │  Create      │    │  Validate    │      │
│  │   Scanner    │    │  Policy      │    │  Results     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                  │              │
│                                                  ▼              │
│                                         ┌──────────────┐       │
│                                         │  APPROVE     │       │
│                                         │  & LOG       │       │
│                                         └──────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 PII Scan Results Template

```json
{
  "scan_id": "PII-SCAN-2026-001",
  "target_database": "map_test_customer",
  "scan_date": "2026-07-01",
  "results": {
    "total_columns_scanned": 127,
    "pii_columns_detected": 14,
    "critical_pii": [
      {
        "table": "customers",
        "column": "national_id",
        "classification": "LEVEL_1",
        "detection_method": "PATTERN_MATCHING",
        "recommended_action": "REPLACE_WITH_SYNTHETIC"
      }
    ],
    "sensitive_pii": [
      {
        "table": "customers",
        "column": "email",
        "classification": "LEVEL_2",
        "detection_method": "SCHEMA_ANNOTATION",
        "recommended_action": "PSEUDONYMISE"
      },
      {
        "table": "customers",
        "column": "phone_number",
        "classification": "LEVEL_2",
        "detection_method": "PATTERN_MATCHING",
        "recommended_action": "MASK"
      }
    ],
    "status": "ACTION_REQUIRED",
    "scan_duration_seconds": 34
  }
}
```

---

## 6. Data Masking

### 6.1 Static Masking

Static masking applies irreversible transformations to data at rest. Once applied, the original values cannot be recovered.

| Technique | Input | Output | Use Case |
|-----------|-------|--------|----------|
| **Full Replacement** | `John Smith` | `Robert Jones` | Name fields |
| **Partial Masking** | `4532-1234-5678-9012` | `4532-XXXX-XXXX-9012` | Card numbers |
| **Date Shifting** | `15/03/1985` | `15/03/1992` (shifted) | Date of birth |
| **Number Perturbation** | `50000` | `52300` (+4.6%) | Financial amounts |
| **Hashing (salted)** | `PII_VALUE` | `a3f8b2c1d4...` | Unique identifiers |
| **Lookup Replace** | `12345` | `67890` | Reference codes |
| **Null Replacement** | `NULL` | `[MASKED]` | Nullable PII fields |

### 6.2 Static Masking Implementation

```python
# MAP Static Masking Engine
import hashlib
from typing import Dict, Callable
from dataclasses import dataclass
from decimal import Decimal

@dataclass
class MaskingRule:
    column: str
    technique: str
    parameters: Dict
    reversible: bool = False

class StaticMaskingEngine:
    """Apply irreversible masking transformations to test datasets."""
    
    def __init__(self, salt: str = 'MAP_TDM_SALT_2026'):
        self.salt = salt
        self._techniques: Dict[str, Callable] = {
            'full_replacement': self._full_replacement,
            'partial_mask': self._partial_mask,
            'date_shift': self._date_shift,
            'number_perturb': self._number_perturb,
            'hash_mask': self._hash_mask,
            'email_mask': self._email_mask,
        }
    
    def apply_rule(self, value: str, rule: MaskingRule) -> str:
        technique = self._techniques.get(rule.technique)
        if not technique:
            raise ValueError(f"Unknown technique: {rule.technique}")
        return technique(value, rule.parameters)
    
    def _full_replacement(self, value: str, params: Dict) -> str:
        replacements = params.get('replacements', {})
        return replacements.get(value, '[MASKED]')
    
    def _partial_mask(self, value: str, params: Dict) -> str:
        show_first = params.get('show_first', 2)
        show_last = params.get('show_last', 2)
        mask_char = params.get('mask_char', '*')
        mask_length = len(value) - show_first - show_last
        return value[:show_first] + mask_char * mask_length + value[-show_last:]
    
    def _date_shift(self, value: str, params: Dict) -> str:
        from datetime import datetime, timedelta
        days_shift = params.get('days_shift', 365)
        date_format = params.get('format', '%d/%m/%Y')
        original_date = datetime.strptime(value, date_format)
        shifted = original_date + timedelta(days=days_shift)
        return shifted.strftime(date_format)
    
    def _number_perturb(self, value: str, params: Dict) -> str:
        variance_pct = params.get('variance_percent', 5.0)
        original = float(value)
        variance = original * (variance_pct / 100)
        import random
        perturbed = original + random.uniform(-variance, variance)
        if isinstance(original, int):
            return str(int(perturbed))
        return str(round(perturbed, 2))
    
    def _hash_mask(self, value: str, params: Dict) -> str:
        import hmac
        algo = params.get('algorithm', 'sha256')
        h = hmac.new(self.salt.encode(), value.encode(), algo)
        return h.hexdigest()[:16]
    
    def _email_mask(self, value: str, params: Dict) -> str:
        if '@' not in value:
            return '[MASKED_EMAIL]'
        local, domain = value.split('@', 1)
        masked_local = local[0] + '***' + local[-1] if len(local) > 2 else '***'
        return f"{masked_local}@{domain}"


# Example usage
engine = StaticMaskingEngine()
masking_rules = [
    MaskingRule('national_id', 'hash_mask', {'algorithm': 'sha256'}),
    MaskingRule('email', 'email_mask', {}),
    MaskingRule('phone', 'partial_mask', {'show_first': 3, 'show_last': 4}),
    MaskingRule('date_of_birth', 'date_shift', {'days_shift': 1825, 'format': '%d/%m/%Y'}),
]
```

### 6.3 Dynamic Masking

Dynamic masking applies transformations at query time, allowing different consumers to see different levels of data based on their role and clearance.

| Role | Masking Level | Example Output |
|------|---------------|----------------|
| **Migration Engineer** | Full access (non-prod) | `John Smith` → `John Smith` |
| **QA Tester** | Partial mask | `John Smith` → `J*** S****` |
| **UAT Participant** | Tokenised | `John Smith` → `USR-7842` |
| **Auditor** | Aggregated only | `Customer count: 15,234` |
| **External Vendor** | Redacted | `John Smith` → `[REDACTED]` |

### 6.4 Dynamic Masking Implementation

```sql
-- MAP Dynamic Masking View — Customer Data
-- Different masking levels for different consumer roles

CREATE OR REPLACE VIEW vw_customer_masked AS
SELECT 
    -- Full access for migration engineers (session context required)
    CASE 
        WHEN CURRENT_SESSION() = 'MIGRATION_ENG' 
        THEN customer_id 
        ELSE HASH_CONSISTENT(customer_id) 
    END AS customer_id,
    
    -- Partial mask for QA testers
    CASE 
        WHEN CURRENT_SESSION() = 'QA_TESTER'
        THEN CONCAT(LEFT(first_name, 1), '***')
        ELSE first_name 
    END AS first_name,
    
    -- Redacted for external vendors
    CASE 
        WHEN CURRENT_SESSION() = 'EXT_VENDOR'
        THEN '[REDACTED]'
        ELSE last_name 
    END AS last_name,
    
    -- Tokenised for UAT participants
    CASE 
        WHEN CURRENT_SESSION() = 'UAT_USER'
        THEN CONCAT('USR-', CAST(HASH_CONSISTENT(email) AS VARCHAR(8)))
        ELSE email 
    END AS email,
    
    -- Generalised for auditors
    CASE 
        WHEN CURRENT_SESSION() = 'AUDITOR'
        THEN CONCAT(CAST(YEAR(date_of_birth) AS VARCHAR), '-XX-XX')
        ELSE date_of_birth 
    END AS date_of_birth,
    
    -- Aggregated for external reporting
    CASE 
        WHEN CURRENT_SESSION() = 'EXT_REPORTING'
        THEN '[AGGREGATED]'
        ELSE CONCAT('£', FORMAT(credit_limit, 2))
    END AS credit_limit

FROM customers;
```

### 6.5 Tokenisation

Tokenisation replaces sensitive data with non-reversible tokens that maintain referential integrity for joins and lookups.

| Token Type | Format | Example | Use Case |
|------------|--------|---------|----------|
| **UUID Token** | `TOK-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | `TOK-a1b2c3d4-e5f6-7890-abcd-ef1234567890` | General PII |
| **Numeric Token** | `TOK-NNNNNNNN` | `TOK-98765432` | ID fields |
| **Format-Preserving** | Same format as original | `4532-XXXX-XXXX-9012` | Card numbers |
| **Consistent Token** | Same input → same token | `TOK-abc123` (always) | Referential integrity |
| **Random Token** | Different each time | `TOK-xyz789` | One-time use |

### 6.6 Tokenisation Implementation

```python
# MAP Tokenisation Service
import uuid
import hashlib
from typing import Dict, Optional
from dataclasses import dataclass

@dataclass
class TokenVault:
    """Secure vault mapping original values to tokens."""
    
    _token_map: Dict[str, str] = None
    _reverse_map: Dict[str, str] = None
    _salt: str = 'MAP_TOKENISATION_SALT_2026'
    
    def __post_init__(self):
        if self._token_map is None:
            self._token_map = {}
        if self._reverse_map is None:
            self._reverse_map = {}
    
    def generate_token(self, value: str, prefix: str = 'TOK') -> str:
        if value in self._token_map:
            return self._token_map[value]
        
        # Create deterministic token for consistency
        token_id = hashlib.sha256(
            f"{self._salt}{value}".encode()
        ).hexdigest()[:12].upper()
        
        token = f"{prefix}-{token_id}"
        self._token_map[value] = token
        self._reverse_map[token] = value
        
        return token
    
    def detokenise(self, token: str) -> Optional[str]:
        return self._reverse_map.get(token)
    
    def export_vault(self) -> Dict[str, str]:
        """Export vault for secure archival (token → original mapping)."""
        return dict(self._reverse_map)
    
    def vault_size(self) -> int:
        return len(self._token_map)


class TokenisationService:
    """Provide tokenisation services for MAP test data."""
    
    def __init__(self, vault: Optional[TokenVault] = None):
        self.vault = vault or TokenVault()
    
    def tokenise_column(
        self, 
        values: list, 
        prefix: str = 'TOK',
        consistent: bool = True
    ) -> list:
        if consistent:
            return [self.vault.generate_token(v, prefix) for v in values]
        else:
            return [f"{prefix}-{uuid.uuid4().hex[:12].upper()}" for _ in values]
    
    def tokenise_record(self, record: dict, fields: list, prefix: str = 'TOK') -> dict:
        masked = dict(record)
        for field in fields:
            if field in masked:
                masked[field] = self.vault.generate_token(str(masked[field]), prefix)
        return masked


# Usage example
service = TokenisationService()
customers = [
    {'id': 'C001', 'email': 'alice@example.com', 'phone': '07700900123'},
    {'id': 'C002', 'email': 'bob@example.com', 'phone': '07700900456'},
]

tokenised = [service.tokenise_record(c, ['email', 'phone']) for c in customers]
# Result: emails and phones replaced with consistent tokens
```

---

## 7. Seed Data Management

### 7.1 Seed Data Categories

| Category | Description | Example | Maintenance |
|----------|-------------|---------|-------------|
| **Reference Data** | Codes, enums, controlled vocabularies | Country codes, currency codes | Quarterly review |
| **Configuration Data** | System settings, parameters | Migration thresholds, batch sizes | Per release |
| **Lookup Tables** | Cross-reference data | Product-to-category mappings | Monthly refresh |
| **Master Data** | Core business entities | Customer types, account types | Annual review |
| **Template Data** | Structural templates | Report layouts, form definitions | Per release |
| **Test Fixtures** | Scenario-specific datasets | Regression test data | Per sprint |

### 7.2 Seed Data Structure

```
seed-data/
├── reference/
│   ├── country_codes.csv
│   ├── currency_codes.csv
│   ├── product_types.csv
│   ├── account_statuses.csv
│   └── risk_ratings.csv
├── configuration/
│   ├── migration_settings.yaml
│   ├── batch_config.yaml
│   ├── validation_rules.yaml
│   └── notification_templates.yaml
├── lookup/
│   ├── product_category_map.csv
│   ├── branch_region_map.csv
│   ├── fee_structure.csv
│   └── regulatory_codes.csv
├── master/
│   ├── customer_types.yaml
│   ├── account_types.yaml
│   ├── transaction_types.yaml
│   └── document_types.yaml
└── fixtures/
    ├── regression/
    │   ├── edge_cases_customers.csv
    │   └── boundary_accounts.csv
    ├── performance/
    │   └── bulk_load_1M.csv
    └── uat/
        ├── scenario_01_happy_path.csv
        ├── scenario_02_missing_data.csv
        └── scenario_03_invalid_records.csv
```

### 7.3 Reference Data Examples

```yaml
# seed-data/reference/country_codes.yaml
apiVersion: v1
kind: ReferenceData
metadata:
  name: country_codes
  version: "2026.07"
  owner: "MAP Reference Data Team"
  last_updated: "2026-07-01"

spec:
  source: ISO 3166-1 alpha-2
  description: "Standard country codes for MAP migration"
  validation:
    format: "^[A-Z]{2}$"
    required: true
    
data:
  - code: "GB"
    name: "United Kingdom"
    region: "Europe"
    currency: "GBP"
    active: true
    
  - code: "US"
    name: "United States"
    region: "Americas"
    currency: "USD"
    active: true
    
  - code: "DE"
    name: "Germany"
    region: "Europe"
    currency: "EUR"
    active: true
    
  - code: "FR"
    name: "France"
    region: "Europe"
    currency: "EUR"
    active: true
    
  - code: "JP"
    name: "Japan"
    region: "Asia Pacific"
    currency: "JPY"
    active: true
```

```yaml
# seed-data/configuration/migration_settings.yaml
apiVersion: v1
kind: Configuration
metadata:
  name: migration_settings
  version: "2026.07"
  owner: "MAP Migration Architecture Team"

spec:
  description: "Core migration configuration for MAP"
  
settings:
  batch_processing:
    batch_size: 10000
    max_concurrent_batches: 4
    retry_attempts: 3
    retry_delay_seconds: 30
    checkpoint_interval: 5000
    
  validation:
    strict_mode: true
    max_error_rate_percent: 0.1
    required_fields:
      - customer_id
      - account_id
      - transaction_id
      - source_system
      - migration_timestamp
    null_tolerance_fields:
      - customer_id: 0
      - email: 5
      - phone: 10
      
  performance:
    parallel_threads: 8
    memory_limit_mb: 4096
    chunk_size: 50000
    
  logging:
    log_level: "INFO"
    log_format: "JSON"
    include_pii_in_logs: false
```

### 7.4 Seed Data Loading Process

```python
# MAP Seed Data Loader
import yaml
import csv
from pathlib import Path
from typing import Dict, List, Any
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class SeedDataManifest:
    path: str
    version: str
    owner: str
    checksum: str
    load_order: int
    dependencies: List[str]

class SeedDataLoader:
    """Load and validate seed data into MAP test environments."""
    
    def __init__(self, seed_data_root: str, target_db):
        self.root = Path(seed_data_root)
        self.db = target_db
        self.manifest: List[SeedDataManifest] = []
    
    def discover_seed_data(self) -> List[SeedDataManifest]:
        """Discover all seed data files and build load manifest."""
        manifest = []
        
        for yaml_file in self.root.rglob('*.yaml'):
            with open(yaml_file) as f:
                content = yaml.safe_load(f)
            
            meta = content.get('metadata', {})
            manifest.append(SeedDataManifest(
                path=str(yaml_file),
                version=meta.get('version', '0.0.0'),
                owner=meta.get('owner', 'Unknown'),
                checksum=self._calculate_checksum(yaml_file),
                load_order=self._determine_load_order(yaml_file),
                dependencies=meta.get('dependencies', [])
            ))
        
        self.manifest = sorted(manifest, key=lambda m: m.load_order)
        return self.manifest
    
    def load_seed_data(self, dry_run: bool = False) -> Dict[str, Any]:
        """Load seed data in dependency order."""
        results = {'loaded': 0, 'skipped': 0, 'errors': []}
        
        for item in self.manifest:
            try:
                if self._check_dependencies_met(item):
                    if dry_run:
                        logger.info(f"[DRY RUN] Would load: {item.path}")
                    else:
                        self._load_file(item)
                        results['loaded'] += 1
                        logger.info(f"Loaded: {item.path} v{item.version}")
                else:
                    results['skipped'] += 1
                    logger.warning(f"Skipped (unmet deps): {item.path}")
            except Exception as e:
                results['errors'].append({
                    'file': item.path,
                    'error': str(e)
                })
                logger.error(f"Error loading {item.path}: {e}")
        
        return results
    
    def _calculate_checksum(self, file_path: Path) -> str:
        import hashlib
        with open(file_path, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()[:16]
    
    def _determine_load_order(self, file_path: Path) -> int:
        path_str = str(file_path)
        if 'reference' in path_str:
            return 1
        elif 'configuration' in path_str:
            return 2
        elif 'lookup' in path_str:
            return 3
        elif 'master' in path_str:
            return 4
        else:
            return 5
    
    def _check_dependencies_met(self, item: SeedDataManifest) -> bool:
        loaded_versions = {m.path: m.version for m in self.manifest[:self.manifest.index(item)]}
        for dep in item.dependencies:
            if dep not in loaded_versions:
                return False
        return True
    
    def _load_file(self, item: SeedDataManifest):
        with open(item.path) as f:
            content = yaml.safe_load(f)
        
        data = content.get('data', [])
        table_name = Path(item.path).stem
        
        if data:
            columns = data[0].keys()
            placeholders = ', '.join(['%s'] * len(columns))
            col_names = ', '.join(columns)
            
            for row in data:
                values = list(row.values())
                self.db.execute(
                    f"INSERT INTO {table_name} ({col_names}) VALUES ({placeholders})",
                    values
                )
```

### 7.5 Seed Data Validation

| Validation Rule | Description | Severity |
|-----------------|-------------|----------|
| **Uniqueness** | Primary keys must be unique | Critical |
| **Referential Integrity** | Foreign keys must reference valid records | Critical |
| **Format Compliance** | Values must match defined formats | High |
| **Range Check** | Numeric values within acceptable ranges | High |
| **Completeness** | Required fields must not be null | Critical |
| **Consistency** | Related data must be logically consistent | High |
| **Freshness** | Data must not be older than defined threshold | Medium |
| **Version Match** | Data version must match manifest version | High |

---

## 8. Refresh Strategy

### 8.1 Refresh Frequency Matrix

| Environment | Data Volume | Refresh Frequency | Trigger | Downtime |
|-------------|-------------|-------------------|---------|----------|
| **Development** | 10% prod | On-demand (weekly) | Manual | None |
| **Integration** | 25% prod | Weekly | Scheduled (Sun 02:00) | None |
| **QA/Staging** | 50% prod | Bi-weekly | Scheduled (Sun 02:00) | None |
| **UAT** | 100% prod | Monthly | Scheduled (1st Sun) | 2 hours |
| **Performance** | 150% prod | Per test cycle | Manual | 4 hours |
| **Pre-production** | 100% prod | Per release | Manual | 2 hours |

### 8.2 Refresh Procedures

```
┌─────────────────────────────────────────────────────────────────┐
│                 DATA REFRESH PROCEDURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: PREPARATION (T-24h)                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ • Notify stakeholders of pending refresh             │      │
│  │ • Verify source system availability                  │      │
│  │ • Validate masking rules are current                 │      │
│  │ • Snapshot current environment state                 │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Phase 2: EXTRACTION (T-4h)                                    │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ • Extract production data snapshot                   │      │
│  │ • Apply PII detection scan                           │      │
│  │ • Generate extraction checksums                      │      │
│  │ • Validate row counts and sampling                   │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Phase 3: TRANSFORMATION (T-2h)                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ • Apply static masking rules                         │      │
│  │ • Execute tokenisation for sensitive fields          │      │
│  │ • Apply data volume adjustments                      │      │
│  │ • Validate transformation integrity                  │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Phase 4: LOADING (T-0)                                        │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ • Truncate target environment                        │      │
│  │ • Load transformed data                              │      │
│  │ • Rebuild indexes and constraints                    │      │
│  │ • Update statistics                                  │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Phase 5: VALIDATION (T+1h)                                    │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ • Run data validation suite                          │      │
│  │ • Verify masking effectiveness                       │      │
│  │ • Confirm referential integrity                      │      │
│  │ • Smoke test critical paths                          │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Phase 6: NOTIFICATION (T+2h)                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ • Notify team of refresh completion                  │      │
│  │ • Update environment status dashboard                │      │
│  │ • Archive refresh logs                               │      │
│  │ • Update data lineage records                        │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Cleanup Procedures

| Procedure | Frequency | Scope | Retention |
|-----------|-----------|-------|-----------|
| **Purge Expired Data** | Daily | Transaction data > retention period | Remove |
| **Archive Historical** | Monthly | Completed migration datasets | Archive to cold storage |
| **Reset QA Datasets** | Per sprint | QA-specific test data | Remove and regenerate |
| **Clear Test Logs** | Weekly | Test execution logs | Keep 90 days |
| **Purge Token Vault** | Quarterly | Unused tokens | Remove after 1 year |

### 8.4 Cleanup Implementation

```python
# MAP Data Cleanup Service
from datetime import datetime, timedelta
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class DataCleanupService:
    """Manage test data lifecycle cleanup operations."""
    
    def __init__(self, db_connection, config: Dict):
        self.db = db_connection
        self.config = config
    
    def purge_expired_data(self) -> Dict:
        """Remove data older than retention policy."""
        results = {'tables_processed': 0, 'rows_deleted': 0}
        
        retention_policies = self.config.get('retention_policies', {})
        
        for table, policy in retention_policies.items():
            days = policy.get('retention_days', 90)
            date_column = policy.get('date_column', 'created_at')
            cutoff = datetime.now() - timedelta(days=days)
            
            count = self.db.execute(f"""
                DELETE FROM {table} 
                WHERE {date_column} < %s
            """, [cutoff])
            
            results['tables_processed'] += 1
            results['rows_deleted'] += count
            logger.info(f"Purged {count} rows from {table} (cutoff: {cutoff})")
        
        return results
    
    def archive_historical_data(self, archive_path: str) -> Dict:
        """Archive completed migration datasets to cold storage."""
        results = {'datasets_archived': 0, 'total_size_gb': 0}
        
        datasets = self.db.query("""
            SELECT dataset_id, migration_id, created_at, 
                   pg_size_pretty(pg_total_relation_size(table_name)) as size
            FROM migration_datasets 
            WHERE status = 'COMPLETED' 
            AND created_at < NOW() - INTERVAL '30 days'
        """)
        
        for dataset in datasets:
            self._export_to_archive(dataset, archive_path)
            self._mark_archived(dataset['dataset_id'])
            results['datasets_archived'] += 1
        
        return results
    
    def reset_qa_environment(self, sprint_id: str) -> Dict:
        """Reset QA environment for new sprint."""
        qa_tables = [
            'qa_test_results', 'qa_defects', 'qa_metrics',
            'qa_evidence', 'qa_screenshots'
        ]
        
        results = {'tables_reset': 0}
        for table in qa_tables:
            count = self.db.execute(f"DELETE FROM {table} WHERE sprint_id = %s", [sprint_id])
            results['tables_reset'] += 1
            logger.info(f"Reset {count} rows in {table} for sprint {sprint_id}")
        
        return results
```

---

## 9. Data Ownership & Governance

### 9.1 Roles and Responsibilities

| Role | Responsibility | Accountable For |
|------|----------------|-----------------|
| **Data Owner** | Strategic oversight, policy enforcement, access approval | Data governance compliance |
| **Data Steward** | Day-to-day management, quality monitoring, issue resolution | Data quality and availability |
| **Data Custodian** | Technical implementation, security controls, backup/recovery | Infrastructure and security |
| **Data Consumer** | Proper usage, feedback on quality, issue reporting | Correct data usage |
| **Data Engineer** | Pipeline development, transformation, testing | ETL/ELT correctness |
| **Security Officer** | Access control, compliance monitoring, incident response | Data protection |

### 9.2 Governance Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                  MAP DATA GOVERNANCE STRUCTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌───────────────────┐                        │
│                    │  Data Governance  │                        │
│                    │     Board         │                        │
│                    └─────────┬─────────┘                        │
│                              │                                  │
│              ┌───────────────┼───────────────┐                  │
│              │               │               │                  │
│    ┌─────────▼─────────┐   │   ┌─────────────▼─────────┐      │
│    │  Data Owner       │   │   │  Compliance Officer   │      │
│    │  (Strategic)      │   │   │  (Regulatory)         │      │
│    └─────────┬─────────┘   │   └─────────────┬─────────┘      │
│              │               │               │                  │
│    ┌─────────▼─────────┐   │   ┌─────────────▼─────────┐      │
│    │  Data Stewards    │   │   │  Security Officers    │      │
│    │  (Operational)    │   │   │  (Access Control)     │      │
│    └─────────┬─────────┘   │   └─────────────┬─────────┘      │
│              │               │               │                  │
│    ┌─────────▼─────────┐   │   ┌─────────────▼─────────┐      │
│    │  Data Custodians  │   │   │  Data Consumers       │      │
│    │  (Technical)      │   │   │  (Usage)              │      │
│    └───────────────────┘   │   └───────────────────────┘      │
│                             │                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Accountability Matrix

| Activity | Data Owner | Data Steward | Data Custodian | Data Engineer | Security |
|----------|------------|--------------|----------------|---------------|----------|
| Policy Definition | **R/A** | C | I | I | C |
| Access Requests | A | **R** | I | I | **R/A** |
| Masking Rules | A | **R** | C | **R** | C |
| Data Refresh | I | **R/A** | **R** | C | I |
| Quality Monitoring | I | **R/A** | I | **R** | I |
| Incident Response | A | C | **R** | C | **R** |
| Compliance Audit | **R/A** | C | C | I | C |
| Tool Selection | I | C | **R/A** | **R** | C |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

### 9.4 Data Ownership Register

| Data Domain | Owner | Steward | Custodian | Last Review |
|-------------|-------|---------|-----------|-------------|
| Customer Data | VP Customer Experience | Customer Data Team | Database Admin | 2026-07-01 |
| Account Data | VP Banking Operations | Operations Team | Database Admin | 2026-07-01 |
| Transaction Data | VP Risk Management | Risk Data Team | Data Engineer | 2026-07-01 |
| Reference Data | CTO | Reference Data Team | Data Engineer | 2026-07-01 |
| Migration Metadata | VP Engineering | Migration Team | DevOps Lead | 2026-07-01 |
| Test Data | QA Director | QA Lead | QA Automation Lead | 2026-07-01 |

---

## 10. Compliance & Regulatory

### 10.1 GDPR Requirements

| GDPR Article | Requirement | MAP Implementation |
|--------------|-------------|-------------------|
| **Art. 5(1)(f)** | Integrity and confidentiality | Data masking and access controls |
| **Art. 25** | Data protection by design | Synthetic data generation |
| **Art. 30** | Records of processing | Test data inventory and lineage |
| **Art. 32** | Security of processing | Encryption at rest and in transit |
| **Art. 35** | Data protection impact assessment | DPIA for test data processes |

### 10.2 Data Retention Policy

| Data Category | Retention Period | Disposal Method | Audit Requirement |
|---------------|------------------|-----------------|-------------------|
| **Production Sourced** | 30 days post-refresh | Secure deletion with verification | Annual |
| **Synthetic Generated** | Until superseded | Soft delete, then hard delete | Quarterly |
| **Token Vault** | 1 year post-use | Cryptographic erasure | Annual |
| **Test Results** | 2 years | Archive, then delete | Annual |
| **Masking Rules** | Permanent | Version control | Annual |
| **Audit Logs** | 7 years | Archive to cold storage | Annual |

### 10.3 Audit Trail Requirements

| Event Type | Required Data | Retention | Access |
|------------|---------------|-----------|--------|
| **Data Creation** | Who, what, when, source | 7 years | Audit team |
| **Data Access** | Who, what, when, purpose | 2 years | Security team |
| **Data Modification** | Who, what, when, before/after | 7 years | Audit team |
| **Data Deletion** | Who, what, when, approval | 7 years | Audit team |
| **Masking Applied** | Who, what rule, when, validation | 7 years | Audit team |
| **Refresh Events** | Who, when, source, volume | 3 years | Operations |

### 10.4 Audit Trail Implementation

```python
# MAP Audit Trail Service
from datetime import datetime
from typing import Dict, Optional, Any
from dataclasses import dataclass, field
import json
import uuid

@dataclass
class AuditEvent:
    event_id: str
    event_type: str
    timestamp: datetime
    actor: str
    target_data: str
    action: str
    details: Dict[str, Any]
    source_ip: Optional[str] = None
    correlation_id: Optional[str] = None

class AuditTrailService:
    """Record and query audit events for test data operations."""
    
    def __init__(self, db_connection):
        self.db = db_connection
        self._ensure_table()
    
    def _ensure_table(self):
        self.db.execute("""
            CREATE TABLE IF NOT EXISTS tdm_audit_trail (
                event_id VARCHAR(36) PRIMARY KEY,
                event_type VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP NOT NULL,
                actor VARCHAR(100) NOT NULL,
                target_data VARCHAR(255) NOT NULL,
                action VARCHAR(50) NOT NULL,
                details JSONB,
                source_ip INET,
                correlation_id VARCHAR(36),
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
    
    def record_event(self, event_type: str, actor: str, 
                     target: str, action: str, 
                     details: Dict, source_ip: str = None,
                     correlation_id: str = None) -> str:
        event_id = str(uuid.uuid4())
        
        self.db.execute("""
            INSERT INTO tdm_audit_trail 
            (event_id, event_type, timestamp, actor, target_data, 
             action, details, source_ip, correlation_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, [
            event_id, event_type, datetime.now(), actor,
            target, action, json.dumps(details), source_ip,
            correlation_id or str(uuid.uuid4())
        ])
        
        return event_id
    
    def record_data_refresh(self, actor: str, source: str, 
                           target_env: str, record_count: int) -> str:
        return self.record_event(
            event_type='DATA_REFRESH',
            actor=actor,
            target=target_env,
            action='REFRESH',
            details={
                'source_system': source,
                'record_count': record_count,
                'refresh_type': 'SCHEDULED'
            }
        )
    
    def record_masking(self, actor: str, table: str, 
                      column: str, technique: str, row_count: int) -> str:
        return self.record_event(
            event_type='DATA_MASKING',
            actor=actor,
            target=f"{table}.{column}",
            action='MASK',
            details={
                'technique': technique,
                'rows_affected': row_count,
                'validation_passed': True
            }
        )
    
    def record_data_access(self, actor: str, table: str,
                          purpose: str, record_count: int) -> str:
        return self.record_event(
            event_type='DATA_ACCESS',
            actor=actor,
            target=table,
            action='READ',
            details={
                'purpose': purpose,
                'record_count': record_count
            }
        )
    
    def query_events(self, event_type: str = None, 
                    actor: str = None,
                    start_date: datetime = None,
                    end_date: datetime = None,
                    limit: int = 100) -> list:
        query = "SELECT * FROM tdm_audit_trail WHERE 1=1"
        params = []
        
        if event_type:
            query += " AND event_type = %s"
            params.append(event_type)
        if actor:
            query += " AND actor = %s"
            params.append(actor)
        if start_date:
            query += " AND timestamp >= %s"
            params.append(start_date)
        if end_date:
            query += " AND timestamp <= %s"
            params.append(end_date)
        
        query += f" ORDER BY timestamp DESC LIMIT {limit}"
        return self.db.query(query, params)
```

---

## 11. Test Data Lifecycle

### 11.1 Lifecycle Phases

```
┌─────────────────────────────────────────────────────────────────┐
│                 TEST DATA LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                               │
│  │  1. CREATE  │  Generate synthetic data or extract from      │
│  └──────┬──────┘  production sources                           │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │ 2. VALIDATE │  Apply quality checks, PII scan, masking     │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │ 3. APPROVE  │  Data steward approval for production use    │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │ 4. PROVISION│  Load into target environments               │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │  5. USE     │  Execute test cases against data             │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │ 6. MONITOR  │  Track usage, quality, freshness             │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │ 7. REFRESH  │  Update or replace with new data             │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │ 8. ARCHIVE  │  Move to long-term storage                   │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                               │
│  │ 9. DELETE   │  Secure destruction with verification        │
│  └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Lifecycle State Machine

```python
# MAP Test Data Lifecycle State Machine
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict

class DataState(Enum):
    CREATED = "CREATED"
    VALIDATED = "VALIDATED"
    APPROVED = "APPROVED"
    PROVISIONED = "PROVISIONED"
    ACTIVE = "ACTIVE"
    MONITORED = "MONITORED"
    REFRESHING = "REFRESHING"
    ARCHIVED = "ARCHIVED"
    DELETED = "DELETED"

# Valid state transitions
TRANSITIONS = {
    DataState.CREATED: [DataState.VALIDATED],
    DataState.VALIDATED: [DataState.APPROVED, DataState.CREATED],
    DataState.APPROVED: [DataState.PROVISIONED],
    DataState.PROVISIONED: [DataState.ACTIVE],
    DataState.ACTIVE: [DataState.MONITORED, DataState.REFRESHING, DataState.ARCHIVED],
    DataState.MONITORED: [DataState.ACTIVE, DataState.REFRESHING, DataState.ARCHIVED],
    DataState.REFRESHING: [DataState.VALIDATED, DataState.ACTIVE],
    DataState.ARCHIVED: [DataState.DELETED],
    DataState.DELETED: [],
}

@dataclass
class TestDataAsset:
    asset_id: str
    name: str
    state: DataState
    created_at: datetime
    owner: str
    last_transition: datetime
    metadata: Dict
    
    def can_transition(self, target: DataState) -> bool:
        return target in TRANSITIONS.get(self.state, [])
    
    def transition(self, target: DataState, actor: str) -> bool:
        if not self.can_transition(target):
            raise ValueError(
                f"Invalid transition: {self.state.value} → {target.value}"
            )
        
        self.state = target
        self.last_transition = datetime.now()
        self.metadata.setdefault('history', []).append({
            'from': self.state.value,
            'to': target.value,
            'actor': actor,
            'timestamp': datetime.now().isoformat()
        })
        return True

class LifecycleManager:
    """Manage test data lifecycle transitions."""
    
    def __init__(self, db_connection):
        self.db = db_connection
    
    def create_asset(self, name: str, owner: str, 
                    metadata: Dict = None) -> TestDataAsset:
        asset = TestDataAsset(
            asset_id=self._generate_id(),
            name=name,
            state=DataState.CREATED,
            created_at=datetime.now(),
            owner=owner,
            last_transition=datetime.now(),
            metadata=metadata or {}
        )
        self._persist_asset(asset)
        return asset
    
    def approve_for_use(self, asset: TestDataAsset, 
                       approver: str) -> TestDataAsset:
        """Transition through validation and approval."""
        asset.transition(DataState.VALIDATED, approver)
        asset.transition(DataState.APPROVED, approver)
        return asset
    
    def provision_to_environment(self, asset: TestDataAsset,
                                environment: str) -> TestDataAsset:
        asset.transition(DataState.PROVISIONED, asset.owner)
        asset.metadata['environment'] = environment
        return asset
    
    def archive_asset(self, asset: TestDataAsset, 
                     reason: str) -> TestDataAsset:
        asset.transition(DataState.ARCHIVED, asset.owner)
        asset.metadata['archive_reason'] = reason
        return asset
    
    def secure_delete(self, asset: TestDataAsset) -> TestDataAsset:
        asset.transition(DataState.DELETED, asset.owner)
        # Verify deletion
        self._verify_deletion(asset.asset_id)
        return asset
    
    def _generate_id(self) -> str:
        import uuid
        return f"TDA-{uuid.uuid4().hex[:12].upper()}"
    
    def _persist_asset(self, asset: TestDataAsset):
        pass  # Database persistence implementation
    
    def _verify_deletion(self, asset_id: str):
        pass  # Deletion verification implementation
```

### 11.3 Archival Standards

| Standard | Requirement | Implementation |
|----------|-------------|----------------|
| **Format** | Open, standards-based formats (CSV, Parquet, JSON) | Convert proprietary formats before archival |
| **Compression** | GZIP or ZSTD compression for storage efficiency | Apply during archival process |
| **Encryption** | AES-256 encryption for archived data | Encrypt before writing to archive |
| **Indexing** | Metadata index for searchability | Generate metadata manifest |
| **Verification** | Checksum verification on retrieval | Validate on read |
| **Retention Label** | Clear retention period in metadata | Include in manifest |

---

## 12. Data Profiles & Patterns

### 12.1 Data Profile Template

```yaml
# MAP Customer Data Profile
apiVersion: v1
kind: DataProfile
metadata:
  name: customer_master_profile
  version: "2026.07"
  created: "2026-07-01"

spec:
  source: production_customer_master
  record_count: 2500000
  last_analyzed: "2026-07-01"

columns:
  - name: customer_id
    type: VARCHAR(10)
    nullable: false
    unique: true
    pattern: "^CUST[0-9]{8}$"
    min_length: 12
    max_length: 12
    
  - name: first_name
    type: VARCHAR(50)
    nullable: false
    unique: false
    min_length: 1
    max_length: 50
    distribution: normal
    
  - name: last_name
    type: VARCHAR(50)
    nullable: false
    unique: false
    min_length: 1
    max_length: 50
    distribution: normal
    
  - name: date_of_birth
    type: DATE
    nullable: false
    min_value: "1930-01-01"
    max_value: "2008-12-31"
    distribution: normal
    mean: "1975-06-15"
    std_dev_years: 15
    
  - name: email
    type: VARCHAR(100)
    nullable: true
    null_percentage: 2.3
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    unique: true
    
  - name: credit_limit
    type: DECIMAL(12,2)
    nullable: false
    min_value: 0
    max_value: 1000000
    distribution: lognormal
    mean: 25000
    median: 15000
    
  - name: account_status
    type: VARCHAR(20)
    nullable: false
    allowed_values: ["ACTIVE", "INACTIVE", "CLOSED", "SUSPENDED"]
    distribution:
      ACTIVE: 0.70
      INACTIVE: 0.15
      CLOSED: 0.10
      SUSPENDED: 0.05

relationships:
  - type: one_to_many
    target: accounts
    foreign_key: customer_id
    target_key: customer_id
    
  - type: one_to_many
    target: transactions
    foreign_key: customer_id
    target_key: customer_id

constraints:
  - type: check
    name: credit_limit_positive
    expression: "credit_limit >= 0"
    
  - type: check
    name: dob_before_now
    expression: "date_of_birth <= CURRENT_DATE"
    
  - type: unique
    columns: ["email"]
    
  - type: not_null
    columns: ["customer_id", "first_name", "last_name", "date_of_birth"]
```

### 12.2 Data Pattern Definitions

| Pattern | Regex | Description | Example |
|---------|-------|-------------|---------|
| **Customer ID** | `^CUST[0-9]{8}$` | Customer identifier | `CUST00012345` |
| **Account ID** | `^ACC[0-9]{10}$` | Account identifier | `ACC0000123456` |
| **Transaction ID** | `^TXN-[A-Z0-9]{16}$` | Transaction reference | `TXN-A1B2C3D4E5F6G7H8` |
| **Email** | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | Email address | `user@example.com` |
| **UK Phone** | `^(\+44|0)[0-9]{10}$` | UK phone number | `07700900123` |
| **UK Postcode** | `^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$` | UK postcode | `SW1A 1AA` |
| **Sort Code** | `^[0-9]{2}-[0-9]{2}-[0-9]{2}$` | UK bank sort code | `12-34-56` |
| **IBAN** | `^GB[0-9]{2}[A-Z]{4}[0-9]{14}$` | UK IBAN | `GB29NWBK60161331926819` |

### 12.3 Constraint Definitions

| Constraint | Type | Field(s) | Rule | Severity |
|------------|------|----------|------|----------|
| **Primary Key** | Unique | customer_id | Must be unique and not null | Critical |
| **Foreign Key** | Referential | account.customer_id | Must reference valid customer | Critical |
| **Check** | Range | credit_limit | Must be >= 0 | High |
| **Check** | Format | email | Must match email pattern | High |
| **Check** | Allowed Values | account_status | Must be one of defined values | High |
| **Not Null** | Completeness | first_name, last_name | Cannot be null | Critical |
| **Unique** | Cardinality | email | Must be unique across customers | High |
| **Referential** | Integrity | transaction.account_id | Must reference valid account | Critical |

### 12.4 Relationship Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAP DATA RELATIONSHIP MAP                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     1:N     ┌──────────────┐                 │
│  │  Customers   │────────────▶│   Accounts   │                 │
│  │  (PK: cust)  │             │  (PK: acc)   │                 │
│  └──────────────┘             └──────┬───────┘                 │
│         │                            │                          │
│         │ 1:N                        │ 1:N                      │
│         ▼                            ▼                          │
│  ┌──────────────┐             ┌──────────────┐                 │
│  │  Addresses   │             │ Transactions │                 │
│  │  (PK: addr)  │             │  (PK: txn)   │                 │
│  └──────────────┘             └──────┬───────┘                 │
│         │                            │                          │
│         │ N:1                        │ N:1                      │
│         ▼                            ▼                          │
│  ┌──────────────┐             ┌──────────────┐                 │
│  │  Countries   │             │  Products    │                 │
│  │  (PK: code)  │             │  (PK: prod)  │                 │
│  └──────────────┘             └──────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Recommended Tools

### 13.1 Tool Matrix

| Category | Tool | Use Case | License | MAP Priority |
|----------|------|----------|---------|--------------|
| **Synthetic Data** | Faker | Pseudo-random data generation | MIT | High |
| **Synthetic Data** | Mockaroo | Web-based data generation | Freemium | Medium |
| **Synthetic Data** | Gretel.ai | ML-based synthetic data | Apache 2.0 | High |
| **Synthetic Data** | Mostly AI | Enterprise synthetic data | Commercial | Medium |
| **Data Masking** | Microsoft Presidio | PII detection and anonymisation | Apache 2.0 | High |
| **Data Masking** | ARX | Anonymisation tool | Apache 2.0 | Medium |
| **Data Masking** | Delphix | Enterprise data masking | Commercial | Medium |
| **Data Generation** | Factory Boy | Python test fixtures | MIT | High |
| **Data Generation** | Bogus | .NET test data generation | MIT | Medium |
| **Data Generation** | DataFaker | Java data generation | Apache 2.0 | Low |
| **Data Validation** | Great Expectations | Data quality validation | Apache 2.0 | High |
| **Data Validation** | Sifflet | Data observability | Commercial | Medium |
| **Data Validation** | Soda Core | Data quality checks | Apache 2.0 | High |
| **Data Lifecycle** | dbt | Data transformation | Apache 2.0 | High |
| **Data Lifecycle** | Apache Airflow | Orchestration | Apache 2.0 | High |

### 13.2 Faker Integration Example

```python
# MAP Faker Data Generator — Extended for Financial Services
from faker import Faker
from faker.providers import BaseProvider
from typing import Dict, List, Optional
import random

fake = Faker('en_GB')

class FinancialServicesProvider(BaseProvider):
    """Custom Faker provider for MAP financial data."""
    
    def sort_code(self) -> str:
        """Generate UK bank sort code."""
        return f"{self.random_int(10, 99)}-{self.random_int(10, 99)}-{self.random_int(10, 99)}"
    
    def iban(self) -> str:
        """Generate UK IBAN."""
        bank_code = self.numerify('####')
        account = self.numerify('################')
        return f"GB29NWBK{bank_code}{account}"
    
    def account_number(self) -> str:
        """Generate UK bank account number."""
        return self.numerify('################')
    
    def credit_score(self) -> int:
        """Generate realistic UK credit score."""
        # Normal distribution centered around 650
        score = int(random.gauss(650, 100))
        return max(300, min(850, score))
    
    def risk_rating(self) -> str:
        """Generate risk rating with realistic distribution."""
        weights = {'LOW': 0.45, 'MEDIUM': 0.35, 'HIGH': 0.15, 'CRITICAL': 0.05}
        return random.choices(
            list(weights.keys()),
            weights=list(weights.values())
        )[0]
    
    def transaction_amount(self, min_val: float = 0.01, 
                          max_val: float = 100000.00) -> float:
        """Generate transaction amount with realistic distribution."""
        # Log-normal distribution for transaction amounts
        amount = random.lognormvariate(5, 2)
        return round(min(max_val, max(min_val, amount)), 2)
    
    def migration_status(self) -> str:
        """Generate migration status with workflow distribution."""
        statuses = {
            'PENDING': 0.2,
            'IN_PROGRESS': 0.3,
            'COMPLETED': 0.4,
            'FAILED': 0.05,
            'REVIEW': 0.05
        }
        return random.choices(
            list(statuses.keys()),
            weights=list(statuses.values())
        )[0]


# Register custom provider
fake.add_provider(FinancialServicesProvider)


class MAPFakerDataGenerator:
    """Generate comprehensive MAP test data using Faker."""
    
    def __init__(self, seed: int = 42):
        Faker.seed(seed)
        random.seed(seed)
        self.fake = fake
    
    def generate_customer(self, customer_id: str = None) -> Dict:
        return {
            'customer_id': customer_id or f"CUST{self.fake.numerify('########')}",
            'first_name': self.fake.first_name(),
            'last_name': self.fake.last_name(),
            'date_of_birth': self.fake.date_of_birth(minimum_age=18, maximum_age=90),
            'national_id': self.fake.ssn(),
            'email': self.fake.email(),
            'phone': self.fake.phone_number(),
            'address_line_1': self.fake.street_address(),
            'city': self.fake.city(),
            'postcode': self.fake.postcode(),
            'country': 'GB',
            'credit_score': self.fake.credit_score(),
            'risk_rating': self.fake.risk_rating(),
            'account_opened': self.fake.date_between(start_date='-20y'),
        }
    
    def generate_account(self, customer_id: str, 
                        account_id: str = None) -> Dict:
        return {
            'account_id': account_id or f"ACC{self.fake.numerify('##########')}",
            'customer_id': customer_id,
            'account_type': self.fake.random_element(
                ['CURRENT', 'SAVINGS', 'ISA', 'CREDIT_CARD', 'LOAN']
            ),
            'sort_code': self.fake.sort_code(),
            'account_number': self.fake.account_number(),
            'iban': self.fake.iban(),
            'balance': round(random.gauss(5000, 15000), 2),
            'currency': 'GBP',
            'status': self.fake.random_element(
                ['ACTIVE', 'INACTIVE', 'DORMANT', 'CLOSED']
            ),
            'opened_date': self.fake.date_between(start_date='-15y'),
        }
    
    def generate_transaction(self, account_id: str, 
                           transaction_id: str = None) -> Dict:
        return {
            'transaction_id': transaction_id or f"TXN-{self.fake.hexify('^^^^^^^^^^^^^^^^')}",
            'account_id': account_id,
            'amount': self.fake.transaction_amount(),
            'currency': 'GBP',
            'type': self.fake.random_element(['CREDIT', 'DEBIT', 'TRANSFER']),
            'description': self.fake.sentence(nb_words=6),
            'timestamp': self.fake.date_time_between(start_date='-1y'),
            'status': self.fake.random_element(['COMPLETED', 'PENDING', 'FAILED']),
            'migration_status': self.fake.migration_status(),
        }
    
    def generate_dataset(self, customers: int = 100, 
                        accounts_per_customer: int = 2,
                        transactions_per_account: int = 10) -> Dict:
        data = {'customers': [], 'accounts': [], 'transactions': []}
        
        for _ in range(customers):
            customer = self.generate_customer()
            data['customers'].append(customer)
            
            for _ in range(accounts_per_customer):
                account = self.generate_account(customer['customer_id'])
                data['accounts'].append(account)
                
                for _ in range(transactions_per_account):
                    transaction = self.generate_transaction(account['account_id'])
                    data['transactions'].append(transaction)
        
        return data
```

### 13.3 Great Expectations Integration

```python
# MAP Data Validation with Great Expectations
import great_expectations as gx
from great_expectations.core import ExpectationConfiguration
from typing import Dict

class MAPDataValidator:
    """Validate test data quality using Great Expectations."""
    
    def __init__(self, context):
        self.context = context
    
    def create_customer_expectations(self) -> Dict:
        """Define expected qualities for customer test data."""
        expectations = [
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_not_be_null",
                kwargs={"column": "customer_id"}
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_be_unique",
                kwargs={"column": "customer_id"}
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_match_regex",
                kwargs={
                    "column": "customer_id",
                    "regex": "^CUST[0-9]{8}$"
                }
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_be_in_set",
                kwargs={
                    "column": "account_status",
                    "value_set": ["ACTIVE", "INACTIVE", "CLOSED", "SUSPENDED"]
                }
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_be_between",
                kwargs={
                    "column": "credit_limit",
                    "min_value": 0,
                    "max_value": 1000000
                }
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_match_regex",
                kwargs={
                    "column": "email",
                    "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                }
            ),
            ExpectationConfiguration(
                expectation_type="expect_table_row_count_to_be_between",
                kwargs={
                    "min_value": 10000,
                    "max_value": 1000000
                }
            ),
        ]
        
        return {
            'suite_name': 'customer_test_data_suite',
            'expectations': expectations
        }
    
    def create_transaction_expectations(self) -> Dict:
        """Define expected qualities for transaction test data."""
        expectations = [
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_not_be_null",
                kwargs={"column": "transaction_id"}
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_be_unique",
                kwargs={"column": "transaction_id"}
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_match_regex",
                kwargs={
                    "column": "transaction_id",
                    "regex": "^TXN-[A-Z0-9]{16}$"
                }
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_be_in_set",
                kwargs={
                    "column": "type",
                    "value_set": ["CREDIT", "DEBIT", "TRANSFER"]
                }
            ),
            ExpectationConfiguration(
                expectation_type="expect_column_values_to_be_between",
                kwargs={
                    "column": "amount",
                    "min_value": -1000000,
                    "max_value": 1000000
                }
            ),
        ]
        
        return {
            'suite_name': 'transaction_test_data_suite',
            'expectations': expectations
        }
```

---

## 14. Best Practices

### 14.1 Data as Code

| Practice | Description | Implementation |
|----------|-------------|----------------|
| **Version Control** | All test data definitions in Git | YAML/JSON configs in repository |
| **Code Review** | Review data changes like code | PR review for seed data updates |
| **Reproducibility** | Deterministic generation with seeds | Fixed random seeds |
| **Documentation** | Inline documentation of data patterns | Data profile YAML files |
| **Automation** | Automated generation and validation | CI/CD pipeline integration |

### 14.2 Version Control Strategy

```
test-data/
├── .git/
├── README.md
├── CHANGELOG.md
├── profiles/
│   ├── customer_profile.yaml
│   ├── account_profile.yaml
│   └── transaction_profile.yaml
├── generators/
│   ├── customer_generator.py
│   ├── account_generator.py
│   └── transaction_generator.py
├── seed-data/
│   ├── v1.0/
│   │   ├── reference/
│   │   └── configuration/
│   └── v2.0/
│       ├── reference/
│       └── configuration/
├── masking-rules/
│   ├── customer_masking.yaml
│   └── transaction_masking.yaml
├── validation/
│   ├── customer_expectations.yaml
│   └── transaction_expectations.yaml
└── scripts/
    ├── generate.py
    ├── validate.py
    └── refresh.py
```

### 14.3 Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| **Data Profiles** | `{domain}_profile.yaml` | `customer_profile.yaml` |
| **Generators** | `{domain}_generator.py` | `customer_generator.py` |
| **Seed Data** | `{category}/{name}.csv` | `reference/country_codes.csv` |
| **Masking Rules** | `{domain}_masking.yaml` | `customer_masking.yaml` |
| **Test Fixtures** | `{scenario}_{dataset}.json` | `edge_cases_customers.json` |
| **Validation Suites** | `{domain}_expectations.yaml` | `transaction_expectations.yaml` |

### 14.4 Documentation Standards

| Document | Required | Audience | Update Frequency |
|----------|----------|----------|------------------|
| **Data Profile** | Yes | All data users | Per data change |
| **Generation Script** | Yes | Data engineers | Per code change |
| **Masking Rules** | Yes | Security, QA | Per rule change |
| **Refresh Procedures** | Yes | Operations | Per process change |
| **Validation Results** | Yes | QA, Audit | Per execution |
| **Data Lineage** | Yes | Compliance | Continuous |

### 14.5 Quality Checklist

| Check | Automated | Manual | Gate |
|-------|-----------|--------|------|
| PII scanned and masked | ✓ | | Data creation |
| Data profiles match production patterns | ✓ | | Data creation |
| All constraints satisfied | ✓ | | Data creation |
| Seed data version current | ✓ | | Data refresh |
| Documentation updated | | ✓ | Data refresh |
| Masking rules validated | ✓ | | Data refresh |
| Audit trail complete | ✓ | | Data access |
| Data retention policy applied | ✓ | | Data archival |

---

## 15. Dependencies

### 15.1 Related Batches

| Batch | Document | Relationship | Impact |
|-------|----------|--------------|--------|
| **Batch 08** | Database Architecture | Source schemas, partitioning, indexing | Data profiles derived from DB schemas |
| **Batch 14** | Data Testing | Validation rules, reconciliation | TDM validates data for testing |
| **Batch 05** | Infrastructure | Environment provisioning | TDM provisions data to environments |
| **Batch 11** | Python Standards | Code style, async patterns | Generator scripts follow standards |
| **Batch 12** | Unit Testing | Test fixture requirements | TDM provides unit test data |
| **Batch 06** | CI/CD Pipeline | Automation integration | TDM scripts in CI/CD |

### 15.2 Dependency Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    TDM DEPENDENCY MAP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐                                          │
│  │  Batch 08        │                                          │
│  │  Database        │──▶ Schema definitions                    │
│  │  Architecture    │──▶ Data type specifications              │
│  └──────────────────┘──▶ Constraint definitions                │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │  16_Test_Data    │◀───│  Batch 14        │                  │
│  │  Management      │    │  Data Testing    │                  │
│  │  (THIS DOC)      │    │                  │                  │
│  └──────────────────┘    └──────────────────┘                  │
│           │                     ▲                               │
│           ▼                     │                               │
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │  Batch 05        │    │  Batch 12        │                  │
│  │  Infrastructure  │    │  Unit Testing    │                  │
│  │                  │    │                  │                  │
│  └──────────────────┘    └──────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 15.3 Interface Specifications

| Interface | Direction | Format | Frequency |
|-----------|-----------|--------|-----------|
| **Batch 08 → TDM** | Inbound | DDL, ERD | Per schema change |
| **TDM → Batch 14** | Outbound | CSV, Parquet | Per refresh |
| **TDM → Batch 05** | Outbound | SQL scripts | Per environment setup |
| **Batch 12 → TDM** | Inbound | Test requirements | Per sprint |
| **TDM → CI/CD** | Outbound | Validation results | Per execution |

---

## 16. Appendices

### Appendix A: Masking Rules Reference

| Field Type | Default Technique | Parameters | Example |
|------------|-------------------|------------|---------|
| **Email** | Email Mask | Show first char, domain | `j***@example.com` |
| **Phone** | Partial Mask | Show first 3, last 4 | `077***123` |
| **Name** | Full Replacement | Use Faker names | `Robert Jones` |
| **Address** | Full Replacement | Use Faker addresses | `123 Fake Street` |
| **DOB** | Date Shift | ±5 years random | Shifted 365 days |
| **National ID** | Hash (SHA-256) | Salted, truncated | `a3f8b2c1d4e5f6` |
| **Card Number** | Partial Mask | Show first 4, last 4 | `4532-XXXX-XXXX-9012` |
| **Account Number** | Partial Mask | Show last 4 | `XXXX1234` |
| **Balance** | Perturbation | ±5% variance | `£5,230.00` → `£5,015.00` |

### Appendix B: Environment Data Matrix

| Environment | Volume | Masking Level | Refresh Cycle | Access |
|-------------|--------|---------------|---------------|--------|
| **DEV** | 10% | Full mask | Weekly | Developers |
| **INT** | 25% | Tokenised | Weekly | Integration tests |
| **QA** | 50% | Partial mask | Bi-weekly | QA team |
| **UAT** | 100% | Tokenised | Monthly | UAT participants |
| **PERF** | 150% | Partial mask | Per cycle | Performance team |
| **PRE** | 100% | Full mask | Per release | Release team |

### Appendix C: Regulatory Compliance Matrix

| Regulation | Requirement | TDM Control | Evidence |
|------------|-------------|-------------|----------|
| **GDPR Art. 5** | Data minimisation | Synthetic data generation | Generation logs |
| **GDPR Art. 25** | Privacy by design | Anonymisation as default | PII scan reports |
| **GDPR Art. 32** | Security of processing | Encryption, access control | Access logs |
| **GDPR Art. 35** | DPIA | Risk assessment | DPIA document |
| **CCPA §1798.100** | Right to know | Data inventory | Inventory records |
| **DPA 2018** | Lawful processing | Legal basis documentation | Processing records |

### Appendix D: Glossary

| Acronym | Full Form |
|---------|-----------|
| CCPA | California Consumer Privacy Act |
| DPA | Data Protection Act 2018 |
| DPIA | Data Protection Impact Assessment |
| GDPR | General Data Protection Regulation |
| PII | Personally Identifiable Information |
| TDM | Test Data Management |
| UUID | Universally Unique Identifier |
| VAULT | Versioned Archive for Licensed Testing |
| MAP | Migration Assurance Platform |

---

## 17. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-06-01 | MAP TDM Team | Initial draft |
| 0.2 | 2026-06-15 | MAP TDM Team | Added anonymisation section |
| 0.3 | 2026-06-22 | MAP TDM Team | Added masking implementation details |
| 0.4 | 2026-06-28 | MAP TDM Team | Added lifecycle management |
| 1.0 | 2026-07-01 | MAP TDM Team | Official release — approved |

---

## 18. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Document Owner** | MAP Data Engineering Lead | _________________ | 2026-07-01 |
| **QA Director** | _________________ | _________________ | 2026-07-01 |
| **Data Governance Lead** | _________________ | _________________ | 2026-07-01 |
| **Security Officer** | _________________ | _________________ | 2026-07-01 |
| **CTO** | _________________ | _________________ | 2026-07-01 |

---

**END OF DOCUMENT**

*Document Classification: Internal*
*Distribution: MAP Programme, Data Engineering, QA, Security, Compliance*
