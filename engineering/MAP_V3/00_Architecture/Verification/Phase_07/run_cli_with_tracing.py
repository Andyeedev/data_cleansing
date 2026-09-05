"""
Run MAP CLI with Runtime Lineage Tracing
"""
import sys
import os
import re
from collections import defaultdict
from datetime import datetime

# Add project root to path
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
    
    # Now run the CLI
    from app.main import run_engine
    from app.config_loader import load_config
    
    print("="*80)
    print("MAP CLI RUNTIME LINEAGE TRACE")
    print("="*80)
    print()
    
    # Load config
    config_path = r'C:\Users\devwork\Desktop\projects\Financial_services_Migration_product\ver1.4\fs-migration-validation-engine\config.yaml'
    config = load_config(config_path)
    
    print(f"Project ID: {config.get('project_id')}")
    print(f"Engine DB: {config.get('engine_db', {}).get('database')}")
    print(f"Source DB: {config.get('source_db', {}).get('database')}")
    print(f"Target DB: {config.get('target_db', {}).get('database')}")
    print()
    
    # Run engine
    try:
        print("Starting MAP CLI execution...")
        run_engine(config_path)
        print("MAP CLI execution completed.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    
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