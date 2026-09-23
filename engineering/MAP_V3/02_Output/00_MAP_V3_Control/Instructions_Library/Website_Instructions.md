How to use OC-COM-001d phase 4

How to Access the OnboardingHubPage with Limit Strip
Option 1: Complete the Onboarding Flow (via UI)
1. Go to http://localhost:5173/login → login with admin@mapnexus.com / Admin123456
2. You'll land on /onboarding/welcome (WelcomePage) — shows "No active plan" + "View Plans" button
3. Click "View Plans" → goes to /subscription/plans
4. Select a plan → click "Select Plan" → redirects to Stripe Checkout (test mode)
5. Complete Stripe test checkout → redirects to /billing/success
6. After successful checkout, webhook creates subscription
7. Refresh → you'll be redirected to /onboarding/hub (OnboardingHubPage) with the limit strip visible

To See the Limit Strip Right Now
You need an active subscription. Options:
1. Complete Stripe checkout flow via UI (recommended)
2. Or manually create a subscription in DB for your tenant
3. Or check the component directly at http://localhost:5173/onboarding/hub after subscription exists
The limit strip (plan badge + trial timer + 3 limit pills) is rendered in OnboardingHubPage.tsx:72-92 — it only renders when subscription && !isNone.



How to use OC-COM-001d phase 5
Quick Manual Test (No Backend Changes Needed)
1. Start frontend: cd frontend-mvp && npm run dev (port 5173/5174)
2. Open browser: http://localhost:5173/suspended → shows SuspendedTenantPage
3. Test interceptor: Open DevTools → Network tab → make a fetch to /api/v1/auth/me with invalid/expired token → should redirect to /session-expired
Quick Verification Checklist
Test	Expected
/suspended loads	✅ Page renders with "Tenant Suspended" message
/blocked loads	✅ Shows "Tenant Blocked"
/session-expired	✅ Shows "Session Expired"
AuthInterceptor registered	Check App.tsx → AuthInterceptorWrapper in <AuthProvider>
Interceptor triggers	Check Network tab → 401/403 → redirect occurs
Quick Test Script (Browser Console)

/suspended
/access-denied
/blocked
/session-expired

Tenant services
/billing/invoices
/billing/subscription
/administration/tenants

OC-COM-001e
phase 2
/invites/accept
/administration/invitations

phase 3


go to http://localhost:5173/administration/invitations to send an invite annd register user email

run sql to get token:
SELECT token, email FROM platform.invitations WHERE status = 'pending' ORDER BY created_at DESC LIMIT 1;



http://localhost:5173/invites/accept?token=8bbee979034242a99abe2524ef0820a9


works when not sign in 
http://localhost:5173/reset-password?token=8bbee979034242a99abe2524ef0820a9

http://localhost:5173/forgot-password

Phase 4
1. Login as admin → http://localhost:5173/administration/invitations → create invitation
2. Check DB for token: SELECT token FROM platform.invitations WHERE status='pending'
3. Open /invites/accept?token=... in incognito → create account
4. Check DB for verification token: SELECT token FROM platform.email_verifications WHERE verified=FALSE
5. Open /verify-email?token=... → verify email
6. Login with new credentials → should work

Phase 5
http://localhost:5173/administration/registrations