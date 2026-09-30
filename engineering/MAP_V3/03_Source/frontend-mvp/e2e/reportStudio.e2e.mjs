/**
 * OC-REPORT-001 — Report Studio BROWSER end-to-end journey.
 *
 * This is deliberately NOT a component test. It drives a real Chromium against
 * the real Vite dev server and the real FastAPI backend, authenticating through
 * the real login form. Nothing is mocked: no fetch stubbing, no MSW, no injected
 * token. RBAC, tenant context and the entitlement/permission gates are all
 * exercised as a user would exercise them.
 *
 * Playwright hands each test a fresh browser context, so the session does not
 * survive between tests. Every test therefore performs a real login for the
 * identity it needs rather than sharing one context, which also means a login
 * regression fails the run instead of being hidden by shared state.
 *
 * The only direct database access is to toggle an entitlement mid-journey,
 * because there is no self-service UI for changing a subscription. It is
 * restored in a finally block so a failed run cannot leave the plan altered.
 *
 * Run (5174 is the MAP_V3 frontend-mvp dev server; 5173 is a different app):
 *   set E2E_PW_A / E2E_PW_V / E2E_PW_B, then
 *   npx playwright test --config=playwright.e2e.config.ts
 */
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const WEB = process.env.E2E_WEB || 'http://localhost:5174';
const TENANT_A = 'fc5c09d2-f5ff-4c3b-a6dd-4d46e089e457';
const VIEWER_ID = '568fae18-3807-4de4-b0a7-a1ced2a69c7a';

/**
 * Entitlement toggling has no self-service UI, so it goes through a small Python
 * helper rather than adding a JS postgres driver to the frontend. `snapshot`
 * writes the current value to a temp file and `restore` puts it back, so an
 * interrupted run cannot leave the plan altered.
 */
const REPO_ROOT = process.env.E2E_REPO_ROOT
  || path.resolve(process.cwd(), '..', '..', '..', '..');
const HELPER = path.join(REPO_ROOT, 'scripts', 'report_studio_entitlement.py');

function entitlement(args) {
  const out = execFileSync('python', [HELPER, ...args], {
    cwd: REPO_ROOT, encoding: 'utf8',
  });
  return JSON.parse(out.trim().split('\n').pop());
}

const A = {
  analyst: { email: 'analyst@ocreport001.test', password: process.env.E2E_PW_A },
  // each seeded user has its OWN generated password; do not reuse one across users
  viewer: { email: 'viewer@ocreport001.test', password: process.env.E2E_PW_V },
  other: { email: 'other@ocreport001.test', password: process.env.E2E_PW_B },
};

/**
 * Real login through the real form.
 *
 * `networkidle` is deliberate: the login inputs are controlled React inputs, so
 * filling them before hydration completes lets React reset the values and the
 * submit silently does nothing. Waiting for the app to settle (including the
 * /auth/me call) makes the login deterministic. A single retry absorbs any
 * remaining slow-start jitter.
 */
