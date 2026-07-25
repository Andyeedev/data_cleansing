import secrets
import json
import logging
from typing import Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class CalendarService:
    def __init__(self, conn, tenant_id: str = None):
        self.conn = conn
        self.tenant_id = tenant_id

    def list_events(self, page: int = 1, page_size: int = 50, type: Optional[str] = None,
                    start_date: Optional[datetime] = None, end_date: Optional[datetime] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, title, description, type, status, start_time, end_time,
                   all_day, timezone, location, created_at
            FROM platform.calendar_events
            WHERE deleted_at IS NULL
        """
        params = []

        if self.tenant_id:
            query += " AND tenant_id = %s"
            params.append(self.tenant_id)

        if type:
            query += " AND type = %s"
            params.append(type)
        if start_date:
            query += " AND start_time >= %s"
            params.append(start_date)
        if end_date:
            query += " AND start_time <= %s"
            params.append(end_date)

        query += " ORDER BY start_time ASC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            events = [dict(zip(columns, row)) for row in cur.fetchall()]

            count_query = "SELECT COUNT(*) FROM platform.calendar_events WHERE deleted_at IS NULL"
            cur.execute(count_query)
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "events": events,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def get_event(self, event_id: str):
        query = """
            SELECT id, title, description, type, status, start_time, end_time,
                   all_day, timezone, recurrence, attendees, location,
                   meeting_url, metadata, created_at
            FROM platform.calendar_events
            WHERE id = %s AND deleted_at IS NULL
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (event_id,))
            columns = [desc[0] for desc in cur.description]
            event = dict(zip(columns, cur.fetchone()))

        if not event:
            return {"success": False, "error": "Event not found"}

        return {"success": True, "data": event}

    def create_event(self, payload, user_id: str = None):
        event_id = secrets.token_uuid()

        query = """
            INSERT INTO platform.calendar_events 
                (id, title, description, type, start_time, end_time,
                 all_day, timezone, attendees, organizer_id, location, meeting_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, title, type, status, start_time, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                event_id, payload.title, payload.description,
                payload.type, payload.start_time, payload.end_time,
                payload.all_day, payload.timezone, json.dumps(payload.attendees),
                user_id, payload.location, payload.meeting_url
            ))
            columns = [desc[0] for desc in cur.description]
            event = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": event}

    def update_event(self, event_id: str, payload):
        updates = []
        params = []

        if payload.title is not None:
            updates.append("title = %s")
            params.append(payload.title)
        if payload.description is not None:
            updates.append("description = %s")
            params.append(payload.description)
        if payload.type is not None:
            updates.append("type = %s")
            params.append(payload.type)
        if payload.start_time is not None:
            updates.append("start_time = %s")
            params.append(payload.start_time)
        if payload.end_time is not None:
            updates.append("end_time = %s")
            params.append(payload.end_time)
        if payload.status is not None:
            updates.append("status = %s")
            params.append(payload.status)
        if payload.location is not None:
            updates.append("location = %s")
            params.append(payload.location)

        if not updates:
            return {"success": False, "error": "No fields to update"}

        params.append(event_id)
        query = f"""
            UPDATE platform.calendar_events
            SET {', '.join(updates)}
            WHERE id = %s AND deleted_at IS NULL
            RETURNING id, title, type, status, start_time
        """
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            event = dict(zip(columns, cur.fetchone()))

        if not event:
            return {"success": False, "error": "Event not found"}

        return {"success": True, "data": event}

    def delete_event(self, event_id: str):
        query = """
            UPDATE platform.calendar_events
            SET deleted_at = NOW()
            WHERE id = %s AND deleted_at IS NULL
            RETURNING id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (event_id,))
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Event not found"}

        return {"success": True, "message": "Event deleted"}

    def get_upcoming_events(self, days: int = 7):
        query = """
            SELECT id, title, type, start_time, end_time, location
            FROM platform.calendar_events
            WHERE start_time >= NOW()
              AND start_time <= NOW() + INTERVAL '%s days'
              AND deleted_at IS NULL
            ORDER BY start_time ASC
            LIMIT 50
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (days,))
            columns = [desc[0] for desc in cur.description]
            events = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": events}
