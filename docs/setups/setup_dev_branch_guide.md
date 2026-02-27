# 🧱 Setting Up a Dev Branch for Your GitHub Project

This guide explains how to create and maintain a **development (dev)** branch for your project.  
It helps keep your **main** branch stable while allowing continuous feature development.

---

## 🔍 Why Use a Dev Branch?

| Branch | Purpose |
|--------|----------|
| `main` | Always stable and production-ready. |
| `dev` | Used for developing and testing new features. |

**Benefits:**
- Keeps `main` clean and deployable.
- Easier rollback when something breaks.
- Enables multiple people to collaborate safely.
- Makes releases more predictable.

---

## 🪜 Step-by-Step Setup

### 1. Check Your Current Branch
```bash
git branch
```
You should see:
```
* main
```

### 2. Create a Dev Branch
```bash
git checkout -b dev
git push origin dev
```
✅ This creates the branch locally and uploads it to GitHub.

### 3. Confirm Dev Branch Exists
```bash
git branch -a
```
Expected output:
```
* dev
  main
  remotes/origin/dev
  remotes/origin/main
```

### 4. Set Dev as Your Working Branch
Use `dev` for all new work:
```bash
git checkout dev
git pull origin dev
```

---

## 🧩 Creating Feature Branches

When you start a new task or feature:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/finance-analytics
```

After finishing:
```bash
git add .
git commit -m "1) Add /dashboard/finance endpoint. 2) Add role-based filtering to stats. 3) Redesign dashboard layout. 4) Add collapsible headers and icons."
git push origin feature/finance-analytics



```

Then open a **Pull Request (PR)** on GitHub from:
```
feature/finance-analytics → dev
```

Once reviewed and tested, merge it into `dev` but dont have to and can be done later.

---

# make sure you’re on the first feature branch
git checkout feature/finance-analytics

# make sure it’s up to date
git pull origin feature/finance-analytics

# create the new feature branch from it
git checkout -b feature/finance-analytics_2.3.2.1_part_2
---



---

## 🧱 Releasing to Main

When the `dev` branch is stable and ready for release:
1. Open a PR from `dev → main`
2. Merge after testing
3. (Optional) Tag a release:
```bash
git tag -a v1.3.0 -m "Version 1.3.0 release"
git push origin v1.3.0
```

---

## 🛡️ Protecting the Main Branch

In **GitHub → Settings → Branches → Add Rule**:
- Pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

---

## 🧭 Recommended Branch Layout

| Branch | Example | Purpose |
|--------|----------|----------|
| `main` | Production-ready code | Stable and deployable |
| `dev` | Ongoing work | Integration testing |
| `feature/dashboard-redesign` | Temporary branch | New features |
| `fix/tenant-filter` | Hotfix | Urgent bug fixes |

---

## 🧩 Summary Commands

| Task | Command |
|------|----------|
| Create dev | `git checkout -b dev && git push origin dev` |githh
| Switch to dev | `git checkout dev` |
| Create feature | `git checkout -b feature/name` |
| Merge feature to dev | PR on GitHub |
| Merge dev to main | PR on GitHub |
| Sync before coding | `git pull origin dev` |

---

## 🧰 Maintenance Tips
- Always commit small, meaningful changes.
- Pull latest from `dev` before starting work.
- Use PRs to merge instead of direct pushes.
- Tag releases after merging to `main`.

---

**Project Example: School Management System**
- `main`: Deployed working app (production)
- `dev`: Active phase (e.g., dashboard redesign, analytics)
- `feature/finance-api`: Feature branch for new finance endpoint

---
