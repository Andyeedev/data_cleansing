MAP Nexus™ Enterprise Platform
Prompt 039
Backend API — Subscription Management

Version: 1.0

Prompt ID: 039

Workstream: 06 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

034_DB_Subscription_Management
038_Tenant_API

---

Purpose

Create the FastAPI backend for Subscription Management in the MAP Nexus™ platform.

This prompt creates the Python routers, services, models, and repositories required to expose subscription and billing management functionality via RESTful APIs.

---

Objective

Create a subscription management API capable of:

Plan Management — CRUD for subscription plans
Subscription Management — Create, modify, cancel subscriptions
Billing — Invoice generation and payment processing
Usage Tracking — Monitor feature usage
License Management — License key generation

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
subscription_router.py
services/
subscription_service.py
api/models/
subscription.py (SQLAlchemy model)
schemas/
subscription.py (Pydantic schemas)
db/repositories/
subscription_repository.py

---

Pydantic Schemas

```python
# schemas/subscription.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

class PlanType(str, Enum):
    free = "free"
    starter = "starter"
    professional = "professional"
    enterprise = "enterprise"
    custom = "custom"

class PlanStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    deprecated = "deprecated"
    draft = "draft"

class SubscriptionStatus(str, Enum):
    active = "active"
    trialing = "trialing"
    past_due = "past_due"
    paused = "paused"
    canceled = "canceled"
    expired = "expired"
    pending = "pending"

class BillingCycle(str, Enum):
    monthly = "monthly"
    quarterly = "quarterly"
    annually = "annually"
    one_time = "one_time"

class InvoiceStatus(str, Enum):
    draft = "draft"
    sent = "sent"
    paid = "paid"
    overdue = "overdue"
    canceled = "canceled"
    refunded = "refunded"

class PlanBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    type: PlanType
    monthly_price: float = 0
    annual_price: float = 0
    currency: str = "USD"
    trial_days: int = 0
    setup_fee: float = 0
    max_users: Optional[int] = None
    max_storage_gb: Optional[int] = None
    max_api_calls: Optional[int] = None
    max_projects: Optional[int] = None
    features: List[str] = []
    is_public: bool = True
    display_order: int = 0

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    monthly_price: Optional[float] = None
    annual_price: Optional[float] = None
    trial_days: Optional[int] = None
    max_users: Optional[int] = None
    max_storage_gb: Optional[int] = None
    max_api_calls: Optional[int] = None
    max_projects: Optional[int] = None
    features: Optional[List[str]] = None
    status: Optional[PlanStatus] = None

class PlanResponse(PlanBase):
    id: str
    status: PlanStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PlanListResponse(BaseModel):
    plans: List[PlanResponse]
    total: int

class SubscriptionBase(BaseModel):
    tenant_id: str
    plan_id: str
    billing_cycle: BillingCycle = BillingCycle.monthly
    quantity: int = 1
    discount_percent: float = 0
    auto_renew: bool = True

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    plan_id: Optional[str] = None
    billing_cycle: Optional[BillingCycle] = None
    quantity: Optional[int] = None
    discount_percent: Optional[float] = None
    auto_renew: Optional[bool] = None
    cancel_reason: Optional[str] = None

class SubscriptionResponse(SubscriptionBase):
    id: str
    status: SubscriptionStatus
    monthly_amount: float
    currency: str
    start_date: date
    end_date: Optional[date] = None
    next_billing_date: Optional[date] = None
    trial_end_date: Optional[date] = None
    canceled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SubscriptionListResponse(BaseModel):
    subscriptions: List[SubscriptionResponse]
    total: int
    page: int
    page_size: int

class InvoiceItem(BaseModel):
    description: str
    quantity: float = 1
    unit_price: float
    amount: float
    tax_rate: float = 0
    tax_amount: float = 0

class InvoiceResponse(BaseModel):
    id: str
    subscription_id: str
    tenant_id: str
    invoice_number: str
    status: InvoiceStatus
    amount: float
    tax_amount: float
    discount_amount: float
    total_amount: float
    currency: str
    due_date: date
    paid_at: Optional[datetime] = None
    items: List[InvoiceItem] = []
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvoiceListResponse(BaseModel):
    invoices: List[InvoiceResponse]
    total: int

class UsageRecord(BaseModel):
    feature_key: str
    quantity: float = 1
    unit: str = "count"

class UsageResponse(BaseModel):
    feature_key: str
    total_quantity: float
    period_start: date
    period_end: date

class LicenseResponse(BaseModel):
    id: str
    key: str
    subscription_id: str
    tenant_id: str
    plan_id: str
    status: str
    activated_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    max_activations: int
    current_activations: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class SubscriptionStats(BaseModel):
    total_subscriptions: int
    active_subscriptions: int
    trialing_subscriptions: int
    mrr: float
    arr: float
    subscriptions_by_plan: Dict[str, int]
```

