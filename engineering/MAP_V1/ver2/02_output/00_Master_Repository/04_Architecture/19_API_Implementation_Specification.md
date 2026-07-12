# API Implementation Specification

**Document:** MAP MVP API Implementation Specification
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## Overview

This document provides detailed implementation specifications for all MAP API endpoints. Each endpoint includes HTTP method, path, description, authentication, request/response schemas, validation rules, error codes, performance expectations, and logging requirements.

---

## Base URL

- **Development:** `https://map-api-dev.azurewebsites.net/api/v1`
- **Staging:** `https://map-api-staging.azurewebsites.net/api/v1`
- **Production:** `https://map-api-prod.azurewebsites.net/api/v1`

---

## Common Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token from Entra ID |
| `Content-Type` | Yes | `application/json` |
| `X-Tenant-ID` | Yes | Tenant identifier |
| `X-Request-ID` | Yes | Unique request identifier |
| `X-Correlation-ID` | No | Correlation ID for tracing |
| `Accept-Language` | No | Language preference (default: en-US) |

---

## Authentication Endpoints

### POST /auth/login

**Description:** Initiate SSO login with Microsoft Entra ID

**Authentication Required:** No

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "code": "string",
  "redirect_uri": "string",
  "state": "string"
}
```

**Response Schema (200 OK):**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "roles": ["string"]
  }
}
```

**Example Request:**
```json
POST /api/v1/auth/login
{
  "code": "AUTH_CODE_FROM_ENTRA",
  "redirect_uri": "https://map-app.azurewebsites.net/callback",
  "state": "random-state-value"
}
```

**Example Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@company.com",
    "name": "John Doe",
    "roles": ["Admin"]
  }
}
```

**Validation Rules:**
- `code`: Required, non-empty string
- `redirect_uri`: Required, valid URL
- `state`: Required, must match session state

**Error Codes:**
- 400: Invalid authorization code
- 401: Authentication failed
- 403: Tenant access denied
- 429: Rate limit exceeded
- 500: Internal server error

**Performance Expectations:**
- Response time: < 500ms (p95)
- Throughput: 100 requests/second

**Logging Requirements:**
- Log authentication attempts (success/failure)
- Log user identity and IP address
- Log tenant context
- Do NOT log authorization code or tokens

---

### POST /auth/logout

**Description:** Invalidate current session and tokens

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response Schema (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Example Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Validation Rules:**
- `refreshToken`: Required if provided, valid refresh token

**Error Codes:**
- 401: Invalid or expired token
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log logout event with user ID
- Log timestamp of logout

---

### GET /auth/me

**Description:** Get current authenticated user information

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "roles": ["string"],
  "tenant": {
    "id": "uuid",
    "name": "string"
  },
  "lastLogin": "2026-06-15T10:30:00Z"
}
```

**Example Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@company.com",
  "name": "John Doe",
  "roles": ["Admin"],
  "tenant": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Contoso Corporation"
  },
  "lastLogin": "2026-06-15T10:30:00Z"
}
```

**Error Codes:**
- 401: Invalid or expired token
- 404: User not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 100ms (p95)

**Logging Requirements:**
- Log user profile access

---

## Tenant Endpoints

### GET /tenants

**Description:** List all tenants for the current user

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| search | string | No | Search by name |

**Response Schema (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "createdAt": "2026-01-15T10:30:00Z",
      "subscriptionCount": 5,
      "userCount": 25
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 20
}
```

**Example Response (200 OK):**
```json
{
  "items": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Contoso Corporation",
      "createdAt": "2026-01-15T10:30:00Z",
      "subscriptionCount": 5,
      "userCount": 25
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

**Error Codes:**
- 401: Unauthorized
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log tenant list access

---

### GET /tenants/{id}

**Description:** Get tenant details by ID

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Tenant ID |

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-06-15T10:30:00Z",
  "subscriptionCount": 5,
  "userCount": 25,
  "settings": {
    "maxSubscriptions": 50,
    "maxUsers": 100
  }
}
```