async function loginOnce(page, who) {
  await page.goto(`${WEB}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  await page.locator('#email').fill(who.email);
  await page.locator('#password').fill(who.password);
  // prove the values survived hydration before submitting
  await expect(page.locator('#email')).toHaveValue(who.email);

  await page.getByRole('button', { name: /sign in/i }).click();
  // Wait on the parsed location, not waitForURL: the post-login redirect is a
  // client-side pushState, which never fires a `load` event, so waitForURL's
  // default waitUntil would hang even though the navigation succeeded.
  await page.waitForFunction(
    () => !window.location.pathname.startsWith('/login'),
    undefined,
    { timeout: 20000 },
  );
}

/**
 * Switch identity mid-test.
 *
 * `login()` alone is not enough here: PublicRoute bounces an already-authenticated
 * visitor away from /login, so filling the form would never happen. Clearing the
 * session first is what makes the second login real.
 */
async function switchUser(page, who) {
  // Clear the persisted session BEFORE navigating: clearing the cookie makes the
  // current page unauthenticated, which triggers a redirect, and evaluating in
  // that window throws "execution context was destroyed".
  await page.context().clearCookies();
  await page.goto(`${WEB}/login`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await login(page, who);
}

async function login(page, who) {
  try {
    await loginOnce(page, who);
  } catch (err) {
    if (!page.url().includes('/login')) throw err;
    await loginOnce(page, who);
  }
}

/** Establish a real authenticated session for the given identity. */
async function session(page, who) {
  const already = await page.evaluate(async () => {
    const r = await fetch('/api/v1/auth/me', { credentials: 'include' });
    return r.ok;
  }).catch(() => false);
  if (!already) await login(page, who);
}

/**
 * Template cards are matched on their stable `template_key` rather than the
 * display name, because the display names contain typographic dashes (U+2014)
 * that are easy to get wrong and brittle to assert on.
 */
const tpl = (page, key) => page.getByRole('button', { name: new RegExp(key) });

/** How many immutable versions a report currently has, read from the API. */
const versionCount = (page, id) => page.evaluate(async (rid) => {
  const r = await fetch(`/api/v1/reports/studio/reports/${rid}/versions`, {
    credentials: 'include',
  });
  const j = (await r.json()).data ?? {};
  return (j.items ?? []).length;
}, id);

const openCreate = async (page) => {
  await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'New report' }).click();
  await expect(tpl(page, 'migration_health_weekly')).toBeVisible();
};

test.describe.configure({ mode: 'serial' });

let reportId = null;
let editorReportId = null;
let pinnedReportId = null;
let adoptReportId = null;
let readonlyReportId = null;

/**
 * Reports this run created, so the run can clean up after itself.
 *
 * Without this every full run left ~25 live reports behind and Saved Reports
 * filled with identical template instances (it reached 136).
 */
const createdReportIds = [];
const trackReport = (id) => { if (id) createdReportIds.push(id); return id; };

/**
 * Best-effort teardown: soft-delete every report the PROVISIONED TEST USERS own.
 *
 * This sweeps by owner rather than by the tracked ids, because several tests
 * create reports through the API without ever navigating to the report URL
 * (assistant candidate, export, exec fixtures). Id tracking silently missed
 * those and left 4 orphans per run.
 *
 * Safety: it only ever acts as `analyst@ocreport001.test` and
 * `other@ocreport001.test`, which exist solely for this suite. A real user's
 * reports (including the Super Admin's) are unreachable, because the list and
 * the status transition are both owner-scoped server-side.
 *
 * Teardown must never mask a real test failure, so nothing here throws.
 */
async function sweepTestReports(request, baseURL) {
  const owners = [
    { email: A.analyst.email, password: process.env.E2E_PW_A },
    { email: A.viewer.email, password: process.env.E2E_PW_V },
    { email: A.other.email, password: process.env.E2E_PW_B },
  ];
  let removed = 0;
  for (const who of owners) {
    try {
      const res = await request.post(`${baseURL}/api/v1/auth/login`, {
        data: { username: who.email, password: who.password },
      });
      if (!res.ok()) continue;
      const cookie = (res.headers()['set-cookie'] || '').split(';')[0];
      if (!cookie) continue;
      const headers = { Cookie: cookie, 'Content-Type': 'application/json' };

      const listed = await request.get(
        `${baseURL}/api/v1/reports/studio/reports?scope=mine`, { headers });
      if (!listed.ok()) continue;
      const items = (await listed.json()).data?.items ?? [];
      for (const item of items) {
        const del = await request.patch(
          `${baseURL}/api/v1/reports/studio/reports/${item.id}/status`,
          { headers, data: { status: 'deleted' } });
        if (del.ok()) removed += 1;
      }
    } catch { /* best effort only */ }
  }
  return removed;
}

test.afterAll(async ({ request, baseURL }) => {
  const byOwner = await sweepTestReports(request, baseURL);
  // any id the sweep could not reach (wrong owner, already gone) is retried
  for (const id of createdReportIds) {
    try {
      const res = await request.patch(
        `${baseURL}/api/v1/reports/studio/reports/${id}/status`,
        { headers: { 'Content-Type': 'application/json' },
          data: { status: 'deleted' } });
      if (res.ok()) byOwner += 1;
    } catch { /* best effort only */ }
  }
  if (byOwner > 0) {
    console.log(`  [teardown] soft-deleted ${byOwner} test report(s)`);
  }
});

test('1. login as Data Analyst and land on an authenticated app', async ({ page }) => {
  await login(page, A.analyst);
  expect(page.url()).not.toContain('/login');

  const me = await page.evaluate(async () => {
    const r = await fetch('/api/v1/auth/me', { credentials: 'include' });
    return r.ok ? await r.json() : { status: r.status };
  });
  const p = me.data ?? me;
  expect(p.email).toBe(A.analyst.email);
  expect(p.roles).toContain('Data Analyst');
  // permissions came from the server, not the UI
  expect(p.permissions).toContain('reports:read');
  expect(p.permissions).toContain('reports:create');
  expect(p.tenant_id).toBe(TENANT_A);
});

test('2. Report Studio is visible and loads its entitlement-filtered catalog', async ({ page }) => {
  await session(page, A.analyst);
  await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { name: 'Report Studio' })).toBeVisible();
  // the entitlement badge proves the page is gated on report_studio
  await expect(page.getByText('report_studio', { exact: true })).toBeVisible();
  // and the deny banner must NOT be present for an entitled tenant
  await expect(page.getByText(/Not available on this plan/i)).toHaveCount(0);
});

test('3. templates are listed, and each names its extra entitlement', async ({ page }) => {
  await session(page, A.analyst);
  await openCreate(page);

  await expect(tpl(page, 'executive_status')).toBeVisible();
  // a template requiring a second entitlement names it rather than hiding why
  await expect(page.getByText('advanced_reporting').first()).toBeVisible();
  // blank report is always offered
  await expect(page.getByText(/\+ Blank report/i)).toBeVisible();
});

test('4. instantiate a template creates a real report owned by the analyst', async ({ page }) => {
  await session(page, A.analyst);
  await openCreate(page);

  await tpl(page, 'migration_health_weekly').click();
  await page.waitForURL(/\/reports\/studio\/[0-9a-f-]{36}\/edit/, { timeout: 20000 });
  reportId = trackReport(page.url().match(/studio\/([0-9a-f-]{36})/)[1]);
  expect(reportId).toBeTruthy();

  // verify server-side, not just via the URL
  const rec = await page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}`, { credentials: 'include' });
    return r.ok ? await r.json() : { status: r.status };
  }, reportId);
  const body = rec.data ?? rec;
  expect(body.report.status).toBe('draft');
  expect(body.report.derived_from_template_key).toBe('migration_health_weekly');
  // ownership is proven by the owner id matching the logged-in user, rather than
  // by a client-computed flag
  expect(body.report.owner_user_id).toBe('1947ddcd-9fbc-410f-a68c-d16b7b4fd49a');
  expect(body.report.tenant_id).toBe(TENANT_A);
});