---

SQLAlchemy Model

```python
# api/models/subscription.py
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, JSON, Numeric, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base

class Plan(Base):
    __tablename__ = "plans"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="active")
    monthly_price = Column(Numeric(10,2), default=0)
    annual_price = Column(Numeric(10,2), default=0)
    currency = Column(String(3), default="USD")
    trial_days = Column(Integer, default=0)
    setup_fee = Column(Numeric(10,2), default=0)
    max_users = Column(Integer)
    max_storage_gb = Column(Integer)
    max_api_calls = Column(Integer)
    max_projects = Column(Integer)
    features = Column(JSON, default=[])
    is_public = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

class Subscription(Base):
    __tablename__ = "subscriptions"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("platform.plans.id"), nullable=False)
    status = Column(String(50), nullable=False, default="active")
    billing_cycle = Column(String(50), nullable=False, default="monthly")
    quantity = Column(Integer, default=1)
    discount_percent = Column(Numeric(5,2), default=0)
    monthly_amount = Column(Numeric(10,2), nullable=False)
    currency = Column(String(3), default="USD")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    next_billing_date = Column(Date)
    trial_end_date = Column(Date)
    canceled_at = Column(DateTime(timezone=True))
    cancel_reason = Column(Text)
    auto_renew = Column(Boolean, default=True)
    payment_method_id = Column(UUID(as_uuid=True))
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))

    tenant = relationship("Tenant", lazy="selectin")
    plan = relationship("Plan", lazy="selectin")

class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("platform.subscriptions.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"), nullable=False)
    invoice_number = Column(String(50), unique=True, nullable=False)
    status = Column(String(50), nullable=False, default="draft")
    amount = Column(Numeric(10,2), nullable=False)
    tax_amount = Column(Numeric(10,2), default=0)
    discount_amount = Column(Numeric(10,2), default=0)
    total_amount = Column(Numeric(10,2), nullable=False)
    currency = Column(String(3), default="USD")
    due_date = Column(Date, nullable=False)
    paid_at = Column(DateTime(timezone=True))
    payment_method = Column(String(50))
    payment_reference = Column(String(255))
    notes = Column(Text)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    subscription = relationship("Subscription", lazy="selectin")

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("platform.invoices.id"), nullable=False)
    description = Column(String(500), nullable=False)
    quantity = Column(Numeric(10,2), default=1)
    unit_price = Column(Numeric(10,2), nullable=False)
    amount = Column(Numeric(10,2), nullable=False)
    tax_rate = Column(Numeric(5,2), default=0)
    tax_amount = Column(Numeric(10,2), default=0)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    invoice = relationship("Invoice", backref="items")

class UsageRecord(Base):
    __tablename__ = "usage_records"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"), nullable=False)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("platform.subscriptions.id"), nullable=False)
    feature_key = Column(String(100), nullable=False)
    quantity = Column(Numeric(10,2), default=1)
    unit = Column(String(50), default="count")
    recorded_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class License(Base):
    __tablename__ = "licenses"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(String(255), unique=True, nullable=False)
    subscription_id = Column(UUID(as_uuid=True), ForeignKey("platform.subscriptions.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("platform.tenants.id"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("platform.plans.id"), nullable=False)
    status = Column(String(50), nullable=False, default="active")
    activated_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    max_activations = Column(Integer, default=1)
    current_activations = Column(Integer, default=0)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

Repository

```python
# db/repositories/subscription_repository.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List, Tuple
import uuid
import secrets

from ..models.subscription import Plan, Subscription, Invoice, InvoiceItem, UsageRecord, License
from ..schemas.subscription import PlanCreate, SubscriptionCreate

class SubscriptionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_plan_by_id(self, plan_id: str) -> Optional[Plan]:
        result = await self.db.execute(
            select(Plan).where(Plan.id == uuid.UUID(plan_id))
        )
        return result.scalar_one_or_none()

    async def list_plans(self, include_inactive: bool = False) -> List[Plan]:
        query = select(Plan)
        if not include_inactive:
            query = query.where(Plan.status == "active")
        query = query.order_by(Plan.display_order)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_plan(self, plan_data: PlanCreate) -> Plan:
        plan = Plan(**plan_data.model_dump())
        self.db.add(plan)
        await self.db.flush()
        return plan

    async def get_subscription_by_id(self, subscription_id: str) -> Optional[Subscription]:
        result = await self.db.execute(
            select(Subscription)
            .where(Subscription.id == uuid.UUID(subscription_id))
        )
        return result.scalar_one_or_none()

    async def list_subscriptions(
        self,
        tenant_id: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Subscription], int]:
        query = select(Subscription)
        if tenant_id:
            query = query.where(Subscription.tenant_id == uuid.UUID(tenant_id))
        
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar()
        
        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await self.db.execute(query)
        
        return result.scalars().all(), total

    async def create_subscription(self, sub_data: SubscriptionCreate, monthly_amount: float) -> Subscription:
        from datetime import date
        sub = Subscription(
            tenant_id=uuid.UUID(sub_data.tenant_id),
            plan_id=uuid.UUID(sub_data.plan_id),
            billing_cycle=sub_data.billing_cycle,
            quantity=sub_data.quantity,
            discount_percent=sub_data.discount_percent,
            auto_renew=sub_data.auto_renew,
            monthly_amount=monthly_amount,
            start_date=date.today(),
            next_billing_date=date.today()
        )
        self.db.add(sub)
        await self.db.flush()
        return sub

    async def update_subscription(self, subscription_id: str, updates: dict) -> Optional[Subscription]:
        sub = await self.get_subscription_by_id(subscription_id)
        if not sub:
            return None
        for key, value in updates.items():
            setattr(sub, key, value)
        await self.db.flush()
        return sub

    async def create_invoice(self, subscription_id: str, tenant_id: str, amount: float) -> Invoice:
        from datetime import date
        invoice = Invoice(
            subscription_id=uuid.UUID(subscription_id),
            tenant_id=uuid.UUID(tenant_id),
            invoice_number=f"INV-{secrets.token_hex(4).upper()}",
            amount=amount,
            total_amount=amount,
            due_date=date.today()
        )
        self.db.add(invoice)
        await self.db.flush()
        return invoice

    async def record_usage(self, tenant_id: str, subscription_id: str, feature_key: str, quantity: float) -> UsageRecord:
        usage = UsageRecord(
            tenant_id=uuid.UUID(tenant_id),
            subscription_id=uuid.UUID(subscription_id),
            feature_key=feature_key,
            quantity=quantity
        )
        self.db.add(usage)
        await self.db.flush()
        return usage

    async def generate_license(self, subscription_id: str, tenant_id: str, plan_id: str) -> License:
        license_key = f"MAP-{secrets.token_hex(4).upper()}-{secrets.token_hex(4).upper()}-{secrets.token_hex(4).upper()}"
        license = License(
            key=license_key,
            subscription_id=uuid.UUID(subscription_id),
            tenant_id=uuid.UUID(tenant_id),
            plan_id=uuid.UUID(plan_id)
        )
        self.db.add(license)
        await self.db.flush()
        return license
```

---

Service

```python
# services/subscription_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from ..repositories.subscription_repository import SubscriptionRepository
from ..schemas.subscription import (
    PlanCreate, PlanResponse, SubscriptionCreate,
    SubscriptionResponse, SubscriptionStatus, InvoiceResponse
)

class SubscriptionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = SubscriptionRepository(db)

    async def list_plans(self, include_inactive: bool = False) -> List[PlanResponse]:
        plans = await self.repository.list_plans(include_inactive)
        return [PlanResponse.model_validate(p) for p in plans]

    async def get_plan(self, plan_id: str) -> Optional[PlanResponse]:
        plan = await self.repository.get_plan_by_id(plan_id)
        if not plan:
            return None
        return PlanResponse.model_validate(plan)

    async def create_plan(self, plan_data: PlanCreate) -> PlanResponse:
        plan = await self.repository.create_plan(plan_data)
        return PlanResponse.model_validate(plan)

    async def create_subscription(self, sub_data: SubscriptionCreate) -> SubscriptionResponse:
        # Get plan to calculate amount
        plan = await self.repository.get_plan_by_id(sub_data.plan_id)
        if not plan:
            raise ValueError("Plan not found")
        
        # Calculate monthly amount
        if sub_data.billing_cycle == "annually":
            monthly_amount = float(plan.annual_price) / 12
        else:
            monthly_amount = float(plan.monthly_price)
        
        # Apply discount
        if sub_data.discount_percent > 0:
            monthly_amount = monthly_amount * (1 - sub_data.discount_percent / 100)
        
        sub = await self.repository.create_subscription(sub_data, monthly_amount)
        return SubscriptionResponse.model_validate(sub)

    async def cancel_subscription(self, subscription_id: str, reason: Optional[str] = None) -> Optional[SubscriptionResponse]:
        from datetime import datetime
        sub = await self.repository.update_subscription(
            subscription_id,
            {
                "status": SubscriptionStatus.canceled,
                "canceled_at": datetime.utcnow(),
                "cancel_reason": reason
            }
        )
        if not sub:
            return None
        return SubscriptionResponse.model_validate(sub)

    async def get_invoices(self, tenant_id: str) -> List[InvoiceResponse]:
        # TODO: Implement invoice retrieval
        return []

    async def track_usage(self, tenant_id: str, subscription_id: str, feature_key: str, quantity: float = 1):
        await self.repository.record_usage(tenant_id, subscription_id, feature_key, quantity)
```

---

Router

```python
# api/routes/subscription_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List

from ..database import get_db
from ..services.subscription_service import SubscriptionService
from ..schemas.subscription import (
    PlanCreate, PlanResponse, PlanListResponse,
    SubscriptionCreate, SubscriptionResponse, SubscriptionListResponse
)
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])

@router.get("/plans", response_model=PlanListResponse)
async def list_plans(
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SubscriptionService(db)
    plans = await service.list_plans(include_inactive)
    return PlanListResponse(plans=plans, total=len(plans))

@router.get("/plans/{plan_id}", response_model=PlanResponse)
async def get_plan(
    plan_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SubscriptionService(db)
    plan = await service.get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.post("/plans", response_model=PlanResponse, status_code=201)
async def create_plan(
    plan_data: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SubscriptionService(db)
    return await service.create_plan(plan_data)

@router.get("/", response_model=SubscriptionListResponse)
async def list_subscriptions(
    tenant_id: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SubscriptionService(db)
    # TODO: Implement listing
    return SubscriptionListResponse(subscriptions=[], total=0, page=page, page_size=page_size)

@router.post("/", response_model=SubscriptionResponse, status_code=201)
async def create_subscription(
    sub_data: SubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SubscriptionService(db)
    try:
        return await service.create_subscription(sub_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{subscription_id}/cancel", response_model=SubscriptionResponse)
async def cancel_subscription(
    subscription_id: str,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SubscriptionService(db)
    sub = await service.cancel_subscription(subscription_id, reason)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub
```

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/subscriptions/plans | List plans |
| GET | /api/v1/subscriptions/plans/{id} | Get plan |
| POST | /api/v1/subscriptions/plans | Create plan |
| GET | /api/v1/subscriptions | List subscriptions |
| POST | /api/v1/subscriptions | Create subscription |
| POST | /api/v1/subscriptions/{id}/cancel | Cancel subscription |
| GET | /api/v1/subscriptions/{id}/invoices | List invoices |
| POST | /api/v1/subscriptions/{id}/usage | Track usage |

---

Acceptance Criteria

1. Plan management CRUD implemented
2. Subscription creation calculates correct amount
3. Subscription cancellation updates status
4. Invoice generation works
5. Usage tracking records events
6. License generation creates unique keys

---

Dependencies

034_DB_Subscription_Management (database tables)
038_Tenant_API (tenant validation)

---

Next Steps

After this prompt, implement:

044_Subscription_UI — React frontend for subscription management
040_System_Settings_API — FastAPI endpoints for system settings

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
