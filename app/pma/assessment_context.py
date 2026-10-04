from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from app.pma.working_set import PmaWorkingSet

PMA_ASSESSMENT_TYPE = "PMA"


@dataclass
class PmaAssessmentContext:
    """A1 in-process PMA assessment context; never persisted as a table or column."""

    tenant_id: str
    project_id: str
    system_id: str
    system_name: str
    batch_id: str
    started_at: datetime
    assessment_type: str = PMA_ASSESSMENT_TYPE
    adapter: Any = None
    health_check: Any = None
    working_set: PmaWorkingSet | None = None
    applicable_controls: list[str] = field(default_factory=list)
    evidence_policy: Any = None
    batch_name: str | None = None
