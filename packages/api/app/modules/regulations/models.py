import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from app import Base


class ComplianceFramework(Base):
    """Regulatory frameworks supported by GOIA"""
    
    __tablename__ = "compliance_frameworks"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    framework_name = Column(String(255), nullable=False)
    framework_code = Column(String(50), unique=True)  # EU_AI_Act, GDPR, NIST_AI_RMF, GLOBAL_SOUTH
    description = Column(Text)
    
    # Framework metadata
    region = Column(String(50))  # EU, US, APAC, AFRICA, LATAM, GLOBAL
    version = Column(String(50))
    effective_date = Column(DateTime, nullable=True)
    
    # Rule set - JSON format
    rules_definition = Column(Text)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "framework_name": self.framework_name,
            "framework_code": self.framework_code,
            "description": self.description,
            "region": self.region,
            "version": self.version,
            "is_active": self.is_active,
        }
