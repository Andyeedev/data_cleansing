import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()

header_font = Font(bold=True, size=11)
title_font = Font(bold=True, size=14)
subtitle_font = Font(bold=True, size=12)
wrap_align = Alignment(wrap_text=True, vertical='top')
header_fill = PatternFill(start_color='4472C4', end_color='4472C4', fill_type='solid')
header_font_white = Font(bold=True, size=11, color='FFFFFF')
thin_border = Border(
    left=Side(style='thin'), right=Side(style='thin'),
    top=Side(style='thin'), bottom=Side(style='thin')
)

def style_header_row(ws, row, max_col):
    for col in range(1, max_col + 1):
        cell = ws.cell(row=row, column=col)
        cell.font = header_font_white
        cell.fill = header_fill
        cell.alignment = Alignment(wrap_text=True, vertical='center', horizontal='center')
        cell.border = thin_border

def style_data_cell(ws, row, col):
    cell = ws.cell(row=row, column=col)
    cell.alignment = wrap_align
    cell.border = thin_border

def auto_width(ws, max_col, max_width=50):
    for col in range(1, max_col + 1):
        max_len = 0
        for row in ws.iter_rows(min_col=col, max_col=col, values_only=False):
            for cell in row:
                if cell.value:
                    lines = str(cell.value).split('\n')
                    for line in lines:
                        max_len = max(max_len, len(line))
        ws.column_dimensions[get_column_letter(col)].width = min(max_len + 2, max_width)

# Sheet 1: Summary Table
ws1 = wb.active
ws1.title = 'Summary'
ws1['A1'] = 'Phase 09.1 — Frozen vs MVP Component Source Analysis'
ws1['A1'].font = title_font
ws1.merge_cells('A1:G1')

ws1['A2'] = 'Date: 2026-07-30 | Constraint: No code changes to frozen frontend or MVP'
ws1['A2'].font = Font(italic=True, size=10)
ws1.merge_cells('A2:G2')

headers1 = ['#', 'Frozen Component', 'Category', 'Current DB Source', 'Source Relevance %', 'MVP Source', 'MVP Relevance %', 'Status', 'New View Required?']
for i, h in enumerate(headers1, 1):
    ws1.cell(row=4, column=i, value=h)
style_header_row(ws1, 4, len(headers1))

data1 = [
    [1, 'Migration Score tile', 'Dashboard', 'engine.unified_scores', '0%', 'Same source (unified_scores)', '0%', 'BLOCKED — needs v_migration_score_summary', 'YES — v_migration_score_summary'],
    [2, 'Risk Score tab', 'Validation Report', 'engine.unified_scores (stale)', '0%', 'v_migration_stability_score (stability, not risk)', '40%', 'BLOCKED — needs v_batch_risk_index', 'YES — v_batch_risk_index'],
    [3, 'Activity Feed', 'Dashboard', 'engine.migration_control_execution', '95%', 'Same source', '95%', 'RESTORE (trace points to deprecated audit_log)', 'No'],
]
for r, row_data in enumerate(data1, 5):
    for c, val in enumerate(row_data, 1):
        ws1.cell(row=r, column=c, value=val)
        style_data_cell(ws1, r, c)

auto_width(ws1, len(headers1))

# Sheet 2: Migration Score Detail
ws2 = wb.create_sheet('Migration Score Detail')
ws2['A1'] = 'Component 1: Migration Score Tile — Detailed Analysis'
ws2['A1'].font = subtitle_font
ws2.merge_cells('A1:F1')

headers2 = ['Aspect', 'Detail', 'Data', 'Relevance %', 'Notes']
for i, h in enumerate(headers2, 1):
    ws2.cell(row=3, column=i, value=h)
style_header_row(ws2, 3, len(headers2))

