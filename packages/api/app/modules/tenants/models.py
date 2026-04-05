import enum
from sqlalchemy import Column, Integer, String, Boolean, Text, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app import Base


class TenantType(str, enum.Enum):
    """Tenant organization types"""
    PRIVATE = "private"
    PUBLIC = "public"
    ENTERPRISE = "enterprise"
    GOVERNMENT = "government"


class Tenant(Base):
    """Represent an organization using GOIA platform"""
    
    __tablename__ = "tenants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    # Organization info
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True)
    region = Column(String(50))  # EU, US, APAC, LATAM, AFRICA, etc.
    
    # Organization type
    org_type = Column(Enum(TenantType), nullable=False, default=TenantType.PRIVATE)
    
    # Subscription
    subscription_tier = Column(String(50), default="pro")
    subscription_end_date = Column(DateTime, nullable=True)
    
    # Settings
    timezone = Column(String(50), default="UTC")
    compliance_frameworks = Column(Text, default='["EU_AI_Act", "GDPR", "NIST_AI_RMF"]')
    
    # Status
    status = Column(String(50), default="active")
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "domain": self.domain,
            "region": self.region,
            "org_type": self.org_type.value if self.org_type else None,
            "subscription_tier": self.subscription_tier,
            "status": self.status,
        }
