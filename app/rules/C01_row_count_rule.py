from app.rules.base_rule import BaseRule


class RowCountRule(BaseRule):

    RULE_ID = "C01_ROWCOUNT"

    REQUIRED_PARAMETERS = [
        "source_schema",
        "source_table",
        "target_schema",
        "target_table"
    ]

    def execute(self):

        source_query = f"""
        SELECT COUNT(*)
        FROM {self.parameters['source_schema']}.{self.parameters['source_table']}
        """

        target_query = f"""
        SELECT COUNT(*)
        FROM {self.parameters['target_schema']}.{self.parameters['target_table']}
        """

        source_count = self.source_db.execute(source_query)[0][0]
        target_count = self.target_db.execute(target_query)[0][0]

        delta = abs(source_count - target_count)
        tolerance = self.parameters.get("tolerance_value", 0)

        status = "PASS" if delta <= tolerance else "FAIL"

        return {
            "source_value": source_count,
            "target_value": target_count,
            "delta": delta,
            "status": status,
            "query": f"Source: {source_query.strip()} | Target: {target_query.strip()}",
            "source_count": source_count,
            "target_count": target_count
        }
