# 03 — Build Architecture

## Backend

### Python Packaging

The backend uses **no `pyproject.toml` and no `setup.py`**. Dependencies are managed entirely through a flat `requirements.txt` at the project root.

### requirements.txt

File: `requirements.txt` (10 dependencies, no version pinning)

```
psycopg2-binary
PyYAML
python-dotenv
pytest
pandas
reportlab
fastapi
uvicorn
python-jose[cryptography]
python-multipart
```

| Dependency | Purpose |
|------------|---------|
| `psycopg2-binary` | PostgreSQL adapter (used by `PostgresAdapter` in `app/db/adapters/postgres_adapter.py`) |
| `PyYAML` | YAML config parsing (`app/config_loader.py`) |
| `python-dotenv` | `.env` file loading (`app/main.py:3`, `app/api/main.py:12`) |
| `pytest` | Test framework |
| `pandas` | Data manipulation |
| `reportlab` | PDF report generation |
| `fastapi` | ASGI web framework (`app/api/main.py:1`) |
| `uvicorn` | ASGI server (`Dockerfile:37`) |
| `python-jose[cryptography]` | JWT token handling (`app/api/core/auth/jwt_handler.py`) |
| `python-multipart` | Form data parsing for FastAPI |

### Dependency Installation

```bash
pip install --no-cache-dir --user -r requirements.txt
```

This is executed in the Docker build stage (`Dockerfile:15`). Build dependencies (`build-essential`, `libpq-dev`) are installed in the builder stage and only runtime libraries (`libpq5`) are installed in the final stage.

## Frontend

### npm Package Management

File: `MAP_V2/03_Source/frontend/package.json`

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  }
}
```

A `package-lock.json` file is present for deterministic dependency resolution.

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.7 | UI framework |
| `react-dom` | ^19.2.7 | React DOM renderer |
| `react-router-dom` | ^7.18.1 | Client-side routing |
| `@tanstack/react-query` | ^5.101.2 | Server state management |
| `axios` | ^1.18.1 | HTTP client (used by interceptors) |
| `ag-grid-community` | ^36.0.0 | Data grid |
| `ag-grid-react` | ^36.0.0 | React data grid wrapper |
| `lucide-react` | ^1.23.0 | Icon library |
| `react-hook-form` | ^7.81.0 | Form management |
| `react-toastify` | ^11.1.0 | Toast notifications |
| `recharts` | ^3.9.2 | Charting library |
| `zod` | ^4.4.3 | Schema validation |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^8.1.1 | Build tool and dev server |
| `@vitejs/plugin-react` | ^6.0.3 | Vite React plugin |
| `typescript` | ~6.0.2 | TypeScript compiler |
| `tailwindcss` | ^4.3.2 | Utility-first CSS |
| `@tailwindcss/vite` | ^4.3.2 | Tailwind Vite integration |
| `oxlint` | ^1.71.0 | Linter |
| `@types/node` | ^24.13.2 | Node.js type definitions |
| `@types/react` | ^19.2.17 | React type definitions |
| `@types/react-dom` | ^19.2.3 | ReactDOM type definitions |

### Build Pipeline

```bash
npm run build    # runs: tsc -b && vite build
```

1. **TypeScript compilation** — `tsc -b` performs project-referenced type checking and emits declaration files
2. **Vite build** — produces optimized production bundle in `dist/`

### Build Output

The `dist/` directory contains the production-ready static assets served by the frontend hosting layer.

### Dev Server

```bash
npm run dev      # runs: vite (default port 5173)
```

The dev server is accessible at `http://localhost:5173`, which is whitelisted in the backend CORS configuration (`app/api/main.py:43`).

## Build Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `requirements.txt` | Project root | Python dependencies |
| `Dockerfile` | Project root | Multi-stage Docker build |
| `package.json` | `MAP_V2/03_Source/frontend/` | npm dependencies and scripts |
| `package-lock.json` | `MAP_V2/03_Source/frontend/` | Lockfile |
| `.env` | `MAP_V2/03_Source/frontend/` | Vite environment variables |
| `tsconfig.json` | `MAP_V2/03_Source/frontend/` | TypeScript configuration (inferred from `tsc -b` script) |
| `vite.config.ts` | `MAP_V2/03_Source/frontend/` | Vite configuration (inferred from `@vitejs/plugin-react` and `@tailwindcss/vite` dev deps) |
