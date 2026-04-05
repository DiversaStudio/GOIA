import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app import Base


class DPIAStatus(str, enum.Enum):
    """Data Protection Impact Assessment status"""
    NOT_REQUIRED = "not_required"
    REQUIRED = "required"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REVIEW_REQUIRED = "review_required"


class DataSubjectRequestType(str, enum.Enum):
    """Types of data subject requests"""
    ACCESS = "access"
    RECTIFICATION = "rectification"
    ERASURE = "erasure"
    PORTABILITY = "portability"
    RESTRICTION = "restriction"
    OBJECTION = "objection"


class RequestStatus(str, enum.Enum):
    """Request processing status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


class DataFlowDeclaration(Base):
    """Data flow declaration for AI systems"""
    
    __tablename__ = "data_flow_declarations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # Data flow details
    flow_name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Data categories
    data_categories = Column(JSON, default=list)
    data_types = Column(JSON, default=list)
    
    # Flow mapping
    data_sources = Column(JSON, default=list)
    data_destinations = Column(JSON, default=list)
    third_party_transfers = Column(JSON, default=list)
    
    # Legal basis
    legal_basis = Column(String(100))
    consent_mechanism = Column(String(100))
    
    # Retention
    retention_period = Column(Integer)
    retention_policy = Column(Text)
    
    # Cross-border
    cross_border_transfer = Column(Boolean, default=False)
    transfer_destinations = Column(JSON, default=list)
    safeguards = Column(JSON, default=list)
    
    # Status
    is_approved = Column(Boolean, default=False)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "flow_name": self.flow_name,
            "data_categories": self.data_categories,
            "cross_border_transfer": self.cross_border_transfer,
            "is_approved": self.is_approved,
        }


class DPIA(Base):
    """Data Protection Impact Assessment"""
    
    __tablename__ = "dpias"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    
    # DPIA details
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum(DPIAStatus), default=DPIAStatus.REQUIRED)
    
    # Assessment
    necessity_assessment = Column(Text)
    proportionality_assessment = Column(Text)
    
    # Risks
    identified_risks = Column(JSON, default=list)
    risk_mitigation_measures = Column(JSON, default=list)
    residual_risks = Column(JSON, default=list)
    
    # Results
    overall_risk_level = Column(String(50))
    is_compliant = Column(Boolean, default=False)
    
    # DPO involvement
    dpo_consulted = Column(Boolean, default=False)
    dpo_opinion = Column(Text)
    dpo_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Authority notification
    authority_notified = Column(Boolean, default=False)
    authority_response = Column(Text)
    
    # Sign-off
    completed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "ai_system_id": str(self.ai_system_id),
            "title": self.title,
            "status": self.status.value if self.status else None,
            "is_compliant": self.is_compliant,
            "dpo_consulted": self.dpo_consulted,
        }


class DataSubjectRequest(Base):
    """Data subject rights requests (GDPR Art. 15-22)"""
    
    __tablename__ = "data_subject_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Related entities
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    ai_system_id = Column(UUID(as_uuid=True), ForeignKey("ai_systems.id"), nullable=True)
    
    # Request details
    request_type = Column(Enum(DataSubjectRequestType), nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    
    # Requester info
    requester_email = Column(String(255))
    requester_name = Column(String(255))
    requester_id_document = Column(String(255))
    
    # Request content
    request_details = Column(Text)
    data_involved = Column(JSON, default=list)
    
    # Processing
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    due_date = Column(DateTime)
    completed_at = Column(DateTime, nullable=True)
    
    # Response
    response_summary = Column(Text)
    response_data = Column(JSON, default=dict)
    rejection_reason = Column(Text)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "request_type": self.request_type.value if self.request_type else None,
            "status": self.status.value if self.status else None,
            "requester_email": self.requester_email,
            "due_date": self.due_date.isoformat() if self.due_date else None,
        }
