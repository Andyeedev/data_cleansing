-- Snowflake Certification — Create MAP_CERT_ADMIN service user with RSA key-pair auth
-- Run as ACCOUNTADMIN in Snowflake Worksheet (browser login as MAPADMIN)
-- Key pair generated OUTSIDE Terraform: snowflake-certification/keys/rsa_key.p8 (private, 600 perms) + rsa_key.pub
-- This SQL installs the PUBLIC key only — private key NEVER in Terraform state, stored via `az keyvault secret set` after terraform apply
-- Least-privilege: MAP_CERT_ADMIN owns only certification resources via MAP_CERT_ROLE, not ACCOUNTADMIN for tests

-- 1. Create service user — BEFORE Terraform, so do NOT reference MAP_CERT_ROLE or MAP_CERT_WH (they don't exist yet)
CREATE USER IF NOT EXISTS MAP_CERT_ADMIN
  RSA_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtIeBGX4wmhqljME615UZnY28IGxqXeqeImN9HLve1Bypulc1kJwzmb41hbLnIYj0pzQdjBVBTvd1d2vYYGhlkhzE2tywoEunjlorRLhcmsXvCD+n2ULMOuh2X1m40Yl0k9C1Z9aBhBzpN+dkPQSg3aquZF45aqvPcPUeHEUWMnSOK2F4P6YYqj225nJM19NxpoCq8atvOiqJSDYtm3RhKk9GLwA8FFBFsZpxZ2ToaNIYC/yxxoHkDTzEHXTJ26V8BD8NgZq6sV7C9nYzVujI1uSYLfhIusrIKVpPBUMB2YPUkpPFMZ+R3jYdb6btt1mmn9fQbArg6T3E6RxbS4fn6QIDAQAB'
  DEFAULT_ROLE = PUBLIC
  MUST_CHANGE_PASSWORD = FALSE
  COMMENT = 'MAP Snowflake certification — JWT service user — Phase 12 pattern reuse';

-- If user already existed without key, set it (idempotent)
ALTER USER IF EXISTS MAP_CERT_ADMIN SET RSA_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtIeBGX4wmhqljME615UZnY28IGxqXeqeImN9HLve1Bypulc1kJwzmb41hbLnIYj0pzQdjBVBTvd1d2vYYGhlkhzE2tywoEunjlorRLhcmsXvCD+n2ULMOuh2X1m40Yl0k9C1Z9aBhBzpN+dkPQSg3aquZF45aqvPcPUeHEUWMnSOK2F4P6YYqj225nJM19NxpoCq8atvOiqJSDYtm3RhKk9GLwA8FFBFsZpxZ2ToaNIYC/yxxoHkDTzEHXTJ26V8BD8NgZq6sV7C9nYzVujI1uSYLfhIusrIKVpPBUMB2YPUkpPFMZ+R3jYdb6btt1mmn9fQbArg6T3E6RxbS4fn6QIDAQAB';

-- 3. Verify (requires ACCOUNTADMIN)
-- DESCRIBE USER MAP_CERT_ADMIN;
-- SHOW USERS LIKE 'MAP_CERT_ADMIN';

-- 4. Grants — MAP_CERT_ROLE is created by Terraform (snowflake_account_role.cert_role)
-- After `terraform apply`, run:
-- GRANT ROLE MAP_CERT_ROLE TO USER MAP_CERT_ADMIN;
-- ALTER USER MAP_CERT_ADMIN SET DEFAULT_ROLE = MAP_CERT_ROLE;
-- ALTER USER MAP_CERT_ADMIN SET DEFAULT_WAREHOUSE = MAP_CERT_WH;

-- After this, test JWT login via Snowsql:
-- snowsql -a IVVRAYS-FS67669 -u MAP_CERT_ADMIN --authenticator SNOWFLAKE_JWT --private-key-path snowflake-certification/keys/rsa_key.p8 -r PUBLIC -q "SELECT CURRENT_USER();"
