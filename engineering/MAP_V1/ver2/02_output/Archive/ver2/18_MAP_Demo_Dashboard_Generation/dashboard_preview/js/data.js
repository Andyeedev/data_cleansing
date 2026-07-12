/* MAP Nexus Dashboard — Embedded Data (Module 00 Compliant) */
/* Authoritative source: ../02_Dashboard_Data/*.json */

const MAP_DATA = {
  executive: {
    kpi: [
      { label: "Overall Readiness", value: "62%", status: "warning" },
      { label: "Validation Score", value: "58.3%", status: "error" },
      { label: "Critical Findings", value: "6", status: "error" },
      { label: "High Findings", value: "10", status: "warning" },
      { label: "Records Processed", value: "11", status: "info" },
      { label: "Records Passed", value: "5", status: "success" },
      { label: "Records Requiring Attention", value: "6", status: "error" }
    ],
    issueDist: [
      { label: "Critical", value: 6, color: "#D13438" },
      { label: "High", value: 10, color: "#FFB900" },
      { label: "Medium", value: 4, color: "#FFB900" },
      { label: "Low", value: 3, color: "#107C10" }
    ],
    controlStatus: [
      { label: "Passed", value: 1, color: "#107C10" },
      { label: "Attention Required", value: 6, color: "#D13438" },
      { label: "Critical Issue", value: 12, color: "#FFB900" },
      { label: "Not Executed", value: 0, color: "#9E9E9E" }
    ]
  },
  migration: {
    entityMapping: [
      { source: "ACCOUNTS", target: "ACCOUNTS", sourceRows: 20023, targetRows: 20023, matchPct: "100%", status: "passed" },
      { source: "ACCOUNT_BALANCE", target: "ACCOUNT_BALANCE", sourceRows: 14965, targetRows: 14965, matchPct: "97.7%", status: "attention_required" },
      { source: "CUSTOMER", target: "CUSTOMER", sourceRows: 20023, targetRows: 20023, matchPct: "100%", status: "passed" },
      { source: "ACCOUNT_CURRENCY", target: "ACCOUNTS.CCY", sourceRows: 14965, targetRows: 0, matchPct: "0%", status: "failed" },
      { source: "ACCOUNTS_ARCH", target: "ACCOUNTS_ARCH", sourceRows: 0, targetRows: 4217, matchPct: "0%", status: "attention_required" }
    ],
    platformHealth: [
      { name: "Source — T24 Transact", cpu: 45, memory: 62, disk: 78 },
      { name: "Target — Finacle", cpu: 38, memory: 55, disk: 65 }
    ]
  },
  validation: {
    controls: [
      { id: "C01", name: "Record Count Reconciliation", status: "PASSED", severity: "info", details: "Source and target record counts match within 5% threshold" },
      { id: "C02", name: "Schema Compliance Check", status: "ATTENTION_REQUIRED", severity: "warning", details: "Column type mismatches detected in 3 tables" },
      { id: "C03", name: "Primary Key Integrity", status: "PASSED", severity: "info", details: "All primary keys unique and non-null in source and target" },
      { id: "C04", name: "Balance Reconciliation", status: "CRITICAL_ISSUE", severity: "critical", details: "Balance mismatch: source £2,847,193,862.16 vs target £2,847,193,862.16 — variance 0.00% but 342 records have precision differences" },
      { id: "C05", name: "Null Value Check", status: "PASSED", severity: "info", details: "No unexpected null values in required fields" },
      { id: "C06", name: "Duplicate Detection", status: "ATTENTION_REQUIRED", severity: "warning", details: "12 potential duplicate records detected in target CUSTOMER table" },
      { id: "C07", name: "Format Validation", status: "CRITICAL_ISSUE", severity: "critical", details: "Date format mismatch: source DD/MM/YYYY vs target YYYY-MM-DD" },
      { id: "C08", name: "Reference Integrity", status: "CRITICAL_ISSUE", severity: "critical", details: "892 orphaned records in ACCOUNT_BALANCE with no matching ACCOUNTS record" },
      { id: "C09", name: "Data Completeness", status: "PASSED", severity: "info", details: "All required fields populated across all datasets" },
      { id: "C10", name: "Permission Requirements", status: "CRITICAL_ISSUE", severity: "critical", details: "Read/write permissions required for target Finacle database — not yet provisioned" }
    ],
    valDist: [
      { label: "Passed", value: 3, color: "#107C10" },
      { label: "Attention Required", value: 2, color: "#FFB900" },
      { label: "Critical Issue", value: 4, color: "#D13438" },
      { label: "Disabled", value: 1, color: "#9E9E9E" }
    ]
  },
  risk: {
    kpi: [
      { label: "Overall Risk", value: "High", status: "error" },
      { label: "Risk Score", value: "58.3/100", status: "error" },
      { label: "Critical Risks", value: "6", status: "error" },
      { label: "High Risks", value: "10", status: "warning" },
      { label: "Medium Risks", value: "4", status: "warning" },
      { label: "Low Risks", value: "3", status: "success" },
      { label: "Total Findings", value: "23", status: "info" }
    ],
    risks: [
      { id: "R001", risk: "Schema drift between source and target", severity: "critical", impact: "Data loss or corruption during migration", mitigation: "Implement comprehensive schema mapping and validation", status: "open" },
      { id: "R002", risk: "Balance reconciliation discrepancies", severity: "critical", impact: "Financial data integrity compromised", mitigation: "Run balance reconciliation with precision handling", status: "open" },
      { id: "R003", risk: "Permission provisioning delays", severity: "critical", impact: "Migration blocked — cannot access target system", mitigation: "Escalate permission request to infrastructure team", status: "open" },
      { id: "R004", risk: "Date format inconsistency", severity: "high", impact: "Downstream system failures", mitigation: "Standardise date format during ETL transformation", status: "open" },
      { id: "R005", risk: "Orphaned foreign key references", severity: "high", impact: "Referential integrity violated in target", mitigation: "Cleanse orphaned records before migration", status: "open" },
      { id: "R006", risk: "Duplicate customer records", severity: "medium", impact: "Duplicate accounts in target system", mitigation: "Implement deduplication logic in ETL pipeline", status: "open" }
    ]
  },
  quality: {
    dimensions: [
      { name: "Completeness", score: 95, status: "passed", details: "95% of required fields populated" },
      { name: "Accuracy", score: 72, status: "attention_required", details: "342 balance precision mismatches" },
      { name: "Consistency", score: 65, status: "attention_required", details: "Date format inconsistencies across tables" },
      { name: "Timeliness", score: 88, status: "passed", details: "Data freshness within acceptable threshold" },
      { name: "Validity", score: 58, status: "critical", details: "892 orphaned foreign key references" },
      { name: "Uniqueness", score: 92, status: "passed", details: "12 potential duplicates in CUSTOMER" }
    ],
    trend: [
      { label: "Week 1", value: 45 },
      { label: "Week 2", value: 52 },
      { label: "Week 3", value: 61 },
      { label: "Week 4", value: 68 },
      { label: "Week 5", value: 74 },
      { label: "Week 6", value: 80 }
    ]
  },
  governance: {
    kpi: [
      { label: "Total Findings", value: "5", status: "info" },
      { label: "Critical", value: "2", status: "error" },
      { label: "High", value: "1", status: "warning" },
      { label: "Medium", value: "2", status: "warning" },
      { label: "Resolution Rate", value: "0%", status: "error" }
    ],
    findings: [
      { id: "FND-001", type: "Schema Drift", description: "Column type mismatch: ACCOUNT_BALANCE.AMOUNT is DECIMAL(18,2) in source but DECIMAL(15,2) in target", severity: "critical", control: "C02", owner: "Data Engineering", status: "open", resolution: "Align column types before migration" },
      { id: "FND-002", type: "Schema Drift", description: "Column type mismatch: ACCOUNTS.STATUS is VARCHAR(2) in source but CHAR(1) in target", severity: "high", control: "C02", owner: "Data Engineering", status: "open", resolution: "Implement data transformation rule" },
      { id: "FND-003", type: "Balance Mismatch", description: "342 records have precision differences in balance amounts between source and target", severity: "critical", control: "C04", owner: "Finance Team", status: "open", resolution: "Investigate and reconcile precision differences" },
      { id: "FND-004", type: "Duplicate Records", description: "12 potential duplicate records detected in target CUSTOMER table", severity: "medium", control: "C06", owner: "Data Quality", status: "open", resolution: "Implement deduplication logic" },
      { id: "FND-005", type: "Orphaned Records", description: "892 orphaned records in ACCOUNT_BALANCE with no matching ACCOUNTS record in target", severity: "medium", control: "C08", owner: "Data Engineering", status: "open", resolution: "Cleanse orphaned records before migration" }
    ],
    issueByType: [
      { label: "Schema Drift", value: 2, color: "#D13438" },
      { label: "Balance Mismatch", value: 1, color: "#D13438" },
      { label: "Duplicate Records", value: 1, color: "#FFB900" },
      { label: "Orphaned Records", value: 1, color: "#FFB900" }
    ],
    severityDist: [
      { label: "Critical", value: 2, color: "#D13438" },
      { label: "High", value: 1, color: "#FFB900" },
      { label: "Medium", value: 2, color: "#FFB900" },
      { label: "Low", value: 0, color: "#107C10" }
    ]
  },
  progress: {
    phases: [
      { name: "Planning & Design", progress: 100, status: "completed" },
      { name: "Schema Mapping", progress: 100, status: "completed" },
      { name: "ETL Development", progress: 85, status: "in_progress" },
      { name: "Validation & Testing", progress: 45, status: "in_progress" },
      { name: "Pilot Migration", progress: 0, status: "not_started" },
      { name: "Full Migration", progress: 0, status: "not_started" },
      { name: "Post-Migration Review", progress: 0, status: "not_started" }
    ]
  }
};
