import logging

logger = logging.getLogger(__name__)


class DuplicateCheckRule:

    def __init__(self, source_db, target_db, parameters):

        self.source_db = source_db
        self.target_db = target_db
        self.params = parameters

    # ---------------------------------------------------------
    # PUBLIC ENTRY
    # ---------------------------------------------------------

    def execute(self):

        source_schema = self.params["source_schema"]
        source_table = self.params["source_table"]

        target_schema = self.params["target_schema"]
        target_table = self.params["target_table"]

        pk_column = self.params.get("primary_key_column")

        if not pk_column:

            logger.warning(
                f"C07 skipped — no primary key detected for {source_schema}.{source_table}"
            )

            return {
                "status": "SKIPPED",
                "delta": 0
            }

        source_duplicates = self._count_duplicates(
            self.source_db,
            source_schema,
            source_table,
            pk_column
        )

        target_duplicates = self._count_duplicates(
            self.target_db,
            target_schema,
            target_table,
            pk_column
        )

        delta = abs(source_duplicates - target_duplicates)

        if delta == 0:
            status = "PASS"
        else:
            status = "FAIL"

        return {
            "status": status,
            "delta": delta,
            "source_value": source_duplicates,
            "target_value": target_duplicates
        }

    # ---------------------------------------------------------
    # DUPLICATE COUNTER
    # ---------------------------------------------------------

    def _count_duplicates(self, db, schema, table, pk_column):

        query = f"""
        SELECT COUNT(*)
        FROM (
            SELECT {pk_column}
            FROM {schema}.{table}
            GROUP BY {pk_column}
            HAVING COUNT(*) > 1
        ) dup
        """

        result = db.execute(query)

        return result[0][0] if result else 0