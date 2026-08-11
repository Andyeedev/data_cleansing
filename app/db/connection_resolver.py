from app.api.core.encryption_manager import EncryptionManager
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ConnectionResolver:
    def __init__(self, engine_db, schema="core"):
        self.engine_db = engine_db
        self.schema = schema

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

                connections.setdefault(role, {})
                connections[role][system["system_id"]] = adapter

            except (NotImplementedError, ModuleNotFoundError, ImportError) as e:
                logger.warning(f"⚠️ Skipping unsupported system {role}: {str(e)}")
                continue

        return connections

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
                "schema_name": r[6],
            })

        return systems

    def _build_adapter(self, system):

        from app.db.connection_factory import connection_factory

        role = system['system_role'].title()
        db_type = (system.get("database_type") or system.get(
            "db_type") or system.get("type") or "database").upper()
        host = system["connection_config"].get("host", "localhost")

        logger.debug(f"    Resolving {role}: {db_type} ({host}) ...")

        config = system["connection_config"].copy()

        db_type_resolved = system.get("database_type") or system.get(
            "db_type") or system.get("type")

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

            logger.info(
                f"    Resolving {role}: {db_type} ({host}) [ID: {system['system_id']}] ... ✅")

            from app.utils.logger import get_audit_logger
            audit_logger = get_audit_logger()
            audit_message = (
                f"CONNECTION_RESOLVED | Role: {role.upper()} | "
                f"System: {db_type} ({host}) | ID: {system['system_id']} | Outcome: SUCCESS"
            )
            audit_logger.audit(audit_message)

            return adapter
        except Exception as e:
            logger.info(
                f"    Resolving {role}: {db_type} ({host}) [ID: {system['system_id']}] ... ❌")

            from app.utils.logger import get_audit_logger
            audit_logger = get_audit_logger()
            audit_message = (
                f"CONNECTION_RESOLVED | Role: {role.upper()} | "
                f"System: {db_type} ({host}) | ID: {system['system_id']} | Outcome: FAILED | "
                f"Error: {str(e)}"
            )
            audit_logger.audit(audit_message)

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

        encryption_manager = EncryptionManager()
        decrypted_password = encryption_manager.decrypt(encrypted_password)

        return {
            "username": username,
            "password": decrypted_password
        }
