import logging

from app import rules

logger = logging.getLogger(__name__)


class AutoRuleDiscovery:
    def __init__(self, engine_db, source_db, project_id):
    #def __init__(self, engine_db, project_id):
        self.engine_db = engine_db
        self.source_db = source_db
        self.project_id = project_id

    # -----------------------------------------------------
    # PUBLIC ENTRY
    # -----------------------------------------------------

    def generate_rules(self):

        mappings = self._get_dataset_mappings()

        for mapping in mappings:

            mapping_id = mapping[0]
            dataset_name = f"{mapping[1]}.{mapping[2]}"

            logger.info(f"Auto discovering rules for {dataset_name}")

            columns = self._get_columns(mapping_id)

            #-----Removed legacy hardcoded rules logic in favor of dynamic inference based on column metadata and FK detection-----
            #rules = self._infer_rules(columns)
            #columns = self._get_columns(mapping_id)
            

            # New v1.7 logic: Infer rules based on column roles and data types, plus FK detection
            rules = self._infer_rules(columns)

            # Detect foreign keys
            foreign_keys = self._detect_foreign_keys(mapping[1], mapping[2])

            if foreign_keys:
                rules.append("C03_REFERENTIAL")

            # Register inferred rules
            for rule_id in rules:
                self._register_rule(rule_id, mapping_id)

    # -----------------------------------------------------
    # FETCH DATASETS
    # -----------------------------------------------------

    def _get_dataset_mappings(self):

        query = """
        SELECT mapping_id, source_schema, source_table
        FROM core.dataset_mappings
        WHERE project_id = %s
        AND is_active = TRUE
        """

        return self.engine_db.execute(query, (self.project_id,))

    # -----------------------------------------------------
    # FETCH COLUMNS
    # -----------------------------------------------------

    def _get_columns(self, mapping_id):

        query = """
        SELECT column_name, inferred_role, data_type
        FROM core.dataset_columns
        WHERE mapping_id = %s
        """

        return self.engine_db.execute(query, (mapping_id,))

    # -----------------------------------------------------
    # RULE INFERENCE
    # -----------------------------------------------------

    def _infer_rules_legacy_not_working(self, columns):

        rules = set()

        for column in columns:

            column_name = column[0]
            inferred_role = column[1]
            data_type = column[2]

            # Primary key detection
            if inferred_role == "PRIMARY_KEY":
                rules.add("C01_ROWCOUNT")
                rules.add("C03_REFERENTIAL")

            # Numeric column detection
            if inferred_role == "NUMERIC_METRIC":
                rules.add("C02_BALANCE_RECON")

            # Date column detection
            if data_type and "date" in data_type.lower():
                rules.add("C05_NULL_CHECK")

            # Duplicate detection for primary keys
            if inferred_role == "PRIMARY_KEY":
                rules.add("C07_DUPLICATE_DETECTION")

            #if inferred_role == "AUDIT_COLUMN":
            #    rules.add("C08_DATA_DRIFT_DETECTION")

            if inferred_role == "FOREIGN_KEY":
                rules.add("C08_DATA_DRIFT")
            
            if inferred_role == "FOREIGN_KEY":
                rules.add("C09_REFERENTIAL_COVERAGE")

            if inferred_role == "TABLE":
                rules.add("C010_SCHEMA_DRIFT")
            
            
            


    

        # Always run structural checks
        rules.add("C04_COLUMN_COUNT")
        rules.add("C06_DATA_TYPE_MATCH")

        return list(rules)
    

    def _infer_rules_legacy_2(self, columns):

        rules = set()

        for column in columns:

            column_name = column[0]
            inferred_role = column[1]
            data_type = column[2]

            if inferred_role == "PRIMARY_KEY":
                rules.add("C01_ROWCOUNT")
                rules.add("C03_REFERENTIAL")
                rules.add("C07_DUPLICATE_DETECTION")

            if inferred_role == "NUMERIC_METRIC":
                rules.add("C02_BALANCE_RECON")
                rules.add("C08_DATA_DRIFT")

            if inferred_role == "FOREIGN_KEY":
                rules.add("C09_REFERENTIAL_COVERAGE")

            if data_type and "date" in data_type.lower():
                rules.add("C05_NULL_CHECK")

        # structural checks always run
        rules.add("C04_COLUMN_COUNT")
        rules.add("C06_DATA_TYPE_MATCH")
        rules.add("C010_SCHEMA_DRIFT")

        return list(rules)


    def _infer_rules(self, columns):

        rules = set()

        for column in columns:

            column_name = column[0]
            inferred_role = column[1]
            data_type = column[2]

            if inferred_role == "PRIMARY_KEY":
                rules.add("C01_ROWCOUNT")
                rules.add("C03_REFERENTIAL")
                rules.add("C07_DUPLICATE_DETECTION")

            if inferred_role == "NUMERIC_METRIC":
                rules.add("C02_BALANCE_RECON")
                rules.add("C08_DATA_DRIFT")

            if inferred_role == "FOREIGN_KEY":
                rules.add("C09_REFERENTIAL_COVERAGE")

            if data_type and "date" in data_type.lower():
                rules.add("C05_NULL_CHECK")

        rules.add("C04_COLUMN_COUNT")
        rules.add("C06_DATA_TYPE_MATCH")
        rules.add("C010_SCHEMA_DRIFT")

        return list(rules)


    # -----------------------------------------------------
    # RULE REGISTRATION
    # -----------------------------------------------------

    def _register_rule_legacy(self, rule_id, mapping_id):

        check_query = """
        SELECT 1
        FROM core.rule_dataset_mapping
        WHERE rule_id = %s
        AND mapping_id = %s
        """

        exists = self.engine_db.execute(check_query, (rule_id, mapping_id))

        if exists:
            return

        insert_query = """
        INSERT INTO core.rule_dataset_mapping
        (rule_id, mapping_id, is_active)
        VALUES (%s, %s, TRUE)
        """

        self.engine_db.execute(insert_query, (rule_id, mapping_id))

    # -----------------------------------------------------
    # NEW: IMPROVED RULE REGISTRATION WITH ENABLED CHECK

    def _register_rule(self, rule_id, mapping_id):

        # Ensure rule exists and is enabled
        rule_check = """
        SELECT 1
        FROM engine.rule_registry
        WHERE rule_id = %s
        AND enabled_flag = TRUE
        """

        rule_exists = self.engine_db.execute(rule_check, (rule_id,))

        if not rule_exists:
            return

        # Prevent duplicate mapping
        check_query = """
        SELECT 1
        FROM core.rule_dataset_mapping
        WHERE rule_id = %s
        AND mapping_id = %s
        """

        exists = self.engine_db.execute(check_query, (rule_id, mapping_id))

        if exists:
            return

        insert_query = """
        INSERT INTO core.rule_dataset_mapping
        (rule_id, mapping_id, is_active)
        VALUES (%s, %s, TRUE)
        """

        self.engine_db.execute(insert_query, (rule_id, mapping_id))


    

    def _detect_foreign_keys(self, schema, table):

        query = """
        SELECT
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = %s
        AND tc.table_name = %s
        """

        #rows = self.engine_db.execute(query, (schema, table))

        # For FK detection, we need to query the source database, not the engine metadata database
        rows = self.source_db.execute(query, (schema, table))

        return [r[0] for r in rows]