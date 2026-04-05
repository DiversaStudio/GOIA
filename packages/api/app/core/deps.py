"""
Authentication and authorization dependencies
"""
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
import jwt
from jwt import PyJWTError
from datetime import datetime
import uuid

from dal import get_db
from app.config import settings
from app.modules.users.models import User
from app.modules.tenants.models import Tenant

# Use JWT_SECRET_KEY as fallback for SECRET_KEY
SECRET_KEY = getattr(settings, 'SECRET_KEY', settings.JWT_SECRET_KEY)


security = HTTPBearer(auto_error=False)


class CurrentUser:
    """Current authenticated user context"""
    def __init__(
        self,
        user_id: str,
        email: str,
        tenant_id: str,
        role: str = "user",
        is_superuser: bool = False,
        permissions: list = None
    ):
        self.user_id = user_id
        self.email = email
        self.tenant_id = tenant_id
        self.role = role
        self.is_superuser = is_superuser
        self.permissions = permissions or []


def verify_token(token: str) -> dict:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> CurrentUser:
    """
    Extract and validate current user from JWT token.
    Returns CurrentUser context with tenant isolation.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = verify_token(token)
    
    # Extract user info from token
    user_id = payload.get("sub")
    tenant_id = payload.get("tenant_id")
    email = payload.get("email")
    role = payload.get("role", "user")
    
    if not user_id or not tenant_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    
    # Verify user exists and is active
    user = db.query(User).filter(
        User.id == uuid.UUID(user_id),
        User.tenant_id == uuid.UUID(tenant_id),
        User.is_active == True
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    
    # Verify tenant is active
    tenant = db.query(Tenant).filter(
        Tenant.id == uuid.UUID(tenant_id),
        Tenant.is_active == True
    ).first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tenant not found or inactive",
        )
    
    return CurrentUser(
        user_id=user_id,
        email=email or user.email,
        tenant_id=tenant_id,
        role=role,
        is_superuser=user.is_superuser,
        permissions=payload.get("permissions", [])
    )


async def get_current_user_optional(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[CurrentUser]:
    """
    Optional authentication - returns None if not authenticated.
    Useful for public endpoints that work differently for authenticated users.
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(request, credentials, db)
    except HTTPException:
        return None


def require_permission(permission: str):
    """
    Dependency that requires a specific permission.
    Usage: @router.get("/", dependencies=[Depends(require_permission("read:systems"))])
    """
    async def check_permission(current_user: CurrentUser = Depends(get_current_user)):
        if current_user.is_superuser:
            return current_user
        
        if permission not in current_user.permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission}"
            )
        return current_user
    
    return check_permission


def require_role(role: str):
    """
    Dependency that requires a specific role.
    Usage: @router.post("/", dependencies=[Depends(require_role("admin"))])
    """
    async def check_role(current_user: CurrentUser = Depends(get_current_user)):
        if current_user.is_superuser:
            return current_user
        
        if current_user.role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role required: {role}"
            )
        return current_user
    
    return check_role


class TenantIsolation:
    """
    Mixin for queries that automatically filters by tenant_id.
    Use in route handlers to ensure tenant isolation.
    """
    
    @staticmethod
    def filter_by_tenant(query, model, current_user: CurrentUser):
        """Add tenant filter to query"""
        if hasattr(model, 'tenant_id'):
            return query.filter(model.tenant_id == uuid.UUID(current_user.tenant_id))
        return query
    
    @staticmethod
    def add_tenant_id(data: dict, current_user: CurrentUser) -> dict:
        """Add tenant_id to data dict"""
        data['tenant_id'] = current_user.tenant_id
        return data
