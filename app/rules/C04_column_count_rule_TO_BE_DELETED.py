from app.rules.base_rule import BaseRule


class ColumnCountRule(BaseRule):

    def execute(self, source_db, target_db, schema, table):

        source_cols = source_db.adapter.get_column_count(schema, table)
        target_cols = target_db.adapter.get_column_count(schema, table)

        delta = abs(source_cols - target_cols)

        return {
            "source_value": source_cols,
            "target_value": target_cols,
            "delta": delta,
            "status": "PASS" if delta == 0 else "FAIL"
        }