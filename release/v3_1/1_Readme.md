✅ 1. README.md
# 🚀 Financial Services Migration Validation Engine (v3.1)

## 📌 Overview

The **Migration Validation Engine** is a data quality and reconciliation platform designed to validate large-scale financial data migrations across heterogeneous systems.

Version **v3.1** introduces:

* ✅ Multi-database connectivity (PostgreSQL + SQL Server)
* ✅ SaaS-ready architecture (multi-connection support)
* ✅ Automated rule discovery
* ✅ Risk-weighted scoring engine
* ✅ Parallel execution framework

---

## 🧩 Core Capabilities

* 🔍 **Automated Rule Discovery**
* ⚖️ **Risk-Based Scoring**
* 🔗 **Multi-System Data Validation**
* 🚀 **Parallel Control Execution**
* 🧠 **Metadata-Driven Rule Engine**
* 🔐 **Secure Credential Management (Fernet encryption)**

---

## 🏗️ Supported Databases

| System     | Status                                            |
| ---------- | ------------------------------------------------- |
| PostgreSQL | ✅ Fully Supported                                 |
| SQL Server | ⚠️ Connection Supported (Execution Layer Pending) |

---

## 📂 Project Structure

```
app/
 ├── db/
 ├── discovery/
 ├── execution_engine/
 ├── scoring_engine.py
 ├── rules/
 ├── utils/
 └── main.py
```

---

## ⚙️ How to Run

```bash
python -m app.main run --config config.yaml
```

---

## 🔐 Security

* All credentials encrypted using **Fernet**
* Key managed via `FERNET_KEY` environment variable

---

## 📊 Execution Flow

1. Resolve connections
2. Discover datasets
3. Auto-generate rules
4. Execute controls in parallel
5. Score execution
6. Apply governance rules

---

## 🧪 Current Stability

* ✅ Stable for PostgreSQL migrations
* ⚠️ SQL Server execution partially implemented
* ⚠️ Known issue: control result structure inconsistency (planned fix in v3.2)

---

## 📌 Version

**v3.1 — SaaS Multi-Connection Baseline**

---

## 👤 Author

Internal Platform Engineering
