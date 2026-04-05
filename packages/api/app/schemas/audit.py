"""
Observability & Audit module schemas (Pillar 4)
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# =====================
# AUDIT LOGS
# =====================

class AuditAction(str, Enum):
    """Audit log actions"""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    EXPORT = "export"
    IMPORT = "import"
    APPROVE = "approve"
    REJECT = "reject"
    VALIDATE = "validate"


class AuditLogBase(BaseModel):
    """Base audit log fields"""
    action: AuditAction = Field(..., description="Action performed")
    resource_type: str = Field(..., min_length=1, max_length=100, description="Type of resource")
    resource_id: str = Field(..., description="Resource ID")
    actor_id: Optional[str] = Field(None, description="User who performed the action")
    actor_email: Optional[str] = Field(None, description="User email")
    details: Dict[str, Any] = Field(default_factory=dict, description="Additional details")
    ip_address: Optional[str] = Field(None, description="IP address")
    user_agent: Optional[str] = Field(None, description="User agent")


class AuditLogCreate(AuditLogBase):
    """Schema for creating an audit log"""
    tenant_id: str = Field(..., description="Tenant ID")


class AuditLogResponse(AuditLogBase):
    """Audit log response"""
    id: str
    tenant_id: str
    actor_ip: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AuditLogListResponse(BaseModel):
    """Paginated audit logs list"""
    total: int
    items: List[AuditLogResponse]


# =====================
# EVIDENCE VAULT
# =====================

class EvidenceType(str, Enum):
    """Evidence types"""
    DOCUMENT = "document"
    SCREENSHOT = "screenshot"
    LOG_FILE = "log_file"
    REPORT = "report"
    CERTIFICATE = "certificate"
    ASSESSMENT = "assessment"
    POLICY = "policy"
    TRAINING_RECORD = "training_record"
    OTHER = "other"


class EvidenceBase(BaseModel):
    """Base evidence fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    evidence_type: EvidenceType = Field(..., description="Type of evidence")
    title: str = Field(..., min_length=1, max_length=255, description="Evidence title")
    description: Optional[str] = Field(None, description="Evidence description")
    file_url: Optional[str] = Field(None, description="File URL")
    file_name: Optional[str] = Field(None, max_length=255, description="Original file name")
    file_size: Optional[int] = Field(None, description="File size in bytes")
    file_hash: Optional[str] = Field(None, description="File hash for integrity")
    compliance_record_id: Optional[str] = Field(None, description="Related compliance record")
    tags: List[str] = Field(default_factory=list, description="Tags for categorization")
    retention_until: Optional[datetime] = Field(None, description="Retention expiry date")


class EvidenceCreate(EvidenceBase):
    """Schema for creating evidence"""
    tenant_id: str = Field(..., description="Tenant ID")
    uploaded_by: Optional[str] = Field(None, description="Uploader user ID")


class EvidenceUpdate(BaseModel):
    """Schema for updating evidence"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    evidence_type: Optional[EvidenceType] = None
    tags: Optional[List[str]] = None
    retention_until: Optional[datetime] = None


class EvidenceResponse(EvidenceBase):
    """Evidence response"""
    id: str
    tenant_id: str
    uploaded_by: Optional[str] = None
    is_verified: bool = False
    verified_by: Optional[str] = None
    verified_at: Optional[datetime] = None
    access_count: int = 0
    last_accessed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EvidenceListResponse(BaseModel):
    """Paginated evidence list"""
    total: int
    items: List[EvidenceResponse]


class EvidenceVerify(BaseModel):
    """Schema for verifying evidence"""
    verifier_id: str = Field(..., description="Verifier user ID")


# =====================
# SYSTEM HEALTH
# =====================

class HealthStatus(str, Enum):
    """System health status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


class SystemHealthBase(BaseModel):
    """Base system health fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    overall_status: HealthStatus = Field(HealthStatus.HEALTHY, description="Overall health status")
    uptime_percentage: float = Field(100.0, ge=0, le=100, description="Uptime percentage")
    response_time_ms: Optional[float] = Field(None, ge=0, description="Average response time in ms")
    error_rate: float = Field(0.0, ge=0, le=100, description="Error rate percentage")
    last_incident: Optional[datetime] = Field(None, description="Last incident timestamp")
    incidents_count_30d: int = Field(0, ge=0, description="Incidents in last 30 days")
    checks: Dict[str, Any] = Field(default_factory=dict, description="Health check results")
    metrics: Dict[str, float] = Field(default_factory=dict, description="Performance metrics")


class SystemHealthCreate(SystemHealthBase):
    """Schema for creating a health record"""
    tenant_id: str = Field(..., description="Tenant ID")


class SystemHealthResponse(SystemHealthBase):
    """System health response"""
    id: str
    tenant_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SystemHealthListResponse(BaseModel):
    """Paginated system health records list"""
    total: int
    items: List[SystemHealthResponse]


# =====================
# DASHBOARD SUMMARY
# =====================

class DashboardSummary(BaseModel):
    """Dashboard summary response"""
    total_systems: int = Field(0, description="Total AI systems")
    compliant_systems: int = Field(0, description="Compliant systems")
    non_compliant_systems: int = Field(0, description="Non-compliant systems")
    pending_assessments: int = Field(0, description="Pending assessments")
    triggered_alerts: int = Field(0, description="Triggered bias alerts")
    compliance_score: float = Field(0.0, ge=0, le=100, description="Overall compliance score")
    systems_by_status: Dict[str, int] = Field(default_factory=dict, description="Systems by status")
    systems_by_risk: Dict[str, int] = Field(default_factory=dict, description="Systems by risk level")
    recent_activity: List[Dict[str, Any]] = Field(default_factory=list, description="Recent activity")
    pillar_stats: Dict[str, Any] = Field(default_factory=dict, description="Stats per pillar")
    last_updated: datetime = Field(default_factory=datetime.utcnow)


class ActivityItem(BaseModel):
    """Activity item for dashboard"""
    id: str
    type: str = Field(..., description="Activity type (compliance, privacy, fairness, audit)")
    message: str
    time: str
    severity: Optional[str] = None
    resource_id: Optional[str] = None
