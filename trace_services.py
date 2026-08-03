import os, re

# Key services to trace to their repositories
services = [
    'app/services/dashboard_service.py',
    'app/services/validation_report_service.py',
    'app/services/execution_history_service.py',
    'app/services/execution_service.py',
    'app/services/governance_service.py',
    'app/services/monitoring_service.py',
    'app/services/execution_control_service.py',
    'app/services/rule_execution_service.py',
    'app/services/discovery_service_api.py',
    'app/services/approval_service.py',
    'app/services/notification_service.py',
    'app/services/calendar_service.py',
    'app/services/task_service.py',
    'app/services/system_service.py',
    'app/services/role_service.py',
    'app/services/user_service.py',
    'app/services/settings_service.py',
    'app/services/workflow_service.py',
    'app/services/export_service.py',
]

base = '.'
for svc in services:
    full = os.path.join(base, svc)
    if not os.path.exists(full):
        continue
    content = open(full, 'r', encoding='utf-8', errors='ignore').read()
    # Find repository/service calls
    repo_calls = set()
    for line in content.split('\n'):
        line_stripped = line.strip()
        if '.get_' in line_stripped or '.find_' in line_stripped or '.list_' in line_stripped or '.query_' in line_stripped:
            if 'repository' in line_stripped.lower() or 'repo' in line_stripped.lower():
                repo_calls.add(line_stripped[:150])
    if repo_calls:
        print(f'=== {svc} ===')
        for call in sorted(repo_calls):
            print(f'  {call}')
        print()