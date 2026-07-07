# DP-08 - DevOps & Release Management Plan

## Migration Assurance Platform (MAP)

Version 1.0
Status: Complete

---

# Purpose

This document defines the DevOps and Release Management Plan for the Migration Assurance Platform (MAP) Release 1.

It establishes the continuous integration, continuous delivery, release management, deployment strategy, infrastructure automation, and operational practices that will enable repeatable, reliable, and secure delivery of the MAP solution.

This plan translates the Delivery Strategy (DP-01) and Agile Delivery Framework (DP-02) into concrete DevOps engineering practices, aligned with the Azure Architecture Strategy (AZ-01), Azure Landing Zone (AZ-02), Environment Architecture (AZ-03), Azure Security Architecture (AZ-04), Azure Integration Architecture (AZ-06), Azure Monitoring & Operations (AZ-07), and Azure Architecture Review & Sign-off (AZ-10).

---

# Objectives

The DevOps and Release Management Plan must:

### Enable Repeatable Delivery

---

### Ensure Deployment Consistency

---

### Provide Full Traceability

---

### Minimise Deployment Risk

---

### Accelerate Feedback Loops

---

### Maintain Security Compliance

---

### Support Rapid Recovery

---

# DevOps Vision

MAP DevOps will use:

> An automated, traceable, and reliable DevOps practice that enables incremental controlled releases across multiple environments with rapid feedback, rollback capability, and full governance compliance.

---

# DevOps Principles

## Principle 1 - Automation

All build, test, and deployment activities are automated to eliminate manual error and accelerate delivery.

---

## Principle 2 - Consistency

Every deployment follows the same validated process regardless of target environment.

---

## Principle 3 - Traceability

Every change is traceable from code commit through to production deployment.

---

## Principle 4 - Reliability

Pipeline processes are designed to fail fast and recover quickly.

---

## Principle 5 - Continuous Improvement

DevOps practices are continuously measured and improved through retrospectives and metrics.

---

# CI/CD Pipeline Architecture

## Overview

The CI/CD pipeline provides an end-to-end automated path from code commit to production deployment.

---

# Pipeline Stages

```text
Source Control
      |
Build
      |
Unit Tests
      |
Security Scan
      |
Container Build
      |
Deploy to TEST
      |
Integration Tests
      |
Deploy to UAT
      |
Approval Gate
      |
Deploy to PROD
      |
Post-Deploy Validation
```

---

# Pipeline Architecture Diagram

```text
Developer Commit
      |
GitHub / Azure DevOps Repo
      |
CI Trigger (Push / PR)
      |
+-----------------------------------------------+
| Build Stage                                    |
| - Restore Dependencies                         |
| - Compile Application                          |
| - Run Unit Tests                               |
| - Generate Code Coverage Report                |
| - Run Static Code Analysis                     |
+-----------------------------------------------+
      |
+-----------------------------------------------+
| Security Stage                                 |
| - SAST Scan (SonarQube / Checkmarx)           |
| - Dependency Scan (Snyk / Dependabot)         |
| - Container Image Scan (Trivy / Qualys)       |
| - Secret Detection (GitLeaks)                  |
+-----------------------------------------------+
      |
+-----------------------------------------------+
| Artifact Stage                                 |
| - Build Docker Image                           |
| - Push to Azure Container Registry             |
| - Publish Deployment Manifest                  |
| - Tag with Semantic Version                    |
+-----------------------------------------------+
      |
+-----------------------------------------------+
| Deploy to DEV (Automatic)                      |
| - Apply IaC Templates                          |
| - Deploy Container Image                       |
| - Apply Configuration                          |
| - Run Smoke Tests                              |
+-----------------------------------------------+
      |
+-----------------------------------------------+
| Deploy to TEST (Automated + Gate)              |
| - Promote Container Image                      |
| - Apply Environment Config                     |
| - Run Integration Tests                        |
| - Generate Test Report                         |
+-----------------------------------------------+
      |
+-----------------------------------------------+
| Deploy to UAT (Manual Approval)                |
| - Approval Gate                                |
| - Promote Container Image                      |
| - Apply Environment Config                     |
| - Run UAT Validation Suite                     |
| - Business Sign-off Required                   |
+-----------------------------------------------+
      |
+-----------------------------------------------+
| Deploy to PROD (Manual Approval + Change Mgmt) |
| - Change Advisory Board Approval               |
| - Promote Container Image                      |
| - Apply Production Config                      |
| - Blue-Green / Canary Deployment               |
| - Post-Deployment Health Checks                |
+-----------------------------------------------+
```

---

# Source Control Strategy

## Repository

Single monorepo managed in GitHub or Azure DevOps Repos.

---

# Branching Model

```text
main (production)
  |
develop (integration)
  |
feature/* (feature branches)
  |
release/* (release preparation)
  |
hotfix/* (emergency fixes)
```

---

# Branch Definitions

