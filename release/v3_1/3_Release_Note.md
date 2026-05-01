✅ 3. RELEASE_NOTES.md

# 📦 Release Notes — v3.1

## 🎯 Release Name

**v3.1 — SaaS Multi-Connection Baseline**

---

## 🚀 New Features

* ✅ Multi-database connection support
* ✅ Dynamic connection resolution
* ✅ Secure credential decryption
* ✅ Auto rule discovery v1.7
* ✅ Parallel execution framework

---

## 🧠 Improvements

* Enhanced logging (structured JSON logs)
* Query performance tracking
* Connection pooling for PostgreSQL
* Improved rule registration logic

---

## ⚠️ Known Issues

* ❗ Control execution expects inconsistent result formats
* ❗ SQL Server execution temporarily disabled
* ❗ Some controls fail with unpacking errors

---

## 🔧 Technical Debt

* Standardize control result schema
* Improve adapter abstraction
* Add retry + circuit breaker patterns

---

## 📊 Stability

| Area           | Status                 |
| -------------- | ---------------------- |
| PostgreSQL     | ✅ Stable               |
| SQL Server     | ⚠️ Partial             |
| Rule Engine    | ⚠️ Needs normalization |
| Scoring Engine | ✅ Stable               |

---

## 🔜 Next Version (v3.2)

* Fix control result schema
* Enable SQL Server execution
* Introduce API layer
* Improve observability

---

## 🏷️ Tag

`v3.1`


