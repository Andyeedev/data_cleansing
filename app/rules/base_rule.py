class BaseRule:

    def __init__(self, source_db, target_db, parameters):
        self.source_db = source_db
        self.target_db = target_db
        self.parameters = parameters

    def execute(self):
        raise NotImplementedError("Rule must implement execute().")