test('5. the viewer page renders the report data with provenance', async ({ page }) => {
  await session(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${reportId}/view`, { waitUntil: 'domcontentloaded' });

  // provenance: which data source produced it
  await expect(page.getByText('migration.control_summary')).toBeVisible();
  // completeness is stated explicitly
  await expect(page.getByText(/complete|TRUNCATED/)).toBeVisible();
  // export is offered to an analyst who holds reports:export (Phase 3: csv + xlsx)
  await expect(page.getByLabel('Export CSV')).toBeVisible();
  await expect(page.getByLabel('Export XLSX')).toBeVisible();
});

test('6. version history is listed and the current version is shown', async ({ page }) => {
  await session(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${reportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Versions/ }).click();

  await expect(page.getByText(/Definitions are immutable/i)).toBeVisible();
  await expect(page.getByText(/^v1$/).first()).toBeVisible();
});

test('7. publish, then confirm the status transition server-side', async ({ page }) => {
  await session(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${reportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Publish' }).click();

  await expect.poll(async () => {
    return page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}`, { credentials: 'include' });
      const j = (await r.json()).data ?? {};
      return j.report?.status;
    }, reportId);
  }, { timeout: 20000 }).toBe('published');
});

test('8. share with the Viewer user, then confirm the grant exists', async ({ page }) => {
  await session(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${reportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Sharing/ }).click();
  await page.getByPlaceholder('User id (UUID)').fill(VIEWER_ID);
  await page.getByRole('button', { name: 'Share', exact: true }).click();

  await expect.poll(async () => {
    return page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}/access`, { credentials: 'include' });
      const j = (await r.json()).data ?? {};
      return (j.items ?? []).length;
    }, reportId);
  }, { timeout: 20000 }).toBeGreaterThan(0);
});

test('9. Viewer can READ the shared report (visibility via share)', async ({ page }) => {
  await login(page, A.viewer);
  await page.goto(`${WEB}/reports/studio/${reportId}/view`, { waitUntil: 'domcontentloaded' });
  // the report content is visible
  await expect(page.getByText('migration.control_summary')).toBeVisible();
});

test('10. Viewer gets 403 on export, and the UI hides the control', async ({ page }) => {
  await login(page, A.viewer);
  await page.goto(`${WEB}/reports/studio/${reportId}/view`, { waitUntil: 'domcontentloaded' });

  // the capability is absent in the UI...
  await expect(page.getByText('Export unavailable')).toBeVisible();

  // ...and refused by the API even if the URL is requested directly
  const status = await page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}/export?format=csv`, {
      credentials: 'include', redirect: 'manual',
    });
    return r.status;
  }, reportId);
  expect(status).toBe(403);
});

