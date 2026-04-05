import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app import Base


class AlertSeverity(str, enum.Enum):
    """Bias alert severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AssessmentStatus(str, enum.Enum):
    """Assessment status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class ModelCard(Base):
    """Model Card Generator - Documentation for AI models"""
    
    __tablename__ = "model_cards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Model details
    model_name = Column(String(255), nullable=False)
    model_version = Column(String(50))
    model_type = Column(String(100))
    model_architecture = Column(String(255))
    
    # Training
    training_data_description = Column(Text)
    training_data_sources = Column(JSON, default=list)
    training_period = Column(String(100))
    training_compute = Column(String(100))
    
    # Intended use
    primary_use_cases = Column(JSON, default=list)
    primary_users = Column(String(255))
    out_of_scope_uses = Column(JSON, default=list)
    
    # Performance
    performance_metrics = Column(JSON, default=dict)
    evaluation_datasets = Column(JSON, default=list)
    limitations = Column(Text)
    
    # Fairness
    fairness_metrics = Column(JSON, default=dict)
    bias_tests_performed = Column(JSON, default=list)
    protected_attributes = Column(JSON, default=list)
    
    # Ethical considerations
    ethical_considerations = Column(JSON, default=list)
    risks_and_mitigations = Column(JSON, default=list)
    
    # Transparency
    model_explanation = Column(Text)
    decision_factors = Column(JSON, default=list)
    
    # Status
    is_published = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    
    # Authors
    authors = Column(JSON, default=list)
    contact_email = Column(String(255))
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "model_name": self.model_name,
            "model_version": self.model_version,
            "is_published": self.is_published,
        }


class FairnessAssessment(Base):
    """Fairness Assessment for AI systems"""
    
    __tablename__ = "fairness_assessments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Assessment details
    assessment_name = Column(String(255), nullable=False)
    status = Column(Enum(AssessmentStatus), default=AssessmentStatus.PENDING)
    
    # Protected attributes tested
    protected_attributes = Column(JSON, default=list)
    
    # Fairness definitions used
    fairness_definitions = Column(JSON, default=list)
    
    # Metrics
    fairness_metrics = Column(JSON, default=dict)
    disparity_metrics = Column(JSON, default=dict)
    
    # Results
    overall_fairness_score = Column(Float, default=0.0)
    is_fair = Column(Boolean, default=True)
    
    # Detailed findings
    findings = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    
    # Mitigation
    mitigation_strategies = Column(JSON, default=list)
    re_assessment_required = Column(Boolean, default=False)
    
    # Assessor
    assessor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    assessment_date = Column(DateTime)
    next_assessment_date = Column(DateTime)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "assessment_name": self.assessment_name,
            "status": self.status.value if self.status else None,
            "overall_fairness_score": self.overall_fairness_score,
            "is_fair": self.is_fair,
        }


class BiasAlert(Base):
    """Bias Alert Configuration and Events"""
    
    __tablename__ = "bias_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Alert details
    alert_name = Column(String(255), nullable=False)
    alert_type = Column(String(100))
    severity = Column(Enum(AlertSeverity), default=AlertSeverity.MEDIUM)
    
    # Trigger conditions
    metric_name = Column(String(100))
    threshold_value = Column(Float)
    comparison_operator = Column(String(10))
    
    # Status
    is_active = Column(Boolean, default=True)
    is_triggered = Column(Boolean, default=False)
    last_triggered_at = Column(DateTime, nullable=True)
    
    # Current values
    current_value = Column(Float)
    previous_value = Column(Float)
    
    # Affected group
    affected_attribute = Column(String(100))
    affected_group = Column(String(255))
    
    # Notification
    notification_channels = Column(JSON, default=list)
    notified_users = Column(JSON, default=list)
    
    # Remediation
    remediation_steps = Column(JSON, default=list)
    auto_remediation_enabled = Column(Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "alert_name": self.alert_name,
            "alert_type": self.alert_type,
            "severity": self.severity.value if self.severity else None,
            "is_active": self.is_active,
            "is_triggered": self.is_triggered,
        }
