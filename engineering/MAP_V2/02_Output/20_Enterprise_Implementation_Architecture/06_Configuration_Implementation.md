# 06 — Configuration Implementation

## Configuration Hierarchy

Configuration is resolved in the following priority order:

1. **Environment variables** (highest priority)
2. **`.env` files** (loaded via `python-dotenv`)
3. **`config.yaml`** (YAML with `${VAR:-default}` interpolation)
4. **Application defaults** (hardcoded fallbacks)

## config.yaml

File: `config.yaml` — Main application configuration.

### Structure

```yaml
project_id: "ae40b96c-20da-4972-bb29-bff3c2451ae0"

database:
  host: ${DB_HOST:-localhost}
  port: ${DB_PORT:-5432}
  dbname: ${DB_NAME:-postgres}
  user: ${DB_USER:-postgres}
  password: ${DB_PASS:-dev123456}

engine_db:
  host: ${ENGINE_DB_HOST:-localhost}
  port: ${ENGINE_DB_PORT:-5432}
  database: ${ENGINE_DB_NAME:-migration_engine}
  user: ${ENGINE_DB_USER:-postgres}
  password: ${ENGINE_DB_PASS:-dev123456}

source_db:
  type: postgres
  host: ${SOURCE_DB_HOST:-localhost}
  port: ${SOURCE_DB_PORT:-5432}
  database: ${SOURCE_DB_NAME:-migration_source}
  user: ${SOURCE_DB_USER:-postgres}
  password: ${SOURCE_DB_PASS:-dev123456}

target_db:
  host: ${TARGET_DB_HOST:-localhost}
  port: ${TARGET_DB_PORT:-5432}
  database: ${TARGET_DB_NAME:-migration_target}
  user: ${TARGET_DB_USER:-postgres}
  password: ${TARGET_DB_PASS:-dev123456}

execution:
  environment: DEV
  client_name: DemoBank
  control_id: null

release_gate:
  enabled: true
  block_on_status: ["FAIL", "BLOCKED", "ERROR"]
  minimum_score: 80
  enforcement_mode: "STRICT"

rules:
  C01: enabled
  C02: enabled
  C03: enabled
  C04: enabled
  C05: enabled
  C06: enabled
  C07: enabled
  C08: disabled
  C09: enabled
  C010: enabled

engine:
  control_timeout_seconds: 300

control_dependencies:
  C02:
    - C01
  C09:
    - C03

encryption_keys:
  env-key-1: "YOUR_FERNET_BASE64_KEY_HERE"
```

### Config Sections

| Section | Purpose | Source |
|---------|---------|--------|
| `project_id` | UUID identifying the active project | `config.yaml` |
| `database` | Legacy database connection | `config.yaml:3-8` |
| `engine_db` | Engine database connection | `config.yaml:11-16` |
| `source_db` | Source system database | `config.yaml:18-24` |
| `target_db` | Target system database | `config.yaml:26-31` |
| `execution` | Runtime execution settings | `config.yaml:33-36` |
| `release_gate` | Governance release gate configuration | `config.yaml:38-42` |
| `rules` | Control enable/disable flags | `config.yaml:44-56` |
| `engine` | Engine timeout settings | `config.yaml:74-75` |
| `control_dependencies` | DAG dependency graph | `config.yaml:84-91` |
| `encryption_keys` | Fernet key references | `config.yaml:92-93` |

### Environment Variable Interpolation

The `config_loader.py` (`app/config_loader.py:6-25`) uses regex pattern `\$\{(\w+)(?::-([^}]*))?\}` to expand `${VAR}` and `${VAR:-default}` syntax at load time.

## .env Files

### Backend `.env`

File: `.env`

