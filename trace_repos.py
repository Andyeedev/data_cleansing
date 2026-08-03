import os, re

repos_to_trace = {
    'validation_report_repository.py': 'get_risk_score',
    'dashboard_repository.py': 'get_portfolio_summary,get_kpis,get_recent_activity,get_batch_stats,get_total_controls,get_system_count',
    'execution_history_repository.py': 'get_execution_history,get_execution_detail,get_control_executions,get_control_summaries',
    'governance_repository.py': 'get_audit_entries,get_exception_requests,get_pending_approvals,get_governance',
    'execution_repository.py': 'get_batch_status,get_progress',
    'rule_execution_repository.py': 'get_batch_status,get_rules_by_batch',
}

base = 'app/repositories'
for fname, methods in repos_to_trace.items():
    full = os.path.join(base, fname)
    if not os.path.exists(full):
        print(f'{fname}: NOT FOUND')
        continue
    content = open(full, 'r', encoding='utf-8', errors='ignore').read()
    method_list = [m.strip() for m in methods.split(',') if m.strip()]
    print(f'=== {fname} ===')
    for method in method_list:
        pattern = rf'def {method}\s*\([^)]*\).*?(?=\n    def |\nclass |\Z)'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            method_code = match.group(0)[:1000]
            print(f'  --- {method} ---')
            for line in method_code.split('\n'):
                s = line.strip()
                if any(kw in s.lower() for kw in ['select', 'from', 'join', 'where', 'engine.', 'sql', 'text=', 'query', 'execute', 'raw', 'view']):
                    print(f'    {s[:150]}')
        else:
            print(f'  {method}: NOT FOUND in file')
    print()