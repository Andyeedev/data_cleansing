#Example:

def record_decision(conn,
                    tenant_id,
                    batch_id,
                    control_id,
                    entity_name,
                    decision,
                    reason,
                    user):

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO engine.migration_control_decisions
        (tenant_id,batch_id,control_id,entity_name,decision,decision_reason,decided_by)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (tenant_id,
          batch_id,
          control_id,
          entity_name,
          decision,
          reason,
          user))

    conn.commit()