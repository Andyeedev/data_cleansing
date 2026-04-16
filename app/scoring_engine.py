class ScoringEngine:

    def __init__(self, engine_db, batch_id):
        self.engine_db = engine_db
        self.batch_id = batch_id

    # ---------------------------------------------------------
    # RISK-WEIGHTED SCORING (v1.2)engine.rule_parameter_metadata
    # ---------------------------------------------------------

    def calculate_overall_legacy(self):
        #2026-04-01: This method implements the original risk-weighted 
        # scoring logic based on rule execution results. 
        # It can be used as a baseline or fallback while we develop 
        # the new multi-dimensional scoring model.
        # I have renamed the original method to "calculate_overall_legacy" 
        # to clearly indicate that it retains the existing logic. 
        # The new self.calculate_rule_score() method will implement 
        # the enhanced scoring model that incorporates multiple components 
        # (rule, matching, relationship, profiling) and allows 
        # for more granular insights into the migration validation process.


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


    





     # ---------------------------------------------------------
    # RULE SCORE (EXISTING LOGIC — CLEANLY ISOLATED)
    # 2026-04-01: This method retains the original scoring logic 
    # for backward compatibility and granular insights. It can 
    # be used independently or as a component in the new 
    # overall score calculation.
    # ---------------------------------------------------------
    def calculate_rule_score(self):

        severity_weights = {
            "CRITICAL": 5,
            "HIGH": 3,
            "MEDIUM": 2,
            "LOW": 1
        }

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

    # ---------------------------------------------------------
    # OVERALL SCORE (NEW MULTI-DIMENSIONAL MODEL)
    # 2026-04-01: This method calculates an overall score based on multiple
    # components (rule, matching, relationship, profiling). Each component
    # can be calculated separately and then combined using weighted averages.
    # ---------------------------------------------------------
    def calculate_overall(self, components: dict):

        weights = {
            "rule": 0.4,
            "matching": 0.2,
            "relationship": 0.2,
            "profiling": 0.2
        }

        total = 0

        for key, score in components.items():
            total += score * weights.get(key, 0)

        return round(total, 2)

    # ---------------------------------------------------------
    # STORE SCORE SUMMARY (SaaS REQUIRED)
    # 2026-04-01: This method persists the calculated scores into 
    # a summary table for reporting and historical tracking. 
    # It assumes a new table structure that can accommodate 
    # multiple score components and the overall score.
    # ---------------------------------------------------------
    def persist_scores(self, project_id, components, overall_score):

        query = """
        INSERT INTO engine.migration_score_summary (
            batch_id,
            project_id,
            rule_score,
            matching_score,
            relationship_score,
            profiling_score,
            overall_score
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """

        self.engine_db.execute(query, (
            self.batch_id,
            project_id,
            components.get("rule", 0),
            components.get("matching", 0),
            components.get("relationship", 0),
            components.get("profiling", 0),
            overall_score
        ))