MAP Nexus™ Enterprise Platform
Prompt 040
Backend API — System Settings

Version: 1.0

Prompt ID: 040

Workstream: 06 — Backend

Status: Draft — Pending Review

---

Prerequisites

Complete

035_DB_System_Settings
036_User_API

---

Purpose

Create the FastAPI backend for System Settings in the MAP Nexus™ platform.

This prompt creates the Python routers, services, models, and repositories required to expose system configuration, feature flags, environment management, and health monitoring functionality via RESTful APIs.

---

Objective

Create a system settings API capable of:

Global Configuration — Read/write platform settings
Feature Flags — Toggle features and manage rollouts
Environment Management — CRUD for environments
System Health — Health checks and metrics
Alerts — System alerts and incidents

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
settings_router.py
services/
settings_service.py
api/models/
settings.py (SQLAlchemy model)
schemas/
settings.py (Pydantic schemas)
db/repositories/
settings_repository.py

---

Pydantic Schemas

```python
# schemas/settings.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class SettingDataType(str, Enum):
    string = "string"
    number = "number"
    boolean = "boolean"
    json = "json"
    array = "array"
    date = "date"
    enum = "enum"

class SettingCategory(str, Enum):
    general = "general"
    security = "security"
    performance = "performance"
    notifications = "notifications"
    integrations = "integrations"
    compliance = "compliance"
    feature_flags = "feature_flags"
    environment = "environment"
    maintenance = "maintenance"

class SystemSettingBase(BaseModel):
    category: SettingCategory
    key: str = Field(..., min_length=1, max_length=200)
    value: Any
    description: Optional[str] = None
    data_type: SettingDataType
    is_required: bool = False
    is_readonly: bool = False
    default_value: Optional[Any] = None
    validation_rules: Optional[Dict[str, Any]] = None
    tenant_scoped: bool = False
    environment_scoped: bool = False

class SystemSettingResponse(SystemSettingBase):
    id: str
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class SystemSettingUpdate(BaseModel):
    value: Any
    reason: Optional[str] = None

class FeatureFlagBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    key: str = Field(..., min_length=1, max_length=100)
    enabled: bool = False
    rollout_percentage: float = Field(0, ge=0, le=100)
    rollout_strategy: str = "percentage"
    targeting_rules: List[Dict[str, Any]] = []
    variants: List[Dict[str, Any]] = []

class FeatureFlagCreate(FeatureFlagBase):
    pass

class FeatureFlagUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    rollout_percentage: Optional[float] = None
    rollout_strategy: Optional[str] = None
    targeting_rules: Optional[List[Dict[str, Any]]] = None
    variants: Optional[List[Dict[str, Any]]] = None

class FeatureFlagResponse(FeatureFlagBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class FeatureFlagListResponse(BaseModel):
    feature_flags: List[FeatureFlagResponse]
    total: int

class EnvironmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    type: str
    region: Optional[str] = None
    config: Dict[str, Any] = {}
    variables: Dict[str, Any] = {}

class EnvironmentCreate(EnvironmentBase):
    pass

class EnvironmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    region: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    variables: Optional[Dict[str, Any]] = None

class EnvironmentResponse(EnvironmentBase):
    id: str
    status: str
    health_status: str
    health_last_check: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class EnvironmentListResponse(BaseModel):
    environments: List[EnvironmentResponse]
    total: int

class SystemHealthResponse(BaseModel):
    status: str
    version: str
    uptime: float
    services: List[Dict[str, Any]]
    metrics: Dict[str, Any]
    last_check: datetime

class SystemAlertBase(BaseModel):
    type: str
    severity: str
    message: str
    source: Optional[str] = None
    details: Dict[str, Any] = {}

class SystemAlertResponse(SystemAlertBase):
    id: str
    acknowledged: bool
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved: bool
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class SystemAlertListResponse(BaseModel):
    alerts: List[SystemAlertResponse]
    total: int

class MaintenanceWindowBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    type: str
    scheduled_start: datetime
    scheduled_end: datetime
    affected_services: List[str] = []

class MaintenanceWindowCreate(MaintenanceWindowBase):
    pass

class MaintenanceWindowResponse(MaintenanceWindowBase):
    id: str
    status: str
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    notification_sent: bool
    approved_by: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class SettingsBackupResponse(BaseModel):
    id: str
    created_at: datetime
    settings_count: int
```

