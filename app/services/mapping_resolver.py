class MappingResolver:

    def __init__(self, system_db, project_id, logger):
        self.db = system_db
        self.project_id = project_id
        self.logger = logger

    def resolve(self, source_ids, target_ids):

        resolved = []
        skipped = []

        for s_id in source_ids:
            for t_id in target_ids:

                mappings = self._get_manual_mappings(s_id, t_id)

                if mappings:
                    resolved.append((s_id, t_id))
                else:
                    skipped.append((s_id, t_id))

        return resolved, skipped

    def _get_manual_mappings(self, s_id, t_id):

        query = """
        SELECT *
        FROM core.dataset_mappings
        WHERE project_id = %s
          AND source_system_id = %s
          AND target_system_id = %s
          AND is_active = true
        """

        return self.db.fetch_all(query, (self.project_id, s_id, t_id))