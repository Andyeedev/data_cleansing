# app/services/discovery_service.py
from app.discovery.constraint_loader import load_constraints

class DiscoveryService:
    def __init__(self, connection_manager):
        """
        Pass in a ConnectionManager instance.
        """
        self.cm = connection_manager

    def list_tables(self, system_id, schema="public"):
        """
        Return a list of table names for the given system and schema.
        """
        conn = self.cm.get_connection(system_id)
        self.debug_current_user(conn)

        query = """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = %s
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """
        with conn.cursor() as cur:
            cur.execute(query, (schema,))
            tables = [row[0] for row in cur.fetchall()]
        return tables

    def describe_table(self, system_id, table_name, schema="public"):
        """
        Return column names and types for a given table.
        """
        conn = self.cm.get_connection(system_id)
        self.debug_current_user(conn)
        query = """
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = %s
            AND table_name = %s
            ORDER BY ordinal_position;
        """
        with conn.cursor() as cur:
            cur.execute(query, (schema, table_name))
            columns = [{"name": row[0], "type": row[1]} for row in cur.fetchall()]
        return columns
    

    def get_table_columns_legacy(self, system_id, table_name):
        conn = self.cm.get_connection(system_id)

        query = """
        SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = %s
        ORDER BY ordinal_position;
        """

        with conn.cursor() as cur:
            cur.execute(query, (table_name,))
            rows = cur.fetchall()
        
        columns = []
        for row in rows:
            columns.append({
                "column_name": row[0],
                "data_type": row[1],
                "is_nullable": row[2],
                "default": row[3]
            })

        return columns

    def get_table_columns(self, system_id, table_name):
        conn = self.cm.get_connection(system_id)

        schema = "public"  # 🔥 FIX: define schema explicitly

        query = """
        SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
             ordinal_position
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = %s
        ORDER BY ordinal_position;
        """

        with conn.cursor() as cur:
            cur.execute(query, (table_name,))
            rows = cur.fetchall()

        

        pk_columns, fk_map = load_constraints(conn, schema, table_name)
        #print("PK:", pk_columns)
        #print("FK:", fk_map)

        columns = []
        for row in rows:
            column_name = row[0]

            columns.append({
                "column_name": column_name,
                "data_type": row[1],
                "is_nullable": row[2] == "YES",  # 🔥 normalize to boolean
                "default": row[3],
                "ordinal_position": row[4],

                # 🔥 CRITICAL METADATA
                "is_primary_key": column_name in pk_columns,
                "is_foreign_key": column_name in fk_map,
                "references": fk_map.get(column_name)
            })

        return columns
    

    #🔥 Add Primary Key Detection
    def get_primary_keys(self, system_id, table_name):
        conn = self.cm.get_connection(system_id)

        query = """
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
        AND tc.table_name = %s
        AND tc.constraint_type = 'PRIMARY KEY';
        """

        with conn.cursor() as cur:
            cur.execute(query, (table_name,))
            rows = cur.fetchall()

        return [r[0] for r in rows]


    def debug_current_user(self, conn):
        with conn.cursor() as cur:
            cur.execute("SELECT current_user;")
            print("CONNECTED AS:", cur.fetchone()[0])


    def run_auto_discovery(self, system_id, project_id, repository, schema="public"):
        """
        Full discovery + injection pipeline
        """

        print(f"\n🚀 Running discovery for system: {system_id}")

        tables = self.list_tables(system_id, schema)
        print(f"Found {len(tables)} tables")

        for table_name in tables:

            # 1. Upsert dataset
            dataset_id = repository.upsert_dataset(
                project_id,
                system_id,
                schema,
                table_name
            )

            # 2. Get columns + PKs
            columns = self.get_table_columns(system_id, table_name)
            pk_columns = self.get_primary_keys(system_id, table_name)

            # 3. Normalize columns
            normalized_columns = []

            for idx, col in enumerate(columns, start=1):

                normalized_columns.append({
                    "column_name": col["column_name"],
                    "data_type": col["data_type"],
                    "ordinal_position": idx,
                    "is_nullable": True if col["is_nullable"] == "YES" else False,
                    "is_primary_key": col["column_name"] in pk_columns
                })

            # 4. Insert columns
            repository.insert_columns(dataset_id, normalized_columns)

            print(f"✔ Processed table: {table_name}")

        print("✅ Discovery + Injection complete")