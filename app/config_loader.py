import yaml
import os
import re


def load_config(path):
    """
    Loads a YAML configuration file and expands environment variables
    using the ${VAR} or ${VAR:-default} syntax.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Config file not found at: {path}")

    # Regex to find ${VAR} or ${VAR:-default}
    pattern = re.compile(r'\$\{(\w+)(?::-([^}]*))?\}')

    def replace_env(match):
        env_var = match.group(1)
        default = match.group(2)
        return os.getenv(env_var, default if default is not None else match.group(0))

    with open(path, "r") as f:
        content = f.read()
        content = pattern.sub(replace_env, content)
        return yaml.safe_load(content)
