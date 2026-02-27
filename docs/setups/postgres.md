
//Login into dsams_dev (postgress db) as user postgres (default user name)
psql -U postgres -d dsams_dev -h localhost -W
CREATE DATABASE dsams_shadow;

// Login into dsams_dev and run script dsams_schema.sql
psql -U postgres -d dsams_dev -h localhost -W -f dsams_schema.sql

//setting up Next.js(frontend) and Nest.js(backend)

//set NestJs
npx @nestjs/cli new backend
//it will then ask for options of npn, yarn, prpn

//Step 1 — Initialize Prisma (if not already done)
// Install Prisma + PostgreSQL driver:
npm install pg @prisma/client
npm install prisma --save-dev

//2)/Initialize Prisma:
//creates prisma folder in backend and default schema.prisma file
//creates .env file inside backend folder

npx prisma init

backend/
├── prisma/
│   └── schema.prisma
├── .env

//open .env folder and change/set db connection
//Step 2 — Configure your .env file

If .env didn’t appear, create it manually:

backend/.env

//Step 3 — Verify your schema.prisma file exist and created

//Step 4 — Pull your dsams_dev schema from PostgreSQL
//if you get error during pull it is because prisma is looking for a file called 'prisma.config.ts' renamed it and run again
ren prisma.config.ts prisma.config.ts.bak
npx prisma db pull

//Step 5 — Generate Prisma Client
npx prisma generate

//
dropdb -U postgres dsams_dev
createdb -U postgres dsams_dev
psql -U postgres -d dsams_dev -h localhost -f backend/prisma/sqlscript/dsams_schema.sql

//login
psql -U postgres -d dsams_dev

\d parent_student_links;
\d subscriptions;

psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS dsams_dev;"
psql -U postgres -d postgres -c "CREATE DATABASE dsams_dev;"
psql -U postgres -d dsams_dev -f prisma/sqlscript/dsams_schema.sql
npx prisma db seed

npx prisma db seed
npx prisma studio

//runnning sql script
\i backend/prisma/sqlscript/dsams_schema.sql


✅ Quick Fix — Recreate all tables and reseed properly
Step 1 — Push schema to the database

Run:

npx prisma db push


This command will:

Create all tables defined in prisma/schema.prisma

Ensure indexes and relations are set up

✅ Expected output:

Applying changes
Your database is now in sync with your schema.

Step 2 — Rerun the seed script

Once tables exist, rerun:

npx ts-node prisma/seed.ts


✅ Expected output:

Connected to DB
Seeding permissions...
Seeding roles...
Seeding tenants, users, parents, students...
🎉 Safe seeding completed!

Step 3 — Verify tables exist
psql -U postgres -d dsams_dev -c "\dt"


You should see tables like:

public.permissions
public.roles
public.tenants
public.users
public.students
public.parents
...


That will repopulate your data (if the seed.ts matches the DB structure).

⚙️ Summary: Full PowerShell sequence
cd "C:\Users\devwork\Downloads\CLI_VS_Code\development\School_App\Dynamic_School_App_Management_System\backend"
npx prisma db pull
npx prisma format
npx prisma generate
npx prisma validate
npx prisma db seed


⚙️ Optional: Confirm it aligns with your DB

If you already have the user_schools table in Postgres, this definition will now sync perfectly.

If you want to re-introspect the whole DB safely:

npx prisma db pull --force

Remove-Item -Recurse -Force	Deletes folders/files recursively, ignoring confirmations
node_modules\.prisma	Removes Prisma’s internal engine cache
node_modules\@prisma	Removes the Prisma Client code
npm install	Reinstalls dependencies fresh
npx prisma generate	Regenerates Prisma Client from your updated schema.prisma



✅ Step-by-Step: Automatic Table Creation + Seeding
1️⃣ Make sure your schema.prisma file is correct

This file is the blueprint of your database — Prisma will use it to generate all tables automatically.

If your tables (like owners, tenants, users, subscriptions) are already defined properly in prisma/schema.prisma, you’re ready.

If they aren’t, update that file first — because Prisma only creates what’s defined there.

2️⃣ Run the full automatic reset command

This single command will:

Drop your existing dsams_dev database,

Recreate all tables from your schema.prisma, and

Run your seed.ts script to populate sample data automatically.

Run:
npx prisma migrate reset


Then answer yes when prompted.

You should see output like
Database reset successful
Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...
Connected to DB
Seeding data...
✅ Seeding completed successfully

3️⃣ (Alternative) If you don’t use migrations

If you’re not using migrate, but just want Prisma to push the schema, you can do:

npx prisma db push
npx prisma db seed

4️⃣ Verify everything

Once complete, open your Prisma Studio to visually confirm that all tables and data were created:

npx prisma studio




Step-by-Step: Fix Outdated Prisma Client (PowerShell)
 Make sure your schema.prisma is saved

