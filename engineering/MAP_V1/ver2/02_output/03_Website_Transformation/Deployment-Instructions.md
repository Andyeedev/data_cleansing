# Deployment Instructions — MAP Website

> Azure Static Web Apps deployment guide with GitHub Actions CI/CD pipeline.
> Last updated: 2026-06-30

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Azure Static Web Apps Setup](#2-azure-static-web-apps-setup)
3. [GitHub Actions Workflow](#3-github-actions-workflow)
4. [Custom Domain Configuration](#4-custom-domain-configuration)
5. [Environment Variables](#5-environment-variables)
6. [SSL/TLS Configuration](#6-ssltls-configuration)
7. [CDN Caching Rules](#7-cdn-caching-rules)
8. [Security Headers Configuration](#8-security-headers-configuration)
9. [Monitoring and Alerts](#9-monitoring-and-alerts)
10. [Rollback Procedures](#10-rollback-procedures)
11. [Staging vs Production Environments](#11-staging-vs-production-environments)
12. [Performance Monitoring with Azure Application Insights](#12-performance-monitoring-with-azure-application-insights)
13. [Post-Deployment Checklist](#13-post-deployment-checklist)

---

## 1. Prerequisites

### Required Accounts

| Requirement | Details |
|---|---|
| Azure Subscription | Active subscription with billing enabled |
| GitHub Account | Organisation or personal account |
| Domain Registrar | For custom domain (e.g., map-platform.com) |

### Required Software (Local Development)

| Software | Minimum Version | Installation |
|---|---|---|
| Node.js | 18.x LTS | `nvm install 18` |
| npm | 9.x+ | Bundled with Node.js |
| Azure CLI | 2.50+ | `winget install Microsoft.AzureCLI` |
| Git | 2.40+ | `winget install Git.Git` |

### Required Azure Permissions

| Permission | Scope |
|---|---|
| Contributor | Static Web Apps resource |
| Reader | Resource Group |
| DNS Zone Contributor | Custom domain DNS management |
| Application Insights Contributor | Monitoring (optional) |

---

## 2. Azure Static Web Apps Setup

### 2.1 Create via Azure Portal

1. Navigate to **Azure Portal** → **Create a resource** → **Static Web Apps**
2. Configure:

| Setting | Value |
|---|---|
| Subscription | Your subscription |
| Resource Group | `rg-map-website-prod` |
| Name | `stl-map-website-prod` |
| Region | West Europe |
| Source | GitHub |
| Organisation | Your GitHub org |
| Repository | `map-platform-website` |
| Branch | `main` |
| Build Preset | Custom |
| App location | `/` |
| Output location | `dist` |

3. Click **Review + Create** → **Create**

### 2.2 Create via Azure CLI

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "<subscription-id>"

# Create resource group
az group create \
  --name rg-map-website-prod \
  --location westeurope

# Create Static Web App
az staticwebapp create \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod \
  --location westeurope \
  --source https://github.com/<org>/map-platform-website \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --sku Standard
```

### 2.3 Retrieve Deployment Token

```bash
# Get the deployment token
az staticwebapp secrets list \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod

# Output: { "properties": { "apiKey": "<deployment-token>" } }
```

Store this token as a GitHub repository secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`.

---

## 3. GitHub Actions Workflow

### 3.1 Workflow File

Create `.github/workflows/azure-static-web-apps.yml` in your repository:

```yaml
name: Deploy MAP Website to Azure Static Web Apps

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
    types: [opened, synchronize, reopened, closed]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    name: Build and Deploy

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          VITE_APP_VERSION: ${{ github.sha }}
          VITE_APP_ENV: production

      - name: Deploy to Azure Static Web Apps
        if: github.event_name != 'pull_request'
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"

  close_pull_request:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
          app_location: "/"
          output_location: "dist"
```

### 3.2 Required GitHub Secrets

| Secret Name | Value | Source |
|---|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token from Section 2.3 | Azure CLI |
| `GITHUB_TOKEN` | Automatically provided | GitHub |
| `VITE_API_URL` | Backend API endpoint URL | Application config |
| `VITE_ANALYTICS_ID` | Google Analytics 4 ID | Analytics setup |

### 3.3 Workflow Triggers

| Event | Action |
|---|---|
| Push to `main` | Full build + deploy to production |
| PR to `main` | Build + preview deployment |
| PR closed | Cleanup preview environment |
| Manual dispatch | Re-deploy via Actions tab |

---

## 4. Custom Domain Configuration

### 4.1 Add Custom Domain

1. In Azure Portal, navigate to **Static Web App** → **Custom domains**
2. Click **Add** → **Custom domain on Azure DNS** or **Custom domain on other DNS**

### 4.2 DNS Configuration

Configure DNS records at your registrar:

| Record Type | Host | Value | TTL |
|---|---|---|---|
| `A` | `@` | `20.49.174.215` | 3600 |
| `CNAME` | `www` | `stl-map-website-prod.azurestaticapps.net` | 3600 |

### 4.3 Domain Verification

```bash
# Add custom domain via CLI
az staticwebapp hostname add \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod \
  --hostname "www.map-platform.com"

# Verify domain
az staticwebapp hostname list \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod
```

### 4.4 Redirect www to apex (or vice versa)

Option A — Redirect `www` → apex (recommended):
```bash
az staticwebapp hostname add \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod \
  --hostname "map-platform.com" \
  --validation-method CNAME
```

Option B — Redirect apex → `www`:
Configure redirect rules in `staticwebapp.config.json` (see Section 8).

---

## 5. Environment Variables

### 5.1 Runtime Configuration

Create `staticwebapp.config.json` in the repository root:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html",
      "statusCode": 404
    },
    "500": {
      "rewrite": "/500.html",
      "statusCode": 500
    }
  },
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;"
  },
  "platforms": ["windows", "linux"]
}
```

### 5.2 Build-Time Environment Variables

| Variable | Value | Environment |
|---|---|---|
| `VITE_APP_VERSION` | `${{ github.sha }}` | All |
| `VITE_APP_ENV` | `production` / `staging` | Per environment |
| `VITE_API_URL` | `https://api.map-platform.com` | Production |
| `VITE_API_URL` | `https://api-staging.map-platform.com` | Staging |

---

## 6. SSL/TLS Configuration

### 6.1 Automatic SSL (Default)

Azure Static Web Apps provides automatic SSL certificates:
- Certificate type: Managed (DigiCert)
- Renewal: Automatic, 60 days before expiry
- Protocols: TLS 1.2 and 1.3

### 6.2 Custom SSL Certificate (Optional)

For organisations requiring custom certificates:

```bash
# Upload custom certificate
az static-webapp custom-domain create \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod \
  --hostname "www.map-platform.com" \
  --certificate-file "./cert.pfx" \
  --certificate-password "<password>"
```

### 6.3 TLS Policy

| Setting | Recommendation |
|---|---|
| Minimum TLS version | 1.2 |
| Cipher suites | Strong ciphers only |
| HSTS | Enabled, max-age 31536000 |

---

## 7. CDN Caching Rules

### 7.1 Azure CDN Configuration

1. Enable Azure CDN on the Static Web App
2. Set caching rules:

| Path Pattern | Cache Duration | Compression |
|---|---|---|
| `/images/*` | 30 days | Brotli, Gzip |
| `/fonts/*` | 365 days | Brotli, Gzip |
| `/assets/*.js` | 365 days (immutable) | Brotli, Gzip |
| `/assets/*.css` | 365 days (immutable) | Brotli, Gzip |
| `/*.html` | 0 (no cache) | Brotli, Gzip |
| `/api/*` | 0 (no cache) | None |

### 7.2 Cache-Control Headers

Set via `staticwebapp.config.json` or build output:

```json
{
  "globalHeaders": {
    "Cache-Control": "no-cache"
  }
}
```

For hashed assets, set during build:
```
Cache-Control: public, max-age=31536000, immutable
```

---

## 8. Security Headers Configuration

### 8.1 Required Headers

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer data |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict browser APIs |
| `Content-Security-Policy` | See below | Control resource loading |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |

### 8.2 Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://www.google-analytics.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### 8.3 Implementation

Add to `staticwebapp.config.json`:

```json
{
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
  }
}
```

---

## 9. Monitoring and Alerts

### 9.1 Azure Monitor Metrics

Configure alerts for:

| Metric | Threshold | Severity |
|---|---|---|
| 4xx Error Rate | > 5% for 5 min | Warning |
| 5xx Error Rate | > 1% for 5 min | Critical |
| Response Time | > 2s average for 5 min | Warning |
| Availability | < 99.9% | Critical |
| Data Ingress | > 10 GB/day | Informational |

### 9.2 Alert Actions

| Severity | Action |
|---|---|
| Critical | Email to `ops@map-platform.com` + SMS |
| Warning | Email to `dev@map-platform.com` |
| Informational | Log to Azure Log Analytics |

### 9.3 Log Analytics

```bash
# Create Log Analytics workspace
az monitor log-analytics workspace create \
  --resource-group rg-map-website-prod \
  --workspace-name law-map-website-prod \
  --location westeurope
```

---

## 10. Rollback Procedures

### 10.1 Immediate Rollback (Last Known Good)

```bash
# List recent deployments
az staticwebapp deployment list \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod

# Rollback to specific deployment
az staticwebapp deployment rollback \
  --name stl-map-website-prod \
  --resource-group rg-map-website-prod \
  --deployment-id "<deployment-id>"
```

### 10.2 Git-Based Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or revert to specific commit
git revert <commit-hash>
git push origin main
```

### 10.3 Rollback Checklist

- [ ] Verify rollback completed in Azure Portal
- [ ] Test all pages load correctly
- [ ] Verify no 4xx/5xx errors in Application Insights
- [ ] Notify stakeholders of rollback
- [ ] Create incident report if customer-facing
- [ ] Investigate root cause before re-deploying

---

## 11. Staging vs Production Environments

### 11.1 Environment Comparison

| Setting | Staging | Production |
|---|---|---|
| Azure Resource | `stl-map-website-staging` | `stl-map-website-prod` |
| URL | `https://stl-map-website-staging.azurestaticapps.net` | `https://www.map-platform.com` |
| GitHub Branch | `develop` | `main` |
| SKU | Free | Standard |
| Custom Domain | No | Yes |
| Analytics | Debug mode | Production |
| API Backend | `api-staging.map-platform.com` | `api.map-platform.com` |

### 11.2 Create Staging Environment

```bash
# Create staging Static Web App
az staticwebapp create \
  --name stl-map-website-staging \
  --resource-group rg-map-website-staging \
  --location westeurope \
  --source https://github.com/<org>/map-platform-website \
  --branch develop \
  --app-location "/" \
  --output-location "dist" \
  --sku Free
```

### 11.3 Deployment Flow

```
Feature Branch → PR to develop → Deploy to staging → Test
    ↓
PR to main → Deploy to production → Monitor
    ↓
Tagged Release → Promote to production (if needed)
```

### 11.4 Staging Promotion

1. Verify staging environment passes all checks
2. Create PR from `develop` to `main`
3. CI/CD pipeline deploys to production
4. Monitor production for 15 minutes
5. Confirm deployment success

---

## 12. Performance Monitoring with Azure Application Insights

### 12.1 Create Application Insights

```bash
# Create Application Insights resource
az monitor app-insights component create \
  --app map-website-insights \
  --resource-group rg-map-website-prod \
  --location westeurope \
  --kind web

# Get instrumentation key
az monitor app-insights component show \
  --app map-website-insights \
  --resource-group rg-map-website-prod \
  --query instrumentationKey
```

### 12.2 Client-Side Integration

Add to HTML `<head>`:

```html
<script type="text/javascript">
  var sdkInstance="appInsightsSDK";window[sdkInstance]=window[sdkInstance]||function(e){(window[sdkInstance].q=window[sdkInstance].q||[]).push(e)},["initialize","trackPageView","trackEvent","trackException","setAuthenticatedUserContext","clearAuthenticatedUserContext","start"].forEach(function(e){window[sdkInstance][e]=function(){var n=arguments;window[sdkInstance].q.push(function(){window[sdkInstance][e].apply(window[sdkInstance],n)})}});
  var config={ instrumentationKey:"<YOUR_INSTRUMENTATION_KEY>" };window[sdkInstance](config);
</script>
```

### 12.3 Key Metrics Dashboard

| Metric | Target | Alert Threshold |
|---|---|---|
| Page load time | < 3 s | > 5 s |
| Time to interactive | < 4 s | > 6 s |
| Failed requests | < 0.1% | > 1% |
| Server response time | < 500 ms | > 1 s |
| Availability | > 99.95% | < 99.9% |

### 12.4 Custom Telemetry Events

Track custom events for business insights:

```javascript
// Track demo request
appInsights.trackEvent({
  name: "DemoRequested",
  properties: {
    companyName: companyInput.value,
    industry: industrySelect.value
  }
});

// Track page navigation
appInsights.trackPageView({
  name: "Platform Overview",
  uri: window.location.href
});
```

---

## 13. Post-Deployment Checklist

### Immediate (0–5 minutes)

- [ ] Verify deployment status in Azure Portal
- [ ] Confirm all 8 pages load correctly
- [ ] Check SSL certificate validity
- [ ] Verify custom domain resolves
- [ ] Test navigation links between all pages
- [ ] Confirm form submission (contact page)

### Short-Term (5–30 minutes)

- [ ] Run Lighthouse audit (target: 90+ all categories)
- [ ] Verify Core Web Vitals in PageSpeed Insights
- [ ] Check Application Insights for errors
- [ ] Verify robots.txt and sitemap.xml accessible
- [ ] Test Google Search Console URL inspection
- [ ] Confirm analytics tracking fires correctly

### Medium-Term (1–24 hours)

- [ ] Monitor error rates in Azure Monitor
- [ ] Verify SEO metadata renders correctly
- [ ] Test social sharing (Open Graph tags)
- [ ] Check accessibility with screen reader
- [ ] Monitor performance metrics for regressions

### Ongoing

- [ ] Weekly Lighthouse audits
- [ ] Monthly accessibility reviews
- [ ] Quarterly security header audits
- [ ] Annual SSL certificate rotation (auto-managed)

---

*End of Deployment Instructions.*
