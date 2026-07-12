MAP Nexus™ Enterprise Platform
Prompt 038
Backend API — Tenant Management

Version: 1.0

Prompt ID: 038

Workstream: 06 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

033_DB_Tenant_Management
036_User_API

---

Purpose

Create the FastAPI backend for Tenant Management in the MAP Nexus™ platform.

This prompt creates the Python routers, services, models, and repositories required to expose multi-tenant management functionality via RESTful APIs.

---

Objective

Create a tenant management API capable of:

Tenant CRUD — Create, read, update, delete tenants
Tenant Configuration — Per-tenant settings
Organisation Management — Organisations and departments
Tenant Lifecycle — Activate, suspend, archive tenants
Tenant Analytics — Usage metrics and statistics

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
tenant_router.py
services/
tenant_service.py
api/models/
tenant.py (SQLAlchemy model)
schemas/
tenant.py (Pydantic schemas)
db/repositories/
tenant_repository.py

---

Pydantic Schemas

```python
# schemas/tenant.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class TenantStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"
    provisioning = "provisioning"
    deprovisioning = "deprovisioning"
    archived = "archived"

class TenantTier(str, Enum):
    free = "free"
    starter = "starter"
    professional = "professional"
    enterprise = "enterprise"
    custom = "custom"

class TenantBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    description: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_name: Optional[str] = None
    website: Optional[str] = None
    parent_id: Optional[str] = None

class TenantCreate(TenantBase):
    tier: TenantTier = TenantTier.free
    max_users: int = 10
    max_storage_gb: int = 10
    max_api_calls: int = 10000
    max_projects: int = 5

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TenantStatus] = None
    tier: Optional[TenantTier] = None
    contact_email: Optional[EmailStr] = None
    contact_name: Optional[str] = None
    website: Optional[str] = None
    max_users: Optional[int] = None
    max_storage_gb: Optional[int] = None
    max_api_calls: Optional[int] = None
    max_projects: Optional[int] = None

class TenantResponse(TenantBase):
    id: str
    status: TenantStatus
    tier: TenantTier
    max_users: int
    max_storage_gb: int
    max_api_calls: int
    max_projects: int
    user_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TenantListResponse(BaseModel):
    tenants: List[TenantResponse]
    total: int
    page: int
    page_size: int

class TenantBranding(BaseModel):
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_color: str = "#3B82F6"
    secondary_color: str = "#10B981"
    custom_css: Optional[str] = None
    login_message: Optional[str] = None
    footer_text: Optional[str] = None

class TenantConfiguration(BaseModel):
    settings: Dict[str, Any] = {}

class OrganisationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    parent_id: Optional[str] = None

class OrganisationCreate(OrganisationBase):
    tenant_id: str

class OrganisationResponse(OrganisationBase):
    id: str
    tenant_id: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    organisation_id: str

class DepartmentResponse(DepartmentBase):
    id: str
    organisation_id: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TenantHealth(BaseModel):
    status: str
    last_check: Optional[datetime] = None
    uptime: float = 0
    response_time: float = 0
    error_rate: float = 0

class TenantUsage(BaseModel):
    current_users: int
    current_storage_gb: float
    current_api_calls: int
    current_projects: int
    usage_trend: str = "stable"

class TenantStats(BaseModel):
    total_tenants: int
    active_tenants: int
    total_users: int
    tenants_by_tier: Dict[str, int]
```

---

SQLAlchemy Model