---

SQLAlchemy Model

```python
# api/models/settings.py
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from ..database import Base

class SystemSetting(Base):
    __tablename__ = "system_settings"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category = Column(String(100), nullable=False)
    key = Column(String(200), nullable=False)
    value = Column(JSON, nullable=False)
    description = Column(Text)
    data_type = Column(String(50), nullable=False)
    is_required = Column(Boolean, default=False)
    is_readonly = Column(Boolean, default=False)
    default_value = Column(JSON)
    validation_rules = Column(JSON)
    tenant_scoped = Column(Boolean, default=False)
    environment_scoped = Column(Boolean, default=False)
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = Column(UUID(as_uuid=True))

class FeatureFlag(Base):
    __tablename__ = "feature_flags"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    key = Column(String(100), unique=True, nullable=False)
    enabled = Column(Boolean, default=False)
    rollout_percentage = Column(Integer, default=0)
    rollout_strategy = Column(String(50), default="percentage")
    targeting_rules = Column(JSON, default=[])
    variants = Column(JSON, default=[])
    holdout_groups = Column(JSON, default=[])
    status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))
    metadata_ = Column("metadata", JSON, default={})

class Environment(Base):
    __tablename__ = "environments"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="active")
    region = Column(String(100))
    config = Column(JSON, default={})
    variables = Column(JSON, default={})
    health_status = Column(String(50), default="unknown")
    health_last_check = Column(DateTime(timezone=True))
    metadata_ = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))

class SystemAlert(Base):
    __tablename__ = "system_alerts"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(50), nullable=False)
    severity = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    source = Column(String(200))
    details = Column(JSON, default={})
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(UUID(as_uuid=True))
    acknowledged_at = Column(DateTime(timezone=True))
    resolved = Column(Boolean, default=False)
    resolved_by = Column(UUID(as_uuid=True))
    resolved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

class SystemIncident(Base):
    __tablename__ = "system_incidents"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    status = Column(String(50), nullable=False, default="investigating")
    severity = Column(String(50), nullable=False)
    affected_services = Column(JSON, default=[])
    started_at = Column(DateTime(timezone=True), nullable=False)
    resolved_at = Column(DateTime(timezone=True))
    duration = Column(Integer)
    root_cause = Column(Text)
    resolution = Column(Text)
    post_mortem = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))

class MaintenanceWindow(Base):
    __tablename__ = "maintenance_windows"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="scheduled")
    scheduled_start = Column(DateTime(timezone=True), nullable=False)
    scheduled_end = Column(DateTime(timezone=True), nullable=False)
    actual_start = Column(DateTime(timezone=True))
    actual_end = Column(DateTime(timezone=True))
    affected_services = Column(JSON, default=[])
    notification_sent = Column(Boolean, default=False)
    approved_by = Column(UUID(as_uuid=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True))
    metadata_ = Column("metadata", JSON, default={})

class SettingsAuditLog(Base):
    __tablename__ = "settings_audit_log"
    __table_args__ = {"schema": "platform"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    setting_type = Column(String(50), nullable=False)
    setting_id = Column(UUID(as_uuid=True), nullable=False)
    action = Column(String(50), nullable=False)
    old_value = Column(JSON)
    new_value = Column(JSON)
    performed_by = Column(UUID(as_uuid=True), nullable=False)
    reason = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
```

---

Repository

