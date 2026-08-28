# Scenarios — Same 10 as Phase 12 12_0 §8

Place per-scenario delta scripts here (mirroring azure-test-data/sql/scenarios/):
- `01_exact_match.sql` — no delta (baseline PASS)
- `02_rowcount_mismatch.sql` — DELETE 1 row from TARGET.customers
- `03_missing_target_row.sql`
- `04_duplicate_key.sql`
- `05_numeric_mismatch.sql` — UPDATE TARGET.accounts SET balance = balance+100
- `06_null_difference.sql`
- `07_datatype_difference.sql`
- `08_referential_integrity.sql`
- `09_schema_difference.sql` — ALTER TABLE TARGET ADD COLUMN
- `10_data_drift.sql`

Each script must target `MAP_CERTIFICATION_TARGET.CERT_SCHEMA` only, leave SOURCE intact.
Reset with `../reset/reset_to_baseline.sql`.
