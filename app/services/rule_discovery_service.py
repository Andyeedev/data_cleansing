from app.db.connection import get_db_connection
from app.repositories.rule_discovery_repository import RuleDiscoveryRepository
from app.discovery.auto_rule_discovery import AutoRuleDiscovery


class RuleDiscoveryService:

    def __init__(self):
        self.repository = RuleDiscoveryRepository()

    def get_discovered_rules(self, project_id: str) -> dict:
        rows = self.repository.get_discovered_rules(project_id)
        rules = [
            {
                "rule_id": row[1],
                "rule_name": row[2],
                "control_id": row[3],
                "enabled_flag": row[4],
                "dataset_name": f"{row[5]}.{row[6]}" if row[5] and row[6] else None,
                "mapping_id": str(row[0]),
            }
            for row in rows
        ]
        return {
            "project_id": project_id,
            "rules": rules,
            "count": len(rules),
        }

    def get_discovery_mappings(self, project_id: str) -> dict:
        rows = self.repository.get_discovery_mappings(project_id)
        mappings = [
            {
                "mapping_id": str(row[0]),
                "dataset_name": f"{row[1]}.{row[2]}" if row[1] and row[2] else None,
                "rule_id": row[3],
                "rule_name": row[4],
                "sql_template": row[5],
            }
            for row in rows
        ]
        return {
            "project_id": project_id,
            "mappings": mappings,
        }

    def trigger_discovery(self, project_id: str) -> dict:
        engine_db = get_db_connection()

        from app.db.connection_resolver import ConnectionResolver
        resolver = ConnectionResolver(engine_db)
        connections = resolver.get_connections(project_id)
        source_connections = connections.get("SOURCE", {})

        if not source_connections:
            raise RuntimeError(f"No active SOURCE systems found for project {project_id}")

        discoverer = AutoRuleDiscovery(
            engine_db=engine_db,
            source_db=next(iter(source_connections.values())),
            project_id=project_id,
            source_connections=source_connections
        )
        discoverer.generate_rules()
        return {
            "status": "started",
            "message": f"Rule discovery triggered for project {project_id}",
            "project_id": project_id,
        }

    def get_discovery_status(self, project_id: str) -> dict:
        total_mappings = self.repository.count_total_mappings_for_project(project_id)
        rules_discovered = self.repository.count_rules_for_project(project_id)
        last_discovery = self.repository.get_last_discovery_time(project_id)

        return {
            "project_id": project_id,
            "total_mappings": total_mappings,
            "rules_discovered": rules_discovered,
            "last_discovery_at": last_discovery,
        }

    def get_tenants(self):
        from app.services.rule_registry_service import RuleRegistryService
        service = RuleRegistryService()
        return service.get_tenants()

    def _rule_to_dict(self, row) -> dict:
        return {
            "rule_id": row[0],
            "control_id": row[1],
            "rule_name": row[2],
            "sql_template_file": row[3],
            "severity_level": row[4],
            "enabled_flag": row[5],
            "created_at": str(row[6]) if row[6] else None,
        }
