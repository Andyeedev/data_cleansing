# Force rule class loading so they self-register


class BaseRule:

    def __init__(self, parameters=None):
        self.parameters = parameters or {}

    def execute(self, source_db, target_db, schema, table):
        raise NotImplementedError