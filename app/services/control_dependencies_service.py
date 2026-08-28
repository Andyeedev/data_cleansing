"""
Control Dependencies Service

Manages DAG dependencies between validation controls.
Supports per-project dependency configuration with chain grouping.
"""

from collections import defaultdict
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ControlDependenciesService:

    def __init__(self, engine_db):
        self.engine_db = engine_db

    def get_dependencies(self, project_id=None):
        """Fetch all dependencies, optionally filtered by project."""
        if project_id:
            query = """
                SELECT control_id, depends_on_control_id, project_id, created_at
                FROM engine.control_dependencies
                WHERE project_id = %s OR project_id IS NULL
                ORDER BY control_id
            """
            rows = self.engine_db.execute(query, (project_id,))
        else:
            query = """
                SELECT control_id, depends_on_control_id, project_id, created_at
                FROM engine.control_dependencies
                ORDER BY control_id
            """
            rows = self.engine_db.execute(query)

        return [
            {
                "control_id": r[0],
                "depends_on_control_id": r[1],
                "project_id": str(r[2]) if r[2] else None,
                "created_at": r[3].isoformat() if r[3] else None,
            }
            for r in rows
        ]

    def get_dependency_tree(self, project_id=None):
        """
        Group dependencies into chains and standalone controls.

        Returns:
            {
                "chains": [["C01", "C02"], ["C03", "C09", "C07"]],
                "standalone": ["C04", "C05", "C06", "C010"],
                "control_status": {"C01": true, "C02": true, ...}
            }
        """
        deps = self.get_dependencies(project_id)

        # Build adjacency: child -> parent
        child_to_parent = {}
        parent_to_children = defaultdict(list)
        for d in deps:
            child_to_parent[d["control_id"]] = d["depends_on_control_id"]
            parent_to_children[d["depends_on_control_id"]].append(d["control_id"])

        # Fetch enabled status for all controls
        control_status = self._get_control_status()

        all_controls = set(control_status.keys())
        dependent_controls = set(child_to_parent.keys())
        root_controls = set(parent_to_children.keys())

        # Find roots: controls that are depended ON but don't depend on anything
        chain_roots = root_controls - dependent_controls

        # Build chains from each root
        chains = []
        visited = set()

        for root in sorted(chain_roots):
            chain = self._build_chain(root, parent_to_children, visited)
            if len(chain) > 1:
                chains.append(chain)

        # Standalone: controls not in any chain
        standalone = sorted(all_controls - visited - set().union(*chains) if chains else all_controls - visited)

        return {
            "chains": chains,
            "standalone": standalone,
            "control_status": control_status,
        }

    def _build_chain(self, start, parent_to_children, visited):
        """Recursively build a dependency chain from a root."""
        chain = [start]
        visited.add(start)

        children = parent_to_children.get(start, [])
        if children:
            child = children[0]  # linear chain (1:1 dependency)
            if child not in visited:
                chain.extend(self._build_chain(child, parent_to_children, visited))

        return chain

    def _get_control_status(self):
        """Fetch enabled_flag for all controls from control_registry."""
        query = """
            SELECT control_id, enabled_flag
            FROM engine.control_registry
            ORDER BY control_id
        """
        rows = self.engine_db.execute(query)
        return {r[0]: r[1] for r in rows}

    def add_dependency(self, control_id, depends_on, project_id):
        """
        Add a dependency: control_id depends on depends_on.
        Validates no circular dependencies before inserting.
        """
        # Check for circular dependency
        if self._would_create_cycle(control_id, depends_on, project_id):
            raise ValueError(f"Adding dependency {control_id} -> {depends_on} would create a circular dependency")

        # Check if already exists
        existing = self.get_dependencies(project_id)
        for d in existing:
            if d["control_id"] == control_id and d["depends_on_control_id"] == depends_on:
                raise ValueError(f"Dependency {control_id} -> {depends_on} already exists")

        query = """
            INSERT INTO engine.control_dependencies (control_id, depends_on_control_id, project_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (control_id, depends_on_control_id, project_id) DO NOTHING
        """
        self.engine_db.execute(query, (control_id, depends_on, project_id))
        logger.info(f"Added dependency: {control_id} -> {depends_on} (project: {project_id})")

    def delete_dependency(self, control_id, depends_on, project_id):
        """Remove a dependency."""
        query = """
            DELETE FROM engine.control_dependencies
            WHERE control_id = %s AND depends_on_control_id = %s AND project_id = %s
        """
        self.engine_db.execute(query, (control_id, depends_on, project_id))
        logger.info(f"Removed dependency: {control_id} -> {depends_on} (project: {project_id})")

    def _would_create_cycle(self, control_id, depends_on, project_id):
        """
        Check if adding control_id -> depends_on would create a cycle.
        Walks up from depends_on following existing dependencies.
        """
        visited = set()
        stack = [depends_on]

        while stack:
            current = stack.pop()
            if current == control_id:
                return True
            if current in visited:
                continue
            visited.add(current)

            query = """
                SELECT depends_on_control_id
                FROM engine.control_dependencies
                WHERE control_id = %s AND (project_id = %s OR project_id IS NULL)
            """
            rows = self.engine_db.execute(query, (current, project_id))
            for r in rows:
                stack.append(r[0])

        return False
