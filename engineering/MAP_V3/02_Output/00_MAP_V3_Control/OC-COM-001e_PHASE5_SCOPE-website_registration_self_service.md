# OC-COM-001e Phase 5 — Website Registration & Self-Service Integration

**DATE:** 2026-09-15  
**STATUS:** PROPOSED (awaiting approval)  
**PREDECESSOR:** Phase 4 — Email Verification (APPROVED)  
**SPEC:** OC-COM-001e Identity & Access Lifecycle (Corrected)

---

## Phase 5 Authorised Scope

Implement the **Website Registration Integration** and **Self-Service Registration**:

### 1. Website Registration Integration (mapnexus.co.uk → Platform)

**Backend API:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/public/register` | Public | Submit registration from mapnexus.co.uk |
| `GET` | `/api/v1/public/plans` | Public | List available plans (for pricing page) |
| `GET` | `/api/v1/admin/registrations` | Super Admin | List pending website registrations |
| `POST` | `/api/v1/admin/registrations/{id}/convert` | Super Admin | Convert lead to tenant |

**Database:**
- Table: `platform.website_registrations` (registration_id, email, company_name, first_name, last_name, phone, message, plan_interest, status, converted_to_tenant, converted_at, created_at)

**Frontend Pages:**
| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin/registrations` | `RegistrationsPage` | Super Admin: review and convert leads |

**Email Integration:**
- On conversion: Super Admin triggers invitation to lead email (reuses Phase 2 invitation flow)

---

### 2. Self-Service Registration (Public Signup)

