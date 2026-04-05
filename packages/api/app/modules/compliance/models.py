import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app import Base


class RiskLevel(str, enum.Enum):
    """AI System risk levels based on EU AI Act"""
    MINIMAL = "minimal"
    LIMITED = "limited"
    HIGH = "high"
    UNACCEPTABLE = "unacceptable"


class AISystemStatus(str, enum.Enum):
    """AI System operational status"""
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"
    DECOMMISSIONED = "decommissioned"


class AISystem(Base):
    """AI Systems Registry - Core entity for governance"""
    
    __tablename__ = "ai_systems"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    # Basic info
    name = Column(String(255), nullable=False)
    description = Column(Text)
    vendor = Column(String(255))
    version = Column(String(50))
    
    # Classification
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.LIMITED)
    status = Column(Enum(AISystemStatus), default=AISystemStatus.DEVELOPMENT)
    
    # Technical details
    model_type = Column(String(100))  # LLM, Computer Vision, etc.
    deployment_environment = Column(String(100))  # Cloud, On-premise, Edge
    data_sources = Column(JSON, default=list)  # List of data sources
    
    # Purpose and use
    intended_purpose = Column(Text)
    use_cases = Column(JSON, default=list)
    target_users = Column(String(255))
    
    # Compliance
    compliance_status = Column(String(50), default="pending")  # pending, in_review, compliant, non_compliant
    regulatory_categories = Column(JSON, default=list)  # ["EU_AI_Act", "GDPR", etc.]
    
    # Tenant
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Owner
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "vendor": self.vendor,
            "version": self.version,
            "risk_level": self.risk_level.value if self.risk_level else None,
            "status": self.status.value if self.status else None,
            "model_type": self.model_type,
            "compliance_status": self.compliance_status,
            "tenant_id": str(self.tenant_id),
        }


class ComplianceRecord(Base):
    """Compliance assessment records for AI systems"""
    
    __tablename__ = "compliance_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    framework_id = Column(Integer, ForeignKey("compliance_frameworks.id"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Assessment details
    assessment_type = Column(String(100))  # initial, periodic, ad_hoc
    assessment_status = Column(String(50), default="pending")  # pending, in_progress, completed, failed
    
    # Results
    overall_score = Column(Float, default=0.0)
    compliance_percentage = Column(Float, default=0.0)
    
    # Findings
    findings = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    
    # Evidence
    evidence_links = Column(JSON, default=list)
    
    # Assessor
    assessor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    assessment_date = Column(DateTime)
    next_assessment_date = Column(DateTime)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "framework_id": self.framework_id,
            "assessment_type": self.assessment_type,
            "assessment_status": self.assessment_status,
            "overall_score": self.overall_score,
            "compliance_percentage": self.compliance_percentage,
        }


class RiskAssessment(Base):
    """Risk classification wizard results"""
    
    __tablename__ = "risk_assessments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Risk scores
    overall_risk_score = Column(Float, default=0.0)
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.LIMITED)
    
    # Risk categories
    privacy_risk_score = Column(Float, default=0.0)
    fairness_risk_score = Column(Float, default=0.0)
    security_risk_score = Column(Float, default=0.0)
    transparency_risk_score = Column(Float, default=0.0)
    
    # Assessment data
    assessment_responses = Column(JSON, default=dict)
    risk_mitigations = Column(JSON, default=list)
    
    # Status
    is_validated = Column(Boolean, default=False)
    validated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    validated_at = Column(DateTime, nullable=True)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "overall_risk_score": self.overall_risk_score,
            "risk_level": self.risk_level.value if self.risk_level else None,
            "is_validated": self.is_validated,
        }
