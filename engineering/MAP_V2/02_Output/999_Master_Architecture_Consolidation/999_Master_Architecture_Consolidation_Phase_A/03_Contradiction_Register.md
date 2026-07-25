# 03_Contradiction_Register.md

# Contradiction Register

### MAP Nexus Enterprise Architecture

---

## Contradictions Found

| # | Topic | Document A | Document B | Evidence from A | Evidence from B | Status |
|---|-------|------------|------------|-----------------|-----------------|--------|
| 1 | PostgreSQL Version | 18_Data_Model/01_Executive_Summary | 19_Solution_Arch/01_Executive_Summary | "PostgreSQL 17.4" (line 9) | "PostgreSQL 15" (line 57) | Verified contradiction |
| 2 | Total Table Count | 20_Impl_Arch/16_Implementation_Statistics | 18_Data_Model/01_Executive_Summary | "Total tables: 24" (line 113) | "Tables: 62" (line 29) | Verified contradiction |
| 3 | Total Table Count | 20_Impl_Arch/16_Implementation_Statistics | 19_Solution_Arch/01_Executive_Summary | "Total tables: 24" (line 113) | "Database Tables: ~62" (line 104) | Verified contradiction |
| 4 | Total Table Count | 20_Impl_Arch/16_Implementation_Statistics | 15_Functional_Traceability | "Total tables: 24" (line 113) | "PostgreSQL Database (6 schemas, 69 tables)" (line 22) | Verified contradiction |
| 5 | Total Table Count | 18_Data_Model/01_Executive_Summary | 15_Functional_Traceability | "Tables: 62" (line 29) | "PostgreSQL Database (6 schemas, 69 tables)" (line 22) | Verified contradiction |
| 6 | Total View Count | 18_Data_Model/01_Executive_Summary | 20_Impl_Arch/16_Implementation_Statistics | "Views: 9" (line 30) | "Total views: 5" (line 125) | Verified contradiction |
| 7 | Total View Count | 18_Data_Model/01_Executive_Summary | 15_Functional_Traceability | "Views: 9" (line 30) | "5 views" (line 74) | Verified contradiction |
| 8 | Schema Count | 18_Data_Model/01_Executive_Summary | 19_Solution_Arch/01_Executive_Summary | "Schemas: 6" (line 28) | "Database Schemas: 5" (line 103) | Verified contradiction |
| 9 | Schema Count | 15_Functional_Traceability | 05_Database_Architecture | "6 schemas" (line 22) | "5-schema model" (line 175) | Verified contradiction |
| 10 | Schema Count | 18_Data_Model/01_Executive_Summary | 05_Database_Architecture | "Schemas: 6" (line 28), lists engine_v14 | "5-schema model" (line 175), only core/engine/reporting/platform/audit | Verified contradiction |
| 11 | API Endpoint Count | 19_Solution_Arch/01_Executive_Summary | 19_Solution_Arch/06_API_Architecture | "API Endpoints: ~65" (line 107) | "Total: 71 ... 74 total endpoints" (lines 256-258) | Verified contradiction |
| 12 | API Endpoint Count | 19_Solution_Arch/06_API_Architecture | 15_Functional_Traceability | "Total: 71 ... 74 total endpoints" (lines 256-258) | "FastAPI Backend (72+ endpoints)" (line 24) | Verified contradiction |
| 13 | Backend Service Count | 19_Solution_Arch/01_Executive_Summary | 20_Impl_Arch/16_Implementation_Statistics | "15 backend services" (line 21) | "Service modules: 17" (line 15) | Verified contradiction |
| 14 | Core Schema Table Count | 18_Data_Model/01_Executive_Summary | 15_Functional_Traceability | "core: 7" (line 43) | "core: 8" (line 101) | Verified contradiction |
| 15 | Engine Schema Table Count | 18_Data_Model/01_Executive_Summary | 15_Functional_Traceability | "engine: 15 active" (line 45) | "engine: 22" (line 102) | Verified contradiction |
| 16 | Platform Schema Table Count | 18_Data_Model/01_Executive_Summary | 15_Functional_Traceability | "platform: 20" (line 48) | "platform: 22" (line 103) | Verified contradiction |
| 17 | engine_v14 Schema Existence | 18_Data_Model/01_Executive_Summary | 05_Database_Architecture | "engine_v14: Legacy v1.4 schema" (line 19), listed as Implemented | Not listed in schema tree (line 177-184), only 5 schemas described | Verified contradiction |
| 18 | engine_v14 Table Count | 18_Data_Model/01_Executive_Summary | 15_Functional_Traceability | "engine_v14: 7" (line 46) | "engine_v14: 10" (line 106) | Verified contradiction |
| 19 | Navigation Menu Count | 19_Solution_Arch/01_Executive_Summary | 15_Functional_Traceability | "Navigation Items: ~130" (line 113) | "17 menus, 103+ submenus" (line 53), sum = 120+ | Verified contradiction |
