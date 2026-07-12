import secrets
import json
from typing import Optional
from datetime import datetime


class WorkflowService:
    def __init__(self, conn):
        self.conn = conn

    def list_workflows(self, page: int = 1, page_size: int = 50, type: Optional[str] = None, status: Optional[str] = None):
        offset = (page - 1) * page_size
        query = """
            SELECT id, name, description, type, status, version, 
                   created_at, updated_at
            FROM platform.workflow_definitions
            WHERE deleted_at IS NULL
        """
        params = []

        if type:
            query += " AND type = %s"
            params.append(type)
        if status:
            query += " AND status = %s"
            params.append(status)

        query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            workflows = [dict(zip(columns, row)) for row in cur.fetchall()]

            count_query = "SELECT COUNT(*) FROM platform.workflow_definitions WHERE deleted_at IS NULL"
            cur.execute(count_query)
            total = cur.fetchone()[0]

        return {
            "success": True,
            "data": {
                "workflows": workflows,
                "total": total,
                "page": page,
                "page_size": page_size
            }
        }

    def get_workflow(self, workflow_id: str):
        query = """
            SELECT id, name, description, type, status, version, 
                   steps, triggers, variables, metadata, created_at
            FROM platform.workflow_definitions
            WHERE id = %s AND deleted_at IS NULL
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (workflow_id,))
            columns = [desc[0] for desc in cur.description]
            workflow = dict(zip(columns, cur.fetchone()))

        if not workflow:
            return {"success": False, "error": "Workflow not found"}

        return {"success": True, "data": workflow}

    def create_workflow(self, payload):
        workflow_id = secrets.token_uuid()

        query = """
            INSERT INTO platform.workflow_definitions 
                (id, name, description, type, steps, triggers, status)
            VALUES (%s, %s, %s, %s, %s, %s, 'draft')
            RETURNING id, name, description, type, status, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                workflow_id, payload.name, payload.description,
                payload.type, json.dumps(payload.steps),
                json.dumps(payload.triggers)
            ))
            columns = [desc[0] for desc in cur.description]
            workflow = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": workflow}

    def update_workflow(self, workflow_id: str, payload):
        updates = []
        params = []

        if payload.name is not None:
            updates.append("name = %s")
            params.append(payload.name)
        if payload.description is not None:
            updates.append("description = %s")
            params.append(payload.description)
        if payload.status is not None:
            updates.append("status = %s")
            params.append(payload.status)
        if payload.steps is not None:
            updates.append("steps = %s")
            params.append(json.dumps(payload.steps))

        if not updates:
            return {"success": False, "error": "No fields to update"}

        params.append(workflow_id)
        query = f"""
            UPDATE platform.workflow_definitions
            SET {', '.join(updates)}
            WHERE id = %s AND deleted_at IS NULL
            RETURNING id, name, description, type, status
        """
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            columns = [desc[0] for desc in cur.description]
            workflow = dict(zip(columns, cur.fetchone()))

        if not workflow:
            return {"success": False, "error": "Workflow not found"}

        return {"success": True, "data": workflow}

    def delete_workflow(self, workflow_id: str):
        query = """
            UPDATE platform.workflow_definitions
            SET deleted_at = NOW()
            WHERE id = %s AND deleted_at IS NULL
            RETURNING id
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (workflow_id,))
            result = cur.fetchone()

        if not result:
            return {"success": False, "error": "Workflow not found"}

        return {"success": True, "message": "Workflow deleted"}

    def execute_workflow(self, workflow_id: str, payload):
        instance_id = secrets.token_uuid()

        query = """
            INSERT INTO platform.workflow_instances 
                (id, workflow_definition_id, context, variables, 
                 initiated_by, assigned_to, status)
            VALUES (%s, %s, %s, %s, %s, %s, 'pending')
            RETURNING id, status, created_at
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (
                instance_id, workflow_id,
                json.dumps(payload.context),
                json.dumps(payload.variables),
                payload.assigned_to,
                payload.assigned_to
            ))
            columns = [desc[0] for desc in cur.description]
            instance = dict(zip(columns, cur.fetchone()))

        return {"success": True, "data": instance}

    def get_workflow_instances(self, workflow_id: str, page: int = 1, page_size: int = 50):
        offset = (page - 1) * page_size
        query = """
            SELECT id, status, priority, started_at, completed_at, created_at
            FROM platform.workflow_instances
            WHERE workflow_definition_id = %s
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (workflow_id, page_size, offset))
            columns = [desc[0] for desc in cur.description]
            instances = [dict(zip(columns, row)) for row in cur.fetchall()]

        return {"success": True, "data": instances}

    def get_workflow_instance(self, instance_id: str):
        query = """
            SELECT id, workflow_definition_id, name, status, priority,
                   context, variables, started_at, completed_at, 
                   error_message, created_at
            FROM platform.workflow_instances
            WHERE id = %s
        """
        with self.conn.cursor() as cur:
            cur.execute(query, (instance_id,))
            columns = [desc[0] for desc in cur.description]
            instance = dict(zip(columns, cur.fetchone()))

        if not instance:
            return {"success": False, "error": "Workflow instance not found"}

        return {"success": True, "data": instance}