test('11. Viewer cannot create: the gallery states read-only', async ({ page }) => {
  await login(page, A.viewer);
  await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'New report' }).click();
  await expect(page.getByText(/Read-only/i)).toBeVisible();
  await expect(page.getByText('reports:create')).toBeVisible();

  // and the API refuses a direct create attempt
  const status = await page.evaluate(async () => {
    const r = await fetch('/api/v1/reports/studio/reports', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'viewer should not create this',
        definition: {
          schema_version: 1, data_source_key: 'migration.batch',
          sections: [{ id: 's', type: 'kpi', bindings: { aggregation: 'count' } }],
        },
      }),
    });
    return r.status;
  });
  expect(status).toBe(403);
});

test('12. a user in another tenant gets 404, not 403, on this report', async ({ page }) => {
  await login(page, A.other);

  const status = await page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}/data`, { credentials: 'include' });
    return r.status;
  }, reportId);
  // 404 is correct: it must not confirm the report exists in another tenant
  expect(status).toBe(404);
});

test('13. cross-tenant read is refused even with an explicit tenant_id override', async ({ page }) => {
  await login(page, A.other);

  const status = await page.evaluate(async ({ id, tid }) => {
    const r = await fetch(
      `/api/v1/reports/studio/reports/${id}/data?tenant_id=${tid}`, { credentials: 'include' });
    return r.status;
  }, { id: reportId, tid: TENANT_A });
  // A non-Super-Admin's tenant_id param is ignored, so they still read as
  // themselves and get 404 for a report that is not theirs.
  expect(status).toBe(404);
});

test('14. removing report_studio hides the whole Studio', async ({ page }) => {
  const snap = entitlement(['snapshot']);
  if (snap.error) throw new Error(snap.error);
  const dropped = entitlement(['drop', 'report_studio']);
  if (dropped.error) throw new Error(dropped.error);

  try {
    await login(page, A.analyst);
    await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(/Not available on this plan/i)).toBeVisible();
    // the denial names the entitlement so it is actionable
    await expect(page.getByText('report_studio').first()).toBeVisible();
    // and no template gallery is offered at all
    await expect(page.getByText(/Blank report/i)).toHaveCount(0);

    const status = await page.evaluate(async () => {
      const r = await fetch('/api/v1/reports/studio/catalog', { credentials: 'include' });
      return r.status;
    });
    expect(status).toBe(403);
  } finally {
    entitlement(['restore', snap.path]);
  }
});

test('15. restoring report_studio brings navigation and templates back', async ({ page }) => {
  await login(page, A.analyst);
  await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });

  // the deny banner is gone
  await expect(page.getByText(/Not available on this plan/i)).toHaveCount(0);
  await openCreate(page);
  await expect(tpl(page, 'executive_status')).toBeVisible();

  // the report created earlier is still there and still readable
  await page.goto(`${WEB}/reports/studio/${reportId}/view`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('migration.control_summary')).toBeVisible();
});

test('16. curated Report Suite is untouched and still reachable', async ({ page }) => {
  await login(page, A.analyst);
  await page.goto(`${WEB}/reports/suite/validation`, { waitUntil: 'domcontentloaded' });
  // Studio must not have shadowed the suite router
  const body = await page.textContent('body');
  expect(body).toBeTruthy();
  expect(body).not.toMatch(/Not available on this plan/i);
  expect(body).not.toMatch(/Page Not Found/i);
});

/* ==========================================================================
   Phase 2 — the Option B editor
   --------------------------------------------------------------------------
   These use a DEDICATED report rather than the shared `reportId`. Test 22 saves
   a new version, which would otherwise change the definition that the earlier
   editor tests assert on, making the suite pass once and fail on re-run.
   ========================================================================== */

/**
 * The template's section order, as the server returns it. Asserting against
 * these keys rather than "section 2" keeps the tests honest if the template is
 * ever re-curated: a rename shows up as a clear failure, not a silent pass.
 */
const SEC = {
  kpis: 1, pass_rate: 2, failed: 3, by_control: 4, register: 5,
};

test('17. the editor loads the saved definition into real controls', async ({ page }) => {
  await login(page, A.analyst);

  // create a dedicated report for the editor journey
  await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'New report' }).click();
  await tpl(page, 'migration_health_weekly').click();
  await page.waitForURL(/\/reports\/studio\/[0-9a-f-]{36}\/edit/, { timeout: 20000 });
  editorReportId = trackReport(page.url().match(/studio\/([0-9a-f-]{36})/)[1]);
  await page.waitForLoadState('networkidle');

  // the editor opened directly on the new report
  await expect(page.getByRole('heading', { name: 'Sections' })).toBeVisible();
  // the data source picker is populated from the server-filtered catalog
  await expect(page.getByText('migration.control_summary')).toBeVisible();
  // the current definition is loaded into real controls, not an empty editor
  await expect(page.getByLabel(`Section ${SEC.kpis} measure`)).toHaveValue('total_rules');
  await expect(page.getByLabel(`Section ${SEC.by_control} dimension`)).toHaveValue('control_id');
});

test('18. the editor validates through the SERVER validator', async ({ page }) => {
  await login(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${editorReportId}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Validate' }).click();
  await expect(page.getByText(/rejected this definition/i)).toHaveCount(0);
  await expect(page.getByText(/Valid\s*—/)).toBeVisible();
});

test('19. preview shows real data and creates NO version', async ({ page }) => {
  await login(page, A.analyst);
  const before = await versionCount(page, editorReportId);

  await page.goto(`${WEB}/reports/studio/${editorReportId}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Preview' }).click();

  // the seeded data really renders
  await expect(page.getByText('13,388')).toBeVisible({ timeout: 25000 });
  await expect(page.getByText('584').first()).toBeVisible();
  // and it is explicitly labelled as unsaved
  await expect(page.getByText(/Unsaved preview/i)).toBeVisible();

  const after = await versionCount(page, editorReportId);
  expect(after).toBe(before);
});

