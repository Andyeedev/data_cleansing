"""PMA single-system execution adapter (Phase 5B, Decision Pack Axis D1).

A `RuleExecutor` subclass constructed with ONE adapter as both `source_db` and
`target_db` plus `source_connections = target_connections = {system_id: adapter}`.
The pair/mapping-coupled seams are overridden to read from the in-memory PMA
working set; execution, retry, result logging and control summaries reuse the
base engine unchanged. Every rule result is translated into single-system
assessment semantics — never a mirrored source/target comparison.
"""

import logging
import time
from datetime import datetime

from app.pma.control_selection import PMA_CONTROL_CLASSIFICATION
from app.rule_executor import RuleExecutor
from app.rule_factory import RuleFactory
from app.rules.C08_data_drift_detection_rule import C08DataDriftDetectionRule

logger = logging.getLogger(__name__)

# MA rules receive NUMERIC_METRIC columns restricted to decimal/numeric/float/real
# style types (per C02/C08 skip messages); integer-family types are excluded here
# for the same reason.
RECONCILIATION_NUMERIC_TYPES = frozenset({
    "decimal", "numeric", "real", "float", "double precision", "float4", "float8",
    "money", "number", "double", "binary_float", "binary_double",
})


def _safe_identifier(name: str) -> bool:
    return bool(name) and name.replace("_", "").isalnum() and not name[0].isdigit()