**Example Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Contoso Corporation",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-06-15T10:30:00Z",
  "subscriptionCount": 5,
  "userCount": 25,
  "settings": {
    "maxSubscriptions": 50,
    "maxUsers": 100
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Tenant not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 150ms (p95)

**Logging Requirements:**
- Log tenant detail access

---

### POST /tenants

**Description:** Create a new tenant

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "string",
  "settings": {
    "maxSubscriptions": 50,
    "maxUsers": 100
  }
}
```

**Response Schema (201 Created):**
```json
{
  "id": "uuid",
  "name": "string",
  "createdAt": "2026-06-15T10:30:00Z"
}
```

**Example Request:**
```json
POST /api/v1/tenants
{
  "name": "New Corporation",
  "settings": {
    "maxSubscriptions": 25,
    "maxUsers": 50
  }
}
```

**Example Response (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "New Corporation",
  "createdAt": "2026-06-15T10:30:00Z"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters, unique per user
- `settings.maxSubscriptions`: Optional, 1-100
- `settings.maxUsers`: Optional, 1-1000

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 409: Tenant name already exists
- 500: Internal server error

**Performance Expectations:**
- Response time: < 300ms (p95)

**Logging Requirements:**
- Log tenant creation with user ID

---

### PUT /tenants/{id}

**Description:** Update tenant details

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Tenant ID |

**Request Body:**
```json
{
  "name": "string",
  "settings": {
    "maxSubscriptions": 50,
    "maxUsers": 100
  }
}
```

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "updatedAt": "2026-06-15T10:30:00Z"
}
```

**Validation Rules:**
- `name`: Optional, 2-100 characters, unique per user
- `settings.maxSubscriptions`: Optional, 1-100
- `settings.maxUsers`: Optional, 1-1000

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 404: Tenant not found
- 409: Tenant name already exists
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log tenant update with user ID and changes

---

## Subscription Endpoints

### GET /subscriptions

**Description:** List all Azure subscriptions for the current tenant

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| status | string | No | Filter by status (Active, Inactive, Error) |
| search | string | No | Search by name |

