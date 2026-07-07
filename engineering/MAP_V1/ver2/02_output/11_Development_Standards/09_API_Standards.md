# MAP MVP API Standards

| Field | Value |
|-------|-------|
| **Document** | MAP MVP API Standards |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |

---

## 1. Purpose

This document defines the API design conventions, patterns, and standards for the MAP (Migration Assurance Platform) REST API layer. It establishes consistent behavior across all endpoints to ensure predictability, discoverability, and maintainability for internal and external consumers.

## 2. Scope

Applies to all HTTP/REST APIs exposed by MAP backend services, including:
- Public client-facing APIs (React frontend consumption)
- Internal service-to-service APIs
- Webhook delivery interfaces
- Administrative and management APIs

## 3. Base URL and Environment

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.map-platform.com` |
| Staging | `https://api-staging.map-platform.com` |
| Development | `https://api-dev.map-platform.com` |

All endpoints are served over HTTPS. HTTP requests are redirected to HTTPS with a 301 response.

## 4. REST Conventions

### 4.1 Resource-Oriented Design

APIs are organized around resources (nouns), not actions (verbs). Each resource is accessed via a consistent URL pattern:

```
GET    /v1/migration-jobs              # List
POST   /v1/migration-jobs              # Create
GET    /v1/migration-jobs/{id}         # Read
PUT    /v1/migration-jobs/{id}         # Replace
PATCH  /v1/migration-jobs/{id}         # Update
DELETE /v1/migration-jobs/{id}         # Delete
```

### 4.2 HTTP Verbs

| Verb | Idempotent | Safe | Usage |
|------|:----------:|:----:|-------|
| `GET` | Yes | Yes | Retrieve resource(s) |
| `POST` | No | No | Create resource or trigger action |
| `PUT` | Yes | No | Replace entire resource |
| `PATCH` | No | No | Partial update of resource |
| `DELETE` | Yes | No | Remove resource |

### 4.3 HTTP Status Codes

| Code | Usage |
|------|-------|
| `200 OK` | Successful read, update, or delete |
| `201 Created` | Resource created (include `Location` header) |
| `202 Accepted` | Async operation accepted for processing |
| `204 No Content` | Successful delete with no response body |
| `400 Bad Request` | Invalid request parameters or body |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | State conflict (e.g., duplicate name) |
| `422 Unprocessable Entity` | Validation errors |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server failure |
| `503 Service Unavailable` | Temporary outage or maintenance |

### 4.4 HATEOAS

Where beneficial, include hypermedia links in responses to enable discoverability:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "InProgress",
  "_links": {
    "self": { "href": "/v1/migration-jobs/550e8400-e29b-41d4-a716-446655440000" },
    "results": { "href": "/v1/migration-jobs/550e8400-e29b-41d4-a716-446655440000/results" },
    "cancel": { "href": "/v1/migration-jobs/550e8400-e29b-41d4-a716-446655440000/cancel", "method": "POST" }
  }
}
```

HATEOAS is required for top-level resource endpoints and optional for nested sub-resources.

## 5. Versioning

### 5.1 URL Path Versioning

All API endpoints MUST include the version in the URL path:

```
/v1/migration-jobs
/v2/migration-jobs
```

### 5.2 Versioning Rules

| Rule | Detail |
|------|--------|
| **Major version** | Required in URL path; breaking changes increment major version |
| **Minor version** | Included in response `api-version` header; backward-compatible additions |
| **Deprecation** | Deprecated versions return `Sunset` and `Deprecation` headers with migration timeline |
| **Backward compatibility** | Additive changes (new fields, new endpoints) do NOT require a new major version |
| **Breaking changes** | Removing fields, changing types, or altering semantics require a new major version |

### 5.3 Response Header

All API responses MUST include:

```
api-version: 1.0
```

## 6. Authentication

### 6.1 Bearer Token (JWT)

All client-facing API requests MUST include a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued by Microsoft Entra ID (Azure AD) via OAuth 2.0 authorization code flow. Tokens expire after 1 hour; use refresh tokens for renewal.

### 6.2 OAuth 2.0 Flows

| Flow | Usage |
|------|-------|
| Authorization Code + PKCE | Single-page applications (React frontend) |
| Client Credentials | Service-to-service (daemon apps, background jobs) |
| On-Behalf-Of | Middleware acting on behalf of a user |

### 6.3 API Keys

For service-to-service communication where OAuth is impractical (e.g., webhooks, external integrations), support API key authentication via the `X-API-Key` header. API keys are scoped to specific permissions and can be revoked independently.

### 6.4 Token Validation

The API gateway or middleware MUST validate:
- Token signature against Entra ID signing keys
- Token expiration (`exp` claim)
- Audience (`aud` claim) matches API identifier
- Issuer (`iss` claim) matches Entra ID tenant

## 7. Pagination

### 7.1 Cursor-Based Pagination (Preferred)

For large datasets, use cursor-based pagination to avoid offset drift:

```
GET /v1/migration-jobs?cursor=abc123&limit=25
```

Response:

```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "def456",
    "has_more": true
  }
}
```

### 7.2 Offset-Based Pagination

For simple use cases, support offset pagination:

```
GET /v1/migration-jobs?page=2&pageNumber=20
```

Response:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "pageSize": 20,
    "total_count": 150,
    "total_pages": 8
  }
}
```

