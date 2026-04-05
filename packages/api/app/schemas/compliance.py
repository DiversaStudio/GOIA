"""
Compliance module schemas (Pillar 1)
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
from app.schemas.common import RiskLevel, AISystemStatus, AssessmentStatus, ComplianceStatus


# =====================
# AI SYSTEMS
# =====================

class AISystemBase(BaseModel):
    """Base AI System fields"""
    name: str = Field(..., min_length=1, max_length=255, description="System name")
    description: Optional[str] = Field(None, description="System description")
    vendor: Optional[str] = Field(None, max_length=255, description="Vendor name")
    version: Optional[str] = Field(None, max_length=50, description="System version")
    risk_level: RiskLevel = Field(RiskLevel.LIMITED, description="Risk classification")
    status: AISystemStatus = Field(AISystemStatus.DEVELOPMENT, description="Operational status")
    model_type: Optional[str] = Field(None, max_length=100, description="Model type (LLM, CV, etc.)")
    deployment_environment: Optional[str] = Field(None, max_length=100, description="Deployment environment")
    data_sources: List[str] = Field(default_factory=list, description="Data sources")
    intended_purpose: Optional[str] = Field(None, description="Intended purpose")
    use_cases: List[str] = Field(default_factory=list, description="Use cases")
    target_users: Optional[str] = Field(None, max_length=255, description="Target users")
    regulatory_categories: List[str] = Field(default_factory=list, description="Applicable regulations")


class AISystemCreate(AISystemBase):
    """Schema for creating an AI System"""
    tenant_id: str = Field(..., description="Tenant ID")
    owner_id: Optional[str] = Field(None, description="Owner user ID")


class AISystemUpdate(BaseModel):
    """Schema for updating an AI System"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    vendor: Optional[str] = Field(None, max_length=255)
    version: Optional[str] = Field(None, max_length=50)
    risk_level: Optional[RiskLevel] = None
    status: Optional[AISystemStatus] = None
    model_type: Optional[str] = Field(None, max_length=100)
    deployment_environment: Optional[str] = Field(None, max_length=100)
    data_sources: Optional[List[str]] = None
    intended_purpose: Optional[str] = None
    use_cases: Optional[List[str]] = None
    target_users: Optional[str] = Field(None, max_length=255)
    compliance_status: Optional[str] = None
    regulatory_categories: Optional[List[str]] = None
    owner_id: Optional[str] = None


class AISystemResponse(AISystemBase):
    """AI System response schema"""
    id: str
    compliance_status: str = "pending"
    tenant_id: str
    owner_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AISystemListResponse(BaseModel):
    """Paginated AI Systems list"""
    total: int
    items: List[AISystemResponse]


# =====================
# COMPLIANCE RECORDS
# =====================

class AssessmentType(str, Enum):
    """Types of compliance assessments"""
    INITIAL = "initial"
    PERIODIC = "periodic"
    AD_HOC = "ad_hoc"
    REMEDIATION = "remediation"


class ComplianceRecordBase(BaseModel):
    """Base compliance record fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    framework_id: int = Field(..., description="Compliance framework ID")
    assessment_type: AssessmentType = Field(AssessmentType.INITIAL, description="Assessment type")
    findings: List[Dict[str, Any]] = Field(default_factory=list, description="Assessment findings")
    recommendations: List[str] = Field(default_factory=list, description="Recommendations")
    evidence_links: List[str] = Field(default_factory=list, description="Evidence links")


class ComplianceRecordCreate(ComplianceRecordBase):
    """Schema for creating a compliance record"""
    tenant_id: str = Field(..., description="Tenant ID")
    assessor_id: Optional[str] = Field(None, description="Assessor user ID")


class ComplianceRecordUpdate(BaseModel):
    """Schema for updating a compliance record"""
    assessment_status: Optional[str] = None
    overall_score: Optional[float] = Field(None, ge=0, le=100)
    compliance_percentage: Optional[float] = Field(None, ge=0, le=100)
    findings: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[List[str]] = None
    evidence_links: Optional[List[str]] = None
    next_assessment_date: Optional[datetime] = None


class ComplianceRecordResponse(ComplianceRecordBase):
    """Compliance record response"""
    id: str
    tenant_id: str
    assessment_status: str = "pending"
    overall_score: float = 0.0
    compliance_percentage: float = 0.0
    assessor_id: Optional[str] = None
    assessment_date: Optional[datetime] = None
    next_assessment_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ComplianceRecordListResponse(BaseModel):
    """Paginated compliance records list"""
    total: int
    items: List[ComplianceRecordResponse]


# =====================
# RISK ASSESSMENTS
# =====================

class RiskAssessmentBase(BaseModel):
    """Base risk assessment fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    assessment_responses: Dict[str, Any] = Field(default_factory=dict, description="Assessment responses")
    risk_mitigations: List[Dict[str, Any]] = Field(default_factory=list, description="Mitigation measures")


class RiskAssessmentCreate(RiskAssessmentBase):
    """Schema for creating a risk assessment"""
    tenant_id: str = Field(..., description="Tenant ID")


class RiskAssessmentUpdate(BaseModel):
    """Schema for updating a risk assessment"""
    overall_risk_score: Optional[float] = Field(None, ge=0, le=100)
    risk_level: Optional[RiskLevel] = None
    privacy_risk_score: Optional[float] = Field(None, ge=0, le=100)
    fairness_risk_score: Optional[float] = Field(None, ge=0, le=100)
    security_risk_score: Optional[float] = Field(None, ge=0, le=100)
    transparency_risk_score: Optional[float] = Field(None, ge=0, le=100)
    assessment_responses: Optional[Dict[str, Any]] = None
    risk_mitigations: Optional[List[Dict[str, Any]]] = None


class RiskAssessmentResponse(RiskAssessmentBase):
    """Risk assessment response"""
    id: str
    tenant_id: str
    overall_risk_score: float = 0.0
    risk_level: RiskLevel
    privacy_risk_score: float = 0.0
    fairness_risk_score: float = 0.0
    security_risk_score: float = 0.0
    transparency_risk_score: float = 0.0
    is_validated: bool = False
    validated_by: Optional[str] = None
    validated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RiskAssessmentListResponse(BaseModel):
    """Paginated risk assessments list"""
    total: int
    items: List[RiskAssessmentResponse]


class RiskAssessmentValidate(BaseModel):
    """Schema for validating a risk assessment"""
    validated_by: str = Field(..., description="Validator user ID")


# =====================
# COMPLIANCE FRAMEWORKS
# =====================

class ComplianceFrameworkBase(BaseModel):
    """Base compliance framework fields"""
    framework_name: str = Field(..., min_length=1, max_length=255)
    framework_code: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    region: Optional[str] = Field(None, max_length=100, description="Jurisdiction/Region")
    version: Optional[str] = Field(None, max_length=20)
    is_active: bool = True


class ComplianceFrameworkResponse(ComplianceFrameworkBase):
    """Compliance framework response"""
    id: int
    effective_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ComplianceFrameworkListResponse(BaseModel):
    """Paginated compliance frameworks list"""
    total: int
    items: List[ComplianceFrameworkResponse]
