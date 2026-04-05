"""
Regulations Router - Compliance Frameworks Management
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import get_db
from app.modules.regulations.models import ComplianceFramework
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()


# Pydantic schemas
class FrameworkBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    jurisdiction: Optional[str] = None
    version: Optional[str] = None
    categories: Optional[List[str]] = []
    requirements: Optional[List[str]] = []


class FrameworkCreate(FrameworkBase):
    pass


class FrameworkResponse(FrameworkBase):
    id: str
    is_active: bool
    effective_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/frameworks", response_model=dict)
async def list_frameworks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    jurisdiction: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """List all compliance frameworks"""
    query = db.query(ComplianceFramework)
    
    if jurisdiction:
        query = query.filter(ComplianceFramework.jurisdiction.ilike(f"%{jurisdiction}%"))
    if is_active is not None:
        query = query.filter(ComplianceFramework.is_active == is_active)
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "items": [
            {
                "id": str(item.id),
                "name": item.framework_name,
                "code": item.framework_code,
                "description": item.description,
                "jurisdiction": item.region,
                "version": item.version,
                "is_active": item.is_active,
                "categories": [],
                "requirements": [],
                "effective_date": item.effective_date.isoformat() if item.effective_date else None,
                "created_at": item.created_at.isoformat() if item.created_at else None,
            }
            for item in items
        ]
    }


@router.get("/frameworks/{framework_id}", response_model=dict)
async def get_framework(
    framework_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific framework by ID"""
    try:
        fw_id = uuid.UUID(framework_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid framework ID format")
    
    framework = db.query(ComplianceFramework).filter(ComplianceFramework.id == fw_id).first()
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    
    return {
        "id": str(framework.id),
        "name": framework.framework_name,
        "code": framework.framework_code,
        "description": framework.description,
        "jurisdiction": framework.region,
        "version": framework.version,
        "is_active": framework.is_active,
        "categories": [],
        "requirements": [],
        "effective_date": framework.effective_date.isoformat() if framework.effective_date else None,
        "created_at": framework.created_at.isoformat() if framework.created_at else None,
    }
