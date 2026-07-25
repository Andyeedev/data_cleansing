# 16. Configuration Architecture

## Overview

All configuration files used by the MAP Nexus platform, including backend, frontend, CI/CD, and infrastructure.

---

## 1. Main Application Config (`config.yaml`)

**File**: `config.yaml`

### Structure

```yaml
project_id: "ae40b96c-20da-4972-bb29-bff3c2451ae0"

database:              # Source database (legacy, partially used)
engine_db:             # Engine/platform database (PostgreSQL)
source_db:             # Migration source database
target_db:             # Migration target database

execution:             # Runtime execution settings
  environment: DEV
  client_name: DemoBank
  control_id: null

release_gate:          # Release gate configuration
  enabled: true
  block_on_status: ["FAIL", "BLOCKED", "ERROR"]
  minimum_score: 80
  enforcement_mode: "STRICT"

rules:                 # Control enable/disable flags
  C01: enabled
  C02: enabled
  ...

engine:                # Engine operational settings
  control_timeout_seconds: 300

control_dependencies:  # DAG dependency graph
  C02: [C01]
  C09: [C03]

encryption_keys:       # Fernet key references
  env-key-1: "YOUR_FERNET_BASE64_KEY_HERE"
```

### Environment Variable Expansion
- **Pattern**: `${VAR:-default}` syntax
- **Loader**: `app/config_loader.py:15-20`
- **Example**: `${ENGINE_DB_HOST:-localhost}` resolves to `localhost` if `ENGINE_DB_HOST` not set

---

## 2. Backend Environment Variables (`.env`)

**File**: `.env.example`

### Required Variables

| Variable | Purpose | Loaded By |
|----------|---------|-----------|
| `JWT_SECRET_KEY` | JWT token signing | `app/api/core/auth/jwt_config.py:15` |
| `FERNET_KEY` | Fernet encryption | `app/api/core/encryption_manager.py:9` |
| `ENGINE_DB_HOST` | Engine DB host | `config.yaml` via `${ENGINE_DB_HOST:-localhost}` |
| `ENGINE_DB_PORT` | Engine DB port | `config.yaml` via `${ENGINE_DB_PORT:-5432}` |
| `ENGINE_DB_NAME` | Engine DB name | `config.yaml` via `${ENGINE_DB_NAME:-migration_engine}` |
| `ENGINE_DB_USER` | Engine DB user | `config.yaml` via `${ENGINE_DB_USER:-postgres}` |
| `ENGINE_DB_PASS` | Engine DB password | `config.yaml` via `${ENGINE_DB_PASS:-********}` |
| `APP_ADMIN_USER` | Admin username | `app/services/auth_service.py:18` |
| `APP_ADMIN_PASS` | Admin password | `app/services/auth_service.py:18` |

### Loading Mechanism
- **Library**: `python-dotenv`
- **Entry Points**:
  - `app/api/core/config.py:10` — `load_dotenv(BASE_DIR / ".env")`
  - `app/api/core/auth/jwt_config.py:6-7` — `load_dotenv(dotenv_path=env_path)`
  - `app/main.py:3` — `load_dotenv()`

---

## 3. Frontend Environment Variables (Vite)

**File**: `MAP_V2/03_Source/frontend/.env`

### Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |
| `VITE_API_VERSION` | `v1` | API version prefix |
| `VITE_APP_NAME` | `MAP Nexus` | Application display name |
| `VITE_APP_VERSION` | `2.0.0` | Application version |
| `VITE_AUTH_REDIRECT_URI` | `http://localhost:5173/auth/callback` | OAuth redirect URI |
| `VITE_ENABLE_ANALYTICS` | `false` | Analytics feature flag |
| `VITE_ENABLE_DEBUG_MODE` | `true` | Debug mode feature flag |

### Vite Config
**File**: `MAP_V2/03_Source/frontend/vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

- **Proxy**: `/api` requests forwarded to `http://localhost:8000`
- **Plugins**: React, Tailwind CSS

---

## 4. TypeScript Configuration

### Root Config
**File**: `MAP_V2/03_Source/frontend/tsconfig.json`

- References `tsconfig.app.json` and `tsconfig.node.json`

### App Config
**File**: `MAP_V2/03_Source/frontend/tsconfig.app.json`

| Option | Value |
|--------|-------|
| `target` | `es2023` |
| `lib` | `["ES2023", "DOM"]` |
| `module` | `esnext` |
| `moduleResolution` | `bundler` |
| `jsx` | `react-jsx` |
| `noEmit` | `true` |
| `noUnusedLocals` | `true` |
| `noUnusedParameters` | `true` |
| `verbatimModuleSyntax` | `true` |

---

## 5. Vite Configuration

**File**: `MAP_V2/03_Source/frontend/vite.config.ts`

- **React Plugin**: `@vitejs/plugin-react`
- **Tailwind Plugin**: `@tailwindcss/vite`
- **Dev Server Proxy**: `/api` → `http://localhost:8000`
- **Build Command**: `tsc -b && vite build` (from `package.json:9`)

---

## 6. GitHub Actions Config

**File**: `.github/workflows/ci.yml`

### Pipeline Configuration

| Setting | Value |
|---------|-------|
| Trigger (push) | `main`, `MAP_V2_Development` |
| Trigger (PR) | `main` |
| Runner | `ubuntu-latest` |
| Python Version (lint) | 3.12 |
| Python Version (test) | 3.12 |
| Linter | ruff |
| Test Framework | pytest |
| Postgres Service | `postgres:16` |

### Test Environment Variables

| Variable | Value |
|----------|-------|
| `ENGINE_DB_HOST` | `localhost` |
| `ENGINE_DB_PORT` | `5432` |
| `ENGINE_DB_NAME` | `migration_engine` |
| `ENGINE_DB_USER` | `postgres` |
| `ENGINE_DB_PASS` | `********` |
| `JWT_SECRET_KEY` | `REDACTED` |
| `APP_ADMIN_USER` | `admin@test.com` |
| `APP_ADMIN_PASS` | `********` |

---

## 7. Docker Compose Config

**File**: `docker/docker-compose.yml`

### Service Configuration

| Service | Image | Port | Environment |
|---------|-------|------|-------------|
| `postgres` | `postgres:15` | 5432 | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` |
| `engine` | Built from `Dockerfile` | 8000 | `DATABASE_URL`, `FERNET_KEY` |

### Volume
- `postgres_data` → `/var/lib/postgresql/data`

---

## 8. Flake8 Config

**File**: `.flake8`

Configuration for Python linting (not detailed in this document).

---

## 9. Configuration Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    Configuration Files                       │
├─────────────────────────────────────────────────────────────┤
│  .env                    → Backend secrets (JWT, DB, Fernet)│
│  config.yaml             → Application config (DB, rules,   │
│                             DAG, release gate)               │
│  MAP_V2/.../frontend/.env → Frontend config (API URL, flags)│
│  MAP_V2/.../vite.config.ts → Vite build config              │
│  MAP_V2/.../tsconfig.json → TypeScript config               │
│  .github/workflows/ci.yml → CI/CD pipeline config           │
│  docker/docker-compose.yml → Docker services config         │
│  deploy/azure/main.tf     → Azure infrastructure config     │
│  .flake8                  → Python linter config             │
└─────────────────────────────────────────────────────────────┘
```

### Loading Order
1. `.env` loaded by `python-dotenv` at import time
2. `config.yaml` loaded by `app/config_loader.py` with `${VAR:-default}` expansion
3. Frontend `.env` loaded by Vite at build/dev time
4. `vite.config.ts` loaded by Vite
5. `tsconfig.json` loaded by TypeScript compiler