data2 = [
    ['Frozen Source', 'engine.unified_scores', '58 rows, ALL sub-scores NULL, final_score=81.9125 (flat)', '0%', 'Stale placeholder — no MAP CLI writer, no Python INSERT trace'],
    ['Frozen Sub-scores', 'matching_score, fk_score, profiling_score, graph_score', 'All NULL for all 58 rows', '0%', 'Migration Score tile needs sub-score breakdown — none available'],
    ['Frozen Data Freshness', 'created_at', 'April 2026', '0%', 'No updates since April 2026 — table frozen/stale'],
    ['MVP Source', 'engine.unified_scores (same)', 'Same 58 rows, same stale data', '0%', 'MVP serves identical data via same API endpoint'],
    ['Alternative: migration_score_summary', 'engine.migration_score_summary', 'Correct schema but 0 rows (DDL executed, never populated)', '0% (empty)', 'Schema has batch_id, project_id, rule_score, discovery_score, matching_score, relationship_score, profiling_score, overall_score — exactly the right structure'],
    ['Alternative: migration_score_details', 'engine.migration_score_details', 'Correct schema but 0 rows', '0% (empty)', 'Schema has batch_id, score_type, entity_name, score, confidence, metadata — correct but empty'],
    ['Alternative: v_migration_score_trend', 'engine.v_migration_score_trend', 'batch_id, execution_start, overall_status, overall_score, rolling_5_batch_avg — 200+ rows', '70%', 'Has per-batch overall_score and trend data but missing sub-score breakdown'],
    ['Alternative: migration_validation_batch', 'engine.migration_validation_batch', 'batch_id, execution_start, execution_end, overall_status, overall_score, project_id — 21 rows', '60%', 'Has per-batch score but limited to 21 rows (limited batch history)'],
    ['Alternative: v_migration_health_dashboard', 'engine.v_migration_health_dashboard', 'batch_id, project_id, batch_start_time, total_controls, completion_percent, migration_status', '30%', 'Has completion % and status but no score breakdown'],
    ['Verdict', '—', 'No existing view is sufficient', '—', 'New view v_migration_score_summary required — see Sheet 5'],
]
for r, row_data in enumerate(data2, 4):
    for c, val in enumerate(row_data, 1):
        ws2.cell(row=r, column=c, value=val)
        style_data_cell(ws2, r, c)

auto_width(ws2, len(headers2))

# Sheet 3: Risk Score Detail
ws3 = wb.create_sheet('Risk Score Detail')
ws3['A1'] = 'Component 2: Risk Score Tab — Detailed Analysis'
ws3['A1'].font = subtitle_font
ws3.merge_cells('A1:F1')

headers3 = ['Aspect', 'Detail', 'Data', 'Relevance %', 'Notes']
for i, h in enumerate(headers3, 1):
    ws3.cell(row=3, column=i, value=h)
style_header_row(ws3, 3, len(headers3))

data3 = [
    ['Frozen Source', 'engine.unified_scores', '58 rows, all NULL sub-scores, flat final_score=81.9125', '0%', 'Not a risk score — same stale table as Migration Score'],
    ['Current Repo Source', 'engine.v_migration_stability_score', 'batch_id, total_rules, passed_rules, stability_score (pass rate %)', '40%', 'Stability metric (pass rate), NOT a risk metric. High stability = low risk, but UI says "Risk Score" — semantics inverted. No FAIL/ERROR weighting.'],
    ['MVP Source', 'v_migration_stability_score (same)', 'Same stability data', '40%', 'MVP also reads from this view — same semantic issue'],
    ['Best Alternative: v_dataset_risk_index', 'engine.v_dataset_risk_index', 'entity_name, total_rules, risk_points, risk_index (0.0–1.0 scale)', '80%', 'Uses correct risk scoring (FAIL=1, ERROR=2). Only issue: groups by entity, not batch_id'],
    ['Alternative: v_batch_governance_summary', 'engine.v_batch_governance_summary', 'batch_id, total_rules, passed, failed, errors — 451 rows', '75%', 'Has per-batch fail/error counts but no risk_index computation'],
    ['Alternative: v_migration_score_trend', 'engine.v_migration_score_trend', 'batch_id, overall_score, rolling_5_batch_avg', '55%', 'Has per-batch score but not a risk score'],
    ['Alternative: migration_risk_scores (table)', 'engine.migration_risk_scores', 'DDL exists but table was never created — relation does not exist', '0%', 'Wrong table state — DDL was never executed'],
    ['Alternative: migration_control_execution (raw)', 'engine.migration_control_execution', 'batch_id, rule_id, entity_name, execution_status — 7400 rows', '85%', 'Raw data with everything needed but no pre-computed risk metric'],
    ['Verdict', '—', 'v_dataset_risk_index is best alternative but per-entity not per-batch', '—', 'New view v_batch_risk_index required — see Sheet 5'],
]
for r, row_data in enumerate(data3, 4):
    for c, val in enumerate(row_data, 1):
        ws3.cell(row=r, column=c, value=val)
        style_data_cell(ws3, r, c)