| Branch            | Purpose                          | Merges Into      |
| ----------------- | -------------------------------- | ---------------- |
| main              | Production-ready code            | None (protected) |
| develop           | Integration branch               | main (via release) |
| feature/*         | New feature development          | develop          |
| release/*         | Release preparation and stabilisation | main + develop |
| hotfix/*          | Emergency production fixes       | main + develop   |

---

# Branch Protection Rules

### main Branch

* No direct commits
* Pull request required
* Minimum 2 reviewer approvals
* All pipeline stages must pass
* Branch must be up to date before merge

---

### develop Branch

* No direct commits
* Pull request required
* Minimum 1 reviewer approval
* CI pipeline must pass

---

# Build Pipeline

## Build Triggers

| Trigger          | Description                        |
| ---------------- | ---------------------------------- |
| Push to develop  | Triggers full CI pipeline          |
| Pull Request     | Triggers CI build and tests        |
| Release branch   | Triggers build and security scan   |
| Scheduled        | Nightly build for regression tests |

---

# Build Steps

| Step                      | Description                              |
| ------------------------- | ---------------------------------------- |
| 1. Checkout               | Pull source code from repository         |
| 2. Restore Dependencies   | NuGet / npm package restore              |
| 3. Compile                | Build application binaries               |
| 4. Run Unit Tests         | Execute unit test suite with coverage    |
| 5. Static Code Analysis   | SonarQube quality gate analysis          |
| 6. Security Scan          | SAST and dependency vulnerability scan   |
| 7. Build Container Image  | Docker build with version tag            |
| 8. Push to ACR            | Push image to Azure Container Registry   |
| 9. Generate Manifest      | Create deployment manifest for target    |
| 10. Publish Artifacts     | Store build artifacts for release        |

---

# Artifact Generation

### Build Artifacts

| Artifact                 | Format          | Storage           |
| ------------------------ | --------------- | ----------------- |
| Application Binary       | .zip / Docker   | Azure Artifacts   |
| Docker Image             | OCI Image       | Azure Container Registry |
| Deployment Manifest      | YAML / Bicep    | Azure Artifacts   |
| Test Results             | TRX / JUnit XML | Azure DevOps      |
| Code Coverage            | Cobertura       | Azure DevOps      |
| Security Scan Report     | SARIF / JSON    | Security Dashboard|

---

# Test Pipeline

## Unit Tests

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Framework               | xUnit / NUnit / Jest                  |
| Execution               | Every CI build                        |
| Coverage Threshold      | Minimum 80% line coverage             |
| Failure Policy          | Block pipeline on failure             |
| Reporting               | Publish to Azure DevOps               |

---

# Integration Tests

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Framework               | xUnit + Testcontainers / Cypress      |
| Execution               | After deploy to TEST                  |
| Test Data               | Synthetic data in isolated environment|
| Failure Policy          | Block promotion to UAT                |
| Reporting               | Publish test results and trends       |

---

# Security Scans

| Scan Type               | Tool              | Frequency           |
| ----------------------- | ----------------- | ------------------- |
| Static Analysis (SAST)  | SonarQube         | Every build         |
| Dependency Scan         | Snyk / Dependabot | Every build         |
| Container Image Scan    | Trivy             | Every image build   |
| Secret Detection        | GitLeaks          | Every commit        |
| Dynamic Analysis (DAST) | OWASP ZAP         | Pre-production      |

---

# Release Pipeline

## Environment Promotion Flow

```text
DEV
  |
TEST
  |
UAT
  |
PROD
```

---

# Promotion Criteria

| From    | To     | Criteria                                    |
| ------- | ------ | ------------------------------------------- |
| Build   | DEV    | CI build succeeds                           |
| DEV     | TEST   | Unit tests pass, no critical defects        |
| TEST    | UAT    | Integration tests pass, security scan clear |
| UAT     | PROD   | Business approval, change management sign-off |

---

# Approval Gates

| Gate               | Approvers                                | Type              |
| ------------------ | ---------------------------------------- | ----------------- |
| TEST Deployment    | Lead Engineer                            | Automated         |
| UAT Deployment     | Product Owner + QA Lead                  | Manual Approval   |
| PROD Deployment    | Product Owner + Delivery Lead + CAB      | Manual + Change Mgmt |

---

# Source Control Management

## Git Workflow

All development follows a GitFlow-inspired branching model adapted for continuous delivery.

---

# Pull Request Process

| Step | Action                                     |
| ---- | ------------------------------------------ |
| 1    | Developer creates feature branch           |
| 2    | Developer commits changes with clear messages |
| 3    | Developer opens Pull Request to develop     |
| 4    | CI pipeline runs automatically              |
| 5    | Code review by minimum 1 reviewer           |
| 6    | Address review feedback                     |
| 7    | Merge to develop after approval and passing CI |

---

# Code Review Requirements

| Requirement                | Detail                                |
| -------------------------- | ------------------------------------- |
| Minimum Reviewers          | 1 for develop, 2 for main             |
| Review Checklist           | Security, performance, readability    |
| Automated Checks           | Linting, unit tests, build success    |
| Review Timeline            | Within 24 business hours              |
| Dismiss Stale Approvals    | Yes, on new commits                   |

---

# Commit Message Standards

Format:

```text
type(scope): description

[optional body]

[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore, security

---

# Build Automation

## Build Process

The build process is fully automated through CI pipelines defined in YAML.

---

# Build Configuration

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Build Agent             | Azure Pipelines Agent / GitHub Actions Runner |
| Build Configuration     | Release mode for all environments     |
| Dependency Management   | Package feeds via Azure Artifacts     |
| Caching                 | NuGet / npm package cache             |
| Parallel Execution      | Enabled for test suites               |

---

# Dependency Management

```text
Azure Artifacts Feed
      |
+-----------+-----------+
|           |           |
NuGet     npm       Docker
Packages  Packages  Images
```

---

# Artifact Management

| Artifact Type        | Registry                  | Retention   |
| -------------------- | ------------------------- | ----------- |
| Docker Images        | Azure Container Registry  | 30 days     |
| Build Packages       | Azure Artifacts           | 90 days     |
| Deployment Manifests | Source Control            | Permanent   |
| Test Results         | Azure DevOps              | 90 days     |
| Security Reports     | Security Dashboard       | 1 year      |

---

# Versioning Strategy

All artifacts use semantic versioning aligned with build numbering.

---

# Infrastructure as Code

## IaC Approach

All Azure infrastructure is provisioned and managed through Infrastructure as Code.

---

# IaC Tools

| Tool              | Purpose                                |
| ----------------- | -------------------------------------- |
| Bicep             | Primary Azure resource deployment      |
| ARM Templates     | Fallback for complex templates         |
| Terraform         | Multi-cloud compatibility (if required)|
| Azure CLI         | Supplementary scripting                |

---

# Template Management

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Template Location       | /infra/bicep directory in repo        |
| Parameter Files         | Per environment (dev.bicepparam, test.bicepparam, etc.) |
| Module Library          | Reusable Bicep modules                 |
| Validation              | What-if analysis before deployment    |
| State Management        | Azure backend state files             |

---

# Resource Naming Convention

Pattern: `resource-solution-environment-purpose`

| Resource Type          | Naming Pattern                          |
| ---------------------- | --------------------------------------- |
| Resource Group         | rg-map-{env}-{purpose}                  |
| App Service            | app-map-{env}-api                       |
| SQL Server             | sql-map-{env}-primary                   |
| Key Vault              | kv-map-{env}-secrets                    |
| Container Registry     | crmap{env}                              |
| Application Insights   | ai-map-{env}-monitoring                 |
| Virtual Network        | vnet-map-{env}-network                  |
| Storage Account        | stmap{env}{purpose}                     |

---

# Environment Provisioning

| Environment | Provisioning Method  | Approval Required |
| ----------- | -------------------- | ----------------- |
| DEV         | Automated via IaC    | No                |
| TEST        | Automated via IaC    | No                |
| UAT         | Automated via IaC    | Yes               |
| PROD        | Automated via IaC    | Yes + CAB         |

---

# Azure Policy

| Policy Category         | Application                             |
| ----------------------- | --------------------------------------- |
| Resource Tagging        | Mandatory tags on all resources         |
| Allowed SKUs            | Restrict to approved VM/service SKUs    |
| Location                | Restrict to approved Azure regions      |
| Encryption              | Enforce encryption at rest and in transit|
| Network                 | Restrict public access where possible   |

---

# RBAC Strategy

| Role                    | Scope                   | Assignment       |
| ----------------------- | ----------------------- | ---------------- |
| Contributor             | Subscription            | Platform Team    |
| Reader                  | All Environments        | All Team Members |
| Key Vault Secrets User  | Key Vault per Env       | App Service      |
| AcrPull                 | Container Registry      | App Service      |
| SQL DB Contributor      | SQL Server              | App Service      |

---

# Containerisation Strategy

## Docker Containers

All application components are packaged as Docker containers for consistent deployment.

---

# Container Architecture

```text
Source Code
      |
Dockerfile
      |
Docker Build
      |
Container Image
      |
Azure Container Registry
      |
Kubernetes / App Service
```

---

# Docker Configuration

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Base Image              | mcr.microsoft.com/dotnet/aspnet       |
| Multi-stage Build       | Yes, for smaller production images     |
| Non-root User           | Required for security                 |
| Health Checks           | Built into Dockerfile                 |
| Layer Caching           | Optimised for faster builds           |

---

# Azure Container Registry

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Registry Name           | crmap{env}                            |
| SKU                     | Standard                              |
| Admin Access            | Disabled                              |
| Content Trust           | Enabled for image signing             |
| Retention Policy        | 30 days for untagged images           |
| Webhook Triggers        | Configured for deployment pipelines   |

---

# Image Management

| Practice                | Detail                                |
| ----------------------- | ------------------------------------- |
| Image Tagging           | Semantic version + commit SHA         |
| Image Scanning          | Trivy scan on every push              |
| Image Promotion         | Promote image from DEV to TEST to UAT to PROD |
| Image Retention         | Keep last 10 tagged images per env    |
| Vulnerability Patching  | Weekly base image updates             |

---

# Deployment Strategy

## Environment Deployment Details

### DEV Environment

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Trigger                 | Automatic on merge to develop          |
| Approval Gate           | None                                  |
| Deployment Method       | Container replacement                 |
| Rollback                | Redeploy previous version             |
| Monitoring              | Basic health checks                   |
| Availability            | Business hours only                   |

---

### TEST Environment

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Trigger                 | Automated after DEV validation        |
| Approval Gate           | Automated gate (test results)         |
| Deployment Method       | Container replacement                 |
| Rollback                | Redeploy previous version             |
| Monitoring              | Health checks + integration tests     |
| Availability            | Business hours + extended test windows|

---

### UAT Environment

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Trigger                 | Manual approval required              |
| Approval Gate           | Product Owner + QA Lead               |
| Deployment Method       | Blue-Green deployment                 |
| Rollback                | Switch traffic to previous slot       |
| Monitoring              | Full monitoring stack                 |
| Availability            | Aligned with UAT testing windows      |

---

### PROD Environment

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Trigger                 | Manual approval + change management   |
| Approval Gate           | Product Owner + Delivery Lead + CAB   |
| Deployment Method       | Blue-Green / Canary deployment        |
| Rollback                | Blue-Green switch or canary rollback  |
| Monitoring              | Full monitoring + alerting            |
| Availability            | 24/7                                  |

---

# Deployment Patterns

## Blue-Green Deployment

```text
Load Balancer
     |
+---------+---------+
|                   |
Blue (current)    Green (new)
|                   |
Traffic           Traffic
100%              0%
     |
Validate Green
     |
Switch Traffic
     |
Blue (old)       Green (current)
|                   |
Traffic           Traffic
0%               100%
```

---

## Rolling Deployment

```text
Instance 1  Instance 2  Instance 3  Instance 4
[v1]        [v1]        [v1]        [v1]
     |
[v2]        [v1]        [v1]        [v1]
     |
[v2]        [v2]        [v1]        [v1]
     |
[v2]        [v2]        [v2]        [v1]
     |
[v2]        [v2]        [v2]        [v2]
```

---

## Canary Deployment

```text
Load Balancer
     |
+---------+---------+
|                   |
90% Traffic     10% Traffic
|                   |
Stable (v1)     Canary (v2)
     |
Validate Canary
     |
Promote or Rollback
```

---

# Release Management

## Release Process Overview

```text
Release Planning
      |
Release Creation
      |
Release Validation
      |
Release Approval
      |
Release Deployment
      |
Post-Release Verification
```

---

# Release Planning

| Activity                  | Detail                                |
| ------------------------- | ------------------------------------- |
| Sprint Planning           | Identify release candidates           |
| Backlog Refinement        | Prepare stories for next release      |
| Dependency Check          | Identify blockers                     |
| Risk Assessment           | Evaluate release risk                 |
| Schedule                  | Align to sprint cadence               |

---

# Release Creation

| Activity                  | Detail                                |
| ------------------------- | ------------------------------------- |
| Feature Freeze            | Code complete for release scope       |
| Release Branch            | Create release/* branch from develop  |
| Version Bump              | Update version numbers                |
| Changelog                 | Document changes                      |
| Build                     | Trigger release build pipeline        |

---

# Release Validation

| Activity                  | Detail                                |
| ------------------------- | ------------------------------------- |
| Unit Test Suite           | All tests pass                        |
| Integration Test Suite    | All tests pass                        |
| Security Scan             | No critical/high vulnerabilities      |
| Performance Test          | Meets performance thresholds          |
| Smoke Test                | Core flows validated                  |
| UAT Sign-off              | Business acceptance confirmed         |

---

# Release Approval

| Environment | Approval Requirement                    |
| ----------- | --------------------------------------- |
| DEV         | Automated (CI pipeline passes)          |
| TEST        | Automated (test gate passes)            |
| UAT         | Product Owner + QA Lead manual approval |
| PROD        | Product Owner + Delivery Lead + CAB approval |

---

# Release Deployment

| Activity                  | Detail                                |
| ------------------------- | ------------------------------------- |
| Pre-deployment Checklist  | Verify all approvals in place         |
| Deployment Execution      | Execute deployment pipeline           |
| Smoke Tests               | Verify post-deployment health         |
| Monitoring                | Monitor for anomalies                 |
| Communication             | Notify stakeholders of deployment     |

---

# Post-Release Verification

| Activity                  | Detail                                |
| ------------------------- | ------------------------------------- |
| Health Monitoring         | 30-minute observation window          |
| Error Rate Check          | Verify error rates within thresholds  |
| Performance Check         | Verify response times within SLA      |
| User Feedback             | Collect initial user feedback         |
| Retrospective             | Release retrospective within 48 hours |

---

# Release Versioning

## Semantic Versioning Strategy

Format: `MAJOR.MINOR.PATCH`

```text
MAJOR.MINOR.PATCH
  |      |     |
  |      |     +-- Bug fixes, security patches
  |      +-------- New features, backward compatible
  +--------------- Breaking changes
```

---

# Version Assignment Rules

| Change Type                | Version Impact                          |
| -------------------------- | --------------------------------------- |
| New feature                | Increment MINOR                         |
| Bug fix                    | Increment PATCH                         |
| Security patch             | Increment PATCH                         |
| Breaking change            | Increment MAJOR                         |
| Pre-release                | Append -alpha / -beta / -rc             |
| Build metadata             | Append +buildnumber                      |

---

# Version Examples

| Version          | Meaning                                 |
| ---------------- | --------------------------------------- |
| 1.0.0            | Initial MVP release                     |
| 1.1.0            | Feature addition                        |
| 1.1.1            | Bug fix                                 |
| 1.1.2            | Security patch                          |
| 2.0.0            | Major refactoring / breaking change     |
| 1.2.0-alpha.1    | Pre-release for testing                 |

---

# Release Cadence

## Sprint-Aligned Releases

Releases align with the two-week sprint cadence.

---

# Release Schedule

| Release Type     | Cadence           | Scope                     |
| ---------------- | ----------------- | ------------------------- |
| Sprint Release   | Every 2 weeks     | Completed sprint features |
| Patch Release    | As needed         | Critical bug/security fixes |
| Emergency Fix    | Immediate         | Production hotfixes       |

---

# Release Calendar

```text
Sprint 1  -->  Release 1.0.0  -->  DEV/TEST
Sprint 2  -->  Release 1.1.0  -->  DEV/TEST/UAT/PROD
Sprint 3  -->  Release 1.2.0  -->  DEV/TEST/UAT/PROD
Sprint 4  -->  Release 1.3.0  -->  DEV/TEST/UAT/PROD
  ...
```

---

# Hotfix Process

## Emergency Change Procedure

Hotfixes address critical production issues requiring immediate resolution.

---

# Hotfix Workflow

```text
Production Issue Identified
      |
Create Hotfix Branch from main
      |
Develop Fix
      |
Run Unit Tests + Security Scan
      |
Create Pull Request to main
      |
Emergency Review (Min 1 Reviewer)
      |
Merge to main
      |
Deploy to DEV (Validate)
      |
Deploy to TEST (Validate)
      |
Deploy to PROD (Emergency Approval)
      |
Merge hotfix/* back to develop
      |
Close Hotfix
```

---

# Hotfix Rules

| Rule                         | Detail                                |
| ---------------------------- | ------------------------------------- |
| Branch Naming                | hotfix/issue-number-description       |
| Review Requirement           | Minimum 1 reviewer (expedited)        |
| Testing Requirement          | Unit tests + smoke tests mandatory    |
| Approval                     | Delivery Lead + Product Owner         |
| Time Limit                   | Deploy within 4 hours of approval     |
| Post-fix Merge               | Merge back to develop within 24 hours |

---

# Rollback Procedures

## Rollback Strategy

Each deployment type has a defined rollback procedure.

---

# Rollback by Deployment Type

### Container Replacement (DEV/TEST)

| Step | Action                                     |
| ---- | ------------------------------------------ |
| 1    | Identify failing deployment                |
| 2    | Retrieve previous container image tag      |
| 3    | Redeploy previous version                  |
| 4    | Verify application health                  |
| 5    | Notify team of rollback                    |

---

### Blue-Green Deployment (UAT/PROD)

| Step | Action                                     |
| ---- | ------------------------------------------ |
| 1    | Identify failing deployment                |
| 2    | Switch load balancer to previous slot      |
| 3    | Verify traffic routing                     |
| 4    | Monitor for stability                      |
| 5    | Decommission failed slot                   |

---

### Canary Deployment (PROD)

| Step | Action                                     |
| ---- | ------------------------------------------ |
| 1    | Identify canary anomaly                    |
| 2    | Redirect 100% traffic to stable version    |
| 3    | Shut down canary instance                  |
| 4    | Monitor for stability                      |
| 5    | Investigate canary failure                 |

---

# Rollback Triggers

| Trigger                          | Threshold                           |
| -------------------------------- | ----------------------------------- |
| Error Rate                       | > 5% of requests                    |
| Response Time                    | > 3 seconds (P95)                   |
| Health Check Failure             | > 3 consecutive failures            |
| Critical Bug                     | Data integrity or security issue    |
| Dependency Failure               | External service unavailable        |

---

# Rollback Approval

| Environment | Approval Required                      |
| ----------- | -------------------------------------- |
| DEV         | Engineer (self-service)                |
| TEST        | Engineer + Lead                        |
| UAT         | QA Lead + Product Owner                |
| PROD        | Delivery Lead + Product Owner          |

---

# Release Sign-off Criteria

## Per Environment

### DEV Sign-off

| Criterion                    | Requirement                           |
| ---------------------------- | ------------------------------------- |
| Build Success                | CI pipeline passes                    |
| Unit Tests                   | All pass with > 80% coverage          |
| Code Review                  | Approved by reviewer                  |
| Static Analysis              | No new critical issues                |

---

### TEST Sign-off

| Criterion                    | Requirement                           |
| ---------------------------- | ------------------------------------- |
| Integration Tests            | All pass                              |
| Security Scan                | No critical/high vulnerabilities      |
| Performance Test             | Within thresholds                     |
| Regression Test              | No regression detected                |

---

### UAT Sign-off

| Criterion                    | Requirement                           |
| ---------------------------- | ------------------------------------- |
| Business Validation          | Product Owner acceptance              |
| UAT Test Suite               | All acceptance tests pass             |
| Data Validation              | Data migration verified               |
| Documentation                | User documentation updated            |

---

### PROD Sign-off

| Criterion                    | Requirement                           |
| ---------------------------- | ------------------------------------- |
| Change Advisory Board        | CAB approval obtained                 |
| Security Review              | Security team sign-off                |
| Operational Readiness        | Monitoring and alerting configured    |
| Rollback Plan                | Rollback procedure documented         |
| Communication Plan           | Stakeholder notification sent         |

---

# Release Sign-off Matrix

| Area                 | DEV    | TEST   | UAT    | PROD   |
| -------------------- | ------ | ------ | ------ | ------ |
| Build Status         | Pass   | Pass   | Pass   | Pass   |
| Unit Tests           | Pass   | Pass   | Pass   | Pass   |
| Integration Tests    | N/A    | Pass   | Pass   | Pass   |
| Security Scan        | Pass   | Pass   | Pass   | Pass   |
| UAT Tests            | N/A    | N/A    | Pass   | Pass   |
| Business Approval    | N/A    | N/A    | Yes    | Yes    |
| CAB Approval         | N/A    | N/A    | N/A    | Yes    |
| Rollback Plan        | Optional | Optional | Required | Required |

---

# Configuration Management

## Per-Environment Configuration

| Configuration Item   | DEV                  | TEST                 | UAT                  | PROD                 |
| -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| Database Connection  | Dev connection string| Test connection string| UAT connection string| Prod connection string|
| API Endpoints        | Dev endpoints        | Test endpoints       | UAT endpoints        | Prod endpoints       |
| Log Level            | Debug                | Information          | Warning              | Warning              |
| Feature Flags        | All enabled          | Selected enabled     | Production subset    | Production subset    |
| Rate Limiting        | Disabled             | Relaxed              | Standard             | Standard             |
| Caching              | Disabled             | Disabled             | Enabled              | Enabled              |

---

# Configuration Sources

```text
App Configuration (Azure App Config)
      |
+-----------+-----------+
|           |           |
Feature   Environment  Secret
Flags     Variables    References
|           |           |
Per-env    Per-env     Key Vault
settings   settings    integration
```

---

# Secret Management

## Azure Key Vault Integration

| Aspect                  | Detail                                |
| ----------------------- | ------------------------------------- |
| Key Vault per Env       | kv-map-{env}-secrets                  |
| Access Policy           | RBAC mode enabled                     |
| Secret Rotation         | Automated via Azure Functions         |
| Audit Logging           | All access logged to Log Analytics    |
| Recovery                | Soft delete + purge protection        |

---

# Managed Identities

| Resource                | Identity Type     | Key Vault Access    |
| ----------------------- | ----------------- | ------------------- |
| App Service             | System-assigned   | Secrets User        |
| Azure Functions         | System-assigned   | Secrets User        |
| Azure DevOps Pipeline   | Service Principal | Contributor         |
| AKS Cluster             | System-assigned   | Secrets User        |

---

# Secret Categories

| Category               | Examples                                | Rotation           |
| ---------------------- | --------------------------------------- | ------------------ |
| Database Credentials   | Connection strings, passwords           | 90 days            |
| API Keys               | External service keys                   | 90 days            |
| Certificates           | TLS certificates                        | 365 days           |
| Encryption Keys        | Data encryption keys                    | 180 days           |
| Service Bus Keys       | Namespace connection strings            | 90 days            |

---

# Secret Naming Convention

Pattern: `solution-secret-type-purpose`

| Secret                  | Naming Pattern                          |
| ----------------------- | --------------------------------------- |
| Database Password       | map-db-password-primary                 |
| API Key                 | map-api-key-externalservice             |
| TLS Certificate         | map-tls-cert-api                        |
| Storage Key             | map-storage-key-primary                 |

---

# Monitoring & Alerting

## CI/CD Pipeline Monitoring

| Metric                      | Source               | Alert Threshold     |
| --------------------------- | -------------------- | ------------------- |
| Pipeline Success Rate       | Azure DevOps / GitHub| < 90%               |
| Average Build Duration      | Azure DevOps / GitHub| > 20 minutes        |
| Test Failure Rate           | Azure DevOps / GitHub| > 5%                |
| Deployment Failure Rate     | Azure DevOps / GitHub| > 2%                |
| Security Scan Failures      | Security Dashboard   | Any critical finding|

---

# Pipeline Metrics Dashboard

```text
+--------------------------------------------+
| CI/CD Pipeline Dashboard                    |
+--------------------------------------------+
| Build Success Rate      | 98%              |
| Average Build Time      | 12 minutes       |
| Test Pass Rate          | 99.2%            |
| Deployment Success      | 99.5%            |
| Mean Time to Deploy     | 25 minutes       |
| Rollback Rate           | 1.2%             |
+--------------------------------------------+
```

---

# Failure Notifications

| Event                      | Notification Channel  | Recipients         |
| -------------------------- | --------------------- | ------------------ |
| Build Failure              | Teams / Slack         | Engineering Team   |
| Test Failure               | Teams / Slack         | Engineering Team   |
| Security Scan Failure      | Teams / Slack + Email | Security + Engineering |
| Deployment Failure         | Teams / Slack + Email | Delivery Lead + Engineering |
| Production Incident        | PagerDuty / Email     | On-call Team       |

---

# Application Monitoring

## Azure Monitor Integration

| Component                 | Tool                  |
| ------------------------- | --------------------- |
| Application Performance   | Application Insights  |
| Infrastructure Metrics    | Azure Monitor         |
| Log Aggregation           | Log Analytics Workspace|
| Alerting                  | Azure Monitor Alerts  |
| Dashboards                | Azure Dashboards      |

---

# Monitoring Configuration

| Metric                      | Source               | Threshold           |
| --------------------------- | -------------------- | ------------------- |
| Response Time (P95)         | Application Insights | > 2 seconds         |
| Error Rate                  | Application Insights | > 1%                |
| CPU Utilization             | Azure Monitor        | > 80%               |
| Memory Utilization          | Azure Monitor        | > 85%               |
| Database Connections        | Azure Monitor        | > 80% pool          |
| Request Rate                | Application Insights | Anomaly detection   |

---

# DevOps Metrics

## DORA Metrics

| Metric                        | Target              | Current  |
| ----------------------------- | ------------------- | -------- |
| Deployment Frequency          | Daily               | Measured |
| Lead Time for Changes         | < 1 day             | Measured |
| Change Failure Rate           | < 5%                | Measured |
| Mean Time to Recovery (MTTR)  | < 1 hour            | Measured |

---

# Pipeline Performance Metrics

| Metric                        | Target              | Current  |
| ----------------------------- | ------------------- | -------- |
| Build Duration                | < 15 minutes        | Measured |
| Test Execution Time           | < 10 minutes        | Measured |
| Deployment Duration           | < 30 minutes        | Measured |
| Pipeline Queue Time           | < 5 minutes         | Measured |
| Artifact Size                 | < 500 MB            | Measured |

---

# Quality Metrics

| Metric                        | Target              | Current  |
| ----------------------------- | ------------------- | -------- |
| Code Coverage                 | > 80%               | Measured |
| Static Analysis Score         | > 90%               | Measured |
| Vulnerability Count (Critical)| 0                   | Measured |
| Vulnerability Count (High)    | 0                   | Measured |
| Technical Debt Ratio          | < 5%                | Measured |

---

# DevOps Metrics Dashboard

```text
+----------------------------------------------+
| DevOps Metrics Dashboard                      |
+----------------------------------------------+
| DORA Metrics                                  |
|   Deployment Frequency   | Daily              |
|   Lead Time for Changes  | < 1 day            |
|   Change Failure Rate    | 3.2%               |
|   MTTR                   | 45 minutes         |
+----------------------------------------------+
| Pipeline Performance                          |
|   Build Duration         | 12 minutes         |
|   Test Duration          | 8 minutes          |
|   Deploy Duration        | 22 minutes         |
|   Queue Time             | 2 minutes          |
+----------------------------------------------+
| Quality Metrics                               |
|   Code Coverage          | 84%                |
|   Static Analysis        | 94%                |
|   Critical Vulns         | 0                  |
|   High Vulns             | 1                  |
+----------------------------------------------+
```

---

# DevOps Tools Stack

## Complete Tools Inventory

| Category                | Tool                      | Purpose                          |
| ----------------------- | ------------------------- | -------------------------------- |
| Source Control          | GitHub / Azure DevOps Repos | Code management                |
| CI/CD Pipeline         | GitHub Actions / Azure Pipelines | Build and deployment     |
| Package Management     | Azure Artifacts           | Package feeds                   |
| Container Registry     | Azure Container Registry  | Docker image storage            |
| IaC                    | Bicep / ARM Templates     | Infrastructure provisioning     |
| IaC (Multi-cloud)      | Terraform                 | Optional multi-cloud support    |
| Code Analysis          | SonarQube                 | Static code analysis            |
| Security Scanning      | Snyk / Dependabot         | Dependency vulnerability scanning |
| Container Scanning     | Trivy                     | Container image scanning        |
| Secret Detection       | GitLeaks                  | Pre-commit secret detection     |
| Secret Management      | Azure Key Vault           | Secrets and key storage         |
| Configuration          | Azure App Configuration  | Feature flags and configuration |
| Monitoring             | Application Insights      | Application performance monitoring |
| Infrastructure Monitoring | Azure Monitor           | Infrastructure metrics          |
| Log Management         | Log Analytics Workspace   | Centralized logging             |
| Alerting               | Azure Monitor Alerts      | Threshold and anomaly alerts    |
| Dashboard              | Azure Dashboards          | Operational dashboards          |
| Incident Management    | PagerDuty / OpsGenie      | Incident response               |
| Communication          | Microsoft Teams           | Team notifications              |
| Documentation          | Confluence / Wiki         | Knowledge management            |
| Test Management        | Azure Test Plans          | Test case management            |

---

# DevOps Tools Architecture

```text
+-------------------------------------------------------+
|                    DevOps Tools Stack                    |
+-------------------------------------------------------+
| Source Control     | GitHub / Azure DevOps              |
| CI/CD              | GitHub Actions / Azure Pipelines   |
| Artifacts          | Azure Artifacts + ACR              |
| IaC                | Bicep + ARM Templates              |
| Security           | SonarQube + Snyk + Trivy + GitLeaks|
| Configuration      | Azure App Config + Key Vault       |
| Monitoring         | App Insights + Azure Monitor       |
| Communication      | Microsoft Teams                    |
+-------------------------------------------------------+
```

---

# DevOps Risks

## Risk Register

| ID    | Risk                                  | Impact | Likelihood | Mitigation                              |
| ----- | ------------------------------------- | ------ | ---------- | --------------------------------------- |
| DR-01 | Pipeline failure delays release       | High   | Medium     | Automated alerts, parallel test execution|
| DR-02 | Security vulnerability blocks release | High   | Medium     | Early scanning, automated patching      |
| DR-03 | Environment drift between environments| High   | Low        | IaC-only provisioning, drift detection  |
| DR-04 | Secret exposure in source control     | Critical| Low       | GitLeaks pre-commit, secret scanning    |
| DR-05 | Container image vulnerability         | High   | Medium     | Automated scanning, base image patching |
| DR-06 | Rollback failure in production        | Critical| Low       | Regular rollback drills, blue-green     |
| DR-07 | Configuration drift in production     | High   | Medium     | Centralised config, audit logging       |
| DR-08 | Pipeline infrastructure unavailability| Medium | Low        | Agent redundancy, cloud-hosted agents   |
| DR-09 | Dependency supply chain attack        | Critical| Low       | Dependency scanning, version pinning    |
| DR-10 | Deployment window conflicts           | Medium | Medium     | Scheduled deployments, change management|

---

# Risk Mitigation Strategies

| Strategy                     | Description                                | Owner              |
| ---------------------------- | ------------------------------------------ | ------------------ |
| Automated Security Scanning  | Run scans at every stage, not just pre-prod| Security Lead      |
| Infrastructure Drift Detection| Daily drift scan with Azure Policy        | Platform Lead      |
| Secret Scanning              | Pre-commit hooks + pipeline scanning       | Security Lead      |
| Rollback Drills              | Monthly production rollback simulation     | Delivery Lead      |
| Dependency Pinning            | Pin all dependencies to known-good versions| Engineering Lead   |
| Pipeline Redundancy           | Multi-agent pools, failover configuration  | DevOps Lead        |
| Change Freeze Periods          | No deployments during critical business periods | Delivery Lead |
| Blue-Green Deployment          | Zero-downtime rollback capability         | DevOps Lead        |

---

# DevOps & Release Management Review Summary

| Area                          | Status   |
| ----------------------------- | -------- |
| CI/CD Pipeline Architecture   | Approved |
| Source Control Strategy        | Approved |
| Build Automation               | Approved |
| Infrastructure as Code         | Approved |
| Containerisation Strategy      | Approved |
| Deployment Strategy            | Approved |
| Release Management Process     | Approved |
| Release Versioning             | Approved |
| Hotfix Process                 | Approved |
| Rollback Procedures            | Approved |
| Configuration Management       | Approved |
| Secret Management              | Approved |
| Monitoring & Alerting          | Approved |
| DevOps Metrics                 | Approved |
| DevOps Tools Stack             | Approved |
| DevOps Risks                   | Approved |

---

# Approval Statement

This DevOps and Release Management Plan establishes the official DevOps practices, CI/CD pipeline architecture, release management process, and deployment strategy for MAP Release 1.

All delivery teams must operate according to this plan. DevOps practices must be continuously measured and improved to ensure delivery efficiency and quality.

---

# Conclusion

The MAP DevOps and Release Management Plan provides a comprehensive, automated, and governed framework for building, testing, and releasing the MAP solution.

The plan enables:

* Repeatable and consistent delivery
* Full traceability from commit to production
* Automated quality and security validation
* Controlled multi-environment deployment
* Rapid rollback and recovery capability
* Continuous monitoring and improvement
* Compliance with Azure governance and security standards

while maintaining focus on delivery velocity, operational reliability, and business value realisation.

---

# Status

DevOps & Release Management Plan Approved

CI/CD Pipeline and Release Framework Established