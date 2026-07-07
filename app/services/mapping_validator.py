class MappingValidator:

    def __init__(self, system_db, logger):
        self.system_db = system_db
        self.logger = logger

    def validate_for_execution(self, source_system_id, target_system_id, project_id):

        mappings = self._get_mappings(source_system_id, target_system_id, project_id)

        if not mappings:
            self.logger.warning(
                f"[NO MAPPINGS] source_system={source_system_id}, "
                f"target_system={target_system_id}, project={project_id}"
            )
            return None

        valid_mappings = []

        for m in mappings:

            if not self._validate_ids(m, source_system_id, target_system_id):
                continue

            valid_mappings.append(m)

        if not valid_mappings:
            self.logger.warning("[NO VALID MAPPINGS AFTER FILTER]")
            return None

        return valid_mappings

    def _get_mappings(self, source_system_id, target_system_id, project_id):

        query = """
        SELECT *
        FROM core.dataset_mappings
        WHERE project_id = %s
          AND source_system_id = %s
          AND target_system_id = %s
          AND is_active = true
        """

        return self.system_db.fetch_all(
            query,
            (project_id, source_system_id, target_system_id)
        )

    def _validate_ids(self, mapping, source_system_id, target_system_id):

        # SAFE ACCESS (dict or tuple depending on driver)
        return (
            mapping["source_system_id"] == source_system_id and
            mapping["target_system_id"] == target_system_id
        )
