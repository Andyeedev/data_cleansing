from .base_rule import BaseRule


class ReferentialIntegrityRule(BaseRule):

    def execute(self):

        pk = self.parameters["primary_key_column"]

        source_query = f"""
        SELECT {pk}
        FROM {self.parameters['source_schema']}.{self.parameters['source_table']}
        """

        target_query = f"""
        SELECT {pk}
        FROM {self.parameters['target_schema']}.{self.parameters['target_table']}
        """

        source_keys = set([r[0] for r in self.source_db.execute(source_query)])
        target_keys = set([r[0] for r in self.target_db.execute(target_query)])

        missing = source_keys - target_keys

        status = "PASS" if len(missing) == 0 else "FAIL"

        return {
            "missing_count": len(missing),
            "delta": len(missing),
            "status": status
        }
