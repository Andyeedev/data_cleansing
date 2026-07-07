# 11 — API Architecture

**Document:** MAP MVP API Architecture
**Version:** 1.0
**Date:** June 2026
**Status:** Official

---

## 1. REST API Design

### Base URL
```
https://api.mapnexus.com/v1
```

### Authentication
- Bearer token (JWT from Entra ID)
- OAuth 2.0 / OpenID Connect

### API Versioning
- URL path versioning: `/v1/`, `/v2/`
- Header: `api-version: 1.0`

---

## 2. Core Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Initiate SSO login |
| POST | `/auth/logout` | End session |
| GET | `/auth/me` | Get current user |

### Tenants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tenants` | List tenants |
| GET | `/tenants/{id}` | Get tenant |
| POST | `/tenants` | Create tenant |
| PUT | `/tenants/{id}` | Update tenant |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscriptions` | List subscriptions |
| GET | `/subscriptions/{id}` | Get subscription |
| POST | `/subscriptions/connect` | Connect Azure subscription |
| DELETE | `/subscriptions/{id}` | Disconnect subscription |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/resources` | List resources |
| GET | `/resources/{id}` | Get resource |
| GET | `/resources/{id}/dependencies` | Get dependencies |
| POST | `/resources/scan` | Trigger resource scan |

### Migrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/migrations` | List migrations |
| GET | `/migrations/{id}` | Get migration |
| POST | `/migrations` | Create migration |
| PUT | `/migrations/{id}` | Update migration |
| DELETE | `/migrations/{id}` | Delete migration |

### Validation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/migrations/{id}/validations` | List validation runs |
| GET | `/validations/{id}` | Get validation run |
| POST | `/migrations/{id}/validate` | Start validation |
| GET | `/validations/{id}/findings` | Get validation findings |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports` | List reports |
| GET | `/reports/{id}` | Get report |
| POST | `/reports/generate` | Generate report |
| GET | `/reports/{id}/download` | Download report |

### Governance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/policies` | List policies |
| GET | `/policies/{id}` | Get policy |
| POST | `/policies` | Create policy |
| PUT | `/policies/{id}` | Update policy |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/insights` | Get AI insights |
| POST | `/ai/query` | Natural language query |

### Administration
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List users |
| PUT | `/admin/users/{id}` | Update user |
| GET | `/admin/settings` | Get settings |
| PUT | `/admin/settings` | Update settings |

---

## 3. Pagination

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 100
  }
}
```

### Query Parameters
- `page` — Page number (default: 1)
- `pageSize` — Items per page (default: 20, max: 100)
- `sortBy` — Sort field
- `sortOrder` — asc/desc

---

## 4. Filtering

```
GET /resources?type=Microsoft.Compute/virtualMachines&location=uksouth
GET /migrations?status=Validating&createdAfter=2026-01-01
```

---

## 5. Error Handling

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation checks failed",
    "details": [
      {
        "field": "subscriptionId",
        "message": "Subscription not found"
      }
    ],
    "traceId": "00-abc123-def456-00"
  }
}
```

### HTTP Status Codes
| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limited |
| 500 | Internal Server Error |

---

## 6. Rate Limiting

| Tier | Limit |
|------|-------|
| Free | 100 requests/minute |
| Standard | 1000 requests/minute |
| Enterprise | Custom |

---

## 7. OpenAPI Strategy

- Auto-generated from code (Swashbuckle)
- Published at `/swagger/v1/swagger.json`
- Developer portal via API Management
- Versioned with API

---

*End of API Architecture*
