class ExecutionContext:

    def __init__(
        self,
        batch_id,
        project_id,
        engine_db,
        source_db,
        target_db,
        config,
        source_connections=None,
        target_connections=None
    ):

        self.batch_id = batch_id
        self.project_id = project_id

        self.engine_db = engine_db
        self.source_db = source_db
        self.target_db = target_db

        self.config = config
        self.source_connections = source_connections or {}
        self.target_connections = target_connections or {}
