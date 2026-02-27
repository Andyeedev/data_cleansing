from .base_rule import BaseRule


class RowCountRule(BaseRule):

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
            "status": status
        }
