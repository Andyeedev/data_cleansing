MAP Nexus™ Enterprise Platform
Prompt 037
Backend API — Role Management

Version: 1.0

Prompt ID: 037

Workstream: 06 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

032_DB_Role_Management
036_User_API

---

Purpose

Create the FastAPI backend for Role Management in the MAP Nexus™ platform.

This prompt creates the Python routers, services, models, and repositories required to expose role-based access control (RBAC) functionality via RESTful APIs.

---

Objective

Create a role management API capable of:

Role CRUD — Create, read, update, delete roles
Permission Management — Assign/remove permissions to roles
Role Hierarchy — Parent-child role relationships
Role Assignment — Assign roles to users
Role Templates — Create roles from templates

---

Technology Stack

- Framework: FastAPI
- ORM: SQLAlchemy (async)
- Database: PostgreSQL (asyncpg)
- Auth: JWT (jose)
- Validation: Pydantic

---

Folder Structure

Create

src/
backend/
api/routes/
role_router.py
services/
role_service.py
api/models/
role.py (SQLAlchemy model)
schemas/
role.py (Pydantic schemas)
db/repositories/
role_repository.py

---

Pydantic Schemas

```python
# schemas/role.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class RoleType(str, Enum):
    system = "system"
    custom = "custom"
    template = "template"
    virtual = "virtual"

class RoleStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    deprecated = "deprecated"
    draft = "draft"

class PermissionAction(str, Enum):
    create = "create"
    read = "read"
    update = "update"
    delete = "delete"
    execute = "execute"
    approve = "approve"
    export = "export"
    import_ = "import"

class RoleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    type: RoleType = RoleType.custom
    parent_id: Optional[str] = None
    is_default: bool = False

class RoleCreate(RoleBase):
    permission_ids: Optional[List[str]] = []
    tenant_id: str

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[str] = None
    is_default: Optional[bool] = None
    status: Optional[RoleStatus] = None

class RoleResponse(RoleBase):
    id: str
    level: int = 0
    is_system: bool = False
    status: RoleStatus
    tenant_id: str
    user_count: int = 0
    permission_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class RoleListResponse(BaseModel):
    roles: List[RoleResponse]
    total: int
    page: int
    page_size: int

class PermissionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None
    resource: str = Field(..., min_length=1, max_length=100)
    action: PermissionAction
    category: Optional[str] = None

class PermissionResponse(PermissionBase):
    id: str
    is_system: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True

class RolePermissionUpdate(BaseModel):
    permission_ids: List[str]
    granted: bool = True

class RoleAssignment(BaseModel):
    user_id: str
    expires_at: Optional[datetime] = None
    is_temporary: bool = False

class RoleClone(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
```

---

SQLAlchemy Model

