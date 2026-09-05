# 13. Technology Architecture

## Overview

Inventory of all technologies, frameworks, libraries, and tools used in the MAP Nexus platform with version information where available.

---

## 1. Languages

| Language | Version | Location |
|----------|---------|----------|
| Python | 3.11 (Dockerfile), 3.12 (CI/CD) | `Dockerfile:2,18`, `.github/workflows/ci.yml:17` |
| TypeScript | ~6.0.2 | `MAP_V2/03_Source/frontend/package.json:34` |
| SQL | PostgreSQL dialect | `app/db/sql/`, `dashboard/Execution Dashboard Query/` |
| Terraform | HCL | `deploy/azure/main.tf` |
| YAML | 1.2 | `config.yaml`, `docker/docker-compose.yml` |

---

## 2. Backend Frameworks

| Framework | Purpose | File |
|-----------|---------|------|
| FastAPI | REST API framework | `app/api/main.py:1` |
| Uvicorn | ASGI server | `app/api/main.py:1` |
| Pydantic | Request/response validation | `app/api/routes/auth_routes.py:3` |
| slowapi | Rate limiting | `app/api/main.py:6-7` |

---

## 3. Backend Libraries

| Library | Purpose | File |
|---------|---------|------|
| `psycopg2-binary` | PostgreSQL adapter | `requirements.txt:1` |
| `PyYAML` | YAML config parsing | `requirements.txt:2` |
| `python-dotenv` | `.env` file loading | `requirements.txt:3` |
| `pytest` | Testing framework | `requirements.txt:4` |
| `pandas` | Data manipulation | `requirements.txt:5` |
| `reportlab` | PDF generation | `requirements.txt:6` |
| `fastapi` | Web framework | `requirements.txt:7` |
| `uvicorn` | ASGI server | `requirements.txt:8` |
| `python-jose[cryptography]` | JWT encoding/decoding | `requirements.txt:9` |
| `python-multipart` | Form data parsing | `requirements.txt:10` |
| `passlib` | Password hashing (bcrypt) | `app/services/auth_service.py:4` |
| `cryptography` | Fernet encryption | `app/security/crypto.py:2` |
| `slowapi` | Rate limiting | `app/api/main.py:6` |

---

## 4. Frontend Libraries

### Core Dependencies (`MAP_V2/03_Source/frontend/package.json`)

| Library | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.7 | UI framework |
| `react-dom` | ^19.2.7 | DOM rendering |
| `react-router-dom` | ^7.18.1 | Client-side routing |
| `@tanstack/react-query` | ^5.101.2 | Server state management |
| `axios` | ^1.18.1 | HTTP client |
| `ag-grid-community` | ^36.0.0 | Data grid |
| `ag-grid-react` | ^36.0.0 | React data grid |
| `recharts` | ^3.9.2 | Charts/visualization |
| `react-hook-form` | ^7.81.0 | Form management |
| `react-toastify` | ^11.1.0 | Toast notifications |
| `lucide-react` | ^1.23.0 | Icon library |
| `zod` | ^4.4.3 | Schema validation |

### Dev Dependencies (`MAP_V2/03_Source/frontend/package.json`)

| Library | Version | Purpose |
|---------|---------|---------|
| `typescript` | ~6.0.2 | Type checking |
| `vite` | ^8.1.1 | Build tool |
| `@vitejs/plugin-react` | ^6.0.3 | React Vite plugin |
| `tailwindcss` | ^4.3.2 | CSS framework |
| `@tailwindcss/vite` | ^4.3.2 | Tailwind Vite plugin |
| `oxlint` | ^1.71.0 | Linter |
| `@types/node` | ^24.13.2 | Node.js types |
| `@types/react` | ^19.2.17 | React types |
| `@types/react-dom` | ^19.2.3 | React DOM types |

---

## 5. Database

| Database | Version | Usage |
|----------|---------|-------|
| PostgreSQL | 15 | Primary database (Docker Compose) |
| PostgreSQL | 16 | CI/CD test database |
| PostgreSQL | 15 | Azure Flexible Server (Terraform) |

### Supported Database Adapters
**File**: `app/db/connection_factory.py`

| Adapter | Class | File |
|---------|-------|------|
| PostgreSQL | `PostgresAdapter` | `app/db/adapters/postgres_adapter.py` |
| MySQL | `MySQLAdapter` | `app/db/adapters/mysql_adapter.py` |
| SQL Server | `SQLServerAdapter` | `app/db/adapters/sqlserver_adapter.py` |
| Snowflake | `SnowflakeAdapter` | `app/db/adapters/snowflake_adapter.py` |
| BigQuery | `BigQueryAdapter` | `app/db/adapters/bigquery_adapter.py` |
| Oracle | `OracleAdapter` | `app/db/adapters/oracle_adapter.py` |
| Databricks | `DatabricksAdapter` | `app/db/adapters/odatabricks_adapter.py` |

---

## 6. Build Tools

| Tool | Version | Purpose | File |
|------|---------|---------|------|
| Vite | ^8.1.1 | Frontend build | `MAP_V2/03_Source/frontend/package.json:35` |
| TypeScript | ~6.0.2 | Type compilation | `MAP_V2/03_Source/frontend/package.json:34` |
| pip | — | Python package manager | `requirements.txt` |
| npm | — | Node.js package manager | `MAP_V2/03_Source/frontend/package-lock.json` |

---

## 7. Testing

| Tool | Purpose | File |
|------|---------|------|
| pytest | Python testing | `requirements.txt:4`, `.github/workflows/ci.yml:61` |
| ruff | Python linting | `.github/workflows/ci.yml:20-22` |
| oxlint | TypeScript linting | `MAP_V2/03_Source/frontend/package.json:32` |

---

## 8. CI/CD

| Tool | Purpose | File |
|------|---------|------|
| GitHub Actions | CI/CD pipeline | `.github/workflows/ci.yml` |
| Docker | Containerization | `Dockerfile`, `docker/docker-compose.yml` |
| Terraform | Infrastructure as Code | `deploy/azure/main.tf` |

---

## 9. Technology Stack Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                        │
│  React 19.2.7 + TypeScript 6.0.2 + Vite 8.1.1          │
│  Tailwind CSS 4.3.2 + Recharts 3.9.2 + AG Grid 36.0   │
│  React Router 7.18.1 + React Query 5.101.2              │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
│  Python 3.11 + FastAPI + Uvicorn                        │
│  psycopg2 + PyYAML + passlib + jose + cryptography      │
│  slowapi (rate limiting)                                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  PostgreSQL 15 (primary)                                │
│  Multi-database adapters (Postgres, MySQL, SQL Server,  │
│  Snowflake, BigQuery, Oracle, Databricks)               │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Infrastructure                        │
│  Docker + Docker Compose + GitHub Actions               │
│  Azure Container Apps + PostgreSQL Flexible Server      │
└─────────────────────────────────────────────────────────┘
```
