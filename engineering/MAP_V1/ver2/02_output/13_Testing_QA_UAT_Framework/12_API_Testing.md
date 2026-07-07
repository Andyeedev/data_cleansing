# API Testing Standards — Migration Assurance Platform (MAP)

---

| Field | Value |
|---|---|
| **Document Title** | API Testing Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal |
| **Author** | MAP Engineering Team |
| **Approver** | VP of Engineering |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [References](#3-references)
4. [REST API Validation](#4-rest-api-validation)
5. [Contract Testing](#5-contract-testing)
6. [Schema Validation](#6-schema-validation)
7. [Authentication Testing](#7-authentication-testing)
8. [Pagination Testing](#8-pagination-testing)
9. [Error Handling Testing](#9-error-handling-testing)
10. [Version Compatibility Testing](#10-version-compatibility-testing)
11. [Rate Limiting Testing](#11-rate-limiting-testing)
12. [Test Data Management](#12-test-data-management)
13. [Recommended Tools](#13-recommended-tools)
14. [Best Practices](#14-best-practices)
15. [Appendix A: Test Case Templates](#appendix-a-test-case-templates)
16. [Appendix B: Status Code Reference](#appendix-b-status-code-reference)
17. [Appendix C: Glossary](#appendix-c-glossary)
18. [Revision History](#revision-history)
19. [Approval](#approval)

---

## 1. Purpose

### 1.1 Objective

This document defines comprehensive API testing standards and practices for the Migration Assurance Platform (MAP). API testing is a critical layer in our quality assurance strategy, ensuring that all RESTful endpoints deliver correct, secure, and performant functionality to consumers including frontend applications, mobile clients, third-party integrations, and internal microservices.

### 1.2 Why API Testing Matters in MAP

MAP processes sensitive financial migration data across multiple system boundaries. API endpoints serve as the primary integration mechanism between:

- Frontend React application and backend services
- Internal microservices (validation, transformation, reconciliation engines)
- External financial institution connectors (SWIFT, SEPA, ACH)
- Regulatory reporting interfaces
- Batch processing orchestration layers

Failures at the API layer can propagate data corruption, regulatory non-compliance, and financial loss. Rigorous API testing prevents these outcomes.

### 1.3 Testing Philosophy

MAP adopts a "shift-left" approach to API testing. API tests are written during development, executed in CI/CD pipelines, and maintained as living documentation. Every endpoint must have corresponding automated test coverage before deployment to any environment.

### 1.4 Document Usage

This document is intended for:

- Backend developers writing API endpoints
- QA engineers designing and executing API test suites
- DevOps engineers configuring test automation pipelines
- Architects reviewing API contracts and standards
- Security engineers performing API security assessments

---

## 2. Scope

### 2.1 In Scope

| Category | Coverage |
|---|---|
| REST API Validation | HTTP methods, status codes, response structure, headers |
| Contract Testing | Provider/consumer contract verification |
| Schema Validation | JSON Schema, OpenAPI specification compliance |
| Authentication | API key, OAuth 2.0, JWT token validation |
| Pagination | Cursor-based, offset, page size testing |
| Error Handling | Error responses, retry logic, circuit breaker patterns |
| Version Compatibility | API versioning, backward compatibility verification |
| Rate Limiting | Throttling behavior, quota enforcement |
| Test Data Management | Data creation, isolation, cleanup |

### 2.2 Out of Scope

- UI/UX testing (covered in separate UAT framework document)
- Load/stress testing (covered in Performance Testing standards)
- Database integration testing (covered in Data Layer Testing standards)
- Infrastructure testing (covered in DevOps Testing standards)

---

## 3. References

| Document | Batch | Description |
|---|---|---|
| API Architecture Document | Batch 08 | Defines API patterns, standards, and architectural decisions |
| Coding Standards | Batch 11 | Code quality standards including API implementation guidelines |
| Testing Framework Overview | Batch 13 | Overall testing strategy and framework |
| Security Standards | Batch 09 | Authentication, authorization, and data protection standards |
| Performance Testing | Batch 13 | Load, stress, and performance testing standards |

---

## 4. REST API Validation

### 4.1 HTTP Methods Testing

Each HTTP method must be tested for correct behavior, side effects, and idempotency.

#### 4.1.1 GET Requests

```python
# pytest example: GET endpoint validation
import requests
import pytest

BASE_URL = "https://api.map.internal/v1"

class TestGetMigrationJobs:
    """Tests for GET /migration-jobs endpoint."""

    def test_get_migration_jobs_returns_200(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        assert response.status_code == 200
        assert response.headers["Content-Type"] == "application/json"

    def test_get_migration_jobs_returns_list(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        data = response.json()
        assert isinstance(data, dict)
        assert "items" in data
        assert isinstance(data["items"], list)

    def test_get_migration_jobs_supports_filtering(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"status": "in_progress"}
        )
        assert response.status_code == 200
        for job in response.json()["items"]:
            assert job["status"] == "in_progress"

    def test_get_migration_jobs_by_id(self, authenticated_session):
        job_id = create_test_job(authenticated_session)
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs/{job_id}")
        assert response.status_code == 200
        assert response.json()["id"] == job_id

    def test_get_nonexistent_job_returns_404(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs/nonexistent-id-12345"
        )
        assert response.status_code == 404
```

#### 4.1.2 POST Requests

```python
class TestCreateMigrationJob:
    """Tests for POST /migration-jobs endpoint."""

    def test_create_job_returns_201(self, authenticated_session, valid_job_payload):
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=valid_job_payload
        )
        assert response.status_code == 201
        assert "Location" in response.headers

    def test_create_job_returns_created_resource(self, authenticated_session, valid_job_payload):
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=valid_job_payload
        )
        data = response.json()
        assert "id" in data
        assert data["sourceSystem"] == valid_job_payload["sourceSystem"]
        assert data["targetSystem"] == valid_job_payload["targetSystem"]

    def test_create_job_with_invalid_payload_returns_400(self, authenticated_session):
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json={"invalid": "payload"}
        )
        assert response.status_code == 400

    def test_create_job_without_auth_returns_401(self, api_session):
        response = api_session.post(
            f"{BASE_URL}/migration-jobs",
            json=valid_job_payload
        )
        assert response.status_code == 401
```

#### 4.1.3 PUT Requests

```python
class TestUpdateMigrationJob:
    """Tests for PUT /migration-jobs/{id} endpoint."""

    def test_update_job_returns_200(self, authenticated_session, valid_job_payload):
        job_id = create_test_job(authenticated_session)
        valid_job_payload["description"] = "Updated description"
        response = authenticated_session.put(
            f"{BASE_URL}/migration-jobs/{job_id}",
            json=valid_job_payload
        )
        assert response.status_code == 200

    def test_update_job_is_idempotent(self, authenticated_session, valid_job_payload):
        job_id = create_test_job(authenticated_session)
        valid_job_payload["description"] = "Idempotent test"

        response1 = authenticated_session.put(
            f"{BASE_URL}/migration-jobs/{job_id}",
            json=valid_job_payload
        )
        response2 = authenticated_session.put(
            f"{BASE_URL}/migration-jobs/{job_id}",
            json=valid_job_payload
        )
        assert response1.json() == response2.json()
```

#### 4.1.4 PATCH Requests

```python
class TestPatchMigrationJob:
    """Tests for PATCH /migration-jobs/{id} endpoint."""

    def test_partial_update_returns_200(self, authenticated_session):
        job_id = create_test_job(authenticated_session)
        response = authenticated_session.patch(
            f"{BASE_URL}/migration-jobs/{job_id}",
            json={"status": "completed"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "completed"

    def test_patch_does_not_overwrite_unspecified_fields(self, authenticated_session):
        job_id = create_test_job(authenticated_session)
        original = authenticated_session.get(f"{BASE_URL}/migration-jobs/{job_id}").json()

        authenticated_session.patch(
            f"{BASE_URL}/migration-jobs/{job_id}",
            json={"status": "completed"}
        )
        updated = authenticated_session.get(f"{BASE_URL}/migration-jobs/{job_id}").json()
        assert updated["sourceSystem"] == original["sourceSystem"]
```

#### 4.1.5 DELETE Requests

```python
class TestDeleteMigrationJob:
    """Tests for DELETE /migration-jobs/{id} endpoint."""

    def test_delete_job_returns_204(self, authenticated_session):
        job_id = create_test_job(authenticated_session)
        response = authenticated_session.delete(f"{BASE_URL}/migration-jobs/{job_id}")
        assert response.status_code == 204

    def test_delete_nonexistent_job_returns_404(self, authenticated_session):
        response = authenticated_session.delete(
            f"{BASE_URL}/migration-jobs/nonexistent-id-12345"
        )
        assert response.status_code == 404

    def test_delete_job_removes_resource(self, authenticated_session):
        job_id = create_test_job(authenticated_session)
        authenticated_session.delete(f"{BASE_URL}/migration-jobs/{job_id}")
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs/{job_id}")
        assert response.status_code == 404
```

### 4.2 HTTP Status Code Validation

Every endpoint must return appropriate HTTP status codes. The following table defines expected status codes per operation:

| Operation | Success Code | Client Error Codes | Server Error Codes |
|---|---|---|---|
| GET (resource exists) | 200 OK | 401, 403, 404 | 500, 502, 503 |
| GET (collection) | 200 OK | 401, 403, 422 | 500, 502, 503 |
| POST (create) | 201 Created | 400, 401, 403, 409, 422 | 500, 502, 503 |
| PUT (full update) | 200 OK | 400, 401, 403, 404, 422 | 500, 502, 503 |
| PATCH (partial update) | 200 OK | 400, 401, 403, 404, 422 | 500, 502, 503 |
| DELETE | 204 No Content | 401, 403, 404 | 500, 502, 503 |

### 4.3 Response Structure Validation

All MAP API responses must adhere to the standard envelope format:

```json
{
  "status": "success",
  "data": { },
  "meta": {
    "requestId": "req-abc-123",
    "timestamp": "2026-07-15T10:30:00Z",
    "version": "1.0"
  },
  "pagination": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "hasMore": true,
    "totalCount": 1250
  }
}
```

```python
class TestResponseStructure:
    """Tests for standard response envelope compliance."""

    def test_response_has_required_fields(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        data = response.json()

        assert "status" in data
        assert "data" in data
        assert "meta" in data
        assert "meta.requestId" in data["meta"]
        assert "meta.timestamp" in data["meta"]

    def test_response_timestamp_is_iso8601(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        timestamp = response.json()["meta"]["timestamp"]

        from datetime import datetime
        parsed = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        assert parsed is not None
```

### 4.4 Response Headers Validation

```python
class TestResponseHeaders:
    """Tests for required response headers."""

    REQUIRED_HEADERS = [
        "Content-Type",
        "X-Request-Id",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
        "Cache-Control",
    ]

    def test_all_required_headers_present(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        for header in self.REQUIRED_HEADERS:
            assert header in response.headers, f"Missing header: {header}"

    def test_content_type_is_json(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        assert "application/json" in response.headers["Content-Type"]

    def test_cors_headers_for_browser_clients(self, api_session):
        response = api_session.options(
            f"{BASE_URL}/migration-jobs",
            headers={
                "Origin": "https://app.map.internal",
                "Access-Control-Request-Method": "GET"
            }
        )
        assert "Access-Control-Allow-Origin" in response.headers
```

---

## 5. Contract Testing

### 5.1 Overview

Contract testing ensures that API providers and consumers agree on the structure and behavior of API interactions. MAP uses contract testing to prevent integration failures between microservices.

### 5.2 API Contract Definition

Contracts are defined in OpenAPI 3.1 specification format and stored in the shared contract repository.

```yaml
# openapi-migration-jobs.yaml
openapi: "3.1.0"
info:
  title: MAP Migration Jobs API
  version: "1.0.0"
  description: API for managing financial data migration jobs

paths:
  /migration-jobs:
    get:
      operationId: listMigrationJobs
      summary: List all migration jobs
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, in_progress, completed, failed]
        - name: cursor
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MigrationJobListResponse"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "429":
          $ref: "#/components/responses/RateLimited"

    post:
      operationId: createMigrationJob
      summary: Create a new migration job
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateMigrationJobRequest"
      responses:
        "201":
          description: Job created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MigrationJobResponse"
        "400":
          $ref: "#/components/responses/BadRequest"
        "409":
          $ref: "#/components/responses/Conflict"

components:
  schemas:
    MigrationJob:
      type: object
      required: [id, sourceSystem, targetSystem, status, createdAt]
      properties:
        id:
          type: string
          format: uuid
        sourceSystem:
          type: string
          enum: [SWIFT, SEPA, ACH, CHAPS, FedWire]
        targetSystem:
          type: string
          enum: [SWIFT, SEPA, ACH, CHAPS, FedWire]
        status:
          type: string
          enum: [pending, in_progress, completed, failed, cancelled]
        recordCount:
          type: integer
          minimum: 0
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    MigrationJobListResponse:
      type: object
      required: [status, data, meta]
      properties:
        status:
          type: string
        data:
          type: object
          properties:
            items:
              type: array
              items:
                $ref: "#/components/schemas/MigrationJob"
        meta:
          $ref: "#/components/schemas/Meta"
        pagination:
          $ref: "#/components/schemas/Pagination"
```

### 5.3 Provider Testing

Provider tests verify that the API implementation conforms to the published contract.

```python
# Provider contract test using schemathesis
import schemathesis
from app import create_app

schema = schemathesis.from_url("https://api.map.internal/openapi.json")

@schema.parametrize()
def test_api_conforms_to_contract(case):
    """Automatically test all API endpoints against OpenAPI contract."""
    app = create_app()
    response = case.call(app=app)
    case.validate_response(response)

class TestProviderContract:
    """Manual provider contract tests for critical paths."""

    def test_migration_jobs_list_matches_schema(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        schema = load_contract_schema("migration-jobs-list")

        import jsonschema
        jsonschema.validate(
            instance=response.json(),
            schema=schema
        )

    def test_create_job_response_matches_schema(self, authenticated_session):
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=valid_job_payload
        )
        schema = load_contract_schema("migration-job-create-response")
        jsonschema.validate(instance=response.json(), schema=schema)
```

### 5.4 Consumer-Driven Contract Testing

Consumer tests define what the consumer expects from the provider.

```python
# Consumer contract test using pact
from pact import Consumer, Provider

pact = Consumer("map-frontend").has_pact_with(
    Provider("map-migration-api"),
    pact_dir="./pacts",
    log_dir="./pact_logs"
)

class TestConsumerContract:
    """Consumer-driven contract tests from frontend perspective."""

    def test_get_migration_jobs_contract(self):
        expected_response = {
            "status": "success",
            "data": {
                "items": [
                    {
                        "id": "uuid-format",
                        "sourceSystem": "SWIFT",
                        "targetSystem": "SEPA",
                        "status": "in_progress",
                        "recordCount": 1500
                    }
                ]
            }
        }

        (
            pact.given("migration jobs exist")
            .upon_receiving("a request for migration jobs")
            .with_request("get", "/v1/migration-jobs")
            .will_respond_with(200, body=expected_response)
        )

        with pact:
            response = requests.get(f"{pact.uri}/v1/migration-jobs")
            assert response.status_code == 200
```

### 5.5 Contract Testing CI Integration

```yaml
# .github/workflows/contract-tests.yml
name: Contract Tests

on:
  pull_request:
    paths:
      - "src/api/**"
      - "contracts/**"

jobs:
  provider-contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: pip install schemathesis jsonschema
      - name: Start API server
        run: docker-compose up -d api
      - name: Wait for API readiness
        run: sleep 10
      - name: Run provider contract tests
        run: pytest tests/contracts/provider/ -v
      - name: Publish contract
        run: python scripts/publish_contract.py

  consumer-contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Run consumer contract tests
        run: npm run test:contracts
      - name: Verify pacts
        run: npx pact-broker verify-pacts
```

---

## 6. Schema Validation

### 6.1 JSON Schema Validation

All API request and response bodies must be validated against defined JSON Schemas.

```python
import jsonschema
import json
from pathlib import Path

SCHEMA_DIR = Path("schemas/api")

class TestSchemaValidation:
    """JSON Schema validation tests for all API payloads."""

    def load_schema(self, schema_name):
        with open(SCHEMA_DIR / f"{schema_name}.json") as f:
            return json.load(f)

    def test_migration_job_response_schema(self, api_response):
        schema = self.load_schema("migration-job-response")
        jsonschema.validate(instance=api_response.json(), schema=schema)

    def test_create_request_schema(self, valid_payload):
        schema = self.load_schema("create-migration-job-request")
        jsonschema.validate(instance=valid_payload, schema=schema)

    def test_error_response_schema(self, error_response):
        schema = self.load_schema("error-response")
        jsonschema.validate(instance=error_response.json(), schema=schema)

    def test_invalid_field_type_rejected(self, authenticated_session):
        payload = {
            "sourceSystem": 12345,  # Should be string
            "targetSystem": "SEPA",
            "recordCount": "not-a-number"  # Should be integer
        }
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=payload
        )
        assert response.status_code == 400
        assert "validation" in response.json().get("error", {}).get("code", "").lower()
```

### 6.2 OpenAPI Specification Validation

```python
import openapi_core
import yaml

class TestOpenAPICompliance:
    """Validate requests and responses against OpenAPI spec."""

    def load_spec(self):
        with open("openapi-migration-api.yaml") as f:
            return yaml.safe_load(f)

    def test_spec_is_valid(self):
        spec = self.load_spec()
        # Validate spec structure
        assert "openapi" in spec
        assert spec["openapi"].startswith("3.")
        assert "info" in spec
        assert "paths" in spec
        assert "components" in spec

    def test_all_endpoints_documented(self):
        spec = self.load_spec()
        documented_paths = set(spec["paths"].keys())

        from app.api import get_all_routes
        actual_paths = set(route.path for route in get_all_routes())

        undocumented = actual_paths - documented_paths
        assert not undocumented, f"Undocumented endpoints: {undocumented}"

    def test_all_schemas_have_examples(self):
        spec = self.load_spec()
        schemas = spec.get("components", {}).get("schemas", {})
        for name, schema in schemas.items():
            assert "example" in schema or "examples" in schema, \
                f"Schema '{name}' missing example"
```

### 6.3 Request Validation

```python
class TestRequestValidation:
    """Tests for request payload validation."""

    def test_required_fields_enforced(self, authenticated_session):
        incomplete_payload = {
            "sourceSystem": "SWIFT"
            # Missing targetSystem, required
        }
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=incomplete_payload
        )
        assert response.status_code == 400
        errors = response.json()["errors"]
        assert any("targetSystem" in e.get("field", "") for e in errors)

    def test_enum_values_enforced(self, authenticated_session):
        payload = {
            "sourceSystem": "INVALID_SYSTEM",
            "targetSystem": "SEPA"
        }
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=payload
        )
        assert response.status_code == 400

    def test_string_length_limits(self, authenticated_session):
        payload = {
            "sourceSystem": "SWIFT",
            "targetSystem": "SEPA",
            "description": "x" * 10001  # Exceeds max length
        }
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=payload
        )
        assert response.status_code == 400

    def test_date_format_validation(self, authenticated_session):
        payload = {
            "sourceSystem": "SWIFT",
            "targetSystem": "SEPA",
            "scheduledAt": "not-a-date"
        }
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=payload
        )
        assert response.status_code == 400
```

### 6.4 Response Validation

```python
class TestResponseValidation:
    """Tests for response payload validation."""

    def test_response_fields_match_spec(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        data = response.json()

        # Validate top-level structure
        assert isinstance(data["status"], str)
        assert isinstance(data["data"]["items"], list)

        # Validate each item
        for item in data["data"]["items"]:
            assert "id" in item
            assert "sourceSystem" in item
            assert "targetSystem" in item
            assert "status" in item
            assert "createdAt" in item

            # Validate field types
            assert isinstance(item["id"], str)
            assert isinstance(item["sourceSystem"], str)
            assert item["status"] in [
                "pending", "in_progress", "completed", "failed", "cancelled"
            ]

    def test_no_unexpected_fields(self, authenticated_session):
        ALLOWED_FIELDS = {
            "id", "sourceSystem", "targetSystem", "status",
            "recordCount", "description", "createdAt", "updatedAt",
            "metadata"
        }
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        for item in response.json()["data"]["items"]:
            unexpected = set(item.keys()) - ALLOWED_FIELDS
            assert not unexpected, f"Unexpected fields: {unexpected}"
```

---

## 7. Authentication Testing

### 7.1 API Key Authentication

```python
class TestAPIKeyAuth:
    """Tests for API key authentication mechanism."""

    def test_valid_api_key_accepted(self):
        response = requests.get(
            f"{BASE_URL}/migration-jobs",
            headers={"X-API-Key": VALID_API_KEY}
        )
        assert response.status_code == 200

    def test_invalid_api_key_rejected(self):
        response = requests.get(
            f"{BASE_URL}/migration-jobs",
            headers={"X-API-Key": "invalid-key-12345"}
        )
        assert response.status_code == 401

    def test_missing_api_key_rejected(self):
        response = requests.get(f"{BASE_URL}/migration-jobs")
        assert response.status_code == 401

    def test_expired_api_key_rejected(self):
        response = requests.get(
            f"{BASE_URL}/migration-jobs",
            headers={"X-API-Key": EXPIRED_API_KEY}
        )
        assert response.status_code == 401
        assert "expired" in response.json().get("error", {}).get("message", "").lower()

    def test_revoked_api_key_rejected(self):
        response = requests.get(
            f"{BASE_URL}/migration-jobs",
            headers={"X-API-Key": REVOKED_API_KEY}
        )
        assert response.status_code == 401
```

### 7.2 OAuth 2.0 Authentication

```python
class TestOAuth2Auth:
    """Tests for OAuth 2.0 authentication flows."""

    def test_authorization_code_flow(self):
        # Step 1: Get authorization code
        auth_response = requests.get(
            f"{AUTH_SERVER}/authorize",
            params={
                "response_type": "code",
                "client_id": CLIENT_ID,
                "redirect_uri": REDIRECT_URI,
                "scope": "migration:read migration:write"
            },
            allow_redirects=False
        )
        assert auth_response.status_code in [302, 303]
        auth_code = extract_code_from_redirect(auth_response.headers["Location"])

        # Step 2: Exchange code for token
        token_response = requests.post(
            f"{AUTH_SERVER}/token",
            data={
                "grant_type": "authorization_code",
                "code": auth_code,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "redirect_uri": REDIRECT_URI
            }
        )
        assert token_response.status_code == 200
        token_data = token_response.json()
        assert "access_token" in token_data
        assert "refresh_token" in token_data
        assert token_data["token_type"] == "Bearer"

    def test_client_credentials_flow(self):
        token_response = requests.post(
            f"{AUTH_SERVER}/token",
            data={
                "grant_type": "client_credentials",
                "client_id": SERVICE_CLIENT_ID,
                "client_secret": SERVICE_CLIENT_SECRET,
                "scope": "migration:read"
            }
        )
        assert token_response.status_code == 200
        assert "access_token" in token_response.json()

    def test_expired_token_rejected(self):
        response = requests.get(
            f"{BASE_URL}/migration-jobs",
            headers={"Authorization": f"Bearer {EXPIRED_TOKEN}"}
        )
        assert response.status_code == 401
        assert response.json()["error"]["code"] == "TOKEN_EXPIRED"

    def test_refresh_token_flow(self):
        # Get initial tokens
        initial = get_access_token()
        assert initial.status_code == 200
        refresh_token = initial.json()["refresh_token"]

        # Use refresh token
        refresh_response = requests.post(
            f"{AUTH_SERVER}/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET
            }
        )
        assert refresh_response.status_code == 200
        new_tokens = refresh_response.json()
        assert "access_token" in new_tokens
        assert new_tokens["access_token"] != initial.json()["access_token"]
```

### 7.3 JWT Token Validation

```python
import jwt
from datetime import datetime, timedelta

class TestJWTValidation:
    """Tests for JWT token structure and validation."""

    def test_jwt_has_required_claims(self):
        token = get_valid_jwt()
        decoded = jwt.decode(token, options={"verify_signature": False})

        required_claims = ["sub", "iss", "exp", "iat", "scope"]
        for claim in required_claims:
            assert claim in decoded, f"Missing claim: {claim}"

    def test_jwt_issuer_matches_expected(self):
        token = get_valid_jwt()
        decoded = jwt.decode(token, options={"verify_signature": False})
        assert decoded["iss"] == "https://auth.map.internal"

    def test_jwt_not_expired(self):
        token = get_valid_jwt()
        decoded = jwt.decode(token, options={"verify_signature": False})
        exp_datetime = datetime.utcfromtimestamp(decoded["exp"])
        assert exp_datetime > datetime.utcnow()

    def test_jwt_signature_verification(self, valid_public_key):
        token = get_valid_jwt()
        try:
            decoded = jwt.decode(token, valid_public_key, algorithms=["RS256"])
            assert decoded is not None
        except jwt.InvalidSignatureError:
            pytest.fail("JWT signature verification failed")

    def test_tampered_jwt_rejected(self):
        token = get_valid_jwt()
        # Tamper with token payload
        parts = token.split(".")
        import base64
        payload = json.loads(base64.urlsafe_b64decode(parts[1] + "=="))
        payload["scope"] = "admin:*"  # Escalate privileges
        parts[1] = base64.urlsafe_b64encode(
            json.dumps(payload).encode()
        ).decode().rstrip("=")
        tampered_token = ".".join(parts)

        response = requests.get(
            f"{BASE_URL}/migration-jobs",
            headers={"Authorization": f"Bearer {tampered_token}"}
        )
        assert response.status_code == 401
```

### 7.4 Authorization Testing

```python
class TestAuthorization:
    """Tests for role-based access control on API endpoints."""

    def test_read_only_user_cannot_create(self):
        response = requests.post(
            f"{BASE_URL}/migration-jobs",
            json=valid_payload,
            headers={"Authorization": f"Bearer {READ_ONLY_TOKEN}"}
        )
        assert response.status_code == 403

    def test_admin_can_access_all_endpoints(self):
        endpoints = [
            ("GET", "/migration-jobs"),
            ("POST", "/migration-jobs"),
            ("GET", f"/migration-jobs/{TEST_JOB_ID}"),
            ("DELETE", f"/migration-jobs/{TEST_JOB_ID}")
        ]
        for method, path in endpoints:
            response = requests.request(
                method, f"{BASE_URL}{path}",
                headers={"Authorization": f"Bearer {ADMIN_TOKEN}"}
            )
            assert response.status_code not in [403], \
                f"Admin denied access to {method} {path}"

    def test_user_cannot_access_other_users_jobs(self):
        response = requests.get(
            f"{BASE_URL}/migration-jobs/{OTHER_USERS_JOB_ID}",
            headers={"Authorization": f"Bearer {USER_TOKEN}"}
        )
        assert response.status_code in [403, 404]
```

---

## 8. Pagination Testing

### 8.1 Cursor-Based Pagination

```python
class TestCursorPagination:
    """Tests for cursor-based pagination implementation."""

    def test_first_page_returns_cursor(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"limit": 10}
        )
        data = response.json()
        assert "pagination" in data
        assert "cursor" in data["pagination"]
        assert "hasMore" in data["pagination"]

    def test_pagination_returns_consistent_page_size(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"limit": 10}
        )
        items = response.json()["data"]["items"]
        assert len(items) <= 10

    def test_next_page_uses_cursor(self, authenticated_session):
        first_page = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"limit": 10}
        ).json()

        if first_page["pagination"]["hasMore"]:
            second_page = authenticated_session.get(
                f"{BASE_URL}/migration-jobs",
                params={
                    "limit": 10,
                    "cursor": first_page["pagination"]["cursor"]
                }
            ).json()

            first_ids = {item["id"] for item in first_page["data"]["items"]}
            second_ids = {item["id"] for item in second_page["data"]["items"]}
            assert first_ids.isdisjoint(second_ids), "Pages contain duplicate items"

    def test_last_page_has_no_more(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"limit": 1000}
        )
        data = response.json()
        if len(data["data"]["items"]) < data["pagination"]["totalCount"]:
            assert data["pagination"]["hasMore"] is False

    def test_invalid_cursor_returns_error(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"cursor": "invalid-cursor-value"}
        )
        assert response.status_code == 400
```

### 8.2 Offset-Based Pagination

```python
class TestOffsetPagination:
    """Tests for offset-based pagination (legacy endpoints)."""

    def test_offset_returns_correct_page(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/v1/migration-jobs",
            params={"offset": 0, "limit": 10}
        )
        assert response.status_code == 200
        assert len(response.json()["data"]["items"]) <= 10

    def test_offset_advances_correctly(self, authenticated_session):
        page1 = authenticated_session.get(
            f"{BASE_URL}/v1/migration-jobs",
            params={"offset": 0, "limit": 5}
        ).json()

        page2 = authenticated_session.get(
            f"{BASE_URL}/v1/migration-jobs",
            params={"offset": 5, "limit": 5}
        ).json()

        page1_ids = [item["id"] for item in page1["data"]["items"]]
        page2_ids = [item["id"] for item in page2["data"]["items"]]
        assert page1_ids != page2_ids

    def test_offset_beyond_total_returns_empty(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/v1/migration-jobs",
            params={"offset": 999999, "limit": 10}
        )
        assert response.status_code == 200
        assert len(response.json()["data"]["items"]) == 0
```

### 8.3 Page Size Validation

```python
class TestPageSize:
    """Tests for page size limits and defaults."""

    def test_default_page_size(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        items = response.json()["data"]["items"]
        assert len(items) <= 20  # Default limit

    def test_maximum_page_size_enforced(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"limit": 1000}  # Exceeds max of 100
        )
        assert response.status_code == 200
        items = response.json()["data"]["items"]
        assert len(items) <= 100

    def test_minimum_page_size_enforced(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"limit": 0}
        )
        assert response.status_code == 400

    def test_negative_page_size_rejected(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"limit": -1}
        )
        assert response.status_code == 400
```

---

## 9. Error Handling Testing

### 9.1 Error Response Format

All error responses must follow the standard error envelope:

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "sourceSystem",
        "message": "Must be one of: SWIFT, SEPA, ACH, CHAPS, FedWire"
      }
    ]
  },
  "meta": {
    "requestId": "req-abc-123",
    "timestamp": "2026-07-15T10:30:00Z"
  }
}
```

```python
class TestErrorResponseFormat:
    """Tests for standard error response structure."""

    def test_error_response_has_required_fields(self, authenticated_session):
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json={}  # Invalid payload
        )
        data = response.json()

        assert data["status"] == "error"
        assert "error" in data
        assert "code" in data["error"]
        assert "message" in data["error"]
        assert "meta" in data

    def test_error_request_id_matches(self, authenticated_session):
        request_id = "test-req-123"
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json={},
            headers={"X-Request-Id": request_id}
        )
        assert response.json()["meta"]["requestId"] == request_id
```

### 9.2 Specific Error Codes

```python
class TestSpecificErrorCodes:
    """Tests for specific API error codes."""

    ERROR_CODE_TESTS = [
        ("VALIDATION_ERROR", 400, {"invalid": "payload"}),
        ("UNAUTHORIZED", 401, None),
        ("FORBIDDEN", 403, None),
        ("NOT_FOUND", 404, None),
        ("CONFLICT", 409, {"duplicate": "resource"}),
        ("RATE_LIMITED", 429, None),
        ("INTERNAL_ERROR", 500, None),
    ]

    def test_error_code_matches_status_code(self, authenticated_session, error_code, status_code):
        response = make_request_for_error(error_code, authenticated_session)
        assert response.status_code == status_code
        assert response.json()["error"]["code"] == error_code

    def test_400_validation_error_includes_details(self, authenticated_session):
        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json={"sourceSystem": "INVALID"}
        )
        assert response.status_code == 400
        error = response.json()["error"]
        assert error["code"] == "VALIDATION_ERROR"
        assert len(error.get("details", [])) > 0

    def test_404_includes_resource_type(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs/nonexistent-id"
        )
        assert response.status_code == 404
        error = response.json()["error"]
        assert "resource" in error.get("message", "").lower()
```

### 9.3 Retry Logic Testing

```python
import time
from unittest.mock import patch

class TestRetryLogic:
    """Tests for retry behavior on transient failures."""

    def test_retry_on_503_service_unavailable(self):
        call_count = 0

        def mock_request(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                return MockResponse(status_code=503)
            return MockResponse(status_code=200)

        with patch("requests.get", side_effect=mock_request):
            response = retry_request(f"{BASE_URL}/migration-jobs")
            assert response.status_code == 200
            assert call_count == 3

    def test_retry_respects_max_attempts(self):
        call_count = 0

        def mock_request(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            return MockResponse(status_code=503)

        with patch("requests.get", side_effect=mock_request):
            response = retry_request(
                f"{BASE_URL}/migration-jobs",
                max_retries=3,
                backoff_factor=0.1
            )
            assert response.status_code == 503
            assert call_count == 4  # 1 initial + 3 retries

    def test_no_retry_on_400_client_error(self):
        call_count = 0

        def mock_request(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            return MockResponse(status_code=400)

        with patch("requests.get", side_effect=mock_request):
            response = retry_request(f"{BASE_URL}/migration-jobs")
            assert response.status_code == 400
            assert call_count == 1  # No retry

    def test_exponential_backoff_timing(self):
        timings = []

        def mock_request(*args, **kwargs):
            timings.append(time.time())
            return MockResponse(status_code=503)

        start = time.time()
        with patch("requests.get", side_effect=mock_request):
            retry_request(
                f"{BASE_URL}/migration-jobs",
                max_retries=3,
                backoff_factor=0.5
            )

        delays = [timings[i+1] - timings[i] for i in range(len(timings)-1)]
        # Exponential backoff: 0.5, 1.0, 2.0 seconds
        assert delays[0] >= 0.4
        assert delays[1] >= 0.9
        assert delays[2] >= 1.9
```

### 9.4 Circuit Breaker Testing

```python
class TestCircuitBreaker:
    """Tests for circuit breaker pattern implementation."""

    def test_circuit_opens_after_threshold_failures(self):
        cb = CircuitBreaker(failure_threshold=3, recovery_timeout=5)

        for _ in range(3):
            with pytest.raises(ServiceUnavailable):
                cb.call(lambda: raise_error(503))

        # Circuit should now be open
        with pytest.raises(CircuitBreakerOpenError):
            cb.call(lambda: "should not execute")

    def test_circuit_half_open_after_timeout(self):
        cb = CircuitBreaker(failure_threshold=3, recovery_timeout=1)

        # Trip the circuit
        for _ in range(3):
            with pytest.raises(ServiceUnavailable):
                cb.call(lambda: raise_error(503))

        time.sleep(1.5)  # Wait for recovery timeout

        # Circuit should be half-open, allowing one request
        result = cb.call(lambda: "success")
        assert result == "success"

    def test_circuit_resets_on_success(self):
        cb = CircuitBreaker(failure_threshold=3, recovery_timeout=1)

        # Trip the circuit
        for _ in range(3):
            with pytest.raises(ServiceUnavailable):
                cb.call(lambda: raise_error(503))

        time.sleep(1.5)

        # Successful request should reset circuit
        result = cb.call(lambda: "success")
        assert result == "success"

        # Circuit should be closed, normal operation
        result = cb.call(lambda: "success")
        assert result == "success"
```

---

## 10. Version Compatibility Testing

### 10.1 API Versioning

MAP API uses URL-based versioning (`/v1/`, `/v2/`). Tests must verify version-specific behavior.

```python
class TestAPIVersioning:
    """Tests for API version compatibility."""

    def test_v1_endpoint_accessible(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/v1/migration-jobs")
        assert response.status_code == 200

    def test_v2_endpoint_accessible(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/v2/migration-jobs")
        assert response.status_code == 200

    def test_unversioned_returns_redirect(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            allow_redirects=False
        )
        assert response.status_code in [301, 302]
        assert "/v1/" in response.headers.get("Location", "")

    def test_old_version_still_supported(self, authenticated_session):
        # v1 should still work even when v2 exists
        response = authenticated_session.get(f"{BASE_URL}/v1/migration-jobs")
        assert response.status_code == 200
```

### 10.2 Backward Compatibility

```python
class TestBackwardCompatibility:
    """Tests ensuring backward compatibility across versions."""

    def test_v1_response_fields_preserved(self, authenticated_session):
        """V1 responses must not remove fields that existing consumers use."""
        response = authenticated_session.get(f"{BASE_URL}/v1/migration-jobs")
        data = response.json()

        # These fields must always be present in v1
        required_v1_fields = ["id", "sourceSystem", "targetSystem", "status"]
        for item in data["data"]["items"]:
            for field in required_v1_fields:
                assert field in item, f"V1 missing required field: {field}"

    def test_v2_additive_changes_only(self, authenticated_session):
        """V2 can add fields but must not remove v1 fields."""
        v1_response = authenticated_session.get(f"{BASE_URL}/v1/migration-jobs").json()
        v2_response = authenticated_session.get(f"{BASE_URL}/v2/migration-jobs").json()

        v1_fields = set(v1_response["data"]["items"][0].keys()) if v1_response["data"]["items"] else set()
        v2_fields = set(v2_response["data"]["items"][0].keys()) if v2_response["data"]["items"] else set()

        # V2 must contain all V1 fields
        assert v1_fields.issubset(v2_fields), \
            f"V2 missing V1 fields: {v1_fields - v2_fields}"

    def test_deprecated_fields_still_return(self, authenticated_session):
        """Deprecated fields should still be returned with deprecation header."""
        response = authenticated_session.get(f"{BASE_URL}/v1/migration-jobs")
        assert "Deprecation" in response.headers or \
               "Sunset" in response.headers or \
               response.json()["data"]["items"]  # Deprecated field still present
```

### 10.3 Content Negotiation

```python
class TestContentNegotiation:
    """Tests for API version via content negotiation."""

    def test_accept_header_version(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            headers={"Accept": "application/vnd.map.v2+json"}
        )
        assert response.status_code == 200

    def test_query_param_version(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs",
            params={"version": "2"}
        )
        assert response.status_code == 200
```

---

## 11. Rate Limiting Testing

### 11.1 Throttling Behavior

```python
import time
import concurrent.futures

class TestRateLimiting:
    """Tests for API rate limiting and throttling."""

    def test_rate_limit_headers_present(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        assert "X-RateLimit-Limit" in response.headers
        assert "X-RateLimit-Remaining" in response.headers
        assert "X-RateLimit-Reset" in response.headers

    def test_rate_limit_decrements(self, authenticated_session):
        response1 = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        remaining1 = int(response1.headers["X-RateLimit-Remaining"])

        response2 = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        remaining2 = int(response2.headers["X-RateLimit-Remaining"])

        assert remaining2 < remaining1

    def test_rate_limit_exceeded_returns_429(self, authenticated_session):
        # Exhaust rate limit
        for _ in range(1000):  # Assume 1000 req/hour limit
            response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
            if response.status_code == 429:
                break

        assert response.status_code == 429
        assert "Retry-After" in response.headers

    def test_retry_after_header_value(self, authenticated_session):
        # Exhaust rate limit
        for _ in range(1000):
            response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
            if response.status_code == 429:
                break

        retry_after = int(response.headers["Retry-After"])
        assert retry_after > 0
        assert retry_after <= 3600  # Should not exceed 1 hour
```

### 11.2 Quota Management

```python
class TestQuotaManagement:
    """Tests for API quota management."""

    def test_different_quotas_per_tier(self):
        tiers = {
            "free": 100,
            "standard": 1000,
            "enterprise": 10000
        }
        for tier, expected_limit in tiers.items():
            token = get_token_for_tier(tier)
            response = requests.get(
                f"{BASE_URL}/migration-jobs",
                headers={"Authorization": f"Bearer {token}"}
            )
            assert int(response.headers["X-RateLimit-Limit"]) == expected_limit

    def test_quota_reset_period(self, authenticated_session):
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs")
        reset_timestamp = int(response.headers["X-RateLimit-Reset"])
        current_time = int(time.time())

        # Reset should be within next hour
        assert reset_timestamp > current_time
        assert reset_timestamp - current_time <= 3600

    def test_per_endpoint_rate_limiting(self, authenticated_session):
        # POST endpoints may have stricter limits
        for _ in range(50):
            response = authenticated_session.post(
                f"{BASE_URL}/migration-jobs",
                json=valid_payload
            )
            if response.status_code == 429:
                break
        # Should hit limit before 100 requests for write endpoints
        assert response.status_code == 429
```

### 11.3 Concurrent Request Handling

```python
class TestConcurrentRequests:
    """Tests for handling concurrent API requests."""

    def test_concurrent_reads_no_conflict(self, authenticated_session):
        def read_jobs():
            return authenticated_session.get(f"{BASE_URL}/migration-jobs")

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(read_jobs) for _ in range(10)]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]

        for response in results:
            assert response.status_code == 200

    def test_concurrent_writes_handled_gracefully(self, authenticated_session):
        def create_job():
            return authenticated_session.post(
                f"{BASE_URL}/migration-jobs",
                json=valid_payload.copy()
            )

        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(create_job) for _ in range(5)]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]

        successful = [r for r in results if r.status_code == 201]
        conflicted = [r for r in results if r.status_code == 409]
        assert len(successful) >= 1
```

---

## 12. Test Data Management

### 12.1 Test Data Strategy

| Data Category | Strategy | Isolation Level |
|---|---|---|
| Reference Data | Shared fixtures | Test suite level |
| Transaction Data | Factory-generated | Test level |
| User Data | Role-based fixtures | Test level |
| Configuration Data | Environment-specific | Environment level |
| PII Data | Synthetic/Masked | Test level |

### 12.2 Test Data Factories

```python
import factory
import uuid
from datetime import datetime, timedelta

class MigrationJobFactory:
    """Factory for generating test migration job data."""

    @staticmethod
    def create(overrides=None):
        base_data = {
            "sourceSystem": "SWIFT",
            "targetSystem": "SEPA",
            "description": f"Test migration {uuid.uuid4().hex[:8]}",
            "scheduledAt": (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z",
            "metadata": {
                "priority": "normal",
                "category": "account_migration",
                "testRun": True
            }
        }
        if overrides:
            base_data.update(overrides)
        return base_data

    @staticmethod
    def create_batch(count, **overrides):
        return [MigrationJobFactory.create(overrides) for _ in range(count)]

    @staticmethod
    def create_swift_to_sepa():
        return MigrationJobFactory.create(
            sourceSystem="SWIFT",
            targetSystem="SEPA",
            description="SWIFT to SEPA migration test"
        )

    @staticmethod
    def create_high_priority():
        return MigrationJobFactory.create(
            metadata={"priority": "high", "category": "urgent_migration"}
        )

class TestDataSeeder:
    """Seeds test data for API test suites."""

    def __init__(self, api_client):
        self.client = api_client

    def seed_migration_jobs(self, count=10):
        jobs = []
        for _ in range(count):
            payload = MigrationJobFactory.create()
            response = self.client.post(f"{BASE_URL}/migration-jobs", json=payload)
            if response.status_code == 201:
                jobs.append(response.json()["data"])
        return jobs

    def seed_with_varied_statuses(self):
        statuses = ["pending", "in_progress", "completed", "failed"]
        jobs = []
        for status in statuses:
            job = MigrationJobFactory.create()
            response = self.client.post(f"{BASE_URL}/migration-jobs", json=job)
            if response.status_code == 201:
                job_id = response.json()["data"]["id"]
                if status != "pending":
                    self.client.patch(
                        f"{BASE_URL}/migration-jobs/{job_id}",
                        json={"status": status}
                    )
                jobs.append({"id": job_id, "status": status})
        return jobs
```

### 12.3 Test Data Cleanup

```python
import pytest

@pytest.fixture(scope="session")
def api_client():
    """Session-scoped API client."""
    client = requests.Session()
    client.headers.update({"Authorization": f"Bearer {get_test_token()}"})
    yield client
    client.close()

@pytest.fixture(scope="function")
def test_job(api_client):
    """Create and cleanup test job for each test function."""
    payload = MigrationJobFactory.create()
    response = api_client.post(f"{BASE_URL}/migration-jobs", json=payload)
    job_id = response.json()["data"]["id"]

    yield {"id": job_id, "payload": payload}

    # Cleanup
    api_client.delete(f"{BASE_URL}/migration-jobs/{job_id}")

@pytest.fixture(scope="function")
def cleanup_test_data(api_client):
    """Track and cleanup all resources created during test."""
    created_resources = []

    yield created_resources

    # Cleanup in reverse order
    for resource_type, resource_id in reversed(created_resources):
        api_client.delete(f"{BASE_URL}/{resource_type}/{resource_id}")
```

### 12.4 Mock External Services

```python
from unittest.mock import Mock, patch, MagicMock

class MockExternalServices:
    """Mock external service integrations for API tests."""

    @staticmethod
    @patch("app.connectors.swift_connector.SWIFTConnector")
    def mock_swift_connector(mock_connector):
        instance = mock_connector.return_value
        instance.validate_message.return_value = {
            "valid": True,
            "messageId": "MSG-12345"
        }
        instance.send_message.return_value = {
            "status": "sent",
            "reference": "REF-67890"
        }
        return instance

    @staticmethod
    @patch("app.connectors.sepa_connector.SEPAConnector")
    def mock_sepa_connector(mock_connector):
        instance = mock_connector.return_value
        instance.process_payment.return_value = {
            "status": "processed",
            "transactionId": "TXN-11111"
        }
        return instance

    @staticmethod
    @patch("app.connectors.regulatory_reporter.RegulatoryReporter")
    def mock_regulatory_reporter(mock_reporter):
        instance = mock_reporter.return_value
        instance.submit_report.return_value = {
            "status": "submitted",
            "reportId": "RPT-22222"
        }
        return instance

class TestWithMockedServices:
    """Tests using mocked external services."""

    def test_migration_job_with_mocked_swift(self, authenticated_session):
        with MockExternalServices.mock_swift_connector() as mock_swift:
            payload = MigrationJobFactory.create_swift_to_sepa()
            response = authenticated_session.post(
                f"{BASE_URL}/migration-jobs",
                json=payload
            )
            assert response.status_code == 201
            mock_swift.validate_message.assert_called_once()

    def test_batch_processing_with_mocked_services(self, authenticated_session):
        with MockExternalServices.mock_swift_connector() as mock_swift, \
             MockExternalServices.mock_sepa_connector() as mock_sepa:

            batch_payload = {
                "jobs": MigrationJobFactory.create_batch(5)
            }
            response = authenticated_session.post(
                f"{BASE_URL}/migration-jobs/batch",
                json=batch_payload
            )
            assert response.status_code == 201
            assert mock_swift.validate_message.call_count == 5
```

---

## 13. Recommended Tools

### 13.1 Tool Matrix

| Tool | Purpose | When to Use |
|---|---|---|
| **Postman** | Manual/exploratory testing, collection management | Development, debugging |
| **Newman** | CLI-based Postman collection runner | CI/CD pipelines |
| **REST Assured** | Java-based API testing | Java projects, BDD-style tests |
| **pytest + requests** | Python API testing | Python projects, custom frameworks |
| **Karate** | BDD API testing, DSL-based | Integration tests, contract tests |
| **Schemathesis** | Property-based API testing | Fuzz testing, contract validation |
| **Pact** | Consumer-driven contract testing | Microservice integration |
| **Dredd** | OpenAPI validation testing | API documentation validation |
| **k6** | Performance/load testing | API performance benchmarks |
| **Insomnia** | API design and testing | API design phase |

### 13.2 Postman Configuration

```json
{
  "info": {
    "name": "MAP API Test Collection",
    "_postman_id": "map-api-tests-v1",
    "description": "Comprehensive API test suite for MAP"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{api_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://api.map.internal"
    },
    {
      "key": "api_version",
      "value": "v1"
    }
  ]
}
```

### 13.3 Newman CI Integration

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-suite: [smoke, regression, contract]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Newman
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra

      - name: Run API Tests
        run: |
          newman run collections/${{ matrix.test-suite }}.json \
            --environment environments/${{ matrix.test-suite }}.json \
            --reporters cli,htmlextra \
            --reporter-htmlextra-export reports/${{ matrix.test-suite }}.html

      - name: Upload Test Reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: api-test-reports-${{ matrix.test-suite }}
          path: reports/
```

### 13.4 REST Assured (Java)

```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import org.junit.jupiter.api.Test;

public class MigrationJobApiTest {

    @Test
    public void testGetMigrationJobsReturns200() {
        given()
            .baseUri("https://api.map.internal")
            .header("Authorization", "Bearer " + getAuthToken())
        .when()
            .get("/v1/migration-jobs")
        .then()
            .statusCode(200)
            .contentType("application/json")
            .body("status", equalTo("success"))
            .body("data.items", notNullValue())
            .body("data.items.size()", lessThanOrEqualTo(20));
    }

    @Test
    public void testCreateMigrationJobReturns201() {
        String payload = """
            {
                "sourceSystem": "SWIFT",
                "targetSystem": "SEPA",
                "description": "Test migration job"
            }
            """;

        given()
            .baseUri("https://api.map.internal")
            .header("Authorization", "Bearer " + getAuthToken())
            .contentType("application/json")
            .body(payload)
        .when()
            .post("/v1/migration-jobs")
        .then()
            .statusCode(201)
            .body("data.id", notNullValue())
            .body("data.sourceSystem", equalTo("SWIFT"));
    }

    @Test
    public void testInvalidPayloadReturns400() {
        given()
            .baseUri("https://api.map.internal")
            .header("Authorization", "Bearer " + getAuthToken())
            .contentType("application/json")
            .body("{}")
        .when()
            .post("/v1/migration-jobs")
        .then()
            .statusCode(400)
            .body("error.code", equalTo("VALIDATION_ERROR"));
    }
}
```

### 13.5 pytest Configuration

```python
# conftest.py
import pytest
import requests
from typing import Generator

@pytest.fixture(scope="session")
def base_url():
    return "https://api.map.internal/v1"

@pytest.fixture(scope="session")
def auth_token():
    """Obtain authentication token for test session."""
    response = requests.post(
        "https://auth.map.internal/token",
        data={
            "grant_type": "client_credentials",
            "client_id": "test-client",
            "client_secret": "test-secret",
            "scope": "migration:read migration:write"
        }
    )
    return response.json()["access_token"]

@pytest.fixture(scope="session")
def authenticated_session(auth_token, base_url) -> Generator:
    """Session with authentication header pre-configured."""
    session = requests.Session()
    session.headers.update({
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    })
    yield session
    session.close()

# pytest.ini
[pytest]
testpaths = tests/api
markers =
    smoke: Quick smoke tests
    regression: Full regression suite
    contract: Contract validation tests
    security: Security-focused tests
addopts = -v --tb=short --strict-markers
```

---

## 14. Best Practices

### 14.1 Test Isolation

```python
class TestIsolationBestPractices:
    """Demonstrates proper test isolation patterns."""

    @pytest.fixture(autouse=True)
    def setup_teardown(self, authenticated_session):
        """Each test gets fresh state."""
        # Setup: create isolated test data
        self.test_job_id = create_test_job(authenticated_session)

        yield

        # Teardown: clean up test data
        authenticated_session.delete(f"{BASE_URL}/migration-jobs/{self.test_job_id}")

    def test_operation_on_isolated_data(self, authenticated_session):
        response = authenticated_session.get(
            f"{BASE_URL}/migration-jobs/{self.test_job_id}"
        )
        assert response.status_code == 200

    def test_no_dependency_between_tests(self, authenticated_session):
        # Each test operates on its own data
        # No test should depend on state from another test
        job = create_test_job(authenticated_session)
        response = authenticated_session.get(f"{BASE_URL}/migration-jobs/{job}")
        assert response.status_code == 200
```

### 14.2 Data Cleanup Patterns

```python
class TestDataCleanup:
    """Patterns for reliable test data cleanup."""

    def test_cleanup_with_context_manager(self, authenticated_session):
        with managed_resource(authenticated_session, "/migration-jobs") as resource:
            # resource is created before test, deleted after
            response = authenticated_session.get(
                f"{BASE_URL}/migration-jobs/{resource['id']}"
            )
            assert response.status_code == 200

    def test_cleanup_with_finalizer(self, authenticated_session, request):
        job = create_test_job(authenticated_session)

        def cleanup():
            authenticated_session.delete(f"{BASE_URL}/migration-jobs/{job['id']}")

        request.addfinalizer(cleanup)

        response = authenticated_session.get(f"{BASE_URL}/migration-jobs/{job['id']}")
        assert response.status_code == 200

    def test_bulk_cleanup(self, authenticated_session):
        created_ids = []
        try:
            for _ in range(10):
                job = create_test_job(authenticated_session)
                created_ids.append(job["id"])
            # Test logic here
        finally:
            for job_id in created_ids:
                authenticated_session.delete(f"{BASE_URL}/migration-jobs/{job_id}")
```

### 14.3 Mock External Services

```python
class TestMockingBestPractices:
    """Best practices for mocking external dependencies."""

    @patch("app.services.payment_service.PaymentService")
    def test_mock_at_service_boundary(self, mock_payment, authenticated_session):
        """Mock external services, not internal components."""
        mock_payment.return_value.process.return_value = {"status": "success"}

        response = authenticated_session.post(
            f"{BASE_URL}/migration-jobs",
            json=valid_payload
        )
        assert response.status_code == 201
        mock_payment.return_value.process.assert_called_once()

    def test_mock_response_structure_matches_real(self):
        """Mock responses should match actual API response structure."""
        mock_response = {
            "status": "success",
            "data": {
                "transactionId": "txn-123",
                "status": "completed"
            },
            "meta": {
                "requestId": "mock-req-123",
                "timestamp": "2026-07-15T10:30:00Z"
            }
        }
        # Validate mock matches expected structure
        validate_response_structure(mock_response)
```

### 14.4 Test Environment Management

| Environment | Purpose | Data Strategy | URL |
|---|---|---|---|
| **Local** | Development | Synthetic only | `localhost:8080` |
| **CI** | Automated testing | Ephemeral containers | Docker network |
| **Staging** | Pre-production validation | Anonymized subset | `staging-api.map.internal` |
| **Production** | Live traffic | Read-only monitoring | `api.map.internal` |

### 14.5 Test Reporting Standards

```python
# Custom pytest marker for API test categorization
def pytest_configure(config):
    config.addinivalue_line("markers", "smoke: Quick smoke tests")
    config.addinivalue_line("markers", "regression: Full regression suite")
    config.addinivalue_line("markers", "contract: Contract validation tests")
    config.addinivalue_line("markers", "security: Security-focused tests")
    config.addinivalue_line("markers", "performance: Performance tests")

# Run specific test suites
# pytest -m smoke tests/api/
# pytest -m "regression and not performance" tests/api/
```

### 14.6 API Test Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|---|---|---|
| Testing through UI | Fragile, slow | Test API directly |
| Shared mutable state | Test interdependence | Isolate test data |
| Hardcoded values | Brittle tests | Use factories/fixtures |
| Ignoring cleanup | Data pollution | Always clean up |
| No assertion on structure | Miss schema drifts | Validate response schema |
| Testing implementation details | Tight coupling | Test behavior only |

---

## Appendix A: Test Case Templates

### A.1 Standard Test Case Format

```yaml
test_case:
  id: API-MJ-001
  name: "Get migration jobs returns paginated list"
  endpoint: GET /v1/migration-jobs
  priority: P1
  category: Functional
  
  preconditions:
    - User is authenticated with valid token
    - At least 5 migration jobs exist in system
  
  steps:
    - step: "Send GET request to /v1/migration-jobs"
      expected: "Returns 200 OK"
    - step: "Validate response structure"
      expected: "Contains status, data, meta, pagination fields"
    - step: "Validate data.items array"
      expected: "Array contains migration job objects"
    - step: "Validate pagination cursor"
      expected: "Cursor is valid base64 string"
  
  test_data:
    auth_token: "valid_test_token"
    query_params:
      limit: 10
  
  expected_response:
    status_code: 200
    body:
      status: "success"
      data:
        items:
          - type: object
            required: [id, sourceSystem, targetSystem, status]
  
  automation:
    script: "tests/api/test_migration_jobs.py::TestGetMigrationJobs::test_returns_paginated_list"
    framework: "pytest + requests"
    last_run: "2026-07-15"
    result: "PASS"
```

### A.2 Negative Test Case Template

```yaml
negative_test_case:
  id: API-MJ-N001
  name: "Get migration jobs rejects invalid cursor"
  endpoint: GET /v1/migration-jobs
  priority: P2
  category: Negative
  
  preconditions:
    - User is authenticated with valid token
  
  steps:
    - step: "Send GET request with invalid cursor parameter"
      params:
        cursor: "not-a-valid-cursor"
      expected: "Returns 400 Bad Request"
    - step: "Validate error response structure"
      expected: "Contains error.code = INVALID_CURSOR"
  
  expected_response:
    status_code: 400
    body:
      status: "error"
      error:
        code: "INVALID_CURSOR"
        message: "The provided cursor is invalid or expired"
```

---

## Appendix B: Status Code Reference

| Code | Meaning | MAP Usage | Retry Safe |
|---|---|---|---|
| 200 | OK | Successful GET, PUT, PATCH | N/A |
| 201 | Created | Successful POST | N/A |
| 204 | No Content | Successful DELETE | N/A |
| 400 | Bad Request | Validation errors | No |
| 401 | Unauthorized | Missing/invalid auth | No (fix auth) |
| 403 | Forbidden | Insufficient permissions | No |
| 404 | Not Found | Resource doesn't exist | No |
| 409 | Conflict | Duplicate resource | Maybe (idempotent) |
| 422 | Unprocessable Entity | Business logic errors | No |
| 429 | Too Many Requests | Rate limit exceeded | Yes (with backoff) |
| 500 | Internal Server Error | Server failure | Yes (with backoff) |
| 502 | Bad Gateway | Upstream service error | Yes (with backoff) |
| 503 | Service Unavailable | Service overloaded | Yes (with backoff) |

---

## Appendix C: Glossary

| Term | Definition |
|---|---|
| **API Contract** | Agreement between API provider and consumer on request/response structure |
| **Circuit Breaker** | Pattern that prevents cascading failures by stopping calls to failing services |
| **Consumer-Driven Contract** | Testing approach where consumers define expected API behavior |
| **Cursor Pagination** | Pagination using opaque cursor for efficient large dataset traversal |
| **Idempotency** | Property where repeated identical requests produce same result |
| **OpenAPI** | Specification standard for describing REST APIs |
| **Rate Limiting** | Controlling number of API requests per time window |
| **Schema Validation** | Verifying request/response bodies conform to defined schemas |
| **Throttling** | Temporarily rejecting requests when rate limit is exceeded |

---

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | June 2026 | MAP Engineering | Initial draft |
| 0.5 | June 2026 | MAP Engineering | Added contract testing, rate limiting |
| 0.9 | July 2026 | MAP Engineering | Review feedback incorporated |
| 1.0 | July 2026 | MAP Engineering | Official release |

---

## Approval

| Role | Name | Date | Signature |
|---|---|---|---|
| VP of Engineering | _________________ | ___/___/2026 | _________________ |
| QA Director | _________________ | ___/___/2026 | _________________ |
| Security Lead | _________________ | ___/___/2026 | _________________ |
| API Architect | _________________ | ___/___/2026 | _________________ |

---

*This document is subject to quarterly review and update. All API testing must comply with these standards.*