```python
# api/models/role.py
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, JSON, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base

class Role(Base):
    __tablename__ = "roles"
    __table_args__ = (
        UniqueConstraint("name", "tenant_id", name="uq_roles_name_tenant"),
        {"schema": "platform"}
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False, default="custom")
    parent_id = Column(UUID(as_uuid=True), ForeignKey("platform.roles.id"))
    level = Column(Integer, default=0)
    is_system = Column(Boolean, default=False)
    is_default = Column(Boolean, default=False)
    status = Column(String(50), nullable=False, default="active")
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))
    deleted_at = Column(DateTime(timezone=True))

    # Relationships
    permissions = relationship("RolePermission", back_populates="role", lazy="selectin")
    users = relationship("UserRole", back_populates="role", lazy="selectin")
    parent = relationship("Role", remote_side="Role.id", lazy="selectin")

class Permission(Base):
    __tablename__ = "permissions"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(150), unique=True, nullable=False)
    description = Column(Text)
    resource = Column(String(100), nullable=False)
    action = Column(String(50), nullable=False)
    category = Column(String(100))
    is_system = Column(Boolean, default=False)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class RolePermission(Base):
    __tablename__ = "role_permissions"
    __table_args__ = {"schema": "platform"}

    role_id = Column(UUID(as_uuid=True), ForeignKey("platform.roles.id"), primary_key=True)
    permission_id = Column(UUID(as_uuid=True), ForeignKey("platform.permissions.id"), primary_key=True)
    granted = Column(Boolean, default=True)
    conditions = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    role = relationship("Role", back_populates="permissions")
    permission = relationship("Permission", lazy="selectin")

class UserRole(Base):
    __tablename__ = "user_roles"
    __table_args__ = {"schema": "platform"}

    user_id = Column(UUID(as_uuid=True), ForeignKey("platform.users.id"), primary_key=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("platform.roles.id"), primary_key=True)
    assigned_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    assigned_by = Column(UUID(as_uuid=True))
    expires_at = Column(DateTime(timezone=True))
    is_temporary = Column(Boolean, default=False)

    role = relationship("Role", back_populates="users")

class RoleAuditLog(Base):
    __tablename__ = "role_audit_log"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_id = Column(UUID(as_uuid=True), ForeignKey("platform.roles.id"), nullable=False)
    action = Column(String(50), nullable=False)
    changes = Column(JSON, default={})
    performed_by = Column(UUID(as_uuid=True), nullable=False)
    reason = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
```

---

Repository

```python
# db/repositories/role_repository.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Optional, List, Tuple
import uuid

from ..models.role import Role, Permission, RolePermission, UserRole, RoleAuditLog
from ..schemas.role import RoleCreate, RoleUpdate

class RoleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, role_id: str) -> Optional[Role]:
        result = await self.db.execute(
            select(Role)
            .options(
                selectinload(Role.permissions),
                selectinload(Role.users)
            )
            .where(Role.id == uuid.UUID(role_id))
            .where(Role.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def list_roles(
        self,
        tenant_id: str,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Role], int]:
        query = select(Role).where(
            Role.tenant_id == uuid.UUID(tenant_id),
            Role.deleted_at.is_(None)
        )
        
        if status:
            query = query.where(Role.status == status)
        
        if search:
            search_term = f"%{search}%"
            query = query.where(
                (Role.name.ilike(search_term)) |
                (Role.description.ilike(search_term))
            )
        
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar()
        
        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(query)
        
        return result.scalars().all(), total

    async def create(self, role_data: RoleCreate, created_by: Optional[str] = None) -> Role:
        role = Role(
            name=role_data.name,
            description=role_data.description,
            type=role_data.type,
            parent_id=uuid.UUID(role_data.parent_id) if role_data.parent_id else None,
            is_default=role_data.is_default,
            tenant_id=uuid.UUID(role_data.tenant_id),
            created_by=uuid.UUID(created_by) if created_by else None
        )
        self.db.add(role)
        await self.db.flush()
        return role

    async def update(self, role_id: str, role_data: RoleUpdate) -> Optional[Role]:
        role = await self.get_by_id(role_id)
        if not role:
            return None
        
        update_data = role_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key == "parent_id" and value:
                value = uuid.UUID(value)
            setattr(role, key, value)
        
        await self.db.flush()
        return role

    async def soft_delete(self, role_id: str) -> bool:
        role = await self.get_by_id(role_id)
        if not role or role.is_system:
            return False
        
        from datetime import datetime
        role.deleted_at = datetime.utcnow()
        await self.db.flush()
        return True

    async def get_permissions(self, role_id: str) -> List[Permission]:
        result = await self.db.execute(
            select(Permission)
            .join(RolePermission)
            .where(RolePermission.role_id == uuid.UUID(role_id))
        )
        return result.scalars().all()

    async def update_permissions(self, role_id: str, permission_ids: List[str], granted: bool = True) -> bool:
        # Delete existing permissions
        await self.db.execute(
            RolePermission.__table__.delete()
            .where(RolePermission.role_id == uuid.UUID(role_id))
        )
        
        # Add new permissions
        for perm_id in permission_ids:
            rp = RolePermission(
                role_id=uuid.UUID(role_id),
                permission_id=uuid.UUID(perm_id),
                granted=granted
            )
            self.db.add(rp)
        
        await self.db.flush()
        return True

    async def assign_to_user(self, role_id: str, user_id: str, assigned_by: Optional[str] = None) -> UserRole:
        ur = UserRole(
            user_id=uuid.UUID(user_id),
            role_id=uuid.UUID(role_id),
            assigned_by=uuid.UUID(assigned_by) if assigned_by else None
        )
        self.db.add(ur)
        await self.db.flush()
        return ur

    async def remove_from_user(self, role_id: str, user_id: str) -> bool:
        result = await self.db.execute(
            UserRole.__table__.delete()
            .where(
                UserRole.role_id == uuid.UUID(role_id),
                UserRole.user_id == uuid.UUID(user_id)
            )
        )
        await self.db.flush()
        return result.rowcount > 0
```

