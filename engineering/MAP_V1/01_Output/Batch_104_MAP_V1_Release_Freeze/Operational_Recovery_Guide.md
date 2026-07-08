# Operational Recovery Guide — MAP V1

**Version:** 4.1  
**Date:** 2026-07-08  

---

## FERNET_KEY Recovery

### Location
Fernet key is used for credential encryption in the database.

### Recovery Steps
1. Check `config.yaml` for encryption settings
2. If key is lost, credentials must be re-encrypted with a new key
3. Use `app/scripts/reset_credentials.py` to reset credentials after key recovery

### Prevention
- Store FERNET_KEY in a secure secrets manager
- Never commit FERNET_KEY to version control
- Maintain a backup of the key in a separate secure location

---

## PostgreSQL Permission Recovery

### Issue
Database connections may fail due to permission changes or role modifications.

### Recovery Steps
1. Verify PostgreSQL is running: `pg_isready`
2. Check user permissions: `\du` in psql
3. Grant required permissions:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE migration_engine TO postgres;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
   ```
4. Test connection: `psql -U postgres -d migration_engine -c "\dt"`

---

## Credential Validation

### Checklist
- [ ] FERNET_KEY is set and accessible
- [ ] JWT_SECRET_KEY is configured
- [ ] Database credentials match `.env` configuration
- [ ] Admin credentials are verified (APP_ADMIN_USER, APP_ADMIN_PASS)

### Verification Commands
```bash
# Test database connection
psql -U postgres -d migration_engine -c "SELECT 1"

# Verify encryption
python -c "from cryptography.fernet import Fernet; print('Fernet OK')"
```

---

## Database Recovery

### From Backup
```bash
pg_restore -U postgres -d migration_engine MAP_V1_v4.1_migration_engine.dump
```

### Verification After Recovery
```bash
psql -U postgres -d migration_engine -c "\dt"
```

---

## Validation Checklist

| Check | Command | Expected |
|---|---|---|
| App starts | `python -m app.main --help` | Help output |
| DB connection | `psql -U postgres -d migration_engine` | Connected |
| API responds | `curl http://localhost:8000/docs` | Swagger UI |
| Rules loaded | Check `app/rules/__init__.py` | C01-C010 imported |

---

## Lessons Learned (Batch 102–103)

### Batch 102
- Credential rotation requires coordinated key update across all services
- PostgreSQL permission changes propagate with pg_reload_conf()
- Always backup before modifying database roles

### Batch 103
- FERNET_KEY must be consistent across environments
- JWT token expiry should be configured per environment
- Database connection pooling requires careful tuning for production

---

**Signed off:** Batch 104 — MAP V1 Version 4.1
