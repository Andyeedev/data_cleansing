from dataclasses import dataclass
from typing import Optional


@dataclass
class ExecutionResult:

    control_id: str
    status: str
    message: str = ""
    records_processed: int = 0
    execution_time_ms: float = 0
    error: Optional[str] = None