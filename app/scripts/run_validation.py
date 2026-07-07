import psycopg2
import importlib
import os

from app.governance.risk_scoring import calculate_migration_risk


ENGINE_SCHEMA = "engine"
RULES_PATH = "app.rules"


def get_connection():

    return psycopg2.connect(
        host="localhost",
        database="migration_engine",
        user="postgres",
        password="postgres"
    )


def discover_rules():

    rules = []

    rules_directory = os.path.join(os.getcwd(), "app", "rules")

    for file in os.listdir(rules_directory):

        if file.endswith("_rule.py"):

            module_name = file.replace(".py", "")

            module = importlib.import_module(f"{RULES_PATH}.{module_name}")

            if hasattr(module, "run_rule"):
                rules.append(module)

    return rules


def execute_rules(conn, tenant_id, batch_id):

    rules = discover_rules()

    cursor = conn.cursor()

    for rule in rules:

        print(f"Executing {rule.__name__}")

        try:

            result = rule.run_rule(conn)

            cursor.execute(
                """
                INSERT INTO engine.migration_control_execution
                (tenant_id,
                 batch_id,
                 control_id,
                 entity_name,
                 execution_status,
                 delta_value,
                 source_value,
                 target_value)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    tenant_id,
                    batch_id,
                    result["control_id"],
                    result["entity_name"],
                    result["status"],
                    result.get("delta"),
                    result.get("source_value"),
                    result.get("target_value"),
                ),
            )

            if result["status"] == "FAIL":

                cursor.execute(
                    """
                    INSERT INTO engine.migration_control_exceptions
                    (tenant_id,
                     batch_id,
                     control_id,
                     entity_name,
                     delta_value,
                     source_value,
                     target_value,
                     failure_scope)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        tenant_id,
                        batch_id,
                        result["control_id"],
                        result["entity_name"],
                        result.get("delta"),
                        result.get("source_value"),
                        result.get("target_value"),
                        result.get("failure_scope"),
                    ),
                )

            conn.commit()

        except Exception as e:

            print(f"Rule {rule.__name__} failed with error: {e}")

            conn.rollback()


def main():

    tenant_id = "bank_a"
    batch_id = "MIG_001"

    conn = get_connection()

    execute_rules(conn, tenant_id, batch_id)

    calculate_migration_risk(conn, tenant_id, batch_id)

    conn.close()

    print("Migration validation complete")


if __name__ == "__main__":
    main()
