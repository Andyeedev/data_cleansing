

Excellent. This is exactly how a product team operates at release time.

You are now at:

> **v1.5 – Mapping-Driven Execution Engine (Stable Core)**

Let’s handle this properly and professionally.

---

# ✅ 1) Legacy Status Check

From everything you've shown:

* `engine.rule_parameter_metadata` → **not used**
* `_get_rule_entities()` → using mapping join only
* No fallback executed
* Clean execution output

So yes — legacy is currently dormant, not active.

Leaving it renamed + unused is acceptable for now.

You are not accidentally using legacy anywhere based on current code.

---

# 🚀 2) Git Freeze – Copy & Paste Commands

You are in:

```
fs-migration-validation-engine
Branch: currently master (but should be data_cleansing)
```

First ensure correct branch:

```bash
git checkout data_cleansing
```

If it says branch does not exist locally:

```bash
git fetch origin
git checkout data_cleansing
```

---

## 🔹 Step 1 — Stage Everything

```bash
git add .
```

---

## 🔹 Step 2 — Commit (Suggested Message)

```bash
git commit -m "v1.5 - Mapping-Driven Execution Engine Stable | Rule-Dataset binding implemented | Legacy disabled | SaaS core foundation hardened"
```

Alternative shorter commit message:

```bash
git commit -m "v1.5 stable: mapping-driven architecture, rule_dataset_mapping introduced, legacy disabled"
```

---

## 🔹 Step 3 — Push

```bash
git push origin data_cleansing
```

---

## 🔹 Step 4 — Create Tag (Freeze Version)

Recommended tag format:

```bash
git tag -a v1.5 -m "Release v1.5 - Mapping-Driven Execution Engine"
git push origin v1.5
```

This freezes this exact state permanently.

---

## 🔹 Step 5 — How to Pull Project Back Later

To pull latest branch:

```bash
git pull origin data_cleansing
```

To restore exactly v1.5:

```bash
git checkout v1.5
```

To create branch from v1.5 later:

```bash
git checkout -b feature_from_v1_5 v1.5
```


4️⃣ Best Way to Lock Down v1.4 Properly

Here’s your safe professional process:

✅ Step A — Full Database Backup

For each database:

pg_dump -U postgres -d engine_db -F c -f engine_v1_5.dump
pg_dump -U postgres -d source_db -F c -f source_v1_5.dump
pg_dump -U postgres -d target_db -F c -f target_v1_5.dump


pg_dump -U postgres -d engine_db -F c -f engine_v1_6.dump
pg_dump -U postgres -d source_db -F c -f source_v1_6.dump
pg_dump -U postgres -d target_db -F c -f target_v1_6.dump


pg_dump -U postgres -d engine_db -F c -f engine_v1_7.dump
pg_dump -U postgres -d source_db -F c -f source_v1_7.dump
pg_dump -U postgres -d target_db -F c -f target_v1_7.dump


pg_dump -U postgres -d engine_db -F c -f engine_v1_7.dump
pg_dump -U postgres -d source_db -F c -f source_v1_7.dump
pg_dump -U postgres -d target_db -F c -f target_v1_7.dump



pg_dump -U postgres -d engine_db -F c -f engine_v1_8.dump
pg_dump -U postgres -d source_db -F c -f source_v1_8.dump
pg_dump -U postgres -d target_db -F c -f target_v1_8.dump


pg_dump -U postgres -d engine_db -F c -f engine_v1_9.dump
pg_dump -U postgres -d source_db -F c -f source_v1_9.dump
pg_dump -U postgres -d target_db -F c -f target_v1_9.dump


Final Correct Release Workflow (For Future Versions)

For v1.7, v1.8, etc you will always do:

git add .
git commit -m "Release v1.7"
git push origin data_cleansing

git tag -a v1.7 -m "Validation Engine v1.7"
git push origin v1.7


git add .
git commit -m "Release v1.8"
git push origin v1.8-development

git tag -a v1.8 -m "v1.8-development"
git push origin v1.8-development

git checkout main
git pull origin main
git checkout -b v1.9-development



git checkout main
git pull origin main
git checkout -b v1.7-development


git add .
git commit -m "Release v1.7"
git push origin data_cleansing

git tag -a v1.7 -m "Validation Engine v1.7"
git push origin v1.7



git checkout main
git pull origin main
git checkout -b v1.78-development



git checkout data_cleansing
git pull origin data_cleansing
git checkout -b v1.7-development


Scenario 1 — v1.6 was committed to main (most common)

If you did:

git commit
git tag v1.6
git push origin main

Then the correct commands are:

git checkout main
git pull origin main
git checkout -b v1.7-development

Because main contains the stable release.

Scenario 2 — v1.6 was committed to data_cleansing

If your workflow is like:

main
 └── data_cleansing (active development branch)

and you committed/tagged v1.6 there, then you should run:

git checkout data_cleansing
git pull origin data_cleansing
git checkout -b v1.7-development

That ensures the new branch contains all the v1.6 co



python -m app.main discover --config config.yaml


git checkout main
git pull origin main
git merge v1.8-development
git push origin main





git add .
git commit -m "Release v1.8"
git push origin v1.8-development


git tag -a v1.8 -m "Release v1.8"
git push origin v1.8

git checkout -b v1.9-development




git add .
git commit -m "Release v1.8"
git push origin v1.8-development


git tag -a v1.8 -m "Release v1.9"
git push origin v1.8

git checkout -b v2.0-development