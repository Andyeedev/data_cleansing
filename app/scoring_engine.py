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
        SELECT
            execution_status,
            COALESCE(severity_level, 'LOW'),
            control_id
        FROM engine.migration_control_execution
        WHERE batch_id = %s
        """

        rows = self.engine_db.execute(query, (self.batch_id,))

        if not rows:
            return 0

        total_weight = 0
        achieved_weight = 0

        # ✅ SAFE LOOP (FINAL — USE THIS ONLY)
        for row in rows:

            # Handle variable row shapes safely
            if len(row) == 3:
                status, severity, _ = row
            elif len(row) == 2:
                status, severity = row
            else:
                continue  # skip unexpected formats

            # Normalize severity safely
            severity = str(severity).upper()

            weight = severity_weights.get(severity, 1)

            total_weight += weight

            if status == "PASS":
                achieved_weight += weight

        if total_weight == 0:
            return 0

        score = (achieved_weight * 100.0) / total_weight

        return round(score, 2)
