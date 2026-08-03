import json
import os
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

with open('comprehensive_data.json', 'r') as f:
    data = json.load(f)

def get_sample(source_key, max_rows=5):
    if source_key in data:
        cols, rows = data[source_key]
        if isinstance(rows, list) and len(rows) > 0 and isinstance(rows[0], str) and rows[0].startswith('ERROR'):
            return f"ERROR: {rows[0]}"
        sample = []
        for r in rows[:max_rows]:
            sample.append(dict(zip(cols, r)))
        return sample
    return "Not queried"

def get_count(source_key):
    if source_key in data:
        val = data[source_key]
        if isinstance(val, list) and len(val) == 1 and isinstance(val[0], (list, tuple)):
            return val[0][0]
    return None

wb = Workbook()

header_fill = PatternFill(start_color='4472C4', end_color='4472C4', fill_type='solid')
header_font = Font(bold=True, size=11, color='FFFFFF')
subtitle_font = Font(bold=True, size=12)
warning_fill = PatternFill(start_color='FFC7CE', end_color='FFC7CE', fill_type='solid')
ok_fill = PatternFill(start_color='C6EFCE', end_color='C6EFCE', fill_type='solid')
warn_fill = PatternFill(start_color='FFEB9C', end_color='FFEB9C', fill_type='solid')
thin_border = Border(
    left=Side(style='thin'), right=Side(style='thin'),
    top=Side(style='thin'), bottom=Side(style='thin')
)
wrap_align = Alignment(wrap_text=True, vertical='top')

def style_cell(cell, align=None):
    cell.border = thin_border
    if align:
        cell.alignment = align
    else:
        cell.alignment = wrap_align

def write_header_row(ws, row, headers):
    for i, h in enumerate(headers, 1):
        cell = ws.cell(row=row, column=i, value=h)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
        cell.border = thin_border

def write_data_row(ws, row, values):
    for i, v in enumerate(values, 1):
        cell = ws.cell(row=row, column=i, value=v)
        style_cell(cell)

# ============================================================
# SHEET 1: Full Analysis Matrix
# ============================================================
ws1 = wb.active
ws1.title = 'Full Analysis'
ws1['A1'] = 'Phase 09.1 — Comprehensive Frozen Component Source Analysis'
ws1['A1'].font = Font(bold=True, size=14)
ws1.merge_cells('A1:N1')
ws1['A2'] = f'Generated: 2026-07-30 | Frozen frontend: MAP_V2/03_Source/frontend/ | MVP frontend: MAP_V2/03_Source/frontend-mvp/'
ws1['A2'].font = Font(italic=True, size=9)
ws1.merge_cells('A2:N2')

headers = [
    'Comp #', 'Frozen Component', 'Category', 'In MVP?', 'MVP Page/Component',
    'Frozen DB Source (Traceability Matrix)', 'Frozen Source Sample Data', 'Frozen Source Relevance %',
    'MVP DB Source (Actual Backend)', 'MVP Source Sample Data', 'MVP Relevance %',
    'Alternative View/Table', 'Alt Relevance %', 'New View Required?', 'New View SQL (if any)'
]
write_header_row(ws1, 4, headers)

