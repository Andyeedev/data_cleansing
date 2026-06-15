import logging
from logging import config
from platform import system
from app.services.credential_service import CredentialService
from app.security.crypto import decrypt_password
from app.api.core.encryption_manager import EncryptionManager
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ConnectionResolver:
    def __init___legacy(self, engine_db, schema="core"):
        self.engine_db = engine_db
        self.schema = schema   # ✅ THIS IS THE FIX

    def __init__(self, engine_db, schema="core"):
        self.engine_db = engine_db
        self.schema = schema   # ✅ THIS IS THE FIX


    def get_connections_legacy(self, project_id: str):
        """
        Returns:
            {
                "SOURCE": adapter,
                "TARGET": adapter
            }
        """

        systems = self._load_systems(project_id)

        connections = {}

        for system in systems:
            role = system["system_role"]
            adapter = self._build_adapter(system)

            if adapter is None:
                raise RuntimeError(f"Failed to build adapter for {role}")

            connections[role] = adapter

        return connections


    def get_connections_legacy_2(self, project_id: str):
        """
        Returns:
            {
                "SOURCE": adapter,
                "TARGET": adapter
            }
        """

        systems = self._load_systems(project_id)

        connections = {}

        for system in systems:

            # ✅ NEW: skip inactive systems
            if not system.get("is_active", True):
                logger.info(f"⏭️ Skipping inactive system: {system['system_role']}")
                continue

            role = system["system_role"]

            try:
                adapter = self._build_adapter(system)

                if adapter:
                    connections[role] = adapter

            except NotImplementedError as e:
                logger.warning(f"⚠️ Skipping unsupported system {role}: {str(e)}")
                continue

        return connections


    def get_connections(self, project_id: str):

        systems = self._load_systems(project_id)

        connections = {
            "SOURCE": {},
            "TARGET": {}
        }

        for system in systems:

            if not system.get("is_active", True):
                logger.info(f"⏭️ Skipping inactive system: {system['system_role']}")
                continue

            role = system["system_role"]

            try:
                adapter = self._build_adapter(system)

                if not adapter:
                    continue

                # ✅ NEW: support multiple per role
                connections.setdefault(role, {})
                connections[role][system["system_id"]] = adapter

            except NotImplementedError as e:
                logger.warning(f"⚠️ Skipping unsupported system {role}: {str(e)}")
                continue

        return connections

    def _load_systems_curent_1(self, project_id):
        query = """
        SELECT 
            system_id,
            system_role,
            database_type,
            connection_config,
            credential_id
        FROM engine.system_registry
        WHERE project_id = %s
        """

        rows = self.engine_db.execute(query, (project_id,))

        systems = []
        for r in rows:
            systems.append({
                "system_id": r[0],
                "system_role": r[1],
                "database_type": r[2],
                "connection_config": r[3],
                "credential_id": r[4]
            })

        return systems
    
    def _load_systems_legacy(self, project_id):
        #query = """
        #    SELECT system_id, system_role, database_type, connection_config, credential_id
        #    FROM engine.system_registry
        #    WHERE project_id = %s
        #"""
        query = f"""
            SELECT system_id, system_role, database_type, connection_config, credential_id, is_active
            FROM {self.schema}.system_registry
            WHERE project_id = %s
        """
        rows = self.engine_db.execute(query, (project_id,))

        systems = []
        for r in rows:
            systems.append({
                "system_id": r[0],
                "system_role": r[1],
                "database_type": r[2],
                "connection_config": r[3],
                "credential_id": r[4],
                "is_active": r[5]   # ✅ NEW: include active flag
            })
        return systems

    def _load_systems_legacy(self, project_id):

        query = f"""
            SELECT 
                system_id,
                system_role,
                database_type,
                connection_config,
                credential_id,
                is_active
            FROM {self.schema}.system_registry
            WHERE project_id = %s
        """

        rows = self.engine_db.execute(query, (project_id,))

        systems = []

        for r in rows:
            systems.append({
                "system_id": r[0],
                "system_role": r[1],
                "database_type": r[2],
                "connection_config": r[3],
                "credential_id": r[4],
                "is_active": r[5]
            })

        return systems
    
    def _load_systems(self, project_id):

        query = f"""
            SELECT 
                system_id,
                system_role,
                database_type,
                connection_config,
                credential_id,
                is_active,
                schema_name
            FROM {self.schema}.system_registry
            WHERE project_id = %s
        """

        rows = self.engine_db.execute(query, (project_id,))

        systems = []

        for r in rows:
            systems.append({
                "system_id": r[0],
                "system_role": r[1],
                "database_type": r[2],
                "connection_config": r[3],
                "credential_id": r[4],
                "is_active": r[5],
                "schema_name": r[6],   # ✅ NEW
            })

        return systems


    def _build_adapter_legacy(self, system):
        from app.db.connection_factory import connection_factory

        logger.info(f"Building adapter for {system['system_role']}")

        config = system["connection_config"].copy()

        db_type = system.get("database_type") or system.get("db_type") or system.get("type")

        if not db_type:
            raise RuntimeError(f"❌ Missing database_type for system: {system}")

        db_type = db_type.lower().strip()

        # ✅ HARD STOP FOR DISABLED TYPES (extra safety)
        #if db_type == "sqlserver":
        #    logger.warning(f"⏭️ SQL Server disabled — skipping {system['system_role']}")
        #    return None

        config["type"] = db_type

        creds = self._get_credentials(system["credential_id"])
        config["user"] = creds["username"]
        config["password"] = creds["password"]

        logger.info(f"DB TYPE: {config.get('type')}")
        logger.info(f"HOST: {config.get('host')}")
        logger.info(f"DATABASE: {config.get('database')}")

        return connection_factory(config)


    def _build_adapter_legacy_2(self, system):

        from app.db.connection_factory import connection_factory

        logger.info(f"Building adapter for {system['system_role']}")

        config = system["connection_config"].copy()

        db_type = system.get("database_type") or system.get("db_type") or system.get("type")

        if not db_type:
            raise RuntimeError(f"❌ Missing database_type for system: {system}")

        db_type = db_type.lower().strip()

        # ✅ HARD STOP FOR DISABLED TYPES
        if db_type == "sqlserver":
            logger.warning(f"⏭️ SQL Server disabled — skipping {system['system_role']}")
            return None

        config["type"] = db_type

        creds = self._get_credentials(system["credential_id"])
        config["user"] = creds["username"]
        config["password"] = creds["password"]

        logger.info(f"DB TYPE: {config.get('type')}")
        logger.info(f"HOST: {config.get('host')}")
        logger.info(f"DATABASE: {config.get('database')}")

        adapter = connection_factory(config)

        # ✅ CORRECT PLACE FOR YOUR NEW LOG
        logger.info(
            f"✅ Adapter created | ROLE={system['system_role']} | TYPE={config['type']}"
        )

        return adapter

    def _build_adapter(self, system):

        from app.db.connection_factory import connection_factory

        role = system['system_role'].title()
        db_type = (system.get("database_type") or system.get("db_type") or system.get("type") or "database").upper()
        host = system["connection_config"].get("host", "localhost")

        logger.debug(f"    Resolving {role}: {db_type} ({host}) ...")

        config = system["connection_config"].copy()

        db_type_resolved = system.get("database_type") or system.get("db_type") or system.get("type")

        if not db_type_resolved:
            raise RuntimeError(f"❌ Missing database_type for system: {system}")

        db_type_resolved = db_type_resolved.lower().strip()
        config["type"] = db_type_resolved

        try:
            creds = self._get_credentials(system["credential_id"])
            config["user"] = creds["username"]
            config["password"] = creds["password"]

            logger.debug(f"DB TYPE: {config.get('type')}")
            logger.debug(f"HOST: {config.get('host')}")
            logger.debug(f"DATABASE: {config.get('database')}")

            adapter = connection_factory(config)

            logger.info(f"    Resolving {role}: {db_type} ({host}) [ID: {system['system_id']}] ... ✅")

            from app.utils.logger import get_audit_logger
            audit_logger = get_audit_logger()
            audit_logger.audit(f"CONNECTION_RESOLVED | Role: {role.upper()} | System: {db_type} ({host}) | ID: {system['system_id']} | Outcome: SUCCESS")

            return adapter
        except Exception as e:
            logger.info(f"    Resolving {role}: {db_type} ({host}) [ID: {system['system_id']}] ... ❌")
            
            from app.utils.logger import get_audit_logger
            audit_logger = get_audit_logger()
            audit_logger.audit(f"CONNECTION_RESOLVED | Role: {role.upper()} | System: {db_type} ({host}) | ID: {system['system_id']} | Outcome: FAILED | Error: {str(e)}")
            
            raise

    def _get_credentials(self, credential_id):
        query = f"""
            SELECT username, password_encrypted, encryption_key_id
            FROM {self.schema}.system_credentials
            WHERE credential_id = %s
        """

        rows = self.engine_db.execute(query, (credential_id,))

        if not rows:
            raise RuntimeError(f"No credentials found for {credential_id}")

        username, encrypted_password, key_id = rows[0]

        logger.debug("🔐 [connection_resolver.py::_get_credentials]")
        logger.debug(f"KEY ID: {key_id}")
        logger.debug(f"RAW TYPE: {type(encrypted_password)}")

        # 🔐 Decrypt password
        encryption_manager = EncryptionManager()
        decrypted_password = encryption_manager.decrypt(encrypted_password)

        return {
            "username": username,
            "password": decrypted_password
        }


    def _get_encryption_key(self, key_id):
        import os

        key = os.getenv("FERNET_KEY")

        if not key:
            raise RuntimeError("❌ FERNET_KEY not set in environment")

        return key


    

    