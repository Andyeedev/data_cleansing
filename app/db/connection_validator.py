# app/db/connection_validator.py

def validate_connection(adapter):
    try:
        adapter.execute("SELECT 1")
        return True
    except Exception as e:
        raise RuntimeError(f"Connection validation failed: {e}")
