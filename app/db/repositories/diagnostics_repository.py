class DiagnosticsRepository:

    def __init__(self, conn):
        self.conn = conn

    def insert_check(self, system_id, check_name, status, message, latency_ms=None, server_version=None):
        query = """
        INSERT INTO core.connection_diagnostics (
            system_id, check_name, status, message, latency_ms, server_version
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING diagnostic_id, checked_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (system_id, check_name, status, message, latency_ms, server_version))
            result = cur.fetchone()
        self.conn.commit()
        return result

    def get_latest_by_system(self, system_id):
        query = """
        SELECT diagnostic_id, check_name, status, message, latency_ms, server_version, checked_at
        FROM core.connection_diagnostics
        WHERE system_id = %s
        ORDER BY checked_at DESC
        LIMIT 50
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (system_id,))
            return cur.fetchall()

    def get_all_systems_summary(self, tenant_id=None):
        if tenant_id:
            query = """
            SELECT
                s.system_id,
                s.system_name,
                s.database_type,
                s.system_role,
                d.check_name,
                d.status,
                d.message,
                d.latency_ms,
                d.server_version,
                d.checked_at
            FROM core.system_registry s
            LEFT JOIN LATERAL (
                SELECT check_name, status, message, latency_ms, server_version, checked_at
                FROM core.connection_diagnostics
                WHERE system_id = s.system_id
                ORDER BY checked_at DESC
                LIMIT 1
            ) d ON true
            WHERE s.tenant_id = %s
            ORDER BY s.system_name
            """
            params = (tenant_id,)
        else:
            query = """
            SELECT
                s.system_id,
                s.system_name,
                s.database_type,
                s.system_role,
                d.check_name,
                d.status,
                d.message,
                d.latency_ms,
                d.server_version,
                d.checked_at
            FROM core.system_registry s
            LEFT JOIN LATERAL (
                SELECT check_name, status, message, latency_ms, server_version, checked_at
                FROM core.connection_diagnostics
                WHERE system_id = s.system_id
                ORDER BY checked_at DESC
                LIMIT 1
            ) d ON true
            ORDER BY s.system_name
            """
            params = None

        with self.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            return cur.fetchall()

    def get_history_by_system(self, system_id, limit=20):
        query = """
        SELECT diagnostic_id, check_name, status, message, latency_ms, server_version, checked_at
        FROM core.connection_diagnostics
        WHERE system_id = %s
        ORDER BY checked_at DESC
        LIMIT %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (system_id, limit))
            return cur.fetchall()

    def get_health_counts(self, tenant_id=None):
        if tenant_id:
            query = """
            WITH latest_checks AS (
                SELECT DISTINCT ON (cd.system_id)
                    cd.system_id, cd.status
                FROM core.connection_diagnostics cd
                JOIN core.system_registry s ON s.system_id = cd.system_id
                WHERE s.tenant_id = %s
                ORDER BY cd.system_id, cd.checked_at DESC
            )
            SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status = 'pass') AS healthy,
                COUNT(*) FILTER (WHERE status != 'pass') AS unhealthy
            FROM latest_checks
            """
            params = (tenant_id,)
        else:
            query = """
            WITH latest_checks AS (
                SELECT DISTINCT ON (system_id)
                    system_id, status
                FROM core.connection_diagnostics
                ORDER BY system_id, checked_at DESC
            )
            SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status = 'pass') AS healthy,
                COUNT(*) FILTER (WHERE status != 'pass') AS unhealthy
            FROM latest_checks
            """
            params = None

        with self.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            return cur.fetchone()

    def delete_old_checks(self, system_id, keep_count=100):
        query = """
        DELETE FROM core.connection_diagnostics
        WHERE diagnostic_id IN (
            SELECT diagnostic_id
            FROM core.connection_diagnostics
            WHERE system_id = %s
            ORDER BY checked_at DESC
            OFFSET %s
        )
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (system_id, keep_count))
        self.conn.commit()
