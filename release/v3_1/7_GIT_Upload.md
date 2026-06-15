✅ 7. GIT_UPLOADS.md
# 🔧 Git Upload Instructions

## 🔹 Step 1 — Check status

```bash
git status
```

## 🔹 Step 2 — Confirm branch

```bash
git branch
```

Ensure current branch is:

```
v3.1-saas-multi-connection
```

---

## 🔹 Step 3 — Add & Commit

```bash
git add .
git commit -m "v3.1 stable baseline: SaaS multi-connection support, Postgres fully functional, SQL Server connection enabled (execution pending), rule discovery and scoring engine stabilised"
```

---

## 🔹 Step 4 — Push branch

```bash
git push --set-upstream origin v3.1-saas-multi-connection
git push
```

---

## 🔹 Step 5 — Tag release

```bash
git tag v3.1
git push origin v3.1
```

---

## 🌿 Step 6 — Create next version branch

```bash
git checkout -b v3.2-saas-multi-connection
git push -u origin v3.2-saas-multi-connection
```

---

## ✅ Done

Your repository is now:

* Versioned
* Tagged
* Ready for next iteration

✅ Done

Your repository is now:

Versioned
Tagged
Ready for next iteration