**Backend API:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/register` | Public | Create account + tenant (self-provisioning) |
| `POST` | `/api/v1/auth/verify-email` | Public | Verify email (reuses Phase 4) |

**Database:**
- Uses existing `platform.tenants`, `platform.users`, `platform.subscriptions`
- Creates trial subscription automatically

**Frontend Pages:**
| Route | Component | Purpose |
|-------|-----------|---------|
| `/register` | `RegisterPage` | Self-service registration form |

**Prerequisites (must be implemented in this phase):**
- Tenant self-provisioning (public create-tenant flow)
- Automatic trial subscription creation
- Plan selection during registration

---

### 3. First Admin Bootstrapping (Improved)

**Current State:** Super Admin creates tenant via API with known password.

**Improved Flow:**
1. Super Admin converts website registration → calls `TenantService.create_tenant()`
2. First admin receives **invitation email** (not password) → sets own password
3. First admin verifies email (Phase 4) → login

**No passwords ever emailed.** First admin establishes credentials via invitation flow.

---

## Phase 4 → Phase 5 Integration

**Phase 4 completed:** Email verification enforced for all logins.

**Phase 5 extends:**
- Invitation acceptance (Phase 2) → email verification (Phase 4) → login
- Self-service registration → email verification (Phase 4) → login
- Website registration conversion → invitation → email verification → login

---

## Database Changes

### 1. Website Registrations Table
```sql
CREATE TABLE IF NOT EXISTS platform.website_registrations (
    registration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    message TEXT,
    plan_interest VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processed','converted','rejected')),
    converted_to_tenant UUID REFERENCES core.tenants(tenant_id),
    converted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_website_registrations_email ON platform.website_registrations(email);
CREATE INDEX IF NOT EXISTS idx_website_registrations_status ON platform.website_registrations(status);
```

### 2. Tenant Self-Provisioning Support
```sql
-- Add columns to core.tenants for self-provisioning tracking
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS provisioning_source VARCHAR(20) DEFAULT 'admin' CHECK (provisioning_source IN ('admin','self','website'));
ALTER TABLE core.tenants ADD COLUMN IF NOT EXISTS registration_id UUID REFERENCES platform.website_registrations(registration_id);
```

---

## API Contracts

### POST /api/v1/public/register (Website Registration)
**Request:**
```json
{
  "email": "lead@company.com",
  "company_name": "Acme Corp",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+44 123 456 7890",
  "plan_interest": "professional",
  "message": "Looking to migrate our ERP system"
}
```
**Response:** 201 Created (always 200 for enumeration prevention)

### GET /api/v1/public/plans
**Response:** 200 OK with plan list for pricing page

### POST /api/v1/auth/register (Self-Service)
**Request:**
```json
{
  "email": "user@company.com",
  "password": "SecureP@ss1",
  "first_name": "John",
  "last_name": "Doe",
  "company_name": "Acme Corp",
  "plan_tier": "professional"
}
```
**Logic:**
1. Validate email not registered
2. Create tenant with trial subscription
3. Create user with `email_verified = FALSE`
4. Create email verification record
5. Send verification email
6. Return success

**Response:** 201 Created

---

## Frontend Pages

### RegistrationsPage (`/admin/registrations`)
- Table: Email, Company, Name, Plan Interest, Status, Created, Actions
- "Convert" action → calls `/admin/registrations/{id}/convert`
- Empty state: "No pending registrations"

### RegisterPage (`/register`)
- Form: email, password, confirm password, first_name, last_name, company_name, plan selection
- Password policy hints
- On success: redirect to `/verify-email` with message

---

## Acceptance Criteria

- [ ] mapnexus.co.uk POSTs to `/api/v1/public/register` → creates lead
- [ ] Super Admin sees leads in `/admin/registrations`
- [ ] Super Admin converts lead → creates tenant + sends invitation
- [ ] Public can register at `/register` → creates tenant + user + trial
- [ ] Self-registered user verifies email → can login
- [ ] First admin from website conversion sets own password via invitation
- [ ] No passwords ever emailed
- [ ] Rate limiting (5/hr) on all public endpoints
- [ ] Enumeration prevention on all public endpoints
- [ ] Existing functionality unaffected

---

## Tests Required

| Test | Scenario |
|------|----------|
| Website registration submission | Creates lead, returns 200 |
| Website registration duplicate | Handles gracefully |
| Admin conversion | Creates tenant, sends invitation |
| Self-service registration | Creates tenant + user + trial |
| Self-service duplicate email | Rejected |
| Self-service password policy | Enforced |
| Email verification flow | Works for self-service |
| First admin bootstrap | Sets own password via invitation |
| Rate limiting | 5/hr on public endpoints |
| Enumeration prevention | All public endpoints return 200 |

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Phase 1 EmailService | ✅ COMPLETE |
| Phase 1 Rate Limiting | ✅ COMPLETE |
| Phase 2 Invitation System | ✅ COMPLETE |
| Phase 3 Password Reset | ✅ COMPLETE |
| Phase 4 Email Verification | ✅ APPROVED |
| `TenantService.create_tenant()` | ✅ EXISTS |
| `UserService.create_user()` | ✅ EXISTS |

---

## Prerequisite Decisions

| Decision | Resolution |
|----------|------------|
| Self-service creates trial subscription | Yes — automatic 30-day trial |
| Plan selection during self-service | Yes — dropdown with all plans |
| Website registration plan interest | Stored for admin reference |
| First admin password | Set via invitation (no email) |
| Website registration → tenant conversion | Super Admin manual action |

---

## Files to Create (Estimated)

| File | Type |
|------|------|
| `app/api/routes/public_routes.py` | Public website registration |
| `app/api/routes/admin_registration_routes.py` | Admin conversion |
| `app/api/routes/auth_routes.py` | Extend: `/auth/register` |
| `app/services/public_registration_service.py` | Service |
| `app/db/repositories/public_registration_repository.py` | Repository |
| `app/db/repositories/self_service_repository.py` | Repository |
| Migration SQL for `website_registrations` + tenant columns | DB |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/public/RegisterPage.tsx` | Frontend |
| `engineering/MAP_V3/03_Source/frontend-mvp/src/routes/administration/RegistrationsPage.tsx` | Frontend |
| `tests/test_website_registration.py` | Tests |
| `tests/test_self_service_registration.py` | Tests |

---

## Implementation Order

1. **DB Migration** — `website_registrations` table + tenant columns
2. **Repository** — CRUD for website registrations
3. **Public Routes** — `/public/register`, `/public/plans`
4. **Admin Routes** — `/admin/registrations`, conversion endpoint
5. **Self-Service Routes** — `/auth/register` (extends auth_routes)
6. **AuthService** — Add `register_self_service()` method
6. **Frontend** — RegisterPage, RegistrationsPage
7. **Tests** — Backend + frontend + integration
8. **Evidence** — Phase 5 scope + evidence docs

---

## Approval Gate

**Phase 5 may begin ONLY after:**
- [ ] This scope reviewed and approved
- [ ] Phase 4 evidence reviewed and accepted
- [ ] Explicit go-ahead given

**No implementation before approval.**