class ScoringEngine:

    def __init__(self, engine_db, batch_id):
        self.engine_db = engine_db
        self.batch_id = batch_id

    # ---------------------------------------------------------
    # RISK-WEIGHTED SCORING (v1.2)engine.rule_parameter_metadata
    # ---------------------------------------------------------

    def calculate_overall(self):

        # Severity weight mapping
        severity_weights = {
            "CRITICAL": 5,
            "HIGH": 3,
            "MEDIUM": 2,
            "LOW": 1
        }

        # Fetch rule execution data
        query = """
        SELECT execution_status, COALESCE(severity_level, 'LOW')
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        """

        rows = self.engine_db.execute(query, (self.batch_id,))

        if not rows:
            return 0

        total_weight = 0
        achieved_weight = 0

        for status, severity in rows:

            weight = severity_weights.get(severity.upper(), 1)

            total_weight += weight

            if status == "PASS":
                achieved_weight += weight

        if total_weight == 0:
            return 0

        score = (achieved_weight * 100.0) / total_weight

        return round(score, 2)
