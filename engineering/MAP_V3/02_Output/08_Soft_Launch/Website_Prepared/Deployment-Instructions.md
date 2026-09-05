# Deployment Instructions — MAP Website

## Migration Assurance Platform (MAP)

Version 1.0
Status: Complete

---

# Overview

This document provides step-by-step instructions for deploying the MAP website to Azure Static Web Apps.

---

# Prerequisites

- Azure subscription
- Azure CLI installed
- Git repository with MAP website code
- Node.js (for Azure Static Web Apps CLI)

---

# Option 1: Azure Static Web Apps (Recommended)

## Step 1: Create Azure Static Web Apps Resource

```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-map-website-prod --location eastus

# Create Static Web App
az staticwebapp create \
  --name swa-map-website \
  --resource-group rg-map-website-prod \
  --location eastus \
  --sku Free
```

## Step 2: Configure Deployment

### From Azure Portal:
1. Navigate to the Static Web App resource
2. Click "Deployment" → "Add deployment"
3. Connect to GitHub repository
4. Configure build settings:
   - Build preset: Custom
   - App location: / (root)
   - Output location: / (root)
   - API location: (leave empty)

### From Azure CLI:
```bash
# Get deployment token
az staticwebapp deployment-token list \
  --name swa-map-website \
  --resource-group rg-map-website-prod
```

## Step 3: GitHub Actions Workflow

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Deploy MAP Website

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "/"
```

## Step 4: Deploy

```bash
# Push to main branch triggers deployment
git push origin main

# Or deploy manually using CLI
swa deploy ./ --env production
```

---

# Option 2: Azure Storage + CDN

## Step 1: Create Storage Account

```bash
az storage account create \
  --name stmapwebsite \
  --resource-group rg-map-website-prod \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2
```

## Step 2: Enable Static Website

```bash
az storage blob service-properties update \
  --account-name stmapwebsite \
  --static-website \
  --index-document index.html \
  --404-document 404.html
```

## Step 3: Upload Files

```bash
az storage blob upload-batch \
  --account-name stmapwebsite \
  --source ./ \
  --destination \$web \
  --pattern "*.html" \
  --overwrite

az storage blob upload-batch \
  --account-name stmapwebsite \
  --source ./css \
  --destination \$web/css \
  --overwrite

az storage blob upload-batch \
  --account-name stmapwebsite \
  --source ./js \
  --destination \$web/js \
  --overwrite
```

## Step 4: Configure CDN (Optional)

```bash
# Create CDN profile
az cdn profile create \
  --name cdn-map-website \
  --resource-group rg-map-website-prod \
  --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create \
  --name endpoint-map-website \
  --profile-name cdn-map-website \
  --origin stmapwebsite.blob.core.windows.net \
  --origin-host-header stmapwebsite.blob.core.windows.net
```

---

# Custom Domain Configuration

## Step 1: Add Custom Domain

1. In Azure Static Web Apps, navigate to "Custom domains"
2. Click "Add custom domain"
3. Enter domain: migrationassurance.com
4. Verify DNS ownership

## Step 2: Configure DNS

Add the following DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | swa-map-website.azurestaticapps.net | 3600 |
| CNAME | www | swa-map-website.azurestaticapps.net | 3600 |

## Step 3: SSL Certificate

Azure Static Web Apps provides free SSL certificates automatically.
- Certificate is provisioned automatically
- Renewal is handled by Azure
- No manual configuration required

---

# Environment Configuration

## Production Environment
- URL: https://migrationassurance.com
- SKU: Standard
- Auto-generated URL: https://swa-map-website.azurestaticapps.net

## Staging Environment
- URL: https://swa-map-website-staging.azurestaticapps.net
- Triggered by pull requests

---

# Post-Deployment Verification

## Checklist

- [ ] All pages load correctly
- [ ] Navigation links work between pages
- [ ] CSS styles are applied correctly
- [ ] JavaScript interactions work (modals, FAQ, animations)
- [ ] Forms submit correctly
- [ ] Responsive design works on mobile
- [ ] SSL certificate is active
- [ ] Custom domain resolves
- [ ] Page load time < 3 seconds
- [ ] All images load
- [ ] SEO meta tags are present
- [ ] Structured data validates

## Validation Commands

```bash
# Check SSL certificate
curl -I https://migrationassurance.com

# Validate HTML
npx html-validate *.html

# Check performance
npx lighthouse https://migrationassurance.com

# Validate structured data
# Use Google Rich Results Test: https://search.google.com/test/rich-results
```

---

# Rollback Procedure

1. In Azure Portal, navigate to the Static Web App
2. Go to "Deployment history"
3. Select the previous working deployment
4. Click "Promote to production"

---

# Monitoring

## Azure Monitor
- Enable Application Insights
- Monitor page load times
- Track user sessions

## Uptime Monitoring
- Configure uptime monitoring (Azure Monitor or third-party)
- Set up alerts for downtime

---

# Maintenance

## Regular Tasks
- Monthly: Review performance metrics
- Quarterly: Update content as needed
- Annually: Review and update SEO metadata

## Content Updates
1. Edit HTML files
2. Push to main branch
3. Deployment is automatic
4. Verify changes on production
