# 10.5.5 — Onboarding Completion

**Target Layout:** New build (no existing implementation)
**Route:** `/onboarding` (new)
**Current Status:** Nothing exists — no pages, no hooks, no types, no backend
**Est. Effort:** 8-12 days

---

## Current State

### What Exists
- **Nothing.** No onboarding pages, components, hooks, types, or backend endpoints.
- The 10.3 assessment listed onboarding as "Does not exist."
- No navigation menu items for onboarding.
- No route definitions for onboarding.

### What Needs to Be Built
Everything — this is a greenfield workstream.

---

## Target State

### Onboarding Flow

```
Step 1: Welcome          Step 2: Register Source     Step 3: Register Target
┌──────────────────┐    ┌──────────────────┐       ┌──────────────────┐
│  Welcome to MAP  │    │  Source System   │       │  Target System   │
│                  │    │                  │       │                  │
│  Let's get you   │    │  Database Type:  │       │  Database Type:  │
│  started with    │    │  [PostgreSQL ▾]  │       │  [PostgreSQL ▾]  │
│  your first      │    │  Host:           │       │  Host:           │
│  migration.      │    │  [_________]     │       │  [_________]     │
│                  │    │  Port: [5432]    │       │  Port: [5432]    │
│  [Get Started →] │    │  Database:       │       │  Database:       │
│                  │    │  [_________]     │       │  [_________]     │
│                  │    │  Username:       │       │  Username:       │
│                  │    │  [_________]     │       │  [_________]     │
│                  │    │  Password:       │       │  Password:       │
│                  │    │  [_________]     │       │  [_________]     │
│                  │    │                  │       │                  │
│                  │    │  [Test Connection]│       │  [Test Connection]│
│                  │    │  [Next →]        │       │  [Next →]        │
└──────────────────┘    └──────────────────┘       └──────────────────┘

Step 4: Discovery        Step 5: First Migration     Step 6: Complete
┌──────────────────┐    ┌──────────────────┐       ┌──────────────────┐
│  Schema Discovery│    │  First Migration │       │  You're Ready!   │
│                  │    │                  │       │                  │
│  Discovered:     │    │  Run your first  │       │  ✅ Source set   │
│  3 schemas       │    │  validation to   │       │  ✅ Target set   │
│  12 tables       │    │  confirm everything│     │  ✅ Discovery    │
│  48 columns      │    │  works.          │       │  ✅ First run    │
│                  │    │                  │       │                  │
│  [View Results]  │    │  [Run Validation]│       │  [Go to Dashboard]│
│  [Next →]        │    │  [Skip for now]  │       │                  │
└──────────────────┘    └──────────────────┘       └──────────────────┘
```

### Features Required
1. **Welcome screen** — introduction, value proposition, Get Started button
2. **Source system registration** — form with database type, connection config, credential fields
3. **Target system registration** — same form as source
4. **Connection testing** — test before proceeding
5. **Schema discovery** — trigger discovery, show results
6. **First validation run** — optional, run a test validation
7. **Completion screen** — summary, link to dashboard
8. **Progress indicator** — stepper showing current step (1-6)
9. **Skip option** — allow skipping steps
10. **Remember completion** — don't show again after first run

---

## Implementation Plan

### Phase 1: Backend (1-2 days)

| Task | Effort | Details |
|------|--------|---------|
| Create `GET /onboarding/status` endpoint | 0.5d | Return onboarding state: completed steps, systems registered, etc. |
| Create `POST /onboarding/complete` endpoint | 0.5d | Mark onboarding as completed for project |
| Create `core.onboarding_state` table | 0.5d | project_id, step, completed_at, data (JSONB) |
| Backend tests | 0.5d | |

Note: Most functionality uses existing endpoints (`POST /systems/`, `POST /discovery/current`, `POST /execution/run`). Only status tracking is new.

### Phase 2: Frontend Types & Hooks (0.5 day)

