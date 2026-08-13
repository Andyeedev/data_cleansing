# Phase 12 — Connectivity: IP/Firewall Resolution & Permanent Solution

- **Type:** Operations / Architecture follow-up
- **Date:** 2026-08-13
- **Related:** `12_0_Scope_Document.md`, `12_1_Work_Breakdown_Structure.md` (A.4), `12_2_Assessment.md` (L147), `12_3_Azure_Architecture.md`, `12_4_Implementation_Plan.md` (L183), `12_9_SQL_Server_Connector_Certification.md`
- **Status:** Analysis + recommendation (no Azure/config changes made)

---

## 1. Symptom
- `Migration → Connections → Test` fails for the Cert Tenant systems
  (`SQL-Cert-Source`, `SQL-Cert-Target`), both pointing at the **public** Azure SQL FQDN
  `sql-certification-test.database.windows.net:1433`.
- All connections worked until the engine's egress IP changed again.
- Adding the "new" IP in the Azure Portal firewall **still does not restore connectivity**.

## 2. Why "ping" is not the signal
Azure SQL Database does **not** answer ICMP/ping. A failed ping is expected and meaningless.
The only valid test is TCP 1433 / the app's `Test Connection` (`system_routes.py:85`
→ `SQLServerAdapter.test_connection`, `app/adapters/sqlserver.py:116`). The adapter already
defaults to `encrypt=True, trust_server_certificate=False` (`system_service.py:189-190`), which is
correct for Azure SQL, so TLS is **not** the blocker.

## 3. Root cause
`*.database.windows.net` is a **public endpoint**. Azure SQL Database only accepts connections from
IPs present in its **server-level firewall rules** (or when "Allow Azure services and resources to
access this server" is enabled). The engine's **egress (outbound) IP** is what must be allow-listed —
and it keeps changing (cloud/env rotation, NAT, App Service/AKS egress), so any IP-based firewall rule
is **temporary by nature**. This is the outstanding Phase 12 task:
`12_0:93` "Configure networking/firewall", `12_1:A.4`, `12_4:183` "Network issues → Configure firewall correctly".

## 4. Why "added the new IP but still fails" (verify in this order)
1. **Wrong IP added.** The firewall needs the engine's *egress* IP, not the VM's private IP or its
   instance public IP. Behind a NAT gateway / App Service / AKS the real egress IP is the NAT/gateway
   IP. Find it from the engine host: `curl -s https://api.ipify.org` (or equivalent).
2. **Public access disabled.** If a **Private Endpoint** was enabled, or "Deny public network access"
   is ON, public firewall rules are ignored entirely — you must connect via the private endpoint
   (private DNS `privatelink.database.windows.net`), not by adding public IPs.
3. **Multiple egress IPs.** Some environments egress via a pool of NAT IPs; one allow-listed IP is not
   enough. A static egress IP (see §6) is required.
4. **Rule not saved / region mismatch.** Confirm the rule is on the correct SQL Server and has
   propagated (usually immediate).

## 5. Permanent solution — stop depending on a changing client IP
| # | Option | When appropriate | Permanence | Notes |
|---|---|---|---|---|
| A | **Private Endpoint** for Azure SQL | Engine runs in Azure (same/peered VNet) | ✅ Permanent | Enterprise standard. Removes public-IP dependency. Requires VNet + **private DNS zone `privatelink.database.windows.net`**. Connection then uses the private FQDN; `host` in `connection_config` may need the private DNS name. |
| B | **VNet Service Endpoint** + virtual network rule | Engine in Azure VNet | ✅ Permanent | Add the engine subnet as a virtual network rule on the SQL server; no IP allowlist needed. |
| C | **"Allow Azure services and resources to access this server"** | Engine in Azure, low-security tolerance | ✅ Permanent (broad) | One toggle; allows all Azure traffic. Convenient but not least-privilege — avoid for prod. |
| D | **Static egress public IP** (NAT Gateway / reserved IP) | Engine **outside** Azure or behind dynamic NAT | ✅ Permanent | Provision a fixed outbound public IP and allow-list *that* IP. Adding dynamic IPs (current approach) is futile. |

**Recommendation:**
- If the engine is Azure-hosted → **Option A (Private Endpoint)** is the correct, secure, permanent
  architecture (Option B/C as faster fallbacks). This also aligns with Phase 12's cloud-migration intent.
- If the engine is on-prem/other-cloud with rotating egress → **Option D (static egress IP)**. The
  current "add the new IP" loop will never be stable.

## 6. Action plan (to be executed in Azure — not by this tool)
1. From the engine host, capture the true egress IP (`curl https://api.ipify.org`).
2. Decide A/B/C (engine in Azure) or D (outside Azure).
3. Implement the chosen option; for Private Endpoint, also wire the private DNS zone and update the
   system `connection_config.host` if it must resolve to the private FQDN.
4. Re-run `Migration → Connections → Test` for `SQL-Cert-Source` / `SQL-Cert-Target`.
5. Once stable, the Cert Tenant execution pre-flight (see `PreFlight_Checklist_Migration_Execution_MAP_CLI.md`)
   is unblocked on connectivity.

## 7. References
- `app/api/routes/system_routes.py:85` (test endpoint)
- `app/adapters/sqlserver.py:116` (test_connection; uses connection pool)
- `app/services/system_service.py:185-191` (encrypt/trust_server_certificate defaults)
- `engineering/MAP_V2/01_Prompts/Utilities/Phase_12_Cloud_Connection_Integration/12_9_SQL_Server_Connector_Certification.md`
  (SQLServerAdapter still in "STOP — Explicit Approval" state; SQL Login supported)