Run these commands from your backend folder:
# 1️⃣ Delete Prisma cache folder
Remove-Item -Recurse -Force .\node_modules\.prisma

# 2️⃣ Delete old generated client
Remove-Item -Recurse -Force .\node_modules\@prisma\client


3️⃣ Regenerate Prisma Client

npx prisma generate


🔄 Restart your app

After that, restart your backend:
npm run start:dev

How r=to run sql file from psql
psql -h localhost -U postgres -d dsams_dev -f "attendance_sync.sql"

psql -h localhost -U postgres -d dsams_dev -f "dashboard.sql"



npx prisma generate
##seed to load data
npx prisma db seed

//reload typescript
trl+Shift+P or Cmd+Shift+P) and type '          │
│ TypeScript: Restart TS Server'


//Restore files/folders, from GIT:
git restore src/modules/dashboards


// pushed changes to the remote branch
git status
git add -A
git commit -m "Save all current changes"
git commit -m "e've addressed issues preventing tenant-level roles (admin, teacher, parent, student) from logging
  in, fixing password hashing and role-permission seeding order. We also resolved specific access
  denials by correcting missing permissions in their role definitions."
git commit -m "implementing dashboards backend modules for roles (superadmin, admins, teachers, parents and student). Now testing dashboards endpoints for different roles, permissions issues with teachers, students and parents."
git commit -m "pdated dashboards endpoints to support all roles. Noted null values for teachers in 'My Class Students'; likely due to unassigned teachers. Further investigation planned."
git commit -m "Fixed dashboards endpoint for teacher role. Teacher 'My Class Students' is now setting to 0 where there are ubassigned students or classes. Also, carried out dedicated unit tests to ensure the SQL query sanitization works as expected and prevents injection"
git commit -m "Primarily worked on dashboards and completed  Tenant Admin Dashboard, remaining communication Analytics (- [ ] Messages, Announcements, Events, Alerts)."
git commit -m "Backend Dashboards endpoint fully completed for Tenant Admin ."
git commit -m "Backend Dashboards endpoint - completed and tested students endpoint ([ ] Classes Today
[x] **Overview - Completed (2025-12-05)**, [x] Classes Today (Completed: 2025-12-05),[x] Assignments Due (Completed: 2025-12-05), [x] Current GPA (Completed: 2025-12-05), [x] Today's Timetable (Completed: 2025-12-05), [x] Upcoming Assignments (Completed: 2025-12-05), [x] Quick Info (Completed: 2025-12-05),[x] Schedules, Grades & Events (Completed: 2025-12-05)"
      "


git commit -m "current db dashboards seed was given lots of issues, especially during creations of widgets. Links were breaking and dashboards that used to work for example for teachers or students suddenly stopped working. sometimes we get status code 500 internal server error or 403 permission issues. We chanhged architecture to ensure instead of having the=ree different entry points, now has just one version of the truth. Now endpoints are now working for most except parents and owners"
git commit -m "Backend Dashboards endpoint for owners fully implemented and tested"
git commit -m "Issues relating to parents not able to view own dashboard endpoints now fixed and working. The only issue that needs resolving is owners dashboard endpoint"
git commit -m "Issues relating to owners not able to view own dashboard endpoints now fixed and working. Next we are going to start with superadmin analytics dashboards"

git commit -m "Backend Dashboards endpoint for owners fully implemented and tested"
git commit -m "teachers dashboard endpoints previously completed tasks were missing and re-implemented"

git commit -m "- [x] **User-Defined Report Builder (Backend Foundation)** (Completed: 2025-12-09)
  - [x] Created database schema for `reports`, `report_queries`, and `report_layouts`.
  - [x] Implemented seeding for sample user-defined reports."


git commit -m "// Stabilized dashboard and auth flow, aligned with TODO.md.  
// Fixed backend compilation issues, added debug logs, and corrected JwtPayload mapping.  
// Implemented client logout, fixed user interface typings, and improved token handling.  
// Cleaned up components and fixed import errors for smoother frontend operation."

git commit -m "// table dashboard_widgets has a type with a value 'chart' which is generic.   
// The chart creator in frontend (ChartWidget) was expecting either pie or bar or line.  
// but instead receiving chart, however the script has a default sets to line.  
// in this case it will always build a line chart. Solution specify in column type to receive line, or pie or bar"

git commit -m "// Update seed db to includes pie and bar for superadmin and admin"
We've now successfully implemented:
   * [x] Chart Widgets: Line, bar, and pie charts are displaying.
   * [x] Advanced Table Features: Sorting, pagination, and global
     filtering are working."

git commit -m "//Added various enhancements to dashboards."
git push -u origin feature/fullstack-phase-4-dynamic-rbac

git commit -m "//Polish dashboards."
git push -u origin feature/fullstack-phase-5-dynamic-rbac



//Your local branch may be behind the remote branch.
git pull origin feature/phase-4-continuation
# resolve any merge conflicts if necessary


