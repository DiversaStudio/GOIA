from sqlalchemy import MetaData, String, DateTime, Integer, text
from sqlalchemy.orm import Session
from datetime import datetime

from app import Base, settings

metadata = MetaData(Base.metadata)


def init_db(db: Session):
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=db)
        print("Database tables initialized")
    except Exception as e:
        print(f"Error creating tables: {e}")


def create_default_user(db: Session, tenant_id: str) -> dict:
    """Create a default admin user for tenant"""
    from app.modules.users.models import User, UserRole
    
    default_email = f"admin@{tenant_id[:8]}.goia.local"
    
    default_user = User(
        email=default_email,
        full_name="GOIA Admin",
        username="admin",
        hashed_password=None,  # Will be set after creation
        tenant_id=tenant_id,
        role=UserRole.ADMIN,
        email_verified=True,
    )
    
    db.add(default_user)
    db.commit()
    db.refresh(default_user)
    
    print(f"Created default user: {default_user.email}")
    return default_user.to_dict()
