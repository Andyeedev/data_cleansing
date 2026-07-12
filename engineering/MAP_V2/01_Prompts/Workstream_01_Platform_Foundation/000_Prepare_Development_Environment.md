# MAP Nexus™ Enterprise Platform

# Prompt 000

## Prepare Development Environment

**Version:** 2.0

**Prompt ID:** 000

**Workstream:** Platform Foundation

**Status:** Approved

---

# Purpose

Prepare a complete local development environment for MAP Nexus™ Version 2.

This prompt creates the development workspace, installs required software, verifies dependencies, creates the project structure, and ensures the environment is ready before any application code is written.

This prompt MUST be executed before Prompt 001.

---

# Objective

Produce a repeatable, enterprise-grade development environment.

Every developer must be able to run this prompt and obtain an identical working environment.

---

# Operating System

Primary

Windows 11 Professional

Secondary

Windows 10

Future

Linux

macOS

---

# Required Software

Verify installation of

• Visual Studio Code

• Git

• Node.js LTS

• npm

• Python 3.12+

• pip

• Google Chrome

Display installed versions.

---

# Install if Missing

Automatically recommend installation of

Node.js LTS

Git

Python

Visual Studio Code

Do not proceed until all mandatory software is installed and meets the minimum supported version requirements.
---

# Verify Versions

Minimum versions

Node.js

22 LTS or newer

npm

10+

Python

3.12+

Git

2.45+

VS Code

Latest Stable

---

# Create Project Structure

Create

```
MAP_V2/

│

├──00_Architecture/

├──01_Prompts/

├──02_Output/

├──03_Source/

│      frontend/

│      backend/

│      database/

│      shared/

│

├──04_Testing/

├──05_Releases/

├──06_Design_System/

├──07_Documentation/

├──08_Scripts/

├──09_Tools/

└──README.md
```

---

# Initialise Git

Within

```
MAP_V2
```

Execute

```
git init
```

Create

```
.gitignore
```

Include

```
node_modules/

dist/

build/

.env

.env.*

coverage/

__pycache__/

*.pyc

.vscode/settings.json

.idea/

*.log

Thumbs.db

.DS_Store
```

---

# Initialise Frontend

Navigate to

```
03_Source/frontend
```

Create React application using

Vite

React

TypeScript

Recommended command

```
npm create vite@latest
```

Configuration

Framework

React

Variant

TypeScript

---

# Install Frontend Packages

Install

```
react-router-dom

axios

@tanstack/react-query

react-hook-form

zod

lucide-react

recharts

ag-grid-react

ag-grid-community

react-toastify
```

Do NOT install premium packages.

---

# Initialise Backend

Navigate to

```
03_Source/backend
```

Create

```
app/

api/

core/

models/

services/

repositories/

routers/

middleware/

utils/

tests/

main.py

requirements.txt
```

---

# Python Virtual Environment

Create

```
.venv
```

Activate virtual environment.

---

# Backend Packages

Install

```
fastapi

uvicorn

sqlalchemy

psycopg

alembic

pydantic

python-dotenv

httpx

pytest
```

Update

```
requirements.txt
```

---

# Database

Create

```
03_Source/database/

schema/

migrations/

seed/

scripts/
```

Do NOT install PostgreSQL yet.

Database installation occurs in later prompts.

---

# Shared Folder

Create

```
03_Source/shared/

constants/

types/

config/
```

---

# README

Generate

```
README.md
```

Include

Project Name

Purpose

Technology Stack

Folder Structure

Prerequisites

How to Start Development

Current Status

Version

---

# VS Code

Recommend extensions

```
Python

Pylance

ESLint

Prettier

GitLens

Docker

Thunder Client

React Snippets
```

---

# Environment Variables

Create

```
frontend/.env

backend/.env
```

Populate with placeholders only.

Do not include secrets.

---

# Validation

Verify

✓ Git initialised

✓ React created

✓ TypeScript configured

✓ Vite running

✓ Python environment created

✓ FastAPI structure created

✓ Folder structure complete

✓ Packages installed

✓ README created

---

# Deliverables

Generate

Development Environment

Git Repository

React Application

FastAPI Skeleton

Python Environment

Project Structure

README

Installation Report

---

# Produce

Create

```
000_Prepare_Development_Environment_Report.md
```

Include

Installed Software

Versions

Folder Structure

Packages Installed

Validation Results

Issues Found

Recommendations

Overall Status

Ready for Prompt 001

---

# Acceptance Criteria

✓ MAP_V2 structure created

✓ Git repository initialised

✓ React project created

✓ FastAPI backend scaffolded

✓ Python virtual environment created

✓ Shared folders created

✓ README completed

✓ All mandatory software verified

✓ Environment successfully validated

✓ Ready for Prompt 001

---

# Future Integration

This environment has been prepared for

• Microsoft Azure

• Azure App Service

• Azure Container Apps

• Azure Database for PostgreSQL

• Azure OpenAI

• Microsoft Entra ID

• GitHub Actions

• Docker

No cloud resources are deployed during this prompt.

This prompt prepares the local development environment only.