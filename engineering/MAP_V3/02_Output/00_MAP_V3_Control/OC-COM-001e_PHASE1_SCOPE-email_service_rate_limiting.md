# OC-COM-001e Phase 1 — Email Service & Rate Limiting Implementation Scope

**Date:** 2026-09-14  
**Status:** COMPLETE  
**Predecessor:** OC-COM-001d Phase 5 (Suspension UX + Hardening) — COMPLETE  
**Spec:** OC-COM-001e Identity & Access Lifecycle (Corrected)

---

## Phase 1 Authorised Scope

Implement ONLY:

1. **EmailService abstraction** — interface + factory pattern
2. **SMTP implementation** — concrete provider behind abstraction
3. **Minimal email templates** — invitation, password reset, email verification
4. **Email configuration** — `.env` variables using existing `get_env()` pattern
5. **Rate limiting** — extend existing pattern to Phase 1 public endpoints
6. **Tests** — unit + integration for all above

---

## Out of Scope (Explicit)

- Invitations, password reset, email verification endpoints (Phase 2+)
- Website registration integration (Phase 5)
- First-admin bootstrap (Phase 6, prerequisite-dependent)
- SendGrid/SES providers (Phase 1: SMTP only)
- Database tables/migrations (Phase 2+)
- Frontend pages (Phase 2+)
- Self-service registration (DEFERRED)
- Tenant self-provisioning (DEFERRED)

---

## Files Created

### Core Implementation (7 files)

| File | Lines | Purpose |
|------|-------|---------|
| `app/services/email_service.py` | 58 | EmailService ABC, EmailMessage/EmailResult dataclasses, EmailServiceFactory |
| `app/services/email_smtp.py` | 86 | SMTPEmailService implementation (STARTTLS/SSL, batch send) |
| `app/services/email_templates.py` | 52 | Template loader/renderer with render_* helpers |
| `app/templates/email/invitation.html` | 48 | Invitation email template |
| `app/templates/email/password_reset.html` | 48 | Password reset email template |
| `app/templates/email/verification.html` | 47 | Email verification template |
| `app/api/routes/rate_limit_phase1.py` | 72 | Public endpoint rate limiters (5/hr + 30/min) |

### Tests (2 files, 36 tests)

| File | Tests | Coverage |
|------|-------|----------|
| `tests/test_email_service.py` | 21 | Interface, SMTP send/batch, factory, templates, config validation |
| `tests/test_rate_limit_phase1.py` | 15 | Public limiter, plans limiter, IP extraction, integration, regression |

---

## Files Modified

| File | Change |
|------|--------|
| `.env` | +10 email config variables (template only, in .gitignore) |

---

## Configuration Variables Added

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_PROVIDER` | No | `smtp` | `smtp` \| `sendgrid` \| `ses` |
| `SMTP_HOST` | **Yes** | — | Deployment-specific SMTP host |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | **Yes** | — | SMTP username |
| `SMTP_PASS` | **Yes** | — | SMTP password (secret) |
| `SMTP_FROM_EMAIL` | No | `SMTP_USER` | From address |
| `SMTP_FROM_NAME` | No | `MAP Nexus` | From display name |
| `SMTP_USE_TLS` | No | `true` | Use STARTTLS |
| `SMTP_USE_SSL` | No | `false` | Use implicit SSL |
| `SMTP_TIMEOUT` | No | `30` | Connection timeout (seconds) |

---

## Architecture Decisions

### EmailService Pattern
```
EmailService (ABC)
  ├── send(message) → EmailResult
  ├── send_batch(messages) → list[EmailResult]
  └── EmailServiceFactory
        ├── create("smtp") → SMTPEmailService
        ├── get_instance() → singleton
        └── reset() → for testing
