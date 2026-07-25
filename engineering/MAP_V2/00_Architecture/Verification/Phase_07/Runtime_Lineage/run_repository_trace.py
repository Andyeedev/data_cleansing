"""
Runtime Lineage Trace - Execute all repository methods and capture table access
"""
import sys
import re
from collections import defaultdict
from datetime import datetime

sys.path.insert(0, r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine')

# Store for captured queries
captured_queries = []
table_access = defaultdict(lambda: {'SELECT': 0, 'INSERT': 0, 'UPDATE': 0, 'DELETE': 0, 'OTHER': 0})

def extract_tables_from_query(query):
    """Extract table names from SQL query"""
    tables = set()
    
    # Pattern for FROM clause
    from_pattern = r'FROM\s+["\']?(\w+(?:\.\w+)?)["\']?'
    for match in re.finditer(from_pattern, query, re.IGNORECASE):
        table = match.group(1).strip('"').strip("'")
        tables.add(table)
    
    # Pattern for INTO clause
    into_pattern = r'INTO\s+["\']?(\w+(?:\.\w+)?)["\']?'
    for match in re.finditer(into_pattern, query, re.IGNORECASE):
        table = match.group(1).strip('"').strip("'")
        tables.add(table)
    
    # Pattern for UPDATE clause
    update_pattern = r'UPDATE\s+["\']?(\w+(?:\.\w+)?)["\']?'
    for match in re.finditer(update_pattern, query, re.IGNORECASE):
        table = match.group(1).strip('"').strip("'")
        tables.add(table)
    
    # Pattern for JOIN clause
    join_pattern = r'JOIN\s+["\']?(\w+(?:\.\w+)?)["\']?'
    for match in re.finditer(join_pattern, query, re.IGNORECASE):
        table = match.group(1).strip('"').strip("'")
        tables.add(table)
    
    return tables

def get_query_type(query):
    """Determine query type"""
    query_upper = query.strip().upper()
    if query_upper.startswith('SELECT'):
        return 'SELECT'
    elif query_upper.startswith('INSERT'):
        return 'INSERT'
    elif query_upper.startswith('UPDATE'):
        return 'UPDATE'
    elif query_upper.startswith('DELETE'):
        return 'DELETE'
    else:
        return 'OTHER'

def patch_db_connector():
    """Patch DBConnector to capture all queries"""
    from app.db_connector import DBConnector
    
    original_execute = DBConnector.execute
    
    def traced_execute(self, query, params=None):
        """Traced execute method"""
        try:
            query_str = query % params if params else query
        except:
            query_str = str(query)
        
        # Extract tables and query type
        tables = extract_tables_from_query(query_str)
        query_type = get_query_type(query_str)
        
        # Record access
        for table in tables:
            table_access[table][query_type] += 1
        
        # Store query
        captured_queries.append({
            'timestamp': datetime.now().isoformat(),
            'query': query_str[:500],
            'type': query_type,
            'tables': list(tables)
        })
        
        return original_execute(self, query, params)
    
    DBConnector.execute = traced_execute
    print("[TRACER] DBConnector patched for query tracing")

def run_all_repository_methods():
    """Execute all repository methods and capture table access"""
    from app.repositories.dashboard_repository import DashboardRepository
    from app.repositories.monitoring_repository import MonitoringRepository
    from app.repositories.governance_repository import GovernanceRepository
    from app.repositories.validation_report_repository import ValidationReportRepository
    from app.repositories.execution_control_repository import ExecutionControlRepository
    from app.repositories.execution_history_repository import ExecutionHistoryRepository
    from app.repositories.rule_execution_repository import RuleExecutionRepository
    
    print("\n" + "="*80)
    print("EXECUTING ALL REPOSITORY METHODS")
    print("="*80)
    
    # Dashboard Repository
    print("\n[1/7] DashboardRepository")
    try:
        repo = DashboardRepository()
        print("  - get_system_count()")
        repo.get_system_count()
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print("  - get_batch_stats()")
        repo.get_batch_stats()
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print("  - get_total_controls()")
        repo.get_total_controls()
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print("  - get_recent_activity()")
        repo.get_recent_activity(5)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    # Monitoring Repository
    print("\n[2/7] MonitoringRepository")
    try:
        repo = MonitoringRepository()
        print("  - get_execution_stats()")
        repo.get_execution_stats()
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print("  - get_queue_items()")
        repo.get_queue_items(5)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print("  - get_recent_executions()")
        repo.get_recent_executions(5)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    # Governance Repository
    print("\n[3/7] GovernanceRepository")
    try:
        repo = GovernanceRepository()
        print("  - get_audit_entries()")
        repo.get_audit_entries(5)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print("  - get_pending_approvals()")
        repo.get_pending_approvals()
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print("  - get_exception_requests()")
        repo.get_exception_requests()
    except Exception as e:
        print(f"  ERROR: {e}")
    
    # Validation Report Repository
    print("\n[4/7] ValidationReportRepository")
    try:
        repo = ValidationReportRepository()
        # Get a valid batch_id first
        import psycopg2
        conn = psycopg2.connect(host='127.0.0.1', port=5432, database='migration_engine', user='postgres', password='********')
        cur = conn.cursor()
        cur.execute('SELECT batch_id FROM engine.migration_validation_batch LIMIT 1')
        row = cur.fetchone()
        batch_id = row[0] if row else 'test-batch'
        conn.close()
        
        print(f"  - get_batch_info({batch_id[:8]}...)")
        repo.get_batch_info(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_control_summaries({batch_id[:8]}...)")
        repo.get_control_summaries(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_governance_decision({batch_id[:8]}...)")
        repo.get_governance_decision(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_risk_score({batch_id[:8]}...)")
        repo.get_risk_score(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_exceptions({batch_id[:8]}...)")
        repo.get_exceptions(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_batch_score({batch_id[:8]}...)")
        repo.get_batch_score(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    # Execution Control Repository
    print("\n[5/7] ExecutionControlRepository")
    try:
        repo = ExecutionControlRepository()
        print(f"  - get_batch_status({batch_id[:8]}...)")
        repo.get_batch_status(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_lifecycle_events({batch_id[:8]}...)")
        repo.get_lifecycle_events(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_progress({batch_id[:8]}...)")
        repo.get_progress(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    # Execution History Repository
    print("\n[6/7] ExecutionHistoryRepository")
    try:
        repo = ExecutionHistoryRepository()
        print("  - get_execution_history()")
        repo.get_execution_history(limit=5)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_execution_detail({batch_id[:8]}...)")
        repo.get_execution_detail(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    # Rule Execution Repository
    print("\n[7/7] RuleExecutionRepository")
    try:
        repo = RuleExecutionRepository()
        print(f"  - get_rules_by_batch({batch_id[:8]}...)")
        repo.get_rules_by_batch(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")
    
    try:
        print(f"  - get_execution_results({batch_id[:8]}...)")
        repo.get_execution_results(batch_id)
    except Exception as e:
        print(f"  ERROR: {e}")

def print_lineage_report():
    """Print the final lineage report"""
    print("\n" + "="*80)
    print("RUNTIME LINEAGE REPORT")
    print("="*80)
    print(f"Total queries captured: {len(captured_queries)}")
    print(f"Total tables accessed: {len(table_access)}")
    print()
    
    print("TABLE ACCESS SUMMARY:")
    print("-"*80)
    print(f"{'Table':<50} {'SELECT':<10} {'INSERT':<10} {'UPDATE':<10} {'DELETE':<10}")
    print("-"*80)
    
    for table in sorted(table_access.keys()):
        access = table_access[table]
        print(f"{table:<50} {access['SELECT']:<10} {access['INSERT']:<10} {access['UPDATE']:<10} {access['DELETE']:<10}")
    
    print("-"*80)

if __name__ == "__main__":
    # Patch DBConnector
    patch_db_connector()
    
    print("="*80)
    print("MAP CLI RUNTIME LINEAGE TRACE")
    print("="*80)
    print()
    
    # Run all repository methods
    run_all_repository_methods()
    
    # Print lineage report
    print_lineage_report()
    
    # Save detailed report
    import json
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'total_queries': len(captured_queries),
        'tables_accessed': len(table_access),
        'table_summary': {k: dict(v) for k, v in table_access.items()},
        'queries': captured_queries
    }
    
    report_path = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\engineering\MAP_V2\00_Architecture\Verification\Phase_07\runtime_lineage_output.json'
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\nDetailed report saved to: {report_path}")