# 11. Security Architecture

## Overview

The MAP Nexus security architecture implements JWT authentication, RBAC authorization, Fernet encryption, audit logging, and tenant isolation across the backend API and execution engine.

---

## 1. JWT Authentication

### Token Configuration
- **Algorithm**: HS256
- **Secret Source**: `JWT_SECRET_KEY` environment variable (loaded from `.env`)
- **Token Expiry**: 2 hours (set in `auth_service.py:45`)
- **Config File**: `app/api/core/auth/jwt_config.py:15-16`

### Token Creation
- **Endpoint**: `POST /api/v1/auth/login` (`app/api/routes/auth_routes.py:16-22`)
- **Rate Limit**: 5 requests/minute via `slowapi` (`app/api/routes/auth_routes.py:17`)
- **Password Verification**: bcrypt via `passlib.context.CryptContext` (`app/services/auth_service.py:8`)
- **Token Payload**: `sub` (user_id), `user` (email), `tenant_id`, `exp` (`app/services/auth_service.py:41-46`)

### Token Validation
- **Dependency Injection**: `get_current_user()` in `app/api/core/auth/dependencies.py:6-20`
- **Tenant-Aware Validation**: `get_current_user_with_tenant()` in `app/api/core/auth/dependencies.py:23-41`
- **Header Format**: `Authorization: Bearer <token>`

---

## 2. Role-Based Access Control (RBAC)

### Permission Model
- **Database Tables**: `platform.user_roles`, `platform.roles`, `platform.role_permissions`, `platform.permissions`
- **Permission Format**: `resource:action` (e.g., `systems:create`)
- **Wildcard Support**: `*:*` grants all permissions (`app/api/core/auth/rbac.py:31`)

### RBAC Functions
- **`require_permissions(*required)`**: Checks user has specific resource:action permissions (`app/api/core/auth/rbac.py:7-38`)
- **`require_role(*role_names)`**: Checks user has specific role names (`app/api/core/auth/rbac.py:41-64`)
- **Role Expiry**: Supports `expires_at` column for time-limited roles (`app/api/core/auth/rbac.py:23,55`)

### Query Structure
```sql
-- Permission check (rbac.py:16-24)
SELECT p.resource, p.action
FROM platform.user_roles ur
JOIN platform.roles r ON ur.role_id = r.id
JOIN platform.role_permissions rp ON r.id = rp.role_id
JOIN platform.permissions p ON rp.permission_id = p.id
WHERE ur.user_id = %s
AND r.status = 'active'
AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
```

---

## 3. Fernet Encryption (4 Implementations)

### Implementation 1: `app/security/crypto.py`
- **Class**: `CryptoManager`
- **Key Source**: Constructor parameter
- **Features**: Handles `memoryview` (BYTEA from Postgres), `str` (base64), `bytes`
- **Convenience Function**: `decrypt_password(encrypted_value, key)` (`app/security/crypto.py:37-38`)

### Implementation 2: `app/utils/encryption_utils.py`
- **Class**: `EncryptionUtils`
- **Static Methods**: `generate_key()`, `encrypt(password, key)`, `decrypt(token, key)`
- **Key Generation**: `Fernet.generate_key()` (`app/utils/encryption_utils.py:8`)

### Implementation 3: `app/api/core/security/encryption.py`
- **Class**: `EncryptionManager`
- **Key Source**: `FERNET_KEY` environment variable (`app/api/core/security/encryption.py:7-8`)
- **Features**: Handles `memoryview` conversion (`app/api/core/security/encryption.py:19-22`)

### Implementation 4: `app/api/core/encryption_manager.py`
- **Class**: `EncryptionManager`
- **Key Source**: `get_env("FERNET_KEY")` via `app/api/core/config.py` (`app/api/core/encryption_manager.py:9`)
- **Used By**: `ConnectionResolver._get_credentials()` for decrypting stored passwords (`app/db/connection_resolver.py:288`)

---

## 4. Middleware

### Audit Logging Middleware
- **File**: `app/api/core/middleware/audit_middleware.py`
- **Class**: `AuditLoggingMiddleware` (extends `BaseHTTPMiddleware`)
- **Logs**: HTTP method, path, user_id (extracted from JWT), status code, duration (ms)
- **Registration**: `app/api/main.py:53-54`

### Tenant Middleware
- **File**: `app/api/core/middleware/tenant_middleware.py`
- **Function**: `tenant_middleware(request, call_next)`
- **Extracts**: `tenant_id` from JWT payload, sets `request.state.tenant_id`
- **Registration**: Not currently registered in `app/api/main.py` (implemented but not active)

### CORS Middleware
- **Registration**: `app/api/main.py:41-47`
- **Allowed Origins**: `http://localhost:5173`, `http://localhost:3000`
- **Methods**: All (`*`)
- **Headers**: All (`*`)
- **Credentials**: Enabled