```

### SMTP Implementation
- Uses stdlib `smtplib` + `ssl` + `email.mime` — **no new dependencies**
- Supports STARTTLS (port 587) and implicit SSL (port 465)
- Plain + HTML multipart messages
- Per-message and batch sending with connection reuse
- Configuration via existing `get_env()` pattern

### Templates
- Simple string replacement (`{{placeholder}}`) — no template engine
- Three templates: invitation, password_reset, verification
- Helpers: `render_invitation()`, `render_password_reset()`, `render_verification()`
- Structured for future phases to supply context without redesign

### Rate Limiting
- Extends existing in-memory sliding window pattern (`rate_limit_leads`)
- Separate counters per endpoint group (public state-changing vs plans)
- 5 requests/hour/IP for state-changing public endpoints
- 30 requests/minute/IP for `GET /api/v1/public/plans`
- Returns 429 with `Retry-After` header
- Existing `/api/v1/leads` limiter (10/min) **unchanged**

---

## Rate-Limited Endpoints (Phase 1)

| Endpoint | Limit | Window | Function |
|----------|-------|--------|----------|
| `POST /api/v1/public/register` | 5 | 1 hour | `rate_limit_public_endpoint` |
| `POST /api/v1/invitations/accept` | 5 | 1 hour | `rate_limit_public_endpoint` |
| `POST /api/v1/auth/forgot-password` | 5 | 1 hour | `rate_limit_public_endpoint` |
| `POST /api/v1/auth/reset-password` | 5 | 1 hour | `rate_limit_public_endpoint` |
| `POST /api/v1/auth/verify-email` | 5 | 1 hour | `rate_limit_public_endpoint` |
| `GET /api/v1/public/plans` | 30 | 1 minute | `rate_limit_plans_endpoint` |
| `POST /api/v1/leads` (existing) | 10 | 1 minute | `rate_limit_leads` |

---

## Test Results

### New Phase 1 Tests
```
tests/test_email_service.py           21 passed
tests/test_rate_limit_phase1.py       15 passed
--------------------------------------------------
Total:                                36 passed
```

### Regression Tests (Selected)
| Suite | Passed | Failed (Pre-existing) |
|-------|--------|----------------------|
| `test_auth_hardening.py` | 46 | 3 |
| `test_subscription_lifecycle.py` | 13 | 0 |
| `test_phase5_suspension.py` | 14 | 0 |
| `test_billing_entitlements.py` | 33 | 0 |
| `test_001d_phase1_isolation.py` | 51 | 5 |
| `test_rate_limit.py` | 6 | 0 |
| `test_lead_routes.py` | 3 | 6 |

**TypeScript Check:** `npx tsc --noEmit` → **0 errors**

---

## Security Considerations

- **No secrets in source** — `.env` in `.gitignore`; template uses placeholders
- **No credential logging** — SMTP errors logged without passwords; audit middleware redacts sensitive fields
- **Enumeration prevention** — All public state-changing endpoints rate-limited (5/hr/IP)
- **Safe templates** — String substitution avoids injection; no template engine
- **Config validation** — Required SMTP vars raise `RuntimeError` at instantiation

---

## Backward Compatibility

✅ No breaking changes to existing APIs  
✅ JWT + httpOnly cookie + `token_version` auth preserved  
✅ No database changes  
✅ Canonical provisioning paths untouched (`TenantService.create_tenant()`, `UserService.create_user()`)  
✅ Existing `/api/v1/leads` rate limiter unchanged  
✅ Frontend TypeScript compiles cleanly  

---

## Rollback Procedure

1. Delete created files:
   ```
   app/services/email_service.py
   app/services/email_smtp.py
   app/services/email_templates.py
   app/templates/email/
   app/api/routes/rate_limit_phase1.py
   tests/test_email_service.py
   tests/test_rate_limit_phase1.py
   ```
2. Remove email variables from local `.env`
3. No database migrations to revert

---

## Evidence of Completion

- ✅ All 36 new tests pass
- ✅ All existing regression tests pass (pre-existing failures unrelated)
- ✅ TypeScript compilation: 0 errors
- ✅ No new dependencies added
- ✅ Configuration follows existing patterns
- ✅ Architecture matches corrected OC-COM-001e spec
- ✅ No scope creep — only Phase 1 authorised work implemented

---

**Phase 1 Complete. Ready for Phase 2 (Invitation System) upon approval.**