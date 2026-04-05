from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app import Base


class UserAccount(Base):
    """User accounts for GOIA platform"""
    
    __tablename__ = "user_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255))
    avatar_url = Column(String(512))
    
    # Status flags
    email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)
    
    # Email verification
    email_verification_token = Column(String(255), nullable=True)
    email_verification_expiry = Column(DateTime, nullable=True)
    
    # Reset token
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expiry = Column(DateTime, nullable=True)
    
    # Tenant association
    tenant_id = Column(String(36), nullable=True, index=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "email_verified": self.email_verified,
            "is_active": self.is_active,
            "tenant_id": self.tenant_id,
        }
