# Phase 12 — Static Egress IP Runbook (cloud-agnostic)

**Goal:** permanently remove Azure SQL (and any client) connectivity breakage caused by rotating
engine egress IPs. Replaces the rejected per-IP firewall allow-list approach.
**Companion:** `12_11_Connectivity_IP_Firewall_Permanent_Resolution.md`
**Boundary:** NAT Gateway / reserved IP / Private Endpoint / DNS are created in the cloud console or
Terraform — **not** by this repo. This is the implementation guide only.

---

## A. Immediate unblock (do first, verify before permanent fix)
1. From the **engine host** (where `Connections → Test` runs): capture the true egress IP —
   `curl -s https://api.ipify.org` (or `curl -s ifconfig.me`). This is the IP the Azure SQL firewall
   must allow — *not* the VM/instance private or public IP.
2. Azure Portal → SQL Server `sql-certification-test` → **Networking**:
   - If **"Deny public network access"** is ON, or a **Private Endpoint** exists → public IP firewall
     rules are ignored. Either temporarily disable to test, or skip to Section C.
   - Add the captured egress IP as a firewall rule. `Test Connection` should now succeed (temporary).
3. If it still fails with the correct IP: confirm **outbound 1433** is open from the engine network
   and the FQDN resolves (`nslookup sql-certification-test.database.windows.net`).

## B. Permanent fix — static egress IP (recommended, hosting-agnostic)
Force engine outbound through **one fixed public IP**; allow-list only that IP. Forever stable.

### B.1 Azure (VM / AKS on a subnet)
- Provision a **Static Public IP** (Standard SKU).
- Provision a **NAT Gateway**; associate the static PIP; attach to the engine's egress subnet(s).
- Subnet outbound now routes via the NAT GW. Verify: `curl -s https://api.ipify.org` == the PIP.
- Azure SQL firewall: keep only that one PIP rule.

### B.2 Azure App Service / Container Apps (rotating egress by default)
- These do **not** have a fixed egress IP. Enable **regional VNet integration** to a VNet/subnet that
  has the NAT Gateway from B.1; engine egress then uses the NAT GW static PIP.
- (Alt: App Service Environment with dedicated egress, or a NAT'd subnet.)

### B.3 AWS
- Allocate an **Elastic IP** (static).
- Create a **NAT Gateway** in a public subnet using that EIP; private subnets route `0.0.0.0/0` → NAT GW.
- Engine in the private subnet egresses via the EIP. Allow-list the EIP.

### B.4 GCP
- Create a **Cloud NAT** with a **reserved static external IP** (manual IP allocation).
- Attach to the VPC/subnetwork the engine uses. Allow-list that IP.

### B.5 Other / mixed
- Locate where engine egress is NAT'd; put a **reserved static public IP** on that NAT.
- If egress is a direct instance public IP that rotates, assign a **reserved static public IP** to the
  engine instance, or front egress with a NAT that has a reserved IP.

## C. Alternative permanent fix — Private Endpoint (Azure-only, most secure)
If the engine can be placed in / peered to the Azure VNet, eliminate the public endpoint outright:
1. Create a **Private Endpoint** for the SQL Server (target sub-resource = `sqlServer`).
2. Create private DNS zone **`privatelink.database.windows.net`**; link to the VNet.
3. (Optional, hardens security) set **"Deny public network access" = true**.
4. Update the system `connection_config.host` to the **private FQDN** (Section F).
5. `Test Connection` (now resolves via private DNS, no public IP involved).

## D. Post-change verification
- Retest `Migration → Connections → Test` for `SQL-Cert-Source` / `SQL-Cert-Target`.
- Confirm the engine egress IP is stable across restarts / redeploys (repeat `curl` check).

## E. Apply the same pattern to unstable client IPs (standard)
For any client database reached over a public endpoint whose egress IP is unstable: give that client a
**static egress IP** (Section B pattern), or use **Private Link / VPN / ExpressRoute** instead of IP
firewall allow-lists. Do not rely on per-IP firewall entries for clients.

## F. SQL snippet — host update for Private Endpoint path
```sql
UPDATE core.system_registry
SET connection_config = jsonb_set(connection_config, '{host}',
    '"sql-certification-test.privatelink.database.windows.net"')
WHERE system_name IN ('SQL-Cert-Source','SQL-Cert-Target');
```
`encrypt` / `trust_server_certificate` stay at their correct defaults (`system_service.py:189-190`);
no other config change needed. Run only after the Private Endpoint + private DNS are live.

## G. Decision summary
| Approach | IP-dependent? | Effort | Best when |
|---|---|---|---|
| Static egress IP (B) | No | Low–Med | Engine anywhere; immediate, universal fix |
| Private Endpoint (C) | No | Med | Engine in/near Azure VNet; most secure end-state |
| Per-IP firewall (current) | **Yes** | Low but endless | **Rejected** |
| "Allow Azure services" | No (but broad) | Low | Rejected for prod / unstable-IP concerns |
