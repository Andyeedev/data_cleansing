class CredentialRepository:

    def __init__(self, conn):
        self.conn = conn

    # DEV-001: tenancy derived ONLY via system → project → tenant.
    # sr.tenant_id is transient (rollback aid) and MUST NOT be used as authority.
    def _scope(self, tenant_id=None, project_id=None):
        join = "JOIN core.system_registry sr ON sc.system_id = sr.system_id"
        conds = []
        params: list = []
        if tenant_id:
            join += " JOIN core.projects p ON p.project_id = sr.project_id"
            conds.append("p.tenant_id = %s")
            params.append(tenant_id)
        if project_id:
            conds.append("sr.project_id = %s")
            params.append(project_id)
        return join, conds, params

    def get_by_system_id(self, system_id, tenant_id=None, project_id=None):
        if tenant_id or project_id:
            join, conds, params = self._scope(tenant_id, project_id)
            query = f"""
            SELECT sc.credential_id, sc.username, sc.password_encrypted
            FROM core.system_credentials sc
            {join}
            WHERE sc.system_id = %s AND {" AND ".join(conds)}
            """
            params = (system_id, *params)
        else:
            query = """
            SELECT credential_id, username, password_encrypted
            FROM core.system_credentials
            WHERE system_id = %s
            """
            params = (system_id,)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchone()

    def get_by_credential_id(self, credential_id, tenant_id=None, project_id=None):
        if tenant_id or project_id:
            join, conds, params = self._scope(tenant_id, project_id)
            query = f"""
            SELECT sc.credential_id, sc.username, sc.password_encrypted, sc.system_id
            FROM core.system_credentials sc
            {join}
            WHERE sc.credential_id = %s AND {" AND ".join(conds)}
            """
            params = (credential_id, *params)
        else:
            query = """
            SELECT credential_id, username, password_encrypted, system_id
            FROM core.system_credentials
            WHERE credential_id = %s
            """
            params = (credential_id,)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchone()

    def insert(self, credential_id, system_id, username, password_encrypted, tenant_id=None, project_id=None):
        # DEV-001: insert guard derives tenancy via system → project → tenant.
        if tenant_id or project_id:
            guard_conds = []
            guard_params: list = []
            if tenant_id:
                guard_conds.append("""EXISTS (
                    SELECT 1 FROM core.system_registry sr
                    JOIN core.projects p ON p.project_id = sr.project_id
                    WHERE sr.system_id = %s AND p.tenant_id = %s
                )""")
                guard_params.extend([system_id, tenant_id])
            if project_id:
                guard_conds.append("""EXISTS (
                    SELECT 1 FROM core.system_registry sr
                    WHERE sr.system_id = %s AND sr.project_id = %s
                )""")
                guard_params.extend([system_id, project_id])
            query = """
            INSERT INTO core.system_credentials (
                credential_id,
                system_id,
                username,
                password_encrypted,
                encryption_key_id
            )
            SELECT %s, %s, %s, %s, 'env-key-1'
            WHERE """ + " AND ".join(guard_conds)
            params = (credential_id, system_id, username, password_encrypted, *guard_params)
        else:
            query = """
            INSERT INTO core.system_credentials (
                credential_id,
                system_id,
                username,
                password_encrypted,
                encryption_key_id
            )
            VALUES (%s, %s, %s, %s, 'env-key-1')
            """
            params = (credential_id, system_id, username, password_encrypted)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            rows_affected = cur.rowcount
        self.conn.commit()
        return rows_affected > 0

    def update(self, credential_id, username, password_encrypted, tenant_id=None, project_id=None):
        if tenant_id or project_id:
            scope_filter = ""
            scope_params: list = []
            if tenant_id:
                scope_filter += """ AND sc.system_id IN (
                    SELECT sr.system_id FROM core.system_registry sr
                    JOIN core.projects p ON p.project_id = sr.project_id
                    WHERE p.tenant_id = %s
                )"""
                scope_params.append(tenant_id)
            if project_id:
                scope_filter += """ AND sc.system_id IN (
                    SELECT sr.system_id FROM core.system_registry sr
                    WHERE sr.project_id = %s
                )"""
                scope_params.append(project_id)
            query = """
            UPDATE core.system_credentials sc
            SET username = %s,
                password_encrypted = %s
            WHERE credential_id = %s""" + scope_filter
            params = (username, password_encrypted, credential_id, *scope_params)
        else:
            query = """
            UPDATE core.system_credentials
            SET username = %s,
                password_encrypted = %s
            WHERE credential_id = %s
            """
            params = (username, password_encrypted, credential_id)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            rows_affected = cur.rowcount
        self.conn.commit()
        return rows_affected > 0

    def delete(self, credential_id, tenant_id=None, project_id=None):
        if tenant_id or project_id:
            scope_filter = ""
            scope_params: list = []
            if tenant_id:
                scope_filter += """ AND sc.system_id IN (
                    SELECT sr.system_id FROM core.system_registry sr
                    JOIN core.projects p ON p.project_id = sr.project_id
                    WHERE p.tenant_id = %s
                )"""
                scope_params.append(tenant_id)
            if project_id:
                scope_filter += """ AND sc.system_id IN (
                    SELECT sr.system_id FROM core.system_registry sr
                    WHERE sr.project_id = %s
                )"""
                scope_params.append(project_id)
            query = """
            DELETE FROM core.system_credentials sc
            WHERE credential_id = %s""" + scope_filter
            params = (credential_id, *scope_params)
        else:
            query = "DELETE FROM core.system_credentials WHERE credential_id = %s"
            params = (credential_id,)
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            rows_affected = cur.rowcount
        self.conn.commit()
        return rows_affected > 0

    def get_all(self, tenant_id=None, project_id=None):
        if tenant_id or project_id:
            join, conds, scope_params = self._scope(tenant_id, project_id)
            query = f"""
            SELECT sc.credential_id, sc.username
            FROM core.system_credentials sc
            {join}
            WHERE {" AND ".join(conds)}
            """
            params = tuple(scope_params)
        else:
            query = "SELECT credential_id, username FROM core.system_credentials"
            params = None
        with self.conn.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            return cur.fetchall()
