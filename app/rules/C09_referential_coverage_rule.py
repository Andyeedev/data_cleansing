import logging

logger = logging.getLogger(__name__)


class C09ReferentialCoverageRule:

    def __init__(self, source_db, target_db, parameters):

        self.source_db = source_db
        self.target_db = target_db
        self.params = parameters

    def execute(self):

        schema = self.params["source_schema"]
        child_table = self.params["child_table"]
        parent_table = self.params["parent_table"]
        fk_column = self.params["fk_column"]

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
