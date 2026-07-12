from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional, Any

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.services.settings_service import SettingsService

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])


# =========================
# REQUEST MODELS
# =========================
class SettingUpdateRequest(BaseModel):
    value: Any
    description: Optional[str] = None


class FeatureFlagUpdateRequest(BaseModel):
    enabled: Optional[bool] = None
    rollout_percentage: Optional[float] = None


# =========================
# LIST ALL SETTINGS
# =========================
@router.get("/")
def list_settings(
    category: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = SettingsService(db.conn)
    return service.list_settings(category=category)


# =========================
# GET CATEGORY SETTINGS
# =========================
@router.get("/{category}")
def get_category_settings(category: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = SettingsService(db.conn)
    return service.get_category_settings(category)


# =========================
# GET SETTING
# =========================
@router.get("/{category}/{key}")
def get_setting(category: str, key: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = SettingsService(db.conn)
    return service.get_setting(category, key)


# =========================
# UPDATE SETTING
# =========================
@router.put("/{category}/{key}")
def update_setting(
    category: str,
    key: str,
    payload: SettingUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = SettingsService(db.conn)
    return service.update_setting(category, key, payload.value, current_user.get("sub"))


# =========================
# LIST FEATURE FLAGS
# =========================
@router.get("/flags/list")
def list_feature_flags(current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = SettingsService(db.conn)
    return service.list_feature_flags()


# =========================
# GET FEATURE FLAG
# =========================
@router.get("/flags/{key}")
def get_feature_flag(key: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = SettingsService(db.conn)
    return service.get_feature_flag(key)


# =========================
# UPDATE FEATURE FLAG
# =========================
@router.put("/flags/{key}")
def update_feature_flag(
    key: str,
    payload: FeatureFlagUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = SettingsService(db.conn)
    return service.update_feature_flag(key, payload)
