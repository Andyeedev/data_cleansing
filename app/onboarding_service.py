class OnboardingService:

    def __init__(self, db_connector):
        self.db = db_connector

    def get_systems(self, project_id):
        query = """
        SELECT system_id, system_name, system_role,
               database_type, connection_config
        FROM core.system_registry
        WHERE project_id = %s
        AND is_active = TRUE
        """
        return self.db.execute(query, (project_id,))

    def start_onboarding(self, project_id):
        systems = self.get_systems(project_id)

        for system in systems:
            if system["auto_discovery_enabled"]:
                self.trigger_discovery(system)