| Task | Effort | Details |
|------|--------|---------|
| Create `src/types/onboarding.ts` | 0.25d | `OnboardingStatus`, `OnboardingStep`, `OnboardingState` |
| Create `src/hooks/useOnboarding.ts` | 0.25d | `useOnboardingStatus()`, `useCompleteOnboarding()` |

### Phase 3: Onboarding Pages (3-4 days)

| Task | Effort | Details |
|------|--------|---------|
| Create `OnboardingLayout.tsx` | 0.5d | Stepper, back/next navigation, progress indicator |
| Create `WelcomeStep.tsx` | 0.25d | Introduction, value prop, Get Started |
| Create `SourceSystemStep.tsx` | 1d | System registration form with connection test |
| Create `TargetSystemStep.tsx` | 0.5d | Reuse source form component |
| Create `DiscoveryStep.tsx` | 0.5d | Trigger discovery, show results |
| Create `FirstRunStep.tsx` | 0.5d | Optional validation run |
| Create `CompleteStep.tsx` | 0.25d | Summary, link to dashboard |
| Create `OnboardingPage.tsx` | 0.5d | Orchestrator: manages step state, routing |

### Phase 4: Integration (2-3 days)

| Task | Effort | Details |
|------|--------|---------|
| Wire source/target forms to `POST /systems/` | 0.5d | Create systems via existing API |
| Wire connection test to `GET /systems/{id}/test` | 0.25d | Test before proceeding |
| Wire discovery to `POST /discovery/current` | 0.5d | Trigger discovery |
| Wire validation to `POST /execution/run` | 0.5d | Run first validation |
| Add "skip" functionality | 0.25d | Skip individual steps |
| Add "don't show again" persistence | 0.25d | localStorage + backend flag |
| Add route to AppRoutes.tsx | 0.25d | `/onboarding` route |

### Phase 5: Polish (1-2 days)

| Task | Effort | Details |
|------|--------|---------|
| Stepper animations | 0.25d | Smooth transitions between steps |
| Form validation | 0.5d | Required fields, format validation |
| Error handling | 0.25d | Per-step error states |
| Tests | 0.5d | Unit + integration |
| Responsive design | 0.25d | Mobile-friendly forms |

---

## Files to Create

### Backend
| File | Action |
|------|--------|
| `app/api/routes/onboarding_routes.py` | CREATE |
| `app/services/onboarding_service.py` | CREATE |
| `app/db/repositories/onboarding_repository.py` | CREATE |
| `app/api/main.py` | MODIFY — add onboarding router |

### Frontend
| File | Action |
|------|--------|
| `src/types/onboarding.ts` | CREATE |
| `src/hooks/useOnboarding.ts` | CREATE |
| `src/routes/OnboardingPage.tsx` | CREATE |
| `src/components/onboarding/OnboardingLayout.tsx` | CREATE |
| `src/components/onboarding/WelcomeStep.tsx` | CREATE |
| `src/components/onboarding/SourceSystemStep.tsx` | CREATE |
| `src/components/onboarding/TargetSystemStep.tsx` | CREATE |
| `src/components/onboarding/DiscoveryStep.tsx` | CREATE |
| `src/components/onboarding/FirstRunStep.tsx` | CREATE |
| `src/components/onboarding/CompleteStep.tsx` | CREATE |
| `src/components/onboarding/Stepper.tsx` | CREATE |
| `src/AppRoutes.tsx` | MODIFY — add `/onboarding` route |

---

## Acceptance Criteria

- [ ] Onboarding page accessible at `/onboarding`
- [ ] Stepper shows current step (1-6) with progress
- [ ] Welcome screen explains value proposition
- [ ] Source system form creates system via API
- [ ] Target system form creates system via API
- [ ] Connection test works before proceeding
- [ ] Discovery triggers and shows results
- [ ] Optional validation run works
- [ ] Completion screen shows summary
- [ ] Skip works for each step
- [ ] "Don't show again" persists
- [ ] Redirects to `/dashboard` after completion
- [ ] All form validation works
- [ ] All states handled: loading, error, empty
- [ ] Dark mode works
- [ ] Responsive on mobile
