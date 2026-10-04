class PmaAssessmentError(Exception):
    """Base error for PMA assessment failures (Phase 5A)."""


class PmaHealthCheckError(PmaAssessmentError):
    """Connection or health-check failure that blocks discovery before it starts."""
