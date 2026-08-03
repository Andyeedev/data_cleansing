import os

routes = {
    'approval_routes.py': '/api/v1/approvals',
    'calendar_routes.py': '/api/v1/calendar',
    'dashboard_routes.py': '/api/v1/dashboard',
    'discovery_routes.py': '/api/v1/discovery',
    'execution_control_routes.py': '/api/v1/execution',
    'execution_history_routes.py': '/api/v1/execution',
    'execution_routes.py': '/api/v1/execution',
    'export_routes.py': '/api/v1/execution/export',
    'governance_routes.py': '/api/v1/governance',
    'monitoring_routes.py': '/api/v1/monitoring',
    'navigation_routes.py': '/api/v1/navigation',
    'notification_routes.py': '/api/v1/notifications',
    'role_routes.py': '/api/v1/roles',
    'rule_execution_routes.py': '/api/v1/execution',
    'settings_routes.py': '/api/v1/settings',
    'system_routes.py': '/api/v1/systems',
    'task_routes.py': '/api/v1/tasks',
    'user_routes.py': '/api/v1/users',
    'validation_report_routes.py': '/api/v1/execution',
    'workflow_routes.py': '/api/v1/workflows',
}

base = 'app/api/routes'
for fname in sorted(routes.keys()):
    path = os.path.join(base, fname)
    if not os.path.exists(path):
        continue
    content = open(path, 'r', encoding='utf-8', errors='ignore').read()
    repo_calls = set()
    for line in content.split('\n'):
        line = line.strip()
        if '.get_' in line or '.find_' in line or '.list_' in line or '.query_' in line or 'repository' in line.lower() or 'service' in line.lower():
            repo_calls.add(line[:120])
    print(f'=== {fname} ({routes[fname]}) ===')
    for call in sorted(repo_calls):
        if call.strip():
            print(f'  {call.strip()}')
    print()