```python
# db/repositories/settings_repository.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
import uuid

from ..models.settings import (
    SystemSetting, FeatureFlag, Environment,
    SystemAlert, SystemIncident, MaintenanceWindow
)

class SettingsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # System Settings
    async def get_setting(self, category: str, key: str) -> Optional[SystemSetting]:
        result = await self.db.execute(
            select(SystemSetting)
            .where(SystemSetting.category == category)
            .where(SystemSetting.key == key)
        )
        return result.scalar_one_or_none()

    async def list_settings(self, category: Optional[str] = None) -> List[SystemSetting]:
        query = select(SystemSetting)
        if category:
            query = query.where(SystemSetting.category == category)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def update_setting(self, category: str, key: str, value: Any, updated_by: Optional[str] = None) -> Optional[SystemSetting]:
        setting = await self.get_setting(category, key)
        if not setting:
            return None
        setting.value = value
        if updated_by:
            setting.updated_by = uuid.UUID(updated_by)
        await self.db.flush()
        return setting

    # Feature Flags
    async def get_feature_flag(self, key: str) -> Optional[FeatureFlag]:
        result = await self.db.execute(
            select(FeatureFlag).where(FeatureFlag.key == key)
        )
        return result.scalar_one_or_none()

    async def list_feature_flags(self) -> List[FeatureFlag]:
        result = await self.db.execute(select(FeatureFlag))
        return result.scalars().all()

    async def create_feature_flag(self, flag_data: dict) -> FeatureFlag:
        flag = FeatureFlag(**flag_data)
        self.db.add(flag)
        await self.db.flush()
        return flag

    async def update_feature_flag(self, key: str, updates: dict) -> Optional[FeatureFlag]:
        flag = await self.get_feature_flag(key)
        if not flag:
            return None
        for key, value in updates.items():
            setattr(flag, key, value)
        await self.db.flush()
        return flag

    # Environments
    async def get_environment(self, env_id: str) -> Optional[Environment]:
        result = await self.db.execute(
            select(Environment).where(Environment.id == uuid.UUID(env_id))
        )
        return result.scalar_one_or_none()

    async def list_environments(self) -> List[Environment]:
        result = await self.db.execute(select(Environment))
        return result.scalars().all()

    async def create_environment(self, env_data: dict) -> Environment:
        env = Environment(**env_data)
        self.db.add(env)
        await self.db.flush()
        return env

    async def update_environment(self, env_id: str, updates: dict) -> Optional[Environment]:
        env = await self.get_environment(env_id)
        if not env:
            return None
        for key, value in updates.items():
            setattr(env, key, value)
        await self.db.flush()
        return env

    # Alerts
    async def list_alerts(self, unresolved_only: bool = False) -> List[SystemAlert]:
        query = select(SystemAlert)
        if unresolved_only:
            query = query.where(SystemAlert.resolved == False)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def acknowledge_alert(self, alert_id: str, user_id: str) -> Optional[SystemAlert]:
        result = await self.db.execute(
            select(SystemAlert).where(SystemAlert.id == uuid.UUID(alert_id))
        )
        alert = result.scalar_one_or_none()
        if not alert:
            return None
        alert.acknowledged = True
        alert.acknowledged_by = uuid.UUID(user_id)
        from datetime import datetime
        alert.acknowledged_at = datetime.utcnow()
        await self.db.flush()
        return alert

    async def resolve_alert(self, alert_id: str, user_id: str) -> Optional[SystemAlert]:
        result = await self.db.execute(
            select(SystemAlert).where(SystemAlert.id == uuid.UUID(alert_id))
        )
        alert = result.scalar_one_or_none()
        if not alert:
            return None
        alert.resolved = True
        alert.resolved_by = uuid.UUID(user_id)
        from datetime import datetime
        alert.resolved_at = datetime.utcnow()
        await self.db.flush()
        return alert
```

---

Service

