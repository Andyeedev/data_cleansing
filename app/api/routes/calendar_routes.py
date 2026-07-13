from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.db.connection import get_db_connection
from app.api.core.auth.dependencies import get_current_user
from app.api.helpers import standardize_response
from app.services.calendar_service import CalendarService

router = APIRouter(prefix="/api/v1/calendar", tags=["Calendar"])


class EventCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    type: str = "meeting"
    start_time: datetime
    end_time: Optional[datetime] = None
    all_day: bool = False
    timezone: str = "UTC"
    attendees: list = []
    location: Optional[str] = None
    meeting_url: Optional[str] = None


class EventUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    location: Optional[str] = None


@router.get("/events")
def list_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = CalendarService(db.conn)
    return standardize_response(service.list_events(
        page=page, page_size=page_size,
        type=type, start_date=start_date, end_date=end_date
    ))


@router.get("/events/{event_id}")
def get_event(event_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = CalendarService(db.conn)
    return standardize_response(service.get_event(event_id))


@router.post("/events")
def create_event(
    payload: EventCreateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = CalendarService(db.conn)
    return standardize_response(service.create_event(payload, current_user.get("sub")))


@router.put("/events/{event_id}")
def update_event(
    event_id: str,
    payload: EventUpdateRequest,
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = CalendarService(db.conn)
    return standardize_response(service.update_event(event_id, payload))


@router.delete("/events/{event_id}")
def delete_event(event_id: str, current_user=Depends(get_current_user)):
    db = get_db_connection()
    service = CalendarService(db.conn)
    return standardize_response(service.delete_event(event_id))


@router.get("/events/upcoming/list")
def get_upcoming_events(
    days: int = Query(7, ge=1, le=90),
    current_user=Depends(get_current_user)
):
    db = get_db_connection()
    service = CalendarService(db.conn)
    return standardize_response(service.get_upcoming_events(days))