auto_width(ws3, len(headers3))

# Sheet 4: Alternatives Comparison
ws4 = wb.create_sheet('Alternatives Comparison')
ws4['A1'] = 'View/Source Alternatives — Relevance Comparison'
ws4['A1'].font = subtitle_font
ws4.merge_cells('A1:H1')

headers4 = ['View/Source', 'Type', 'Key Columns', 'Rows', 'Risk Score Fit', 'Migration Score Fit', 'Activity Feed Fit', 'Overall Relevance']
for i, h in enumerate(headers4, 1):
    ws4.cell(row=3, column=i, value=h)
style_header_row(ws4, 3, len(headers4))

data4 = [
    ['engine.unified_scores', 'BASE TABLE (DEPRECATED)', 'batch_id, final_score (all NULL sub-scores)', '58', '0%', '0%', 'N/A', '0%'],
    ['v_migration_stability_score', 'VIEW', 'batch_id, total_rules, passed_rules, stability_score', '451', '40%', '30%', 'N/A', '35%'],
    ['v_dataset_risk_index', 'VIEW', 'entity_name, total_rules, risk_points, risk_index', '3', '80%', '20%', 'N/A', '45%'],
    ['v_dataset_risk_heatmap', 'VIEW', 'dataset_name, total_rules_executed, failed_rules, failure_rate_percent', '3', '60%', '15%', 'N/A', '35%'],
    ['v_migration_score_trend', 'VIEW', 'batch_id, overall_score, rolling_5_batch_avg', '200+', '55%', '70%', 'N/A', '60%'],
    ['v_migration_health_dashboard', 'VIEW', 'batch_id, project_id, completion_percent, migration_status', '550', '30%', '30%', 'N/A', '25%'],
    ['v_batch_governance_summary', 'VIEW', 'batch_id, total_rules, passed, failed, errors', '451', '75%', '50%', '85%', '65%'],
    ['engine.migration_control_execution', 'BASE TABLE', 'batch_id, rule_id, entity_name, execution_status, ...', '7400', '85%', '75%', '95%', '80%'],
    ['engine.migration_batch_registry', 'BASE TABLE', 'batch_id, batch_status, project_id, ...', '550', '10%', '20%', 'N/A', '12%'],
    ['engine.migration_validation_batch', 'BASE TABLE', 'batch_id, execution_start, overall_status, overall_score', '21', '60%', '60%', 'N/A', '45%'],
    ['engine.migration_release_decision', 'BASE TABLE', 'batch_id, gate_result, overall_score', '13', 'N/A', 'N/A', 'N/A', 'Specialized'],
    ['engine.migration_control_summary', 'BASE TABLE', 'batch_id, control_id, overall_status, passed_rules', '3688', 'N/A', 'N/A', '80%', 'Specialized'],
    ['engine.migration_score_summary (empty table)', 'BASE TABLE (empty)', 'batch_id, project_id, rule_score, discovery_score...', '0', '0%', '0%', 'N/A', '0% (schema OK)'],
    ['engine.migration_score_details (empty table)', 'BASE TABLE (empty)', 'batch_id, score_type, entity_name, score', '0', '0%', '0%', 'N/A', '0% (schema OK)'],
    ['v_batch_risk_index (PROPOSED NEW)', 'NEW VIEW', 'batch_id, total_rules, risk_points, risk_index, failure_rate%, pass_rate%', '(computed)', '100%', '40%', 'N/A', 'High for Risk Score'],
    ['v_migration_score_summary (PROPOSED NEW)', 'NEW VIEW', 'batch_id, execution_start, overall_score, passed, failed, error, risk_index, pass_rate%', '(computed)', '60%', '95%', 'N/A', 'High for Migration Score'],
]
for r, row_data in enumerate(data4, 4):
    for c, val in enumerate(row_data, 1):
        ws4.cell(row=r, column=c, value=val)
        style_data_cell(ws4, r, c)

