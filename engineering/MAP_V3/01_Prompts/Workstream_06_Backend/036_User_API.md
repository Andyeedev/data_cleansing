MAP Nexus™ Enterprise Platform
Prompt 036
Backend API — User Management

Version: 1.0

Prompt ID: 036

Workstream: 06 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

031_DB_User_Management

---

Purpose

Create the FastAPI backend for User Management in the MAP Nexus™ platform.

This prompt creates the Python routers, services, models, and repositories required to expose user management functionality via RESTful APIs.

---

Objective

Create a user management API capable of:

User CRUD — Create, read, update, delete users
User Lifecycle — Activate, deactivate, suspend users
Password Management — Reset passwords, force password change
Session Management — Get/revoke user sessions
Activity Tracking — Log user activity

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
user_router.py
services/
user_service.py
api/models/
user.py (SQLAlchemy model)
schemas/
user.py (Pydantic schemas)
db/repositories/
user_repository.py
dependencies/
auth.py
database.py

---

Pydantic Schemas

```python
# schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"
    pending = "pending"
    locked = "locked"
    deactivated = "deactivated"

class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    display_name: Optional[str] = None
    phone: Optional[str] = None
    tenant_id: str
    organisation_id: Optional[str] = None
    department_id: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role_ids: Optional[List[str]] = []

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[UserStatus] = None
    organisation_id: Optional[str] = None
    department_id: Optional[str] = None
    role_ids: Optional[List[str]] = None

class UserResponse(UserBase):
    id: str
    status: UserStatus
    avatar_url: Optional[str] = None
    last_login_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[UserResponse]
    total: int
    page: int
    page_size: int

class PasswordReset(BaseModel):
    new_password: str = Field(..., min_length=8)

class BulkUserImport(BaseModel):
    users: List[UserCreate]
```

---

SQLAlchemy Model

```python
# api/models/user.py
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, JSON
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    email_verified = Column(Boolean, default=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    display_name = Column(String(200))
    avatar_url = Column(Text)
    phone = Column(String(50))
    status = Column(String(50), nullable=False, default="pending")
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    organisation_id = Column(UUID(as_uuid=True))
    department_id = Column(UUID(as_uuid=True))
    last_login_at = Column(DateTime(timezone=True))
    last_login_ip = Column(INET)
    password_changed_at = Column(DateTime(timezone=True))
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime(timezone=True))
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255))
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))
    deleted_at = Column(DateTime(timezone=True))

    # Relationships
    roles = relationship("UserRole", back_populates="user", lazy="selectin")
    sessions = relationship("UserSession", back_populates="user", lazy="selectin")

class UserRole(Base):
    __tablename__ = "user_roles"
    __table_args__ = {"schema": "platform"}

    user_id = Column(UUID(as_uuid=True), ForeignKey("platform.users.id"), primary_key=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("platform.roles.id"), primary_key=True)
    assigned_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    assigned_by = Column(UUID(as_uuid=True))
    expires_at = Column(DateTime(timezone=True))
    is_temporary = Column(Boolean, default=False)

    user = relationship("User", back_populates="roles")
    role = relationship("Role", lazy="selectin")

class UserSession(Base):
    __tablename__ = "user_sessions"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("platform.users.id"), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False)
    user_agent = Column(Text)
    ip_address = Column(INET)
    location = Column(String(255))
    is_active = Column(Boolean, default=True)
    last_activity_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")

class UserActivityLog(Base):
    __tablename__ = "user_activity_log"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("platform.users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100))
    resource_id = Column(UUID(as_uuid=True))
    details = Column(JSON, default={})
    ip_address = Column(INET)
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
```

---

Repository

```python
# db/repositories/user_repository.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List, Tuple
import uuid

from ..models.user import User, UserRole, UserSession, UserActivityLog
from ..schemas.user import UserCreate, UserUpdate

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.roles))
            .where(User.id == uuid.UUID(user_id))
            .where(User.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def list_users(
        self,
        tenant_id: str,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[User], int]:
        query = select(User).where(
            User.tenant_id == uuid.UUID(tenant_id),
            User.deleted_at.is_(None)
        )
        
        if status:
            query = query.where(User.status == status)
        
        if search:
            search_term = f"%{search}%"
            query = query.where(
                (User.email.ilike(search_term)) |
                (User.first_name.ilike(search_term)) |
                (User.last_name.ilike(search_term))
            )
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar()
        
        # Apply pagination
        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(query)
        
        return result.scalars().all(), total

    async def create(self, user_data: UserCreate, created_by: Optional[str] = None) -> User:
        user = User(
            email=user_data.email,
            password_hash="hashed_password",  # TODO: Hash password
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            display_name=user_data.display_name or f"{user_data.first_name} {user_data.last_name}",
            phone=user_data.phone,
            tenant_id=uuid.UUID(user_data.tenant_id),
            organisation_id=uuid.UUID(user_data.organisation_id) if user_data.organisation_id else None,
            department_id=uuid.UUID(user_data.department_id) if user_data.department_id else None,
            created_by=uuid.UUID(created_by) if created_by else None
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def update(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        user = await self.get_by_id(user_id)
        if not user:
            return None
        
        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if key == "organisation_id" and value:
                value = uuid.UUID(value)
            elif key == "department_id" and value:
                value = uuid.UUID(value)
            setattr(user, key, value)
        
        await self.db.flush()
        return user

    async def soft_delete(self, user_id: str) -> bool:
        user = await self.get_by_id(user_id)
        if not user:
            return False
        
        from datetime import datetime
        user.deleted_at = datetime.utcnow()
        await self.db.flush()
        return True

    async def log_activity(
        self,
        user_id: str,
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[dict] = None,
        ip_address: Optional[str] = None
    ) -> UserActivityLog:
        log = UserActivityLog(
            user_id=uuid.UUID(user_id),
            action=action,
            resource_type=resource_type,
            resource_id=uuid.UUID(resource_id) if resource_id else None,
            details=details or {},
            ip_address=ip_address
        )
        self.db.add(log)
        await self.db.flush()
        return log
```

