from ..db_connector import DBConnector


class DatasetDiscoveryService:

    def __init__(self, engine_db, project_id):
        self.engine_db = engine_db
        self.project_id = project_id

    #🔥 Step 1 — Add Matching + Mapping Logic
    def discover(self):

        source_system = self._get_system("SOURCE")
        target_system = self._get_system("TARGET")

        source_db = DBConnector(self._normalise_config(source_system["connection_config"]))
        target_db = DBConnector(self._normalise_config(target_system["connection_config"]))

        source_tables = self._fetch_tables(source_db)
        target_tables = self._fetch_tables(target_db)

        print("Discovered source tables:", source_tables)
        print("Discovered target tables:", target_tables)

        matched = self._match_tables(source_tables, target_tables)

        for table in matched:
            self._create_mapping(
                source_system["system_id"],
                target_system["system_id"],
                table
            )

        print("Dataset discovery completed successfully.")
    # -----------------------------------------------------

    #🔥 Step 2 — Add _match_tables() Method
    def _match_tables(self, source_tables, target_tables):
        matched = []

        target_lookup = {t[1]: t for t in target_tables}

        for schema, source_table in source_tables:

            if source_table.endswith("_source"):
                base_name = source_table.replace("_source", "")
                target_name = base_name + "_target"

                if target_name in target_lookup:
                    matched.append({
                        "source_schema": schema,
                        "source_table": source_table,
                        "target_schema": target_lookup[target_name][0],
                        "target_table": target_name
                    })

        print("Matched tables:", matched)
        return matched