# Define ALL components from the traceability matrix
components = [
    # Dashboard Capability
    ('1', 'Portfolio Summary (system count)', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'core.system_registry (3 rows)', get_sample('core.system_registry'), '100%',
     'core.system_registry (same)', get_sample('core.system_registry'), '100%',
     'N/A — No alternative needed', 'N/A', 'No', ''),

    ('2', 'Portfolio Summary (control count)', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'engine.control_registry (10 rows)', get_sample('engine.control_registry'), '100%',
     'engine.control_registry (same)', get_sample('engine.control_registry'), '100%',
     'N/A', 'N/A', 'No', ''),

    ('3', 'Portfolio Summary (batch count)', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'engine.migration_batch_registry (543+ rows)', f"Count: {get_count('engine.migration_batch_registry_count')}", '100%',
     'engine.migration_batch_registry (same)', f"Count: {get_count('engine.migration_batch_registry_count')}", '100%',
     'N/A', 'N/A', 'No', ''),

    ('4', 'Metric tile: Migration Score', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'engine.unified_scores (58 rows, ALL NULL sub-scores)', '58 rows | matching=NULL fk=NULL profiling=NULL graph=NULL final_score=81.9125 (flat/stale)', '0%',
     'engine.unified_scores (same stale source)', 'Same stale data — 0% relevant', '0%',
     'engine.migration_score_summary (0 rows, schema correct)', '0% (empty table)',
     'YES — v_migration_score_summary', 'CREATE VIEW engine.v_migration_score_summary AS SELECT msb.batch_id, msb.execution_start, msb.overall_status, msb.overall_score, msb.project_id, COUNT(mce.rule_id) AS total_rules, SUM(CASE WHEN mce.execution_status = PASS THEN 1 ELSE 0 END) AS passed_rules, SUM(CASE WHEN mce.execution_status = FAIL THEN 1 ELSE 0 END) AS failed_rules, SUM(CASE WHEN mce.execution_status = ERROR THEN 1 ELSE 0 END) AS error_rules, ROUND((SUM(CASE WHEN mce.execution_status = FAIL THEN 1 WHEN mce.execution_status = ERROR THEN 2 ELSE 0 END))::numeric / NULLIF(COUNT(*), 0), 2) AS risk_index, ROUND((SUM(CASE WHEN mce.execution_status = PASS THEN 1 ELSE 0 END))::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS pass_rate_percent FROM engine.migration_validation_batch msb LEFT JOIN engine.migration_control_execution mce ON msb.batch_id = mce.batch_id WHERE msb.batch_id IS NOT NULL GROUP BY msb.batch_id, msb.execution_start, msb.execution_end, msb.overall_status, msb.overall_score, msb.project_id ORDER BY msb.execution_start DESC;'),

    ('5', 'Metric tile: Pass Rate', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'engine.migration_control_execution (7400 rows)', '4870 PASS | 443 FAIL | 2087 ERROR', '100%',
     'engine.migration_control_execution (same)', '4870 PASS | 443 FAIL | 2087 ERROR', '100%',
     'N/A', 'N/A', 'No', ''),

    ('6', 'Metric tile: Exception Count', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'engine.migration_control_exceptions (2503 rows)', f"Count: {get_count('exceptions_count')}", '100%',
     'engine.migration_control_exceptions (same)', f"Count: {get_count('exceptions_count')}", '100%',
     'N/A', 'N/A', 'No', ''),

    ('7', 'Activity feed table', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'engine.migration_control_execution (deprecated trace to engine.audit_log)', get_sample('activity_feed_sample', 3), '95%',
     'engine.migration_control_execution (same)', get_sample('activity_feed_sample', 3), '95%',
     'N/A — Correct source already', '95%', 'No', ''),

    ('8', 'Executive role-differentiated content', 'Dashboard', 'Yes', 'DashboardPage.tsx',
     'Same APIs as dashboard', 'Same API data', '95%',
     'Same APIs', 'Same API data', '95%',
     'N/A', 'N/A', 'No', ''),

    # Governance Capability
    ('9', 'Audit log table', 'Governance', 'Yes', 'GovernancePage.tsx',
     'engine.migration_control_execution (resolved from deprecated engine.audit_log)', get_sample('activity_feed_sample', 3), '100%',
     'engine.migration_control_execution (same)', get_sample('activity_feed_sample', 3), '100%',
     'N/A', 'N/A', 'No', ''),

    ('10', 'Pending approvals view', 'Governance', 'Yes', 'ApprovalsPage.tsx',
     'engine.migration_release_decision (13 rows)', get_sample('migration_release_decision'), '100%',
     'engine.migration_release_decision (same)', get_sample('migration_release_decision'), '100%',
     'N/A', 'N/A', 'No', ''),

    ('11', 'Exception requests view', 'Governance', 'Yes', 'GovernancePage.tsx',
     'engine.migration_control_exceptions (2503 rows)', f"Count: {get_count('exceptions_count')}", '100%',
     'engine.migration_control_exceptions (same)', f"Count: {get_count('exceptions_count')}", '100%',
     'N/A', 'N/A', 'No', ''),

    ('12', 'Compliance status view', 'Governance', 'Yes', 'GovernancePage.tsx',
     'engine.migration_control_summary (3688 rows)', get_sample('migration_control_summary_sample', 3), '100%',
     'engine.migration_control_summary (same)', get_sample('migration_control_summary_sample', 3), '100%',
     'N/A', 'N/A', 'No', ''),

    ('13', 'Risk score tab', 'Governance', 'Yes', 'GovernancePage.tsx',
     'engine.unified_scores (stale, 0% relevant)', 'Same stale data as Migration Score', '0%',
     'engine.v_migration_stability_score (40% — stability pass rate, not risk)', get_sample('v_migration_stability_score', 3), '40%',
     'engine.v_dataset_risk_index (80% — correct risk methodology but per-entity, not per-batch)', '80%',
     'YES — v_batch_risk_index', 'CREATE VIEW engine.v_batch_risk_index AS SELECT batch_id, count(*) AS total_rules, sum(CASE WHEN execution_status = PASS THEN 0 WHEN execution_status = FAIL THEN 1 WHEN execution_status = ERROR THEN 2 ELSE NULL::integer END) AS risk_points, round((sum(CASE WHEN execution_status = PASS THEN 0 WHEN execution_status = FAIL THEN 1 WHEN execution_status = ERROR THEN 2 ELSE NULL::integer END))::numeric / count(*), 2) AS risk_index, round((sum(CASE WHEN execution_status IN (FAIL,ERROR) THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent FROM engine.migration_control_execution WHERE batch_id IS NOT NULL GROUP BY batch_id ORDER BY risk_index DESC;'),

    # Execution Control Capability
    ('14', 'Run execution button', 'Execution Control', 'Yes', 'MigrationPage.tsx',
     'engine.migration_batch_registry (via POST /api/v1/execution/run)', 'batch_registry has 550+ rows', '100%',
     'engine.migration_batch_registry (same)', 'Same data', '100%',
     'N/A', 'N/A', 'No', ''),

    ('15', 'Status polling display', 'Execution Control', 'Yes', 'MigrationPage.tsx',
     'engine.migration_batch_registry (GET /api/v1/execution/status/:batchId)', 'batch_status column per batch', '100%',
     'engine.migration_batch_registry (same)', 'batch_status values: COMPLETED, RUNNING, etc.', '100%',
     'N/A', 'N/A', 'No', ''),

    ('16', 'Cancel execution button', 'Execution Control', 'Yes', 'MigrationPage.tsx',
     'POST /api/v1/execution/run + cancel logic', 'Same batch_registry source', '100%',
     'Same batch_registry source', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('17', 'Pause/Resume execution', 'Execution Control', 'Yes', 'MigrationPage.tsx',
     'Same endpoint + pause/resume logic', 'Same batch_registry source', '100%',
     'Same batch_registry source', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('18', 'Retry execution', 'Execution Control', 'Yes', 'ExecutionHistoryPage.tsx',
     'engine.batch_execution_checkpoint (436 rows)', f"Count: {get_count('batch_execution_checkpoint_count')}", '100%',
     'engine.batch_execution_checkpoint (same)', get_sample('batch_execution_checkpoint', 3), '100%',
     'N/A', 'N/A', 'No', ''),

    ('19', 'Batch lifecycle events', 'Execution Control', 'Yes', 'ExecutionHistoryPage.tsx',
     'engine.batch_execution_checkpoint (436 rows, partial lifecycle)', f"Count: {get_count('batch_execution_checkpoint_count')}", '75% (partial)',
     'engine.batch_execution_checkpoint (same)', get_sample('batch_execution_checkpoint', 3), '75% (partial)',
     'N/A', 'N/A', 'No', ''),

    # Execution History Capability
    ('20', 'Batch list table', 'Execution History', 'Yes', 'ExecutionHistoryPage.tsx',
     'engine.migration_batch_registry (550 rows)', f"Count: {get_count('engine.migration_batch_registry_count')}", '100%',
     'engine.migration_batch_registry (same)', f"Count: {get_count('engine.migration_batch_registry_count')}", '100%',
     'N/A', 'N/A', 'No', ''),

    ('21', 'Batch detail view', 'Execution History', 'Yes', 'ExecutionHistoryPage.tsx',
     'engine.migration_batch_registry (single batch)', 'Per-batch: batch_id, batch_status, project_id', '100%',
     'engine.migration_batch_registry (same)', 'Same data', '100%',
     'N/A', 'N/A', 'No', ''),

    ('22', 'Re-execute button', 'Execution History', 'Yes', 'ExecutionHistoryPage.tsx',
     'Same as retry endpoint', 'batch_execution_checkpoint', '100%',
     'Same', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('23', 'Audit trail display', 'Execution History', 'Yes', 'ExecutionHistoryPage.tsx',
     'engine.migration_control_execution (same as governance audit)', get_sample('activity_feed_sample', 3), '100%',
     'engine.migration_control_execution (same)', get_sample('activity_feed_sample', 3), '100%',
     'N/A', 'N/A', 'No', ''),

    ('24', 'Control summaries display', 'Execution History', 'Yes', 'ExecutionHistoryPage.tsx',
     'engine.migration_control_summary (3688 rows)', get_sample('migration_control_summary_sample', 3), '100%',
     'engine.migration_control_summary (same)', get_sample('migration_control_summary_sample', 3), '100%',
     'N/A', 'N/A', 'No', ''),

    ('25', 'Governance decision display', 'Execution History', 'Yes', 'ExecutionHistoryPage.tsx',
     'engine.migration_release_decision (13 rows, all REJECTED)', get_sample('migration_release_decision'), '100%',
     'engine.migration_release_decision (same)', get_sample('migration_release_decision'), '100%',
     'N/A', 'N/A', 'No', ''),

    # Rule Execution Capability
    ('26', 'Rules by batch view', 'Rule Execution', 'Yes', 'ValidationPage.tsx',
     'engine.migration_control_execution (7400 rows)', f"7400 rows: {get_count('control_execution_by_status')}", '100%',
     'engine.migration_control_execution (same)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('27', 'Rule detail view', 'Rule Execution', 'Yes', 'ValidationResultsPage.tsx',
     'engine.migration_control_execution (single rule)', 'rule_id + execution_status per batch', '100%',
     'engine.migration_control_execution (same)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('28', 'Control rules view', 'Rule Execution', 'Yes', 'ValidationPage.tsx',
     'engine.control_registry (10 rows)', get_sample('engine.control_registry'), '100%',
     'engine.control_registry (same)', get_sample('engine.control_registry'), '100%',
     'N/A', 'N/A', 'No', ''),

    ('29', 'Execution results view', 'Rule Execution', 'Yes', 'ValidationResultsPage.tsx',
     'engine.migration_control_execution', '7400 rows of execution results', '100%',
     'engine.migration_control_execution (same)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    # Validation Report Capability
    ('30', 'Validation report display', 'Validation Report', 'Yes', 'ValidationPage.tsx',
     'engine.migration_validation_batch (21 rows)', get_sample('migration_validation_batch', 3), '100%',
     'engine.migration_validation_batch (same)', get_sample('migration_validation_batch', 3), '100%',
     'N/A', 'N/A', 'No', ''),

    ('31', 'Governance decision in report', 'Validation Report', 'Yes', 'ValidationPage.tsx',
     'engine.migration_validation_batch (same as display)', 'Same data as #30', '100%',
     'engine.migration_validation_batch (same)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('32', 'Risk score in report', 'Validation Report', 'Yes', 'ValidationPage.tsx',
     'engine.unified_scores (stale, 0% relevant)', 'Same stale data', '0%',
     'engine.v_migration_stability_score (40% — stability, not risk)', get_sample('v_migration_stability_score', 3), '40%',
     'engine.v_dataset_risk_index (80% — per-entity risk methodology)', '80%',
     'YES — v_batch_risk_index', 'CREATE VIEW engine.v_batch_risk_index AS SELECT batch_id, count(*) AS total_rules, sum(CASE WHEN execution_status = PASS THEN 0 WHEN execution_status = FAIL THEN 1 WHEN execution_status = ERROR THEN 2 ELSE NULL::integer END) AS risk_points, round((sum(CASE WHEN execution_status = PASS THEN 0 WHEN execution_status = FAIL THEN 1 WHEN execution_status = ERROR THEN 2 ELSE NULL::integer END))::numeric / count(*), 2) AS risk_index, round((sum(CASE WHEN execution_status IN (FAIL,ERROR) THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent FROM engine.migration_control_execution WHERE batch_id IS NOT NULL GROUP BY batch_id ORDER BY risk_index DESC;'),

    ('33', 'Compliance checks in report', 'Validation Report', 'Yes', 'ValidationPage.tsx',
     'engine.migration_control_execution (same as #29)', '100%', '100%',
     'engine.migration_control_execution (same)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('34', 'Export CSV button', 'Validation Report', 'Yes', 'ValidationPage.tsx',
     'Same report endpoint + CSV export', '100%', '100%',
     'Same endpoint + CSV export', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('35', 'Export PDF button', 'Validation Report', 'Yes', 'ValidationPage.tsx',
     'Same report endpoint + PDF export', '100%', '100%',
     'Same endpoint + PDF export', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    # Monitoring Capability
    ('36', 'System health monitor', 'Monitoring', 'Yes', 'OperationsPage.tsx',
     'N/A (runtime check)', 'No database source', 'N/A',
     'N/A (runtime check)', 'Same', 'N/A',
     'N/A', 'N/A', 'No', ''),

    ('37', 'Performance metrics display', 'Monitoring', 'Yes', 'OperationsPage.tsx',
     'N/A (runtime)', 'No database source', 'N/A',
     'N/A (runtime)', 'Same', 'N/A',
     'N/A', 'N/A', 'No', ''),

    ('38', 'Queue status display', 'Monitoring', 'Yes', 'OperationsPage.tsx',
     'N/A (runtime)', 'No database source', 'N/A',
     'N/A (runtime)', 'Same', 'N/A',
     'N/A', 'N/A', 'No', ''),

    ('39', 'Alerts list', 'Monitoring', 'Yes', 'OperationsPage.tsx',
     'N/A (runtime)', 'No database source', 'N/A',
     'N/A (runtime)', 'Same', 'N/A',
     'N/A', 'N/A', 'No', ''),

    ('40', 'Operational logs', 'Monitoring', 'Yes', 'OperationsPage.tsx',
     'N/A (runtime)', 'No database source', 'N/A',
     'N/A (runtime)', 'Same', 'N/A',
     'N/A', 'N/A', 'No', ''),

    # Discovery Capability
    ('41', 'Discovery datasets list', 'Discovery', 'Yes', 'DiscoveryPage.tsx',
     'core.dataset_mappings (3 rows)', get_sample('dataset_mappings'), '100%',
     'core.dataset_mappings (same)', get_sample('dataset_mappings'), '100%',
     'N/A', 'N/A', 'No', ''),

    ('42', 'Dataset detail view', 'Discovery', 'Yes', 'DiscoveryPage.tsx',
     'core.dataset_mappings (same)', 'Same data as #41', '100%',
     'core.dataset_mappings (same)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('43', 'Trigger discovery button', 'Discovery', 'Yes', 'DiscoveryPage.tsx',
     'POST /api/v1/discovery/run (runtime)', '100%', '100%',
     'Same', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('44', 'Discovery status display', 'Discovery', 'Yes', 'DiscoveryPage.tsx',
     'GET /api/v1/discovery/status (runtime)', '100%', '100%',
     'Same', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    # Platform — Authentication & Users
    ('45', 'Login form', 'Auth', 'Yes', 'LoginPage.tsx',
     'N/A (JWT)', '100%', '100%',
     'N/A (JWT)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('46', 'JWT token storage', 'Auth', 'Yes', 'LoginPage.tsx',
     'localStorage.getItem(access_token)', '100%', '100%',
     'Same', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('47', 'Role switcher dropdown', 'Auth', 'Yes', 'LoginPage.tsx',
     'platform.user_roles (0 rows) + platform.roles (6 rows)', get_sample('platform_roles'), '100%',
     'platform.roles (same)', get_sample('platform_roles'), '100%',
     'N/A', 'N/A', 'No', ''),

    ('48', 'Protected route redirect', 'Auth', 'Yes', 'LoginPage.tsx',
     'N/A (client-side routing)', '100%', '100%',
     'N/A (same)', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),

    ('49', 'Logout with localStorage clear', 'Auth', 'Yes', 'LoginPage.tsx',
     'POST /api/v1/auth/logout', '100%', '100%',
     'Same', 'Same', '100%',
     'N/A', 'N/A', 'No', ''),
]

# Deferred platform components
deferred_platform = [
    ('50', 'User list with CRUD', 'Platform - Users Mgmt', 'Yes', 'UsersPage.tsx',
     'platform.users (1 seed row)', '1 row', '10% (empty, 1 seed)',
     'platform.users (same, 1 row)', '1 row', '10% (empty)',
     'N/A — deferred (no MAP CLI writer)', '0% (no writer)',
     'No', 'Requires MAP CLI user management writer'),

    ('51', 'User detail view', 'Platform - Users Mgmt', 'Yes', 'UserDetailPage.tsx',
     'platform.users (1 seed)', '1 row', '10%',
     'platform.users (same)', '1 row', '10%',
     'N/A', '0%', 'No', 'Requires MAP CLI user writer'),

    ('52', 'Create user modal', 'Platform - Users Mgmt', 'Yes', 'UsersPage.tsx',
     'platform.users (POST /api/v1/users)', 'No data', '0%',
     'platform.users (same)', 'No data', '0%',
     'N/A', '0%', 'No', 'Requires MAP CLI user writer'),

    ('53', 'Edit user modal', 'Platform - Users Mgmt', 'Yes', 'UserDetailPage.tsx',
     'platform.users (PUT /api/v1/users/{id})', 'No data', '0%',
     'platform.users (same)', 'No data', '0%',
     'N/A', '0%', 'No', 'Requires MAP CLI user writer'),

    ('54', 'Delete user action', 'Platform - Users Mgmt', 'Yes', 'UsersPage.tsx',
     'platform.users (DELETE /api/v1/users/{id})', 'No data', '0%',
     'platform.users (same)', 'No data', '0%',
     'N/A', '0%', 'No', 'Requires MAP CLI user writer'),

    ('55', 'Role list with CRUD', 'Platform - Roles Mgmt', 'Yes', 'RolesPage.tsx',
     'platform.roles (6 seed rows)', get_sample('platform_roles'), '100% (seeded)',
     'platform.roles (same, 6 rows)', get_sample('platform_roles'), '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI writer'),

    ('56', 'Role detail view', 'Platform - Roles Mgmt', 'Yes', 'RoleDetailPage.tsx',
     'platform.roles (same as #55)', 'Same data', '100% (seeded)',
     'platform.roles (same)', 'Same', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI writer'),

    ('57', 'Permission assignment', 'Platform - Roles Mgmt', 'Yes', 'RoleDetailPage.tsx',
     'platform.role_permissions (44 rows)', '44 rows', '100% (seeded)',
     'platform.role_permissions (same)', '44 rows', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI writer'),

    ('58', 'Settings CRUD', 'Platform - Settings', 'Yes', 'SettingsPage.tsx',
     'platform.system_settings (15 seed rows)', '15 rows', '100% (seeded)',
     'platform.system_settings (same)', '15 rows', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI writer'),

    ('59', 'Feature flags toggle', 'Platform - Settings', 'Yes', 'SettingsPage.tsx',
     'platform.feature_flags (6 seed rows)', '6 rows', '100% (seeded)',
     'platform.feature_flags (same)', '6 rows', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — DB-driven, no MAP CLI writer'),

    ('60', 'Task list with CRUD', 'Platform - Task Mgmt', 'Yes', 'TaskManagementPage.tsx',
     'platform.tasks (8 seed rows)', '8 rows', '100% (seeded)',
     'platform.tasks (same)', '8 rows', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI writer'),

    ('61', 'Notification list', 'Platform - Notifications', 'Yes', 'NotificationsPage.tsx',
     'platform.notifications (5 seed rows)', '5 rows', '100% (seeded)',
     'platform.notifications (same)', '5 rows', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI writer'),

    ('62', 'Mark as read', 'Platform - Notifications', 'Yes', 'NotificationsPage.tsx',
     'platform.notifications (same as #61)', 'Same data', '100% (seeded)',
     'platform.notifications (same)', 'Same', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI writer'),

    ('63', 'Calendar event list', 'Platform - Calendar', 'Yes', 'CalendarPage.tsx',
     'platform.calendar_events (0 rows)', '0 rows', '0% (empty)',
     'platform.calendar_events (same)', '0 rows', '0% (empty)',
     'N/A', '0%', 'No', 'Deferred — no MAP CLI calendar writer'),

    ('64', 'Approval request list', 'Platform - Approvals', 'Yes', 'ApprovalsPage.tsx',
     'platform.approval_requests (0 rows)', '0 rows', '0% (empty)',
     'platform.approval_requests (same)', '0 rows', '0% (empty)',
     'N/A', '0%', 'No', 'Deferred — no MAP CLI approval writer'),

    ('65', 'Workflow definition list', 'Platform - Workflows', 'Yes', 'WorkflowsPage.tsx',
     'platform.workflow_definitions (4 seed rows)', '4 rows', '100% (seeded)',
     'platform.workflow_definitions (same)', '4 rows', '100% (seeded)',
     'N/A', 'N/A', 'No', 'Deferred — no MAP CLI workflow execution writer'),

    ('66', 'Workflow instance list', 'Platform - Workflows', 'Yes', 'WorkflowsPage.tsx',
     'platform.workflow_instances (0 rows)', '0 rows', '0% (empty)',
     'platform.workflow_instances (same)', '0 rows', '0% (empty)',
     'N/A', '0%', 'No', 'Deferred — no MAP CLI workflow execution writer'),
]

# Shared components
shared_components = [
    ('67', 'StatusBadge', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only — no DB source'),
    ('68', 'ProgressBar', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('69', 'DataTable', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('70', 'MetricCard', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('71', 'EmptyState', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('72', 'ErrorState', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('73', 'LoadingSkeleton', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('74', 'SearchBar', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('75', 'Pagination', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('76', 'Modal', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('77', 'ConfirmDialog', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('78', 'Toast', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
    ('79', 'TabBar', 'Shared Components', 'Yes', 'Shared component', 'N/A (presentation only)', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'No', 'Presentation only'),
]

# Write all components to sheet
row_num = 5
all_rows = components + deferred_platform + shared_components
for comp in all_rows:
    write_data_row(ws1, row_num, comp)
    row_num += 1

# Auto-width
for col in range(1, len(headers) + 1):
    max_len = 0
    for r in range(4, row_num):
        val = ws1.cell(row=r, column=col).value
        if val:
            for line in str(val).split('\n'):
                max_len = max(max_len, len(line))
    ws1.column_dimensions[get_column_letter(col)].width = min(max_len + 2, 50)

# Freeze panes
ws1.freeze_panes = 'A5'

# ============================================================
# SHEET 2: New Views Required
# ============================================================
ws2 = wb.create_sheet('New Views Required')
ws2['A1'] = 'New Views Required (Analysis Only)'
ws2['A1'].font = subtitle_font
ws2.merge_cells('A1:F1')

vh = ['View Name', 'Purpose', 'Replaces Source', 'Relevance %', 'SQL Definition', 'Notes']
write_header_row(ws2, 3, vh)

views_data = [
    ('v_batch_risk_index', 'Per-batch risk scoring replacing engine.unified_scores for Risk Score tab', 'engine.unified_scores', '100%',
     """CREATE OR REPLACE VIEW engine.v_batch_risk_index AS
SELECT batch_id,
    count(*) AS total_rules,
    sum(CASE WHEN execution_status = 'PASS' THEN 0
             WHEN execution_status = 'FAIL' THEN 1
             WHEN execution_status = 'ERROR' THEN 2
             ELSE NULL::integer END) AS risk_points,
    round((sum(CASE WHEN execution_status = 'PASS' THEN 0
                     WHEN execution_status = 'FAIL' THEN 1
                     WHEN execution_status = 'ERROR' THEN 2
                     ELSE NULL::integer END))::numeric / count(*), 2) AS risk_index,
    round((sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent,
    round((sum(CASE WHEN execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric / NULLIF(count(*), 0) * 100, 2) AS pass_rate_percent
FROM engine.migration_control_execution
WHERE batch_id IS NOT NULL
GROUP BY batch_id
ORDER BY risk_index DESC;""",
     'Uses same risk methodology as v_dataset_risk_index (FAIL=1, ERROR=2) but groups by batch_id instead of entity_name. Replaces the incorrect engine.unified_scores reference for the Risk Score tab and API GET /api/v1/execution/{batch_id}/risk-score.'),

    ('v_migration_score_summary', 'Comprehensive per-batch migration score summary replacing engine.unified_scores for Migration Score tile', 'engine.unified_scores', '95%',
     """CREATE OR REPLACE VIEW engine.v_migration_score_summary AS
SELECT msb.batch_id, msb.execution_start, msb.execution_end, msb.overall_status, msb.overall_score, msb.project_id,
    COUNT(mce.rule_id) AS total_rules,
    SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END) AS passed_rules,
    SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 ELSE 0 END) AS failed_rules,
    SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END) AS error_rules,
    ROUND((SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 WHEN mce.execution_status = 'ERROR' THEN 2 ELSE 0 END))::numeric / NULLIF(COUNT(*), 0), 2) AS risk_index,
    ROUND((SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS pass_rate_percent,
    ROUND((SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END))::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS error_rate_percent
FROM engine.migration_validation_batch msb
LEFT JOIN engine.migration_control_execution mce ON msb.batch_id = mce.batch_id
WHERE msb.batch_id IS NOT NULL
GROUP BY msb.batch_id, msb.execution_start, msb.execution_end, msb.overall_status, msb.overall_score, msb.project_id
ORDER BY msb.execution_start DESC;""",
     'Combines migration_validation_batch (overall_score, overall_status) with migration_control_execution (per-rule pass/fail/error counts). Replaces the incorrect engine.unified_scores reference for the Migration Score tile. Limited to 21 rows (validation batch history).'),

    ('v_batch_entity_risk_index', 'Per-batch per-entity risk scoring for detailed Risk Score tab breakdown', 'N/A (supplementary)', '70%',
     """CREATE OR REPLACE VIEW engine.v_batch_entity_risk_index AS
SELECT batch_id, entity_name,
    count(*) AS total_rules,
    sum(CASE WHEN execution_status = 'PASS' THEN 0
             WHEN execution_status = 'FAIL' THEN 1
             WHEN execution_status = 'ERROR' THEN 2
             ELSE NULL::integer END) AS risk_points,
    round((sum(CASE WHEN execution_status = 'PASS' THEN 0
                     WHEN execution_status = 'FAIL' THEN 1
                     WHEN execution_status = 'ERROR' THEN 2
                     ELSE NULL::integer END))::numeric / count(*), 2) AS risk_index,
    round((sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric / count(*) * 100, 2) AS failure_rate_percent
FROM engine.migration_control_execution
WHERE batch_id IS NOT NULL
GROUP BY batch_id, entity_name
ORDER BY batch_id, risk_index DESC;""",
     'Supplementary view providing per-entity risk breakdown within each batch. Useful for detailed Risk Score tab showing which datasets have highest risk. Not required for the basic risk score tile but adds detail.'),
]

for i, vd in enumerate(views_data, 4):
    write_data_row(ws2, i, vd)
    ws2.row_dimensions[i].height = 120

ws2.column_dimensions['A'].width = 30
ws2.column_dimensions['B'].width = 40
ws2.column_dimensions['C'].width = 25
ws2.column_dimensions['D'].width = 12
ws2.column_dimensions['E'].width = 120
ws2.column_dimensions['F'].width = 50

# ============================================================
# SHEET 3: Relevance Summary
# ============================================================
ws3 = wb.create_sheet('Relevance Summary')
ws3['A1'] = 'Relevance Score Summary — All Sources'
ws3['A1'].font = subtitle_font
ws3.merge_cells('A1:F1')

rh = ['Source', 'Type', 'Frozen Relevance %', 'MVP Relevance %', 'Avg Relevance %', 'Notes']
write_header_row(ws3, 3, rh)

source_summary = [
    ('core.system_registry', 'BASE TABLE', '100%', '100%', '100%', '3 rows, correct for system count'),
    ('engine.control_registry', 'BASE TABLE', '100%', '100%', '100%', '10 rows, seeded by SQL DDL'),
    ('engine.migration_batch_registry', 'BASE TABLE', '100%', '100%', '100%', '550 rows, populated by execution_engine.py'),
    ('engine.unified_scores (DEPRECATED)', 'BASE TABLE', '0%', '0%', '0%', '58 rows, ALL sub-scores NULL, flat final_score=81.9125, stale since April 2026'),
    ('engine.migration_control_execution', 'BASE TABLE', '100%', '100%', '100%', '7400 rows, populated by rule_executor.py:_log_rule_execution'),
    ('engine.migration_control_exceptions', 'BASE TABLE', '100%', '100%', '100%', '2503 rows, populated by rule_executor.py:_log_exception'),
    ('engine.migration_release_decision', 'BASE TABLE', '100%', '100%', '100%', '13 rows, populated by execution_engine.py:_enforce_release_gate'),
    ('engine.migration_control_summary', 'BASE TABLE', '100%', '100%', '100%', '3688 rows, populated by rule_executor.py:_log_control_summary'),
    ('engine.migration_validation_batch', 'BASE TABLE', '100%', '100%', '100%', '21 rows, has overall_score and overall_status per batch'),
    ('engine.migration_score_summary (existing)', 'BASE TABLE (empty)', '0%', '0%', '0%', 'Correct schema but 0 rows — DDL executed, never populated'),
    ('engine.migration_score_details (existing)', 'BASE TABLE (empty)', '0%', '0%', '0%', 'Correct schema but 0 rows — DDL executed, never populated'),
    ('engine.v_migration_stability_score', 'VIEW', '40%', '40%', '40%', 'Stability/pass-rate metric, not a risk score — semantics inverted'),
    ('engine.v_dataset_risk_index', 'VIEW', '80%', '80%', '80%', 'Correct risk methodology (FAIL=1, ERROR=2) but per-entity, not per-batch'),
    ('engine.v_dataset_risk_heatmap', 'VIEW', '60%', '60%', '60%', 'Per-entity failure rate, no composite risk score'),
    ('engine.v_migration_score_trend', 'VIEW', '55%', '55%', '55%', 'Per-batch overall_score and trend, no sub-score breakdown'),
    ('engine.v_batch_governance_summary', 'VIEW', '75%', '75%', '75%', 'Per-batch pass/fail/error counts, no risk index'),
    ('engine.v_migration_health_dashboard', 'VIEW', '30%', '30%', '30%', 'Completion % and governance status, no score data'),
    ('engine.v_migration_score_trend (same)', 'VIEW', '55%', '55%', '55%', 'Same as v_migration_score_trend above'),
    ('engine.batch_rule_scores', 'BASE TABLE (empty)', '0%', '0%', '0%', '0 rows — empty stub table'),
    ('engine.batch_anomaly_analysis', 'BASE TABLE (empty)', '0%', '0%', '0%', '0 rows — empty stub table'),
    ('engine.migration_risk_scores', 'TABLE (DDL never executed)', '0%', '0%', '0%', 'Table does not exist — DDL was defined but never created'),
    ('v_batch_risk_index (PROPOSED NEW)', 'NEW VIEW', '100%', '100%', '100%', 'Per-batch risk scoring with FAIL=1, ERROR=2 methodology'),
    ('v_migration_score_summary (PROPOSED NEW)', 'NEW VIEW', '95%', '95%', '95%', 'Comprehensive per-batch migration score summary'),
    ('v_batch_entity_risk_index (PROPOSED NEW)', 'NEW VIEW', '70%', '70%', '70%', 'Supplementary per-batch per-entity risk breakdown'),
]

for i, sd in enumerate(source_summary, 4):
    write_data_row(ws3, i, sd)
    # Color code relevance
    rel_cell = ws3.cell(row=i, column=4)
    try:
        pct = int(str(rel_cell.value).replace('%', ''))
        if pct >= 80:
            rel_cell.fill = ok_fill
        elif pct >= 40:
            rel_cell.fill = warn_fill
        elif pct > 0:
            rel_cell.fill = warning_fill
        else:
            rel_cell.fill = warning_fill
    except:
        pass

ws3.column_dimensions['A'].width = 35
ws3.column_dimensions['B'].width = 25
ws3.column_dimensions['C'].width = 18
ws3.column_dimensions['D'].width = 18
ws3.column_dimensions['E'].width = 18
ws3.column_dimensions['F'].width = 60

# ============================================================
# SHEET 4: MVP Cross-Reference
# ============================================================
ws4 = wb.create_sheet('MVP Cross-Reference')
ws4['A1'] = 'MVP Frontend Cross-Reference — Which Components Exist in MVP?'
ws4['A1'].font = subtitle_font
ws4.merge_cells('A1:E1')

mvp_headers = ['Component', 'In MVP?', 'MVP Page/File', 'MVP Data Source', 'MVP Relevance %']
write_header_row(ws4, 3, mvp_headers)

mvp_cross_ref = [
    ('Dashboard — Portfolio Summary', 'Yes', 'DashboardPage.tsx', 'core.system_registry, engine.control_registry, engine.migration_batch_registry', '100%'),
    ('Dashboard — Migration Score tile', 'Yes', 'DashboardPage.tsx', 'engine.unified_scores (stale)', '0%'),
    ('Dashboard — Pass Rate KPI', 'Yes', 'DashboardPage.tsx', 'engine.migration_control_execution', '100%'),
    ('Dashboard — Exception Count KPI', 'Yes', 'DashboardPage.tsx', 'engine.migration_control_exceptions', '100%'),
    ('Dashboard — Activity feed', 'Yes', 'DashboardPage.tsx', 'engine.migration_control_execution', '95%'),
    ('Dashboard — Executive role content', 'Yes', 'DashboardPage.tsx', 'Same APIs', '95%'),
    ('Governance — Audit log', 'Yes', 'GovernancePage.tsx', 'engine.migration_control_execution', '100%'),
    ('Governance — Pending approvals', 'Yes', 'ApprovalsPage.tsx', 'engine.migration_release_decision', '100%'),
    ('Governance — Exception requests', 'Yes', 'GovernancePage.tsx', 'engine.migration_control_exceptions', '100%'),
    ('Governance — Compliance status', 'Yes', 'GovernancePage.tsx', 'engine.migration_control_summary', '100%'),
    ('Governance — Risk score tab', 'Yes', 'GovernancePage.tsx', 'engine.unified_scores (stale) / v_migration_stability_score', '40%'),
    ('Execution Control — Run/Status/Cancel/Pause/Resume/Retry', 'Yes', 'MigrationPage.tsx', 'engine.migration_batch_registry, engine.batch_execution_checkpoint', '100%'),
    ('Execution History — Batch list/detail/re-execute', 'Yes', 'ExecutionHistoryPage.tsx', 'engine.migration_batch_registry, engine.migration_control_execution', '100%'),
    ('Rule Execution — Rules by batch, rule detail, control rules, results', 'Yes', 'ValidationPage.tsx, ValidationResultsPage.tsx', 'engine.migration_control_execution, engine.control_registry', '100%'),
    ('Validation Report — Display, governance decision, compliance, CSV, PDF', 'Yes', 'ValidationPage.tsx', 'engine.migration_validation_batch, engine.migration_control_execution', '100%'),
    ('Validation Report — Risk score in report', 'Yes', 'ValidationPage.tsx', 'engine.unified_scores (stale)', '0%'),
    ('Monitoring — Health, metrics, queue, alerts, logs', 'Yes', 'OperationsPage.tsx', 'N/A (runtime)', 'N/A'),
    ('Discovery — Datasets, detail, trigger, status', 'Yes', 'DiscoveryPage.tsx', 'core.dataset_mappings', '100%'),
    ('Auth — Login, JWT, role switcher, protected route, logout', 'Yes', 'LoginPage.tsx', 'N/A (JWT/platform.roles)', '100%'),
    ('Shared Components (14)', 'Yes', 'Various', 'N/A (presentation)', 'N/A'),
]

for i, cr in enumerate(mvp_cross_ref, 4):
    write_data_row(ws4, i, cr)
    # Color code
    rel = cr[4]
    try:
        pct = int(rel.replace('%', ''))
        cell = ws4.cell(row=i, column=5)
        if pct >= 80:
            cell.fill = ok_fill
        elif pct > 0:
            cell.fill = warn_fill
        elif pct == 0:
            cell.fill = warning_fill
    except:
        pass

ws4.column_dimensions['A'].width = 40
ws4.column_dimensions['B'].width = 8
ws4.column_dimensions['C'].width = 25
ws4.column_dimensions['D'].width = 50
ws4.column_dimensions['E'].width = 18

# Save
xlsx_path = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\engineering\MAP_V2\00_Architecture\Verification\00_outputs\utilities\phase_09_Frontend_Architecture\research\09_Component_Source_Analysis.xlsx'
wb.save(xlsx_path)
print(f'XLSX saved to {xlsx_path}')
print(f'Total components analyzed: {len(all_rows)}')
"