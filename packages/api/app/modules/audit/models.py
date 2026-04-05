import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app import Base


class AuditAction(str, enum.Enum):
    """Types of auditable actions"""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LOGIN = "login"
    LOGOUT = "logout"
    EXPORT = "export"
    ASSESS = "assess"
    APPROVE = "approve"
    REJECT = "reject"


class HealthStatus(str, enum.Enum):
    """System health status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


class AuditLog(Base):
    """Activity Audit Logs for all system actions"""
    
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Actor
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    actor_email = Column(String(255))
    actor_ip = Column(String(50))
    actor_user_agent = Column(String(500))
    
    # Tenant
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Action
    action = Column(Enum(AuditAction), nullable=False)
    action_details = Column(Text)
    
    # Resource
    resource_type = Column(String(100))  # ai_system, compliance_record, etc.
    resource_id = Column(UUID(as_uuid=True), nullable=True)
    resource_name = Column(String(255))
    
    # Changes
    before_state = Column(JSON, default=dict)
    after_state = Column(JSON, default=dict)
    changed_fields = Column(JSON, default=list)
    
    # Request
    request_method = Column(String(10))
    request_path = Column(String(500))
    request_params = Column(JSON, default=dict)
    
    # Response
    response_status = Column(Integer)
    response_time_ms = Column(Integer)
    
    # Additional context
    tags = Column(JSON, default=list)
    extra_data = Column(JSON, default=dict)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "actor_email": self.actor_email,
            "action": self.action.value if self.action else None,
            "resource_type": self.resource_type,
            "resource_name": self.resource_name,
            "response_status": self.response_status,
        }


class EvidenceVault(Base):
    """Evidence Vault for compliance documentation"""
    
    __tablename__ = "evidence_vault"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=True)
    compliance_record_id = Column(UUID(as_uuid=True), ForeignKey("compliance_records.id"), nullable=True)
    
    # Evidence details
    evidence_name = Column(String(255), nullable=False)
    evidence_type = Column(String(100))  # document, screenshot, log, report
    description = Column(Text)
    
    # File info
    file_path = Column(String(500))
    file_size = Column(Integer)
    file_hash = Column(String(128))  # SHA-256
    mime_type = Column(String(100))
    
    # Content
    content_text = Column(Text)  # Extracted text for search
    
    # Classification
    classification = Column(String(50))  # public, internal, confidential
    retention_until = Column(DateTime, nullable=True)
    
    # Tags and categories
    tags = Column(JSON, default=list)
    categories = Column(JSON, default=list)
    
    # Verification
    is_verified = Column(Boolean, default=False)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Access
    access_count = Column(Integer, default=0)
    last_accessed_at = Column(DateTime, nullable=True)
    
    # Upload
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "evidence_name": self.evidence_name,
            "evidence_type": self.evidence_type,
            "file_size": self.file_size,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class SystemHealth(Base):
    """System Health Summary for observability"""
    
    __tablename__ = "system_health"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Health status
    overall_status = Column(Enum(HealthStatus), default=HealthStatus.UNKNOWN)
    
    # Metrics
    uptime_percentage = Column(Float, default=0.0)
    response_time_avg = Column(Float)  # milliseconds
    response_time_p95 = Column(Float)
    error_rate = Column(Float, default=0.0)
    
    # Request metrics
    requests_total = Column(Integer, default=0)
    requests_successful = Column(Integer, default=0)
    requests_failed = Column(Integer, default=0)
    
    # Performance
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    storage_usage = Column(Float)
    
    # AI-specific metrics
    inference_latency = Column(Float)
    model_accuracy = Column(Float)
    data_freshness_hours = Column(Float)
    
    # Compliance health
    compliance_score = Column(Float, default=0.0)
    open_findings = Column(Integer, default=0)
    overdue_assessments = Column(Integer, default=0)
    
    # Last check
    last_health_check = Column(DateTime)
    next_health_check = Column(DateTime)
    
    # Alerts
    active_alerts = Column(Integer, default=0)
    critical_alerts = Column(Integer, default=0)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "overall_status": self.overall_status.value if self.overall_status else None,
            "uptime_percentage": self.uptime_percentage,
            "error_rate": self.error_rate,
            "compliance_score": self.compliance_score,
            "last_health_check": self.last_health_check.isoformat() if self.last_health_check else None,
        }
