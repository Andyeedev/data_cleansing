# app/db/connection_factory.py

from app.db.adapters.postgres_adapter import PostgresAdapter


def connection_factory(config: dict):
    return PostgresAdapter({
        "host": config["host"],
        "port": config["port"],
        "database": config["database"],
        "user": config["username"],   # ✅ IMPORTANT mapping
        "password": config["password"]
    })