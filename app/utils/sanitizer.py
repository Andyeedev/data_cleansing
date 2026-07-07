import re
import json


class LogSanitizer:
    SENSITIVE_KEYS = {
        'password', 'pass', 'pwd', 'secret', 'key', 'token',
        'credential', 'fernet', 'authorization', 'api_key', 'api-key'
    }

    @classmethod
    def sanitize(cls, data):
        """
        Recursively sanitizes sensitive information from dictionaries, lists, or strings.
        """
        if isinstance(data, dict):
            return {
                k: cls.sanitize(v) if k.lower() not in cls.SENSITIVE_KEYS else "[MASKED]"
                for k, v in data.items()
            }
        elif isinstance(data, list):
            return [cls.sanitize(item) for item in data]
        elif isinstance(data, str):
            # Check for common sensitive patterns in strings (simple regex)
            # This is a safety net for cases where secrets are part of a string
            # e.g., "password=secret123"
            for key in cls.SENSITIVE_KEYS:
                pattern = rf"({key}\s*[:=]\s*['\"]?)([^'\"\s,}}]+)(['\"]?)"
                data = re.sub(pattern, r"\1[MASKED]\3", data, flags=re.IGNORECASE)
            return data
        return data

    @classmethod
    def sanitize_message(cls, message):
        """
        Helper for logging messages that might be dictionaries or strings.
        """
        try:
            if isinstance(message, (dict, list)):
                return json.dumps(cls.sanitize(message))
            return cls.sanitize(str(message))
        except Exception:
            return "[SANITIZATION_FAILED]"