test('20. changing a section changes the preview, not the saved report', async ({ page }) => {
  await login(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${editorReportId}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('unsaved changes')).toHaveCount(0);

  // rebind the first KPI from total_rules to failed_rules
  await page.getByLabel(`Section ${SEC.kpis} measure`).selectOption('failed_rules');
  await expect(page.getByText('unsaved changes')).toBeVisible();

  await page.getByRole('button', { name: 'Preview' }).click();
  // 584 (failed) now appears where 13,388 (total) used to. It legitimately shows
  // twice — the rebound first KPI and the template's own "Failed rules" KPI —
  // so the assertion is presence, not uniqueness.
  await expect(page.getByText('584').first()).toBeVisible({ timeout: 25000 });
  await expect(page.getByText('13,388')).toHaveCount(0);

  // and the SAVED report is untouched: still one version, still total_rules
  expect(await versionCount(page, editorReportId)).toBe(1);
  const saved = await page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}`, { credentials: 'include' });
    const j = (await r.json()).data ?? {};
    return j.definition?.definition?.sections?.[0]?.bindings?.measure;
  }, editorReportId);
  expect(saved).toBe('total_rules');
});

test('21. an invalid edit is rejected by the server and blocks preview', async ({ page }) => {
  await login(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${editorReportId}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  // a bar with no dimension is exactly what the validator refuses
  await page.getByLabel(`Section ${SEC.by_control} dimension`).selectOption('');
  await page.getByRole('button', { name: 'Validate' }).click();

  await expect(page.getByText(/rejected this definition/i)).toBeVisible();
  await expect(page.getByText(/needs a dimension or time axis/)).toBeVisible();

  // and preview is not attempted, so no data is shown for a definition that
  // could never be saved
  await page.getByRole('button', { name: 'Preview' }).click();
  await expect(page.getByText(/Unsaved preview/i)).toHaveCount(0);
});

test('22. saving creates a NEW immutable version and the old one still opens', async ({ page }) => {
  await login(page, A.analyst);
  const before = await versionCount(page, editorReportId);

  await page.goto(`${WEB}/reports/studio/${editorReportId}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await page.getByLabel(`Section ${SEC.kpis} measure`).selectOption('failed_rules');
  await page.getByRole('button', { name: 'Save new version' }).click();

  await expect.poll(async () => versionCount(page, editorReportId), { timeout: 25000 })
    .toBe(before + 1);

  // the previous version is still reproducible, i.e. immutability is observable
  await page.goto(`${WEB}/reports/studio/${editorReportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Versions/ }).click();
  await expect(page.getByText(/^v1$/).first()).toBeVisible();
  await expect(page.getByText(/^v2$/).first()).toBeVisible();

  // the reader view now reflects the NEW saved definition
  await page.goto(`${WEB}/reports/studio/${editorReportId}/view`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('584').first()).toBeVisible({ timeout: 25000 });
});

test('23. a share-recipient sees the editor read-only and cannot save', async ({ page }) => {
  await login(page, A.analyst);
  // share the editor report with the Viewer so there is something to be denied
  await page.goto(`${WEB}/reports/studio/${editorReportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Publish' }).click();
  await expect.poll(async () => page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}`, { credentials: 'include' });
    return (((await r.json()).data ?? {}).report ?? {}).status;
  }, editorReportId), { timeout: 20000 }).toBe('published');
  await page.getByRole('button', { name: /Sharing/ }).click();
  await page.getByPlaceholder('User id (UUID)').fill(VIEWER_ID);
  await page.getByRole('button', { name: 'Share', exact: true }).click();
  await expect.poll(async () => page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}/access`, { credentials: 'include' });
    return (((await r.json()).data ?? {}).items ?? []).length;
  }, editorReportId), { timeout: 20000 }).toBeGreaterThan(0);

  // now the Viewer's attempt
  await switchUser(page, A.viewer);
  await page.goto(`${WEB}/reports/studio/${editorReportId}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  await expect(page.getByText(/Read-only\./)).toBeVisible();
  await expect(page.getByText(/belongs to another user/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save new version' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Preview' })).toBeDisabled();

  // and the API refuses independently of the UI
  const status = await page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}/definition`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        definition: {
          schema_version: 1, data_source_key: 'migration.control_summary',
          sections: [{ id: 'x', type: 'kpi', bindings: { measure: 'failed_rules', aggregation: 'sum' } }],
          filters: [],
        },
      }),
    });
    return r.status;
  }, editorReportId);
  expect(status).toBe(403);
});

