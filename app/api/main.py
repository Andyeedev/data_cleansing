from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
load_dotenv()

from app.api.routes import (
    credential_routes,
    system_routes,
    execution_routes,
    auth_routes
)

app = FastAPI(title="Migration Validation SaaS")


# =========================
# REGISTER ROUTES
# =========================
app.include_router(auth_routes.router)
app.include_router(credential_routes.router)
app.include_router(system_routes.router)
app.include_router(execution_routes.router)


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.9"}


# =========================
# FIX SWAGGER AUTH
# =========================
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Migration Validation SaaS",
        version="1.0.0",
        description="API with JWT Authentication",
        routes=app.routes,
    )

    # ✅ ADD SECURITY SCHEME
    openapi_schema["components"] = openapi_schema.get("components", {})
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    # ✅ APPLY GLOBALLY
    openapi_schema["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
