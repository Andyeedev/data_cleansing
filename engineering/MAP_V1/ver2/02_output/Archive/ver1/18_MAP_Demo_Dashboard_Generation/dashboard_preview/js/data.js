// MAP Nexus Dashboard Data — Embedded JSON (Batch d3f78b07)
// Source: MAP Validation Engine Live Execution — Scenario 3 MIXTURE
// Generated: 2026-07-03

const MAP_DATA = {

  executiveOverview: {
    dashboard: "Executive Overview",
    version: "1.0",
    generated: "2026-07-03T16:55:57Z",
    batch_id: "d3f78b07-09f4-4f92-be32-06efd06a5f71",
    theme: "MAP Nexus",
    data_source: "MAP Validation Engine — Live Execution",
    scenario: "Scenario 3 — MIXTURE",
    migration: {
      name: "Customer Core Banking Migration",
      status: "BLOCKED",
      readiness_pct: 62,
      validation_score: 58.3,
      data_quality_score: 71.5,
      recommendation: "Resolve critical and high priority findings before proceeding to pilot"
    },
    issues: { critical: 6, high: 10, medium: 4, low: 3, total: 23 },
    records: { total_processed: 11, passed: 5, failed: 6, error: 8 },
    controls_summary: { total: 10, passed: 1, failed: 6, error: 12, blocked: 0 },
    kpi_cards: [
      { label: "Overall Readiness", value: "62%", status: "warning", icon: "gauge" },
      { label: "Validation Score", value: "58.3%", status: "error", icon: "check-circle" },
      { label: "Critical Findings", value: "6", status: "error", icon: "alert-triangle" },
      { label: "High Findings", value: "10", status: "warning", icon: "alert-circle" },
      { label: "Records Processed", value: "11", status: "info", icon: "database" },
      { label: "Records Passed", value: "5", status: "success", icon: "check" },
      { label: "Records Requiring Attention", value: "6", status: "error", icon: "x-circle" }
    ],
    charts: {
      issue_distribution: {
        type: "donut",
        data: [
          { label: "Critical", value: 6, color: "#C62828" },
          { label: "High", value: 10, color: "#F9A825" },
          { label: "Medium", value: 4, color: "#F9A825" },
          { label: "Low", value: 3, color: "#2E7D32" }
        ]
      },
      control_status: {
        type: "bar",
        data: [
          { label: "Passed", value: 1, color: "#2E7D32" },
          { label: "Attention Required", value: 6, color: "#C62828" },
          { label: "Critical Issue", value: 12, color: "#F9A825" },
          { label: "Not Executed", value: 0, color: "#757575" }
        ]
      }
    }
  },

  migrationOverview: {
    dashboard: "Migration Overview",
    version: "1.0",
    generated: "2026-07-03T16:55:57Z",
    batch_id: "d3f78b07-09f4-4f92-be32-06efd06a5f71",
    theme: "MAP Nexus",
    data_source: "MAP Validation Engine — Live Execution",
    scenario: "Scenario 3 — MIXTURE",
    systems: {
      source: { name: "Source Platform", type: "Enterprise Data Platform", host: "Production Environment", database: "migration_source", tables: 3, entities: ["accounts_source", "balances_source", "customer_accounts_source"] },
      target: { name: "Target Platform", type: "Cloud Platform", host: "Production Environment", database: "migration_target", tables: 3, entities: ["accounts_target", "balances_target", "customer_accounts_target"] }
    },
    migration_scope: {
      source_systems: 1, target_systems: 1, entities: 3, tables: 3, files: 0,
      validation_rules_executed: 10, execution_duration_seconds: 26.3,
      pipeline_status: "BLOCKED", completion_pct: 100
    },
    entity_details: [
      { source: "accounts_source", target: "accounts_target", source_rows: 4, target_rows: 3, row_match: false, status: "Attention Required" },
      { source: "balances_source", target: "balances_target", source_rows: 3, target_rows: 3, row_match: true, source_sum: 6000.00, target_sum: 6500.00, sum_match: false, status: "Attention Required" },
      { source: "customer_accounts_source", target: "customer_accounts_target", source_rows: 4, target_rows: 4, row_match: true, status: "Passed" }
    ],
    kpi_cards: [
      { label: "Source Systems", value: "1", status: "info", icon: "server" },
      { label: "Target Systems", value: "1", status: "info", icon: "server" },
      { label: "Entities Validated", value: "3", status: "info", icon: "layers" },
      { label: "Rules Executed", value: "10", status: "info", icon: "check-square" },
      { label: "Execution Time", value: "26.3s", status: "info", icon: "clock" },
      { label: "Migration Status", value: "Blocked", status: "error", icon: "shield" }
    ]
  },

  validationResults: {
    dashboard: "Validation Centre",
    version: "1.0",
    generated: "2026-07-03T16:55:57Z",
    batch_id: "d3f78b07-09f4-4f92-be32-06efd06a5f71",
    theme: "MAP Nexus",
    data_source: "MAP Validation Engine — Live Execution",
    scenario: "Scenario 3 — MIXTURE",
    validation_summary: [
      { validation: "Row Count Match (C01)", status: "Critical Issue", severity: "HIGH", details: "Unable to execute row count comparison — permissions required" },
      { validation: "Balance Reconciliation (C02)", status: "Critical Issue", severity: "CRITICAL", details: "Unable to execute balance reconciliation — permissions required" },
      { validation: "Referential Integrity (C03)", status: "Critical Issue", severity: "LOW", details: "Unable to execute referential check — permissions required" },
      { validation: "Column Count (C04)", status: "Attention Required", severity: "HIGH", delta: 2, details: "Source and target column counts differ by 2 across all entities" },
      { validation: "Null Drift (C05)", status: "Passed", severity: "HIGH", details: "No null drift detected" },
      { validation: "Data Type Match (C06)", status: "Mixed", severity: "CRITICAL", details: "1 passed, 2 require attention across entities" },
      { validation: "Duplicate Detection (C07)", status: "Critical Issue", severity: "HIGH", details: "Unable to execute duplicate check — permissions required" },
      { validation: "Data Drift (C08)", status: "Disabled", severity: "CRITICAL", details: "Control disabled in configuration" },
      { validation: "Referential Coverage (C09)", status: "Passed", severity: "HIGH", details: "Referential coverage validated" },
      { validation: "Schema Drift (C010)", status: "Attention Required", severity: "CRITICAL", delta: 2, details: "Schema drift detected — 2 column differences across entities" }
    ],
    validation_distribution: {
      type: "donut",
      data: [
        { label: "Passed", value: 3, color: "#2E7D32" },
        { label: "Attention Required", value: 2, color: "#C62828" },
        { label: "Critical Issue", value: 4, color: "#F9A825" },
        { label: "Disabled", value: 1, color: "#757575" }
      ]
    },
    control_details: [
      { control_id: "C01", name: "Row Count Match", status: "Critical Issue", severity: "HIGH", entity_results: [{ entity: "accounts_source", status: "Critical Issue" }, { entity: "balances_source", status: "Critical Issue" }, { entity: "customer_accounts_source", status: "Critical Issue" }] },
      { control_id: "C02", name: "Balance Reconciliation", status: "Critical Issue", severity: "CRITICAL", entity_results: [{ entity: "balances_source", status: "Critical Issue" }] },
      { control_id: "C03", name: "Referential Integrity", status: "Critical Issue", severity: "LOW", entity_results: [{ entity: "accounts_source", status: "Critical Issue" }, { entity: "balances_source", status: "Critical Issue" }, { entity: "customer_accounts_source", status: "Critical Issue" }] },
      { control_id: "C04", name: "Column Count", status: "Attention Required", severity: "HIGH", entity_results: [{ entity: "accounts_source", status: "Attention Required", delta: 2 }, { entity: "balances_source", status: "Attention Required", delta: 2 }, { entity: "customer_accounts_source", status: "Attention Required", delta: 2 }] },
      { control_id: "C05", name: "Null Drift", status: "Passed", severity: "HIGH", entity_results: [] },
      { control_id: "C06", name: "Data Type Match", status: "Mixed", severity: "CRITICAL", entity_results: [{ entity: "accounts_source", status: "Critical Issue" }, { entity: "balances_source", status: "Critical Issue" }, { entity: "customer_accounts_source", status: "Passed" }] },
      { control_id: "C07", name: "Duplicate Detection", status: "Critical Issue", severity: "HIGH", entity_results: [{ entity: "accounts_source", status: "Critical Issue" }, { entity: "balances_source", status: "Critical Issue" }, { entity: "customer_accounts_source", status: "Critical Issue" }] },
      { control_id: "C09", name: "Referential Coverage", status: "Passed", severity: "HIGH", entity_results: [] },
      { control_id: "C010", name: "Schema Drift", status: "Attention Required", severity: "CRITICAL", entity_results: [{ entity: "accounts_source", status: "Attention Required", delta: 2 }, { entity: "balances_source", status: "Attention Required", delta: 2 }, { entity: "customer_accounts_source", status: "Attention Required", delta: 2 }] }
    ]
  },

  riskDashboard: {
    dashboard: "Risk Assessment",
    version: "1.0",
    generated: "2026-07-03T16:55:57Z",
    batch_id: "d3f78b07-09f4-4f92-be32-06efd06a5f71",
    theme: "MAP Nexus",
    data_source: "MAP Validation Engine — Live Execution",
    scenario: "Scenario 3 — MIXTURE",
    overall_risk: {
      level: "HIGH", score: 58.3,
      factors: ["Schema drift detected across all entities", "Permission errors preventing full validation", "Balance reconciliation mismatch"]
    },
    risk_matrix: {
      type: "risk-matrix",
      data: [
        { category: "Data Integrity", risk: "HIGH", score: 7, color: "#F9A825" },
        { category: "Schema Compliance", risk: "CRITICAL", score: 9, color: "#C62828" },
        { category: "Referential Integrity", risk: "MEDIUM", score: 5, color: "#F9A825" },
        { category: "Financial Accuracy", risk: "CRITICAL", score: 9, color: "#C62828" },
        { category: "Operational Readiness", risk: "HIGH", score: 7, color: "#F9A825" }
      ]
    },
    top_risks: [
      { rank: 1, risk: "Schema Drift — 2 column differences detected between source and target", severity: "CRITICAL", impact: "Data loss or transformation errors during migration", mitigation: "Review schema mapping and update transformation rules", status: "Open" },
      { rank: 2, risk: "Balance Reconciliation — Variance between source and target balances", severity: "CRITICAL", impact: "Financial reporting inaccuracies", mitigation: "Investigate balance transformation logic and correct discrepancies", status: "Open" },
      { rank: 3, risk: "Row Count Mismatch — Source and target record counts differ", severity: "HIGH", impact: "Incomplete data migration", mitigation: "Review extraction query and ensure all records are captured", status: "Open" },
      { rank: 4, risk: "Permission Errors — Engine unable to execute full validation suite", severity: "MEDIUM", impact: "Incomplete validation coverage", mitigation: "Grant necessary database permissions to engine service account", status: "Open" }
    ],
    go_no_go: {
      decision: "NO-GO",
      reason: "Critical issues detected — schema drift and balance reconciliation failures must be resolved before pilot",
      minimum_requirements: ["Resolve schema drift (C010)", "Resolve balance reconciliation (C02)", "Resolve row count mismatch (C01)", "Grant engine permissions for full validation"]
    },
    kpi_cards: [
      { label: "Overall Risk", value: "High", status: "error", icon: "alert-triangle" },
      { label: "Risk Score", value: "58.3/100", status: "error", icon: "gauge" },
      { label: "Critical Risks", value: "2", status: "error", icon: "alert-octagon" },
      { label: "High Risks", value: "2", status: "warning", icon: "alert-circle" },
      { label: "Go/No-Go", value: "No-Go", status: "error", icon: "shield-off" }
    ]
  },

  migrationProgress: {
    dashboard: "Migration Progress",
    version: "1.0",
    generated: "2026-07-03T16:55:57Z",
    batch_id: "d3f78b07-09f4-4f92-be32-06efd06a5f71",
    theme: "MAP Nexus",
    data_source: "MAP Validation Engine — Live Execution",
    scenario: "Scenario 3 — MIXTURE",
    phases: [
      { phase: "Planning", status: "COMPLETED", completion_pct: 100, date: "2026-01-15" },
      { phase: "Discovery", status: "COMPLETED", completion_pct: 100, date: "2026-02-01" },
      { phase: "Profiling", status: "COMPLETED", completion_pct: 100, date: "2026-02-15" },
      { phase: "Mapping", status: "COMPLETED", completion_pct: 100, date: "2026-03-01" },
      { phase: "Validation", status: "IN_PROGRESS", completion_pct: 62, date: "2026-07-03" },
      { phase: "Testing", status: "NOT_STARTED", completion_pct: 0, date: null },
      { phase: "Pilot", status: "NOT_STARTED", completion_pct: 0, date: null },
      { phase: "Production", status: "NOT_STARTED", completion_pct: 0, date: null }
    ],
    timeline: {
      start_date: "2026-01-15", current_date: "2026-07-03", estimated_completion: "2026-12-31",
      elapsed_days: 169, remaining_days: 181, overall_completion_pct: 50
    },
    kpi_cards: [
      { label: "Current Phase", value: "Validation", status: "warning", icon: "check-square" },
      { label: "Phase Completion", value: "62%", status: "warning", icon: "pie-chart" },
      { label: "Overall Progress", value: "50%", status: "info", icon: "trending-up" },
      { label: "Days Elapsed", value: "169", status: "info", icon: "calendar" },
      { label: "Days Remaining", value: "181", status: "info", icon: "clock" }
    ]
  },

  dataQuality: {
    dashboard: "Data Quality",
    version: "1.0",
    generated: "2026-07-03T16:55:57Z",
    batch_id: "d3f78b07-09f4-4f92-be32-06efd06a5f71",
    theme: "MAP Nexus",
    data_source: "MAP Validation Engine — Live Execution",
    scenario: "Scenario 3 — MIXTURE",
    quality_dimensions: [
      { dimension: "Accuracy", score: 72, status: "warning", details: "Balance mismatch detected — variance between source and target", icon: "target" },
      { dimension: "Completeness", score: 75, status: "warning", details: "1 missing record in target accounts table", icon: "layers" },
      { dimension: "Consistency", score: 68, status: "warning", details: "Schema inconsistencies detected across all entities", icon: "repeat" },
      { dimension: "Validity", score: 85, status: "success", details: "Data types and formats are valid where checked", icon: "check-circle" },
      { dimension: "Uniqueness", score: 100, status: "success", details: "No duplicate records detected", icon: "hash" },
      { dimension: "Integrity", score: 80, status: "success", details: "Referential integrity maintained for existing records", icon: "link" }
    ],
    overall_quality_score: 80,
    quality_chart: {
      type: "radar",
      data: [
        { dimension: "Accuracy", score: 72 },
        { dimension: "Completeness", score: 75 },
        { dimension: "Consistency", score: 68 },
        { dimension: "Validity", score: 85 },
        { dimension: "Uniqueness", score: 100 },
        { dimension: "Integrity", score: 80 }
      ]
    },
    quality_trend: {
      type: "line",
      data: [
        { date: "2026-06-01", score: 82 },
        { date: "2026-06-15", score: 79 },
        { date: "2026-07-01", score: 80 },
        { date: "2026-07-03", score: 80 }
      ]
    },
    kpi_cards: [
      { label: "Overall Quality", value: "80%", status: "warning", icon: "award" },
      { label: "Accuracy", value: "72%", status: "warning", icon: "target" },
      { label: "Completeness", value: "75%", status: "warning", icon: "layers" },
      { label: "Consistency", value: "68%", status: "warning", icon: "repeat" },
      { label: "Validity", value: "85%", status: "success", icon: "check-circle" },
      { label: "Uniqueness", value: "100%", status: "success", icon: "hash" }
    ]
  },

  governanceCentre: {
    dashboard: "Governance Centre",
    version: "1.0",
    generated: "2026-07-03T16:55:57Z",
    batch_id: "d3f78b07-09f4-4f92-be32-06efd06a5f71",
    theme: "MAP Nexus",
    data_source: "MAP Validation Engine — Live Execution",
    scenario: "Scenario 3 — MIXTURE",
    issues: [
      { id: "ISS-001", type: "Schema Drift", description: "Column count mismatch between source and target", severity: "CRITICAL", owner: "Data Engineering", status: "Open", resolution_pct: 0, control: "C010", created: "2026-07-03T16:55:31Z" },
      { id: "ISS-002", type: "Balance Mismatch", description: "Balance reconciliation failure — variance detected", severity: "CRITICAL", owner: "Financial Operations", status: "Open", resolution_pct: 0, control: "C02", created: "2026-07-03T16:55:55Z" },
      { id: "ISS-003", type: "Row Count Mismatch", description: "Source and target record counts differ", severity: "HIGH", owner: "Data Engineering", status: "Open", resolution_pct: 0, control: "C01", created: "2026-07-03T16:55:31Z" },
      { id: "ISS-004", type: "Permission Error", description: "Engine unable to execute validation due to permissions", severity: "MEDIUM", owner: "Infrastructure", status: "Open", resolution_pct: 0, control: "C01, C02, C03, C07", created: "2026-07-03T16:55:31Z" },
      { id: "ISS-005", type: "Data Type Error", description: "Unable to validate data types for 2 of 3 entities", severity: "MEDIUM", owner: "Data Engineering", status: "Open", resolution_pct: 0, control: "C06", created: "2026-07-03T16:55:30Z" }
    ],
    issue_summary_chart: {
      type: "bar",
      data: [
        { type: "Schema Drift", count: 1, severity: "CRITICAL" },
        { type: "Balance Mismatch", count: 1, severity: "CRITICAL" },
        { type: "Row Count Mismatch", count: 1, severity: "HIGH" },
        { type: "Permission Error", count: 1, severity: "MEDIUM" },
        { type: "Data Type Error", count: 1, severity: "MEDIUM" }
      ]
    },
    severity_distribution: {
      type: "donut",
      data: [
        { label: "Critical", value: 2, color: "#C62828" },
        { label: "High", value: 1, color: "#F9A825" },
        { label: "Medium", value: 2, color: "#F9A825" },
        { label: "Low", value: 0, color: "#2E7D32" }
      ]
    },
    kpi_cards: [
      { label: "Total Findings", value: "5", status: "warning", icon: "alert-circle" },
      { label: "Critical", value: "2", status: "error", icon: "alert-octagon" },
      { label: "High", value: "1", status: "warning", icon: "alert-triangle" },
      { label: "Medium", value: "2", status: "warning", icon: "alert-circle" },
      { label: "Open Findings", value: "5", status: "error", icon: "circle" },
      { label: "Resolution Rate", value: "0%", status: "error", icon: "pie-chart" }
    ]
  }
};
