from app.discovery.auto_rule_discovery import AutoRuleDiscovery
from app.rule_executor import RuleExecutor


def run_execution_pipeline(core_conn, source_db, project_id):

    print("\n🚀 RUNNING EXECUTION PIPELINE")

    # 🔹 1. AUTO RULE DISCOVERY
    discovery = AutoRuleDiscovery(core_conn, source_db, project_id)

    rules = discovery.generate_rules()  # ⚠️ remove project_id if already in constructor

    print(f"✅ Generated {len(rules)} rules")

    # 🔹 2. RULE EXECUTION
    executor = RuleExecutor(core_conn)

    results = executor.execute_rules(project_id, rules)

    print("✅ Rule execution completed")

    # 🔹 3. SCORING
    passed = sum(1 for r in results if r["status"] == "PASS")
    failed = sum(1 for r in results if r["status"] == "FAIL")

    print("\n📊 RESULTS")
    print(f"PASS: {passed}")
    print(f"FAIL: {failed}")

    print("\n🎉 EXECUTION PIPELINE COMPLETE")