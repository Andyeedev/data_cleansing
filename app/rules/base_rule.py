# Force rule class loading so they self-register


class BaseRule:

    REGISTRY = {}
    RULE_ID = None
    REQUIRED_PARAMETERS = []

    def __init__(self, source_db, target_db, parameters):

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