Create a new combined feature branch
Step 1 — Checkout the backend feature branch
git checkout feature/backend-phase-4-dynamic-rbac

Step 2 — Create new feature branch for full-stack
git checkout -b feature/fullstack-phase-5-dynamic-rbac

git add .
git commit -m " [x] **Implement Global State Mnagement:**
  - [ ] Integrate a state management library (e.g., Zustand or React Context) to manage the user's session, profile, and permissions globally.
- [x] **Build Authentication UI & Logic:**
  - [x] Create the Login page (`/login`) with a form to submit credentials.
  - [ ] Create Forgot/Reset Password pages and connect them to the backend API.
- [x] **Create Protected Routes:**`n  - [x] Implement a higher-order component (HOC) or middleware to protect routes, redirecting unauthenticated users to the login page."

git add .
git commit -m "Phase 8: Implement role-specific Active Users and Monthly Targets charts
Aligned dashboard widgets to strict 1:1 widget–query model with seed-safe entries
Added 7 role-scoped widgets with validated SQL output shapes for charts
Ensured compatibility with existing dashboard renderer and permissions model"

git commit -m " Re-worked on the following phases (PHASE 11 - 12): dashboard_prompt_11_DB-Driven Navigation Grouping_creation, dashboard_prompt_11_DB-Driven Navigation Grouping, dashboard_prompt_11b_DB-Driven Navigation Grouping_implementation, dashboard_prompt_12_Collapsible Menu Groups"
git push -u origin feature/fullstack-phase-5-dynamic-rbac

git commit -m "Refactor and enhance the existing dashboard frontend into a professional, SaaS-grade, education-focused UI using Tailwind CSS + Next.js, while keeping the current dynamic, database-driven dashboard system intact."

git commit -m "1. Backend: `/billing/reconcile` (owner overview):
      Implemented the getOwnerReconciliationOverview
      method and updated the controller to expose it.
      This endpoint now fetches reconciliation data
      based on user role (all tenants for superadmin,
      owned tenants for owner).
   2. Backend: `/billing/reconcile/:tenantId` (tenant
      drill-down): Updated the reconcileTenant method
      and controller to include owner assertion and
      provide a detailed response for a single
      tenant.
   3. Stripe aggregation logic: Integrated the logic
      to fetch, filter, and sum Stripe invoice totals
      into both backend service methods.
   4. Owner overview UI table: Created the
      AdminBillingReconciliationList.tsx component
      using @tanstack/react-table and integrated it
      into
      frontend/src/app/admin/billing/reconciliation/p
      age.tsx to display the overview data.
   5. Drill-down routing: Established
      frontend/src/app/admin/billing/reconciliation/[
      tenantId]/page.tsx for the detailed view.
   6. Status badges + actions: These are implemented
      within AdminBillingReconciliationList.tsx."
git commit -m "Replaced table listing to form listing to get professional looking presentation"
git commit -m "updated Finance - Billing Reconciliation to connect to stripe test data and show up different flags. it test stripe to see if connection is working after that it sends stripe subscriptions where given in db and creates appropriate flags. This has been tested in owner 1"

sends stripe subscriptions where given in db and creates appropriate flags. This has been tested in owner 1"

git commit -m "Further  to PHASE 23"









git commit -m "We have now completed (PHASE 23) the entire "Finance -> Billing Reconciliation feature, including the core overview, comprehensive status flags, sorting, pagination, search, all export options, responsive design, the actionable detail page with superadmin access, the Stripe ID form, and the Date Range Picker."


git commit -m "wi=orked on PH18 - 01 -07. Bugs toggling Tenanat Enabled button"


git push -u origin feature/fullstack-phase-5-dynamic-rbac
git add .

// Perform Clean Install and Prisma Generate:
Remove-Item -Path "node_modules" -Recurse -Force
npm install
npx prisma generate
npx prisma db seed


//gets all the latest branches and updates from GitHub.

git fetch origin feature/fullstack-phase-5-dynamic-rbac
//origin/branch-name makes your current branch exactly match the remote branch, discarding all local changes.
git reset --hard feature/fullstack-phase-5-dynamic-rbac


update prisma to postgresql
npx prisma migrate dev
npx prisma migrate dev --name       │
add_navigation_models 

npx prisma db seed


//full loads
npx ts-node --transpile-only prisma/seed_v2/index.ts

//widget repairs
npx ts-node --transpile-only prisma/seed_v2/repair_widgets.ts
//system loads
npx ts-node --transpile-only prisma/seed_v2/index.ts




🧹 OPTIONAL CLEANUP (after confirming on GitHub)

Once you confirm everything is correct on GitHub, you can clean the old branch.

Optionally delete the commit from the wrong branch:
git checkout forensic/gemini-damaged-state
git reset --hard HEAD~1


⚠️ Only do this after confirming the cherry-pick worked.


//test stripe connection
node utility/test-stripe.js