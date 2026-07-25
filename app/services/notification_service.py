import secrets
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self, conn, tenant_id: str = None):
        self.conn = conn
        self.tenant_id = tenant_id

    def list_notifications(self, user_id: str, page: int = 1, page_size: int = 50,
                           is_read: Optional[bool] = None, type: Optional[str] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, type, title, message, severity, is_read, 
                   read_at, link, created_at
            FROM platform.notifications
            WHERE user_id = %s
        """
        params = [user_id]

        if self.tenant_id:
            query += " AND tenant_id = %s"
            params.append(self.tenant_id)

        if is_read is not None:
            query += " AND is_read = %s"
            params.append(is_read)
        if type:
            query += " AND type = %s"
            params.append(type)

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            notifications = [dict(zip(columns, row)) for row in cur.fetchall()]

            count_query = """
                SELECT COUNT(*) FROM platform.notifications 
                WHERE user_id = %s
            """
            cur.execute(count_query, (user_id,))
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "notifications": notifications,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def get_notification(self, notification_id: str):
        query = """
            SELECT id, type, title, message, severity, data, 
                   is_read, read_at, link, created_at
            FROM platform.notifications
            WHERE id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (notification_id,))
            columns = [desc[0] for desc in cur.description]
            notification = dict(zip(columns, cur.fetchone()))

        if not notification:
            return {"success": False, "error": "Notification not found"}

        return {"success": True, "data": notification}

    def mark_as_read(self, notification_id: str):
        query = """
            UPDATE platform.notifications
            SET is_read = TRUE, read_at = NOW()
            WHERE id = %s
            RETURNING id, is_read, read_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (notification_id,))
            columns = [desc[0] for desc in cur.description]
            notification = dict(zip(columns, cur.fetchone()))

        if not notification:
            return {"success": False, "error": "Notification not found"}

        return {"success": True, "data": notification}

    def mark_all_as_read(self, user_id: str):
        query = """
            UPDATE platform.notifications
            SET is_read = TRUE, read_at = NOW()
            WHERE user_id = %s AND is_read = FALSE
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            count = cur.rowcount

        return {"success": True, "message": f"Marked {count} notifications as read"}

    def delete_notification(self, notification_id: str):
        query = """
            DELETE FROM platform.notifications
            WHERE id = %s
            RETURNING id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (notification_id,))
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Notification not found"}

        return {"success": True, "message": "Notification deleted"}

    def get_unread_count(self, user_id: str):
        query = """
            SELECT COUNT(*) FROM platform.notifications
            WHERE user_id = %s AND is_read = FALSE
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            count = cur.fetchone()[0]

        return {"success": True, "data": {"count": count}}

    def get_preferences(self, user_id: str):
        query = """
            SELECT type, channel, enabled
            FROM platform.notification_preferences
            WHERE user_id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id,))
            columns = [desc[0] for desc in cur.description]
            preferences = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": preferences}

    def update_preference(self, user_id: str, payload):
        query = """
            INSERT INTO platform.notification_preferences (user_id, type, channel, enabled)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, type, channel) 
            DO UPDATE SET enabled = EXCLUDED.enabled
            RETURNING type, channel, enabled
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (user_id, payload.type, payload.channel, payload.enabled))
            columns = [desc[0] for desc in cur.description]
            preference = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": preference}
