# 04 — Deployment Implementation

## Dockerfile

File: `Dockerfile` — Multi-stage build with 2 stages.

### Stage 1: Builder

```dockerfile
FROM python:3.11-slim as builder
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir --user -r requirements.txt
```

- Base image: `python:3.11-slim`
- Installs build tools (`build-essential`, `libpq-dev`) required for compiling `psycopg2-binary`
- Installs Python packages to `--user` directory (`/root/.local`)

### Stage 2: Final

```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app
EXPOSE 8000
CMD ["uvicorn", "app.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- Base image: `python:3.11-slim` (same version, minimal)
- Runtime dependency: `libpq5` only (no build tools)
- Copies installed packages from builder stage
- Sets `PYTHONPATH=/app` so `app.*` imports resolve
- Exposes port `8000`
- Default command: `uvicorn app.api.main:app`

## Docker Compose

File: `docker/docker-compose.yml`

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ${DB_USER:-engine}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-engine}
      POSTGRES_DB: ${DB_NAME:-migration_engine}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  engine:
    build:
      context: ..
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://${DB_USER:-engine}:${DB_PASSWORD:-engine}@postgres:5432/${DB_NAME:-migration_engine}
      - FERNET_KEY=${FERNET_KEY}
    ports:
      - "8000:8000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Container Layout

| Service | Image/Build | Port | Purpose |
|---------|------------|------|---------|
| `postgres` | `postgres:15` | 5432 | PostgreSQL database |
| `engine` | Built from `Dockerfile` | 8000 | FastAPI application |

## Startup Order

The `engine` service declares `depends_on: postgres`, ensuring PostgreSQL starts before the engine container. The readiness check (`GET /api/v1/ready`) performs a `SELECT 1` against the database (`app/api/main.py:123-140`) to confirm connectivity at the application level.

## Exposed Ports

| Port | Service | Host Mapping |
|------|---------|-------------|
| 5432 | `postgres` | `5432:5432` |
| 8000 | `engine` | `8000:8000` |

## Mounted Volumes

| Volume | Container Path | Purpose |
|--------|---------------|---------|
| `postgres_data` | `/var/lib/postgresql/data` | Persistent PostgreSQL data |

## Environment Variables

### postgres service

| Variable | Default | Source |
|----------|---------|--------|
| `POSTGRES_USER` | `engine` | `${DB_USER:-engine}` |
| `POSTGRES_PASSWORD` | `engine` | `${DB_PASSWORD:-engine}` |
| `POSTGRES_DB` | `migration_engine` | `${DB_NAME:-migration_engine}` |

### engine service

| Variable | Default | Source |
|----------|---------|--------|
| `DATABASE_URL` | Composed from DB_USER/DB_PASSWORD/DB_NAME | docker-compose interpolation |
| `FERNET_KEY` | (required) | `${FERNET_KEY}` — used for credential encryption (`app/api/core/encryption_manager.py`) |

## Application-Level Environment Variables (`.env`)

File: `.env`

| Variable | Value | Purpose |
|----------|-------|---------|
| `JWT_SECRET_KEY` | `REDACTED` | JWT signing key |
| `APP_ADMIN_USER` | `admin@mapnexus.com` | Admin credentials |
| `APP_ADMIN_PASS` | `********` | Admin credentials |
| `ENGINE_DB_HOST` | `localhost` | Engine DB host |
| `ENGINE_DB_PORT` | `5432` | Engine DB port |
| `ENGINE_DB_NAME` | `migration_engine` | Engine DB name |
| `ENGINE_DB_USER` | `postgres` | Engine DB user |
| `ENGINE_DB_PASS` | `********` | Engine DB password |
| `FERNET_KEY` | `REDACTED` | Fernet encryption key |
