# Architecture Overview

## Platform Purpose

The platform provides automated migration validation and governance capabilities for regulated migration programmes.

---

## High Level Architecture

Client/API

↓

Execution Engine

↓

Control Executor

↓

Rule Executor

↓

Rule Factory

↓

Database Adapters

↓

Source and Target Systems

---

## Core Components

### Execution Engine

Responsible for:

* Batch orchestration
* Execution lifecycle management
* Status management
* Governance integration

### Control Layer

Responsible for:

* Control sequencing
* Dependency handling
* Execution grouping
* Logging orchestration

### Rule Layer

Responsible for:

* Validation execution
* Business rule evaluation
* Dataset reconciliation

### Metadata Repository

Stores:

* System Registry
* Credential Registry
* Connection Definitions
* Mapping Definitions
* Execution Metadata

### Governance Layer

Responsible for:

* Risk Scoring
* Decision Management
* Audit Trail
* Release Gates

---

## Deployment Architecture

Container 1

PostgreSQL

Purpose:

Metadata repository

Container 2

Migration Engine

Purpose:

Execution and governance services

---

## Cloud Target Architecture

Azure

* Azure Container Apps
* PostgreSQL Flexible Server
* Key Vault
* Application Insights

AWS

* ECS Fargate
* RDS PostgreSQL
* Secrets Manager
* CloudWatch

Google Cloud

* Cloud Run
* Cloud SQL
* Secret Manager
* Cloud Logging