auto_width(ws4, len(headers4))

# Sheet 5: New Views SQL
ws5 = wb.create_sheet('New Views SQL')
ws5['A1'] = 'Proposed New Views (Analysis Only — No Code Changes)'
ws5['A1'].font = subtitle_font
ws5.merge_cells('A1:C1')

headers5 = ['View Name', 'Purpose', 'SQL Definition']
for i, h in enumerate(headers5, 1):
    ws5.cell(row=3, column=i, value=h)
style_header_row(ws5, 3, len(headers5))

view1_sql = """CREATE OR REPLACE VIEW engine.v_batch_risk_index AS
SELECT
    batch_id,
    count(*) AS total_rules,
    sum(CASE WHEN execution_status = 'PASS' THEN 0
             WHEN execution_status = 'FAIL' THEN 1
             WHEN execution_status = 'ERROR' THEN 2
             ELSE NULL::integer END) AS risk_points,
    round(
        (sum(CASE WHEN execution_status = 'PASS' THEN 0
                  WHEN execution_status = 'FAIL' THEN 1
                  WHEN execution_status = 'ERROR' THEN 2
                  ELSE NULL::integer END))::numeric / count(*), 2
    ) AS risk_index,
    round(
        (sum(CASE WHEN execution_status IN ('FAIL','ERROR') THEN 1 ELSE 0 END))::numeric
        / count(*) * 100, 2
    ) AS failure_rate_percent,
    round(
        (sum(CASE WHEN execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric
        / NULLIF(count(*), 0) * 100, 2
    ) AS pass_rate_percent
FROM engine.migration_control_execution
WHERE batch_id IS NOT NULL
GROUP BY batch_id
ORDER BY risk_index DESC;"""

view2_sql = """CREATE OR REPLACE VIEW engine.v_migration_score_summary AS
SELECT
    msb.batch_id,
    msb.execution_start,
    msb.execution_end,
    msb.overall_status,
    msb.overall_score,
    msb.project_id,
    COUNT(mce.rule_id) AS total_rules,
    SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END) AS passed_rules,
    SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1 ELSE 0 END) AS failed_rules,
    SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END) AS error_rules,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'FAIL' THEN 1
                  WHEN mce.execution_status = 'ERROR' THEN 2
                  ELSE 0 END))::numeric / NULLIF(COUNT(*), 0), 2
    ) AS risk_index,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'PASS' THEN 1 ELSE 0 END))::numeric
        / NULLIF(COUNT(*), 0) * 100, 2
    ) AS pass_rate_percent,
    ROUND(
        (SUM(CASE WHEN mce.execution_status = 'ERROR' THEN 1 ELSE 0 END))::numeric
        / NULLIF(COUNT(*), 0) * 100, 2
    ) AS error_rate_percent
FROM engine.migration_validation_batch msb
LEFT JOIN engine.migration_control_execution mce
    ON msb.batch_id = mce.batch_id
WHERE msb.batch_id IS NOT NULL
GROUP BY msb.batch_id, msb.execution_start, msb.execution_end,
    msb.overall_status, msb.overall_score, msb.project_id
ORDER BY msb.execution_start DESC;"""

ws5.cell(row=4, column=1, value='v_batch_risk_index')
ws5.cell(row=4, column=2, value='Per-batch risk scoring replacing engine.unified_scores for Risk Score tab')
ws5.cell(row=4, column=3, value=view1_sql)
style_data_cell(ws5, 4, 1)
style_data_cell(ws5, 4, 2)
style_data_cell(ws5, 4, 3)
ws5.row_dimensions[4].height = 200