---

Service

```python
# services/role_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from ..repositories.role_repository import RoleRepository
from ..schemas.role import (
    RoleCreate, RoleUpdate, RoleResponse,
    RoleListResponse, PermissionResponse, RoleStatus
)

class RoleService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = RoleRepository(db)

    async def get_role(self, role_id: str) -> Optional[RoleResponse]:
        role = await self.repository.get_by_id(role_id)
        if not role:
            return None
        return RoleResponse(
            id=str(role.id),
            name=role.name,
            description=role.description,
            type=role.type,
            parent_id=str(role.parent_id) if role.parent_id else None,
            level=role.level,
            is_system=role.is_system,
            is_default=role.is_default,
            status=role.status,
            tenant_id=str(role.tenant_id),
            user_count=len(role.users) if role.users else 0,
            permission_count=len(role.permissions) if role.permissions else 0,
            created_at=role.created_at,
            updated_at=role.updated_at
        )

    async def list_roles(
        self,
        tenant_id: str,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> RoleListResponse:
        roles, total = await self.repository.list_roles(
            tenant_id, page, page_size, status, search
        )
        return RoleListResponse(
            roles=[await self.get_role(str(r.id)) for r in roles],
            total=total,
            page=page,
            page_size=page_size
        )

    async def create_role(self, role_data: RoleCreate, created_by: Optional[str] = None) -> RoleResponse:
        role = await self.repository.create(role_data, created_by)
        return await self.get_role(str(role.id))

    async def update_role(self, role_id: str, role_data: RoleUpdate) -> Optional[RoleResponse]:
        role = await self.repository.update(role_id, role_data)
        if not role:
            return None
        return await self.get_role(role_id)

    async def delete_role(self, role_id: str) -> bool:
        role = await self.repository.get_by_id(role_id)
        if not role or role.is_system:
            return False
        return await self.repository.soft_delete(role_id)

    async def get_role_permissions(self, role_id: str) -> List[PermissionResponse]:
        permissions = await self.repository.get_permissions(role_id)
        return [PermissionResponse.model_validate(p) for p in permissions]

    async def update_role_permissions(self, role_id: str, permission_ids: List[str]) -> bool:
        return await self.repository.update_permissions(role_id, permission_ids)

    async def assign_role_to_user(self, role_id: str, user_id: str, assigned_by: Optional[str] = None) -> bool:
        await self.repository.assign_to_user(role_id, user_id, assigned_by)
        return True

    async def remove_role_from_user(self, role_id: str, user_id: str) -> bool:
        return await self.repository.remove_from_user(role_id, user_id)
```

---

Router

