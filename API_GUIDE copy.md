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
You must install the following missing dependencies (not yet in `requirements.txt`):
```bash
pip install fastapi uvicorn python-jose[cryptography] python-multipart
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

## 3. Planned Improvements (Roadmap)
The following steps are recommended to bring the API to industrial standards:

### Phase 1: Stability & Security
- [ ] **Dependency Fix:** Update `requirements.txt` with FastAPI and JWT libraries.
- [ ] **Credential Masking:** Ensure API responses mask database passwords (matching the new logger standard).
- [ ] **DB-Backed Auth:** Move from hardcoded `admin/admin` to a `platform_users` table with hashed passwords.

### Phase 2: Performance
- [ ] **Background Tasks:** Change `/execution/run` to return a `job_id` immediately and run the engine in the background (preventing HTTP timeouts).
- [ ] **Status Polling:** Add an endpoint to check the progress of a running `job_id`.

### Phase 3: Robustness
- [ ] **Input Validation:** Strengthen Pydantic models for all endpoints.
- [ ] **Global Error Handler:** Implement a centralized middleware to catch and sanitize all API exceptions.
- [ ] **Rate Limiting:** Protect execution endpoints from abuse.

---
*Note: This document was generated based on the analysis performed on June 13, 2026.*
