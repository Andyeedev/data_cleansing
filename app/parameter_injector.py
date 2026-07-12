class ParameterInjector:

    @staticmethod
    def inject_parameters(sql_template: str, parameters: dict) -> str:
        """
        Replace {{param}} placeholders in SQL template.
        """
        for key, value in parameters.items():
            placeholder = "{{" + key + "}}"
            sql_template = sql_template.replace(placeholder, str(value))
        return sql_template
