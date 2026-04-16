🗄️ 2) DATABASE DUMPS

Run these commands (PostgreSQL):

🔹 ENGINE DB
pg_dump -U postgres -d engine_db -F c -f engine_v2_0.dump
🔹 SOURCE DB
pg_dump -U postgres -d migration_source -F c -f migration_source_v2_0.dump
🔹 TARGET DB
pg_dump -U postgres -d migration_target -F c -f migration_target_v2_0.dump
🔁 Restore Example
pg_restore -U postgres -d new_db engine_v2_0.dump
🧾 3) .gitignore (IMPORTANT)

Add:

__pycache__/
*.pyc
.env
*.log

# Ignore large dumps if needed
*.dump

👉 If dumps are large → don’t commit, store externally (recommended)

🚀 4) GIT COMMANDS (PRODUCTION SAFE)
🔹 Step 1 – Initialise (if not done)
git init
git branch -M main
🔹 Step 2 – Add Files
git add .
🔹 Step 3 – Commit
git commit -m "v2.0-development: Stable baseline before automation layer"
🔹 Step 4 – Add Remote
-- NOT NEEDED git remote add origin <your-repo-url>
🔹 Step 5 – Push
-- NOT NEEDED git push -u origin main
🔹 Step 6 – CREATE TAG (VERY IMPORTANT)
git tag -a v2.0 -m "Stable pre-automation release (Phases 1–7 complete)"
🔹 Step 7 – Push Tag
git push origin v2.0
🔒 BEST PRACTICE (VERY IMPORTANT)

Before continuing:

✅ Tag created
✅ Dumps stored
✅ Docs committed
✅ Repo clean

🧠 Final Advice

This is now your:

👉 “Last stable manual version”

Everything next (auto discovery, mapping, onboarding):

➡️ Should branch from here:

git checkout -b feature/auto-discovery
🚀 NEXT STEP

When ready:

👉 Say:

“Build metadata_discovery.py (production ready)”

And we’ll move into Phase 8 properly.