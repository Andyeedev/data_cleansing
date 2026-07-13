from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
from dotenv import load_dotenv
import time
import logging

load_dotenv()

from app.api.routes import (
    credential_routes,
    system_routes,
    execution_routes,
    auth_routes,
    user_routes,
    role_routes,
    workflow_routes,
    task_routes,
    calendar_routes,
    notification_routes,
    settings_routes
)

logger = logging.getLogger(__name__)

app = FastAPI(title="Migration Validation SaaS")


# =========================
# CORS MIDDLEWARE
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# AUDIT LOGGING MIDDLEWARE
# =========================
from app.api.core.middleware.audit_middleware import AuditLoggingMiddleware
app.add_middleware(AuditLoggingMiddleware)


# =========================
# REQUEST TIMING MIDDLEWARE
# =========================
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Response-Time"] = f"{duration}ms"
    return response


# =========================
# GLOBAL ERROR HANDLERS
# =========================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc)
        }
    )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "Resource not found"
        }
    )


@app.exception_handler(422)
async def validation_error_handler(request: Request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation error",
            "detail": str(exc)
        }
    )


# =========================
# REGISTER ROUTES
# =========================
app.include_router(auth_routes.router)
app.include_router(credential_routes.router)
app.include_router(system_routes.router)
app.include_router(execution_routes.router)

app.include_router(user_routes.router)
app.include_router(role_routes.router)
app.include_router(workflow_routes.router)
app.include_router(task_routes.router)
app.include_router(calendar_routes.router)
app.include_router(notification_routes.router)
app.include_router(settings_routes.router)


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "2.0.0"}


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

    openapi_schema["components"] = openapi_schema.get("components", {})
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    openapi_schema["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
