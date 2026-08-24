import logging

logger = logging.getLogger(__name__)


class C09ReferentialCoverageRule:

    def __init__(self, source_db, target_db, parameters):

        self.source_db = source_db
        self.target_db = target_db
        self.params = parameters

    def execute(self):

        schema = self.params["source_schema"]
        child_table = self.params.get("child_table")
        parent_table = self.params.get("parent_table")
        fk_column = self.params.get("fk_column")

        if not child_table or not parent_table or not fk_column:
            schema = self.params.get("source_schema", "unknown")
            missing = []
            if not child_table:
                missing.append("child_table")
            if not parent_table:
                missing.append("parent_table")
            if not fk_column:
                missing.append("fk_column")
            return {
                "status": "SKIPPED",
                "delta": 0,
                "cause": "NO_FK_METADATA",
                "message": f"Missing foreign key metadata: {', '.join(missing)} not defined for {schema}. Define FK relationships in core.dataset_columns (is_foreign_key=TRUE) to enable referential coverage checks."
            }

        source_missing = self._missing_keys(
            self.source_db,
            schema,
            child_table,
            parent_table,
            fk_column
        )

        target_missing = self._missing_keys(
            self.target_db,
            schema,
            child_table,
            parent_table,
            fk_column
        )

        delta = abs(source_missing - target_missing)

        status = "PASS"

        if delta > 0:
            status = "FAIL"

        return {
            "status": status,
            "delta": delta,
            "source_value": source_missing,
            "target_value": target_missing
        }

    def _missing_keys(self, db, schema, child, parent, column):

        query = f"""
        SELECT COUNT(*)
        FROM {schema}.{child} c
        LEFT JOIN {schema}.{parent} p
        ON c.{column} = p.{column}
        WHERE p.{column} IS NULL
        """

        result = db.execute(query)

        return result[0][0]
