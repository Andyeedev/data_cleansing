# Git Upload Instructions — v5.06

## Step 1 — Check Status

```bash
git status
```

---

## Step 2 — Confirm Branch

```bash
git branch
```

Ensure current branch is:

```
feature/v5_06_baseline
```

---

## Step 3 — Add All Files

```bash
git add .
```

---

## Step 4 — Commit

```bash
git commit -m "v5.06: Platform Baseline Documentation - Complete Technical Baseline

- 96 database tables across 6 schemas
- 24 API routes with JWT auth
- 31 frontend pages, 62 components
- 195 backend tests passing
- 248 frontend tests passing
- Repository layer created (4 repositories)
- Security sanitisation complete

Total: Complete platform baseline documentation."
```

---

## Step 5 — Push Branch

```bash
git push --set-upstream origin feature/v5_06_baseline
git push
```

---

## Step 6 — Tag Release

```bash
git tag -a v5.06 -m "v5.06: Platform Baseline Documentation"
git push origin v5.06
```

---

## Step 7 — Create Next Version Branch (Optional)

```bash
git checkout -b feature/v5_07-next-phase
git push -u origin feature/v5_07-next-phase
```

---

## Summary

After completion, repository will be:

- ✅ Versioned
- ✅ Tagged
- ✅ Ready for next iteration

---

## Version

**Version:** v5.06

**Branch:** `feature/v5_06_baseline`
