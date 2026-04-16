# Force rule class loading so they self-register


class BaseRule:

    REGISTRY = {}
    RULE_ID = None
    REQUIRED_PARAMETERS = []

    def __init___legacy(self, source_db, target_db, parameters):

        if parameters is None:
            raise ValueError(f"{self.__class__.__name__} received no parameters")

        self.source_db = source_db
        self.target_db = target_db

        # 🔒 Engine DB is mandatory
        if "engine_db" not in parameters:
            raise ValueError(
                f"{self.__class__.__name__} missing required parameter: engine_db"
            )

        self.engine_db = parameters["engine_db"]
        self.parameters = parameters

        # 🔒 Validate rule-specific parameters
        self._validate_required_parameters()

    def __init___legacy_1(self, parameters=None):
        self.parameters = parameters or {}

    def __init___legacy_2(self, config=None):
        self.config = config or {}

    def __init__(self, source_db=None, target_db=None, config=None):
        self.source_db = source_db
        self.target_db = target_db
        self.config = config

    def execute_legacy(self, source_db, target_db, schema, table):
        raise NotImplementedError

    def execute(self, source_db, target_db):
        raise NotImplementedError("Execute must be implemented by subclasses")
    
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)

        if cls.RULE_ID:
            BaseRule.REGISTRY[cls.RULE_ID] = cls

    def _validate_required_parameters(self):

        missing = []

        for param in self.REQUIRED_PARAMETERS:
            if param not in self.parameters:
                missing.append(param)

        if missing:
            raise ValueError(
                f"{self.__class__.__name__} missing required parameters: {missing}"
            )
        
    def get_foreign_keys(self):
        """
        Returns:
        [
            (source_schema, source_table, source_column,
            target_schema, target_table, target_column)
        ]
        """
        raise NotImplementedError
    
    