"""Demo: Test DatasetDiscoveryService with MatchingEngine (mocked DB)"""
from unittest.mock import MagicMock, patch
from app.services.dataset_discovery_service import DatasetDiscoveryService
from app.adapters.sqlserver import TableInfo, ColumnInfo

# Mock database - return values for different queries
def mock_execute(query, params=None):
    if 'system_registry' in str(query):
        if 'SOURCE' in str(params):
            return [(1, 'SQL Source', '{"host":"src","database":"db1"}')]
        return [(2, 'SQL Target', '{"host":"tgt","database":"db2"}')]
    if 'dataset_mappings' in str(query):
        return [(42,)]  # mapping_id
    if 'rule_registry' in str(query):
        return [(1,), (2,)]  # rule_ids
    if 'rule_dataset_mapping' in str(query):
        return []
    return []

mock_db = MagicMock()
mock_db.execute.side_effect = mock_execute

# Source tables
src_tables = [
    TableInfo(table_name='customers', schema_name='dbo', table_type='BASE TABLE'),
    TableInfo(table_name='orders_source', schema_name='dbo', table_type='BASE TABLE'),
    TableInfo(table_name='payments', schema_name='dbo', table_type='BASE TABLE'),
]

# Target tables
tgt_tables = [
    TableInfo(table_name='customers', schema_name='dbo', table_type='BASE TABLE'),
    TableInfo(table_name='orders_target', schema_name='dbo', table_type='BASE TABLE'),
    TableInfo(table_name='transactions', schema_name='dbo', table_type='BASE TABLE'),
]

# Source columns
src_cols = {
    'dbo.customers': [
        ColumnInfo(column_name='id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='name', data_type='varchar', is_nullable=False),
    ],
    'dbo.orders_source': [
        ColumnInfo(column_name='id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='customer_id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='total', data_type='decimal', is_nullable=False),
    ],
    'dbo.payments': [
        ColumnInfo(column_name='id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='amount', data_type='decimal', is_nullable=False),
    ],
}

# Target columns
tgt_cols = {
    'dbo.customers': [
        ColumnInfo(column_name='id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='name', data_type='varchar', is_nullable=False),
    ],
    'dbo.orders_target': [
        ColumnInfo(column_name='id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='customer_id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='total', data_type='decimal', is_nullable=False),
    ],
    'dbo.transactions': [
        ColumnInfo(column_name='id', data_type='int', is_nullable=False),
        ColumnInfo(column_name='value', data_type='decimal', is_nullable=False),
    ],
}

with patch('app.services.dataset_discovery_service.SQLServerAdapter') as MockAdapter:
    mock_adapter = MagicMock()
    MockAdapter.return_value = mock_adapter

    mock_adapter.list_tables.side_effect = [src_tables, tgt_tables]

    call_count = {'n': 0}
    def list_columns(schema, table):
        call_count['n'] += 1
        # First 3 calls are source columns, next 3 are target
        # Then more calls from _create_mapping
        mapping = {
            ('dbo', 'customers'): src_cols['dbo.customers'],
            ('dbo', 'orders_source'): src_cols['dbo.orders_source'],
            ('dbo', 'payments'): src_cols['dbo.payments'],
            ('dbo', 'orders_target'): tgt_cols['dbo.orders_target'],
            ('dbo', 'transactions'): tgt_cols['dbo.transactions'],
        }
        return mapping.get((schema, table), tgt_cols['dbo.customers'])

    mock_adapter.list_columns.side_effect = list_columns

    with patch('app.services.dataset_discovery_service.CredentialService') as MockCred:
        MockCred.return_value.get_decrypted_credentials.return_value = {'username': 'u', 'password': 'p'}

        service = DatasetDiscoveryService(mock_db, 'proj-1')
        service.discover()

print()
print('=== DISCOVERED MAPPINGS ===')
for call in mock_db.execute.call_args_list:
    sql = call[0][0] if call[0] else ''
    params = call[0][1] if len(call[0]) > 1 else ''
    if 'INSERT INTO core.dataset_mappings' in str(sql):
        src = f'{params[3]}.{params[4]}'
        tgt = f'{params[6]}.{params[7]}'
        print(f'  {src} -> {tgt}')

print()
print('Expected:')
print('  dbo.customers -> dbo.customers (exact match, 100%)')
print('  dbo.orders_source -> dbo.orders_target (suffix match, 95%)')
print('  dbo.payments -> dbo.transactions (no match, below threshold)')