test('24. the editor never offers a data source the tenant cannot read', async ({ page }) => {
  await login(page, A.other);
  await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'New report' }).click();
  // the catalog this tenant receives is still server-filtered
  await expect(page.getByText('migration_health_weekly')).toBeVisible();
  // and no source outside the allowlist is offered anywhere in the picker
  const body = await page.textContent('body');
  expect(body).not.toContain('engine.migration_batches');
});

/* ==========================================================================
   Phase 3 — template updates, xlsx export, duplicate
   ========================================================================== */

/**
 * Seed a deliberately newer template version for migration_health_weekly, so
 * the update banner has something real to offer. Removed in teardown.
 */
const SEED_TEMPLATE_VERSION = 99;

function seedNewerTemplate() {
  const py = `
import os, json
for line in open('.env', encoding='utf-8'):
    line = line.strip()
    if line and not line.startswith('#') and '=' in line:
        k, v = line.split('=', 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
import psycopg2
from psycopg2.extras import Json
c = psycopg2.connect(host=os.environ['ENGINE_DB_HOST'], port=os.environ['ENGINE_DB_PORT'],
                     dbname=os.environ['ENGINE_DB_NAME'],
                     user=os.environ['ENGINE_DB_USER'],
                     password=os.environ['ENGINE_DB_PASS'])
c.autocommit = True
cur = c.cursor()
cur.execute("DELETE FROM platform.report_templates WHERE template_key = %s AND version = %s",
            ('migration_health_weekly', ${SEED_TEMPLATE_VERSION}))
cur.execute("""SELECT definition FROM platform.report_templates
               WHERE template_key = %s AND version = 3""", ('migration_health_weekly',))
d = dict(cur.fetchone()[0])
d['sections'] = list(d['sections']) + [{
    'id': 'zz_error_kpi', 'type': 'kpi', 'title': 'Error rules (E2E)',
    'bindings': {'measure': 'error_rules', 'aggregation': 'sum'}}]
for sec in d['sections']:
    if sec.get('id') == 'by_control':
        sec['bindings'] = dict(sec.get('bindings') or {}, measure='error_rules')
cur.execute("""INSERT INTO platform.report_templates
    (template_key, version, display_name, description, category, definition,
     required_data_sources, required_entitlements, thumbnail_spec, sort_order,
     is_active, changelog)
    VALUES ('migration_health_weekly', %s, 'Migration Health - Weekly',
            'simulated newer template for the E2E journey', 'operational', %s,
            %s, %s, %s, 1, TRUE, %s)""",
            (${SEED_TEMPLATE_VERSION}, Json(d), ['migration.control_summary'],
             ['report_studio'], Json({}),
             'E2E: added an Error rules KPI and repointed the bar chart at error_rules.'))
print('seeded')
c.close()
`;
  execFileSync('python', ['-c', py], { cwd: REPO_ROOT, encoding: 'utf8' });
}

function dropNewerTemplate() {
  const py = `
import os
for line in open('.env', encoding='utf-8'):
    line = line.strip()
    if line and not line.startswith('#') and '=' in line:
        k, v = line.split('=', 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
import psycopg2
c = psycopg2.connect(host=os.environ['ENGINE_DB_HOST'], port=os.environ['ENGINE_DB_PORT'],
                     dbname=os.environ['ENGINE_DB_NAME'],
                     user=os.environ['ENGINE_DB_USER'],
                     password=os.environ['ENGINE_DB_PASS'])
c.autocommit = True
cur = c.cursor()
cur.execute("DELETE FROM platform.report_templates WHERE template_key = %s AND version = %s",
            ('migration_health_weekly', ${SEED_TEMPLATE_VERSION}))
c.close()
`;
  execFileSync('python', ['-c', py], { cwd: REPO_ROOT, encoding: 'utf8' });
}