```python
# services/settings_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Any

from ..repositories.settings_repository import SettingsRepository
from ..schemas.settings import (
    SystemSettingResponse, FeatureFlagCreate, FeatureFlagResponse,
    EnvironmentCreate, EnvironmentResponse, SystemAlertResponse
)

class SettingsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = SettingsRepository(db)

    async def get_setting(self, category: str, key: str) -> Optional[SystemSettingResponse]:
        setting = await self.repository.get_setting(category, key)
        if not setting:
            return None
        return SystemSettingResponse.model_validate(setting)

    async def list_settings(self, category: Optional[str] = None) -> List[SystemSettingResponse]:
        settings = await self.repository.list_settings(category)
        return [SystemSettingResponse.model_validate(s) for s in settings]

    async def update_setting(self, category: str, key: str, value: Any, updated_by: Optional[str] = None) -> Optional[SystemSettingResponse]:
        setting = await self.repository.update_setting(category, key, value, updated_by)
        if not setting:
            return None
        return SystemSettingResponse.model_validate(setting)

    async def get_feature_flag(self, key: str) -> Optional[FeatureFlagResponse]:
        flag = await self.repository.get_feature_flag(key)
        if not flag:
            return None
        return FeatureFlagResponse.model_validate(flag)

    async def list_feature_flags(self) -> List[FeatureFlagResponse]:
        flags = await self.repository.list_feature_flags()
        return [FeatureFlagResponse.model_validate(f) for f in flags]

    async def create_feature_flag(self, flag_data: FeatureFlagCreate) -> FeatureFlagResponse:
        flag = await self.repository.create_feature_flag(flag_data.model_dump())
        return FeatureFlagResponse.model_validate(flag)

    async def update_feature_flag(self, key: str, updates: dict) -> Optional[FeatureFlagResponse]:
        flag = await self.repository.update_feature_flag(key, updates)
        if not flag:
            return None
        return FeatureFlagResponse.model_validate(flag)

    async def toggle_feature_flag(self, key: str, enabled: bool) -> Optional[FeatureFlagResponse]:
        return await self.update_feature_flag(key, {"enabled": enabled})

    async def list_environments(self) -> List[EnvironmentResponse]:
        envs = await self.repository.list_environments()
        return [EnvironmentResponse.model_validate(e) for e in envs]

    async def create_environment(self, env_data: EnvironmentCreate) -> EnvironmentResponse:
        env = await self.repository.create_environment(env_data.model_dump())
        return EnvironmentResponse.model_validate(env)

    async def get_system_health(self) -> dict:
        # TODO: Implement actual health checks
        return {
            "status": "healthy",
            "version": "1.0.0",
            "uptime": 0,
            "services": [],
            "metrics": {},
            "last_check": datetime.utcnow()
        }

    async def list_alerts(self, unresolved_only: bool = False) -> List[SystemAlertResponse]:
        alerts = await self.repository.list_alerts(unresolved_only)
        return [SystemAlertResponse.model_validate(a) for a in alerts]

    async def acknowledge_alert(self, alert_id: str, user_id: str) -> Optional[SystemAlertResponse]:
        alert = await self.repository.acknowledge_alert(alert_id, user_id)
        if not alert:
            return None
        return SystemAlertResponse.model_validate(alert)

    async def resolve_alert(self, alert_id: str, user_id: str) -> Optional[SystemAlertResponse]:
        alert = await self.repository.resolve_alert(alert_id, user_id)
        if not alert:
            return None
        return SystemAlertResponse.model_validate(alert)
```

---

Router

