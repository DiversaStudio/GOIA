"""
Authentication Routes for GOIA
Login, Register, Token Refresh, Password Management
"""
from fastapi import APIRouter, HTTPException, Depends, status, Request, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

from app import get_db
from app.modules.auth.service import AuthService, get_current_user, get_current_active_user
from app.modules.users.models import User, UserRole
from app.modules.tenants.models import Tenant

router = APIRouter(tags=["Authentication"])


# =====================
# PYDANTIC SCHEMAS
# =====================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    username: Optional[str] = None
    tenant_name: Optional[str] = None  # For new tenant creation


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None


# =====================
# AUTH ENDPOINTS
# =====================

@router.get("/")
async def auth_info():
    """Auth information endpoint"""
    return {
        "status": "configured",
        "method": "JWT + Email Verification",
        "endpoints": {
            "login": "POST /api/v1/auth/login",
            "register": "POST /api/v1/auth/register",
            "refresh": "POST /api/v1/auth/refresh",
            "me": "GET /api/v1/auth/me",
            "logout": "POST /api/v1/auth/logout",
        }
    }


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login endpoint - OAuth2 compatible
    Returns JWT access and refresh tokens
    """
    # Authenticate user
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active or user.is_disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    # Create tokens
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    access_token = AuthService.create_access_token(token_data)
    refresh_token = AuthService.create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=60 * 24 * 60,  # 24 hours in seconds
        user=user.to_dict()
    )


@router.post("/login/json", response_model=TokenResponse)
async def login_json(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login endpoint - JSON body
    Returns JWT access and refresh tokens
    """
    user = AuthService.authenticate_user(db, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.is_active or user.is_disabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    access_token = AuthService.create_access_token(token_data)
    refresh_token = AuthService.create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=60 * 24 * 60,
        user=user.to_dict()
    )


@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    Optionally creates a new tenant if tenant_name is provided
    """
    # Check if user already exists
    existing_user = AuthService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check username uniqueness if provided
    if user_data.username:
        existing_username = db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Create or get tenant
    tenant_id = None
    is_admin = False
    
    if user_data.tenant_name:
        # Create new tenant for this user
        tenant = Tenant(
            name=user_data.tenant_name,
            domain=user_data.email.split("@")[1] if "@" in user_data.email else None,
            status="active",
        )
        db.add(tenant)
        db.flush()
        tenant_id = tenant.id
        is_admin = True  # First user of new tenant is admin
    
    # Create user
    hashed_password = AuthService.hash_password(user_data.password)
    
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        tenant_id=tenant_id,
        role=UserRole.ADMIN if is_admin else UserRole.USER,
        is_active=True,
        email_verified=False,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create tokens
    token_data = {"sub": str(new_user.id), "email": new_user.email, "role": new_user.role.value}
    access_token = AuthService.create_access_token(token_data)
    refresh_token = AuthService.create_refresh_token({"sub": str(new_user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=60 * 24 * 60,
        user=new_user.to_dict()
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    payload = AuthService.decode_token(request.refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    user = AuthService.get_user_by_id(db, user_id)
    
    if not user or not user.is_active or user.is_disabled:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or disabled"
        )
    
    # Create new tokens
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    access_token = AuthService.create_access_token(token_data)
    refresh_token = AuthService.create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=60 * 24 * 60,
        user=user.to_dict()
    )


@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user information"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "avatar_url": current_user.avatar_url,
        "role": current_user.role.value,
        "is_active": current_user.is_active,
        "email_verified": current_user.email_verified,
        "tenant_id": str(current_user.tenant_id) if current_user.tenant_id else None,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }


@router.patch("/me")
async def update_me(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    if update_data.username is not None:
        # Check uniqueness
        existing = db.query(User).filter(
            User.username == update_data.username,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        current_user.username = update_data.username
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated", "user": current_user.to_dict()}


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    if not current_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password not set for this account"
        )
    
    if not AuthService.verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.hashed_password = AuthService.hash_password(password_data.new_password)
    current_user.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Password changed successfully"}


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user)
):
    """
    Logout endpoint
    In a production system, you would invalidate the token here
    """
    # In a real system, add token to blacklist or use token versioning
    return {"message": "Successfully logged out"}


@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset
    In production, this would send an email with a reset link
    """
    user = AuthService.get_user_by_email(db, request.email)
    
    # Always return success to prevent email enumeration
    if user:
        # Create reset token (in production, send via email)
        reset_token = AuthService.create_access_token(
            {"sub": str(user.id), "type": "password_reset"},
            expires_delta=timedelta(hours=1)
        )
        # TODO: Send email with reset link
        # For now, return token for testing
        return {
            "message": "If the email exists, a reset link has been sent",
            "dev_token": reset_token  # Remove in production
        }
    
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """Reset password using token"""
    payload = AuthService.decode_token(data.token)
    
    if not payload or payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    user_id = payload.get("sub")
    user = AuthService.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    user.hashed_password = AuthService.hash_password(data.new_password)
    user.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Password reset successfully"}


@router.post("/verify-email")
async def verify_email(
    token: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """Verify email address using token"""
    payload = AuthService.decode_token(token)
    
    if not payload or payload.get("type") != "email_verify":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    user_id = payload.get("sub")
    user = AuthService.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    user.email_verified = True
    user.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Email verified successfully"}


@router.get("/test")
async def test_auth():
    """Test auth connection"""
    return {"status": "ok"}
