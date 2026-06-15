import logging
import sys
import threading
import os
from .sanitizer import LogSanitizer

# Add custom AUDIT log level
AUDIT_LEVEL = 25
logging.addLevelName(AUDIT_LEVEL, "AUDIT")

def audit(self, message, *args, **kws):
    if self.isEnabledFor(AUDIT_LEVEL):
        self._log(AUDIT_LEVEL, message, args, **kws)

logging.Logger.audit = audit

# Prevent Windows console crashing on Unicode/Emoji logs
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


class IndentContext:
    _local = threading.local()

    @classmethod
    def get_indent(cls) -> int:
        return getattr(cls._local, "indent", 0)

    @classmethod
    def set_indent(cls, level: int):
        cls._local.indent = level

    @classmethod
    def increment(cls):
        cls._local.indent = getattr(cls._local, "indent", 0) + 1

    @classmethod
    def decrement(cls):
        cls._local.indent = max(0, getattr(cls._local, "indent", 0) - 1)

class ConsoleProgressFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if record.levelno >= logging.WARNING or record.levelno == AUDIT_LEVEL:
            return True

        msg = record.getMessage()
        trimmed = msg.strip()
        is_progress = (
            msg.startswith("[STEP ") or
            trimmed.startswith("Active Systems: ") or
            trimmed.startswith("System: ") or
            trimmed.startswith("Connection: ") or
            msg.startswith("    [CONTROL ") or
            trimmed.startswith("Auto discovering ") or
            trimmed.startswith("Running ") or
            msg.startswith("    Notice: ") or
            msg.startswith("    Resolving ") or
            msg.startswith("    Resolved ") or
            msg.startswith("    Discovering ") or
            msg.startswith("    Control ") or
            msg.startswith("    Evaluating ") or
            msg.startswith("    Migration governance decision:") or
            msg.strip() == ""
        )
        return is_progress


class PhasedFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        # 1. Sanitize the message
        record.msg = LogSanitizer.sanitize_message(record.msg)
        msg = record.getMessage()

        # 2. Check for progress formatting
        trimmed = msg.strip()
        is_progress = (
            msg.startswith("[STEP ") or
            trimmed.startswith("Active Systems: ") or
            trimmed.startswith("System: ") or
            trimmed.startswith("Connection: ") or
            msg.startswith("    [CONTROL ") or
            trimmed.startswith("Auto discovering ") or
            trimmed.startswith("Running ") or
            msg.startswith("    Notice: ") or
            msg.startswith("    Resolving ") or
            msg.startswith("    Resolved ") or
            msg.startswith("    Discovering ") or
            msg.startswith("    Control ") or
            msg.startswith("    Evaluating ") or
            msg.startswith("    Migration governance decision:") or
            msg.strip() == ""
        )

        if is_progress and record.levelno != AUDIT_LEVEL:
            return msg

        # 3. Format normally with the standard prefix
        formatted = super().format(record)

        # 4. Apply indentation if inside a phase
        indent_level = IndentContext.get_indent()
        if indent_level > 0:
            indent_prefix = "    " * indent_level
            formatted = "\n".join(indent_prefix + line for line in formatted.splitlines())

        return formatted


def get_logger(name: str = "app"):
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger

    logger.setLevel(logging.DEBUG)

    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(PhasedFormatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s"))
    console_handler.addFilter(ConsoleProgressFilter())
    logger.addHandler(console_handler)

    # Execution Log (Diagnostic)
    try:
        os.makedirs("exports", exist_ok=True)
        exec_handler = logging.FileHandler("exports/execution.log", encoding="utf-8")
        exec_handler.setLevel(logging.DEBUG)
        exec_handler.setFormatter(PhasedFormatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s"))
        logger.addHandler(exec_handler)
    except Exception:
        pass

    # Audit Log (Compliance)
    try:
        audit_handler = logging.FileHandler("exports/audit.log", encoding="utf-8")
        audit_handler.setLevel(AUDIT_LEVEL)
        # Audit log filter: only show level 25 (AUDIT)
        audit_handler.addFilter(lambda record: record.levelno == AUDIT_LEVEL)
        audit_handler.setFormatter(logging.Formatter("%(asctime)s | %(levelname)s | %(message)s"))
        logger.addHandler(audit_handler)
    except Exception:
        pass

    return logger

def get_audit_logger():
    return get_logger("audit")
