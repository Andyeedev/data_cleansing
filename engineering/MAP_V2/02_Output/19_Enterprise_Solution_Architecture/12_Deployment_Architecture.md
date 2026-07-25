# 12. Deployment Architecture

## Overview

The deployment architecture consists of Docker containerization, Docker Compose orchestration, GitHub Actions CI/CD, and an Azure Terraform template.

---

## 1. Dockerfile (Multi-Stage Build)

**File**: `Dockerfile`

### Build Stage
- **Base Image**: `python:3.11-slim`
- **Build Dependencies**: `build-essential`, `libpq-dev`
- **Package Install**: `pip install --no-cache-dir --user -r requirements.txt`

### Final Stage
- **Base Image**: `python:3.11-slim`
- **Runtime Dependencies**: `libpq5`
- **Working Directory**: `/app`
- **Python Path**: `ENV PYTHONPATH=/app`
- **Exposed Port**: 8000
- **Command**: `uvicorn app.api.main:app --host 0.0.0.0 --port 8000`

---

## 2. Docker Compose

**File**: `docker/docker-compose.yml`

### Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `postgres` | `postgres:15` | 5432 | Platform/engine database |
| `engine` | Built from `Dockerfile` | 8000 | FastAPI application |

### Configuration
- **Postgres Environment Variables**: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (defaults: `engine`/`engine`/`migration_engine`)
- **Engine Environment Variables**: `DATABASE_URL` (constructed from DB vars), `FERNET_KEY`
- **Volume**: `postgres_data` for data persistence
- **Dependency**: `engine` depends on `postgres`

---

## 3. GitHub Actions CI/CD

**File**: `.github/workflows/ci.yml`

### Pipeline Stages

| Stage | Runner | Dependencies | Actions |
|-------|--------|-------------|---------|
| `lint` | `ubuntu-latest` | None | `ruff check app/` |
| `test` | `ubuntu-latest` | `lint` | `pytest tests/ -v --tb=short` |
| `build` | `ubuntu-latest` | `test` | Build notification (no actual Docker build) |

### Trigger Branches
- **Push**: `main`, `MAP_V2_Development`
- **Pull Request**: `main`

### Test Environment
- **Postgres Service**: `postgres:16` with health checks
- **Environment Variables**: `ENGINE_DB_HOST`, `ENGINE_DB_PORT`, `ENGINE_DB_NAME`, `ENGINE_DB_USER`, `ENGINE_DB_PASS`, `JWT_SECRET_KEY`, `APP_ADMIN_USER`, `APP_ADMIN_PASS`

### Build Condition
- Only runs on `main` or `MAP_V2_Development` branches

---

## 4. Azure Terraform Template

**File**: `deploy/azure/main.tf`

### Resources

| Resource | Type | Configuration |
|----------|------|---------------|
| `rg-migration-validation` | Resource Group | East US |
| `psql-migration-engine` | PostgreSQL Flexible Server | v15, 32GB storage, GP_Standard_D2s_v3 |
| `cae-migration-engine` | Container App Environment | — |
| `ca-migration-engine-api` | Container App | 0.5 CPU, 1Gi memory, port 8000 |

### Container App Configuration
- **Image**: `migration-engine:latest` (from ACR)
- **Ingress**: External enabled, HTTPS required, port 8000
- **Traffic**: 100% to latest revision
- **Environment Variables**: `ENGINE_DB_HOST`, `ENGINE_DB_NAME`
- **Note**: Credentials should be pulled from Azure Key Vault (commented in template)

---

## 5. Environment Configuration

### Backend Environment Variables
**File**: `.env.example`

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET_KEY` | Yes | JWT signing secret |
| `APP_ADMIN_USER` | Yes | Admin username |
| `APP_ADMIN_PASS` | Yes | Admin password |
| `ENGINE_DB_HOST` | Yes | Engine DB host (default: localhost) |
| `ENGINE_DB_PORT` | Yes | Engine DB port (default: 5432) |
| `ENGINE_DB_NAME` | Yes | Engine DB name (default: migration_engine) |
| `ENGINE_DB_USER` | Yes | Engine DB user (default: postgres) |
| `ENGINE_DB_PASS` | Yes | Engine DB password |
| `FERNET_KEY` | Yes | Fernet encryption key |

### Frontend Environment Variables
**File**: `MAP_V2/03_Source/frontend/.env`

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `http://localhost:8000` |
| `VITE_API_VERSION` | `v1` |
| `VITE_APP_NAME` | `MAP Nexus` |
| `VITE_APP_VERSION` | `2.0.0` |
| `VITE_AUTH_REDIRECT_URI` | `http://localhost:5173/auth/callback` |
| `VITE_ENABLE_ANALYTICS` | `false` |
| `VITE_ENABLE_DEBUG_MODE` | `true` |

---

## 6. Startup Scripts

### Backend Entry Point
**File**: `app/main.py`

```
Commands:
  python -m app.main run --config config.yaml [--resume-batch BATCH_ID] [--recovery]
  python -m app.main discover --config config.yaml
  python -m app.main export --config config.yaml --batch-id BATCH_ID
```

### API Server
**File**: `app/api/main.py`

- **Framework**: FastAPI with uvicorn
- **Startup**: `uvicorn app.api.main:app`
- **Health Endpoints**: `/health`, `/api/v1/health`, `/api/v1/ready`

---

## 7. Deployment Architecture Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                           │
│  .github/workflows/ci.yml                                      │
│  lint (ruff) → test (pytest + postgres:16) → build notification│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Compose (Local)                       │
│  docker/docker-compose.yml                                      │
│  ┌──────────────┐     ┌──────────────────┐                     │
│  │ postgres:15  │◄────│ engine (Dockerfile)│                    │
│  │ port: 5432   │     │ port: 8000        │                    │
│  └──────────────┘     └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Azure (Terraform)                            │
│  deploy/azure/main.tf                                           │
│  ┌──────────────┐     ┌──────────────────────────────────────┐ │
│  │ PostgreSQL   │◄────│ Container App (ca-migration-engine) │ │
│  │ Flexible     │     │ 0.5 CPU, 1Gi RAM, port 8000          │ │
│  └──────────────┘     └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Deployment Notes

1. **No Kubernetes deployment** is implemented (Docker Compose and Azure Container Apps only)
2. **No Helm charts** exist in the repository
3. **No production secrets management** is implemented beyond `.env` files (Azure template references Key Vault in comments only)
4. **Frontend build** is configured via Vite (`npm run build`) but not included in CI/CD pipeline
5. **Database migrations** are managed via SQL dump files, not a migration framework