```python
# api/routes/settings_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, Any

from ..database import get_db
from ..services.settings_service import SettingsService
from ..schemas.settings import (
    SystemSettingResponse, SystemSettingUpdate,
    FeatureFlagCreate, FeatureFlagUpdate, FeatureFlagResponse,
    FeatureFlagListResponse, EnvironmentCreate, EnvironmentResponse,
    EnvironmentListResponse, SystemHealthResponse, SystemAlertResponse,
    SystemAlertListResponse
)
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/settings", tags=["settings"])

# System Settings
@router.get("/", response_model=list[SystemSettingResponse])
async def list_settings(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    return await service.list_settings(category)

@router.get("/{category}/{key}", response_model=SystemSettingResponse)
async def get_setting(
    category: str,
    key: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    setting = await service.get_setting(category, key)
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting

@router.put("/{category}/{key}", response_model=SystemSettingResponse)
async def update_setting(
    category: str,
    key: str,
    update: SystemSettingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    setting = await service.update_setting(category, key, update.value, current_user.get("user_id"))
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting

# Feature Flags
@router.get("/feature-flags", response_model=FeatureFlagListResponse)
async def list_feature_flags(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    flags = await service.list_feature_flags()
    return FeatureFlagListResponse(feature_flags=flags, total=len(flags))

@router.get("/feature-flags/{key}", response_model=FeatureFlagResponse)
async def get_feature_flag(
    key: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    flag = await service.get_feature_flag(key)
    if not flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    return flag

@router.post("/feature-flags", response_model=FeatureFlagResponse, status_code=201)
async def create_feature_flag(
    flag_data: FeatureFlagCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    return await service.create_feature_flag(flag_data)

@router.put("/feature-flags/{key}", response_model=FeatureFlagResponse)
async def update_feature_flag(
    key: str,
    flag_data: FeatureFlagUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    flag = await service.update_feature_flag(key, flag_data.model_dump(exclude_unset=True))
    if not flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    return flag

@router.post("/feature-flags/{key}/toggle", response_model=FeatureFlagResponse)
async def toggle_feature_flag(
    key: str,
    enabled: bool = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    flag = await service.toggle_feature_flag(key, enabled)
    if not flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    return flag

# Environments
@router.get("/environments", response_model=EnvironmentListResponse)
async def list_environments(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    envs = await service.list_environments()
    return EnvironmentListResponse(environments=envs, total=len(envs))

@router.post("/environments", response_model=EnvironmentResponse, status_code=201)
async def create_environment(
    env_data: EnvironmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    return await service.create_environment(env_data)

# Health
@router.get("/health", response_model=SystemHealthResponse)
async def get_system_health(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    return await service.get_system_health()

# Alerts
@router.get("/alerts", response_model=SystemAlertListResponse)
async def list_alerts(
    unresolved_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    alerts = await service.list_alerts(unresolved_only)
    return SystemAlertListResponse(alerts=alerts, total=len(alerts))

@router.post("/alerts/{alert_id}/acknowledge", response_model=SystemAlertResponse)
async def acknowledge_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    alert = await service.acknowledge_alert(alert_id, current_user.get("user_id"))
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.post("/alerts/{alert_id}/resolve", response_model=SystemAlertResponse)
async def resolve_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    service = SettingsService(db)
    alert = await service.resolve_alert(alert_id, current_user.get("user_id"))
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
```

---

API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/settings | List all settings |
| GET | /api/v1/settings/{category}/{key} | Get setting |
| PUT | /api/v1/settings/{category}/{key} | Update setting |
| GET | /api/v1/settings/feature-flags | List feature flags |
| GET | /api/v1/settings/feature-flags/{key} | Get feature flag |
| POST | /api/v1/settings/feature-flags | Create feature flag |
| PUT | /api/v1/settings/feature-flags/{key} | Update feature flag |
| POST | /api/v1/settings/feature-flags/{key}/toggle | Toggle feature flag |
| GET | /api/v1/settings/environments | List environments |
| POST | /api/v1/settings/environments | Create environment |
| GET | /api/v1/settings/health | Get system health |
| GET | /api/v1/settings/alerts | List alerts |
| POST | /api/v1/settings/alerts/{id}/acknowledge | Acknowledge alert |
| POST | /api/v1/settings/alerts/{id}/resolve | Resolve alert |

---

Acceptance Criteria

1. System settings CRUD implemented
2. Feature flag CRUD implemented
3. Feature flag toggle works
4. Environment management implemented
5. System health endpoint returns status
6. Alert acknowledgment works
7. Alert resolution works
8. Audit logging for settings changes

---

Dependencies

035_DB_System_Settings (database tables)
036_User_API (user authentication)

---

Next Steps

After this prompt, implement:

045_System_Settings_UI — React frontend for system settings

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
