import logging
import time

logger = logging.getLogger(__name__)


class RuleIsolationExecutor:
    """
    RULE-LEVEL ISOLATION LAYER (v1)

    Responsibility:
    - isolate rule execution failures
    - prevent single rule failure from breaking control
    - standardize execution result format
    """

    def __init__(self, executor_factory):
        """
        executor_factory: callable that returns RuleExecutor
        """
        self.executor_factory = executor_factory

    def execute(self, source_adapter, target_adapter, engine_db,
                batch_id, project_id, control_id, config, mappings):

        results = []

        rules = mappings.get("rules", [])

        for rule in rules:

            start = time.time()

            try:
                executor = self.executor_factory(
                    engine_db=engine_db,
                    source_adapter=source_adapter,
                    target_adapter=target_adapter,
                    batch_id=batch_id,
                    project_id=project_id,
                    control_id=control_id,
                    config=config,
                    mappings=mappings,
                    rule=rule
                )

                logger.info(
                    f"[RULE_START] control={control_id} rule={rule.get('rule_id')}"
                )

                result = executor.execute_single_rule(rule)

                results.append({
                    "rule_id": rule.get("rule_id"),
                    "status": "SUCCESS",
                    "duration": round(time.time() - start, 3),
                    "result": result
                })

            except Exception as e:

                logger.error(
                    f"[RULE_FAILED] control={control_id} rule={rule.get('rule_id')} error={str(e)}"
                )

                results.append({
                    "rule_id": rule.get("rule_id"),
                    "status": "FAILED",
                    "error": str(e),
                    "duration": round(time.time() - start, 3)
                })

        return results