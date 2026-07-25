"""
Runtime Lineage Tracer - Captures all SQL queries during MAP CLI execution
"""
import re
import sys
import logging
from collections import defaultdict
from datetime import datetime

# Enable query logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger('runtime_lineage')

# Store for captured queries
captured_queries = []
table_access = defaultdict(lambda: {'SELECT': 0, 'INSERT': 0, 'UPDATE': 0, 'DELETE': 0, 'OTHER': 0})

def extract_tables_from_query(query):
    """Extract table names from SQL query"""
    tables = set()
    query_upper = query.upper()
    
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
    import app.db_connector
    import app.db.connection
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
            'query': query_str[:500],  # Truncate long queries
            'type': query_type,
            'tables': list(tables)
        })
        
        # Log to stderr for real-time monitoring
        print(f"[SQL] {query_type} -> {tables}", file=sys.stderr)
        
        # Call original
        return original_execute(self, query, params)
    
    DBConnector.execute = traced_execute
    logger.info("DBConnector patched for query tracing")

def print_lineage_report():
    """Print the final lineage report"""
    print("\n" + "="*80)
    print("RUNTIME LINEAGE REPORT")
    print("="*80)
    print(f"Total queries captured: {len(captured_queries)}")
    print(f"Total tables accessed: {len(table_access)}")
    print()
    
    # Print table access summary
    print("TABLE ACCESS SUMMARY:")
    print("-"*80)
    print(f"{'Table':<50} {'SELECT':<10} {'INSERT':<10} {'UPDATE':<10} {'DELETE':<10}")
    print("-"*80)
    
    for table in sorted(table_access.keys()):
        access = table_access[table]
        print(f"{table:<50} {access['SELECT']:<10} {access['INSERT']:<10} {access['UPDATE']:<10} {access['DELETE']:<10}")
    
    print("-"*80)
    print()

if __name__ == "__main__":
    # This module is imported to patch DBConnector
    patch_db_connector()