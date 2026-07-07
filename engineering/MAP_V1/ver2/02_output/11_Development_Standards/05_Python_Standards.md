# MAP MVP Python Standards

| Field    | Value              |
| -------- | ------------------ |
| Document | MAP MVP Python Standards |
| Version  | 1.0                |
| Date     | July 2026          |
| Status   | Official           |

---

## 1. Python Version

- Use **Python 3.12+** (latest stable release) for all new projects.
- Leverage new language features such as improved error messages, performance optimizations, and enhanced typing capabilities.
- Type hints are **required** for all public APIs and strongly encouraged for internal code.
- Use `from __future__ import annotations` to enable postponed evaluation of annotations where beneficial.

## 2. Project Structure

Follow the **src layout** convention to avoid accidental imports of the local package over installed dependencies.

```
project-root/
├── pyproject.toml
├── README.md
├── src/
│   └── map_module/
│       ├── __init__.py
│       ├── core/
│       ├── services/
│       └── models/
├── tests/
│   ├── unit/
│   └── integration/
└── docs/
```

- **Flat is better than nested.** Avoid deeply nested module hierarchies unless there is a clear domain boundary.
- Tests live **alongside** or in a parallel `tests/` directory mirroring the source structure.
- Each package must contain an `__init__.py` with explicit public API exports where appropriate.

## 3. Package Management

- Use **Poetry** or **uv** as the package manager for dependency resolution and virtual environment management.
- Maintain a `pyproject.toml` as the single source of truth for project metadata and dependencies.
- Always commit **lock files** (`poetry.lock` or `uv.lock`) to ensure reproducible builds.
- Separate development dependencies (`[tool.poetry.dev-dependencies]`) from production dependencies.

## 4. Virtual Environments

- Every project must have its own isolated virtual environment (venv or conda).
- Never commit virtual environment directories to version control — add `venv/`, `.venv/`, and `env/` to `.gitignore`.
- Activate the virtual environment before running any project commands.
- Prefer **venv** (stdlib) for simple projects; use **conda** only when native scientific computing dependencies require it.

## 5. Type Hints

Type hints are **mandatory** for all public function signatures, return types, and class attributes.

```python
from typing import Optional, Union

def process_migration(
    source_id: str,
    target_env: str,
    dry_run: bool = False,
) -> Optional[dict[str, any]]:
    ...
```

- Use `Optional[X]` instead of `X | None` for Python 3.9 compatibility; use `X | None` on 3.10+.
- Use `Union[X, Y]` where multiple types are acceptable.
- Use `typing.TypeAlias` for complex union types.
- Configure **mypy** in strict mode for continuous type checking.

## 6. Docstrings

All public modules, classes, functions, and methods must have docstrings. Use **Google** or **NumPy** style consistently within a project.

```python
def validate_record(record: dict, schema: str) -> bool:
    """Validate a record against the given schema.

    Args:
        record: The data record to validate.
        schema: The schema identifier to validate against.

    Returns:
        True if validation passes, False otherwise.

    Raises:
        SchemaNotFoundError: If the schema does not exist.
    """
```

- Internal/private helpers may omit docstrings if the function name and type hints are self-documenting.
- Module-level docstrings should describe the module's purpose and key exports.

## 7. Linting

- Use **Ruff** as the primary linter — it replaces flake8, isort, pyupgrade, and more in a single fast tool.
- Use **mypy** for static type checking with strict mode enabled.
- Configure both tools in `pyproject.toml`:

```toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "B", "SIM"]

[tool.mypy]
python_version = "3.12"
strict = true
```

- Run linters in CI pipelines and block merges on failures.
- Use pre-commit hooks for local linting feedback.

## 8. Formatting

- Use **Ruff format** (or **Black**) for consistent code formatting.
- Line length: **100 characters** (or 88 for Black compatibility).
- Use double quotes for strings (Black convention) or single quotes consistently.
- Trailing commas in multi-line collections and function signatures.
- Format on save in the editor; enforce in CI.

## 9. Testing

- Use **pytest** as the test framework.
- Target **80% code coverage** minimum across all packages.
- Use **fixtures** for shared setup and teardown logic.
- Use `@pytest.mark.parametrize` for data-driven tests.
- Organize tests into `unit/` and `integration/` directories.
- Mock external dependencies (HTTP calls, databases, file systems) at the boundary.

```python
@pytest.mark.parametrize("input,expected", [
    ("valid_record", True),
    ("empty_record", False),
    ("malformed_record", False),
])
def test_validate_record(input, expected):
    assert validate_record(input, "default") == expected
```

## 10. Dependency Management

- Pin **major versions** in `pyproject.toml`; use lock files for exact versions.
- Run **pip-audit** (or `poetry audit` / `uv audit`) regularly to scan for known vulnerabilities.
- Minimize the number of third-party dependencies — prefer stdlib solutions where practical.
- Review transitive dependencies before adding new direct dependencies.
- Schedule periodic dependency updates (monthly or quarterly) and test thoroughly after updates.

## 11. Best Practices

- Follow **PEP 8** style guidelines (enforced by Ruff/Black).
- Prefer **comprehensions** over explicit loops for list/dict/set creation.
- Use **pathlib.Path** over `os.path` for filesystem operations.
- Use **f-strings** over `.format()` or `%` formatting.
- Prefer early returns to reduce nesting.
- Use `dataclasses` or Pydantic models for structured data instead of raw dicts.
- Avoid mutable default arguments (`def f(items=None)` not `def f(items=[])`).
- Use context managers (`with`) for resource management.

## 12. Recommended Libraries

| Category       | Library          | Purpose                          |
| -------------- | ---------------- | -------------------------------- |
| Web Framework  | FastAPI          | High-performance async API framework |
| ORM            | SQLAlchemy 2.0   | Database access and modeling     |
| Validation     | Pydantic         | Data validation and settings     |
| HTTP Client    | httpx            | Async/sync HTTP requests         |
| Task Queue     | Celery           | Distributed background tasks    |
| CLI            | Typer            | Command-line interface building  |
| Logging        | Loguru or structlog | Structured application logging |
| Serialization  | msgspec          | Fast binary/JSON serialization   |

## 13. Top 5 Python Web Frameworks

| Feature              | FastAPI            | Django             | Flask              | Tornado            | Sanic              |
| -------------------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| Type                 | Full-stack async   | Full-stack         | Micro-framework    | Async networking   | Async micro-framework |
| Async Support        | Native             | 4.1+ (limited)    | Via extensions      | Native             | Native              |
| Performance          | Very High          | Moderate           | Moderate           | High               | High               |
| Learning Curve       | Low                | Medium             | Low                | Medium             | Low                |
| Built-in ORM         | No (use SQLAlchemy)| Yes                | No                 | No                 | No                 |
| Auto API Docs        | Yes (OpenAPI)      | Via extensions     | Via extensions     | No                 | No                 |
| Best For             | Modern APIs        | Complex web apps   | Small APIs/services| WebSocket-heavy    | Async microservices|
| Community Size       | Growing fast       | Very Large         | Large              | Medium             | Small              |

**Recommendation:** Use **FastAPI** for MAP backend services. It aligns with our async-first architecture, provides automatic OpenAPI documentation, and integrates seamlessly with Pydantic for request/response validation.
