def load_constraints_legacy(conn, schema, table):

    query = """
    SELECT 
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE tc.table_schema = %s
      AND tc.table_name = %s;
    """
    print("Schema is : ", schema, " , Table is : ", table, " , Query is : ", query, " , Connection is : ", conn)
    pk_columns = set()
    fk_map = {}

    with conn.cursor() as cur:
        cur.execute(query, (schema, table))
        
        for constraint_type, col, ref_table, ref_col in cur.fetchall():
            print("Column is : ", col, " , Constraint Type is : ", constraint_type, " , Ref Table is : ", ref_table, " , Ref Column is : ", ref_col)
            if constraint_type == "PRIMARY KEY":
                pk_columns.add(col)

            elif constraint_type == "FOREIGN KEY":
                fk_map[col] = {
                    "table": ref_table,
                    "column": ref_col
                }
            
            
    return pk_columns, fk_map



def load_constraints(conn, schema, table):

    query = """
    SELECT
        con.contype,
        att.attname AS column_name,
        confrel.relname AS foreign_table,
        confatt.attname AS foreign_column
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    JOIN unnest(con.conkey) AS colnum(attnum) ON TRUE
    JOIN pg_attribute att 
        ON att.attrelid = rel.oid AND att.attnum = colnum.attnum
    LEFT JOIN pg_class confrel 
        ON confrel.oid = con.confrelid
    LEFT JOIN unnest(con.confkey) AS confcol(attnum) ON TRUE
    LEFT JOIN pg_attribute confatt 
        ON confatt.attrelid = confrel.oid AND confatt.attnum = confcol.attnum
    WHERE nsp.nspname = %s
      AND rel.relname = %s;
    """

    pk_columns = set()
    fk_map = {}

    with conn.cursor() as cur:
        cur.execute(query, (schema, table))

        for contype, col, ref_table, ref_col in cur.fetchall():
            print("schema name is: ",schema,"table name is: ",table,"Column is : ", col, " , Constraint Type is : ", contype, " , Ref Table is : ", ref_table, " , Ref Column is : ", ref_col)
            # PRIMARY KEY
            if contype == "p":
                pk_columns.add(col)

            # FOREIGN KEY
            elif contype == "f":
                fk_map[col] = {
                    "table": ref_table,
                    "column": ref_col
                }

    return pk_columns, fk_map