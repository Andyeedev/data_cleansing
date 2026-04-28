Release_notes.md
# Release Notes — v3.0

## Highlights
- ✅ Multi-connection architecture stabilised
- ✅ SQL Server safely disabled (feature toggle)
- ✅ Connection resolver fully DB-driven
- ✅ Credential decryption integrated
- ✅ Batch execution engine stabilised
- ✅ Checkpoint recovery implemented
- ✅ Rule enable/disable via config.yaml

---

## Fixes
- Fixed missing batch_id issue
- Fixed adapter initialisation failures
- Fixed connection factory validation
- Removed dependency on static source/target config

---

## Known Limitations
- SQL Server adapter disabled
- Limited adapter validation layer

---

## Next Version (v3.1)
- Multi-active connections
- Adapter validation framework
- Connection health checks