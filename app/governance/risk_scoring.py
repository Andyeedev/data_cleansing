import psycopg2

def calculate_migration_risk(conn, tenant_id, batch_id):

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            COUNT(*) AS total,
            SUM(CASE WHEN execution_status='FAIL' THEN 1 ELSE 0 END) AS failures,
            SUM(CASE WHEN execution_status='ERROR' THEN 1 ELSE 0 END) AS errors
        FROM engine.migration_control_execution
        WHERE tenant_id=%s AND batch_id=%s
    """, (tenant_id, batch_id))

    total, failures, errors = cursor.fetchone()

    if total == 0:
        return

    risk_score = ((failures + errors) / total) * 100

    if risk_score < 5:
        risk_level = "LOW"
    elif risk_score < 15:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    cursor.execute("""
        INSERT INTO engine.migration_risk_scores
        (tenant_id, batch_id, risk_score, risk_level)
        VALUES (%s,%s,%s,%s)
    """, (tenant_id, batch_id, int(risk_score), risk_level))

    conn.commit()