| Variable | Value | Purpose |
|----------|-------|---------|
| `JWT_SECRET_KEY` | `REDACTED` | JWT token signing |
| `APP_ADMIN_USER` | `admin@mapnexus.com` | Admin login |
| `APP_ADMIN_PASS` | `********` | Admin password |
| `ENGINE_DB_HOST` | `localhost` | Engine DB host |
| `ENGINE_DB_PORT` | `5432` | Engine DB port |
| `ENGINE_DB_NAME` | `migration_engine` | Engine DB name |
| `ENGINE_DB_USER` | `postgres` | Engine DB user |
| `ENGINE_DB_PASS` | `********` | Engine DB password |
| `FERNET_KEY` | `REDACTED` | Fernet encryption key |

Loaded at startup via `load_dotenv()` in both `app/main.py:3` and `app/api/main.py:12`.

### Frontend `.env`

File: `MAP_V2/03_Source/frontend/.env`

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |
| `VITE_API_VERSION` | `v1` | API version prefix |
| `VITE_APP_NAME` | `MAP Nexus` | Application display name |
| `VITE_APP_VERSION` | `2.0.0` | Application version |
| `VITE_AUTH_REDIRECT_URI` | `http://localhost:5173/auth/callback` | OAuth redirect |
| `VITE_ENABLE_ANALYTICS` | `false` | Analytics feature flag |
| `VITE_ENABLE_DEBUG_MODE` | `true` | Debug mode flag |

Vite exposes these as `import.meta.env.VITE_*` at build time.

### Application Config Loader

File: `app/config_loader.py`

```python
def load_config(path):
    pattern = re.compile(r'\$\{(\w+)(?::-([^}]*))?\}')
    def replace_env(match):
        env_var = match.group(1)
        default = match.group(2)
        return os.getenv(env_var, default if default is not None else match.group(0))
    with open(path, "r") as f:
        content = f.read()
        content = pattern.sub(replace_env, content)
        return yaml.safe_load(content)
```

The loaded config is cached in `app/api/core/app_config.py:11`:

```python
CONFIG = load_config(str(CONFIG_PATH))
```

## Runtime Configuration

### Frontend Constants

File: `MAP_V2/03_Source/frontend/src/config/constants.ts`

| Constant | Value |
|----------|-------|
| `APP_NAME` | `MAP Nexus` |
| `APP_VERSION` | `2.0.0` |
| `API_TIMEOUT` | `30000` ms |
| `DEBOUNCE_DELAY` | `300` ms |
| `PAGINATION_DEFAULT_SIZE` | `25` |

### Storage Keys

| Key | Constant | Purpose |
|-----|----------|---------|
| `map_nexus_auth_token` | `STORAGE_KEYS.AUTH_TOKEN` | JWT access token |
| `map_nexus_refresh_token` | `STORAGE_KEYS.REFRESH_TOKEN` | Refresh token |
| `map_nexus_user_preferences` | `STORAGE_KEYS.USER_PREFERENCES` | User preferences |
| `map_nexus_theme` | `STORAGE_KEYS.THEME` | Theme selection |

## Feature Flags

Feature flags are stored in the database table `platform.feature_flags` (`MAP_V2/03_Source/database/create_platform_schema.sql:431-444`):

```sql
CREATE TABLE platform.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    key VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage NUMERIC(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);
```

Frontend feature flags (Vite env):

| Flag | Value | Purpose |
|------|-------|---------|
| `VITE_ENABLE_ANALYTICS` | `false` | Toggle analytics |
| `VITE_ENABLE_DEBUG_MODE` | `true` | Toggle debug features |

## Configuration Sources Summary

| Source | File | Format | Scope |
|--------|------|--------|-------|
| `config.yaml` | Project root | YAML | Engine runtime |
| `.env` | Project root | KEY=VALUE | Backend environment |
| `.env` | `MAP_V2/03_Source/frontend/` | KEY=VALUE | Frontend (Vite) |
| `constants.ts` | `frontend/src/config/` | TypeScript | Frontend constants |
| `routes.ts` | `frontend/src/config/` | TypeScript | Route definitions |
| `navigation.ts` | `frontend/src/config/` | TypeScript | Navigation structure |
| `theme.ts` | `frontend/src/config/` | TypeScript | Theme configuration |
| `platform.feature_flags` | Database | SQL | Runtime feature toggles |
