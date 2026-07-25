# 17. Logging, Monitoring & Diagnostics Architecture

## Overview

Implemented logging, monitoring, audit, diagnostics, and log sanitization features in the MAP Nexus platform.

---

## 1. Logging System

### Custom Logger Implementation
**File**: `app/utils/logger.py`

#### Custom AUDIT Log Level
- **Level Number**: 25 (between INFO=20 and WARNING=30)
- **Registration**: `logging.addLevelName(AUDIT_LEVEL, "AUDIT")` (`app/utils/logger.py:8-9`)
- **Method**: `logging.Logger.audit = audit` (`app/utils/logger.py:17`)

#### Logger Configuration (`get_logger()`)
**File**: `app/utils/logger.py:120-158`

| Handler | Level | Output | Filter |
|---------|-------|--------|--------|
| `console_handler` | INFO | `sys.stdout` | `ConsoleProgressFilter` |
| `exec_handler` | DEBUG | `exports/execution.log` | None |
| `audit_handler` | AUDIT (25) | `exports/audit.log` | Level == 25 only |

#### Formatters

| Formatter | Format | Used By |
|-----------|--------|---------|
| `PhasedFormatter` | `%(asctime)s \| %(levelname)s \| %(name)s \| %(message)s` | Console, Execution log |
| Audit Formatter | `%(asctime)s \| %(levelname)s \| %(message)s` | Audit log |

#### Console Progress Filter
**File**: `app/utils/logger.py:52-76`

- Filters INFO-level messages, showing only:
  - Messages starting with `[STEP `
  - Progress indicators (`Active Systems:`, `System:`, `Connection:`, etc.)
  - Control execution progress (`[CONTROL `, `Evaluating `, etc.)
  - Warnings and above

#### Indentation Context
**File**: `app/utils/logger.py:32-49`

- Thread-local indentation level for phased execution output
- Methods: `set_indent()`, `increment()`, `decrement()`
- Used by `ExecutionEngine` for hierarchical log output

---

## 2. Monitoring (Health Endpoints)

### Health Check Endpoints
**File**: `app/api/main.py:111-140`

| Endpoint | Method | Rate Limit | Response |
|----------|--------|------------|----------|
| `/health` | GET | Exempt | `{"status": "healthy", "version": "2.0.0"}` |
| `/api/v1/health` | GET | Exempt | `{"status": "healthy", "version": "2.0.0"}` |
| `/api/v1/ready` | GET | Exempt | `{"status": "ready"\|"degraded", "checks": {...}}` |

### Readiness Check
**File**: `app/api/main.py:123-140`

```python
checks = {"database": False}
try:
    from app.db.connection import get_db_connection
    db = get_db_connection()
    with db.conn.cursor() as cur:
        cur.execute("SELECT 1")
    checks["database"] = True
except Exception as e:
    logger.error(f"Database health check failed: {e}")

healthy = all(checks.values())
return {"status": "ready" if healthy else "degraded", "checks": checks}
```

### Request Timing Middleware
**File**: `app/api/main.py:60-66`

- Adds `X-Response-Time` header to all responses
- Format: `{duration}ms`

---

## 3. Audit System

### Audit Middleware
**File**: `app/api/core/middleware/audit_middleware.py`

#### Implementation
```python
class AuditLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Extract user_id from JWT token
        # Log: AUDIT | {method} {path} | user={user_id} | status={status_code} | duration={duration}ms
```

#### Registration
**File**: `app/api/main.py:53-54`
```python
from app.api.core.middleware.audit_middleware import AuditLoggingMiddleware
app.add_middleware(AuditLoggingMiddleware)
```

### Audit Log Events
**File**: `exports/audit.log`

| Event | Source | Format |
|-------|--------|--------|
| `BATCH_STARTED` | `app/execution_engine.py:73-76` | `BATCH_STARTED \| Batch ID: {id} \| Project ID: {id} \| Status: IN_PROGRESS` |
| `MAPPING_RESOLVED` | `app/execution_engine.py:145-147` | `MAPPING_RESOLVED \| Source ID: {id} \| Target ID: {id} \| Outcome: SUCCESS` |
| `CONNECTION_RESOLVED` | `app/db/connection_resolver.py:247-251` | `CONNECTION_RESOLVED \| Role: {role} \| System: {type} ({host}) \| ID: {id} \| Outcome: SUCCESS` |
| `GOVERNANCE_DECISION` | `app/execution_engine.py:879-882` | `GOVERNANCE_DECISION \| Batch ID: {id} \| Decision: {status} \| Outcome: FINALIZED` |

