from typing import List, Optional, Dict, Any
from dataclasses import dataclass, asdict
import re


@dataclass
class FixOption:
    id: str
    title: str
    description: str
    category: str  # permission, schema, config, data, connection
    risk: str  # low, medium, high
    requires_approval: bool
    sql_preview: Optional[str]
    affected_objects: List[str]
    auto_applicable: bool = False


class FixOptionGenerator:
    """Generates actionable fix options for rule execution errors."""

    def __init__(self):
        self.patterns = [
            # Permission errors
            (
                r"permission denied|access denied|GRANT|SELECT permission",
                lambda m: FixOption(
                    id="grant_select_permission",
                    title="Grant SELECT permission on source table",
                    description="The execution user lacks SELECT permission on the source table",
                    category="permission",
                    risk="low",
                    requires_approval=True,
                    sql_preview="GRANT SELECT ON {schema}.{table} TO {user};",
                    affected_objects=["{schema}.{table}"],
                    auto_applicable=False
                )
            ),
            # Connection busy / MARS
            (
                r"Connection is busy with results for another command",
                lambda m: FixOption(
                    id="enable_mars_connection",
                    title="Enable MARS (Multiple Active Result Sets) on SQL Server connection",
                    description="SQL Server connection pooling issue - concurrent queries need MARS enabled",
                    category="connection",
                    risk="low",
                    requires_approval=False,
                    sql_preview=None,
                    affected_objects=["connection_pool"],
                    auto_applicable=True
                )
            ),
            # Table not found
            (
                r"Invalid object name|table.*does not exist|could not find table",
                lambda m: FixOption(
                    id="verify_table_mapping",
                    title="Verify table mapping configuration",
                    description="Source or target table doesn't exist in the database",
                    category="schema",
                    risk="medium",
                    requires_approval=True,
                    sql_preview=None,
                    affected_objects=["{mapping_id}"],
                    auto_applicable=False
                )
            ),
            # No numeric column (C02)
            (
                r"No numeric column defined|numeric_column",
                lambda m: FixOption(
                    id="tag_numeric_column",
                    title="Tag balance/amount column as NUMERIC_METRIC",
                    description="C02 Balance Reconciliation requires a numeric column tagged as NUMERIC_METRIC",
                    category="config",
                    risk="low",
                    requires_approval=False,
                    sql_preview="UPDATE core.dataset_columns SET inferred_role='NUMERIC_METRIC' WHERE mapping_id='{mapping_id}' AND column_name='{column_name}';",
                    affected_objects=["core.dataset_columns"],
                    auto_applicable=True
                )
            ),
            # No primary key (C03, C07)
            (
                r"NO_PRIMARY_KEY|no primary key detected",
                lambda m: FixOption(
                    id="define_primary_key",
                    title="Define primary key on source/target table",
                    description="Referential integrity and duplicate detection require primary key metadata",
                    category="schema",
                    risk="medium",
                    requires_approval=True,
                    sql_preview="UPDATE core.dataset_columns SET inferred_role='PRIMARY_KEY' WHERE mapping_id='{mapping_id}' AND column_name IN ({pk_columns});",
                    affected_objects=["core.dataset_columns"],
                    auto_applicable=False
                )
            ),
            # No FK metadata (C09)
            (
                r"NO_FK_METADATA|foreign key",
                lambda m: FixOption(
                    id="define_foreign_key",
                    title="Define foreign key relationship metadata",
                    description="Referential coverage check requires FK metadata in core.rule_dataset_mapping",
                    category="config",
                    risk="medium",
                    requires_approval=True,
                    sql_preview=None,
                    affected_objects=["core.rule_dataset_mapping"],
                    auto_applicable=False
                )
            ),
            # Connection timeout
            (
                r"timeout|Login timeout expired|connection timeout",
                lambda m: FixOption(
                    id="increase_connection_timeout",
                    title="Increase connection timeout",
                    description="Database connection or query timeout - increase timeout or optimize query",
                    category="connection",
                    risk="low",
                    requires_approval=False,
                    sql_preview=None,
                    affected_objects=["connection_config"],
                    auto_applicable=True
                )
            ),
            # Login failed
            (
                r"Login failed|authentication failed|invalid credentials",
                lambda m: FixOption(
                    id="fix_credentials",
                    title="Update database credentials",
                    description="Invalid username/password or expired credentials for database connection",
                    category="permission",
                    risk="high",
                    requires_approval=True,
                    sql_preview=None,
                    affected_objects=["platform.credentials"],
                    auto_applicable=False
                )
            ),
        ]

    def generate_fixes(self, error_message: str, context: Dict[str, Any] = None) -> List[FixOption]:
        """Generate fix options based on error message and context."""
        context = context or {}
        fixes = []

        for pattern, generator in self.patterns:
            if re.search(pattern, error_message, re.IGNORECASE):
                try:
                    fix = generator(None)
                    # Fill in template variables from context
                    fix = self._fill_template(fix, context, error_message)
                    fixes.append(fix)
                except Exception:
                    pass

        # If no pattern matched, add generic fix
        if not fixes:
            fixes.append(FixOption(
                id="investigate_manually",
                title="Investigate error manually",
                description=f"Unrecognized error: {error_message[:200]}",
                category="unknown",
                risk="medium",
                requires_approval=True,
                sql_preview=None,
                affected_objects=[],
                auto_applicable=False
            ))

        return fixes

    def _fill_template(self, fix: FixOption, context: Dict, error_msg: str) -> FixOption:
        """Fill template variables in fix option."""
        mapping_id = context.get("mapping_id", "")
        schema = context.get("source_schema", context.get("target_schema", ""))
        table = context.get("source_table", context.get("target_table", ""))
        user = context.get("db_user", "engine_user")
        column_name = context.get("numeric_column", "amount")

        def fill(s: str) -> str:
            if not s:
                return s
            return s.format(
                mapping_id=mapping_id,
                schema=schema,
                table=table,
                user=user,
                column_name=column_name,
                pk_columns="id",
                db_user=user
            )

        return FixOption(
            id=fix.id,
            title=fill(fix.title),
            description=fill(fix.description),
            category=fix.category,
            risk=fix.risk,
            requires_approval=fix.requires_approval,
            sql_preview=fill(fix.sql_preview) if fix.sql_preview else None,
            affected_objects=[fill(obj) for obj in fix.affected_objects],
            auto_applicable=fix.auto_applicable
        )


# Singleton instance
fix_option_generator = FixOptionGenerator()


def generate_fix_options(error_message: str, context: Dict = None) -> List[Dict]:
    """Public API to generate fix options."""
    fixes = fix_option_generator.generate_fixes(error_message, context)
    return [asdict(f) for f in fixes]


def get_fix_by_id(fix_id: str, context: Dict = None) -> Optional[Dict]:
    """Get a specific fix option by ID with context filled."""
    # Dummy error to trigger pattern matching
    fixes = fix_option_generator.generate_fixes(fix_id, context)
    for fix in fixes:
        if fix["id"] == fix_id:
            return fix
    return None