class PmaExecutionAdapter(RuleExecutor):
    """Executes PMA controls for one assessed system through the shared engine."""

    def __init__(self, engine_db, adapter, context, control_id, config=None):
        system_id = str(context.system_id)
        super().__init__(
            engine_db=engine_db,
            source_db=adapter,
            target_db=adapter,
            batch_id=context.batch_id,
            project_id=context.project_id,
            control_id=control_id,
            config=config,
            source_connections={system_id: adapter},
            target_connections={system_id: adapter},
        )
        self.adapter = adapter
        self.system_id = system_id
        self.system_name = context.system_name
        self.working_set = context.working_set
        self._tables_by_entity = {
            table.entity_name: table for table in self.working_set.tables
        }

    # ---------------------------------------------------------
    # SEAM OVERRIDES (entity feed / parameters / column context)
    # ---------------------------------------------------------

    def _get_rule_entities(self, rule_id):
        """Working-set entities; mapping tables are never read or written.

        Entity tuple keeps the shared 8-tuple shape (mapping_id, entity_name,
        source_schema, source_table, target_schema, target_table, source_system,
        target_system) where both sides name THE assessed system — identity only,
        no pair semantics; mapping_id stays NULL.
        """

        entities = []
        for table in self.working_set.tables:
            entities.append((
                None,
                table.entity_name,
                table.schema_name,
                table.table_name,
                table.schema_name,
                table.table_name,
                self.system_id,
                self.system_id,
            ))
        return entities

    def _build_parameters(self, entity):
        """Single-system parameters derived from the working set (no mapping rows)."""

        pma_table = self._tables_by_entity.get(entity[1])
        if pma_table is None:
            raise ValueError(f"Entity {entity[1]} not present in PMA working set")

        columns = pma_table.columns
        primary_key = next(
            (c.column_name for c in columns if c.is_primary_key), None
        )
        reconciliation_numeric = [
            c.column_name for c in columns
            if (c.data_type or "").lower() in RECONCILIATION_NUMERIC_TYPES
        ]

        return {
            "engine_db": self.engine_db,
            "mapping_id": None,
            "source_schema": entity[2],
            "source_table": entity[3],
            "target_schema": entity[2],
            "target_table": entity[3],
            "primary_key_column": primary_key,
            "numeric_column": reconciliation_numeric[0] if reconciliation_numeric else None,
            "numeric_columns": reconciliation_numeric,
            # No authoritative FK metadata exists for PMA and no FK inference is
            # performed — C09 therefore always takes its honest-skip path.
            "child_table": None,
            "parent_table": None,
            "fk_column": None,
        }

    def _build_relevant_columns_context(self, entity, result):
        """Working-set column identity for detail_json (no core.dataset_columns read)."""

        pma_table = self._tables_by_entity.get(entity[1])
        status = result.get("status") if isinstance(result, dict) else "UNKNOWN"
        columns = list(pma_table.columns) if pma_table else []
        primary_key = next((c.column_name for c in columns if c.is_primary_key), None)
        return {
            "control_id": self.control_id,
            "entity": entity[1],
            "status": status,
            "relevant_columns": {
                "columns": [
                    {
                        "column": c.column_name,
                        "data_type": c.data_type,
                        "is_nullable": c.is_nullable,
                        "column_position": c.column_position,
                        "is_primary_key": c.is_primary_key,
                    }
                    for c in columns
                ],
                "primary_key": primary_key,
                "not_null_columns": [c.column_name for c in columns if not c.is_nullable],
                "reconciliation_numeric_columns": [
                    c.column_name for c in columns
                    if (c.data_type or "").lower() in RECONCILIATION_NUMERIC_TYPES
                ],
                "column_count": len(columns),
            },
        }

    # ---------------------------------------------------------
    # PUBLIC ENTRY — single-system loop (base execute_rules untouched)
    # ---------------------------------------------------------

    def execute_rules(self):
        """Same public entry as the base class, but a single-system loop.

        Reuses base `_get_rules`, `execute_with_retry`, `_log_rule_execution`,
        `_log_exception` and `_log_control_summary`. The `_current_source_system`
        / `_current_target_system` host labels are deliberately never set, so no
        mirrored source_system/target_system keys are ever written to detail_json.
        """

        rules = self._get_rules()
        classification = PMA_CONTROL_CLASSIFICATION.get(self.control_id)

        total_rules = 0
        passed = 0
        failed = 0
        errors = 0
        skipped = 0
        blocked = False
        rule_execution_statuses = []

        for rule in rules:
            rule_id = rule[0]
            severity_level = rule[2]

            for entity in self._get_rule_entities(rule_id):

                total_rules += 1
                start_time_epoch = time.time()
                execution_status = "SKIPPED"
                result = {"status": "SKIPPED", "delta_value": 0}
                dataset_name = entity[1]

                try:
                    parameters = self._build_parameters(entity)
                    logger.info(
                        "            Running %s for %s (PMA single-system) ... ✅",
                        rule_id,
                        dataset_name,
                    )
                    result = self._execute_single_system(
                        classification, rule_id, parameters, entity
                    )
                    execution_status = result.get("status", "ERROR")
                except Exception as _e:  # noqa: BLE001 — base failure isolation parity
                    execution_status = "ERROR"
                    result = {"status": "ERROR", "error": str(_e), "delta_value": 0}
                    self._log_exception(
                        rule_id,
                        entity[1],
                        str(_e),
                        cause="EXECUTION_ERROR",
                        failure_scope="rule_execution",
                    )

                end_time_epoch = time.time()
                execution_time = round(end_time_epoch - start_time_epoch, 4)
                # Naive local timestamps match the base executor's stored values.
                rule_start_time = datetime.fromtimestamp(start_time_epoch)  # noqa: DTZ006
                rule_end_time = datetime.fromtimestamp(end_time_epoch)  # noqa: DTZ006

                self._log_rule_execution(
                    rule_id,
                    entity,
                    execution_status,
                    result.get("delta_value", 0),
                    execution_time,
                    severity_level,
                    rule_start_time,
                    rule_end_time,
                    result=result,
                )

                rule_execution_statuses.append(execution_status)

                if execution_status == "FAIL":
                    self._log_exception(
                        rule_id,
                        entity[1],
                        result,
                        cause=result.get("cause", "VALIDATION_FAILURE"),
                        failure_scope=result.get("failure_scope", "rule_validation"),
                    )
                    if severity_level and severity_level.upper() == "CRITICAL":
                        blocked = True

                if execution_status == "PASS":
                    passed += 1
                elif execution_status == "FAIL":
                    failed += 1
                elif execution_status == "SKIPPED":
                    skipped += 1
                    self._log_exception(
                        rule_id,
                        entity[1],
                        result.get("message", "Skipped"),
                        cause=result.get("cause", "SKIPPED"),
                        failure_scope="rule_skip",
                    )
                else:
                    errors += 1

        # Same status ladder as the base executor.
        if blocked:
            overall_status = "BLOCKED"
        elif errors > 0:
            overall_status = "ERROR"
        elif failed > 0:
            overall_status = "FAIL"
        elif rule_execution_statuses:
            if all(s == "SKIPPED" for s in rule_execution_statuses):
                overall_status = "SKIPPED"
            elif any(s in ("FAIL", "ERROR") for s in rule_execution_statuses):
                overall_status = "FAILED"
            else:
                overall_status = "PASS"
        else:
            overall_status = "SKIPPED"

        self._log_control_summary(
            overall_status,
            total_rules,
            passed,
            failed,
            errors,
            skipped,
        )

    # ---------------------------------------------------------
    # PER-CONTROL DISPATCH + SINGLE-SYSTEM INTERPRETATION
    # ---------------------------------------------------------

    def _execute_single_system(self, classification, rule_id, parameters, entity):
        if classification == "REUSABLE_MEASUREMENT":
            rule_instance = RuleFactory.create(
                rule_id, self.adapter, self.adapter, parameters
            )
            raw = self.execute_with_retry(rule_instance.execute)
            return self._interpret_measurement(raw, entity)
        if classification == "COLUMN_CAPABILITY":
            if self.control_id == "C05":
                return self._assess_null_capability(entity, parameters)
            return self._assess_type_capability(entity)
        if classification == "PROFILING":
            return self._profile_numeric_columns(entity, parameters)
        if classification == "FK_EVIDENCE":
            return self._skip_without_fk_metadata(entity)
        if classification == "INFORMATIONAL":
            return self._record_column_inventory(entity)
        raise ValueError(f"No PMA execution semantics for control {self.control_id}")

    def _pma_keys(self):
        return {
            "assessment_type": "PMA",
            "system_id": self.system_id,
            "system": self.system_name,
        }

    def _interpret_measurement(self, raw, entity):
        """Re-interpret a reused rule's result as a single-system measurement.

        Cross-side deltas of one system have no meaning; the per-side measurement
        the rule computed IS the evidence of the assessed system, and the verdict
        follows single-system semantics (baseline recorded / issue count), never
        side-delta equality.
        """

        status = raw.get("status", "ERROR")
        keys = self._pma_keys()
        control = self.control_id

        if status == "ERROR":
            return {
                **keys,
                "status": "ERROR",
                "error": raw.get("error") or raw.get("message") or raw.get("cause")
                or "rule error",
                "cause": raw.get("cause"),
                "delta_value": 0,
            }

        if control == "C01":
            if status == "SKIPPED":
                return self._skipped(keys, raw)
            return {
                **keys,
                "status": "PASS",
                "assessment": "BASELINE_RECORDED",
                "measurement": "row_count",
                "measured_value": raw.get("source_count"),
                "delta_value": None,
            }

        if control == "C02":
            if status == "SKIPPED":
                result = self._skipped(keys, raw)
                result["measurement"] = "sum"
                result["message"] = (
                    f"No decimal/numeric/float/real columns in {entity[1]}; "
                    "sum baseline skipped."
                )
                return result
            if "source_value" in raw:
                return {
                    **keys,
                    "status": "PASS",
                    "assessment": "BASELINE_RECORDED",
                    "measurement": "sum",
                    "measured_value": raw.get("source_value"),
                    "columns_checked": raw.get("columns_checked", 1),
                    "delta_value": None,
                }
            column_results = raw.get("column_results") or []
            return {
                **keys,
                "status": "PASS",
                "assessment": "BASELINE_RECORDED",
                "measurement": "sum",
                "measured_value": None,
                "columns_checked": raw.get("columns_checked", len(column_results)),
                "evidence": {
                    "column_sums": [
                        {"column": r.get("column"), "sum": r.get("source_value")}
                        for r in column_results
                    ]
                },
                "delta_value": None,
            }

        if control == "C04":
            if status == "SKIPPED":
                return self._skipped(keys, raw)
            return {
                **keys,
                "status": "PASS",
                "assessment": "BASELINE_RECORDED",
                "measurement": "column_count",
                "measured_value": raw.get("source_value"),
                "delta_value": None,
            }

        if control == "C07":
            if status == "SKIPPED":
                result = self._skipped(keys, raw)
                result["measurement"] = "duplicate_key_groups"
                result["message"] = (
                    f"No primary key detected for {entity[1]}; duplicate "
                    "detection skipped."
                )
                return result
            duplicate_groups = raw.get("source_value", 0) or 0
            if duplicate_groups > 0:
                return {
                    **keys,
                    "status": "FAIL",
                    "assessment": "DUPLICATE_KEYS_FOUND",
                    "measurement": "duplicate_key_groups",
                    "measured_value": duplicate_groups,
                    "cause": "DUPLICATE_KEY_GROUPS",
                    "message": (
                        f"{duplicate_groups} duplicate primary-key group(s) in "
                        f"{entity[1]} on {self.system_name}."
                    ),
                    "delta_value": duplicate_groups,
                }
            return {
                **keys,
                "status": "PASS",
                "assessment": "NO_DUPLICATE_KEYS",
                "measurement": "duplicate_key_groups",
                "measured_value": 0,
                "delta_value": 0,
            }

        # Unknown reusable control in the classification map: keep the raw result
        # (it still carries no fabricated pair keys beyond what the rule returned).
        return {**keys, **raw}

    @staticmethod
    def _skipped(keys, raw):
        return {
            **keys,
            "status": "SKIPPED",
            "assessment": "SKIPPED",
            "cause": raw.get("cause", "SKIPPED"),
            "message": raw.get("message", "Skipped"),
            "delta_value": 0,
        }

    def _assess_null_capability(self, entity, parameters):
        """C05 — per-column nullability capability of THE assessed system.

        Null counts are recorded for every working-set column; a FAIL is raised
        only for actual NULLs in columns declared NOT NULL (constraint violation).
        No null-rate threshold is invented (product decision stays open).
        """

        keys = self._pma_keys()
        pma_table = self._tables_by_entity[entity[1]]
        schema = entity[2]
        table = entity[3]

        checked = []
        violations = []
        unchecked = []
        total_violations = 0

        for column in pma_table.columns:
            if not _safe_identifier(column.column_name):
                unchecked.append({
                    "column": column.column_name,
                    "reason": "UNSAFE_IDENTIFIER",
                })
                continue
            query = (
                f"SELECT COUNT(*) FROM {schema}.{table} "
                f"WHERE {column.column_name} IS NULL"
            )
            rows = self.adapter.execute(query) or []
            null_count = int(rows[0][0]) if rows else 0
            checked.append({
                "column": column.column_name,
                "null_count": null_count,
                "declared_nullable": column.is_nullable,
            })
            if not column.is_nullable and null_count > 0:
                violations.append({
                    "column": column.column_name,
                    "null_count": null_count,
                })
                total_violations += null_count

        if not checked:
            return {
                **keys,
                "status": "SKIPPED",
                "assessment": "SKIPPED",
                "measurement": "not_null_violations",
                "cause": "NO_CHECKABLE_COLUMNS",
                "message": f"No checkable columns in {entity[1]}.",
                "evidence": {"checked": checked, "unchecked": unchecked},
                "delta_value": 0,
            }

        evidence = {"checked": checked, "unchecked": unchecked}
        if violations:
            return {
                **keys,
                "status": "FAIL",
                "assessment": "NOT_NULL_VIOLATION",
                "measurement": "not_null_violations",
                "measured_value": total_violations,
                "cause": "NOT_NULL_VIOLATION",
                "message": (
                    f"NULL values in NOT NULL-declared column(s) of {entity[1]}: "
                    + ", ".join(v["column"] for v in violations)
                ),
                "columns_checked": len(checked),
                "evidence": {**evidence, "violations": violations},
                "delta_value": total_violations,
            }

        return {
            **keys,
            "status": "PASS",
            "assessment": "NO_NOT_NULL_VIOLATIONS",
            "measurement": "not_null_violations",
            "measured_value": 0,
            "columns_checked": len(checked),
            "evidence": evidence,
            "delta_value": 0,
        }

    def _assess_type_capability(self, entity):
        """C06 — data-type capability of THE system's declared columns.

        The working set already carries each column's live catalog type; this
        records the type inventory and fails only if a column has no resolvable
        type. No mapping-dependent path, no second side to compare.
        """

        keys = self._pma_keys()
        pma_table = self._tables_by_entity[entity[1]]
        columns = pma_table.columns
        if not columns:
            return {
                **keys,
                "status": "SKIPPED",
                "assessment": "SKIPPED",
                "measurement": "typed_columns",
                "cause": "NO_COLUMNS",
                "message": f"No columns discovered for {entity[1]}.",
                "delta_value": 0,
            }

        resolved = [
            {"column": c.column_name, "data_type": c.data_type}
            for c in columns if (c.data_type or "").strip()
        ]
        unresolved = [c.column_name for c in columns if not (c.data_type or "").strip()]

        if unresolved:
            return {
                **keys,
                "status": "FAIL",
                "assessment": "UNRESOLVED_DATA_TYPE",
                "measurement": "typed_columns",
                "measured_value": len(resolved),
                "cause": "UNRESOLVED_DATA_TYPE",
                "message": (
                    f"Column(s) without a resolvable data type in {entity[1]}: "
                    + ", ".join(unresolved)
                ),
                "columns_checked": len(columns),
                "evidence": {"types": resolved, "unresolved": unresolved},
                "delta_value": len(unresolved),
            }

        return {
            **keys,
            "status": "PASS",
            "assessment": "TYPE_CAPABILITY_RECORDED",
            "measurement": "typed_columns",
            "measured_value": len(resolved),
            "columns_checked": len(columns),
            "evidence": {"types": resolved},
            "delta_value": 0,
        }

    def _profile_numeric_columns(self, entity, parameters):
        """C08 — actual single-system profiling evidence.

        Reuses the C08 rule's stats computation (AVG/MIN/MAX/STDDEV) exactly once
        per column against the assessed system. No drift verdict, no second side,
        no threshold interpretation.
        """

        keys = self._pma_keys()
        numeric_columns = parameters.get("numeric_columns") or []
        if not numeric_columns:
            return {
                **keys,
                "status": "SKIPPED",
                "assessment": "SKIPPED",
                "measurement": "numeric_profile",
                "cause": "NO_NUMERIC_COLUMNS",
                "message": (
                    f"Table {entity[1]} has no decimal/numeric/float/real columns "
                    "to profile."
                ),
                "delta_value": 0,
            }

        stats_rule = C08DataDriftDetectionRule(
            self.adapter, self.adapter, parameters
        )
        profile = {}
        unavailable = []
        for column in numeric_columns:
            stats = stats_rule._get_stats(
                self.adapter, entity[2], entity[3], column
            )
            if stats is None:
                unavailable.append(column)
                continue
            profile[column] = stats

        if not profile:
            return {
                **keys,
                "status": "ERROR",
                "error": "profiling statistics unavailable",
                "cause": "STATS_UNAVAILABLE",
                "message": (
                    f"Profiling statistics unavailable for {entity[1]} "
                    f"column(s): {', '.join(unavailable)}."
                ),
                "delta_value": 0,
            }

        return {
            **keys,
            "status": "PASS",
            "assessment": "PROFILE_RECORDED",
            "measurement": "numeric_profile",
            "measured_value": len(profile),
            "columns_checked": len(numeric_columns),
            "evidence": {"profile": profile, "unavailable_columns": unavailable},
            "delta_value": None,
        }

    def _skip_without_fk_metadata(self, entity):
        """C09 — honest skip: no authoritative FK metadata exists for PMA.

        No FK inference is performed and no mapping/inventory FK tags are read;
        if genuine FK metadata ever becomes available it must be labelled
        INFERRED before use.
        """

        keys = self._pma_keys()
        return {
            **keys,
            "status": "SKIPPED",
            "assessment": "SKIPPED_NO_FK_EVIDENCE",
            "measurement": "referential_coverage",
            "cause": "NO_FK_METADATA",
            "message": (
                f"No authoritative foreign-key metadata available for {entity[1]}; "
                "referential coverage not assessed (no FK inference performed)."
            ),
            "evidence": {"fk_metadata_source": "none", "fk_inference": "not_performed"},
            "delta_value": 0,
        }

    def _record_column_inventory(self, entity):
        """C010 — informational column inventory of THE assessed system.

        The MA rule's column-set difference has no single-system verdict meaning,
        so PMA records the inventory as informational evidence instead of a
        comparative drift result.
        """

        keys = self._pma_keys()
        pma_table = self._tables_by_entity[entity[1]]
        columns = pma_table.columns
        if not columns:
            return {
                **keys,
                "status": "SKIPPED",
                "assessment": "SKIPPED",
                "measurement": "column_inventory",
                "cause": "NO_COLUMNS",
                "message": f"No columns discovered for {entity[1]}.",
                "delta_value": 0,
            }

        inventory = [
            {"column": c.column_name, "data_type": c.data_type} for c in columns
        ]
        return {
            **keys,
            "status": "PASS",
            "assessment": "INFORMATIONAL",
            "measurement": "column_inventory",
            "measured_value": len(inventory),
            "columns_checked": len(inventory),
            "evidence": {"columns": inventory},
            "delta_value": None,
        }