ws5.cell(row=6, column=1, value='v_migration_score_summary')
ws5.cell(row=6, column=2, value='Per-batch migration score summary replacing engine.unified_scores for Migration Score tile')
ws5.cell(row=6, column=3, value=view2_sql)
style_data_cell(ws5, 6, 1)
style_data_cell(ws5, 6, 2)
style_data_cell(ws5, 6, 3)
ws5.row_dimensions[6].height = 200

ws5.column_dimensions['A'].width = 30
ws5.column_dimensions['B'].width = 50
ws5.column_dimensions['C'].width = 120

# Sheet 6: Data Samples
ws6 = wb.create_sheet('Data Samples')
ws6['A1'] = 'Live Database Data Samples'
ws6['A1'].font = subtitle_font
ws6.merge_cells('A1:E1')

# unified_scores
ws6['A3'] = 'engine.unified_scores (sample)'
ws6['A3'].font = Font(bold=True)
ws6['A4'] = 'batch_id | matching_score | fk_score | profiling_score | graph_score | final_score'
ws6['A5'] = '88742b02... | NULL | NULL | NULL | NULL | 81.9125 (stale, same for all 58 rows)'

# control_execution by status
ws6['A7'] = 'engine.migration_control_execution (status breakdown)'
ws6['A7'].font = Font(bold=True)
ws6['A8'] = 'ERROR: 2087 | FAIL: 443 | PASS: 4870 | Total: 7400'

# stability score
ws6['A10'] = 'engine.v_migration_stability_score (sample)'
ws6['A10'].font = Font(bold=True)
ws6['A11'] = 'batch_id | total_rules | passed_rules | stability_score'
ws6['A12'] = 'fe4d7059... | 20 | 0 | 0.00'
ws6['A13'] = 'fddb7eb0... | 19 | 17 | 89.47'
ws6['A14'] = 'fcf285e0... | 7 | 7 | 100.00'

# dataset risk index
ws6['A16'] = 'engine.v_dataset_risk_index (sample)'
ws6['A16'].font = Font(bold=True)
ws6['A17'] = 'entity_name | total_rules | risk_points | risk_index'
ws6['A18'] = 'public.accounts_source | 2236 | 1640 | 0.73'
ws6['A19'] = 'public.balances_source | 2717 | 1693 | 0.62'
ws6['A20'] = 'public.customer_accounts_source | 2447 | 1284 | 0.52'

# batch governance summary
ws6['A22'] = 'engine.v_batch_governance_summary (sample)'
ws6['A22'].font = Font(bold=True)
ws6['A23'] = 'batch_id | total_rules | passed | failed | errors'
ws6['A24'] = 'b40692e8... | 19 | 16 | 3 | 0'
ws6['A25'] = '60c6c3fd... | 19 | 16 | 3 | 0'

# batch_registry
ws6['A27'] = 'engine.migration_batch_registry (status breakdown)'
ws6['A27'].font = Font(bold=True)
ws6['A28'] = 'COMPLETED: majority | 550 total batches'

# release decisions
ws6['A30'] = 'engine.migration_release_decision (sample)'
ws6['A30'].font = Font(bold=True)
ws6['A31'] = 'id | batch_id | gate_result | overall_score | reason'
ws6['A32'] = '1 | 8780c73b... | REJECTED | 67.05 | Score 67.05 below threshold 80'
ws6['A33'] = '3 | 84ff530c... | REJECTED | 84.09 | Blocked due to batch status: ERROR'

ws6.column_dimensions['A'].width = 35
ws6.column_dimensions['B'].width = 30
ws6.column_dimensions['C'].width = 40
ws6.column_dimensions['D'].width = 30
ws6.column_dimensions['E'].width = 30

xlsx_path = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\engineering\MAP_V2\00_Architecture\Verification\00_outputs\utilities\phase_09_Frontend_Architecture\research\09_Component_Source_Analysis.xlsx'
wb.save(xlsx_path)
print(f'Saved to {xlsx_path}')