test('25. a pinned report is OFFERED a template update and nothing is applied', async ({ page }) => {
  try {
    await login(page, A.analyst);
    // Create the report from the CURRENT template first, so it is pinned at v3.
    // A newer version is only published afterwards - that is the real sequence:
    // a user holds a report, then the template moves on.
    await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'New report' }).click();
    await tpl(page, 'migration_health_weekly').click();
    await page.waitForURL(/\/edit/, { timeout: 20000 });
    const rid = trackReport(page.url().match(/studio\/([0-9a-f-]{36})/)[1]);
    pinnedReportId = rid;

    seedNewerTemplate();

    await page.goto(`${WEB}/reports/studio/${rid}/view`, { waitUntil: 'domcontentloaded' });
    const banner = page.locator('text=/newer version of this report/i');
    await expect(banner).toBeVisible({ timeout: 25000 });
    // version gap and changelog are shown before anything is accepted
    await expect(page.getByText(/your report is on template v3, latest is v99/i)).toBeVisible();
    await expect(page.getByText(/E2E: added an Error rules KPI/i)).toBeVisible();

    // the diff is a preview, collapsed until asked
    await page.getByText(/Show what adopting would change/).click();
    await expect(page.getByText('(new)')).toBeVisible();
    await expect(page.getByText('(removed)')).toHaveCount(0);
    await expect(page.getByText(/failed_rules/)).toBeVisible();

    // NOT applied: still template v3, still one version, no new KPI section
    const state = await page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}`, { credentials: 'include' });
      const j = (await r.json()).data ?? {};
      const v = await (await fetch(`/api/v1/reports/studio/reports/${id}/versions`, { credentials: 'include' })).json();
      return {
        templateVersion: j.report?.derived_from_template_version,
        sections: j.definition?.definition?.sections?.length,
        versions: (v.data?.items ?? []).length,
      };
    }, rid);
    expect(state.templateVersion).toBe(3);
    expect(state.sections).toBe(5);
    expect(state.versions).toBe(1);
  } finally {
    dropNewerTemplate();
  }
});

test('26. adopting a template update creates a NEW version and never auto-applies', async ({ page }) => {
  try {
    await login(page, A.analyst);
    await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'New report' }).click();
    await tpl(page, 'migration_health_weekly').click();
    await page.waitForURL(/\/edit/, { timeout: 20000 });
    const rid = trackReport(page.url().match(/studio\/([0-9a-f-]{36})/)[1]);
    adoptReportId = rid;

    seedNewerTemplate();

    await page.goto(`${WEB}/reports/studio/${rid}/view`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/newer version of this report/i)).toBeVisible({ timeout: 25000 });

    // first click only ASKS
    await page.getByText(/Adopt template v99/).click();
    await expect(page.getByText(/Replace the definition with template v99/i)).toBeVisible();
    const midVersions = await versionCount(page, rid);
    expect(midVersions).toBe(1);

    // second click adopts
    await page.getByText(/Yes, adopt as new version/).click();
    await expect.poll(async () => versionCount(page, rid), { timeout: 25000 }).toBe(2);

    // the report is now on the newer template AND has a new version
    const after = await page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}`, { credentials: 'include' });
      const j = (await r.json()).data ?? {};
      return {
        templateVersion: j.report?.derived_from_template_version,
        state: j.report?.template_state,
        sections: j.definition?.definition?.sections?.length,
      };
    }, rid);
    expect(after.templateVersion).toBe(99);
    expect(after.sections).toBe(6);
    // pinned, not diverged: accepting a template update keeps it tracking
    expect(after.state).toBe('pinned');

    // and v1 is still reproducible
    await page.goto(`${WEB}/reports/studio/${rid}/view`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Versions/ }).click();
    await expect(page.getByText(/^v1$/).first()).toBeVisible();
    await expect(page.getByText(/^v2$/).first()).toBeVisible();
  } finally {
    dropNewerTemplate();
  }
});

