import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app import Base


class UserRole(str, enum.Enum):
    """User roles in GOIA system"""
    ADMIN = "admin"
    USER = "user"
    AUDITOR = "auditor"
    ANALYST = "analyst"


class User(Base):
    """User model for GOIA platform"""
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    # Basic info
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, nullable=True)
    full_name = Column(String(255))
    avatar_url = Column(String(512))
    
    # Authentication
    hashed_password = Column(String(255), nullable=True)
    email_verified = Column(Boolean, default=False)
    
    # Tenancy
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True)
    
    # Role and permissions
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "username": self.username,
            "full_name": self.full_name,
            "role": self.role.value if self.role else None,
            "tenant_id": str(self.tenant_id) if self.tenant_id else None,
            "is_active": self.is_active,
        }
