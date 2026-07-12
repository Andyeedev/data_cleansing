# MAP Nexus™ Version 2

## Purpose

MAP Nexus™ is an enterprise-grade financial services migration and validation platform. Version 2 represents a complete rebuild with modern technologies and cloud-native architecture.

## Technology Stack

### Frontend
- React 19+ with TypeScript
- Vite (Build tool)
- React Router (Navigation)
- TanStack React Query (Data fetching)
- React Hook Form + Zod (Form management & validation)
- Recharts (Charts)
- AG Grid (Data grids)
- Lucide React (Icons)

### Backend
- Python 3.12+
- FastAPI (Web framework)
- SQLAlchemy (ORM)
- Alembic (Database migrations)
- Pydantic (Data validation)
- PostgreSQL (Database)

### Infrastructure
- Microsoft Azure (Cloud platform)
- Azure App Service / Container Apps
- Azure Database for PostgreSQL
- Microsoft Entra ID (Authentication)
- GitHub Actions (CI/CD)
- Docker (Containerization)

## Folder Structure

```
MAP_V2/
├── 00_Architecture/        # Architecture documents and diagrams
├── 01_Prompts/             # Development prompts and instructions
├── 02_Output/              # Generated outputs and reports
├── 03_Source/              # Application source code
│   ├── frontend/           # React + TypeScript application
│   ├── backend/            # FastAPI Python application
│   ├── database/           # Database schemas, migrations, seeds
│   └── shared/             # Shared constants, types, config
├── 04_Testing/             # Test plans and test cases
├── 05_Releases/            # Release notes and changelogs
├── 06_Design_System/       # UI/UX design system assets
├── 07_Documentation/       # Project documentation
├── 08_Scripts/             # Utility and automation scripts
├── 09_Tools/               # Development tools and utilities
└── README.md               # This file
```

## Prerequisites

- Node.js 22 LTS or newer
- npm 10+
- Python 3.12+
- Git 2.45+
- Visual Studio Code (recommended)

## How to Start Development

### Frontend

```bash
cd 03_Source/frontend
npm install
npm run dev
```

### Backend

```bash
cd 03_Source/backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

## Current Status

**Version:** 2.0.0  
**Status:** In Development  
**Phase:** Environment Setup Complete

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 2.0.0 | 2026-07-08 | Initial development environment setup |

---

*MAP Nexus™ Enterprise Platform*