**Response Schema (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "subscriptionId": "string",
      "name": "string",
      "status": "string",
      "tenantId": "uuid",
      "resourceCount": 150,
      "lastScanned": "2026-06-15T10:30:00Z",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 20
}
```

**Example Response (200 OK):**
```json
{
  "items": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "subscriptionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Production Subscription",
      "status": "Active",
      "tenantId": "660e8400-e29b-41d4-a716-446655440001",
      "resourceCount": 150,
      "lastScanned": "2026-06-15T10:30:00Z",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 500: Internal server error

**Performance Expectations:**
- Response time: < 300ms (p95)

**Logging Requirements:**
- Log subscription list access

---

### GET /subscriptions/{id}

**Description:** Get subscription details by ID

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Subscription record ID |

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "subscriptionId": "string",
  "name": "string",
  "status": "string",
  "tenantId": "uuid",
  "resourceCount": 150,
  "resourceTypes": [
    {
      "type": "string",
      "count": 50
    }
  ],
  "lastScanned": "2026-06-15T10:30:00Z",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-06-15T10:30:00Z"
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Subscription not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log subscription detail access

---

### POST /subscriptions/connect

**Description:** Connect a new Azure subscription

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Request Body:**
```json
{
  "subscriptionId": "string",
  "tenantId": "uuid",
  "displayName": "string"
}
```

**Response Schema (201 Created):**
```json
{
  "id": "uuid",
  "subscriptionId": "string",
  "name": "string",
  "status": "Validating",
  "createdAt": "2026-06-15T10:30:00Z"
}
```

**Example Request:**
```json
POST /api/v1/subscriptions/connect
{
  "subscriptionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "tenantId": "660e8400-e29b-41d4-a716-446655440001",
  "displayName": "Development Subscription"
}
```

**Example Response (201 Created):**
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "subscriptionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "name": "Development Subscription",
  "status": "Validating",
  "createdAt": "2026-06-15T10:30:00Z"
}
```

**Validation Rules:**
- `subscriptionId`: Required, valid Azure subscription ID format
- `tenantId`: Required, valid UUID
- `displayName`: Required, 2-100 characters

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 409: Subscription already connected
- 500: Internal server error

**Performance Expectations:**
- Response time: < 500ms (p95)

**Logging Requirements:**
- Log subscription connection attempt
- Log validation result

---

### DELETE /subscriptions/{id}

**Description:** Disconnect an Azure subscription

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Subscription record ID |

**Response Schema (200 OK):**
```json
{
  "message": "Subscription disconnected successfully"
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Subscription not found
- 409: Subscription has active migrations
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log subscription disconnection

---

## Resource Endpoints

### GET /resources

**Description:** List all discovered Azure resources

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| type | string | No | Filter by resource type |
| status | string | No | Filter by status |
| subscriptionId | uuid | No | Filter by subscription |
| search | string | No | Search by name |
| tags | string | No | Filter by tags (key=value) |
| sort | string | No | Sort field (default: name) |
| order | string | No | Sort order (asc/desc, default: asc) |

**Response Schema (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "type": "string",
      "status": "string",
      "subscriptionId": "uuid",
      "location": "string",
      "tags": {},
      "migrationReadiness": "Ready|NotReady|Partial",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pageSize": 20
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 500: Internal server error

**Performance Expectations:**
- Response time: < 500ms (p95)

**Logging Requirements:**
- Log resource list access

---

### GET /resources/{id}

**Description:** Get resource details by ID

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Resource ID |

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "type": "string",
  "status": "string",
  "subscriptionId": "uuid",
  "location": "string",
  "tags": {},
  "properties": {},
  "dependencies": [
    {
      "id": "uuid",
      "name": "string",
      "type": "string"
    }
  ],
  "migrationReadiness": "string",
  "readinessScore": 85,
  "readinessIssues": ["string"],
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-06-15T10:30:00Z"
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log resource detail access

---

### GET /resources/{id}/dependencies

**Description:** Get resource dependencies

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Resource ID |

**Response Schema (200 OK):**
```json
{
  "resourceId": "uuid",
  "dependencies": [
    {
      "id": "uuid",
      "name": "string",
      "type": "string",
      "dependencyType": "string",
      "direction": "inbound|outbound"
    }
  ],
  "dependents": [
    {
      "id": "uuid",
      "name": "string",
      "type": "string",
      "dependencyType": "string",
      "direction": "inbound|outbound"
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 300ms (p95)

**Logging Requirements:**
- Log dependency graph access

---

### POST /resources/scan

**Description:** Trigger resource discovery scan for a subscription

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Request Body:**
```json
{
  "subscriptionId": "uuid",
  "resourceTypes": ["string"],
  "forceScan": false
}
```

**Response Schema (202 Accepted):**
```json
{
  "scanId": "uuid",
  "status": "Queued",
  "estimatedDuration": 300
}
```

**Validation Rules:**
- `subscriptionId`: Required, valid UUID
- `resourceTypes`: Optional, array of valid resource types
- `forceScan`: Optional, boolean (default: false)

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 409: Scan already in progress
- 429: Rate limit exceeded
- 500: Internal server error

**Performance Expectations:**
- Response time: < 500ms (p95)

**Logging Requirements:**
- Log scan initiation
- Log scan parameters

---

## Migration Endpoints

### GET /migrations

**Description:** List all migrations for the current tenant

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| status | string | No | Filter by status (Draft, InProgress, Completed, Failed) |
| search | string | No | Search by name |

**Response Schema (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "status": "string",
      "phase": "string",
      "progress": 75,
      "resourceCount": 10,
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-06-15T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 20
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 500: Internal server error

**Performance Expectations:**
- Response time: < 300ms (p95)

**Logging Requirements:**
- Log migration list access

---

### GET /migrations/{id}

**Description:** Get migration details by ID

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Migration ID |

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "string",
  "phase": "string",
  "progress": 75,
  "resources": [
    {
      "id": "uuid",
      "name": "string",
      "type": "string"
    }
  ],
  "validations": [
    {
      "id": "uuid",
      "status": "string",
      "completedAt": "2026-06-15T10:30:00Z"
    }
  ],
  "findings": {
    "total": 15,
    "critical": 2,
    "high": 5,
    "medium": 5,
    "low": 3
  },
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-06-15T10:30:00Z"
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Migration not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 300ms (p95)

**Logging Requirements:**
- Log migration detail access

---

### POST /migrations

**Description:** Create a new migration

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "resourceIds": ["uuid"]
}
```

**Response Schema (201 Created):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "Draft",
  "phase": "Planning",
  "progress": 0,
  "createdAt": "2026-06-15T10:30:00Z"
}
```

**Example Request:**
```json
POST /api/v1/migrations
{
  "name": "ERP System Upgrade",
  "description": "Migrate ERP system to Azure",
  "resourceIds": [
    "110e8400-e29b-41d4-a716-446655440005",
    "120e8400-e29b-41d4-a716-446655440006"
  ]
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `description`: Optional, max 1000 characters
- `resourceIds`: Required, array of valid UUIDs

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 409: Migration name already exists
- 500: Internal server error

**Performance Expectations:**
- Response time: < 500ms (p95)

**Logging Requirements:**
- Log migration creation with user ID

---

### PUT /migrations/{id}

**Description:** Update migration details

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Migration ID |

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "resourceIds": ["uuid"]
}
```

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "updatedAt": "2026-06-15T10:30:00Z"
}
```

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 404: Migration not found
- 409: Migration name already exists
- 500: Internal server error

**Performance Expectations:**
- Response time: < 300ms (p95)

**Logging Requirements:**
- Log migration update with user ID and changes

---

### DELETE /migrations/{id}

**Description:** Delete a migration

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Migration ID |

**Response Schema (200 OK):**
```json
{
  "message": "Migration deleted successfully"
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Migration not found
- 409: Migration has active validations
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log migration deletion

---

## Validation Endpoints

### GET /migrations/{id}/validations

**Description:** List all validations for a migration

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Migration ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| status | string | No | Filter by status |

**Response Schema (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "status": "string",
      "totalRules": 20,
      "passedRules": 15,
      "failedRules": 3,
      "warningRules": 2,
      "startedAt": "2026-06-15T10:30:00Z",
      "completedAt": "2026-06-15T10:35:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 20
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Migration not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log validation list access

---

### GET /validations/{id}

**Description:** Get validation details by ID

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Validation ID |

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "migrationId": "uuid",
  "status": "string",
  "totalRules": 20,
  "passedRules": 15,
  "failedRules": 3,
  "warningRules": 2,
  "rules": [
    {
      "id": "uuid",
      "name": "string",
      "category": "string",
      "status": "string",
      "message": "string",
      "executedAt": "2026-06-15T10:30:00Z"
    }
  ],
  "startedAt": "2026-06-15T10:30:00Z",
  "completedAt": "2026-06-15T10:35:00Z",
  "duration": 300
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Validation not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log validation detail access

---

### POST /migrations/{id}/validate

**Description:** Execute validation for a migration

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Migration ID |

**Request Body:**
```json
{
  "ruleIds": ["uuid"],
  "parameters": {}
}
```

**Response Schema (202 Accepted):**
```json
{
  "validationId": "uuid",
  "status": "Queued",
  "estimatedDuration": 300
}
```

**Validation Rules:**
- `ruleIds`: Optional, array of valid UUIDs (empty = all rules)
- `parameters`: Optional, key-value pairs

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 404: Migration not found
- 409: Validation already in progress
- 429: Rate limit exceeded
- 500: Internal server error

**Performance Expectations:**
- Response time: < 500ms (p95)

**Logging Requirements:**
- Log validation initiation
- Log validation parameters

---

### GET /validations/{id}/findings

**Description:** Get findings from a validation

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Validation ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| severity | string | No | Filter by severity (Critical, High, Medium, Low) |
| category | string | No | Filter by category |

**Response Schema (200 OK):**
```json
{
  "validationId": "uuid",
  "findings": [
    {
      "id": "uuid",
      "title": "string",
      "severity": "string",
      "category": "string",
      "resourceId": "uuid",
      "resourceName": "string",
      "message": "string",
      "recommendation": "string"
    }
  ],
  "summary": {
    "total": 15,
    "critical": 2,
    "high": 5,
    "medium": 5,
    "low": 3
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Validation not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log findings access

---

## Report Endpoints

### GET /reports

**Description:** List all generated reports

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| type | string | No | Filter by report type |
| migrationId | uuid | No | Filter by migration |

**Response Schema (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "type": "string",
      "status": "string",
      "migrationId": "uuid",
      "format": "string",
      "fileSize": 1024000,
      "createdAt": "2026-06-15T10:30:00Z",
      "expiresAt": "2026-07-15T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 20
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log report list access

---

### GET /reports/{id}

**Description:** Get report details by ID

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Report ID |

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "type": "string",
  "status": "string",
  "migrationId": "uuid",
  "format": "string",
  "fileSize": 1024000,
  "downloadUrl": "string",
  "createdAt": "2026-06-15T10:30:00Z",
  "expiresAt": "2026-07-15T10:30:00Z"
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Report not found
- 500: Internal server error

**Performance Expectations:**
- Response time: < 150ms (p95)

**Logging Requirements:**
- Log report detail access

---

### POST /reports/generate

**Description:** Generate a new report

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Request Body:**
```json
{
  "name": "string",
  "type": "string",
  "migrationId": "uuid",
  "format": "string",
  "includeFindings": true,
  "includeRecommendations": true
}
```

**Response Schema (202 Accepted):**
```json
{
  "reportId": "uuid",
  "status": "Generating",
  "estimatedDuration": 60
}
```

**Example Request:**
```json
POST /api/v1/reports/generate
{
  "name": "Migration Summary Report",
  "type": "MigrationSummary",
  "migrationId": "220e8400-e29b-41d4-a716-446655440007",
  "format": "PDF",
  "includeFindings": true,
  "includeRecommendations": true
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `type`: Required, valid report type (MigrationSummary, ValidationDetail, Compliance, Executive)
- `migrationId`: Required, valid UUID
- `format`: Required, valid format (PDF, Excel, CSV)

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 404: Migration not found
- 429: Rate limit exceeded
- 500: Internal server error

**Performance Expectations:**
- Response time: < 500ms (p95)

**Logging Requirements:**
- Log report generation request
- Log report parameters

---

### GET /reports/{id}/download

**Description:** Download a generated report

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Report ID |

**Response Schema (200 OK):**
- Content-Type: application/octet-stream
- Content-Disposition: attachment; filename="report.pdf"

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 404: Report not found
- 410: Report expired
- 500: Internal server error

**Performance Expectations:**
- Response time: < 1000ms (p95)

**Logging Requirements:**
- Log report download

---

## Policy Endpoints

### GET /policies

**Description:** List all policies for the current tenant

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| status | string | No | Filter by status (Active, Inactive, Draft) |
| category | string | No | Filter by category |

**Response Schema (200 OK):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "status": "string",
      "category": "string",
      "rulesCount": 5,
      "compliancePercentage": 95,
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 20
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log policy list access

---

### POST /policies

**Description:** Create a new policy

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "string",
  "rules": [
    {
      "name": "string",
      "condition": "string",
      "action": "string",
      "severity": "string"
    }
  ]
}
```

**Response Schema (201 Created):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "Active",
  "createdAt": "2026-06-15T10:30:00Z"
}
```

**Example Request:**
```json
POST /api/v1/policies
{
  "name": "SSL Certificate Policy",
  "description": "Ensure all web apps have SSL certificates",
  "category": "Security",
  "rules": [
    {
      "name": "SSL Certificate Required",
      "condition": "resource.type == 'Microsoft.Web/sites' && !resource.sslCertificate",
      "action": "FlagForReview",
      "severity": "High"
    }
  ]
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters, unique
- `description`: Optional, max 1000 characters
- `category`: Required, valid category (Security, Performance, Cost, Compliance)
- `rules`: Required, array of valid rules

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 409: Policy name already exists
- 500: Internal server error

**Performance Expectations:**
- Response time: < 300ms (p95)

**Logging Requirements:**
- Log policy creation with user ID

---

### PUT /policies/{id}

**Description:** Update a policy

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | uuid | Policy ID |

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "status": "string",
  "rules": [
    {
      "id": "uuid",
      "name": "string",
      "condition": "string",
      "action": "string",
      "severity": "string"
    }
  ]
}
```

**Response Schema (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "string",
  "updatedAt": "2026-06-15T10:30:00Z"
}
```

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 404: Policy not found
- 409: Policy name already exists
- 500: Internal server error

**Performance Expectations:**
- Response time: < 200ms (p95)

**Logging Requirements:**
- Log policy update with user ID and changes

---

## AI Endpoints

### POST /ai/insights

**Description:** Get AI-powered insights for a resource or migration

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Request Body:**
```json
{
  "context": "string",
  "contextId": "uuid",
  "insightType": "string"
}
```

**Response Schema (200 OK):**
```json
{
  "insights": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "confidence": 0.85,
      "category": "string",
      "recommendations": ["string"],
      "generatedAt": "2026-06-15T10:30:00Z"
    }
  ],
  "summary": "string",
  "model": "gpt-4",
  "tokensUsed": 1500
}
```

**Example Request:**
```json
POST /api/v1/ai/insights
{
  "context": "migration",
  "contextId": "220e8400-e29b-41d4-a716-446655440007",
  "insightType": "optimization"
}
```

**Example Response (200 OK):**
```json
{
  "insights": [
    {
      "id": "330e8400-e29b-41d4-a716-446655440008",
      "title": "Consider VM Right-Sizing",
      "description": "Based on usage patterns, 3 VMs can be downsized to reduce costs by 40%.",
      "confidence": 0.92,
      "category": "Cost Optimization",
      "recommendations": [
        "Resize VM from Standard_D4s to Standard_D2s",
        "Enable auto-scaling for variable workloads",
        "Consider reserved instances for predictable workloads"
      ],
      "generatedAt": "2026-06-15T10:30:00Z"
    }
  ],
  "summary": "Migration optimization opportunities identified.",
  "model": "gpt-4",
  "tokensUsed": 1500
}
```

**Validation Rules:**
- `context`: Required, valid context type (resource, migration, finding)
- `contextId`: Required, valid UUID
- `insightType`: Optional, valid type (optimization, risk, compliance, cost)

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 429: AI rate limit exceeded
- 500: Internal server error
- 503: AI service unavailable

**Performance Expectations:**
- Response time: < 5000ms (p95)

**Logging Requirements:**
- Log AI insight request
- Log AI model and tokens used
- Do NOT log AI response content

---

### POST /ai/query

**Description:** Query AI assistant with natural language

**Authentication Required:** Yes

**Request Headers:**
- `Authorization: Bearer {token}`
- `X-Tenant-ID: {tenantId}`

**Request Body:**
```json
{
  "query": "string",
  "context": "string",
  "contextId": "uuid",
  "conversationId": "uuid"
}
```

**Response Schema (200 OK):**
```json
{
  "response": "string",
  "conversationId": "uuid",
  "suggestions": ["string"],
  "sources": [
    {
      "type": "string",
      "id": "uuid",
      "name": "string"
    }
  ],
  "model": "gpt-4",
  "tokensUsed": 500
}
```

**Example Request:**
```json
POST /api/v1/ai/query
{
  "query": "What are the main risks for my ERP migration?",
  "context": "migration",
  "contextId": "220e8400-e29b-41d4-a716-446655440007",
  "conversationId": null
}
```

**Example Response (200 OK):**
```json
{
  "response": "Based on your ERP migration analysis, the main risks are: 1) Database compatibility issues with SQL Server 2019, 2) Custom application dependencies that may not be supported in Azure, 3) Network latency for real-time data sync. I recommend reviewing the validation findings for detailed remediation steps.",
  "conversationId": "440e8400-e29b-41d4-a716-446655440009",
  "suggestions": [
    "Show me the database validation findings",
    "What are the recommended remediation steps?",
    "Compare this migration to similar successful migrations"
  ],
  "sources": [
    {
      "type": "migration",
      "id": "220e8400-e29b-41d4-a716-446655440007",
      "name": "ERP System Upgrade"
    }
  ],
  "model": "gpt-4",
  "tokensUsed": 500
}
```

**Validation Rules:**
- `query`: Required, 1-2000 characters
- `context`: Optional, valid context type
- `contextId`: Optional, valid UUID
- `conversationId`: Optional, valid UUID (null for new conversation)

**Error Codes:**
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden
- 429: AI rate limit exceeded
- 500: Internal server error
- 503: AI service unavailable

**Performance Expectations:**
- Response time: < 10000ms (p95)

**Logging Requirements:**
- Log AI query
- Log AI model and tokens used
- Do NOT log query content or response content

---

## Rate Limiting

| Endpoint Category | Rate Limit | Window |
|-------------------|------------|--------|
| Authentication | 10 requests | 1 minute |
| CRUD Operations | 100 requests | 1 minute |
| Scan Operations | 5 requests | 1 minute |
| Validation Operations | 10 requests | 1 minute |
| AI Operations | 20 requests | 1 minute |
| Report Generation | 5 requests | 1 minute |

---

## Versioning Strategy

- API version in URL path: `/api/v1/`
- Breaking changes require new version
- Non-breaking changes can be added to current version
- Deprecated endpoints return Sunset header
- Minimum support period: 6 months for deprecated endpoints
