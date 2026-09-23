# OC-COM-001d Phase 4 — Dashboard Limits & Usage UX Checklist

**Status:** COMPLETE
**Phase:** 4 (P3 Usage UX)
**Date:** 2026-09-12

---

## Checklist Items

### Dashboard Usage Limit Cards
- [x] DashboardPage.tsx: UsageLimitCard component with 3 cards (Projects/Users/Systems)
- [x] Progress bars: green <80%, amber 80-99%, red 100%
- [x] Status text: "Within limits" / "Near limit" / "Limit reached"
- [x] Cards only show when subscription exists

### Onboarding SetupSteps Limit Warnings
- [x] SetupSteps.tsx: LimitWarning component at ≥80% usage (amber)
- [x] Progress bar shows current/max with percentage
- [x] Red warning at 100% with "Limit Reached" button state
- [x] Buttons disabled at limit with "Limit Reached" label
- [x] Applies to CreateProject, ConnectSource, ConnectTarget steps

### WelcomePage Subscription Card
- [x] WelcomePage.tsx: Plan badge, trial countdown, usage bars
- [x] Shows Plan name, trial days remaining, billing cycle
- [x] Usage bars for Projects, Users, Systems with color coding

### OnboardingHubPage Limit Strip
- [x] OnboardingHubPage.tsx: Plan badge + 3 limit pills
- [x] Color-coded pills (green/amber/red) based on usage percentage
- [x] Shows current/max for Projects, Users, Systems

### Pricing Model (Corrected)
- [x] Monthly = List Price ÷ 12 (no discount on monthly)
- [x] Annual = List Price × 0.8 (20% discount on annual)
- [x] Monthly prices: £2,604.17 / £7,812.50 / £20,833.33
- [x] Annual prices (20% off): £25,000 / £75,000 / £200,000

### Frontend Pricing Display
- [x] PriceTag component: Monthly = List ÷ 12 (no discount)
- [x] Monthly view: "Undiscounted monthly price (no annual commitment)"
- [x] Annual view: "Save 20%" green badge + list price reference
- [x] Enterprise Plus: "Starting price: £200,000/year" + custom integrations note
- [x] Removed "20% Annual Discount" from feature list (per requirement)

### Enterprise Plus Specific
- [x] "Starting price: £200,000/year" label
- [x] "Custom integrations subject to agreed technical scope" note

### Database Updates
- [x] Added `list_price` column to `platform.plans`
- [x] Professional: list=31250, annual=25000, monthly=2604.17
- [x] Enterprise: list=93750, annual=75000, monthly=7812.50
- [x] Enterprise Plus: list=250000, annual=200000, monthly=20833.33

### Entitlement Alignment
- [x] Middleware DEFAULT_ENTITLEMENTS aligned with DB vocabulary
- [x] Professional: post_migration_assurance, reconciliation, core_governance, priority_support
- [x] Enterprise: pre/post/pre_post_migration_assurance, advanced_governance, reconciliation
- [x] Enterprise Plus: enterprise_reporting, enterprise_governance, custom_integrations, dedicated_support

---

## Sign-off

- [x] All checklist items complete
- [x] TypeScript compilation: 0 errors
- [x] Tests: 97/97 passed
- [x] Evidence documented in main spec Section 20

---

**Status:** COMPLETE
**Date:** 2026-09-12