### 7.3 Pagination Defaults

| Parameter | Default | Maximum |
|-----------|---------|---------|
| `pageSize` | 25 | 100 |
| `limit` | 25 | 100 |
| `page` | 1 | — |

### 7.4 Next/Previous Links

Include navigation links in paginated responses:

```json
{
  "pagination": {
    "next": "/v1/migration-jobs?page=3&pageSize=20",
    "previous": "/v1/migration-jobs?page=1&pageSize=20"
  }
}
```

## 8. Filtering

### 8.1 Query Parameter Filtering

Filter resources using query parameters with operator suffixes:

```
GET /v1/migration-jobs?status=eq:InProgress&createdAt=gt:2026-01-01
```

### 8.2 Supported Operators

| Operator | Symbol | Example |
|----------|--------|---------|
| Equals | `eq` | `status=eq:Completed` |
| Not equals | `ne` | `status=ne:Failed` |
| Greater than | `gt` | `createdAt=gt:2026-01-01` |
| Greater or equal | `gte` | `score=gte:80` |
| Less than | `lt` | `duration=lt:300` |
| Less or equal | `lte` | `cost=lte:1000` |
| Contains | `contains` | `name=contains:production` |
| Starts with | `starts_with` | `name=starts_with:MAP` |
| In | `in` | `status=in:InProgress,Completed` |

### 8.3 Multiple Filters

Combine multiple filters with implicit AND:

```
GET /v1/migration-jobs?status=eq:InProgress&tenantId=eq:abc123&createdAt=gt:2026-06-01
```

## 9. Sorting

### 9.1 Sort Parameters

```
GET /v1/migration-jobs?sortBy=createdAt&sortOrder=desc
```

| Parameter | Values | Default |
|-----------|--------|---------|
| `sortBy` | Resource field name | `createdAt` |
| `sortOrder` | `asc`, `desc` | `desc` |

### 9.2 Multiple Sort Fields

Separate multiple sort fields with commas:

```
GET /v1/migration-jobs?sortBy=status,createdAt&sortOrder=asc,desc
```

## 10. Validation

### 10.1 Request Validation

All incoming requests MUST be validated before processing:

- **.NET Backend:** Use FluentValidation integrated with ASP.NET model state
- **Frontend (TypeScript):** Use Zod schemas for request/response validation

### 10.2 Error Response Format