### Rate Limiting Middleware
- **Library**: `slowapi`
- **Key Function**: `get_remote_address` (IP-based)
- **Registration**: `app/api/main.py:31-35`

---

## 5. Audit Logging

### Custom AUDIT Log Level
- **Level**: 25 (between INFO=20 and WARNING=30)
- **File**: `app/utils/logger.py:8-9`
- **Method**: `logging.Logger.audit = audit` (`app/utils/logger.py:17`)

### Audit Log Output
- **File Handler**: `exports/audit.log` (`app/utils/logger.py:149`)
- **Filter**: Only level 25 (AUDIT) messages (`app/utils/logger.py:152`)
- **Format**: `%(asctime)s | %(levelname)s | %(message)s`

### Audit Events Logged
- `BATCH_STARTED` (`app/execution_engine.py:73-76`)
- `MAPPING_RESOLVED` (`app/execution_engine.py:145-147`)
- `CONNECTION_RESOLVED` (`app/db/connection_resolver.py:247-251`)
- `GOVERNANCE_DECISION` (`app/execution_engine.py:879-882`)

### Log Sanitization
- **File**: `app/utils/sanitizer.py`
- **Class**: `LogSanitizer`
- **Sensitive Keys**: `password`, `secret`, `key`, `token`, `credential`, `fernet`, `authorization`, `api_key`
- **Integration**: `PhasedFormatter.format()` calls `LogSanitizer.sanitize_message()` (`app/utils/logger.py:82`)

---

## 6. Tenant Isolation

### Implementation
- **Function**: `get_current_user_with_tenant()` (`app/api/core/auth/dependencies.py:23-41`)
- **Validation**: Raises `403` if `tenant_id` not in JWT payload (`app/api/core/auth/dependencies.py:36`)
- **Middleware**: `tenant_middleware` sets `request.state.tenant_id` (`app/api/core/middleware/tenant_middleware.py:13`)

### User Schema
- **Table**: `platform.users`
- **Columns**: `id`, `email`, `password_hash`, `tenant_id`, `status` (`app/services/auth_service.py:18-20`)

---

## 7. Secrets Handling

### Environment Variables (`.env`)
- **Template**: `.env.example` defines required variables
- **Required Variables**:
  - `JWT_SECRET_KEY` — JWT signing secret
  - `FERNET_KEY` — Fernet encryption key
  - `ENGINE_DB_HOST`, `ENGINE_DB_PORT`, `ENGINE_DB_NAME`, `ENGINE_DB_USER`, `ENGINE_DB_PASS`
  - `APP_ADMIN_USER`, `APP_ADMIN_PASS`
- **Loading**: `python-dotenv` via `load_dotenv()` in `app/api/core/config.py:10` and `app/api/core/auth/jwt_config.py:6-7`

### Config YAML Environment Expansion
- **File**: `config.yaml`
- **Pattern**: `${VAR:-default}` syntax
- **Loader**: `app/config_loader.py:15-20` — regex-based environment variable substitution

### `.gitignore` Exclusions
- `.env` files are excluded from version control (verified in `.gitignore`)

---

## 8. Password Security

### Hashing
- **Library**: `passlib.context.CryptContext`
- **Algorithm**: bcrypt
- **Implementation**: `app/services/auth_service.py:8,56`

### Rate Limiting
- **Login Endpoint**: 5 requests/minute per IP (`app/api/routes/auth_routes.py:17`)
- **Global Rate Limiter**: Registered on FastAPI app (`app/api/main.py:31-35`)

---

## Security Architecture Summary

| Component | Implementation | File |
|-----------|---------------|------|
| JWT Authentication | HS256, 2hr expiry | `app/api/core/auth/jwt_handler.py` |
| JWT Validation | `get_current_user()` | `app/api/core/auth/dependencies.py` |
| RBAC | `require_permissions()`, `require_role()` | `app/api/core/auth/rbac.py` |
| Password Hashing | bcrypt | `app/services/auth_service.py` |
| Fernet Encryption | 4 implementations | `app/security/crypto.py`, `app/utils/encryption_utils.py`, `app/api/core/security/encryption.py`, `app/api/core/encryption_manager.py` |
| Audit Middleware | Request logging | `app/api/core/middleware/audit_middleware.py` |
| Tenant Middleware | JWT tenant extraction | `app/api/core/middleware/tenant_middleware.py` |
| Audit Logging | Custom level 25 | `app/utils/logger.py` |
| Log Sanitization | Sensitive key masking | `app/utils/sanitizer.py` |
| Rate Limiting | slowapi (5/min login) | `app/api/routes/auth_routes.py` |
| CORS | localhost origins | `app/api/main.py` |
| Secrets | `.env` + YAML expansion | `.env.example`, `config.yaml`, `app/config_loader.py` |
