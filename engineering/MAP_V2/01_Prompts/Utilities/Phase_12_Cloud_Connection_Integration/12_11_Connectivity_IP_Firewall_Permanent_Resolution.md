# Phase 12 — Connectivity: IP/Firewall Resolution & Permanent Solution

- **Type:** Operations / Architecture follow-up
- **Date:** 2026-08-13
- **Related:** `12_0_Scope_Document.md`, `12_1_Work_Breakdown_Structure.md` (A.4), `12_2_Assessment.md` (L147), `12_3_Azure_Architecture.md`, `12_4_Implementation_Plan.md` (L183), `12_9_SQL_Server_Connector_Certification.md`
- **Status:** Analysis + recommendation (no Azure/config changes made)

---

## 1. Symptom / Environment
Two distinct connection paths exist:
1. **Default Tenant → on-prem SQL Server** — works as expected (stable/internal egress).
2. **Cert Tenant → Azure SQL Database** (`SQL-Cert-Source`, `SQL-Cert-Target` → public FQDN
   `sql-certification-test.database.windows.net:1433`) — **fails every time the engine's egress IP
   changes**. Adding the "new" IP in the Azure Portal firewall still does not restore connectivity.

- The **engine is NOT on-prem**; it is hosted in a cloud/Paas environment whose outbound (egress) IP
  rotates. The Azure SQL connection therefore breaks on each IP change.
- **Hard requirement:** no IP-dependent solution is acceptable — including for future client
  environments that may have unstable egress IPs.

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

## 5. Permanent solution — eliminate client-IP dependency entirely
Because the engine is **not on-prem** and egress IPs rotate (and clients may also have unstable IPs),
any solution that depends on allow-listing a client IP is **rejected**. Two permanent options remain:

| # | Option | When feasible | Permanence | Notes |
|---|---|---|---|---|
| A | **Static egress public IP** for the engine (NAT Gateway / Cloud NAT with a reserved public IP) | Any hosting (Azure, AWS, GCP, PaaS with VNet integration) | ✅ Permanent | The engine's outbound traffic is forced through ONE fixed public IP; allow-list *only that* IP on the Azure SQL firewall. Hosting-agnostic; directly solves "IP changes". Equivalent per cloud: Azure NAT Gateway + PIP, AWS NAT GW + Elastic IP, GCP Cloud NAT + static IP. |
| B | **Private Endpoint** for Azure SQL | Engine can be placed in / peered to the Azure VNet | ✅ Permanent (no public IP at all) | Enterprise standard. Removes the public endpoint and firewall entirely. Requires VNet + **private DNS zone `privatelink.database.windows.net`**; `connection_config.host` would switch to the private FQDN. |

**Rejected for this requirement:**
- Per-IP firewall allow-lists (current approach) — breaks on every IP change.
- *"Allow Azure services and resources to access this server"* — broad (allows all Azure), not
  least-privilege, and does nothing for non-Azure / unstable client IPs.
- VNet Service Endpoint — only helps if engine is in an Azure VNet; less complete than Private Endpoint.

**Recommendation (primary):** **Option A — static egress IP.** It is hosting-agnostic, immediately
removes the IP-churn for the Cert Tenant, and is the pattern to apply to every client environment with
an unstable egress IP (give each a fixed egress IP, or use Private Link / VPN / ExpressRoute instead of
IP firewall allow-lists). Migrate to **Option B (Private Endpoint)** as the secure end-state once the
engine is consolidated into an Azure VNet.

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
