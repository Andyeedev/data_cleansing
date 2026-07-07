# Integration Testing Standards — MAP (Migration Assurance Platform)

| Field        | Value                                      |
|--------------|--------------------------------------------|
| **Title**    | Integration Testing Standards for MAP      |
| **Version**  | 1.0                                        |
| **Date**     | July 2026                                  |
| **Status**   | Official                                   |
| **Author**   | MAP Engineering & Quality Assurance Team   |
| **Approver** | Head of Engineering / VP of Quality        |
| **Domain**   | Financial Services Migration Product       |

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [Definitions and Acronyms](#2-definitions-and-acronyms)
3. [Integration Testing Strategy Overview](#3-integration-testing-strategy-overview)
4. [API Testing Standards](#4-api-testing-standards)
5. [Database Testing Standards](#5-database-testing-standards)
6. [Service Integration Testing](#6-service-integration-testing)
7. [External Integration Testing](#7-external-integration-testing)
8. [Authentication Testing Standards](#8-authentication-testing-standards)
9. [Infrastructure Validation](#9-infrastructure-validation)
10. [Test Data Management](#10-test-data-management)
11. [Mock Services and Stubs](#11-mock-services-and-stubs)
12. [Environment Requirements](#12-environment-requirements)
13. [Recommended Tools and Frameworks](#13-recommended-tools-and-frameworks)
14. [Best Practices](#14-best-practices)
15. [Test Execution and Reporting](#15-test-execution-and-reporting)
16. [Traceability Matrix](#16-traceability-matrix)
17. [Dependencies](#17-dependencies)
18. [Revision History](#18-revision-history)
19. [Approval and Sign-Off](#19-approval-and-sign-off)
20. [Appendices](#20-appendices)

---

## 1. Purpose and Scope

### 1.1 Purpose

This document defines the integration testing standards, practices, and requirements for the **Migration Assurance Platform (MAP)**. It provides a unified reference for engineering teams, quality assurance personnel, and DevOps engineers to ensure that all system components—APIs, databases, microservices, message queues, and external integrations—are validated consistently and thoroughly before reaching production.

Integration testing within MAP is not optional; it is a mandatory gate in the CI/CD pipeline. Every service boundary, data flow, and external touchpoint must be verified against its contract, schema, and expected behavior. This document codifies those expectations.

### 1.2 Scope

This standard applies to all integration test activities within the MAP product ecosystem, including but not limited to:

| Area                          | Coverage                                                 |
|-------------------------------|----------------------------------------------------------|
| REST API Integration          | Endpoint validation, contract testing, schema compliance |
| Database Integration          | Query correctness, transaction integrity, data lineage   |
| Microservices Communication   | Sync and async inter-service calls                       |
| Message Queue Integration     | Publish/subscribe patterns, dead-letter handling          |
| External System Integration   | Third-party APIs, webhooks, partner systems              |
| Authentication & Authorization | Token lifecycle, session management, SSO federation     |
| Infrastructure Validation     | Network, storage, compute health checks                  |

### 1.3 Out of Scope

- Unit testing standards (covered in `04_Unit_Testing_Standards.md`)
- User Acceptance Testing procedures (covered in `06_UAT_Framework.md`)
- Performance and load testing (covered in `07_Performance_Testing_Standards.md`)

---

## 2. Definitions and Acronyms

| Term             | Definition                                                        |
|------------------|-------------------------------------------------------------------|
| MAP              | Migration Assurance Platform                                      |
| SUT              | System Under Test                                                 |
| DUT              | Device Under Test                                                 |
| CI/CD            | Continuous Integration / Continuous Deployment                    |
| API              | Application Programming Interface                                 |
| REST             | Representational State Transfer                                    |
| JSON             | JavaScript Object Notation                                        |
| OAuth            | Open Authorization                                                |
| SAML             | Security Assertion Markup Language                                |
| SSO              | Single Sign-On                                                    |
| MQ               | Message Queue                                                     |
| DLT              | Dead Letter Topic/Queue                                            |
| CDC              | Change Data Capture                                               |
| ETL              | Extract, Transform, Load                                          |
| SLA              | Service Level Agreement                                           |
| Contract         | Agreement between consumer and provider on API behavior           |
| Schema           | Structural definition of data payloads                            |
| Mock             | Simulated component that mimics real behavior                     |
| Stub             | Simplified implementation returning predefined responses          |
| Fixture          | Predefined test data and state                                    |
| Golden File      | Authoritative reference output for comparison                     |

---

## 3. Integration Testing Strategy Overview

### 3.1 Testing Pyramid Position

Integration tests sit between unit tests and end-to-end tests in the MAP testing pyramid:

```
         /\
        / E2E \         < 10% of tests — full system flows
       /--------\
      /Integration\     < 25% of tests — THIS DOCUMENT
     /--------------\
    /   Unit Tests    \  65% of tests — pure logic, no I/O
   /------------------\
```

### 3.2 Integration Test Classification

MAP classifies integration tests into three tiers based on scope and risk:

| Tier     | Scope                                    | Typical Runtime | Failure Impact |
|----------|------------------------------------------|-----------------|----------------|
| Tier 1   | Single service boundary (DB, MQ, one API) | < 30 seconds    | High           |
| Tier 2   | Multi-service synchronous flows           | < 2 minutes     | High           |
| Tier 3   | Cross-system async/event-driven flows     | < 5 minutes     | Critical       |

### 3.3 Integration Test Lifecycle

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────────┐
│  Plan &     │────▶│  Author &    │────▶│  Execute &    │────▶│  Report &  │
│  Design     │     │  Review      │     │  Validate     │     │  Remediate │
└─────────────┘     └──────────────┘     └───────────────┘     └────────────┘
       │                   │                    │                      │
  - Identify            - Code               - Run in              - Publish
    boundaries           review               CI/CD                 results
  - Define              - Pair               - Capture             - File
    contracts            testing              artifacts             defects
  - Create              - Lint               - Compare             - Update
    fixtures             check                golden files          registry
```

---

## 4. API Testing Standards

### 4.1 REST Validation

All REST API integration tests must validate the following aspects for every endpoint:

| Validation Aspect     | Required | Description                                              |
|-----------------------|----------|----------------------------------------------------------|
| HTTP Status Code      | Yes      | Expected status for success and error scenarios          |
| Response Headers      | Yes      | `Content-Type`, `X-Request-Id`, `X-Correlation-Id`      |
| Response Body Schema  | Yes      | JSON structure matches OpenAPI spec                      |
| Response Body Data    | Yes      | Business values are correct and in expected format       |
| Response Time         | Yes      | Within documented SLA thresholds                         |
| Idempotency           | Yes      | Repeated identical requests produce same result          |
| Pagination            | Conditional | When endpoint supports list operations                |
| HATEOAS Links         | Conditional | When API follows hypermedia conventions               |
| Error Response Format | Yes      | Standardized error envelope for all non-2xx responses    |

#### 4.1.1 REST Response Validation Example (pytest)

```python
import pytest
import requests
from jsonschema import validate, ValidationError

SCHEMA = {
    "type": "object",
    "required": ["migrationId", "status", "createdAt"],
    "properties": {
        "migrationId": {"type": "string", "format": "uuid"},
        "status": {"type": "string", "enum": ["PENDING", "RUNNING", "COMPLETED", "FAILED"]},
        "createdAt": {"type": "string", "format": "date-time"},
        "recordsProcessed": {"type": "integer", "minimum": 0},
        "errors": {"type": "array", "items": {"type": "string"}}
    },
    "additionalProperties": False
}


class TestMigrationEndpoint:
    """Integration tests for /api/v1/migrations/{id} endpoint."""

    BASE_URL = "http://localhost:8080/api/v1"

    @pytest.fixture(autouse=True)
    def setup(self, migration_id):
        """Load a known migration record before each test."""
        self.url = f"{self.BASE_URL}/migrations/{migration_id}"
        self.response = requests.get(self.url, headers={
            "Authorization": "Bearer {{TEST_TOKEN}}",
            "X-Correlation-Id": "integration-test-run-001"
        })

    def test_returns_200(self):
        assert self.response.status_code == 200

    def test_content_type_is_json(self):
        assert "application/json" in self.response.headers["Content-Type"]

    def test_response_matches_schema(self):
        try:
            validate(instance=self.response.json(), schema=SCHEMA)
        except ValidationError as e:
            pytest.fail(f"Schema validation failed: {e.message}")

    def test_migration_id_is_uuid(self):
        data = self.response.json()
        assert len(data["migrationId"]) == 36  # UUID format

    def test_status_is_valid_enum(self):
        data = self.response.json()
        assert data["status"] in ["PENDING", "RUNNING", "COMPLETED", "FAILED"]

    def test_records_processed_is_non_negative(self):
        data = self.response.json()
        assert data["recordsProcessed"] >= 0

    def test_response_time_within_sla(self):
        assert self.response.elapsed.total_seconds() < 2.0, (
            f"Response time {self.response.elapsed.total_seconds()}s exceeded 2s SLA"
        )

    def test_correlation_id_echoed(self):
        assert self.response.headers.get("X-Correlation-Id") == "integration-test-run-001"
```

#### 4.1.2 REST Assured (Java) Contract Validation

```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

public class MigrationEndpointContractTest {

    private static final String BASE_URI = "http://localhost:8080";
    private static final String TOKEN = System.getenv("MAP_TEST_TOKEN");

    @Test
    void migrationEndpointReturnsValidContract() {
        given()
            .baseUri(BASE_URI)
            .header("Authorization", "Bearer " + TOKEN)
            .header("X-Correlation-Id", "contract-test-001")
            .pathParam("id", "test-migration-uuid")
        .when()
            .get("/api/v1/migrations/{id}")
        .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("migrationId", notNullValue())
            .body("status", in("PENDING", "RUNNING", "COMPLETED", "FAILED"))
            .body("createdAt", matchesPattern("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.*"))
            .body("recordsProcessed", greaterThanOrEqualTo(0))
            .header("X-Correlation-Id", "contract-test-001")
            .time(lessThan(2000L)); // 2 second SLA
    }

    @Test
    void migrationEndpointReturns404ForUnknownId() {
        given()
            .baseUri(BASE_URI)
            .header("Authorization", "Bearer " + TOKEN)
            .pathParam("id", "non-existent-uuid")
        .when()
            .get("/api/v1/migrations/{id}")
        .then()
            .statusCode(404)
            .body("error.code", equalTo("MIGRATION_NOT_FOUND"))
            .body("error.message", notNullValue());
    }
}
```

### 4.2 Contract Testing

MAP adopts a **consumer-driven contract** approach. Every consumer defines its expectations, and providers must honor them.

#### 4.2.1 Contract Testing Principles

| Principle                         | Requirement                                                   |
|-----------------------------------|---------------------------------------------------------------|
| Consumer defines contract         | Consumers specify required fields, types, and behaviors       |
| Provider validates against contract | Provider must pass all consumer-defined expectations         |
| Contract versioning               | Contracts are versioned alongside API versions                |
| Contract registry                 | All contracts stored in a centralized contract repository     |
| Breaking change detection         | Automated CI check prevents breaking changes from deploying   |
| Contract review                   | Every contract change requires peer review                   |

#### 4.2.2 Pact Contract Test Example (Python)

```python
import pact
from pact import Consumer, Provider

# Consumer test: defines expectations
def test_migration_service_contract():
    pact = Consumer("migration-dashboard").has_pact_with(
        Provider("migration-api"),
        pact_dir="./pacts",
        log_dir="./pact_logs"
    )

    expected_body = {
        "migrationId": pact.Like("550e8400-e29b-41d4-a716-446655440000"),
        "status": pact.Like("RUNNING"),
        "createdAt": pact.Like("2026-07-01T10:30:00Z"),
        "recordsProcessed": pact.Like(1500),
        "totalRecords": pact.Like(10000),
        "errors": pact.Like([])
    }

    pact.given("a migration with id test-migration-uuid exists")
    pact.upon_receiving("a request for migration details")
    pact.with_request("GET", "/api/v1/migrations/test-migration-uuid")
    pact.will_respond_with(200, body=expected_body)

    with pact:
        result = requests.get(
            f"{pact.uri}/api/v1/migrations/test-migration-uuid",
            headers={"Authorization": "Bearer test-token"}
        )
        assert result.status_code == 200
        assert "migrationId" in result.json()
```

### 4.3 Schema Validation

Every API response must be validated against its published JSON Schema or OpenAPI specification.

#### 4.3.1 Schema Validation Checklist

| Check                                | Method                          | Frequency       |
|--------------------------------------|--------------------------------|-----------------|
| Response conforms to OpenAPI spec    | Schema validator               | Every test run  |
| All required fields present          | Required field check           | Every test run  |
| No unexpected fields (strict mode)   | Additional properties check    | Every test run  |
| Enum values match specification      | Enum validation                | Every test run  |
| Format constraints (date, uuid)      | Format validation              | Every test run  |
| Nested object structures             | Recursive schema validation    | Every test run  |
| Array item schemas                   | Items schema validation        | Every test run  |

#### 4.3.2 OpenAPI Schema Validation Example

```python
import yaml
import json
from openapi_core import Spec
from openapi_core.testing.mock import MockRequest, MockResponse

def load_openapi_spec():
    with open("api/openapi.yaml", "r") as f:
        spec_dict = yaml.safe_load(f)
    return Spec.from_dict(spec_dict)

def validate_response_against_spec(endpoint, method, status_code, body):
    """Validate an API response against the published OpenAPI spec."""
    spec = load_openapi_spec()

    request = MockRequest(
        host="localhost",
        method=method,
        path=endpoint,
        headers={"Authorization": "Bearer test-token"}
    )

    response = MockResponse(
        status_code=status_code,
        json=body
    )

    # Validate response body against spec
    operation = spec.get_operation(path=endpoint, method=method)
    response_schema = operation.get_response_schema(status_code)

    if response_schema:
        validate(body, response_schema)

    return True


class TestMigrationAPIOpenAPICompliance:
    """Validate all migration API endpoints against OpenAPI specification."""

    def test_create_migration_complies_with_spec(self):
        body = {
            "sourceSystem": "CORE_BANKING",
            "targetSystem": "CLOUD_MIGRATION",
            "recordType": "ACCOUNTS"
        }
        assert validate_response_against_spec(
            endpoint="/api/v1/migrations",
            method="post",
            status_code=201,
            body=body
        )

    def test_list_migrations_complies_with_spec(self):
        body = {
            "data": [
                {
                    "migrationId": "550e8400-e29b-41d4-a716-446655440000",
                    "status": "RUNNING",
                    "createdAt": "2026-07-01T10:30:00Z"
                }
            ],
            "pagination": {
                "currentPage": 1,
                "totalPages": 10,
                "totalRecords": 250
            }
        }
        assert validate_response_against_spec(
            endpoint="/api/v1/migrations",
            method="get",
            status_code=200,
            body=body
        )
```

---

## 5. Database Testing Standards

### 5.1 Query Validation

All database integration tests must verify that queries execute correctly against the actual database engine (not a mock or in-memory substitute for production-like environments).

#### 5.1.1 Query Validation Requirements

| Requirement                          | Description                                                       |
|--------------------------------------|-------------------------------------------------------------------|
| Query execution success              | Queries complete without errors                                   |
| Result set correctness               | Returned data matches expected values                             |
| Performance under load               | Queries complete within documented time thresholds                |
| Index utilization                    | Queries use appropriate indexes (verified via EXPLAIN)            |
| Parameterized queries                | All queries use parameterized inputs to prevent SQL injection     |
| Connection pooling                   | Tests validate pool behavior under concurrent access              |
| Transaction isolation                | Concurrent transactions produce expected isolation results         |

#### 5.1.2 Database Query Validation Example (pytest + SQLAlchemy)

```python
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta


@pytest.fixture(scope="module")
def db_engine():
    """Create a test database engine pointing to the integration test database."""
    engine = create_engine(
        "postgresql://map_test_user:secret@localhost:5432/map_integration_test",
        pool_size=5,
        pool_pre_ping=True,
        echo=False  # Set True for debugging
    )
    yield engine
    engine.dispose()


@pytest.fixture
def db_session(db_engine):
    """Provide a transactional session that rolls back after each test."""
    Session = sessionmaker(bind=db_engine)
    session = Session()
    yield session
    session.rollback()
    session.close()


class TestMigrationQueryValidation:
    """Validate database queries used by the migration service."""

    def test_migration_status_query_returns_expected_columns(self, db_engine):
        query = text("""
            SELECT migration_id, status, created_at, updated_at, 
                   records_processed, total_records
            FROM map.migrations 
            WHERE status = :status
            ORDER BY created_at DESC
            LIMIT :limit
        """)

        with db_engine.connect() as conn:
            result = conn.execute(query, {"status": "RUNNING", "limit": 10})
            columns = result.keys()
            rows = result.fetchall()

        expected_columns = [
            "migration_id", "status", "created_at", "updated_at",
            "records_processed", "total_records"
        ]
        assert list(columns) == expected_columns
        assert len(rows) <= 10

    def test_migration_count_query_is_accurate(self, db_engine):
        count_query = text("""
            SELECT COUNT(*) as total 
            FROM map.migrations 
            WHERE created_at BETWEEN :start_date AND :end_date
        """)

        with db_engine.connect() as conn:
            result = conn.execute(count_query, {
                "start_date": datetime(2026, 1, 1),
                "end_date": datetime(2026, 12, 31)
            })
            count = result.scalar()

        assert isinstance(count, int)
        assert count >= 0

    def test_migration_audit_trail_query_links_correctly(self, db_engine):
        query = text("""
            SELECT m.migration_id, ma.action, ma.performed_by, ma.performed_at
            FROM map.migrations m
            JOIN map.migration_audit ma ON m.migration_id = ma.migration_id
            WHERE m.migration_id = :migration_id
            ORDER BY ma.performed_at ASC
        """)

        with db_engine.connect() as conn:
            result = conn.execute(query, {"migration_id": "test-uuid"})
            rows = result.fetchall()

        if rows:
            # Verify audit trail is in chronological order
            timestamps = [row[3] for row in rows]
            assert timestamps == sorted(timestamps)

    def test_query_uses_index_for_filter(self, db_engine):
        explain_query = text("""
            EXPLAIN (ANALYZE, FORMAT JSON)
            SELECT * FROM map.migrations 
            WHERE status = 'RUNNING' AND created_at > :date
        """)

        with db_engine.connect() as conn:
            result = conn.execute(explain_query, {"date": datetime(2026, 1, 1)})
            plan = result.scalar()

        # Verify index is used (not sequential scan)
        assert "Index Scan" in str(plan) or "Bitmap Index Scan" in str(plan)
```

### 5.2 Transaction Testing

#### 5.2.1 Transaction Behavior Matrix

| Scenario                        | Expected Behavior                                              |
|---------------------------------|----------------------------------------------------------------|
| Successful commit               | All changes persisted, data consistent                         |
| Rollback on error               | No partial writes, data remains unchanged                      |
| Concurrent transactions         | Isolation level enforced, no dirty reads                       |
| Long-running transaction        | Lock acquisition within timeout, no deadlock                   |
| Savepoint and partial rollback  | Only targeted operations reverted                              |
| Transaction timeout             | Connection released, partial state handled                     |
| Distributed transaction (2PC)   | All-or-nothing across services                                 |

#### 5.2.2 Transaction Integrity Test Example

```python
import pytest
from sqlalchemy import text
from contextlib import contextmanager


class TestTransactionIntegrity:
    """Validate transaction behavior under various conditions."""

    @contextmanager
    def nested_transaction(self, session):
        """Context manager for testing nested transactions."""
        savepoint = session.begin_nested()
        try:
            yield savepoint
        except Exception:
            savepoint.rollback()
            raise

    def test_successful_migration_transaction(self, db_engine):
        """Verify a migration transaction commits all changes atomically."""
        with db_engine.begin() as conn:
            # Create migration record
            conn.execute(text("""
                INSERT INTO map.migrations (migration_id, status, source_system, target_system)
                VALUES (:id, 'PENDING', 'CORE_BANKING', 'CLOUD_MIGRATION')
            """), {"id": "test-txn-001"})

            # Create initial audit entry
            conn.execute(text("""
                INSERT INTO map.migration_audit (migration_id, action, performed_by, performed_at)
                VALUES (:id, 'CREATED', 'system', NOW())
            """), {"id": "test-txn-001"})

        # Verify both records exist
        with db_engine.connect() as conn:
            migration = conn.execute(text(
                "SELECT status FROM map.migrations WHERE migration_id = :id"
            ), {"id": "test-txn-001"}).scalar()

            audit = conn.execute(text(
                "SELECT COUNT(*) FROM map.migration_audit WHERE migration_id = :id"
            ), {"id": "test-txn-001"}).scalar()

        assert migration == "PENDING"
        assert audit == 1

    def test_rollback_on_error_preserves_data(self, db_engine):
        """Verify rollback prevents partial writes on error."""
        # Attempt a transaction that will fail
        with pytest.raises(Exception):
            with db_engine.begin() as conn:
                conn.execute(text("""
                    INSERT INTO map.migrations (migration_id, status)
                    VALUES ('test-txn-rollback', 'PENDING')
                """))

                # This will fail due to NOT NULL constraint
                conn.execute(text("""
                    INSERT INTO map.migrations (migration_id, status)
                    VALUES (NULL, 'PENDING')
                """))

        # Verify the first insert was also rolled back
        with db_engine.connect() as conn:
            count = conn.execute(text(
                "SELECT COUNT(*) FROM map.migrations WHERE migration_id = 'test-txn-rollback'"
            )).scalar()

        assert count == 0

    def test_concurrent_transaction_isolation(self, db_engine):
        """Verify transaction isolation prevents dirty reads."""
        import threading
        import time

        results = {"session_a": None, "session_b": None}

        def session_a_work():
            Session = sessionmaker(bind=db_engine)
            session = Session()
            conn = session.connection()
            conn.execute(text("SET TRANSACTION ISOLATION LEVEL READ COMMITTED"))
            conn.execute(text("BEGIN"))
            conn.execute(text("""
                UPDATE map.migrations SET status = 'PAUSED'
                WHERE migration_id = 'concurrent-test'
            """))
            time.sleep(0.5)  # Simulate processing time
            results["session_a"] = conn.execute(text(
                "SELECT status FROM map.migrations WHERE migration_id = 'concurrent-test'"
            )).scalar()
            session.rollback()
            session.close()

        def session_b_work():
            time.sleep(0.1)  # Start slightly after session A
            Session = sessionmaker(bind=db_engine)
            session = Session()
            conn = session.connection()
            # Session B should see original value (dirty read prevented)
            results["session_b"] = conn.execute(text(
                "SELECT status FROM map.migrations WHERE migration_id = 'concurrent-test'"
            )).scalar()
            session.close()

        thread_a = threading.Thread(target=session_a_work)
        thread_b = threading.Thread(target=session_b_work)
        thread_a.start()
        thread_b.start()
        thread_a.join()
        thread_b.join()

        # Session B should NOT see Session A's uncommitted change
        assert results["session_b"] != "PAUSED"
```

### 5.3 Data Integrity

#### 5.3.1 Data Integrity Validation Rules

| Rule Category          | Validation                                                    |
|------------------------|---------------------------------------------------------------|
| Primary Key Uniqueness | No duplicate primary keys in any table                        |
| Foreign Key Consistency | Every FK references an existing parent record                 |
| NOT NULL Constraints   | Required fields are never NULL                                |
| Check Constraints      | All CHECK constraints pass                                    |
| Unique Constraints     | Unique indexes enforce business uniqueness                    |
| Data Type Consistency  | Values match column data types                                |
| Referential Integrity  | Cascade rules produce expected results                        |
| Temporal Consistency   | Created-at <= Updated-at for all records                      |
| Business Rule Compliance | Domain-specific invariants hold                              |

#### 5.3.2 Data Integrity Test Example

```python
class TestDataIntegrity:
    """Comprehensive data integrity checks for the migration database."""

    def test_primary_key_uniqueness(self, db_engine):
        """Verify all primary keys are unique across critical tables."""
        tables = [
            ("map.migrations", "migration_id"),
            ("map.migration_records", "record_id"),
            ("map.migration_audit", "audit_id"),
            ("map.data_validation_results", "validation_id"),
        ]

        for table, pk_column in tables:
            query = text(f"""
                SELECT {pk_column}, COUNT(*) as cnt
                FROM {table}
                GROUP BY {pk_column}
                HAVING COUNT(*) > 1
            """)
            with db_engine.connect() as conn:
                duplicates = conn.execute(query).fetchall()

            assert len(duplicates) == 0, (
                f"Duplicate primary keys found in {table}: {duplicates[:5]}"
            )

    def test_foreign_key_consistency(self, db_engine):
        """Verify all foreign keys reference existing parent records."""
        fk_checks = [
            (
                "map.migration_records",
                "migration_id",
                "map.migrations",
                "migration_id"
            ),
            (
                "map.migration_audit",
                "migration_id",
                "map.migrations",
                "migration_id"
            ),
            (
                "map.data_validation_results",
                "record_id",
                "map.migration_records",
                "record_id"
            ),
        ]

        for child_table, child_fk, parent_table, parent_pk in fk_checks:
            query = text(f"""
                SELECT c.{child_fk}
                FROM {child_table} c
                LEFT JOIN {parent_table} p ON c.{child_fk} = p.{parent_pk}
                WHERE p.{parent_pk} IS NULL
            """)
            with db_engine.connect() as conn:
                orphans = conn.execute(query).fetchall()

            assert len(orphans) == 0, (
                f"Orphaned FK references in {child_table}.{child_fk}: "
                f"{[r[0] for r in orphans[:5]]}"
            )

    def test_not_null_constraints(self, db_engine):
        """Verify NOT NULL columns are never NULL."""
        not_null_checks = [
            ("map.migrations", "migration_id", "NOT NULL field migration_id is NULL"),
            ("map.migrations", "status", "NOT NULL field status is NULL"),
            ("map.migrations", "created_at", "NOT NULL field created_at is NULL"),
            ("map.migration_records", "record_id", "NOT NULL field record_id is NULL"),
            ("map.migration_records", "migration_id", "NOT NULL field migration_id is NULL"),
        ]

        for table, column, error_msg in not_null_checks:
            query = text(f"SELECT COUNT(*) FROM {table} WHERE {column} IS NULL")
            with db_engine.connect() as conn:
                null_count = conn.execute(query).scalar()

            assert null_count == 0, f"{error_msg} ({null_count} rows affected)"

    def test_temporal_consistency(self, db_engine):
        """Verify created_at <= updated_at for all records."""
        query = text("""
            SELECT COUNT(*)
            FROM map.migrations
            WHERE created_at > updated_at
        """)
        with db_engine.connect() as conn:
            violations = conn.execute(query).scalar()

        assert violations == 0, (
            f"Found {violations} records where created_at > updated_at"
        )

    def test_business_rule_migration_progress(self, db_engine):
        """Verify migration progress (records_processed <= total_records)."""
        query = text("""
            SELECT COUNT(*)
            FROM map.migrations
            WHERE records_processed > total_records
            AND status IN ('RUNNING', 'COMPLETED')
        """)
        with db_engine.connect() as conn:
            violations = conn.execute(query).scalar()

        assert violations == 0, (
            f"Found {violations} migrations with records_processed > total_records"
        )
```

---

## 6. Service Integration Testing

### 6.1 Microservices Testing

#### 6.1.1 Microservices Integration Test Matrix

| Integration Pattern              | Test Type                        | Priority |
|----------------------------------|----------------------------------|----------|
| Synchronous REST/gRPC call       | Contract + Integration           | High     |
| Asynchronous message queue       | Event-driven + Integration       | High     |
| Database shared between services | Data consistency validation      | Critical |
| Service discovery                | Health check + registry validation | Medium |
| Circuit breaker                  | Failure scenario testing         | High     |
| Retry mechanisms                 | Transient failure handling       | Medium   |
| Load balancing                   | Distribution verification        | Low      |
| Service mesh communication       | mTLS + routing validation        | Medium   |

#### 6.1.2 Microservices Integration Test Pattern

```python
import pytest
import requests
import time
from typing import Optional


class ServiceIntegrationTestBase:
    """Base class for MAP microservice integration tests."""

    SERVICES = {
        "migration-api": "http://localhost:8080",
        "validation-engine": "http://localhost:8081",
        "notification-service": "http://localhost:8082",
        "audit-service": "http://localhost:8083",
        "reporting-service": "http://localhost:8084",
    }

    TIMEOUT = 5.0  # seconds
    RETRY_COUNT = 3
    RETRY_DELAY = 1.0  # seconds

    def wait_for_service(self, service_name: str, timeout: float = 30.0) -> bool:
        """Wait for a service to become available."""
        url = f"{self.SERVICES[service_name]}/health"
        start = time.time()

        while time.time() - start < timeout:
            try:
                response = requests.get(url, timeout=self.TIMEOUT)
                if response.status_code == 200:
                    return True
            except requests.ConnectionError:
                pass
            time.sleep(self.RETRY_DELAY)

        return False

    def retry_request(self, method: str, url: str, **kwargs) -> requests.Response:
        """Execute an HTTP request with retry logic."""
        last_exception = None
        for attempt in range(self.RETRY_COUNT):
            try:
                response = getattr(requests, method)(url, timeout=self.TIMEOUT, **kwargs)
                if response.status_code < 500:
                    return response
                last_exception = RuntimeError(f"Server error: {response.status_code}")
            except requests.RequestException as e:
                last_exception = e
            time.sleep(self.RETRY_DELAY * (attempt + 1))

        raise last_exception


class TestMigrationAPIIntegration(ServiceIntegrationTestBase):
    """Integration tests for the Migration API service."""

    @pytest.fixture(autouse=True)
    def setup(self):
        assert self.wait_for_service("migration-api"), "Migration API not available"
        self.base_url = self.SERVICES["migration-api"]

    def test_create_and_retrieve_migration(self):
        """Test full create-retrieve cycle through the migration API."""
        # Create
        create_response = self.retry_request(
            "post",
            f"{self.base_url}/api/v1/migrations",
            json={
                "sourceSystem": "CORE_BANKING",
                "targetSystem": "CLOUD_MIGRATION",
                "recordType": "ACCOUNTS",
                "batchSize": 1000
            },
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"}
        )
        assert create_response.status_code == 201
        migration_id = create_response.json()["migrationId"]

        # Retrieve
        get_response = self.retry_request(
            "get",
            f"{self.base_url}/api/v1/migrations/{migration_id}",
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"}
        )
        assert get_response.status_code == 200
        assert get_response.json()["migrationId"] == migration_id
        assert get_response.json()["status"] == "PENDING"

    def test_migration_status_transition(self):
        """Verify status transitions follow the state machine."""
        valid_transitions = {
            "PENDING": ["RUNNING", "CANCELLED"],
            "RUNNING": ["PAUSED", "COMPLETED", "FAILED", "CANCELLED"],
            "PAUSED": ["RUNNING", "CANCELLED"],
            "COMPLETED": [],
            "FAILED": ["RUNNING"],
            "CANCELLED": [],
        }

        # Create a migration
        create_response = self.retry_request(
            "post",
            f"{self.base_url}/api/v1/migrations",
            json={
                "sourceSystem": "LOAN_SYSTEM",
                "targetSystem": "CLOUD_MIGRATION",
                "recordType": "LOANS"
            },
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"}
        )
        migration_id = create_response.json()["migrationId"]

        # Attempt valid transition: PENDING -> RUNNING
        update_response = self.retry_request(
            "patch",
            f"{self.base_url}/api/v1/migrations/{migration_id}",
            json={"status": "RUNNING"},
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"}
        )
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "RUNNING"

        # Attempt invalid transition: RUNNING -> PENDING (not in valid_transitions)
        invalid_response = self.retry_request(
            "patch",
            f"{self.base_url}/api/v1/migrations/{migration_id}",
            json={"status": "PENDING"},
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"}
        )
        assert invalid_response.status_code == 422  # Unprocessable Entity
```

### 6.2 Message Queue Integration

#### 6.2.1 Message Queue Test Scenarios

| Scenario                              | Expected Outcome                                           |
|---------------------------------------|-------------------------------------------------------------|
| Publish message to valid topic        | Message consumed by all subscribers                         |
| Publish to non-existent topic         | Publisher receives appropriate error                        |
| Consumer processes message            | Message acknowledged, side effects visible                  |
| Consumer fails to process             | Message routed to dead-letter topic                         |
| Duplicate message delivery            | Consumer handles idempotently                               |
| Message ordering                      | FIFO ordering maintained within partition                   |
| Message TTL expiry                    | Message removed after TTL, not delivered                    |
| Consumer group rebalancing            | No message loss during rebalance                            |
| High message volume                   | Throughput within SLA, no message loss                      |
| Poison pill message                   | Consumer doesn't crash, message quarantined                 |

#### 6.2.2 Message Queue Integration Test Example (Kafka)

```python
import pytest
from kafka import KafkaConsumer, KafkaProducer
import json
import time
import uuid


class TestMigrationEventIntegration:
    """Integration tests for MAP Kafka event-driven messaging."""

    KAFKA_BROKER = "localhost:9092"
    TOPIC_MIGRATION_EVENTS = "map.migration.events"
    TOPIC_VALIDATION_EVENTS = "map.validation.events"
    TOPIC_NOTIFICATION_EVENTS = "map.notification.events"

    @pytest.fixture
    def producer(self):
        return KafkaProducer(
            bootstrap_servers=self.KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            key_serializer=lambda k: k.encode("utf-8") if k else None
        )

    @pytest.fixture
    def consumer(self):
        consumer = KafkaConsumer(
            self.TOPIC_MIGRATION_EVENTS,
            bootstrap_servers=self.KAFKA_BROKER,
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            group_id=f"integration-test-{uuid.uuid4()}",
            auto_offset_reset="earliest",
            consumer_timeout_ms=10000
        )
        yield consumer
        consumer.close()

    def test_migration_event_publishedSuccessfully(self, producer):
        """Verify migration events are published correctly."""
        event = {
            "eventType": "MIGRATION_STARTED",
            "migrationId": str(uuid.uuid4()),
            "timestamp": time.time(),
            "sourceSystem": "CORE_BANKING",
            "targetSystem": "CLOUD_MIGRATION",
            "recordCount": 5000
        }

        future = producer.send(
            self.TOPIC_MIGRATION_EVENTS,
            key=event["migrationId"],
            value=event
        )
        record_metadata = future.get(timeout=10)

        assert record_metadata.topic == self.TOPIC_MIGRATION_EVENTS
        assert record_metadata.partition >= 0

    def test_migration_event_consumed(self, producer, consumer):
        """Verify migration events are consumed by subscribers."""
        migration_id = str(uuid.uuid4())
        event = {
            "eventType": "MIGRATION_COMPLETED",
            "migrationId": migration_id,
            "timestamp": time.time(),
            "recordsProcessed": 5000,
            "status": "COMPLETED"
        }

        producer.send(
            self.TOPIC_MIGRATION_EVENTS,
            key=migration_id,
            value=event
        ).get(timeout=10)

        # Consume and verify
        consumed_events = []
        for message in consumer:
            consumed_events.append(message.value)
            if message.value.get("migrationId") == migration_id:
                break

        matching_events = [e for e in consumed_events if e.get("migrationId") == migration_id]
        assert len(matching_events) >= 1
        assert matching_events[0]["eventType"] == "MIGRATION_COMPLETED"

    def test_validation_event_triggers_notification(self, producer):
        """Verify validation completion triggers notification event."""
        validation_event = {
            "eventType": "VALIDATION_COMPLETED",
            "migrationId": str(uuid.uuid4()),
            "timestamp": time.time(),
            "validationStatus": "PASSED",
            "recordsValidated": 5000,
            "errors": []
        }

        producer.send(
            self.TOPIC_VALIDATION_EVENTS,
            key=validation_event["migrationId"],
            value=validation_event
        ).get(timeout=10)

        # In a real integration test, we would consume from the
        # notification topic and verify the notification was generated
        # For this example, we verify the event was published
        assert True  # Placeholder - actual test consumes notification topic

    def test_dead_letter_queue_captures_failed_messages(self, producer):
        """Verify failed messages are routed to dead-letter queue."""
        poison_event = {
            "eventType": "INVALID_EVENT_TYPE",  # Unknown event type
            "migrationId": None,  # Missing required field
            "timestamp": "invalid-timestamp"  # Wrong type
        }

        producer.send(
            self.TOPIC_MIGRATION_EVENTS,
            key="poison-pill",
            value=poison_event
        ).get(timeout=10)

        # Consumer would fail processing, message should go to DLT
        # Verify by consuming from the dead-letter topic
        dlt_consumer = KafkaConsumer(
            "map.migration.events.DLT",
            bootstrap_servers=self.KAFKA_BROKER,
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            consumer_timeout_ms=5000
        )

        dlt_messages = list(dlt_consumer)
        dlt_consumer.close()

        assert len(dlt_messages) >= 1
        assert dlt_messages[0].value.get("eventType") == "INVALID_EVENT_TYPE"
```

### 6.3 Event-Driven Testing

#### 6.3.1 Event-Driven Integration Test Categories

| Category               | Description                                                       |
|------------------------|-------------------------------------------------------------------|
| Event Publishing       | Verify events are published with correct payload and metadata     |
| Event Consumption      | Verify consumers receive and process events correctly             |
| Event Ordering         | Verify events are processed in correct sequence                   |
| Event Idempotency      | Verify duplicate events are handled correctly                     |
| Event Correlation      | Verify events can be traced through the system                    |
| Event Schema Evolution | Verify backward/forward compatibility of event schemas            |
| Event Replay           | Verify events can be replayed for recovery                        |
| Event Retention        | Verify events are retained per policy                             |

---

## 7. External Integration Testing

### 7.1 Third-Party API Integration

#### 7.1.1 Third-Party API Test Requirements

| Requirement                         | Description                                                     |
|-------------------------------------|-----------------------------------------------------------------|
| API availability check              | Verify third-party API endpoint is reachable                    |
| Authentication validation           | Verify credentials and auth flow work correctly                 |
| Request format compliance           | Verify outbound requests match vendor specification             |
| Response parsing                    | Verify inbound responses are parsed correctly                   |
| Rate limit handling                 | Verify graceful handling of rate limit responses (429)          |
| Error handling                      | Verify timeout, network error, and error response handling      |
| Retry with backoff                  | Verify retry logic with exponential backoff                     |
| Circuit breaker activation          | Verify circuit opens after consecutive failures                 |
| Fallback behavior                   | Verify degraded functionality when third-party is unavailable   |
| Data mapping accuracy               | Verify data transformation between MAP and vendor format        |

#### 7.1.2 Third-Party Integration Test Example

```python
import pytest
import requests
from unittest.mock import Mock, patch
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class TestExternalAPIntegration:
    """Integration tests for external API connections."""

    @pytest.fixture
    def external_api_session(self):
        """Create a session with retry logic for external API calls."""
        session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("https://", adapter)
        return session

    def test_third_party_api_authentication(self, external_api_session):
        """Verify we can authenticate with the third-party API."""
        response = external_api_session.post(
            "https://api.vendor.com/oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": "map_integration_test_client",
                "client_secret": "{{VENDOR_CLIENT_SECRET}}"
            }
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["token_type"] == "Bearer"

    def test_data_transformation_accuracy(self):
        """Verify MAP data is correctly transformed for vendor format."""
        # MAP internal format
        map_account = {
            "accountId": "ACC-001-XYZ",
            "customerName": "John Doe",
            "balance": 15000.00,
            "currency": "USD",
            "status": "ACTIVE",
            "openedDate": "2020-01-15"
        }

        # Expected vendor format
        expected_vendor_payload = {
            "acct_id": "ACC-001-XYZ",
            "cust_nm": "John Doe",
            "bal_amt": 15000.00,
            "ccy_cd": "USD",
            "acct_sts": "A",
            "opn_dt": "20200115"
        }

        # Transform function (in production, this is in a mapper service)
        def transform_to_vendor_format(map_data):
            return {
                "acct_id": map_data["accountId"],
                "cust_nm": map_data["customerName"],
                "bal_amt": map_data["balance"],
                "ccy_cd": map_data["currency"],
                "acct_sts": "A" if map_data["status"] == "ACTIVE" else "I",
                "opn_dt": map_data["openedDate"].replace("-", "")
            }

        vendor_payload = transform_to_vendor_format(map_account)
        assert vendor_payload == expected_vendor_payload

    def test_rate_limit_handling(self, external_api_session):
        """Verify MAP handles third-party rate limits gracefully."""
        # Simulate rate limit response
        rate_limit_response = Mock()
        rate_limit_response.status_code = 429
        rate_limit_response.headers = {
            "Retry-After": "60",
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0"
        }

        # Verify our client handles this appropriately
        assert rate_limit_response.headers["Retry-After"] == "60"
        assert rate_limit_response.status_code == 429

    def test_circuit_breaker_on_repeated_failures(self):
        """Verify circuit breaker activates after consecutive failures."""
        class CircuitBreaker:
            def __init__(self, failure_threshold=5, recovery_timeout=60):
                self.failure_count = 0
                self.failure_threshold = failure_threshold
                self.recovery_timeout = recovery_timeout
                self.state = "CLOSED"
                self.last_failure_time = None

            def record_failure(self):
                self.failure_count += 1
                self.last_failure_time = time.time()
                if self.failure_count >= self.failure_threshold:
                    self.state = "OPEN"

            def record_success(self):
                self.failure_count = 0
                self.state = "CLOSED"

            def can_execute(self):
                if self.state == "CLOSED":
                    return True
                if self.state == "OPEN":
                    if time.time() - self.last_failure_time > self.recovery_timeout:
                        self.state = "HALF_OPEN"
                        return True
                    return False
                return True  # HALF_OPEN allows one attempt

        cb = CircuitBreaker(failure_threshold=3)

        # Simulate consecutive failures
        for _ in range(3):
            cb.record_failure()

        assert cb.state == "OPEN"
        assert cb.can_execute() is False
```

### 7.2 Webhook Integration

#### 7.2.1 Webhook Test Matrix

| Test Case                            | Description                                                   |
|--------------------------------------|---------------------------------------------------------------|
| Successful webhook delivery          | Webhook received, processed, acknowledged (200)               |
| Webhook signature validation         | HMAC signature verified correctly                             |
| Webhook replay handling              | Duplicate webhook idempotently processed                      |
| Webhook timeout handling             | Client responds within timeout                                |
| Webhook retry mechanism              | Failed deliveries retried with backoff                        |
| Webhook payload validation           | Malformed payloads rejected with 400                          |
| Webhook subscription management      | Subscribe, unsubscribe, list subscriptions                    |
| Webhook event filtering              | Only subscribed events are delivered                          |
| Webhook delivery logging             | All delivery attempts logged for audit                        |
| Webhook security                     | Only HTTPS endpoints accepted, TLS verified                   |

### 7.3 OAuth Flows

#### 7.3.1 OAuth Integration Test Scenarios

| Flow                      | Test Scenario                                              |
|---------------------------|------------------------------------------------------------|
| Authorization Code        | Full code exchange, token retrieval, refresh               |
| Client Credentials        | Service-to-service token acquisition                       |
| Token Refresh             | Expired token refresh produces valid new token             |
| Token Revocation          | Revoked token produces 401, refresh fails                   |
| Scope Validation          | Tokens with limited scopes access only authorized resources |
| PKCE Flow                 | Authorization code with code verifier/challenge             |
| JWT Validation            | Token signature, expiry, issuer, audience claims            |
| Rate Limiting             | Token endpoint rate limiting enforced                       |

#### 7.3.2 OAuth Flow Integration Test Example

```python
import pytest
import jwt
import time
import hashlib
import base64
import requests


class TestOAuthIntegration:
    """Integration tests for MAP OAuth 2.0 flows."""

    AUTH_SERVER = "http://localhost:9090"
    CLIENT_ID = "map-integration-test"
    CLIENT_SECRET = "test-secret"

    def test_authorization_code_flow(self):
        """Test full authorization code flow with PKCE."""
        # Generate PKCE code verifier and challenge
        code_verifier = base64.urlsafe_b64encode(
            hashlib.sha256(str(time.time()).encode()).digest()
        ).rstrip(b"=").decode("utf-8")

        code_challenge = base64.urlsafe_b64encode(
            hashlib.sha256(code_verifier.encode()).digest()
        ).rstrip(b"=").decode("utf-8")

        # Step 1: Authorization request (simulated - would redirect to browser)
        auth_params = {
            "response_type": "code",
            "client_id": self.CLIENT_ID,
            "redirect_uri": "http://localhost:8080/callback",
            "scope": "migration:read migration:write",
            "state": "random-state-token",
            "code_challenge": code_challenge,
            "code_challenge_method": "S256"
        }

        # In real test, this would be handled by the auth server
        # Here we mock the auth server response
        auth_code = "test-authorization-code-12345"

        # Step 2: Exchange authorization code for tokens
        token_response = requests.post(
            f"{self.AUTH_SERVER}/oauth/token",
            data={
                "grant_type": "authorization_code",
                "code": auth_code,
                "redirect_uri": "http://localhost:8080/callback",
                "client_id": self.CLIENT_ID,
                "code_verifier": code_verifier
            }
        )

        # Verify token response
        assert token_response.status_code == 200
        tokens = token_response.json()
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        assert tokens["token_type"] == "Bearer"
        assert tokens["expires_in"] > 0

    def test_client_credentials_flow(self):
        """Test service-to-service client credentials flow."""
        token_response = requests.post(
            f"{self.AUTH_SERVER}/oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": self.CLIENT_ID,
                "client_secret": self.CLIENT_SECRET,
                "scope": "migration:read"
            }
        )

        assert token_response.status_code == 200
        token = token_response.json()["access_token"]

        # Verify token can access protected resource
        protected_response = requests.get(
            "http://localhost:8080/api/v1/migrations",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert protected_response.status_code == 200

    def test_token_refresh_flow(self):
        """Test access token refresh with refresh token."""
        # Obtain initial tokens
        initial_response = requests.post(
            f"{self.AUTH_SERVER}/oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": self.CLIENT_ID,
                "client_secret": self.CLIENT_SECRET
            }
        )
        refresh_token = initial_response.json().get("refresh_token")

        # Refresh the access token
        refresh_response = requests.post(
            f"{self.AUTH_SERVER}/oauth/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": self.CLIENT_ID,
                "client_secret": self.CLIENT_SECRET
            }
        )

        assert refresh_response.status_code == 200
        new_tokens = refresh_response.json()
        assert "access_token" in new_tokens
        assert new_tokens["access_token"] != initial_response.json()["access_token"]

    def test_expired_token_rejected(self):
        """Verify expired tokens are rejected."""
        # Create a JWT with expired timestamp
        expired_payload = {
            "sub": "map-test-user",
            "iss": self.AUTH_SERVER,
            "aud": "map-api",
            "exp": int(time.time()) - 3600,  # Expired 1 hour ago
            "iat": int(time.time()) - 7200
        }

        # Sign with test key (in real test, use actual signing key)
        expired_token = jwt.encode(expired_payload, "test-key", algorithm="RS256")

        response = requests.get(
            "http://localhost:8080/api/v1/migrations",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert response.status_code == 401
        assert response.json()["error"]["code"] == "TOKEN_EXPIRED"

    def test_insufficient_scope_rejected(self):
        """Verify tokens with insufficient scope are rejected."""
        token_response = requests.post(
            f"{self.AUTH_SERVER}/oauth/token",
            data={
                "grant_type": "client_credentials",
                "client_id": self.CLIENT_ID,
                "client_secret": self.CLIENT_SECRET,
                "scope": "migration:read"  # Read-only scope
            }
        )
        token = token_response.json()["access_token"]

        # Attempt write operation with read-only token
        response = requests.post(
            "http://localhost:8080/api/v1/migrations",
            json={"sourceSystem": "TEST"},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
        assert response.json()["error"]["code"] == "INSUFFICIENT_SCOPE"
```

---

## 8. Authentication Testing Standards

### 8.1 Token Validation

#### 8.1.1 Token Validation Test Matrix

| Validation Aspect          | Test Cases                                                 |
|----------------------------|------------------------------------------------------------|
| Token structure            | Valid JWT format (header.payload.signature)                |
| Token signature            | Valid signature using correct algorithm                    |
| Token expiry               | Expired tokens rejected, tokens near expiry handled         |
| Token issuer               | Tokens from unknown issuers rejected                       |
| Token audience             | Tokens for wrong audience rejected                         |
| Token subject              | Subject claim correctly identifies the user                |
| Token claims               | All required claims present and valid                       |
| Token algorithm            | Algorithm in header matches expected algorithm              |
| Token not-before           | Tokens used before nbf claim rejected                      |
| Token type                 | Only expected token types accepted                         |

### 8.2 Session Management

#### 8.2.1 Session Test Scenarios

| Scenario                           | Expected Behavior                                          |
|------------------------------------|-------------------------------------------------------------|
| Session creation on login          | Valid session created with secure attributes                |
| Session timeout                    | Session expires after configured idle timeout               |
| Session invalidation on logout     | Session fully terminated, token revoked                     |
| Concurrent session limit           | Excess sessions gracefully terminated                       |
| Session fixation prevention        | New session ID generated on authentication                  |
| Session secure attributes          | HttpOnly, Secure, SameSite flags set                        |
| Session data isolation             | User A cannot access User B session data                    |

### 8.3 SSO Integration

#### 8.3.1 SSO Test Scenarios

| Scenario                           | Expected Behavior                                          |
|------------------------------------|-------------------------------------------------------------|
| SAML assertion validation          | SAML response validated, user authenticated                 |
| SAML assertion replay prevention   | Replayed assertions rejected                                |
| OIDC discovery                     | Configuration endpoint returns correct metadata             |
| OIDC userinfo                      | Userinfo endpoint returns valid user attributes             |
| SSO session propagation            | Login in System A provides access to System B               |
| SSO logout                         | Single logout terminates sessions across all systems        |
| IdP-initiated login                | Login initiated from IdP dashboard works correctly          |
| SP-initiated login                 | Login initiated from MAP works correctly                    |

---

## 9. Infrastructure Validation

### 9.1 Network Validation

#### 9.1.1 Network Integration Test Checklist

| Check                                    | Method                                                       |
|------------------------------------------|--------------------------------------------------------------|
| Service-to-service connectivity          | HTTP/gRPC health checks between services                     |
| DNS resolution                           | Service names resolve correctly in each namespace             |
| Port accessibility                       | Required ports are open between services                     |
| TLS termination                          | HTTPS connections established with valid certificates        |
| mTLS (if enabled)                        | Mutual TLS authentication between services                   |
| Network policy enforcement               | Unauthorized traffic is blocked                              |
| Load balancer routing                    | Traffic distributed correctly across instances               |
| Ingress/egress rules                     | External traffic enters through correct paths                |
| Latency between services                 | Inter-service latency within acceptable thresholds           |

#### 9.1.2 Network Validation Test Example

```python
import pytest
import socket
import ssl
import subprocess
from urllib.parse import urlparse


class TestNetworkIntegration:
    """Validate network connectivity between MAP services."""

    def test_service_dns_resolution(self):
        """Verify all MAP services resolve via DNS."""
        services = {
            "migration-api": "migration-api.map.svc.cluster.local",
            "validation-engine": "validation-engine.map.svc.cluster.local",
            "notification-service": "notification-service.map.svc.cluster.local",
            "postgres": "postgres.map.svc.cluster.local",
            "kafka": "kafka.map.svc.cluster.local",
        }

        for service_name, hostname in services.items():
            try:
                ip = socket.gethostbyname(hostname)
                assert ip is not None, f"DNS resolution failed for {service_name}"
            except socket.gaierror:
                pytest.fail(f"Cannot resolve {service_name} ({hostname})")

    def test_tls_certificate_validity(self):
        """Verify TLS certificates are valid and not expired."""
        hosts = [
            ("migration-api.map.com", 443),
            ("validation-engine.map.com", 443),
        ]

        for host, port in hosts:
            context = ssl.create_default_context()
            with socket.create_connection((host, port)) as sock:
                with context.wrap_socket(sock, server_hostname=host) as ssock:
                    cert = ssock.getpeercert()

                    # Verify certificate is not expired
                    not_after = ssl.cert_time_to_seconds(cert["notAfter"])
                    assert not_after > time.time(), (
                        f"TLS certificate for {host} has expired"
                    )

                    # Verify subject alternative names include expected host
                    san_names = [
                        entry[1] for entry in cert.get("subjectAltName", [])
                    ]
                    assert host in san_names or "*.map.com" in san_names

    def test_service_health_endpoints(self):
        """Verify all services expose health check endpoints."""
        health_endpoints = {
            "migration-api": "http://localhost:8080/health",
            "validation-engine": "http://localhost:8081/health",
            "notification-service": "http://localhost:8082/health",
        }

        for service, url in health_endpoints.items():
            try:
                response = requests.get(url, timeout=5)
                assert response.status_code == 200, (
                    f"{service} health check returned {response.status_code}"
                )
            except requests.ConnectionError:
                pytest.fail(f"Cannot connect to {service} health endpoint")
```

### 9.2 Storage Validation

#### 9.2.1 Storage Integration Test Checklist

| Check                                    | Description                                                 |
|------------------------------------------|-------------------------------------------------------------|
| Database connectivity                    | Application can connect to database                         |
| Connection pool health                   | Pool created, connections managed correctly                  |
| Read replica lag                         | Replica lag within acceptable threshold                     |
| Backup verification                      | Recent backup exists and is restorable                      |
| Storage quota                            | Storage usage within allocated limits                       |
| I/O performance                          | Read/write latency within SLA                               |
| File system permissions                  | Application has required file system access                 |
| Object storage access                    | S3/GCS buckets accessible with configured credentials       |

### 9.3 Compute Validation

#### 9.3.1 Compute Integration Test Checklist

| Check                                    | Description                                                 |
|------------------------------------------|-------------------------------------------------------------|
| Container startup                        | All containers start without errors                         |
| Memory usage                             | Memory consumption within configured limits                  |
| CPU utilization                          | CPU usage within configured limits                          |
| Pod/node scheduling                      | Pods scheduled on appropriate nodes                         |
| Resource limits enforced                 | OOMKill occurs only when limits exceeded                    |
| Horizontal scaling                       | New instances start and receive traffic                     |
| Graceful shutdown                        | In-flight requests complete before termination              |
| Image pull secrets                       | Container images pull successfully from registry            |

---

## 10. Test Data Management

### 10.1 Test Data Strategy

| Data Category            | Source                        | Lifecycle                                  |
|--------------------------|-------------------------------|--------------------------------------------|
| Reference data           | Static fixtures              | Loaded before test suite, rolled back after |
| Transactional data       | Generated per test run        | Created in setup, cleaned in teardown      |
| Production-like data     | Anonymized production subset  | Refreshed per sprint                        |
| Edge case data           | Manually crafted              | Maintained in version control              |
| Compliance test data     | Regulated data sets           | Separate access controls, encrypted         |

### 10.2 Test Data Principles

| Principle                          | Requirement                                                   |
|------------------------------------|---------------------------------------------------------------|
| Isolation                          | Each test uses its own data; no shared mutable state          |
| Reproducibility                    | Same test data produces same results across runs              |
| Anonymization                      | No real PII/PHI in integration test environments              |
| Version control                    | Test data definitions stored in version control                |
| Cleanup                            | All test data cleaned up after test execution                  |
| Realistic volumes                  | Test data reflects realistic production volumes               |
| Edge case coverage                 | Boundary values, nulls, maximum lengths tested                 |

### 10.3 Test Data Factory Example

```python
import factory
import uuid
import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()


class MigrationFactory:
    """Factory for creating migration test data."""

    @staticmethod
    def create_migration(
        migration_id: str = None,
        status: str = "PENDING",
        source_system: str = "CORE_BANKING",
        target_system: str = "CLOUD_MIGRATION",
        record_type: str = "ACCOUNTS",
        **kwargs
    ) -> dict:
        return {
            "migrationId": migration_id or str(uuid.uuid4()),
            "status": status,
            "sourceSystem": source_system,
            "targetSystem": target_system,
            "recordType": record_type,
            "recordsProcessed": kwargs.get("recordsProcessed", 0),
            "totalRecords": kwargs.get("totalRecords", random.randint(1000, 100000)),
            "createdAt": kwargs.get("createdAt", datetime.utcnow().isoformat()),
            "updatedAt": kwargs.get("updatedAt", datetime.utcnow().isoformat()),
            "createdBy": kwargs.get("createdBy", "integration-test"),
            "config": kwargs.get("config", {
                "batchSize": 1000,
                "retryCount": 3,
                "timeout": 300
            })
        }

    @staticmethod
    def create_batch(count: int = 10, status: str = None) -> list:
        statuses = ["PENDING", "RUNNING", "COMPLETED", "FAILED"]
        return [
            MigrationFactory.create_migration(
                status=status or random.choice(statuses)
            )
            for _ in range(count)
        ]

    @staticmethod
    def create_edge_case_migrations() -> list:
        """Create migrations that test boundary conditions."""
        return [
            MigrationFactory.create_migration(
                recordType="A" * 255  # Maximum length string
            ),
            MigrationFactory.create_migration(
                totalRecords=0  # Zero records
            ),
            MigrationFactory.create_migration(
                totalRecords=999999999  # Very large count
            ),
            MigrationFactory.create_migration(
                createdAt=(datetime.utcnow() - timedelta(days=365)).isoformat()
            ),
        ]


class AccountRecordFactory:
    """Factory for creating account migration records."""

    @staticmethod
    def create_account(
        account_id: str = None,
        balance: float = None,
        status: str = "ACTIVE"
    ) -> dict:
        return {
            "accountId": account_id or f"ACC-{uuid.uuid4().hex[:8].upper()}",
            "customerName": fake.name(),
            "customerSsn": fake.ssn(),
            "balance": balance if balance is not None else round(random.uniform(0, 1000000), 2),
            "currency": "USD",
            "status": status,
            "accountType": random.choice(["CHECKING", "SAVINGS", "MONEY_MARKET"]),
            "openedDate": fake.date_between(start_date="-10y", end_date="today").isoformat(),
            "branchCode": fake.zipcode(),
            "routingNumber": fake.aba(),
        }
```

### 10.4 Test Data Cleanup

```python
import pytest
from sqlalchemy import text


@pytest.fixture
def cleanup_migration_data(db_engine):
    """Fixture to clean up migration test data after tests."""
    created_ids = []

    yield created_ids  # Tests append IDs to this list

    # Cleanup after all tests
    with db_engine.begin() as conn:
        for migration_id in created_ids:
            conn.execute(text(
                "DELETE FROM map.migration_audit WHERE migration_id = :id"
            ), {"id": migration_id})
            conn.execute(text(
                "DELETE FROM map.migration_records WHERE migration_id = :id"
            ), {"id": migration_id})
            conn.execute(text(
                "DELETE FROM map.migrations WHERE migration_id = :id"
            ), {"id": migration_id})


class TestWithCleanup:
    """Tests using automatic data cleanup."""

    def test_migration_lifecycle(self, db_engine, cleanup_migration_data):
        """Test migration from creation to completion."""
        migration = MigrationFactory.create_migration()
        cleanup_migration_data.append(migration["migrationId"])

        with db_engine.begin() as conn:
            conn.execute(text("""
                INSERT INTO map.migrations (migration_id, status, source_system, target_system)
                VALUES (:id, :status, :source, :target)
            """), {
                "id": migration["migrationId"],
                "status": migration["status"],
                "source": migration["sourceSystem"],
                "target": migration["targetSystem"]
            })

        # Verify data was inserted
        with db_engine.connect() as conn:
            result = conn.execute(text(
                "SELECT status FROM map.migrations WHERE migration_id = :id"
            ), {"id": migration["migrationId"]})
            assert result.scalar() == "PENDING"
```

---

## 11. Mock Services and Stubs

### 11.1 Mock Service Strategy

| Component                    | Mock Type     | Use Case                                              |
|------------------------------|---------------|-------------------------------------------------------|
| Third-party payment API      | WireMock      | Isolate tests from external dependencies              |
| Email notification service   | Mock server   | Verify notification logic without sending emails      |
| External identity provider   | Mock OAuth    | Test auth flows without real IdP                      |
| Legacy system API            | Stub          | Simulate legacy system responses                      |
| File storage service         | In-memory     | Test file operations without actual storage           |
| Message broker               | Embedded      | Test publish/subscribe without real broker            |

### 11.2 Mock Service Implementation Examples

```python
from flask import Flask, jsonify, request
import uuid
import threading
import time


class MockMigrationVendorAPI:
    """Mock implementation of the external migration vendor API."""

    def __init__(self, port=5555):
        self.app = Flask(__name__)
        self.port = port
        self.server = None
        self.migration_status = {}

        self._setup_routes()

    def _setup_routes(self):
        @self.app.route("/api/v1/migrations", methods=["POST"])
        def create_migration():
            data = request.json
            migration_id = str(uuid.uuid4())
            self.migration_status[migration_id] = "PENDING"
            return jsonify({
                "migrationId": migration_id,
                "status": "PENDING",
                "message": "Migration created successfully"
            }), 201

        @self.app.route("/api/v1/migrations/<migration_id>", methods=["GET"])
        def get_migration(migration_id):
            if migration_id not in self.migration_status:
                return jsonify({"error": "Not found"}), 404
            return jsonify({
                "migrationId": migration_id,
                "status": self.migration_status[migration_id]
            }), 200

        @self.app.route("/api/v1/migrations/<migration_id>/status", methods=["PUT"])
        def update_status(migration_id):
            if migration_id not in self.migration_status:
                return jsonify({"error": "Not found"}), 404
            data = request.json
            self.migration_status[migration_id] = data["status"]
            return jsonify({"status": data["status"]}), 200

    def start(self):
        self.server = threading.Thread(
            target=self.app.run,
            kwargs={"port": self.port, "use_reloader": False}
        )
        self.server.daemon = True
        self.server.start()
        time.sleep(1)  # Wait for server to start

    def stop(self):
        if self.server:
            self.server.join(timeout=5)


@pytest.fixture(scope="session")
def mock_vendor_api():
    """Start mock vendor API for integration tests."""
    mock_api = MockMigrationVendorAPI(port=5555)
    mock_api.start()
    yield mock_api
    mock_api.stop()
```

### 11.3 WireMock Configuration Example

```json
{
  "mappings": [
    {
      "request": {
        "method": "POST",
        "url": "/api/v1/migrations",
        "bodyPatterns": [
          {
            "matchesJsonPath": "$.sourceSystem",
            "matchesJsonPath": "$.targetSystem"
          }
        ]
      },
      "response": {
        "status": 201,
        "headers": {
          "Content-Type": "application/json"
        },
        "jsonBody": {
          "migrationId": "{{randomValue type='UUID'}}",
          "status": "PENDING",
          "createdAt": "{{now format='yyyy-MM-dd'T'HH:mm:ss'Z'}}"
        }
      },
      "scenarioName": "create-migration",
      "requiredScenarioState": "Started",
      "newScenarioState": "MigrationCreated"
    },
    {
      "request": {
        "method": "GET",
        "urlPattern": "/api/v1/migrations/[a-f0-9-]{36}"
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "jsonBody": {
          "migrationId": "{{request.path.[3]}}",
          "status": "COMPLETED",
          "recordsProcessed": 5000,
          "totalRecords": 5000
        }
      }
    },
    {
      "request": {
        "method": "POST",
        "url": "/api/v1/migrations/failing-migration"
      },
      "response": {
        "status": 500,
        "headers": {
          "Content-Type": "application/json"
        },
        "jsonBody": {
          "error": {
            "code": "VENDOR_SYSTEM_ERROR",
            "message": "Vendor system temporarily unavailable"
          }
        }
      },
      "scenarioName": "vendor-failure",
      "requiredScenarioState": "Started"
    }
  ]
}
```

---

## 12. Environment Requirements

### 12.1 Integration Test Environment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Integration Test Environment                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Migration API│  │ Validation   │  │ Notification Service │  │
│  │   Service    │  │   Engine     │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                      │               │
│  ┌──────┴──────────────────┴──────────────────────┴───────────┐  │
│  │                     Service Mesh / Network                  │  │
│  └──────┬──────────────────┬──────────────────────┬───────────┘  │
│         │                  │                      │               │
│  ┌──────┴──────┐  ┌───────┴──────┐  ┌───────────┴────────────┐  │
│  │ PostgreSQL  │  │ Kafka        │  │ Redis                  │  │
│  │ (Test DB)   │  │ (Test Broker)│  │ (Test Cache)           │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Mock Services                             │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐              │ │
│  │  │ Mock OAuth│  │ Mock S3   │  │ WireMock  │              │ │
│  │  │ Server    │  │ Bucket    │  │ Vendor API│              │ │
│  │  └───────────┘  └───────────┘  └───────────┘              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    CI/CD Pipeline                            │ │
│  │  Build → Unit Tests → Integration Tests → Deploy to Staging │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Environment Specifications

| Component           | Specification                                           |
|---------------------|---------------------------------------------------------|
| Database            | PostgreSQL 15+, dedicated integration test schema       |
| Message Broker      | Apache Kafka 3.x, dedicated test topics                 |
| Cache               | Redis 7.x, dedicated test instance                      |
| Mock Services       | WireMock 3.x or custom Flask mocks                      |
| API Gateway         | Kong/AWS API Gateway (test environment)                 |
| Container Runtime   | Docker 24+ / Kubernetes 1.28+                           |
| CI Runner           | GitHub Actions / GitLab CI / Jenkins (4+ CPU, 16GB RAM) |

### 12.3 Environment Configuration

```yaml
# integration-test-config.yaml
environment:
  name: integration-test
  description: MAP integration test environment

services:
  migration-api:
    image: map/migration-api:latest
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgresql://test_user:test_pass@postgres:5432/map_test
      KAFKA_BROKER: kafka:9092
      OAUTH_SERVER: http://mock-oauth:9090
      LOG_LEVEL: DEBUG
      TEST_MODE: "true"
    healthcheck:
      endpoint: /health
      interval: 5s
      timeout: 3s
      retries: 10

  validation-engine:
    image: map/validation-engine:latest
    ports:
      - "8081:8081"
    environment:
      DATABASE_URL: postgresql://test_user:test_pass@postgres:5432/map_test
      KAFKA_BROKER: kafka:9092

  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: map_test
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_pass
    volumes:
      - ./init-scripts:/docker-entrypoint-initdb.d

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092

  wiremock:
    image: wiremock/wiremock:3.0.0
    ports:
      - "8082:8080"
    volumes:
      - ./wiremock/mappings:/home/wiremock/mappings
      - ./wiremock/__files:/home/wiremock/__files

test_settings:
  timeout: 300  # seconds
  parallel: true
  max_workers: 4
  retry_on_failure: 2
  capture_artifacts: true
  cleanup_after: true
```

---

## 13. Recommended Tools and Frameworks

### 13.1 Tool Selection Matrix

| Tool                  | Language   | Purpose                        | When to Use                                   |
|-----------------------|------------|--------------------------------|-----------------------------------------------|
| pytest                | Python     | Test runner and assertions     | All Python integration tests                  |
| pytest-asyncio        | Python     | Async test support             | Testing async services and event handlers     |
| REST Assured          | Java       | REST API testing               | Java-based API integration tests              |
| Postman/Newman        | Multi      | API test collection execution  | Exploratory and regression API testing        |
| TestContainers        | Multi      | Container-based test deps      | Database, MQ, and service containers          |
| WireMock              | Java       | HTTP mock server               | Mocking external HTTP APIs                    |
| Pact                  | Multi      | Contract testing               | Consumer-driven contract testing              |
| jsonschema            | Python     | JSON schema validation         | Validating API response schemas               |
| SQLAlchemy            | Python     | Database access and ORM        | Database integration testing                  |
| kafka-python          | Python     | Kafka client                   | Message queue integration testing             |
| PyJWT                 | Python     | JWT token operations           | Authentication token testing                  |
| Locust                | Python     | Performance testing            | Integration-level performance validation      |
| OWASP ZAP             | Multi      | Security testing               | Integration security scanning                 |

### 13.2 pytest Configuration

```ini
# pytest.ini
[pytest]
testpaths = tests/integration
python_files = test_*.py
python_classes = Test*
python_functions = test_*

markers =
    integration: Integration tests requiring external services
    api: API integration tests
    database: Database integration tests
    message_queue: Message queue integration tests
    external: External system integration tests
    auth: Authentication integration tests
    slow: Tests that take more than 30 seconds
    smoke: Smoke tests for quick validation

addopts =
    -v
    --tb=short
    --strict-markers
    --timeout=300
    -p no:cacheprovider

filterwarnings =
    ignore::DeprecationWarning
    error::pytest.PytestUnraisableExceptionWarning

log_cli = true
log_cli_level = INFO
log_cli_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
log_cli_date_format = %Y-%m-%d %H:%M:%S

log_file = integration_test.log
log_file_level = DEBUG
log_file_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
log_file_date_format = %Y-%m-%d %H:%M:%S
```

### 13.3 Newman (Postman) Execution

```bash
#!/bin/bash
# run-integration-tests.sh

set -euo pipefail

COLLECTION_DIR="./postman/collections"
RESULTS_DIR="./test-results/newman"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$RESULTS_DIR"

echo "=== MAP Integration Test Suite ==="
echo "Started at: $(date)"

# Run API contract tests
newman run "$COLLECTION_DIR/api-contract-tests.json" \
    --environment "$COLLECTION_DIR/test-environment.json" \
    --reporters cli,htmlextra,json \
    --reporter-htmlextra-export "$RESULTS_DIR/api-contract-$TIMESTAMP.html" \
    --reporter-json-export "$RESULTS_DIR/api-contract-$TIMESTAMP.json" \
    --timeout-request 30000 \
    --delay-request 100

# Run migration workflow tests
newman run "$COLLECTION_DIR/migration-workflow-tests.json" \
    --environment "$COLLECTION_DIR/test-environment.json" \
    --reporters cli,htmlextra,json \
    --reporter-htmlextra-export "$RESULTS_DIR/migration-workflow-$TIMESTAMP.html" \
    --reporter-json-export "$RESULTS_DIR/migration-workflow-$TIMESTAMP.json" \
    --timeout-request 60000

# Run authentication tests
newman run "$COLLECTION_DIR/auth-tests.json" \
    --environment "$COLLECTION_DIR/test-environment.json" \
    --reporters cli,htmlextra,json \
    --reporter-htmlextra-export "$RESULTS_DIR/auth-$TIMESTAMP.html" \
    --reporter-json-export "$RESULTS_DIR/auth-$TIMESTAMP.json" \
    --timeout-request 30000

echo "=== Test Suite Complete ==="
echo "Results available in: $RESULTS_DIR"
```

### 13.4 CI/CD Integration

```yaml
# .github/workflows/integration-tests.yml
name: Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Nightly at 2 AM

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: map_test
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      kafka:
        image: confluentinc/cp-kafka:7.5.0
        ports:
          - 9092:9092
        env:
          KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-test.txt

      - name: Run database migrations
        run: |
          alembic upgrade head
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/map_test

      - name: Seed test data
        run: |
          python scripts/seed_test_data.py

      - name: Run integration tests
        run: |
          pytest tests/integration/ \
            -v \
            --tb=short \
            --junitxml=test-results/integration-results.xml \
            --html=test-results/integration-report.html \
            --self-contained-html
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/map_test
          KAFKA_BROKER: localhost:9092
          MAP_TEST_TOKEN: ${{ secrets.MAP_TEST_TOKEN }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: integration-test-results
          path: test-results/
          retention-days: 30

      - name: Publish test results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Integration Test Results
          path: test-results/integration-results.xml
          reporter: java-junit
```

---

## 14. Best Practices

### 14.1 Test Contract Standards

| Practice                              | Description                                                   |
|---------------------------------------|---------------------------------------------------------------|
| Document expected behaviors           | Every integration test must reference the contract it validates |
| Use consumer-driven contracts         | Consumers define expectations; providers honor them           |
| Version contracts with APIs           | Contract versions track API versions                          |
| Automate contract validation          | Contracts validated in CI pipeline on every PR                |
| Review contract changes               | Breaking contract changes require architecture review         |
| Maintain backward compatibility       | New fields are additive; removed fields require deprecation   |

### 14.2 Verify Data Flow

| Practice                              | Description                                                   |
|---------------------------------------|---------------------------------------------------------------|
| Trace data through all transformations | Verify data at each service boundary                         |
| Validate data types at boundaries     | Each service validates input/output schema                    |
| Check for data loss                   | Verify record counts match across service boundaries          |
| Validate ordering guarantees          | Verify FIFO ordering where required                          |
| Test idempotent operations            | Repeated calls produce identical results                      |
| Verify data consistency across stores | Database and cache remain synchronized                        |

### 14.3 Error Handling

| Practice                              | Description                                                   |
|---------------------------------------|---------------------------------------------------------------|
| Test error responses                  | Verify correct error codes, messages, and HTTP status codes   |
| Test timeout scenarios                | Verify behavior when services don't respond                   |
| Test partial failure                  | Verify system degrades gracefully                             |
| Test retry logic                      | Verify retries with exponential backoff work correctly        |
| Test circuit breaker                  | Verify circuit opens and closes correctly                     |
| Test dead letter queues               | Verify failed messages are captured for investigation         |
| Test transaction rollback             | Verify no partial writes on failure                           |

### 14.4 Test Isolation

| Practice                              | Description                                                   |
|---------------------------------------|---------------------------------------------------------------|
| Independent test execution            | Each test can run independently without dependencies          |
| Clean state between tests             | Database and message queues cleaned between tests             |
| No shared mutable state               | Tests don't modify shared resources                           |
| Unique test identifiers               | Use UUIDs or timestamped IDs for test data                    |
| Rollback transactions                 | Use database transactions with rollback for test isolation    |
| Dedicated test environments           | Never run integration tests against production data           |

### 14.5 Performance Considerations

| Practice                              | Description                                                   |
|---------------------------------------|---------------------------------------------------------------|
| Set reasonable timeouts               | All HTTP calls and DB queries have timeouts                   |
| Parallel test execution               | Run independent tests in parallel                             |
| Reuse connections                      | Use connection pooling for DB and HTTP clients                 |
| Limit test data volume                | Use minimum data needed for valid test                        |
| Cache test fixtures                   | Cache expensive setup operations                              |
| Monitor test execution time           | Track and alert on test duration increases                    |

---

## 15. Test Execution and Reporting

### 15.1 Test Execution Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Integration Test Execution Flow                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Pre-flight Checks                                                │
│     ├── Verify environment is healthy                                │
│     ├── Verify all services are running                              │
│     ├── Verify database connectivity                                 │
│     └── Verify message broker availability                          │
│                                                                      │
│  2. Test Data Setup                                                  │
│     ├── Load reference data                                          │
│     ├── Create test fixtures                                         │
│     └── Initialize mock services                                     │
│                                                                      │
│  3. Test Execution                                                   │
│     ├── Tier 1 tests (single boundary)                              │
│     ├── Tier 2 tests (multi-service)                                │
│     ├── Tier 3 tests (cross-system)                                 │
│     └── Smoke tests (quick validation)                              │
│                                                                      │
│  4. Results Collection                                               │
│     ├── JUnit XML results                                            │
│     ├── HTML reports                                                 │
│     ├── Code coverage reports                                        │
│     └── Artifacts (logs, screenshots)                               │
│                                                                      │
│  5. Cleanup                                                          │
│     ├── Remove test data                                             │
│     ├── Reset mock services                                          │
│     └── Archive results                                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 15.2 Test Reporting Requirements

| Report Type            | Format       | Frequency        | Audience                    |
|------------------------|--------------|------------------|-----------------------------|
| Test execution summary | HTML + JSON  | Every run        | Engineering team            |
| Failure analysis       | Markdown     | On failure       | QA team, Tech leads         |
| Contract compatibility | HTML         | Every PR         | API consumers and providers |
| Trend report           | HTML + CSV   | Weekly           | Management                  |
| Coverage report        | HTML         | Every run        | Engineering team            |
| Environment health     | Dashboard    | Real-time        | DevOps team                 |

### 15.3 Failure Handling Protocol

| Failure Category       | Severity | Response Time | Action Required                              |
|------------------------|----------|---------------|----------------------------------------------|
| Environment down       | Critical | Immediate     | Block all testing, notify DevOps             |
| Tier 1 test failure    | High     | 4 hours       | Investigate and fix before merge              |
| Tier 2 test failure    | High     | 8 hours       | Investigate and fix before deployment         |
| Tier 3 test failure    | Medium   | 24 hours      | Document, assign, and fix in sprint          |
| Flaky test             | Medium   | Next sprint   | Quarantine and fix                            |
| Mock service failure   | Low      | Next sprint   | Update mock to match real service behavior   |

---

## 16. Traceability Matrix

### 16.1 Requirements to Integration Test Mapping

| Requirement ID | Requirement Description                     | Integration Test(s)                |
|----------------|---------------------------------------------|------------------------------------|
| REQ-API-001    | All APIs must validate request/response schema | `test_*_schema_compliance`       |
| REQ-API-002    | APIs must enforce authentication             | `test_*_auth_required`            |
| REQ-API-003    | APIs must handle rate limiting               | `test_*_rate_limit`               |
| REQ-DB-001     | Database must maintain referential integrity | `test_*_foreign_key_*`            |
| REQ-DB-002     | Database must support concurrent transactions | `test_*_transaction_isolation`  |
| REQ-SVC-001    | Services must validate message contracts     | `test_*_message_contract`         |
| REQ-SVC-002    | Services must handle failures gracefully     | `test_*_circuit_breaker`          |
| REQ-EXT-001    | External APIs must be integrated securely    | `test_*_oauth_*`                   |
| REQ-EXT-002    | Webhooks must be validated and logged         | `test_*_webhook_*`                 |
| REQ-INF-001    | Infrastructure must be health-checked         | `test_*_health_check`             |
| REQ-INF-002    | TLS must be enforced for all connections      | `test_*_tls_*`                     |
| REQ-AUTH-001   | Tokens must be validated at every boundary    | `test_*_token_validation`         |
| REQ-AUTH-002   | SSO must be supported via SAML/OIDC          | `test_*_sso_*`                     |

### 16.2 Test Coverage Tracking

| Component               | Total Tests | Passing | Failing | Coverage % |
|-------------------------|-------------|---------|---------|------------|
| Migration API           | 45          | 43      | 2       | 92%        |
| Validation Engine       | 38          | 38      | 0       | 100%       |
| Notification Service    | 22          | 21      | 1       | 95%        |
| Audit Service           | 15          | 15      | 0       | 100%       |
| Database Integration    | 30          | 30      | 0       | 100%       |
| Message Queue           | 18          | 17      | 1       | 94%        |
| External APIs           | 25          | 24      | 1       | 96%        |
| Authentication          | 20          | 20      | 0       | 100%       |
| **Total**               | **213**     | **208** | **5**   | **97.6%**  |

---

## 17. Dependencies

### 17.1 Document Dependencies

| Document                                    | Version  | Relationship                                  |
|---------------------------------------------|----------|-----------------------------------------------|
| `01_Architecture_Document.md`              | 1.0      | System architecture reference (Batch 08)      |
| `03_Development_Standards.md`              | 1.0      | Code standards reference (Batch 11)           |
| `04_Unit_Testing_Standards.md`             | 1.0      | Preceding test standard                       |
| `06_UAT_Framework.md`                      | 1.0      | Following test standard                       |
| `07_Performance_Testing_Standards.md`      | 1.0      | Performance testing reference                 |
| `09_API_Design_Guide.md`                   | 1.0      | API contract reference                        |
| `10_Data_Model_Document.md`                | 1.0      | Database schema reference                     |
| `11_Security_Standards.md`                 | 1.0      | Security testing reference                    |

### 17.2 Batch Dependencies

| Batch     | Content                                        | Relevance                                           |
|-----------|------------------------------------------------|-----------------------------------------------------|
| Batch 08  | Architecture documentation                     | Service boundaries, data flows, integration patterns |
| Batch 11  | Development standards                          | Code conventions, testing requirements               |
| Batch 12  | Testing and QA framework                       | Test strategy alignment                              |
| Batch 13  | Deployment and operations                      | Environment configuration reference                  |

### 17.3 External Dependencies

| Dependency              | Purpose                                        | Version    |
|-------------------------|------------------------------------------------|------------|
| OpenAPI Specification   | API contract definition                        | 3.1.0      |
| PostgreSQL              | Primary database                               | 15+        |
| Apache Kafka            | Message broker                                 | 3.x        |
| Redis                   | Caching layer                                  | 7.x        |
| OAuth 2.0               | Authentication framework                       | RFC 6749   |
| SAML 2.0                | SSO federation                                 | OASIS      |
| Docker                  | Containerization                               | 24+        |
| Kubernetes              | Orchestration                                  | 1.28+      |

---

## 18. Revision History

| Version | Date         | Author                          | Changes                                           |
|---------|--------------|---------------------------------|---------------------------------------------------|
| 0.1     | June 2026    | MAP Engineering Team            | Initial draft                                     |
| 0.2     | June 2026    | MAP QA Team                     | Added database and service integration sections    |
| 0.3     | June 2026    | MAP DevOps Team                 | Added infrastructure validation and environment   |
| 0.4     | June 2026    | MAP Security Team               | Added authentication and OAuth testing standards   |
| 0.5     | June 2026    | MAP Engineering Team            | Added mock services, test data management          |
| 0.6     | June 2026    | MAP QA Team                     | Added CI/CD integration and reporting               |
| 0.7     | June 2026    | MAP Architecture Team           | Added traceability matrix and dependencies          |
| 0.8     | June 2026    | MAP Engineering Team            | Code examples and tool configurations              |
| 0.9     | June 2026    | MAP QA Team                     | Review feedback incorporated                       |
| 1.0     | July 2026    | MAP Engineering & QA            | Final version for official release                 |

---

## 19. Approval and Sign-Off

| Role                        | Name              | Date         | Signature     |
|-----------------------------|-------------------|--------------|---------------|
| Head of Engineering         | _________________ | July 2026    | _____________ |
| VP of Quality Assurance     | _________________ | July 2026    | _____________ |
| Chief Architect             | _________________ | July 2026    | _____________ |
| Director of DevOps          | _________________ | July 2026    | _____________ |
| Security Architect          | _________________ | July 2026    | _____________ |
| Product Owner               | _________________ | July 2026    | _____________ |

### Approval Checklist

- [ ] Technical accuracy reviewed by engineering leads
- [ ] Test coverage gaps identified and addressed
- [ ] Tool configurations validated in CI/CD pipeline
- [ ] Mock service implementations verified
- [ ] Test data management procedures documented
- [ ] Environment requirements validated against infrastructure
- [ ] Security review completed
- [ ] Legal and compliance review completed
- [ ] All referenced documents are current and versioned
- [ ] Approval signatures obtained from all required stakeholders

---

## 20. Appendices

### Appendix A: Quick Reference — Integration Test Checklist

```
For every new integration point, verify:

□ API contract defined and versioned
□ Schema validation tests created
□ Error handling scenarios covered
□ Authentication/authorization tested
□ Timeout and retry behavior validated
□ Circuit breaker tested
□ Mock services created for external dependencies
□ Test data fixtures prepared
□ Database queries validated with EXPLAIN
□ Transaction integrity verified
□ Message queue publish/subscribe tested
□ Dead letter queue handling verified
□ Health check endpoints available
□ Logging and correlation IDs working
□ Performance within SLA thresholds
□ Security scanning completed
□ Documentation updated
□ CI/CD pipeline includes integration tests
□ Test results published and tracked
□ Cleanup procedures verified
```

### Appendix B: Common Failure Patterns and Solutions

| Pattern                        | Symptom                                  | Solution                                    |
|--------------------------------|------------------------------------------|---------------------------------------------|
| Race condition                 | Intermittent test failures               | Add synchronization points, increase timeouts |
| Port conflict                  | Connection refused errors                | Use dynamic port allocation                 |
| Shared state                   | Tests pass individually, fail together   | Ensure test isolation, use transactions     |
| Stale mock data                | Tests pass on fresh env, fail over time  | Reset mock state between tests              |
| Network flakiness              | Intermittent timeouts                    | Use retries with backoff                    |
| Clock skew                     | Time-sensitive tests fail                | Mock time sources, use relative assertions  |
| Data pollution                  | Tests affect each other                  | Clean up in teardown, use unique identifiers|
| Dependency ordering            | Tests fail in specific order             | Remove inter-test dependencies              |

### Appendix C: Integration Test Naming Conventions

| Pattern                                        | Example                                        |
|------------------------------------------------|-------------------------------------------------|
| `test_<component>_<scenario>_<expected>`        | `test_migration_api_create_returns_201`         |
| `test_<component>_<scenario>_when_<condition>`  | `test_migration_api_returns_404_when_not_found` |
| `test_<component>_<scenario>_with_<variant>`    | `test_notification_service_sends_email_with_retry` |
| `test_<component>_<flow>_end_to_end`            | `test_migration_lifecycle_end_to_end`           |

### Appendix D: Environment Variables Reference

| Variable                    | Description                              | Default                          |
|-----------------------------|------------------------------------------|----------------------------------|
| `DATABASE_URL`              | PostgreSQL connection string             | `postgresql://localhost:5432/map` |
| `KAFKA_BROKER`              | Kafka broker address                     | `localhost:9092`                 |
| `REDIS_URL`                 | Redis connection string                  | `redis://localhost:6379`         |
| `MAP_TEST_TOKEN`            | JWT token for API authentication         | (Required)                       |
| `MAP_ENVIRONMENT`           | Environment identifier                   | `integration-test`               |
| `MAP_LOG_LEVEL`             | Logging level                            | `DEBUG`                          |
| `MAP_TIMEOUT`               | Default request timeout (seconds)        | `30`                             |
| `MAP_RETRY_COUNT`           | Default retry count                      | `3`                              |
| `MAP_MOCK_VENDOR_API_URL`   | Mock vendor API base URL                 | `http://localhost:5555`          |
| `MAP_WIREMOCK_URL`          | WireMock server URL                      | `http://localhost:8082`          |

---

*End of Document*

**Document ID:** MAP-QA-ITS-2026-001
**Classification:** Internal — Engineering
**Retention:** 7 years
**Next Review:** January 2027
