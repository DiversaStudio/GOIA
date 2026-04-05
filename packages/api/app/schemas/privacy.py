"""
Privacy & Data Governance module schemas (Pillar 2)
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# =====================
# DATA FLOW DECLARATIONS
# =====================

class DataCategory(str, Enum):
    """Data categories"""
    PERSONAL = "personal"
    SENSITIVE = "sensitive"
    ANONYMIZED = "anonymized"
    SYNTHETIC = "synthetic"
    AGGREGATE = "aggregate"


class LegalBasis(str, Enum):
    """GDPR legal bases"""
    CONSENT = "consent"
    CONTRACT = "contract"
    LEGAL_OBLIGATION = "legal_obligation"
    VITAL_INTERESTS = "vital_interests"
    PUBLIC_TASK = "public_task"
    LEGITIMATE_INTERESTS = "legitimate_interests"


class DataFlowBase(BaseModel):
    """Base data flow declaration fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    data_type: str = Field(..., description="Type of data")
    data_category: DataCategory = Field(DataCategory.PERSONAL, description="Data category")
    source: str = Field(..., description="Data source")
    destination: str = Field(..., description="Data destination")
    purpose: str = Field(..., description="Purpose of data flow")
    legal_basis: LegalBasis = Field(..., description="Legal basis for processing")
    retention_period: Optional[int] = Field(None, description="Retention period in days")
    cross_border_transfer: bool = Field(False, description="Is cross-border transfer")
    transfer_destination: Optional[str] = Field(None, description="Destination country for cross-border")
    safeguards: List[str] = Field(default_factory=list, description="Safeguards in place")


class DataFlowCreate(DataFlowBase):
    """Schema for creating a data flow"""
    tenant_id: str = Field(..., description="Tenant ID")


class DataFlowUpdate(BaseModel):
    """Schema for updating a data flow"""
    data_type: Optional[str] = None
    data_category: Optional[DataCategory] = None
    source: Optional[str] = None
    destination: Optional[str] = None
    purpose: Optional[str] = None
    legal_basis: Optional[LegalBasis] = None
    retention_period: Optional[int] = None
    cross_border_transfer: Optional[bool] = None
    transfer_destination: Optional[str] = None
    safeguards: Optional[List[str]] = None


class DataFlowResponse(DataFlowBase):
    """Data flow response"""
    id: str
    tenant_id: str
    is_approved: bool = False
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DataFlowListResponse(BaseModel):
    """Paginated data flows list"""
    total: int
    items: List[DataFlowResponse]


class DataFlowApprove(BaseModel):
    """Schema for approving a data flow"""
    approver_id: str = Field(..., description="Approver user ID")


# =====================
# DPIA (DATA PROTECTION IMPACT ASSESSMENT)
# =====================

class DPIAStatus(str, Enum):
    """DPIA status"""
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class DPIARiskLevel(str, Enum):
    """DPIA risk level"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class DPIABase(BaseModel):
    """Base DPIA fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    title: str = Field(..., min_length=1, max_length=255, description="DPIA title")
    description: Optional[str] = Field(None, description="DPIA description")
    data_flows_involved: List[str] = Field(default_factory=list, description="Related data flow IDs")
    processing_description: Optional[str] = Field(None, description="Description of processing")
    necessity_assessment: Optional[str] = Field(None, description="Necessity and proportionality")
    risks_identified: List[Dict[str, Any]] = Field(default_factory=list, description="Identified risks")
    mitigation_measures: List[str] = Field(default_factory=list, description="Mitigation measures")
    residual_risk_level: DPIARiskLevel = Field(DPIARiskLevel.MEDIUM, description="Residual risk level")


class DPIACreate(DPIABase):
    """Schema for creating a DPIA"""
    tenant_id: str = Field(..., description="Tenant ID")


class DPIAUpdate(BaseModel):
    """Schema for updating a DPIA"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[DPIAStatus] = None
    data_flows_involved: Optional[List[str]] = None
    processing_description: Optional[str] = None
    necessity_assessment: Optional[str] = None
    risks_identified: Optional[List[Dict[str, Any]]] = None
    mitigation_measures: Optional[List[str]] = None
    residual_risk_level: Optional[DPIARiskLevel] = None


class DPIAResponse(DPIABase):
    """DPIA response"""
    id: str
    tenant_id: str
    status: DPIAStatus = DPIAStatus.DRAFT
    dpo_opinion: Optional[str] = None
    dpo_reviewed_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    review_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DPIAListResponse(BaseModel):
    """Paginated DPIAs list"""
    total: int
    items: List[DPIAResponse]


# =====================
# DATA SUBJECT REQUESTS
# =====================

class DataSubjectRequestType(str, Enum):
    """Types of data subject requests"""
    ACCESS = "access"
    RECTIFICATION = "rectification"
    ERASURE = "erasure"
    RESTRICTION = "restriction"
    PORTABILITY = "portability"
    OBJECTION = "objection"


class RequestStatus(str, Enum):
    """Request status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


class DataSubjectRequestBase(BaseModel):
    """Base data subject request fields"""
    request_type: DataSubjectRequestType = Field(..., description="Type of request")
    subject_name: Optional[str] = Field(None, max_length=255, description="Subject name")
    subject_email: str = Field(..., description="Subject email")
    subject_id: Optional[str] = Field(None, description="Subject identifier")
    description: Optional[str] = Field(None, description="Request description")
    ai_systems_involved: List[str] = Field(default_factory=list, description="Related AI systems")


class DataSubjectRequestCreate(DataSubjectRequestBase):
    """Schema for creating a data subject request"""
    tenant_id: str = Field(..., description="Tenant ID")


class DataSubjectRequestUpdate(BaseModel):
    """Schema for updating a data subject request"""
    status: Optional[RequestStatus] = None
    assigned_to: Optional[str] = None
    description: Optional[str] = None


class DataSubjectRequestResponse(DataSubjectRequestBase):
    """Data subject request response"""
    id: str
    tenant_id: str
    status: RequestStatus = RequestStatus.PENDING
    assigned_to: Optional[str] = None
    response_summary: Optional[str] = None
    response_data: Optional[Dict[str, Any]] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DataSubjectRequestListResponse(BaseModel):
    """Paginated data subject requests list"""
    total: int
    items: List[DataSubjectRequestResponse]


class DataSubjectRequestComplete(BaseModel):
    """Schema for completing a data subject request"""
    summary: str = Field(..., description="Response summary")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data")