---

Service

```python
# services/user_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from passlib.context import CryptContext

from ..repositories.user_repository import UserRepository
from ..schemas.user import (
    UserCreate, UserUpdate, UserResponse,
    UserListResponse, PasswordReset, UserStatus
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = UserRepository(db)

    async def get_user(self, user_id: str) -> Optional[UserResponse]:
        user = await self.repository.get_by_id(user_id)
        if not user:
            return None
        return UserResponse.model_validate(user)

    async def list_users(
        self,
        tenant_id: str,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> UserListResponse:
        users, total = await self.repository.list_users(
            tenant_id, page, page_size, status, search
        )
        return UserListResponse(
            users=[UserResponse.model_validate(u) for u in users],
            total=total,
            page=page,
            page_size=page_size
        )

    async def create_user(self, user_data: UserCreate, created_by: Optional[str] = None) -> UserResponse:
        # Check if email exists
        existing = await self.repository.get_by_email(user_data.email)
        if existing:
            raise ValueError("Email already exists")
        
        # Hash password
        hashed_password = pwd_context.hash(user_data.password)
        
        # Create user
        user = await self.repository.create(user_data, created_by)
        
        # Log activity
        await self.repository.log_activity(
            user.id, "user_created", "user", user.id
        )
        
        return UserResponse.model_validate(user)

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[UserResponse]:
        user = await self.repository.update(user_id, user_data)
        if not user:
            return None
        
        await self.repository.log_activity(
            user_id, "user_updated", "user", user_id
        )
        
        return UserResponse.model_validate(user)

    async def delete_user(self, user_id: str) -> bool:
        success = await self.repository.soft_delete(user_id)
        if success:
            await self.repository.log_activity(
                user_id, "user_deleted", "user", user_id
            )
        return success

    async def activate_user(self, user_id: str) -> Optional[UserResponse]:
        user_data = UserUpdate(status=UserStatus.active)
        return await self.update_user(user_id, user_data)

    async def deactivate_user(self, user_id: str) -> Optional[UserResponse]:
        user_data = UserUpdate(status=UserStatus.inactive)
        return await self.update_user(user_id, user_data)

    async def suspend_user(self, user_id: str) -> Optional[UserResponse]:
        user_data = UserUpdate(status=UserStatus.suspended)
        return await self.update_user(user_id, user_data)

    async def reset_password(self, user_id: str, new_password: str) -> bool:
        # TODO: Hash password and update
        # TODO: Send notification email
        await self.repository.log_activity(
            user_id, "password_reset", "user", user_id
        )
        return True
```

---

Router

```python
# api/routes/user_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from ..database import get_db
from ..services.user_service import UserService
from ..schemas.user import (
    UserCreate, UserUpdate, UserResponse,
    UserListResponse, PasswordReset
)
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=UserListResponse)
async def list_users(
    tenant_id: str = Query(...),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    return await service.list_users(tenant_id, page, page_size, status, search)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    try:
        return await service.create_user(user_data, current_user.get("user_id"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    user = await service.update_user(user_id, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    success = await service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return None

@router.post("/{user_id}/activate", response_model=UserResponse)
async def activate_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    user = await service.activate_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/deactivate", response_model=UserResponse)
async def deactivate_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    user = await service.deactivate_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/suspend", response_model=UserResponse)
async def suspend_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    user = await service.suspend_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/reset-password")
async def reset_password(
    user_id: str,
    password_data: PasswordReset,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = UserService(db)
    success = await service.reset_password(user_id, password_data.new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Password reset failed")
    return {"message": "Password reset successful"}
```

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/users | List users |
| GET | /api/v1/users/{id} | Get user |
| POST | /api/v1/users | Create user |
| PUT | /api/v1/users/{id} | Update user |
| DELETE | /api/v1/users/{id} | Delete user |
| POST | /api/v1/users/{id}/activate | Activate user |
| POST | /api/v1/users/{id}/deactivate | Deactivate user |
| POST | /api/v1/users/{id}/suspend | Suspend user |
| POST | /api/v1/users/{id}/reset-password | Reset password |

---

Acceptance Criteria

1. Pydantic schemas defined for request/response
2. SQLAlchemy models match database schema
3. Repository implements CRUD operations
4. Service implements business logic
5. Router exposes all API endpoints
6. Authentication middleware applied
7. Error handling implemented
8. Activity logging implemented
9. API documentation auto-generated

---

Dependencies

031_DB_User_Management (database tables)
FastAPI framework
SQLAlchemy async
asyncpg driver

---

Next Steps

After this prompt, implement:

041_User_Management_UI — React frontend for user management
037_Role_API — FastAPI endpoints for role management

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