Validation errors return `422 Unprocessable Entity` with field-level details:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "name",
        "code": "REQUIRED",
        "message": "Name is required"
      },
      {
        "field": "maxConcurrency",
        "code": "RANGE",
        "message": "MaxConcurrency must be between 1 and 100",
        "constraints": { "min": 1, "max": 100 }
      }
    ]
  }
}
```

### 10.3 Friendly Error Messages

- Use human-readable error messages (not raw exception text)
- Never expose internal details (stack traces, SQL queries, file paths)
- Include actionable guidance where possible ("Name is required; provide a non-empty string")

## 11. Error Handling

### 11.1 Consistent Error Response

All error responses follow a consistent structure:

```json
{
  "error": {
    "code": "MIGRATION_JOB_NOT_FOUND",
    "message": "Migration job with ID 'abc-123' was not found",
    "trace_id": "00-abcdef1234567890-abcdef1234567890-01",
    "timestamp": "2026-07-01T14:30:00Z"
  }
}
```

### 11.2 Error Codes

| Code | HTTP Status | Description |
|------|:-----------:|-------------|
| `VALIDATION_ERROR` | 422 | Request body or parameter validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource does not exist |
| `CONFLICT` | 409 | State conflict (duplicate, version mismatch) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Temporary unavailability |
| `MIGRATION_JOB_NOT_FOUND` | 404 | Specific: migration job not found |
| `MIGRATION_JOB_INVALID_STATE` | 409 | Operation not valid for current job state |
| `VALIDATION_RULE_FAILED` | 422 | Migration validation check failed |

### 11.3 Trace IDs

Every response MUST include a trace ID for correlation:

```
trace_id: 00-abcdef1234567890-abcdef1234567890-01
```

Trace IDs follow the W3C Trace Context format and are used to correlate requests across services via Application Insights.

### 11.4 Internal Error Handling

- Log full exception details server-side (never in response bodies)
- Return generic messages for 500 errors; include trace ID for investigation
- Implement global exception middleware in ASP.NET to catch unhandled exceptions
- Alert on 500 errors exceeding threshold (5 per minute per endpoint)

## 12. OpenAPI Specification

### 12.1 Auto-Generation

The OpenAPI (Swagger) specification MUST be auto-generated from code:

- **.NET 8:** Use `Swashbuckle.AspNetCore` or `NSwag` to generate from controller annotations
- **DTOs:** Annotate request/response models with `JsonPropertyName`, `Description`, `Required`
- **Authentication:** Document OAuth 2.0 and API key schemes

### 12.2 Swagger UI

Expose Swagger UI at `/swagger` in non-production environments:

```
https://api-dev.map-platform.com/swagger
```

Production exposes only the JSON specification at `/swagger/v1/swagger.json` (UI disabled).

### 12.3 Versioning

Each API major version has its own OpenAPI specification:

```
/swagger/v1/swagger.json
/swagger/v2/swagger.json
```

### 12.4 Publication

- Publish OpenAPI specs to an internal developer portal (e.g., Azure API Management)
- Include request/response examples for all endpoints
- Document all error codes with descriptions
- Update specs as part of PR review (CI validation)

## 13. Rate Limiting

### 13.1 Limits

| Tier | Requests/Minute | Requests/Hour |
|------|:---------------:|:-------------:|
| Free | 60 | 1,000 |
| Standard | 300 | 10,000 |
| Premium | 1,000 | 50,000 |
| Internal | 10,000 | Unlimited |

### 13.2 Response Headers

All responses MUST include rate limit headers:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 247
X-RateLimit-Reset: 1688236800
```

### 13.3 Exceeded Limits

When rate limit is exceeded, return `429 Too Many Requests` with:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Retry after 30 seconds.",
    "retry_after": 30
  }
}
```

Include `Retry-After` header with seconds until reset.

### 13.4 Tiered Limits

Rate limits are enforced per:
- **Per-user:** Based on authenticated user identity
- **Per-endpoint:** Higher limits for read-heavy endpoints, lower for mutation endpoints
- **Per-tenant:** Aggregate limit across all users in a tenant

## 14. Idempotency

### 14.1 Idempotency Key

For non-idempotent operations (`POST`, `PUT`), clients MUST send an `Idempotency-Key` header:

```
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

### 14.2 Server Behavior

- Store the key and response for 24 hours
- If a duplicate key is received, return the cached response (same status code and body)
- Generate idempotency keys UUID v4 on the client side
- Keys are scoped per-endpoint and per-user

### 14.3 Retry Safety

| Operation | Idempotency | Client Responsibility |
|-----------|:-----------:|----------------------|
| `POST` (create) | Key required | Generate UUID; retry with same key |
| `PUT` (replace) | Inherent | Retry with same body |
| `PATCH` (update) | Key recommended | Generate UUID; use If-Match for optimistic concurrency |
| `DELETE` | Inherent | Retry safely |
| `GET` | Inherent | No special handling |

### 14.4 Optimistic Concurrency

For `PUT` and `PATCH` operations, use `If-Match` headers with ETags to prevent lost updates:

```
If-Match: "v3"
```

If the ETag does not match the current resource version, return `409 Conflict`.

## 15. Request/Response Conventions

### 15.1 Content Type

All requests and responses use `application/json`:

```
Content-Type: application/json
```

### 15.2 Date/Time Format

All timestamps use ISO 8601 format with UTC timezone:

```json
"createdAt": "2026-07-01T14:30:00Z"
```

### 15.3 Naming Convention

All JSON properties use camelCase:

```json
{
  "migrationJobId": "...",
  "maxConcurrency": 10,
  "createdAt": "2026-07-01T14:30:00Z"
}
```

### 15.4 Null Handling

- Omit optional fields entirely (do not include `"field": null`)
- Required fields MUST be present; use empty string `""` for optional string fields with no value
- Array fields default to empty array `[]` when no items exist

### 15.5 Envelope Pattern

All responses are wrapped in a consistent envelope:

```json
{
  "data": { ... },
  "meta": {
    "request_id": "abc-123",
    "api_version": "1.0"
  }
}
```

For error responses:

```json
{
  "error": {
    "code": "...",
    "message": "...",
    "details": [...]
  }
}
```

---

*End of MAP MVP API Standards*
