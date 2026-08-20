# Git Upload Instructions — v5.07

## Step 1 — Check Status

```bash
git status
```

---

## Step 2 — Create New Branch

```bash
git checkout feature/map-v2-mvp
git checkout -b feature/workstream-07-task_management
```

---

## Step 3 — Add All Files

```bash
git add .
```

---

## Step 4 — Commit

```bash
git commit -m "v5.07: Validation Engine - MAP Pipeline Complete

- SQL Server MARS fix (MARS_Connection=Yes)
- Connection pool exhaustion fix (db.close() in finally blocks)
- Control status logic fixed (SKIPPED for C02-C09)
- detail_json populated for ALL statuses
- System 2 (Operations -> Execution) reuses System 1 services
- Governance Check runs full MAP CLI via subprocess
- Fix Options API (pattern-based error->fix resolution)
- ControlReportModal with latest-batch resolution
- Auth: JWT expiry validation, 401 redirect
- 115 database tables, 19 views, 91 FKs, 220 indexes
- 34 API route files, 191 backend Python files
- 87 frontend route pages, 46 components, 140 TSX files

Total: Complete MAP Validation Pipeline."
```

---

## Step 5 — Push Branch

```bash
git push --set-upstream origin feature/workstream-07-task_management
git push
```

---

## Step 6 — Tag Release

```bash
git tag -a v5.07 -m "v5.07: Validation Engine - MAP Pipeline Complete"
git push origin v5.07
```

---

## Step 7 — Create Next Version Branch (Optional)

```bash
git checkout -b feature/v5_08-next-phase
git push -u origin feature/v5_08-next-phase
```

---

## Summary

After completion, repository will be:

- ✅ Versioned (v5.07)
- ✅ Tagged
- ✅ Branched (feature/workstream-07-task_management)
- ✅ Ready for next iteration

---

## Version

**Version:** v5.07

**Branch:** `feature/workstream-07-task_management`
