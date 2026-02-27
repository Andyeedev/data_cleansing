It explains exactly how to:

✅ create a new repository

✅ upload your project for the first time

✅ push and pull updates thereafter

# 📘 Git & GitHub Guide for Dynamic SMS App

This guide explains how to create a new Git repository, upload your project to GitHub, and manage updates.

---

## 🧱 1. Create a New Git Repository

If your project folder is not yet a git repo:

```bash
git init
```

This creates a hidden `.git` folder to track changes.

---

## 🔗 2. Connect to a GitHub Repository

1. Go to [https://github.com/new](https://github.com/new) and create a new repository.  
   Example: `dynamic_sms_app_phase_2.3`

2. Copy the HTTPS link (e.g.):
   ```
   https://github.com/Andyeedev/dynamic_sms_app_phase_2.3.git
   ```

3. Link it to your local repo:

```bash
git remote add origin https://github.com/Andyeedev/dynamic_sms_app_phase_2.3.git
```

To verify:

```bash
git remote -v
```

---

## 📤 3. Upload Your Project (First Time)

1. Add all files:
   ```bash
   git add .
   ```

2. Commit your changes:
   ```bash
   git commit -m "Initial commit - stable working version"
   ```

3. Rename branch to `main` (if not already):
   ```bash
   git branch -M main
   ```

4. Push to GitHub:
   ```bash
   git push -u origin main
   ```

✅ Your project is now live on GitHub!

---

## 🔄 4. Regular Workflow (After Initial Upload)

### 🧭 To Check Status:
```bash
git status
```

### 📦 To Stage All Changes:
```bash
git add .
```

### 💬 To Commit:
```bash
git commit -m "Describe your update here"
```

### 🚀 To Push Updates:
```bash
git push
```

### ⬇️ To Pull Latest Updates (from GitHub):
```bash
git pull
```

---

## 👤 5. Configure Git User (If Not Set)

If you see `Author identity unknown` errors:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## ⚙️ 6. Optional Commands

| Command | Description |
|----------|--------------|
| `git log --oneline` | View concise commit history |
| `git branch` | See current branch |
| `git remote -v` | Check remote connections |
| `git diff` | Show unstaged changes |
| `git restore <file>` | Revert a file before commit |

---

## 🧹 7. Notes

- Always **commit frequently** with clear messages.
- Never push secrets or `.env` files (they are already ignored via `.gitignore`).
- For large updates, test locally before pushing.

---

💡 **Tip:**  
Use the built-in **Source Control panel** in VS Code for an easier visual experience. It integrates all these commands.

---

**Author:** Project Development Team  
**Date:** 2025-10-26


Create a new branch (recommended for big features)

Use this if:

You’re starting the multi-tenant owner refactor

You want to clearly separate this work from the current stable code

Pros:
✅ Keeps current dev stable
✅ Easy to roll back or compare
✅ Great for pull requests

Cons:
❌ Slightly more to manage

Command flow: