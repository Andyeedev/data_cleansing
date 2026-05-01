✅ 6. DATABASE_DUMP.md

# 🗄️ Database Dump Instructions

## 📦 Engine Database

```bash
pg_dump -U postgres -d migration_engine -F c -f migration_engine_v3_1.dump
```

---

## 📦 Source Database

```bash
pg_dump -U postgres -d migration_source -F c -f migration_source_v3_1.dump
```

---

## 📦 Target Database

```bash
pg_dump -U postgres -d migration_target -F c -f migration_target_v3_1.dump
```

---

## 📥 Restore Example

```bash
pg_restore -U postgres -d migration_engine migration_engine_v3_1.dump
```

---

## ⚠️ Notes

* Ensure PostgreSQL version compatibility
* Do not commit dump files >100MB (use storage if needed)

