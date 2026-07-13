from fastapi import HTTPException
from app.api.models.responses import APIResponse


def standardize_response(result: dict) -> APIResponse:
    if result.get("success") is False:
        raise HTTPException(
            status_code=404 if "not found" in result.get("error", "").lower() else 400,
            detail=result.get("error", "Unknown error")
        )
    return APIResponse(success=True, data=result.get("data"), message=result.get("message"))
