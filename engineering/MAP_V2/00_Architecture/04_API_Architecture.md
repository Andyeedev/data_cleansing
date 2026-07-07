# MAP Nexus™ Enterprise Platform

## API Architecture

**Version:** 2.0

**Document:** 04_API_Architecture.md

**Status:** Draft 1.0

**Classification:** Internal Architecture

---

# Purpose

This document defines the API architecture for the MAP Nexus™ Enterprise Platform.

The API layer is the only supported communication mechanism between the Portal, backend business services, AI services and future external integrations.

The API architecture provides a secure, consistent and extensible interface while ensuring complete separation between presentation, business logic and data.

---

# API Vision

The MAP API Platform provides a unified REST-based interface through which all platform capabilities are exposed.

Every feature within MAP shall be accessible through published APIs.

The Portal consumes the same APIs as future mobile applications, partner integrations and AI services.

---

# API Principles

The API platform follows these principles.

## API First

Every business capability is exposed through an API.

No component bypasses the API layer.

---

## Stateless

Each API request contains all information required for processing.

Server-side session state is avoided wherever practical.

---

## Consistent

All APIs follow the same standards.

Naming

Authentication

Responses

Error handling

Pagination

Filtering

Sorting

---

## Secure

Every request is authenticated.

Every request is authorised.

Every request is auditable.

---

## Versioned

APIs remain backwards compatible.

Versioning prevents breaking existing clients.

---

# API Architecture

```
Presentation Layer

↓

REST API Gateway

↓

Business Services

↓

Repository Layer

↓

PostgreSQL
```

---

# API Gateway

The API Gateway provides:

Authentication

Authorisation

Routing

Request validation

Rate limiting (future)

Monitoring

Logging

Future API Management integration

---

# API Domains

APIs are organised around business capabilities.

---

## Operations APIs

```
/api/v1/migrations

/api/v1/validation

/api/v1/data-quality
```

---

## Governance APIs

```
/api/v1/governance

/api/v1/risk

/api/v1/audit
```

---

## Insights APIs

```
/api/v1/reports

/api/v1/dashboard

/api/v1/copilot
```

---

## Platform APIs

```
/api/v1/users

/api/v1/roles

/api/v1/admin

/api/v1/configuration
```

---

# REST Standards

HTTP Methods

GET

Retrieve information

POST

Create resources

PUT

Replace resources

PATCH

Partial update

DELETE

Remove resources

---

# Resource Naming

Resources use nouns.

Correct

```
/validation

/reports

/issues
```

Incorrect

```
/runValidation

/getReports
```

Actions belong inside business services.

---

# Response Format

Every response follows a common structure.

```json
{
  "success": true,
  "message": "Validation completed successfully.",
  "data": { },
  "metadata": { },
  "errors": [ ]
}
```

This structure remains consistent across all APIs.

---

# Error Responses

Standard HTTP status codes shall be used.

| Code | Meaning |
|------|----------|
|200|Success|
|201|Created|
|400|Bad Request|
|401|Unauthorised|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|500|Internal Error|

---

# Pagination

Collections support pagination.

Example

```
?page=1

&pageSize=50
```

---

# Sorting

```
?sort=name

?sort=createdDate
```

---

# Filtering

```
?status=Critical

?severity=High

?migrationId=100
```

Filters may be combined.

---

# Authentication

Authentication is handled by the Authentication Service.

Supported providers:

Microsoft Entra ID

Azure AD B2C

OAuth 2.0

JWT

Future SAML support.

---

# Authorisation

Role-based access controls determine access.

Example roles:

Executive

Programme Manager

Migration Lead

Auditor

Administrator

Each API validates permissions before execution.

---

# Audit

Every API call generates:

Timestamp

User

Operation

Resource

Duration

Result

Audit records are immutable.

---

# MAP Copilot Integration

MAP Copilot consumes the same APIs as the Portal.

Example

Portal

↓

REST API

↓

Validation Service

↓

Repository

MAP Copilot

↓

REST API

↓

Validation Service

↓

Repository

No direct database access is permitted.

---

# External Integration

Future integrations include:

Power BI

Microsoft Teams

Azure Logic Apps

Azure Data Factory

Partner Systems

Third-party Migration Tools

All integrations use published APIs.

---

# API Security

Security measures include:

HTTPS only

JWT validation

Role-based access

Input validation

Output encoding

Request logging

Rate limiting (future)

API throttling (future)

---

# API Documentation

Every published API shall include:

Endpoint

Description

Parameters

Request example

Response example

Status codes

Authentication requirements

Swagger/OpenAPI documentation shall be generated automatically.

---

# API Versioning

Current version:

```
/api/v1/
```

Future versions:

```
/api/v2/
```

Multiple versions may coexist.

Existing clients must continue functioning during upgrades.

---

# Performance Targets

Authentication

<200 ms

Standard GET

<500 ms

Dashboard APIs

<2 seconds

Report APIs

<5 seconds

Search

<1 second

---

# Future Enhancements

GraphQL support

WebSocket notifications

Streaming APIs

Bulk operations

Partner SDK

Public Developer Portal

API Marketplace

---

# Success Criteria

The API architecture is complete when:

• Every business capability is exposed through APIs.

• Naming standards are consistent.

• Authentication model is defined.

• Versioning strategy is documented.

• Error handling is standardised.

• Future integrations are supported.

---

# Related Documents

00_Master_Roadmap.md

01_Product_Architecture.md

02_Portal_Architecture.md

03_Backend_Architecture.md

05_Database_Architecture.md

06_AI_Architecture.md

07_Reporting_Architecture.md

08_Security_Architecture.md

09_Deployment_Architecture.md

10_Implementation_Roadmap.md