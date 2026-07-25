from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.api.core.auth.rbac import require_permissions
from app.api.helpers import standardize_response
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])


class NotificationMarkReadRequest(BaseModel):
    is_read: bool = True


class PreferenceUpdateRequest(BaseModel):
    type: str
    channel: str
    enabled: bool


@router.get("/")
def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    is_read: Optional[bool] = None,
    type: Optional[str] = None,
    current_user=Depends(require_permissions("tasks:read"))
):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.list_notifications(
        user_id=current_user.get("sub"),
        page=page, page_size=page_size,
        is_read=is_read, type=type
    ))


@router.get("/{notification_id}")
def get_notification(notification_id: str, current_user=Depends(require_permissions("tasks:read"))):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.get_notification(notification_id))


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    current_user=Depends(require_permissions("tasks:update"))
):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.mark_as_read(notification_id))


@router.put("/read-all")
def mark_all_as_read(current_user=Depends(require_permissions("tasks:update"))):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.mark_all_as_read(current_user.get("sub")))


@router.delete("/{notification_id}")
def delete_notification(notification_id: str, current_user=Depends(require_permissions("tasks:delete"))):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.delete_notification(notification_id))


@router.get("/unread/count")
def get_unread_count(current_user=Depends(require_permissions("tasks:read"))):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.get_unread_count(current_user.get("sub")))


@router.get("/preferences/list")
def get_preferences(current_user=Depends(require_permissions("tasks:read"))):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.get_preferences(current_user.get("sub")))


@router.put("/preferences")
def update_preference(
    payload: PreferenceUpdateRequest,
    current_user=Depends(require_permissions("tasks:update"))
):
    db = get_db_connection()
    service = NotificationService(db.conn, current_user.get("tenant_id"))
    return standardize_response(service.update_preference(current_user.get("sub"), payload))
