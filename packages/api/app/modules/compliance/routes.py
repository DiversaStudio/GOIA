from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from dal import get_db
from app.modules.compliance.models import AISystem, ComplianceRecord, RiskAssessment, RiskLevel, AISystemStatus
from app.modules.regulations.models import ComplianceFramework


router = APIRouter(tags=["Compliance"])


# =====================
# AI SYSTEMS REGISTRY
# =====================

@router.get("/ai-systems")
async def list_ai_systems(
    skip: int = 0,
    limit: int = 100,
    tenant_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all AI systems for a tenant"""
    query = db.query(AISystem)
    if tenant_id:
        query = query.filter(AISystem.tenant_id == tenant_id)
    systems = query.offset(skip).limit(limit).all()
    return {"total": len(systems), "items": [s.to_dict() for s in systems]}


@router.get("/ai-systems/{system_id}")
async def get_ai_system(
    system_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific AI system"""
    system = db.query(AISystem).filter(AISystem.id == system_id).first()
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    return system.to_dict()


@router.post("/ai-systems")
async def create_ai_system(
    system_data: dict,
    db: Session = Depends(get_db)
):
    """Create a new AI system"""
    system = AISystem(**system_data)
    db.add(system)
    db.commit()
    db.refresh(system)
    return system.to_dict()


@router.patch("/ai-systems/{system_id}")
async def update_ai_system(
    system_id: str,
    system_data: dict,
    db: Session = Depends(get_db)
):
    """Update an AI system"""
    system = db.query(AISystem).filter(AISystem.id == system_id).first()
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    for key, value in system_data.items():
        if hasattr(system, key):
            setattr(system, key, value)
    system.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(system)
    return system.to_dict()


@router.delete("/ai-systems/{system_id}")
async def delete_ai_system(
    system_id: str,
    db: Session = Depends(get_db)
):
    """Delete an AI system"""
    system = db.query(AISystem).filter(AISystem.id == system_id).first()
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    system.deleted_at = datetime.utcnow()
    db.commit()
    return {"message": "AI System deleted"}


# =====================
# COMPLIANCE RECORDS
# =====================

@router.get("/records")
async def list_compliance_records(
    ai_system_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List compliance records"""
    query = db.query(ComplianceRecord)
    if ai_system_id:
        query = query.filter(ComplianceRecord.ai_system_id == ai_system_id)
    records = query.offset(skip).limit(limit).all()
    return {"total": len(records), "items": [r.to_dict() for r in records]}


@router.post("/records")
async def create_compliance_record(
    record_data: dict,
    db: Session = Depends(get_db)
):
    """Create a compliance assessment record"""
    record = ComplianceRecord(**record_data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record.to_dict()


# =====================
# RISK ASSESSMENTS
# =====================

@router.get("/risk-assessments")
async def list_risk_assessments(
    ai_system_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List risk assessments"""
    query = db.query(RiskAssessment)
    if ai_system_id:
        query = query.filter(RiskAssessment.ai_system_id == ai_system_id)
    assessments = query.offset(skip).limit(limit).all()
    return {"total": len(assessments), "items": [a.to_dict() for a in assessments]}


@router.post("/risk-assessments")
async def create_risk_assessment(
    assessment_data: dict,
    db: Session = Depends(get_db)
):
    """Create a risk assessment"""
    assessment = RiskAssessment(**assessment_data)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment.to_dict()


# =====================
# COMPLIANCE FRAMEWORKS
# =====================

@router.get("/frameworks")
async def list_frameworks(
    region: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List compliance frameworks"""
    query = db.query(ComplianceFramework).filter(ComplianceFramework.is_active == True)
    if region:
        query = query.filter(ComplianceFramework.region == region)
    frameworks = query.all()
    return {"total": len(frameworks), "items": [f.to_dict() for f in frameworks]}


@router.get("/frameworks/{framework_id}")
async def get_framework(
    framework_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific compliance framework"""
    framework = db.query(ComplianceFramework).filter(
        ComplianceFramework.id == framework_id
    ).first()
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    return framework.to_dict()
