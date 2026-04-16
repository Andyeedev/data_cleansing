from app.rules.base_rule import BaseRule


class SchemaDriftRule(BaseRule):

    def execute(self, source_db, target_db, schema, table):

        source_cols = set(source_db.adapter.get_columns(schema, table))
        target_cols = set(target_db.adapter.get_columns(schema, table))

        missing = source_cols - target_cols
        extra = target_cols - source_cols

        delta = len(missing) + len(extra)

        return {
            "source_value": list(source_cols),
            "target_value": list(target_cols),
            "delta": delta,
            "status": "PASS" if delta == 0 else "FAIL"
        }