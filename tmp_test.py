from app.db.connection import get_db_connection
db = get_db_connection()

default = 'aaf73536-2fd0-461e-87be-aa980cc1a8f1'

# Check all column_mappings for Default Tenant
r = db.execute("""
    SELECT cm.column_mapping_id, dm.source_table, dm.target_table,
           cm.match_status, cm.is_active, src_col.column_name, tgt_col.column_name,
           dc.column_id as src_col_id, tc.column_id as tgt_col_id
    FROM core.column_mappings cm
    JOIN core.dataset_mappings dm ON dm.mapping_id = cm.mapping_id
    JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
    LEFT JOIN core.dataset_columns src_col ON src_col.column_id = cm.source_column_id
    LEFT JOIN core.dataset_columns tgt_col ON tgt_col.column_id = cm.target_column_id
    LEFT JOIN core.discovered_columns dc ON dc.column_id = cm.source_column_id
    LEFT JOIN core.discovered_columns tc ON tc.column_id = cm.target_column_id
    WHERE sr.tenant_id = %s
    ORDER BY dm.source_table, src_col.column_position
""", (default,))
print(f"=== column_mappings for Default: {len(r)} rows ===")
for row in r:
    print(f"  [{row[3]}] {row[1]}.{row[5]} -> {row[6]} (src_id={row[7]}, tgt_id={row[8]})")

# Check what the pending rows look like in get_all_columns_with_pending
r2 = db.execute("""
    SELECT dm.mapping_id, dm.source_table, dm.target_table,
           cm.column_mapping_id, cm.match_status,
           src_col.column_name, tgt_col.column_name,
           dc.column_id as src_col_id, tc.column_id as tgt_col_id
    FROM core.dataset_mappings dm
    JOIN core.system_registry sr ON sr.system_id = dm.source_system_id
    JOIN core.column_mappings cm ON cm.mapping_id = dm.mapping_id
    LEFT JOIN core.dataset_columns src_col ON src_col.column_id = cm.source_column_id
    LEFT JOIN core.dataset_columns tgt_col ON tgt_col.column_id = cm.target_column_id
    LEFT JOIN core.discovered_columns dc ON dc.column_id = cm.source_column_id
    LEFT JOIN core.discovered_columns tc ON tc.column_id = cm.target_column_id
    WHERE sr.tenant_id = %s
    ORDER BY dm.source_table, src_col.column_position
""", (default,))
print(f"\n=== dataset_mappings with column_mappings for Default: {len(r2)} rows ===")
for row in r2:
    print(f"  [{row[3]}] {row[1]}.{row[5]} -> {row[6]} (status={row[4]})")
