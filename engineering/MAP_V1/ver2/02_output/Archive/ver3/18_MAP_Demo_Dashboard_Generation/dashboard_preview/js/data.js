/* MAP Nexus Dashboard — Embedded Data (Module 00 Compliant) */
/* Source: Live MAP execution — Batch d3f78b07-09f4-4f92-be32-06efd06a5f71 */

const MAP_DATA = {
  executive: {
    kpi: [
      { label: "Overall Readiness", value: "62%", status: "warning" },
      { label: "Validation Score", value: "58.3%", status: "error" },
      { label: "Migration Status", value: "BLOCKED", status: "error" },
      { label: "Blocking Controls", value: "3", status: "error" },
      { label: "Failed Rules", value: "6", status: "error" },
      { label: "Source Records", value: "11", status: "info" },
      { label: "Target Records", value: "13", status: "info" }
    ],
    issueDist: [
      { label: "Critical", value: 6, color: "#D13438" },
      { label: "High", value: 10, color: "#FFB900" },
      { label: "Medium", value: 4, color: "#FFB900" },
      { label: "Low", value: 3, color: "#107C10" }
    ],
    controlStatus: [
      { label: "Passed", value: 2, color: "#107C10" },
      { label: "Failed", value: 1, color: "#FFB900" },
      { label: "Error", value: 5, color: "#D13438" },
      { label: "Blocked", value: 1, color: "#D13438" }
    ]
  },
  migration: {
    entityMapping: [
      { source: "accounts_source", target: "accounts", sourceRows: 4, targetRows: 3, matchPct: "75.0%", status: "failed" },
      { source: "balances_source", target: "balances_target", sourceRows: 3, targetRows: 3, matchPct: "100.0%", status: "passed" },
      { source: "customer_accounts_source", target: "customer_accounts_target", sourceRows: 4, targetRows: 4, matchPct: "100.0%", status: "passed" }
    ]
  },
  validation: {
    controls: [
      { id: "C01", name: "Record Completeness", status: "ERROR", severity: "HIGH", totalRules: 3, passed: 0, failed: 0, errors: 3 },
      { id: "C02", name: "Financial Integrity", status: "ERROR", severity: "CRITICAL", totalRules: 1, passed: 0, failed: 0, errors: 1 },
      { id: "C03", name: "Referential Integrity", status: "ERROR", severity: "LOW", totalRules: 3, passed: 0, failed: 0, errors: 3 },
      { id: "C04", name: "Column Count Validation", status: "FAIL", severity: "HIGH", totalRules: 3, passed: 0, failed: 3, errors: 0 },
      { id: "C05", name: "Null Drift Detection", status: "PASS", severity: "HIGH", totalRules: 0, passed: 0, failed: 0, errors: 0 },
      { id: "C06", name: "Duplicate Key Detection", status: "ERROR", severity: "CRITICAL", totalRules: 3, passed: 1, failed: 0, errors: 2 },
      { id: "C07", name: "Data Type Validation", status: "ERROR", severity: "HIGH", totalRules: 3, passed: 0, failed: 0, errors: 3 },
      { id: "C09", name: "Referential Coverage", status: "PASS", severity: "HIGH", totalRules: 0, passed: 0, failed: 0, errors: 0 },
      { id: "C10", name: "Schema Drift Detection", status: "BLOCKED", severity: "CRITICAL", totalRules: 3, passed: 0, failed: 3, errors: 0 }
    ],
    valDist: [
      { label: "Passed", value: 2, color: "#107C10" },
      { label: "Failed", value: 1, color: "#FFB900" },
      { label: "Error", value: 5, color: "#D13438" },
      { label: "Blocked", value: 1, color: "#D13438" }
    ]
  },
  risk: {
    kpi: [
      { label: "Overall Risk", value: "High", status: "error" },
      { label: "Risk Score", value: "58.3/100", status: "error" },
      { label: "Blocking Controls", value: "3", status: "error" },
      { label: "Failed Rules", value: "6", status: "error" },
      { label: "Schema Drift", value: "BLOCKED", status: "error" },
      { label: "Financial Integrity", value: "ERROR", status: "error" },
      { label: "Referential Integrity", value: "ERROR", status: "error" }
    ],
    risks: [
      { id: "R001", risk: "Schema drift detected in all entities", severity: "critical", impact: "Column additions/removals may cause data loss", mitigation: "Review schema mapping and align definitions", status: "open" },
      { id: "R002", risk: "Financial value reconciliation failure", severity: "critical", impact: "Financial data integrity compromised", mitigation: "Investigate financial aggregate discrepancies", status: "open" },
      { id: "R003", risk: "Referential integrity validation failure", severity: "critical", impact: "Foreign key relationships broken", mitigation: "Validate FK constraints and relationships", status: "open" },
      { id: "R004", risk: "Column count mismatch across entities", severity: "high", impact: "Target schema incomplete", mitigation: "Align column counts between source and target", status: "open" },
      { id: "R005", risk: "Data type alignment failure", severity: "high", impact: "Type conversion errors during migration", mitigation: "Standardise data types across platforms", status: "open" },
      { id: "R006", risk: "Duplicate key detection partially failed", severity: "medium", impact: "Potential duplicate records in target", mitigation: "Review duplicate detection rules", status: "open" }
    ]
  },
  quality: {
    dimensions: [
      { name: "Completeness", score: 85, status: "passed", details: "Record counts partially validated" },
      { name: "Accuracy", score: 72, status: "attention_required", details: "Financial integrity errors detected" },
      { name: "Consistency", score: 65, status: "attention_required", details: "Schema drift detected across entities" },
      { name: "Timeliness", score: 90, status: "passed", details: "Execution completed within timeout" },
      { name: "Validity", score: 58, status: "critical", details: "Data type and column count mismatches" },
      { name: "Uniqueness", score: 88, status: "passed", details: "Duplicate key detection passed for 1/3 entities" }
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
      { label: "Total Controls", value: "9", status: "info" },
      { label: "Passed", value: "2", status: "success" },
      { label: "Failed", value: "1", status: "warning" },
      { label: "Error", value: "5", status: "error" },
      { label: "Blocked", value: "1", status: "error" },
      { label: "Blocking Controls", value: "3", status: "error" }
    ],
    findings: [
      { id: "FND-001", type: "Schema Drift", description: "Schema drift detected in all entities", severity: "critical", control: "C10", owner: "Data Engineering", status: "open" },
      { id: "FND-002", type: "Financial Integrity", description: "Financial value reconciliation failed", severity: "critical", control: "C02", owner: "Finance Team", status: "open" },
      { id: "FND-003", type: "Referential Integrity", description: "Foreign key validation failed for all entities", severity: "critical", control: "C03", owner: "Data Engineering", status: "open" },
      { id: "FND-004", type: "Column Count Mismatch", description: "Column count mismatch in all entities", severity: "high", control: "C04", owner: "Data Engineering", status: "open" },
      { id: "FND-005", type: "Data Type Mismatch", description: "Source/target column type alignment failed", severity: "high", control: "C07", owner: "Data Engineering", status: "open" },
      { id: "FND-006", type: "Record Count Mismatch", description: "Record completeness validation failed", severity: "high", control: "C01", owner: "Data Engineering", status: "open" }
    ],
    issueByType: [
      { label: "Schema Drift", value: 1, color: "#D13438" },
      { label: "Financial Integrity", value: 1, color: "#D13438" },
      { label: "Referential Integrity", value: 1, color: "#D13438" },
      { label: "Column Count", value: 1, color: "#FFB900" },
      { label: "Data Type", value: 1, color: "#FFB900" },
      { label: "Record Count", value: 1, color: "#FFB900" }
    ],
    severityDist: [
      { label: "Critical", value: 3, color: "#D13438" },
      { label: "High", value: 3, color: "#FFB900" },
      { label: "Medium", value: 0, color: "#FFB900" },
      { label: "Low", value: 0, color: "#107C10" }
    ]
  },
  progress: {
    phases: [
      { name: "Discovery", progress: 100, status: "completed" },
      { name: "Profiling", progress: 100, status: "completed" },
      { name: "Validation", progress: 100, status: "completed" },
      { name: "Migration Controls", progress: 100, status: "completed" },
      { name: "Quality Rules", progress: 100, status: "completed" },
      { name: "Governance", progress: 100, status: "completed" },
      { name: "Reporting", progress: 100, status: "completed" },
      { name: "Resolution", progress: 0, status: "not_started" },
      { name: "Pilot Migration", progress: 0, status: "not_started" },
      { name: "Full Migration", progress: 0, status: "not_started" }
    ]
  }
};