```python
# api/models/tenant.py
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, JSON, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base

class Tenant(Base):
    __tablename__ = "tenants"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    status = Column(String(50), nullable=False, default="active")
    tier = Column(String(50), nullable=False, default="free")
    parent_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"))
    contact_email = Column(String(255))
    contact_name = Column(String(200))
    website = Column(String(500))
    logo_url = Column(Text)
    favicon_url = Column(Text)
    primary_color = Column(String(7), default="#3B82F6")
    secondary_color = Column(String(7), default="#10B981")
    custom_css = Column(Text)
    login_message = Column(Text)
    footer_text = Column(Text)
    max_users = Column(Integer, default=10)
    max_storage_gb = Column(Integer, default=10)
    max_api_calls = Column(Integer, default=10000)
    max_projects = Column(Integer, default=5)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))
    deleted_at = Column(DateTime(timezone=True))

    # Relationships
    organisations = relationship("Organisation", back_populates="tenant", lazy="selectin")
    subscriptions = relationship("Subscription", back_populates="tenant", lazy="selectin")

class Organisation(Base):
    __tablename__ = "organisations"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(50), nullable=False, default="active")
    parent_id = Column(UUID(as_uuid=True), ForeignKey("platform.organisations.id"))
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))
    deleted_at = Column(DateTime(timezone=True))

    tenant = relationship("Tenant", back_populates="organisations")
    departments = relationship("Department", back_populates="organisation", lazy="selectin")

class Department(Base):
    __tablename__ = "departments"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organisation_id = Column(UUID(as_uuid=True), ForeignKey("platform.organisations.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(String(50), nullable=False, default="active")
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))
    deleted_at = Column(DateTime(timezone=True))

    organisation = relationship("Organisation", back_populates="departments")

class TenantConfiguration(Base):
    __tablename__ = "tenant_configurations"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"), nullable=False)
    category = Column(String(100), nullable=False)
    key = Column(String(200), nullable=False)
    value = Column(JSON, nullable=False)
    description = Column(Text)
    is_sensitive = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(UUID(as_uuid=True))

class TenantFeature(Base):
    __tablename__ = "tenant_features"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"), nullable=False)
    feature_key = Column(String(100), nullable=False)
    enabled = Column(Boolean, default=True)
    config = Column(JSON, default={})
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

Repository

```python
# db/repositories/tenant_repository.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Optional, List, Tuple
import uuid

from ..models.tenant import Tenant, Organisation, Department, TenantConfiguration
from ..schemas.tenant import TenantCreate, TenantUpdate

class TenantRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, tenant_id: str) -> Optional[Tenant]:
        result = await self.db.execute(
            select(Tenant)
            .options(
                selectinload(Tenant.organisations),
                selectinload(Tenant.subscriptions)
            )
            .where(Tenant.id == uuid.UUID(tenant_id))
            .where(Tenant.deleted_at.is_(None))
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Optional[Tenant]:
        result = await self.db.execute(
            select(Tenant).where(Tenant.slug == slug)
        )
        return result.scalar_one_or_none()

    async def list_tenants(
        self,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        tier: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Tenant], int]:
        query = select(Tenant).where(Tenant.deleted_at.is_(None))
        
        if status:
            query = query.where(Tenant.status == status)
        if tier:
            query = query.where(Tenant.tier == tier)
        if search:
            search_term = f"%{search}%"
            query = query.where(
                (Tenant.name.ilike(search_term)) |
                (Tenant.slug.ilike(search_term))
            )
        
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar()
        
        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(query)
        
        return result.scalars().all(), total

    async def create(self, tenant_data: TenantCreate, created_by: Optional[str] = None) -> Tenant:
        tenant = Tenant(
            name=tenant_data.name,
            slug=tenant_data.slug,
            description=tenant_data.description,
            tier=tenant_data.tier,
            contact_email=tenant_data.contact_email,
            contact_name=tenant_data.contact_name,
            website=tenant_data.website,
            parent_id=uuid.UUID(tenant_data.parent_id) if tenant_data.parent_id else None,
            max_users=tenant_data.max_users,
            max_storage_gb=tenant_data.max_storage_gb,
            max_api_calls=tenant_data.max_api_calls,
            max_projects=tenant_data.max_projects,
            created_by=uuid.UUID(created_by) if created_by else None
        )
        self.db.add(tenant)
        await self.db.flush()
        return tenant

    async def update(self, tenant_id: str, tenant_data: TenantUpdate) -> Optional[Tenant]:
        tenant = await self.get_by_id(tenant_id)
        if not tenant:
            return None
        
        update_data = tenant_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(tenant, key, value)
        
        await self.db.flush()
        return tenant

    async def soft_delete(self, tenant_id: str) -> bool:
        tenant = await self.get_by_id(tenant_id)
        if not tenant:
            return False
        
        from datetime import datetime
        tenant.deleted_at = datetime.utcnow()
        await self.db.flush()
        return True

    async def get_organisations(self, tenant_id: str) -> List[Organisation]:
        result = await self.db.execute(
            select(Organisation)
            .where(Organisation.tenant_id == uuid.UUID(tenant_id))
            .where(Organisation.deleted_at.is_(None))
        )
        return result.scalars().all()

    async def create_organisation(self, tenant_id: str, name: str, description: Optional[str] = None) -> Organisation:
        org = Organisation(
            tenant_id=uuid.UUID(tenant_id),
            name=name,
            description=description
        )
        self.db.add(org)
        await self.db.flush()
        return org

    async def get_departments(self, organisation_id: str) -> List[Department]:
        result = await self.db.execute(
            select(Department)
            .where(Department.organisation_id == uuid.UUID(organisation_id))
            .where(Department.deleted_at.is_(None))
        )
        return result.scalars().all()

    async def create_department(self, organisation_id: str, name: str, description: Optional[str] = None) -> Department:
        dept = Department(
            organisation_id=uuid.UUID(organisation_id),
            name=name,
            description=description
        )
        self.db.add(dept)
        await self.db.flush()
        return dept
