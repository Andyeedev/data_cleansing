from .base_rule import BaseRule


class ReferentialIntegrityRule(BaseRule):

    RULE_ID = "C03_REFERENTIAL"

    def execute(self):

        pk = self.parameters.get("primary_key_column")

        if not pk:
            source_schema = self.parameters.get("source_schema", "unknown")
            source_table = self.parameters.get("source_table", "unknown")
            return {
                "status": "SKIPPED",
                "delta": 0,
                "cause": "NO_PRIMARY_KEY",
                "message": f"No primary key column found for {source_schema}.{source_table}. Tag a column with inferred_role='PRIMARY_KEY' in core.dataset_columns to enable referential integrity checks."
            }

        source_schema = self.parameters["source_schema"]
        source_table = self.parameters["source_table"]
        target_schema = self.parameters["target_schema"]
        target_table = self.parameters["target_table"]

        source_query = f"""
        SELECT {pk} FROM {source_schema}.{source_table}
        """

        target_query = f"""
        SELECT {pk} FROM {target_schema}.{target_table}
        """

        source_keys = set(r[0] for r in self.source_db.execute(source_query))
        target_keys = set(r[0] for r in self.target_db.execute(target_query))

        missing = source_keys - target_keys

        status = "PASS" if len(missing) == 0 else "FAIL"

        return {
            "missing_count": len(missing),
            "delta": len(missing),
            "status": status
        }