#🔥 Step 3 — Add _create_mapping() Method

    def _create_mapping_without_column_Mappin(self, source_system_id, target_system_id, table):

        insert_query = """
        INSERT INTO core.dataset_mappings (
            project_id,
            source_system_id,
            target_system_id,
            source_schema,
            source_table,
            target_schema,
            target_table,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s, NOW())
        """

        self.engine_db.execute(insert_query, (
            self.project_id,
            source_system_id,
            target_system_id,
            table["source_schema"],
            table["source_table"],
            table["target_schema"],
            table["target_table"]
        ))

        print(f"Created mapping for {table['source_table']}")




    #✅ Update _create_mapping() to include columns
    def _create_mapping_legacy(self, source_system_id, target_system_id, table):

        source_db = DBConnector(
            self._normalise_config(
                self._get_system("SOURCE")["connection_config"]
            )
        )

        target_db = DBConnector(
            self._normalise_config(
                self._get_system("TARGET")["connection_config"]
            )
        )

        source_columns = self._fetch_columns(
            source_db,
            table["source_schema"],
            table["source_table"]
        )

        target_columns = self._fetch_columns(
            target_db,
            table["target_schema"],
            table["target_table"]
        )

        insert_query = """
        INSERT INTO core.dataset_mappings (
            project_id,
            source_system_id,
            target_system_id,
            source_schema,
            source_table,
            source_columns,
            target_schema,
            target_table,
            target_columns,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
        ON CONFLICT DO NOTHING
        """

        mapping = self.engine_db.execute(insert_query, (
            self.project_id,
            source_system_id,
            target_system_id,
            table["source_schema"],
            table["source_table"],
            source_columns,
            table["target_schema"],
            table["target_table"],
            target_columns
        ))


        mapping_id = mapping[0][0]

        self._bind_default_rules(mapping_id)

        print(f"Created mapping with columns for {table['source_table']}")
    


    #🔁 Replace _create_mapping() with:
    def _create_mapping(self, source_system_id, target_system_id, table):

        source_system = self._get_system("SOURCE")
        target_system = self._get_system("TARGET")

        source_db = DBConnector(
            self._normalise_config(source_system["connection_config"])
        )

        target_db = DBConnector(
            self._normalise_config(target_system["connection_config"])
        )

        source_columns = self._fetch_columns(
            source_db,
            table["source_schema"],
            table["source_table"]
        )

        target_columns = self._fetch_columns(
            target_db,
            table["target_schema"],
            table["target_table"]
        )

        # 1️⃣ Try insert with RETURNING
        insert_query = """
        INSERT INTO core.dataset_mappings (
            project_id,
            source_system_id,
            target_system_id,
            source_schema,
            source_table,
            source_columns,
            target_schema,
            target_table,
            target_columns,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
        ON CONFLICT (project_id, source_schema, source_table, target_schema, target_table)
        DO NOTHING
        RETURNING mapping_id
        """

        result = self.engine_db.execute(insert_query, (
            self.project_id,
            source_system_id,
            target_system_id,
            table["source_schema"],
            table["source_table"],
            source_columns,
            table["target_schema"],
            table["target_table"],
            target_columns
        ))

        # 2️⃣ If inserted, use returned id
        if result:
            mapping_id = result[0][0]
            print(f"Inserted new mapping: {table['source_table']}")
        else:
            # 3️⃣ Otherwise fetch existing mapping_id
            fetch_query = """
            SELECT mapping_id
            FROM core.dataset_mappings
            WHERE project_id = %s
            AND source_schema = %s
            AND source_table = %s
            AND target_schema = %s
            AND target_table = %s
            """

            existing = self.engine_db.execute(fetch_query, (
                self.project_id,
                table["source_schema"],
                table["source_table"],
                table["target_schema"],
                table["target_table"]
            ))

            if not existing:
                raise Exception("Failed to retrieve mapping_id after conflict")

            mapping_id = existing[0][0]
            print(f"Using existing mapping: {table['source_table']}")

        # 4️⃣ Bind rules safely
        self._bind_default_rules(mapping_id)

        return mapping_id



    def _normalise_config(self, raw_config):
        """
        Ensures connection_config matches DBConnector expectations.
        """
        return {
            "host": raw_config.get("host"),
            "port": raw_config.get("port", 5432),
            "database": raw_config.get("database") or raw_config.get("dbname"),
            "user": raw_config.get("user") or raw_config.get("username"),
            "password": raw_config.get("password")
        }

    # -----------------------------------------------------

    def _get_system(self, role):
        query = """
        SELECT system_id, system_name, connection_config
        FROM core.system_registry
        WHERE project_id = %s
        AND system_role = %s
        """

        result = self.engine_db.execute(query, (self.project_id, role))

        if not result:
            raise Exception(f"No {role} system configured for project")

        row = result[0]

        return {
            "system_id": row[0],
            "system_name": row[1],
            "connection_config": row[2]
        }

    # -----------------------------------------------------

    def _fetch_tables(self, db):
        query = """
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog','information_schema')
        """

        return db.execute(query)
    
    
    #✅ Add _fetch_columns() method

    def _fetch_columns(self, db, schema, table):

        query = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = %s
        AND table_name = %s
        ORDER BY ordinal_position
        """

        rows = db.execute(query, (schema, table))

        return [r[0] for r in rows]
    

    #🔷 PART 2 — Auto Rule Binding

    #N#ow we bind default rules automatically.

    #Add _bind_default_rules()
    def _bind_default_rules_OLD_legacy(self, mapping_id):

        default_rules = [
            "C01_ROWCOUNT",
            "C02_BALANCE_RECON",
            "C03_REFERENTIAL",
            "C04_COLUMN_COUNT"
        ]

        insert_query = """
        INSERT INTO core.rule_dataset_mapping
        (rule_id, mapping_id)
        VALUES (%s,%s)
        ON CONFLICT DO NOTHING
        """

        for rule in default_rules:
            self.engine_db.execute(insert_query, (rule, mapping_id))


    def _bind_default_rules(self, mapping_id):

        fetch_rules_query = """
        SELECT rule_id
        FROM engine.rule_registry
        WHERE enabled_flag = TRUE
        """

        rules = self.engine_db.execute(fetch_rules_query)

        insert_query = """
        INSERT INTO core.rule_dataset_mapping (rule_id, mapping_id)
        VALUES (%s, %s)
        ON CONFLICT DO NOTHING
        """

        for row in rules:
            rule_id = row[0]
            self.engine_db.execute(insert_query, (rule_id, mapping_id))