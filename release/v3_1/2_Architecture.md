✅ 2. ARCHITECTURE.md
# 🏗️ Architecture — v3.1

## 🔷 High-Level Architecture

```
                +----------------------+
                |   Config (YAML)      |
                +----------+-----------+
                           |
                           v
                +----------------------+
                | Execution Engine     |
                +----------+-----------+
                           |
        +------------------+------------------+
        |                                     |
        v                                     v
+------------------+                +------------------+
| Source DB        |                | Target DB        |
| (Postgres/SQL)   |                | (Postgres)       |
+------------------+                +------------------+

        |
        v
+----------------------+
| Auto Rule Discovery  |
+----------------------+

        |
        v
+----------------------+
| Control Execution    |
| (Parallel Workers)   |
+----------------------+

        |
        v
+----------------------+
| Scoring Engine       |
+----------------------+

        |
        v
+----------------------+
| Governance Engine    |
+----------------------+
```

---

## 🔑 Key Components

### 1. Execution Engine

* Orchestrates entire workflow
* Handles batching and checkpoints

### 2. Connection Factory

* Dynamically resolves DB adapters
* Supports multi-database connections

### 3. Auto Rule Discovery

* Infers rules based on:

  * Column roles
  * Data types
  * Foreign key detection

### 4. Rule Engine

* Executes controls (C01–C010)
* Supports dependency chaining

### 5. Scoring Engine

* Computes risk-weighted score
* Uses severity-based weighting

### 6. Governance Layer

* Determines PASS / FAIL
* Enforces release gates

---

## ⚙️ Parallel Execution Model

* Thread-based workers
* Control-level parallelism
* Dependency-aware scheduling

---

## 🔐 Security Architecture

* Fernet encryption for credentials
* Key-based decryption at runtime

---

## ⚠️ Known Constraints

* SQL Server execution partially disabled
* Result schema inconsistency across controls

---

## 🚀 Future Architecture (v3.2)

* Unified result contract
* Adapter abstraction layer upgrade
* Full SQL Server support
* API layer for SaaS