```

---

Service

```python
# services/tenant_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from ..repositories.tenant_repository import TenantRepository
from ..schemas.tenant import (
    TenantCreate, TenantUpdate, TenantResponse,
    TenantListResponse, OrganisationCreate, OrganisationResponse,
    DepartmentCreate, DepartmentResponse, TenantStats
)

class TenantService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = TenantRepository(db)

    async def get_tenant(self, tenant_id: str) -> Optional[TenantResponse]:
        tenant = await self.repository.get_by_id(tenant_id)
        if not tenant:
            return None
        return TenantResponse(
            id=str(tenant.id),
            name=tenant.name,
            slug=tenant.slug,
            description=tenant.description,
            contact_email=tenant.contact_email,
            contact_name=tenant.contact_name,
            website=tenant.website,
            parent_id=str(tenant.parent_id) if tenant.parent_id else None,
            status=tenant.status,
            tier=tenant.tier,
            max_users=tenant.max_users,
            max_storage_gb=tenant.max_storage_gb,
            max_api_calls=tenant.max_api_calls,
            max_projects=tenant.max_projects,
            user_count=0,  # TODO: Count users
            created_at=tenant.created_at,
            updated_at=tenant.updated_at
        )

    async def list_tenants(
        self,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        tier: Optional[str] = None,
        search: Optional[str] = None
    ) -> TenantListResponse:
        tenants, total = await self.repository.list_tenants(
            page, page_size, status, tier, search
        )
        return TenantListResponse(
            tenants=[await self.get_tenant(str(t.id)) for t in tenants],
            total=total,
            page=page,
            page_size=page_size
        )

    async def create_tenant(self, tenant_data: TenantCreate, created_by: Optional[str] = None) -> TenantResponse:
        # Check slug uniqueness
        existing = await self.repository.get_by_slug(tenant_data.slug)
        if existing:
            raise ValueError("Slug already exists")
        
        tenant = await self.repository.create(tenant_data, created_by)
        return await self.get_tenant(str(tenant.id))

    async def update_tenant(self, tenant_id: str, tenant_data: TenantUpdate) -> Optional[TenantResponse]:
        tenant = await self.repository.update(tenant_id, tenant_data)
        if not tenant:
            return None
        return await self.get_tenant(tenant_id)

    async def delete_tenant(self, tenant_id: str) -> bool:
        return await self.repository.soft_delete(tenant_id)

    async def activate_tenant(self, tenant_id: str) -> Optional[TenantResponse]:
        from ..schemas.tenant import TenantStatus
        tenant_data = TenantUpdate(status=TenantStatus.active)
        return await self.update_tenant(tenant_id, tenant_data)

    async def suspend_tenant(self, tenant_id: str, reason: Optional[str] = None) -> Optional[TenantResponse]:
        from ..schemas.tenant import TenantStatus
        tenant_data = TenantUpdate(status=TenantStatus.suspended)
        return await self.update_tenant(tenant_id, tenant_data)

    async def get_organisations(self, tenant_id: str) -> List[OrganisationResponse]:
        orgs = await self.repository.get_organisations(tenant_id)
        return [OrganisationResponse.model_validate(o) for o in orgs]

    async def create_organisation(self, tenant_id: str, data: OrganisationCreate) -> OrganisationResponse:
        org = await self.repository.create_organisation(tenant_id, data.name, data.description)
        return OrganisationResponse.model_validate(org)

    async def get_departments(self, organisation_id: str) -> List[DepartmentResponse]:
        depts = await self.repository.get_departments(organisation_id)
        return [DepartmentResponse.model_validate(d) for d in depts]

    async def create_department(self, organisation_id: str, data: DepartmentCreate) -> DepartmentResponse:
        dept = await self.repository.create_department(organisation_id, data.name, data.description)
        return DepartmentResponse.model_validate(dept)
