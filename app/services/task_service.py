import secrets
import json
import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class TaskService:
    def __init__(self, conn, tenant_id: str = None):
        self.conn = conn
        self.tenant_id = tenant_id

    def list_tasks(self, page: int = 1, page_size: int = 50, status: Optional[str] = None, 
                   priority: Optional[str] = None, assigned_to: Optional[str] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, title, description, status, priority, type,
                   assigned_to, due_date, completion_percentage, created_at
            FROM platform.tasks
            WHERE deleted_at IS NULL
        """
        params = []

        if self.tenant_id:
            query += " AND tenant_id = %s"
            params.append(self.tenant_id)

        if status:
            query += " AND status = %s"
            params.append(status)
        if priority:
            query += " AND priority = %s"
            params.append(priority)
        if assigned_to:
            query += " AND assigned_to = %s"
            params.append(assigned_to)

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            tasks = [dict(zip(columns, row)) for row in cur.fetchall()]

            count_query = "SELECT COUNT(*) FROM platform.tasks WHERE deleted_at IS NULL"
            if self.tenant_id:
                count_query += " AND tenant_id = %s"
                cur.execute(count_query, (self.tenant_id,))
            else:
                cur.execute(count_query)
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "tasks": tasks,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def get_task(self, task_id: str):
        query = """
            SELECT id, title, description, status, priority, type,
                   assigned_to, assigned_by, parent_task_id, due_date,
                   estimated_hours, actual_hours, completion_percentage,
                   tags, created_at, updated_at
            FROM platform.tasks
            WHERE id = %s AND deleted_at IS NULL
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (task_id,))
            columns = [desc[0] for desc in cur.description]
            task = dict(zip(columns, cur.fetchone()))

        if not task:
            return {"success": False, "error": "Task not found"}

        return {"success": True, "data": task}

    def create_task(self, payload, user_id: str = None):
        task_id = secrets.token_uuid()

        query = """
            INSERT INTO platform.tasks 
                (id, title, description, priority, type, assigned_to,
                 assigned_by, parent_task_id, due_date, estimated_hours, tags, tenant_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, title, status, priority, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                task_id, payload.title, payload.description,
                payload.priority, payload.type, payload.assigned_to,
                user_id, payload.parent_task_id, payload.due_date,
                payload.estimated_hours, json.dumps(payload.tags), self.tenant_id
            ))
            columns = [desc[0] for desc in cur.description]
            task = dict(zip(columns, cur.fetchone()))

        logger.info(f"Task created: {task_id} by user {user_id}")
        return {"success": True, "data": task}

    def update_task(self, task_id: str, payload):
        updates = []
        params = []

        if payload.title is not None:
            updates.append("title = %s")
            params.append(payload.title)
        if payload.description is not None:
            updates.append("description = %s")
            params.append(payload.description)
        if payload.status is not None:
            updates.append("status = %s")
            params.append(payload.status)
            if payload.status == "done":
                updates.append("completed_at = NOW()")
                updates.append("completion_percentage = 100")
        if payload.priority is not None:
            updates.append("priority = %s")
            params.append(payload.priority)
        if payload.assigned_to is not None:
            updates.append("assigned_to = %s")
            params.append(payload.assigned_to)
        if payload.due_date is not None:
            updates.append("due_date = %s")
            params.append(payload.due_date)
        if payload.completion_percentage is not None:
            updates.append("completion_percentage = %s")
            params.append(payload.completion_percentage)

        if not updates:
            return {"success": False, "error": "No fields to update"}

        params.append(task_id)
        query = f"""
            UPDATE platform.tasks
            SET {', '.join(updates)}
            WHERE id = %s AND deleted_at IS NULL
            RETURNING id, title, status, priority, completion_percentage
        """
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            task = dict(zip(columns, cur.fetchone()))

        if not task:
            return {"success": False, "error": "Task not found"}

        return {"success": True, "data": task}

    def delete_task(self, task_id: str):
        query = """
            UPDATE platform.tasks
            SET deleted_at = NOW()
            WHERE id = %s AND deleted_at IS NULL
            RETURNING id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (task_id,))
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Task not found"}

        return {"success": True, "message": "Task deleted"}

    def add_comment(self, task_id: str, payload, user_id: str = None):
        comment_id = secrets.token_uuid()

        query = """
            INSERT INTO platform.task_comments (id, task_id, user_id, content)
            VALUES (%s, %s, %s, %s)
            RETURNING id, content, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (comment_id, task_id, user_id, payload.content))
            columns = [desc[0] for desc in cur.description]
            comment = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": comment}

    def get_comments(self, task_id: str):
        query = """
            SELECT id, content, created_at
            FROM platform.task_comments
            WHERE task_id = %s AND deleted_at IS NULL
            ORDER BY created_at ASC
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (task_id,))
            columns = [desc[0] for desc in cur.description]
            comments = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": comments}
