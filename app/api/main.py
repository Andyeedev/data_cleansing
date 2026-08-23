from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
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
    notification_routes,
    settings_routes,
    navigation_routes,
    discovery_routes,
    rule_execution_routes,
    validation_report_routes,
    execution_history_routes,
    export_routes,
    execution_control_routes,
    monitoring_routes,
    governance_routes,
    dashboard_routes,
    migration_project_routes,
    migration_dataset_routes,
    schedule_routes,
    rule_registry_routes,
    rule_discovery_routes,
    control_routes,
    mapping_routes,
    operations_execution_routes,
    control_dependencies_routes,
    report_suite_routes,
    permissions_routes,
)

# Import pool manager to reset on startup
from app.adapters.pool import ConnectionPoolManager

logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Migration Validation SaaS")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Reset connection pool manager on startup to pick up MARS config changes
@app.on_event("startup")
async def startup_event():
    logger.info("Resetting connection pool manager...")
    pool_manager = ConnectionPoolManager()
    pool_manager.reset()
    logger.info("Connection pool manager reset complete")


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
# HEALTH CHECK ENDPOINTS
# =========================
@app.get("/health")
@limiter.exempt
def health_check():
    return {"status": "healthy", "version": "2.0.0"}


@app.get("/api/v1/health")
@limiter.exempt
def api_health_check():
    return {"status": "healthy", "version": "2.0.0"}


@app.get("/api/v1/ready")
@limiter.exempt
def readiness_check():
    checks = {"database": False}
    try:
        from app.db.connection import get_db_connection
        db = get_db_connection()
        with db.conn.cursor() as cur:
            cur.execute("SELECT 1")
        checks["database"] = True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")

    healthy = all(checks.values())
    return {
        "status": "ready" if healthy else "degraded",
        "checks": checks
    }


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
app.include_router(notification_routes.router)
app.include_router(settings_routes.router)
app.include_router(navigation_routes.router)
app.include_router(discovery_routes.router)
app.include_router(rule_execution_routes.router)
app.include_router(validation_report_routes.router)
app.include_router(execution_history_routes.router)
app.include_router(export_routes.router)
app.include_router(execution_control_routes.router)
app.include_router(monitoring_routes.router)
app.include_router(governance_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(migration_project_routes.router)
app.include_router(migration_dataset_routes.router)
app.include_router(schedule_routes.router)
app.include_router(rule_registry_routes.router)
app.include_router(rule_discovery_routes.router)
app.include_router(control_routes.router)
app.include_router(mapping_routes.router)
app.include_router(operations_execution_routes.router)
app.include_router(control_dependencies_routes.router)
app.include_router(report_suite_routes.router)
app.include_router(permissions_routes.router)


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
