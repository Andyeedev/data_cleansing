from app.controls.base_control import BaseControl
from app.rule_executor import RuleExecutor


class RuleAdapterControl(BaseControl):
    """
    Bridge between the new Control execution layer and the mature Rule logic.
    Executes rules for a given control_id using the RuleExecutor.
    """

    def execute(self):

        # Instantiate the mature RuleExecutor with the current context
        executor = RuleExecutor(
            engine_db=self.context.engine_db,
            source_db=self.context.source_db,
            target_db=self.context.target_db,
            batch_id=self.context.batch_id,
            project_id=self.context.project_id,
            control_id=self.control_id,
            config=self.context.config,
            source_connections=self.context.source_connections,
            target_connections=self.context.target_connections
        )

        # execute_rules handles rule lookup, entity resolution, and database logging
        executor.execute_rules()

        return self.success(
            msg=f"Successfully executed rules for control {self.control_id}"
        )