---

## 4. Diagnostics (Execution Logs)

### Execution Log Output
**File**: `exports/execution.log`

- **Level**: DEBUG (captures all log messages)
- **Format**: `%(asctime)s | %(levelname)s | %(name)s | %(message)s`
- **Content**: Full execution trace including connection resolution, mapping, control execution, governance

### Execution Trace (In-Memory)
**File**: `app/execution_engine.py:53-54,939-990`

#### Trace Events
| Event | Payload | Source |
|-------|---------|--------|
| `CONTROL_START` | `{"control_id": id}` | `app/execution_engine.py:957-965` |
| `CONTROL_END` | `{"control_id": id, "status": status, "duration": duration}` | `app/execution_engine.py:967-979` |
| `DAG` events | `{"message": msg}` | `app/execution_engine.py:1037-1044` |

#### Trace Methods
- `_trace(event_type, payload)` — Central trace logger (`app/execution_engine.py:939-955`)
- `_trace_control_start(control_id)` — Start trace (`app/execution_engine.py:957-965`)
- `_trace_control_end(control_id, status, duration)` — End trace (`app/execution_engine.py:967-979`)
- `export_execution_trace()` — Export full trace (`app/execution_engine.py:981-990`)

### Control Execution Logging
**File**: `app/execution_engine.py:639-641`
```
CONTROL COMPLETE | {control_id} | status={final_status} | duration={duration}s
```

---

## 5. Log Sanitizer

### Implementation
**File**: `app/utils/sanitizer.py`

#### Sensitive Keys
```python
SENSITIVE_KEYS = {
    'password', 'pass', 'pwd', 'secret', 'key', 'token',
    'credential', 'fernet', 'authorization', 'api_key', 'api-key'
}
```

#### Sanitization Methods

| Method | Purpose | Input | Output |
|--------|---------|-------|--------|
| `sanitize(data)` | Recursively sanitize dicts, lists, strings | Any | Sanitized data |
| `sanitize_message(message)` | Sanitize log messages | `str` or `dict` | `str` |

#### Integration
**File**: `app/utils/logger.py:82`
```python
class PhasedFormatter(logging.Formatter):
    def format(self, record):
        record.msg = LogSanitizer.sanitize_message(record.msg)
        # ... rest of formatting
```

#### Sanitization Rules
1. **Dictionary keys**: Any key matching `SENSITIVE_KEYS` → value replaced with `[MASKED]`
2. **String patterns**: Regex replacement for `key=value` or `key:value` patterns → `[MASKED]`
3. **Nested structures**: Recursive processing of dicts and lists

---

## 6. Error Handling

### Global Exception Handler
**File**: `app/api/main.py:72-82`

```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={"success": False, "error": "Internal server error"})
```

### HTTP Error Handlers
**File**: `app/api/main.py:85-105`

| Status Code | Handler | Response |
|-------------|---------|----------|
| 404 | `not_found_handler` | `{"success": false, "error": "Resource not found"}` |
| 422 | `validation_error_handler` | `{"success": false, "error": "Validation error"}` |

---

## 7. Logging Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    Logging Sources                           │
├─────────────────────────────────────────────────────────────┤
│  AuditMiddleware        → audit.log (level 25)              │
│  ExecutionEngine        → execution.log (DEBUG)             │
│  ConnectionResolver     → execution.log (DEBUG)             │
│  All Python modules     → console (INFO)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Log Processing                            │
├─────────────────────────────────────────────────────────────┤
│  PhasedFormatter       → Format with timestamp, level, name │
│  ConsoleProgressFilter → Filter INFO for progress display   │
│  LogSanitizer          → Mask sensitive data                │
│  IndentContext         → Thread-local indentation           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Log Outputs                               │
├─────────────────────────────────────────────────────────────┤
│  Console (stdout)      → INFO level + progress              │
│  exports/execution.log → DEBUG level (all)                  │
│  exports/audit.log     → AUDIT level (25) only              │
└─────────────────────────────────────────────────────────────┘
```