```python
# api/routes/role_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from ..database import get_db
from ..services.role_service import RoleService
from ..schemas.role import (
    RoleCreate, RoleUpdate, RoleResponse,
    RoleListResponse, PermissionResponse, RolePermissionUpdate
)
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("/", response_model=RoleListResponse)
async def list_roles(
    tenant_id: str = Query(...),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    return await service.list_roles(tenant_id, page, page_size, status, search)

@router.get("/{role_id}", response_model=RoleResponse)
async def get_role(
    role_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    role = await service.get_role(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.post("/", response_model=RoleResponse, status_code=201)
async def create_role(
    role_data: RoleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    return await service.create_role(role_data, current_user.get("user_id"))

@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(
    role_id: str,
    role_data: RoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    role = await service.update_role(role_id, role_data)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.delete("/{role_id}", status_code=204)
async def delete_role(
    role_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    success = await service.delete_role(role_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot delete system role")
    return None

@router.get("/{role_id}/permissions", response_model=List[PermissionResponse])
async def get_role_permissions(
    role_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    return await service.get_role_permissions(role_id)

@router.put("/{role_id}/permissions")
async def update_role_permissions(
    role_id: str,
    permission_data: RolePermissionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    success = await service.update_role_permissions(role_id, permission_data.permission_ids)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update permissions")
    return {"message": "Permissions updated successfully"}

@router.post("/{role_id}/assign/{user_id}")
async def assign_role_to_user(
    role_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    success = await service.assign_role_to_user(role_id, user_id, current_user.get("user_id"))
    if not success:
        raise HTTPException(status_code=400, detail="Failed to assign role")
    return {"message": "Role assigned successfully"}

@router.delete("/{role_id}/assign/{user_id}")
async def remove_role_from_user(
    role_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = RoleService(db)
    success = await service.remove_role_from_user(role_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to remove role")
    return {"message": "Role removed successfully"}
```

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/roles | List roles |
| GET | /api/v1/roles/{id} | Get role |
| POST | /api/v1/roles | Create role |
| PUT | /api/v1/roles/{id} | Update role |
| DELETE | /api/v1/roles/{id} | Delete role |
| GET | /api/v1/roles/{id}/permissions | Get role permissions |
| PUT | /api/v1/roles/{id}/permissions | Update role permissions |
| POST | /api/v1/roles/{id}/assign/{user_id} | Assign role to user |
| DELETE | /api/v1/roles/{id}/assign/{user_id} | Remove role from user |

---

Acceptance Criteria

1. Pydantic schemas defined for request/response
2. SQLAlchemy models match database schema
3. Repository implements CRUD operations
4. Service implements business logic
5. Router exposes all API endpoints
6. System roles cannot be deleted
7. Role hierarchy supported
8. Permission management implemented

---

Dependencies

032_DB_Role_Management (database tables)
036_User_API (user authentication)

---

Next Steps

After this prompt, implement:

042_Role_Management_UI — React frontend for role management
038_Tenant_API — FastAPI endpoints for tenant management

---

# Architecture References

This prompt shall comply with the following architecture documents:

- 05_Database_Architecture.md — Database schema model (core, engine, reporting, platform, audit)
- 11_Development_Standards.md — Coding standards, repository structure, API standards
- 12_Platform_Integration_Architecture.md — Component boundaries, integration contracts

## Schema Model

This implementation targets the **platform** schema within the **migration_engine** database.

```
migration_engine
├── core       ← What we migrate (metadata, connections, datasets, mappings)
├── engine     ← How we execute (batch, controls, rules, governance, scoring)
├── reporting  ← Results (dimensions, report templates, scheduling)
├── platform   ← MAP V2 features (users, roles, workflows, tasks, notifications, calendar, settings)
└── audit      ← Immutable history (audit events, security events, login history, API logs)
```

## Backend Location

The backend application root is `app/` at the project root.

```
app/
├── api/routes/      # FastAPI route handlers
├── api/models/      # Pydantic request/response models
├── services/        # Business logic
├── db/repositories/ # Data access
```

## API Standard

All APIs use the `/api/v1/` prefix with REST conventions and JWT Bearer Token authentication.
