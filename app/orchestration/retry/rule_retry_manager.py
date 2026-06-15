import logging

logger = logging.getLogger(__name__)


class RuleRetryManager:
    """
    SELECTIVE RULE RETRY (v1)

    - retries ONLY failed rules
    - no re-execution of successful rules
    """

    def __init__(self, max_retries=1):
        self.max_retries = max_retries

    def get_failed_rules(self, results):
        return [
            r for r in results
            if r.get("status") == "FAILED"
        ]

    def should_retry(self, retry_count):
        return retry_count < self.max_retries

    def retry(self, isolated_executor, context, results):

        retry_count = 0
        final_results = results.copy()

        while True:

            failed_rules = self.get_failed_rules(final_results)

            if not failed_rules:
                logger.info("[RETRY] No failed rules. Skipping retry.")
                break

            if not self.should_retry(retry_count):
                logger.warning(
                    f"[RETRY] Max retries reached ({self.max_retries})."
                )
                break

            retry_count += 1

            logger.info(
                f"[RETRY] Attempt {retry_count} | failed_rules={len(failed_rules)}"
            )

            retry_results = []

            for rule_result in failed_rules:

                rule = {"rule_id": rule_result["rule_id"]}

                try:
                    single_result = isolated_executor.execute(
                        **context,
                        mappings={
                            **context["mappings"],
                            "rules": [rule]
                        }
                    )

                    retry_results.extend(single_result)

                except Exception as e:
                    logger.error(
                        f"[RETRY_FAILED] rule={rule.get('rule_id')} error={str(e)}"
                    )
                    retry_results.append({
                        "rule_id": rule.get("rule_id"),
                        "status": "FAILED",
                        "error": str(e)
                    })

            # merge results (replace old failed entries)
            final_results = [
                r for r in final_results if r["status"] != "FAILED"
            ] + retry_results

        return final_results