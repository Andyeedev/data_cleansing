# Migration Validation API Guide

## 1. Overview
The API is a **SaaS-ready FastAPI layer** built on top of the Migration Validation Engine. It allows users to manage systems, credentials, and trigger validation batches via HTTP.

### Current Features
- **JWT Authentication:** Secure login using `admin/admin` (hardcoded).
- **System Registry:** List, view, and create Source/Target systems.
- **Credential Management:** Securely register database credentials.
- **Engine Triggering:** Run the validation engine for a specific `project_id`.
- **Swagger Documentation:** Automatic interactive docs at `/docs`.

## 2. How to Run
### Prerequisites
You must install the following dependencies:
```bash
pip install -r requirements.txt
```

### Starting the API
From the project root:
```bash
uvicorn app.api.main:app --reload --port 8000
```

### Accessing Documentation
Open your browser to:
- **Interactive Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 3. Testing Endpoints
Use the following sample data to test the API. All endpoints (except Login) require a `Bearer <token>` in the Authorization header.

### A. Authentication
**POST** `/auth/login`
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "admin"
  }
  ```
- **Expected Result:**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer"
  }
  ```

### B. System Management
**POST** `/systems/`
- **Request Body:**
  ```json
  {
    "system_name": "FINANCE_PROD_SQL",
    "system_role": "SOURCE",
    "database_type": "SQLSERVER",
    "connection_config": {
      "host": "dev-sql-01",
      "port": 1433,
      "database": "prod_backup"
    }
  }
  ```
- **Expected Result:** Status `200 OK` with the created `system_id`.

**GET** `/systems/`
- **Expected Result:** A list of all registered systems and their IDs.

### C. Credential Management
**POST** `/credentials/`
- **Request Body:**
  ```json
  {
    "system_id": "UUID-FROM-SYSTEMS-GET",
    "username": "migration_svc",
    "password": "SecurePassword123!"
  }
  ```
- **Expected Result:** Status `200 OK`. Password will be encrypted internally.

### D. Execution & Monitoring
**POST** `/execution/run?project_id=ae40b96c-20da-4972-bb29-bff3c2451ae0`
- **Expected Result:**
  ```json
  {
    "message": "Migration execution triggered successfully in background",
    "batch_id": "97b47cd4...",
    "status_url": "/execution/status/97b47cd4..."
  }
  ```

**GET** `/execution/status/{batch_id}`
- **Expected Result (In Progress):**
  ```json
  {
    "batch_id": "97b47cd4...",
    "status": "RUNNING",
    "progress": "4/12",
    "total_controls": 12,
    "completed_controls": 4,
    "failed_controls": 0
  }
  ```

## 4. Improvements Log (Roadmap)

### Completed Tasks
- **Phase 2: Background Tasks & Polling** (June 13, 2026)
    - **Status:** COMPLETED ✅
    - **Summary:** Refactored `/execution/run` to return a `batch_id` immediately and execute the engine in the background. Added `/execution/status/{batch_id}` endpoint to track progress in real-time.
- **Phase 3: Dependency Management** (June 13, 2026)
    - **Status:** COMPLETED ✅
    - **Summary:** Updated `requirements.txt` with all FastAPI and JWT dependencies. Fixed `psycopg2` build error.

### Planned Improvements
The following steps are recommended to bring the API to industrial standards:

#### Phase 1: Security (Pending)
- [ ] **DB-Backed Auth:** Move from hardcoded `admin/admin` to a `platform_users` table with hashed passwords. Requires database schema design.
- [ ] **Credential Masking:** Ensure all API responses redact sensitive database details (already implemented in log files).

#### Phase 3: Robustness (Ongoing)
- [ ] **Input Validation:** Strengthen Pydantic models for all endpoints.
- [ ] **Global Error Handler:** Implement a centralized middleware to catch and sanitize all API exceptions.
- [ ] **Rate Limiting:** Protect execution endpoints from abuse.

---
*Note: This document was generated based on the analysis performed on June 13, 2026.*