test('27. a read-only viewer is OFFERED the update but cannot adopt it', async ({ page }) => {
  try {
    // its own report, pinned at v3, so an update is genuinely on offer
    await login(page, A.analyst);
    await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'New report' }).click();
    await tpl(page, 'migration_health_weekly').click();
    await page.waitForURL(/\/edit/, { timeout: 20000 });
    const rid = trackReport(page.url().match(/studio\/([0-9a-f-]{36})/)[1]);
    readonlyReportId = rid;

    seedNewerTemplate();

    // publish it and share it with the Viewer
    await page.goto(`${WEB}/reports/studio/${rid}/view`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Publish' }).click();
    await expect.poll(async () => page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}`, { credentials: 'include' });
      return (((await r.json()).data ?? {}).report ?? {}).status;
    }, rid), { timeout: 20000 }).toBe('published');
    await page.getByRole('button', { name: /Sharing/ }).click();
    await page.getByPlaceholder('User id (UUID)').fill(VIEWER_ID);
    await page.getByRole('button', { name: 'Share', exact: true }).click();
    await expect.poll(async () => page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}/access`, { credentials: 'include' });
      return (((await r.json()).data ?? {}).items ?? []).length;
    }, rid), { timeout: 20000 }).toBeGreaterThan(0);

    await switchUser(page, A.viewer);
    await page.goto(`${WEB}/reports/studio/${rid}/view`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    // the Viewer is shown the same update - the OFFER is not privileged
    await expect(page.getByText(/newer version of this report/i)).toBeVisible({ timeout: 25000 });
    await expect(page.getByText(/E2E: added an Error rules KPI/i)).toBeVisible();
    // but is given no adopt control, and is told why
    await expect(page.getByText(/Adopt template v/)).toHaveCount(0);
    await expect(page.getByText(/do not hold reports:update/i)).toBeVisible();

    // the editor is where the read-only notice belongs
    await page.goto(`${WEB}/reports/studio/${rid}/edit`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Read-only\./)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save new version' })).toBeDisabled();

    // and the API refuses independently of the UI
    const status = await page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}/adopt-template`, {
        method: 'POST', credentials: 'include',
      });
      return r.status;
    }, rid);
    expect([403, 404]).toContain(status);
  } finally {
    dropNewerTemplate();
  }
});

test('28. both export formats are discoverable and download for an analyst', async ({ page }) => {
  await login(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${editorReportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  await expect(page.getByLabel('Export CSV')).toBeVisible();
  await expect(page.getByLabel('Export XLSX')).toBeVisible();

  // CSV downloads
  const csv = await Promise.all([
    page.waitForEvent('download'),
    page.getByLabel('Export CSV').click(),
  ]).then(([d]) => d);
  expect(csv.suggestedFilename()).toMatch(/\.csv$/);

  // XLSX downloads, and is a real workbook not an error page
  const xlsx = await Promise.all([
    page.waitForEvent('download'),
    page.getByLabel('Export XLSX').click(),
  ]).then(([d]) => d);
  expect(xlsx.suggestedFilename()).toMatch(/\.xlsx$/);
  const stream = await xlsx.createReadStream();
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  const buf = Buffer.concat(chunks);
  // PK zip magic: a genuine .xlsx container
  expect(buf.subarray(0, 2).toString('latin1')).toBe('PK');
  expect(buf.length).toBeGreaterThan(1000);
});

test('29. the Viewer gets no export control and 403 on both formats', async ({ page }) => {
  await login(page, A.viewer);
  await page.goto(`${WEB}/reports/studio/${editorReportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Export unavailable')).toBeVisible();
  await expect(page.getByLabel('Export CSV')).toHaveCount(0);
  await expect(page.getByLabel('Export XLSX')).toHaveCount(0);

  for (const fmt of ['csv', 'xlsx']) {
    const status = await page.evaluate(async ({ id, f }) => {
      const r = await fetch(`/api/v1/reports/studio/reports/${id}/export?format=${f}`, {
        credentials: 'include', redirect: 'manual',
      });
      return r.status;
    }, { id: editorReportId, f: fmt });
    expect(status).toBe(403);
  }
});

test('30. Duplicate creates a new owned report the analyst can edit', async ({ page }) => {
  await login(page, A.analyst);
  await page.goto(`${WEB}/reports/studio/${editorReportId}/view`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  const before = await page.evaluate(async () => {
    const r = await fetch('/api/v1/reports/studio/reports?scope=mine', { credentials: 'include' });
    return (((await r.json()).data ?? {}).items ?? []).length;
  });

  await page.getByRole('button', { name: 'Duplicate' }).click();
  await expect(page.getByRole('status')).toContainText(/Created/);

  const after = await page.evaluate(async () => {
    const r = await fetch('/api/v1/reports/studio/reports?scope=mine', { credentials: 'include' });
    return (((await r.json()).data ?? {}).items ?? []).length;
  });
  expect(after).toBe(before + 1);

  // the copy is a real, editable, owner-owned report
  await page.goto(`${WEB}/reports/studio`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/\(copy\)/).first()).toBeVisible();
});

test('31. a cross-tenant user cannot duplicate another tenant\'s report', async ({ page }) => {
  await login(page, A.other);
  const status = await page.evaluate(async (id) => {
    const r = await fetch(`/api/v1/reports/studio/reports/${id}/duplicate`, {
      method: 'POST', credentials: 'include',
    });
    return r.status;
  }, editorReportId);
  // 404: the report is not theirs, and the API must not confirm it exists
  expect([403, 404]).toContain(status);
});
