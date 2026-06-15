class MappingResolver:

    def __init__(self, system_db, project_id, logger):
        self.db = system_db
        self.project_id = project_id
        self.logger = logger

    def resolve_legacy_20260501(self, source_ids, target_ids):

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
    

    def resolve_legacy_20260504(self, source_ids, target_ids):

        resolved = []
        skipped = []

        for s_id in source_ids:
            for t_id in target_ids:

                raw_mappings = self._get_manual_mappings(s_id, t_id)

                if raw_mappings:

                    # -------------------------------------------------
                    # CONTRACT STANDARDIZATION (v3.2)
                    # Always return structured mappings
                    # -------------------------------------------------
                    mappings = self._build_mapping_contract(raw_mappings)

                    resolved.append((s_id, t_id, mappings))

                else:
                    skipped.append((s_id, t_id))

        return resolved, skipped
    

    def resolve(self, source_ids, target_ids):

        resolved = []
        skipped = []

        for s_id in source_ids:
            for t_id in target_ids:

                mappings = self._get_manual_mappings(s_id, t_id)

                if mappings:
                    # ✅ FIX: pass mappings forward
                    resolved.append((s_id, t_id, mappings))
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

        return self.db.execute(query, (self.project_id, s_id, t_id))
    
    def _build_mapping_contract(self, raw_rows):

        """
        Normalize DB rows into a structured mapping contract

        Output format:
        {
            "mapping_ids": [...],
            "datasets": [...],
            "control_ids": [...]
        }
        """

        mapping_ids = []
        datasets = []
        control_ids = set()

        for row in raw_rows:

            # SAFE index access (no assumptions on schema changes)
            mapping_id = row[0]

            # Optional columns (defensive)
            source_schema = row[3] if len(row) > 3 else None
            source_table = row[4] if len(row) > 4 else None

            mapping_ids.append(mapping_id)

            datasets.append({
                "source_schema": source_schema,
                "source_table": source_table
            })

            # -------------------------------------------------
            # OPTIONAL: control binding (future ready)
            # If you later join rule mappings → plug here
            # -------------------------------------------------
            # control_ids.add(...)

        return {
            "mapping_ids": mapping_ids,
            "datasets": datasets,
            "control_ids": list(control_ids)  # empty = applies to all
        }
    
    