```

---

Router

```python
# api/routes/tenant_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from ..database import get_db
from ..services.tenant_service import TenantService
from ..schemas.tenant import (
    TenantCreate, TenantUpdate, TenantResponse,
    TenantListResponse, OrganisationCreate, OrganisationResponse,
    DepartmentCreate, DepartmentResponse
)
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/tenants", tags=["tenants"])

@router.get("/", response_model=TenantListResponse)
async def list_tenants(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    tier: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    return await service.list_tenants(page, page_size, status, tier, search)

@router.get("/{tenant_id}", response_model=TenantResponse)
async def get_tenant(
    tenant_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    tenant = await service.get_tenant(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.post("/", response_model=TenantResponse, status_code=201)
async def create_tenant(
    tenant_data: TenantCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    try:
        return await service.create_tenant(tenant_data, current_user.get("user_id"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{tenant_id}", response_model=TenantResponse)
async def update_tenant(
    tenant_id: str,
    tenant_data: TenantUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    tenant = await service.update_tenant(tenant_id, tenant_data)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.delete("/{tenant_id}", status_code=204)
async def delete_tenant(
    tenant_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    success = await service.delete_tenant(tenant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return None

@router.post("/{tenant_id}/activate", response_model=TenantResponse)
async def activate_tenant(
    tenant_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    tenant = await service.activate_tenant(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.post("/{tenant_id}/suspend", response_model=TenantResponse)
async def suspend_tenant(
    tenant_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    tenant = await service.suspend_tenant(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.get("/{tenant_id}/organisations", response_model=List[OrganisationResponse])
async def list_organisations(
    tenant_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    return await service.get_organisations(tenant_id)

@router.post("/{tenant_id}/organisations", response_model=OrganisationResponse, status_code=201)
async def create_organisation(
    tenant_id: str,
    org_data: OrganisationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    return await service.create_organisation(tenant_id, org_data)

@router.get("/organisations/{organisation_id}/departments", response_model=List[DepartmentResponse])
async def list_departments(
    organisation_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    return await service.get_departments(organisation_id)

@router.post("/organisations/{organisation_id}/departments", response_model=DepartmentResponse, status_code=201)
async def create_department(
    organisation_id: str,
    dept_data: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = TenantService(db)
    return await service.create_department(organisation_id, dept_data)
```

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/tenants | List tenants |
| GET | /api/v1/tenants/{id} | Get tenant |
| POST | /api/v1/tenants | Create tenant |
| PUT | /api/v1/tenants/{id} | Update tenant |
| DELETE | /api/v1/tenants/{id} | Delete tenant |
| POST | /api/v1/tenants/{id}/activate | Activate tenant |
| POST | /api/v1/tenants/{id}/suspend | Suspend tenant |
| GET | /api/v1/tenants/{id}/organisations | List organisations |
| POST | /api/v1/tenants/{id}/organisations | Create organisation |
| GET | /api/v1/organisations/{id}/departments | List departments |
| POST | /api/v1/organisations/{id}/departments | Create department |

---

Acceptance Criteria

1. Pydantic schemas defined for request/response
2. SQLAlchemy models match database schema
3. Repository implements CRUD operations
4. Service implements business logic
5. Router exposes all API endpoints
6. Slug uniqueness enforced
7. Tenant lifecycle managed
8. Organisation hierarchy supported

---

Dependencies

033_DB_Tenant_Management (database tables)
036_User_API (user authentication)

---

Next Steps

After this prompt, implement:

043_Tenant_Management_UI — React frontend for tenant management
039_Subscription_API — FastAPI endpoints for subscription management

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
