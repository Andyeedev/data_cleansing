# Azure Learning Guide — Migration Validation Engine

> **Purpose:** Structured, hands-on Azure learning path tailored to our project.
> **Credits:** Microsoft Founders Hub ($1,000 sponsorship credits)
> **Cost Strategy:** Start small, scale-to-zero, shut down when not in use.

---

## Table of Contents

1. [Phase 1: Azure Foundation](#phase-1-azure-foundation)
2. [Phase 2: Core Services](#phase-2-core-services)
3. [Phase 3: Developer Environment](#phase-3-developer-environment)
4. [Phase 4: Deployment & CI/CD](#phase-4-deployment--cicd)
5. [Phase 5: Infrastructure as Code](#phase-5-infrastructure-as-code)
6. [Phase 6: AI Services](#phase-6-ai-services)
7. [Cost Management Cheat Sheet](#cost-management-cheat-sheet)
8. [Azure CLI vs Azure Developer CLI](#azure-cli-vs-azure-developer-cli)

---

## Phase 1: Azure Foundation

### 1.1 Login to Azure

**What:** Authenticate your machine with your Founders Hub Azure account.

**Why:** Every Azure operation requires authentication. This is step one.

```bash
az login
```

A browser window opens. Sign in with the email linked to your Founders Hub account.

**Verify your subscription:**
```bash
az account show -o table
```

**List all subscriptions:**
```bash
az account list -o table
```

**If you have multiple subscriptions, set the active one:**
```bash
az account set --subscription "<subscription-name-or-id>"
```

**Links:**
- [Azure CLI Login](https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli)
- [Founders Hub Benefits](https://foundershub.microsoft.com)

---

### 1.2 Set Up Cost Controls ✅ COMPLETED

**What:** Create a budget with email alerts so you never accidentally burn through credits.

**Why:** You have limited credits. Without alerts, a misconfigured resource can drain them silently.

**Step 1: Create a budget in the portal**
1. Go to [portal.azure.com](https://portal.azure.com)
2. Search for **Cost Management + Billing**
3. Select your subscription
4. Click **Budgets** → **Add**
5. Set:
   - Name: `founders-hub-budget`
   - Amount: `$500` (50% of your $1,000)
   - Alert thresholds: 50%, 75%, 90%
   - Email recipients: your email

**Step 2: Verify via CLI**
```bash
az consumption budget list -o table
```

**Status:** ✅ Budget created in portal

**Links:**
- [Create a Budget](https://learn.microsoft.com/en-us/cost-management/costs/create-budget)
- [Cost Analysis](https://learn.microsoft.com/en-us/cost-management/costs/analyze-costs)

---

### 1.3 Choose Your Region ✅ COMPLETED

**What:** Azure has 60+ regions worldwide. Prices vary by region. Choose before creating resources.

**Why:** Region affects cost, latency, data residency, and service availability.

**Important:** There is NO Azure CLI command to compare region prices. You must check pricing websites manually.

**How to compare prices:**
1. Open [cloudprice.net/regions](https://cloudprice.net/regions) in your browser
2. Sort by "Average price per VM per hour"
3. Find your preferred region

**Regional pricing links:**
| Resource | URL |
|---|---|
| CloudPrice Region Comparison | https://cloudprice.net/regions |
| Azure Pricing Calculator | https://azure.microsoft.com/en-us/pricing/calculator/ |
| PostgreSQL Pricing by Region | https://azure.microsoft.com/en-us/pricing/details/azure-database-postgresql/flexible-server/ |
| Container Apps Pricing | https://azure.microsoft.com/en-us/pricing/details/container-apps/ |
| Azure Pricing Overview | https://azure.microsoft.com/en-us/pricing/ |

**UK regions (July 2026 pricing):**
| Region | Avg VM Price/Hour | Services Available | Best For |
|---|---|---|---|
| UK West | $1.52 | 59% | Cheapest UK option |
| UK South | $1.74 | 92% | Most services available |

**Cheapest global regions:**
| Region | Avg VM Price/Hour | Distance from UK |
|---|---|---|
| Central India | $1.19 | ~8ms |
| East US | $1.51 | ~80ms |
| UK West | $1.52 | ~20ms |
| North Europe (Ireland) | $1.68 | ~10ms |

**Decision factors:**
| Factor | East US | UK West | UK South |
|---|---|---|---|
| Price | Cheapest | +$0.01/hr | +$0.23/hr |
| Latency from UK | ~80ms | ~20ms | ~20ms |
| Data location | US | UK | UK |
| GDPR | Extra setup needed | Built-in | Built-in |
| Service availability | 96% | 59% | 92% |

**Links:**
- [Azure Regions Overview](https://learn.microsoft.com/en-us/azure/reliability/regions-overview)
- [Azure Regions List](https://learn.microsoft.com/en-us/azure/reliability/regions-list)
- [Azure Products by Region](https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/)

---

### 1.4 Create Resource Groups ✅ COMPLETED

**What:** Resource Groups are logical containers that hold all related Azure resources.

**Why:** Separating dev/test/shared resources makes it easy to manage costs and delete everything when done.

```bash
**Create the resource groups:**
```bash
# Development environment
az group create --name rg-migration-dev --location ukwest

# Testing environment
az group create --name rg-migration-test --location ukwest

# Shared services (Key Vault, Container Registry, etc.)
az group create --name rg-migration-shared --location ukwest
```

**Verify:**
```bash
az group list -o table
```

**In the portal:**
1. Go to [portal.azure.com](https://portal.azure.com)
2. Search **Resource Groups**
3. You'll see all three listed — click into one to explore

**Project resource group structure:**
| Resource Group | Purpose | Services Inside | Cost When Empty |
|---|---|---|---|
| `rg-migration-dev` | Development environment | PostgreSQL dev DBs, Container App dev, Storage (dev files) | $0 |
| `rg-migration-test` | Testing/staging environment | PostgreSQL test DBs, Container App staging, Storage (test files) | $0 |
| `rg-migration-shared` | Shared services across environments | Key Vault (secrets), Container Registry (Docker images), Log Analytics (monitoring) | $0 |

**Why this structure:**
- **Isolation** — dev and test don't interfere with each other
- **Cost tracking** — see exactly how much each environment costs
- **Easy cleanup** — delete an entire environment by deleting its resource group
- **Shared services** — one Key Vault, one Container Registry used by both environments

**Links:**
- [Resource Groups Overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)
- [Azure Resource Manager](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview)

---

### 1.5 Explore the Azure Portal ⏭️ SKIPPED

**What:** Spend 30 minutes navigating the portal to understand the layout.

**Why:** Knowing where things live saves you time later. You don't need to create anything yet.

**Guided exploration (30 min):**

| Time | Where | What to look at |
|---|---|---|
| 5 min | Dashboard | Create a custom dashboard — pin your resource groups |
| 5 min | Resource Groups | Click into `rg-migration-dev` — see it's empty |
| 5 min | Search bar | Type "PostgreSQL", "Container Apps", "Key Vault" — read the overview pages |
| 5 min | Cost Management | Go to Cost Analysis — see your current spend (should be $0) |
| 5 min | Marketplace | Search "PostgreSQL" — see the different offerings |
| 5 min | Docs | Click the `?` icon — explore the docs sidebar |

**Links:**
- [Azure Portal Tour](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-tour)
- [Portal Quickstart](https://learn.microsoft.com/en-us/azure/azure-portal/get-started)

---

## Phase 2: Core Services

### 2.1 Azure Database for PostgreSQL ✅ COMPLETED

**What:** Managed PostgreSQL database — Azure handles backups, patching, high availability.

**Why:** Your project requires PostgreSQL for the engine DB, source DB, and target DB. This is the database you'll connect your FastAPI app to.

**Status:** ✅ Created in UK South (UK West restricted for PostgreSQL)

**Server details:**
| Field | Value |
|---|---|
| Server Name | psql-migdev-pg1 |
| Resource Group | rg-migration-dev |
| Location | UK South |
| Tier | Burstable |
| SKU | Standard_B1ms |
| Storage | 32 GB |
| Version | PostgreSQL 15 |
| State | Ready |

**Create a development instance:**
```bash
az postgres flexible-server create \
  --resource-group rg-migration-dev \
  --name psql-migdev-pg1 \
  --admin-user psqladmin \
  --admin-password 'MigrationDev2026!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15 \
  --location uksouth \
  --yes
```

**What each flag means:**
| Flag | What it does |
|---|---|
| `--sku-name Standard_B1ms` | Burstable tier — cheapest, burst-capable CPU |
| `--tier Burstable` | Pay for bursts, not sustained compute |
| `--storage-size 32` | 32 GB storage (minimum) |
| `--version 15` | PostgreSQL 15 (matches your project requirements) |
| `--location uksouth` | UK South (UK West restricted for PostgreSQL) |
| `--yes` | Skip confirmation prompts |

**Important:** UK West is restricted for PostgreSQL Flexible Server. Use UK South instead.

**Billing breakdown:**
| Component | How billed | Running | Stopped |
|---|---|---|---|
| Compute (CPU) | Per second (1-min minimum) | ~$12/month | $0 |
| Storage (disk) | Per GB per month ($0.115/GB) | ~$3.68/month | ~$3.68/month |
| **Total** | | **~$15.68/month** | **~$3.68/month** |

**Partial month example (5 days running):**
| Component | Calculation | Cost |
|---|---|---|
| Compute (5 days) | $12 × (5/30) | ~$2 |
| Storage (30 days) | 32GB × $0.115 | $3.68 |
| **Total** | | **~$5.68** |

**Connect to it:**
```bash
az postgres flexible-server connect \
  --name psql-migdev-pg1 \
  --resource-group rg-migration-dev \
  --admin-user psqladmin \
  --password 'MigrationDev2026!'
```

**Create your databases:**
```sql
CREATE DATABASE migration_engine;
CREATE DATABASE migration_source;
CREATE DATABASE migration_target;
```

**Stop it when not in use:**
```bash
az postgres flexible-server stop \
  --name psql-migdev-pg1 \
  --resource-group rg-migration-dev
```

**Start it back up:**
```bash
az postgres flexible-server start \
  --name psql-migdev-pg1 \
  --resource-group rg-migration-dev
```

**In the portal:**
1. Search **Azure Database for PostgreSQL flexible servers**
2. Click into `psql-migdev-pg1`
3. Explore: Overview, Connection security, Backups, Monitoring

**Project use case:**
- `migration_engine` — stores your control registry, rule registry, project config, audit logs
- `migration_source` — simulated source database for testing validations
- `migration_target` — simulated target database for testing validations

**Links:**
- [PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/)
- [Quickstart: Create PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/quickstart-create-server-cli)
- [Connect to PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/connect-cli)
- [SKU Reference](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-compute-storage)
- [PostgreSQL Pricing](https://azure.microsoft.com/en-us/pricing/details/postgresql/flexible-server/)

---

### 2.2 Azure Database for MySQL ⚠️ DEFERRED

**What:** Managed MySQL database — Azure handles backups, patching, security.

**Why:** Your project has a `mysql_adapter.py` for connecting to MySQL source/target databases. Customers migrating from MySQL-based systems need this adapter to work.

**Status:** ⚠️ Deferred — Azure returning InternalServerError on MySQL creation (UK South, North Europe). Will retry later.

**Create a development instance:**
```bash
az mysql flexible-server create \
  --resource-group rg-migration-dev \
  --name mysql-migdev \
  --admin-user mysqladmin \
  --admin-password 'MigrationDev2026!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 8.4 \
  --location uksouth
```

**What each flag means:**
| Flag | What it does |
|---|---|
| `--sku-name Standard_B1ms` | Burstable tier — cheapest option |
| `--tier Burstable` | Pay for bursts, not sustained compute |
| `--storage-size 32` | 32 GB storage (minimum) |
| `--version 8.4` | MySQL 8.4 (current stable) |

**Connect to it:**
```bash
az mysql flexible-server connect \
  --name mysql-migdev \
  --resource-group rg-migration-dev \
  --admin-user mysqladmin \
  --password 'YourSecurePass123!'
```

**Create test databases:**
```sql
CREATE DATABASE migration_source;
CREATE DATABASE migration_target;
```

**Stop it when not in use:**
```bash
az mysql flexible-server stop \
  --name mysql-migdev \
  --resource-group rg-migration-dev
```

**Start it back up:**
```bash
az mysql flexible-server start \
  --name mysql-migdev \
  --resource-group rg-migration-dev
```

**In the portal:**
1. Search **Azure Database for MySQL flexible servers**
2. Click into `mysql-migdev`
3. Explore: Overview, Connection security, Backups, Monitoring

**Project use case:**
- Test your `mysql_adapter.py` against a real MySQL instance
- `migration_source` / `migration_target` — simulate customer MySQL databases for validation testing
- Verify that C01–C010 controls work correctly against MySQL sources

**Cost:** ~$12/month running, $0 when stopped.

**Links:**
- [MySQL Flexible Server Overview](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/)
- [Quickstart: Create MySQL](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/quickstart-create-server-cli)
- [Connect to MySQL](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/connect-cli)
- [MySQL vs PostgreSQL Comparison](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/compare-azure-db-for-mysql-and-pg)

---

### 2.3 Azure SQL Database (MS SQL Server) ✅ COMPLETED

**What:** Managed SQL Server database — Microsoft's flagship relational database.

**Why:** Your project has a `sqlserver_adapter.py` for connecting to SQL Server source/target databases. Many enterprise financial institutions run on SQL Server.

**Status:** ✅ Created in Central US (UK regions restricted for SQL Server)

**Server details:**
| Field | Value |
|---|---|
| Server Name | sqlmssqldev2026 |
| Resource Group | rg-migration-dev |
| Location | Central US |
| Databases | migration-source, migration-target |
| Tier | Basic |
| Capacity | 5 DTUs each |
| Max Size | 2 GB each |
| Firewall | Your IP allowed |

**Create a development instance:**
```bash
# Register SQL provider (one-time)
az provider register --namespace Microsoft.Sql

# Create SQL Server logical server
az sql server create \
  --name sqlmssqldev2026 \
  --resource-group rg-migration-dev \
  --location centralus \
  --admin-user sqladmin \
  --admin-password 'MigrationDev2026!'

# Create migration-source database
az sql db create \
  --server sqlmssqldev2026 \
  --resource-group rg-migration-dev \
  --name migration-source \
  --edition Basic \
  --capacity 5

# Create migration-target database
az sql db create \
  --server sqlmssqldev2026 \
  --resource-group rg-migration-dev \
  --name migration-target \
  --edition Basic \
  --capacity 5

# Allow your IP (find with: az rest --method get --url "https://api.ipify.org?format=json" --query "ip" -o tsv)
az sql server firewall-rule create \
  --server sqlmssqldev2026 \
  --resource-group rg-migration-dev \
  --name AllowMyIP \
  --start-ip-address <YOUR_PUBLIC_IP> \
  --end-ip-address <YOUR_PUBLIC_IP>
```

**Important:** UK regions are restricted for SQL Server. Use Central US or East US instead.

**What each flag means:**
| Flag | What it does |
|---|---|
| `--edition Basic` | Cheapest tier — $4.99/month |
| `--capacity 5` | 5 DTUs (Database Transaction Units) — minimum compute |

**Billing breakdown:**
| Component | How billed | Running | When deleted |
|---|---|---|---|
| Database (Basic) | Per month | ~$5/month | $0 |
| Server | Free | $0 | N/A |
| **Total** | | **~$5/month** | **$0** |

> **Note:** Azure SQL Database has NO stop feature. Delete the database when not testing. Recreate with the script when needed.

**Reusable script:** `scripts/azure/sqlserver-setup.ps1`
```powershell
# Create SQL Server + database
.\scripts\azure\sqlserver-setup.ps1 -Action create

# Delete SQL Server + database
.\scripts\azure\sqlserver-setup.ps1 -Action delete

# Reset (delete + create)
.\scripts\azure\sqlserver-setup.ps1 -Action reset
```

**Connect with sqlcmd:**
```bash
sqlcmd -S sqlmssqldev2026.database.windows.net \
  -U sqladmin -P 'MigrationDev2026!' \
  -Q "SELECT name FROM sys.databases"
```

**Project use case:**
- Test your `sqlserver_adapter.py` against a real SQL Server
- `migration-source` — simulate customer SQL Server databases
- Verify that C01–C010 controls work correctly against SQL Server sources
- Many bank core banking systems run on SQL Server — this is a common migration source

**Links:**
- [Azure SQL Database Overview](https://learn.microsoft.com/en-us/azure/azure-sql/database/)
- [Quickstart: Create SQL Database](https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart-cli)
- [SQL Database Pricing](https://azure.microsoft.com/en-us/pricing/details/azure-sql-database/single/)
- [Firewall Rules](https://learn.microsoft.com/en-us/azure/azure-sql/database/firewall-configure)
- [sqlcmd Tool](https://learn.microsoft.com/en-us/sql/tools/sqlcmd/sqlcmd-utility)

---

### 2.4 Azure Container Registry (ACR) ✅ COMPLETED

**What:** Private Docker image registry — store your container images securely.

**Why:** You need somewhere to push your `migration-engine` Docker image so Container Apps can pull it.

**Status:** ✅ Created in UK West

**Registry details:**
| Field | Value |
|---|---|
| Registry Name | acrmigrationdev |
| Login Server | acrmigrationdev.azurecr.io |
| Resource Group | rg-migration-shared |
| Location | UK West |
| SKU | Basic |
| Admin Enabled | Yes |

```bash
az acr create \
  --resource-group rg-migration-shared \
  --name acrmigrationdev \
  --sku Basic \
  --admin-enabled true
```

**What each flag means:**
| Flag | What it does |
|---|---|
| `--sku Basic` | Cheapest tier — $5/month |
| `--admin-enabled true` | Enables admin account for simple auth (fine for dev) |

**Log in to ACR:**
```bash
az acr login --name acrmigrationdev
```

**Tag and push your image (after Docker Desktop is running):**
```bash
# Build your image
docker build -t acrmigrationdev.azurecr.io/migration-engine:v1 .

# Push to ACR
docker push acrmigrationdev.azurecr.io/migration-engine:v1
```

**List images in your registry:**
```bash
az acr repository list --name acrmigrationdev -o table
```

**In the portal:**
1. Search **Container registries**
2. Click into `acrmigrationdev`
3. Explore: Repositories (see your pushed image), Access keys, Settings

**Cost:** ~$5/month.

**Links:**
- [ACR Overview](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-intro)
- [Quickstart: Create ACR](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-cli)
- [Push First Image](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-quickstart-docker-cli)

---

### 2.5 Azure Container Apps ✅ COMPLETED

**What:** Serverless container hosting — deploy containers without managing servers or Kubernetes.

**Why:** This is where your FastAPI app runs. Scale-to-zero means no cost when idle.

**Status:** ✅ Environment created in UK South (no app deployed yet — waiting for Docker image)

**Environment details:**
| Field | Value |
|---|---|
| Environment Name | cae-migration-dev |
| Resource Group | rg-migration-dev |
| Location | UK South |

**Create the Container App Environment:**
```bash
az containerapp env create \
  --name cae-migration-dev \
  --resource-group rg-migration-dev \
  --location uksouth
```

**Deploy your app:**
```bash
az containerapp create \
  --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --environment cae-migration-dev \
  --image acrmigrationdev.azurecr.io/migration-engine:v1 \
  --target-port 8000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 2 \
  --registry-server acrmigrationdev.azurecr.io \
  --registry-identity system \
  --env-vars \
    ENGINE_DB_HOST=psql-migdev-pg1.postgres.database.azure.com \
    ENGINE_DB_NAME=migration_engine \
    ENGINE_DB_USER=psqladmin \
    ENGINE_DB_PASSWORD='YourSecurePass123!'
```

**What each flag means:**
| Flag | What it does |
|---|---|
| `--min-replicas 0` | Scale to ZERO when no traffic = no cost |
| `--max-replicas 2` | Max 2 instances (keeps costs low) |
| `--ingress external` | Public URL accessible from internet |
| `--target-port 8000` | Your FastAPI app listens on port 8000 |

**Check your app's URL:**
```bash
az containerapp show \
  --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --query "properties.configuration.ingress.fqdn" -o tsv
```

**Stop your app (set replicas to 0):**
```bash
az containerapp update \
  --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --min-replicas 0 --max-replicas 0
```

**Start your app back up:**
```bash
az containerapp update \
  --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --min-replicas 0 --max-replicas 2
```

**In the portal:**
1. Search **Container Apps**
2. Click into `ca-migration-engine-api`
3. Explore: Overview (see the URL), Revisions, Monitoring, Logs

**Cost:** ~$0 when scaled to zero. Pay only for compute when running.

**Links:**
- [Container Apps Overview](https://learn.microsoft.com/en-us/azure/container-apps/overview)
- [Quickstart: Deploy Container App](https://learn.microsoft.com/en-us/azure/container-apps/quickstart-deploy-cli)
- [Ingress](https://learn.microsoft.com/en-us/azure/container-apps/ingress)
- [Scale Objects](https://learn.microsoft.com/en-us/azure/container-apps/scale-app)

---

### 2.6 Azure Key Vault ✅ COMPLETED

**What:** Secure store for secrets, keys, and certificates.

**Why:** Your Terraform has a hardcoded password (`ChangeMe12345!`). In any non-localhost environment, secrets belong in Key Vault.

**Status:** ✅ Created in UK South with 4 secrets

**Vault details:**
| Field | Value |
|---|---|
| Vault Name | kv-migdev-2026 |
| Resource Group | rg-migration-shared |
| Location | UK South |
| RBAC Enabled | Yes |

**Stored secrets:**
| Secret Name | Value |
|---|---|
| db-password | MigrationDev2026! |
| db-host | psql-migdev-pg1.postgres.database.azure.com |
| sql-db-password | MigrationDev2026! |
| sql-server-name | sqlmssqldev2026.database.windows.net |

```bash
az keyvault create \
  --name kv-migdev-2026 \
  --resource-group rg-migration-shared \
  --location uksouth
```

**Store secrets:**
```bash
az keyvault secret set \
  --vault-name kv-migdev-2026 \
  --name "db-password" \
  --value "MigrationDev2026!"

az keyvault secret set \
  --vault-name kv-migdev-2026 \
  --name "db-host" \
  --value "psql-migdev-pg1.postgres.database.azure.com"

az keyvault secret set \
  --vault-name kv-migdev-2026 \
  --name "jwt-secret" \
  --value "$(openssl rand -base64 32)"
```

**Retrieve a secret:**
```bash
az keyvault secret show \
  --vault-name kv-migdev-2026 \
  --name "db-password" \
  --query value -o tsv
```

**In the portal:**
1. Search **Key vaults**
2. Click into `kv-migdev-2026`
3. Explore: Secrets (see what you stored), Access policies, Networking

**Project use case:**
| Secret Name | What it stores |
|---|---|
| `db-password` | PostgreSQL admin password |
| `db-host` | PostgreSQL server hostname |
| `jwt-secret` | Secret key for JWT token signing |
| `encryption-key` | Fernet encryption key for credential storage |

**Cost:** Free (first 10,000 operations/month).

**Links:**
- [Key Vault Overview](https://learn.microsoft.com/en-us/azure/key-vault/general/overview)
- [Quickstart: Create Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-cli)
- [Secrets Overview](https://learn.microsoft.com/en-us/azure/key-vault/secrets/about-secrets)

---

### 2.7 Azure Storage Account ✅ COMPLETED

**What:** Multi-purpose storage — blobs, files, queues, tables.

**Why for this project:**
- **Blob storage:** Backup PostgreSQL databases, store uploaded migration files (parquet, JSON, CSV, Excel)
- **Queues:** Future use for async task processing (e.g., "validate this migration file")
- **Tables:** Lightweight metadata storage

**Status:** ✅ Created in UK South with 3 containers

**Account details:**
| Field | Value |
|---|---|
| Account Name | stmigdev2026 |
| Resource Group | rg-migration-dev |
| Location | UK South |
| SKU | Standard_LRS |
| Kind | StorageV2 |

**Containers:**
| Container | Purpose |
|---|---|
| db-backups | Database backup dumps |
| migration-files | Uploaded source/target files |
| migration-reports | Generated validation reports |

```bash
az storage account create \
  --name stmigdev2026 \
  --resource-group rg-migration-dev \
  --location uksouth \
  --sku Standard_LRS \
  --kind StorageV2
```

**Create a blob container for database backups:**
```bash
az storage container create \
  --name db-backups \
  --account-name stmigrationdev \
  --auth-mode login
```

**Create a blob container for migration files:**
```bash
az storage container create \
  --name migration-files \
  --account-name stmigrationdev \
  --auth-mode login
```

**Upload a file:**
```bash
az storage blob upload \
  --container-name migration-files \
  --name sample-data.csv \
  --file ./demo/source_customers.csv \
  --account-name stmigdev2026 \
  --auth-mode login
```

**List blobs in a container:**
```bash
az storage blob list \
  --container-name db-backups \
  --account-name stmigdev2026 \
  --auth-mode login \
  --output table
```

**Download a blob:**
```bash
az storage blob download \
  --container-name db-backups \
  --name migration_source_v5_05.dump \
  --file ./downloaded_backup.dump \
  --account-name stmigdev2026 \
  --auth-mode login
```

**Backup PostgreSQL to blob storage:**
```bash
# Step 1: Backup database using pg_dump
pg_dump -h psql-migdev-pg1.postgres.database.azure.com -U psqladmin -d migration_source -f backup.sql

# Step 2: Upload to blob storage
az storage blob upload \
  --container-name db-backups \
  --name migration_source_backup.sql \
  --file backup.sql \
  --account-name stmigdev2026 \
  --account-key <your-account-key>
```

**Current blobs in db-backups:**
| Blob Name | Size | Uploaded |
|---|---|---|
| migration_source_v5_05.dump | 5 KB | 2026-07-17 |
| migration_target_v5_05.dump | 6 KB | 2026-07-17 |

**Current blobs in migration-files:**
| Blob Name | Type | Size | Purpose |
|---|---|---|---|
| source_customers.csv | CSV | 1 KB | Sample source data (10 rows) |
| target_customers.csv | CSV | 1 KB | Sample target data (11 rows with differences) |
| transactions.txt | TXT | 0.3 KB | Sample transaction data |
| migration_report.json | JSON | 1 KB | Sample validation report |
| customers.xlsx | Excel | 5 KB | Sample Excel data |
| customers.parquet | Parquet | 4 KB | Sample Parquet data |

**In the portal:**
1. Search **Storage accounts**
2. Click into `stmigdev2026`
3. Explore: Containers (see your blobs), Files, Queues, Tables, Access keys

**Project use case:**
| Container | What it stores |
|---|---|
| `db-backups` | PostgreSQL backup dumps |
| `migration-files` | Source/target files uploaded by users (parquet, JSON, CSV, Excel) |
| `migration-reports` | Generated PDF/CSV validation reports |

**Customer data structure in `migration-files`:**
```
cust-A/                          (CSV customer data)
  ├── source/customers.csv       (8 rows)
  └── target/customers.csv       (9 rows — has differences)

cust-B/                          (Parquet customer + accounts)
  ├── source/customers.parquet   (5 rows)
  ├── source/accounts.parquet    (5 rows)
  ├── target/customers.parquet   (6 rows — has differences)
  └── target/accounts.parquet    (6 rows — has differences)

cust-C/                          (JSON multi-table)
  ├── source/transactions.json   (5 rows)
  ├── source/payments.json       (4 rows)
  ├── source/invoices.json       (5 rows)
  ├── target/transactions.json   (6 rows — has differences)
  ├── target/payments.json       (5 rows — has differences)
  └── target/invoices.json       (6 rows — has differences)
```

**Intentional differences for validation testing:**

| Customer | Difference Type | Example |
|---|---|---|
| A | Amount changed, status changed, new row | Row 1005 balance: 67000→67500 |
| B | New row, balance changed | Row 2006 added, Row 2002 balance: 12000→12500 |
| C | Status changed, new rows | TXN-4003 status: pending→completed, TXN-4006 added |

**Cost:** ~$0.018/GB/month (Standard LRS). Very cheap for dev volumes.

**Links:**
- [Storage Account Overview](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-overview)
- [Quickstart: Create Storage Account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create-cli)
- [Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
- [Azure Storage Explorer](https://learn.microsoft.com/en-us/azure/storage/storage-explorer-vnext)

---

### 2.8 Azure Monitor & Log Analytics ✅ COMPLETED

**What:** Monitoring, logging, and alerting for all your Azure resources.

**Why:** When your Container App fails or PostgreSQL is slow, you need to see what happened. Without monitoring, you're flying blind.

**Status:** ✅ Created in UK West

**Workspace details:**
| Field | Value |
|---|---|
| Workspace Name | law-migration-dev |
| Resource Group | rg-migration-shared |
| Location | UK West |
| Retention | 30 days |

```bash
az monitor log-analytics workspace create \
  --resource-group rg-migration-shared \
  --workspace-name law-migration-dev \
  --location uksouth
```

**Enable Container Apps logging:**
```bash
az containerapp update \
  --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --logs-destination log-analytics \
  --workspace-id $(az monitor log-analytics workspace show \
    --resource-group rg-migration-shared \
    --workspace-name law-migration-dev \
    --query customerId -o tsv)
```

**View logs:**
```bash
az containerapp logs show \
  --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --follow
```

**In the portal:**
1. Search **Log Analytics workspaces**
2. Click into `law-migration-dev`
3. Explore: Logs (run KQL queries), Usage, Alerts

**Example KQL query (in Log Analytics):**
```kusto
ContainerAppConsoleLogs
| where TimeGenerated > ago(24h)
| project TimeGenerated, LogEntry, Level
| order by TimeGenerated desc
```

**Cost:** First 5 GB/month free.

**Links:**
- [Azure Monitor Overview](https://learn.microsoft.com/en-us/azure/azure-monitor/overview)
- [Log Analytics Workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview)
- [Container Apps Logging](https://learn.microsoft.com/en-us/azure/container-apps/log-monitoring)
- [KQL Reference](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/)

---

## Phase 2 Summary — ✅ COMPLETED

---

### Created This Session

| Service            | Resource           | Location   | Status                  |
| ------------------ | ------------------ | ---------- | ----------------------- |
| Azure Database for PostgreSQL | psql-migdev-pg1    | UK South   | ✅ Running              |
| Azure SQL Server   | sqlmssqldev2026    | Central US | ✅ Running              |
| Azure Container Registry | acrmigrationdev     | UK West    | ✅ Created              |
| Container App Environment | cae-migration-dev   | UK South   | ✅ Created              |
| Azure Key Vault    | kv-migdev-2026     | UK South   | ✅ Created + 4 secrets  |
| Azure Storage Account | stmigdev2026       | UK South   | ✅ Created + 3 containers |
| Log Analytics Workspace | law-migration-dev   | UK West    | ✅ Created              |

---

### Deferred

| Service                    | Reason                                                                        |
| -------------------------- | ----------------------------------------------------------------------------- |
| Azure Database for MySQL   | Azure InternalServerError on creation (UK South, North Europe). Will retry later. |

---

### Current Inventory

```
rg-migration-shared (UK West)
  ├─ Container Registry (acrmigrationdev) → Docker images
  ├─ Key Vault (kv-migdev-2026) → Secrets
  └─ Log Analytics (law-migration-dev) → Monitoring

rg-migration-dev
  ├─ PostgreSQL (psql-migdev-pg1) [UK South]
  │   ├─ migration_engine    → App config, rules, results
  │   ├─ migration_source    → Test PG source data
  │   └─ migration_target    → Test PG target data
  ├─ SQL Server (sqlmssqldev2026) [Central US]
  │   ├─ migration-source    → Test SQL Server source data
  │   └─ migration-target    → Test SQL Server target data
  ├─ Container App Env (cae-migration-dev) [UK South]
  └─ Storage Account (stmigdev2026) [UK South]
      ├─ db-backups          → Database backup dumps
      ├─ migration-files     → Uploaded source/target files
      └─ migration-reports   → Generated validation reports

rg-migration-test
  └─ (Empty — will mirror dev when needed)
```

---

### Estimated Monthly Cost

| Service                       | Cost            |
| ----------------------------- | --------------- |
| PostgreSQL (Burstable B1ms)   | ~$15.68/month   |
| SQL Server (Basic, 5 DTUs)    | ~$5.00/month    |
| Container Registry (Basic)    | ~$5.00/month    |
| Storage Account (Standard LRS)| ~$0.50/month    |
| Container Apps (scale-to-zero)| ~$0/month       |
| Key Vault                     | Free            |
| Log Analytics                 | Free            |
| **Total**                     | **~$26/month**  |

---

## Phase 3: Developer Environment

### 3.1 Install Core Tools ✅ COMPLETED

**What:** Install the CLI tools that become your daily workflow.

**Required (install now):**
```bash
# Azure CLI (already installed — verify)
az version

# Azure Developer CLI
winget install Microsoft.Azd

# Azure Storage Explorer (GUI tool)
winget install Microsoft.AzureStorageExplorer
```

**Optional (install later if needed):**
```bash
# Azure Functions Core Tools (for future serverless work)
npm install -g azure-functions-core-tools@4

# VS Code extensions (install in VS Code)
# - Azure Account
# - Azure Resource Manager (ARM)
# - Azure Container Apps
# - Azure CLI Tools
```

**Links:**
- [Azure CLI Install](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview)
- [Azure Storage Explorer](https://learn.microsoft.com/en-us/azure/storage/storage-explorer-vnext)
- [VS Code Azure Extensions](https://learn.microsoft.com/en-us/azure/developer/integrate-vs-code)

### 3.2 Azure CLI vs Azure Developer CLI

| Feature | Azure CLI (`az`) | Azure Developer CLI (`azd`) |
|---|---|---|
| **What it is** | Command-line tool for individual Azure operations | Orchestration tool for full app deployment |
| **Granularity** | One command per resource | Deploys entire app in one command |
| **Example** | `az postgres create ...` then `az containerapp create ...` | `azd up` (creates everything at once) |
| **Best for** | Learning, scripting, one-off operations | Production deployments, CI/CD |
| **Config** | Manual commands | `azure.yaml` config file |
| **When to learn** | Now (Phase 1) | Later (Phase 5) |

**In short:** `az` is your scalpel (precise, one operation at a time). `azd` is your crane (lifts the whole building at once). Learn `az` first, then `azd` when you want to automate everything.

**Links:**
- [Azure CLI vs azd](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/migrate-from-azure-cli)
- [azd Quickstart](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/get-started)

---

## ⏸️ CONTINUE FROM HERE — Last session: 17 July 2026

**Next:** Phase 4 — Deployment & CI/CD

**Completed so far:**
- ✅ Phase 1: Azure Foundation
- ✅ Phase 2: Core Services (PostgreSQL, SQL Server, ACR, Container Apps, Key Vault, Storage, Log Analytics)
- ✅ Phase 3.1: Core Tools (Azure CLI, Storage Explorer)
- ⏭️ Phase 3.2: Informational only (Azure CLI vs azd)

**Estimated monthly cost:** ~$26/month

---

## Phase 4: Deployment & CI/CD

### 4.1 GitHub Actions → Azure

**What:** Automate build and deployment — every push to `main` deploys to Azure.

**Why:** You already have CI (lint + test) in `.github/workflows/ci.yml`. Adding CD means zero manual deployment.

**Extend your existing workflow:**
```yaml
# Add to .github/workflows/ci.yml

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Push to ACR
        run: |
          az acr build --registry ${{ secrets.ACR_NAME }} \
            --image migration-engine:${{ github.sha }} .

      - name: Deploy to Container Apps
        run: |
          az containerapp update \
            --name ${{ secrets.CONTAINER_APP_NAME }} \
            --resource-group ${{ secrets.RESOURCE_GROUP }} \
            --image ${{ secrets.ACR_NAME }}.azurecr.io/migration-engine:${{ github.sha }}
```

**GitHub Secrets needed:**
| Secret | Value |
|---|---|
| `AZURE_CREDENTIALS` | Service principal JSON (from `az ad sp create-for-rbac`) |
| `ACR_NAME` | `acrmigrationdev` |
| `CONTAINER_APP_NAME` | `ca-migration-engine-api` |
| `RESOURCE_GROUP` | `rg-migration-dev` |

**Create a service principal for GitHub Actions:**
```bash
az ad sp create-for-rbac \
  --name "github-actions-migration" \
  --role contributor \
  --scopes /subscriptions/<your-subscription-id> \
  --sdk-auth
```

**Links:**
- [GitHub Actions + Azure](https://learn.microsoft.com/en-us/azure/developer/github/github-actions)
- [Container Apps + GitHub Actions](https://learn.microsoft.com/en-us/azure/container-apps/github-actions-cli)
- [Your existing CI workflow](../.github/workflows/ci.yml)

---

## Phase 5: Infrastructure as Code

### 5.1 Terraform (What You Already Have)

**What:** Define infrastructure in code. `terraform apply` creates everything.

**Why:** Repeatable environments, version control for infrastructure, easy recreation.

**Your current Terraform** is at `deploy/azure/main.tf`. It needs updates:
- Change PostgreSQL SKU from `GP_Standard_D2s_v3` to `Standard_B1ms`
- Add Key Vault for secrets
- Add Container Registry
- Remove hardcoded passwords

**When to do this:** After you've manually created resources via CLI (Phase 1-2). You'll understand what each Terraform resource does because you've already created it by hand.

**Links:**
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest)
- [Terraform + Azure Tutorial](https://learn.microsoft.com/en-us/azure/developer/terraform/overview)

### 5.2 Bicep (Microsoft's IaC)

**What:** Microsoft's alternative to Terraform — tighter Azure integration.

**Why:** It's Microsoft-native, simpler syntax, better Azure support. But you already have Terraform working.

**When to learn:** Only if you want to replace Terraform. Not a priority.

**Links:**
- [Bicep Overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview)
- [Bicep vs Terraform](https://learn.microsoft.com/en-us/azure/developer/terraform/bicep-and-terraform-comparison)

---

## Phase 6: AI Services

### 6.1 Azure AI Services

**What:** Pre-built AI/ML services — OpenAI, Document Intelligence, AI Search.

**Why for this project:** Your `app/intelligence/` modules are placeholders for:
- **Explainability** — AI could explain why a validation control failed
- **Schema matching** — AI could auto-match source/target columns
- **Inference** — ML models could predict migration risk scores
- **Document Intelligence** — Parse uploaded migration documents

**When to learn:** After your core platform is working. Not a Phase 1 priority.

**Services relevant to your project:**
| Service | Your use case |
|---|---|
| Azure OpenAI | Explain validation results in natural language |
| AI Search | Search across migration rules and controls |
| Document Intelligence | Parse uploaded migration documents |
| Azure AI Foundry | Orchestrate multiple AI services |

**Links:**
- [Azure AI Services](https://learn.microsoft.com/en-us/azure/ai-services/)
- [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/)

---

## Cost Management Cheat Sheet

### Daily Shutdown Routine
```bash
# Stop PostgreSQL (saves ~$12/mo)
az postgres flexible-server stop --name psql-migdev-pg1 --resource-group rg-migration-dev

# Stop MySQL (saves ~$12/mo)
az mysql flexible-server stop --name mysql-migdev --resource-group rg-migration-dev

# Delete SQL Server databases (saves ~$10/mo — recreate when needed)
az sql db delete --server sqlmssqldev2026 --resource-group rg-migration-dev --name migration-source -y
az sql db delete --server sqlmssqldev2026 --resource-group rg-migration-dev --name migration-target -y

# Scale Container App to zero (saves compute)
az containerapp update --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --min-replicas 0 --max-replicas 0
```

### Morning Startup Routine
```bash
# Start PostgreSQL
az postgres flexible-server start --name psql-migdev-pg1 --resource-group rg-migration-dev

# Start MySQL
az mysql flexible-server start --name mysql-migdev --resource-group rg-migration-dev

# Recreate SQL Server databases (if needed for testing)
az sql db create --server sqlmssqldev2026 --resource-group rg-migration-dev \
  --name migration-source --service-tier Basic --capacity 5
az sql db create --server sqlmssqldev2026 --resource-group rg-migration-dev \
  --name migration-target --service-tier Basic --capacity 5

# Scale Container App back up
az containerapp update --name ca-migration-engine-api \
  --resource-group rg-migration-dev \
  --min-replicas 0 --max-replicas 2
```

### Cost by Service (Running vs Stopped) — ACTUAL

| Resource | Running | Stopped/Deleted | Notes |
|---|---|---|---|
| PostgreSQL B1ms | ~$15.68/mo | ~$3.68/mo (storage only) | Stop compute when not in use |
| MySQL B1ms | ~$15.68/mo | ~$3.68/mo (storage only) | Not created yet |
| SQL Server (1x Basic DB) | ~$5/mo | $0 (delete DB) | No stop feature — delete when done |
| Container App (0 replicas) | ~$0 | $0 | Already scale-to-zero |
| Container Registry Basic | ~$5/mo | ~$5/mo | Can't stop — always on |
| Key Vault | $0 | $0 | Free tier |
| Storage Account | ~$0.02/GB | ~$0.02/GB | Pay per use |
| Log Analytics | $0 | $0 | First 5 GB free |
| **Total (current)** | **~$25.70/mo** | **~$8.70/mo** | |

> **Current actual spend:** PostgreSQL ($15.68) + SQL Server ($5) = ~$20.68/month running

### Cost-Saving Commands
```bash
# Stop PostgreSQL (saves ~$12/mo compute)
az postgres flexible-server stop --name psql-migdev-pg1 --resource-group rg-migration-dev

# Start PostgreSQL
az postgres flexible-server start --name psql-migdev-pg1 --resource-group rg-migration-dev

# Delete SQL Server database (saves ~$5/mo)
az sql db delete --server sqlmssqldev2026 --resource-group rg-migration-dev --name migration-source --yes

# Recreate SQL Server database (uses script)
.\scripts\azure\sqlserver-setup.ps1 -Action create
```

### Monthly Cost Check
```bash
# View current month's costs
az costmanagement query \
  --type Usage \
  --timeframe MonthToDate \
  --dataset-granularity Daily \
  --scope /subscriptions/<your-subscription-id> \
  -o table
```

---

## Azure Services Map (Your Project) — ACTUAL

```
rg-migration-shared (UK West)
  ├─ Container Registry (acrmigrationdev) → Docker images
  ├─ Key Vault (kv-migdev-2026) → Secrets
  └─ Log Analytics (law-migration-dev) → Monitoring

rg-migration-dev
  ├─ PostgreSQL (psql-migdev-pg1) [UK South]
  │   ├─ migration_engine    → App config, rules, results
  │   ├─ migration_source    → Test PG source data
  │   └─ migration_target    → Test PG target data
  ├─ SQL Server (sqlmssqldev2026) [Central US]
  │   ├─ migration-source    → Test SQL Server source data
  │   └─ migration-target    → Test SQL Server target data
  ├─ Container App Env (cae-migration-dev) [UK South]
  └─ Storage Account (stmigdev2026) [UK South]
      ├─ db-backups          → Database backup dumps
      ├─ migration-files     → Uploaded source/target files
      └─ migration-reports   → Generated validation reports

rg-migration-test
  └─ (Empty — will mirror dev when needed)
```

### Reusable Scripts
| Script | Purpose | Location |
|---|---|---|
| postgresql-setup.ps1 | Create/stop/start/delete PostgreSQL | `scripts/azure/` |
| sqlserver-setup.ps1 | Create/delete/reset SQL Server | `scripts/azure/` |

### Database Use Cases
| Use Case | Source DB | Target DB | Tests Adapter |
|---|---|---|---|
| PG → PG | PostgreSQL | PostgreSQL | `postgres_adapter.py` |
| SQL Server → PG | SQL Server | PostgreSQL | `sqlserver_adapter.py` |

---

*Last updated: July 2026*
*Credits: Microsoft Founders Hub*
*Project: Migration Validation Engine v1.4*
