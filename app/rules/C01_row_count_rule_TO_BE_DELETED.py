from app.rules.base_rule import BaseRule


class RowCountRule(BaseRule):

    def execute(self, source_db, target_db, schema, table):

        source_count = source_db.adapter.get_row_count(schema, table)
        target_count = target_db.adapter.get_row_count(schema, table)

        delta = abs(source_count - target_count)

        return {
            "source_value": source_count,
            "target_value": target_count,
            "delta": delta,
            "status": "PASS" if delta == 0 else "FAIL"
        }