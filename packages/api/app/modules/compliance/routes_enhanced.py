"""
Enhanced Compliance Routes (Pillar 1) - Regulation & Compliance
Uses Pydantic schemas, authentication, and proper pagination
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid

from dal import get_db
from app.core.deps import get_current_user, CurrentUser, TenantIsolation
from app.modules.compliance.models import (
    AISystem, ComplianceRecord, RiskAssessment,
    RiskLevel, AISystemStatus
)
from app.modules.regulations.models import ComplianceFramework
from app.schemas.compliance import (
    AISystemCreate, AISystemUpdate, AISystemResponse, AISystemListResponse,
    ComplianceRecordCreate, ComplianceRecordUpdate, ComplianceRecordResponse, ComplianceRecordListResponse,
    RiskAssessmentCreate, RiskAssessmentUpdate, RiskAssessmentResponse, RiskAssessmentListResponse,
    RiskAssessmentValidate,
    ComplianceFrameworkResponse, ComplianceFrameworkListResponse,
    AssessmentType
)


router = APIRouter(tags=["Compliance"])


# =====================
# AI SYSTEMS REGISTRY
# =====================

@router.get("/ai-systems", response_model=AISystemListResponse)
async def list_ai_systems(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[AISystemStatus] = None,
    risk_level: Optional[RiskLevel] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List all AI systems for current tenant with filtering"""
    query = db.query(AISystem).filter(
        AISystem.tenant_id == uuid.UUID(current_user.tenant_id),
        AISystem.deleted_at == None
    )
    
    # Apply filters
    if status:
        query = query.filter(AISystem.status == status)
    if risk_level:
        query = query.filter(AISystem.risk_level == risk_level)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            AISystem.name.ilike(search_term) |
            AISystem.description.ilike(search_term) |
            AISystem.vendor.ilike(search_term)
        )
    
    total = query.count()
    systems = query.order_by(AISystem.created_at.desc()).offset(skip).limit(limit).all()
    
    return AISystemListResponse(
        total=total,
        items=[AISystemResponse.model_validate(s) for s in systems]
    )


@router.get("/ai-systems/{system_id}", response_model=AISystemResponse)
async def get_ai_system(
    system_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific AI system"""
    system = db.query(AISystem).filter(
        AISystem.id == uuid.UUID(system_id),
        AISystem.tenant_id == uuid.UUID(current_user.tenant_id),
        AISystem.deleted_at == None
    ).first()
    
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    return AISystemResponse.model_validate(system)


@router.post("/ai-systems", response_model=AISystemResponse, status_code=status.HTTP_201_CREATED)
async def create_ai_system(
    system_data: AISystemCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a new AI system"""
    # Override tenant_id with current user's tenant
    system = AISystem(
        **system_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(system)
    db.commit()
    db.refresh(system)
    
    return AISystemResponse.model_validate(system)


@router.patch("/ai-systems/{system_id}", response_model=AISystemResponse)
async def update_ai_system(
    system_id: str,
    system_data: AISystemUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update an AI system"""
    system = db.query(AISystem).filter(
        AISystem.id == uuid.UUID(system_id),
        AISystem.tenant_id == uuid.UUID(current_user.tenant_id),
        AISystem.deleted_at == None
    ).first()
    
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    update_data = system_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(system, key, value)
    
    system.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(system)
    
    return AISystemResponse.model_validate(system)


@router.delete("/ai-systems/{system_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ai_system(
    system_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Soft delete an AI system"""
    system = db.query(AISystem).filter(
        AISystem.id == uuid.UUID(system_id),
        AISystem.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not system:
        raise HTTPException(status_code=404, detail="AI System not found")
    
    system.deleted_at = datetime.utcnow()
    db.commit()
    
    return None


# =====================
# COMPLIANCE RECORDS
# =====================

@router.get("/records", response_model=ComplianceRecordListResponse)
async def list_compliance_records(
    ai_system_id: Optional[str] = None,
    assessment_status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List compliance records with filtering"""
    query = db.query(ComplianceRecord).filter(
        ComplianceRecord.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(ComplianceRecord.ai_system_id == uuid.UUID(ai_system_id))
    if assessment_status:
        query = query.filter(ComplianceRecord.assessment_status == assessment_status)
    
    total = query.count()
    records = query.order_by(ComplianceRecord.created_at.desc()).offset(skip).limit(limit).all()
    
    return ComplianceRecordListResponse(
        total=total,
        items=[ComplianceRecordResponse.model_validate(r) for r in records]
    )


@router.get("/records/{record_id}", response_model=ComplianceRecordResponse)
async def get_compliance_record(
    record_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific compliance record"""
    record = db.query(ComplianceRecord).filter(
        ComplianceRecord.id == uuid.UUID(record_id),
        ComplianceRecord.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Compliance record not found")
    
    return ComplianceRecordResponse.model_validate(record)


@router.post("/records", response_model=ComplianceRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_compliance_record(
    record_data: ComplianceRecordCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a compliance assessment record"""
    # Verify AI system exists in tenant
    system = db.query(AISystem).filter(
        AISystem.id == uuid.UUID(record_data.ai_system_id),
        AISystem.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not system:
        raise HTTPException(status_code=400, detail="AI System not found")
    
    record = ComplianceRecord(
        **record_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return ComplianceRecordResponse.model_validate(record)


@router.patch("/records/{record_id}", response_model=ComplianceRecordResponse)
async def update_compliance_record(
    record_id: str,
    record_data: ComplianceRecordUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a compliance record"""
    record = db.query(ComplianceRecord).filter(
        ComplianceRecord.id == uuid.UUID(record_id),
        ComplianceRecord.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Compliance record not found")
    
    update_data = record_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    
    record.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(record)
    
    return ComplianceRecordResponse.model_validate(record)


# =====================
# RISK ASSESSMENTS
# =====================

@router.get("/risk-assessments", response_model=RiskAssessmentListResponse)
async def list_risk_assessments(
    ai_system_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List risk assessments"""
    query = db.query(RiskAssessment).filter(
        RiskAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(RiskAssessment.ai_system_id == uuid.UUID(ai_system_id))
    
    total = query.count()
    assessments = query.order_by(RiskAssessment.created_at.desc()).offset(skip).limit(limit).all()
    
    return RiskAssessmentListResponse(
        total=total,
        items=[RiskAssessmentResponse.model_validate(a) for a in assessments]
    )


@router.get("/risk-assessments/{assessment_id}", response_model=RiskAssessmentResponse)
async def get_risk_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific risk assessment"""
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.id == uuid.UUID(assessment_id),
        RiskAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    
    return RiskAssessmentResponse.model_validate(assessment)


@router.post("/risk-assessments", response_model=RiskAssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_risk_assessment(
    assessment_data: RiskAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a risk assessment"""
    assessment = RiskAssessment(
        **assessment_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    return RiskAssessmentResponse.model_validate(assessment)


@router.patch("/risk-assessments/{assessment_id}", response_model=RiskAssessmentResponse)
async def update_risk_assessment(
    assessment_id: str,
    assessment_data: RiskAssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a risk assessment"""
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.id == uuid.UUID(assessment_id),
        RiskAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    
    update_data = assessment_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assessment, key, value)
    
    assessment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(assessment)
    
    return RiskAssessmentResponse.model_validate(assessment)


@router.post("/risk-assessments/{assessment_id}/validate", response_model=RiskAssessmentResponse)
async def validate_risk_assessment(
    assessment_id: str,
    validation_data: RiskAssessmentValidate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Validate a risk assessment"""
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.id == uuid.UUID(assessment_id),
        RiskAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    
    assessment.is_validated = True
    assessment.validated_by = uuid.UUID(validation_data.validated_by)
    assessment.validated_at = datetime.utcnow()
    db.commit()
    db.refresh(assessment)
    
    return RiskAssessmentResponse.model_validate(assessment)


# =====================
# COMPLIANCE FRAMEWORKS
# =====================

@router.get("/frameworks", response_model=ComplianceFrameworkListResponse)
async def list_frameworks(
    region: Optional[str] = None,
    is_active: Optional[bool] = True,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List compliance frameworks (global, not tenant-scoped)"""
    query = db.query(ComplianceFramework)
    
    if is_active is not None:
        query = query.filter(ComplianceFramework.is_active == is_active)
    if region:
        query = query.filter(ComplianceFramework.region.ilike(f"%{region}%"))
    
    total = query.count()
    frameworks = query.offset(skip).limit(limit).all()
    
    return ComplianceFrameworkListResponse(
        total=total,
        items=[ComplianceFrameworkResponse.model_validate(f) for f in frameworks]
    )


@router.get("/frameworks/{framework_id}", response_model=ComplianceFrameworkResponse)
async def get_framework(
    framework_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific compliance framework"""
    framework = db.query(ComplianceFramework).filter(
        ComplianceFramework.id == framework_id
    ).first()
    
    if not framework:
        raise HTTPException(status_code=404, detail="Framework not found")
    
    return ComplianceFrameworkResponse.model_validate(framework)


# =====================
# STATISTICS & ANALYTICS
# =====================

@router.get("/stats/summary")
async def get_compliance_summary(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get compliance statistics summary for dashboard"""
    tenant_uuid = uuid.UUID(current_user.tenant_id)
    
    # Count systems by status
    systems = db.query(AISystem).filter(
        AISystem.tenant_id == tenant_uuid,
        AISystem.deleted_at == None
    ).all()
    
    total_systems = len(systems)
    systems_by_status = {}
    systems_by_risk = {}
    systems_by_compliance = {}
    
    for system in systems:
        status_val = system.status.value if system.status else "unknown"
        systems_by_status[status_val] = systems_by_status.get(status_val, 0) + 1
        
        risk_val = system.risk_level.value if system.risk_level else "unknown"
        systems_by_risk[risk_val] = systems_by_risk.get(risk_val, 0) + 1
        
        comp_val = system.compliance_status or "pending"
        systems_by_compliance[comp_val] = systems_by_compliance.get(comp_val, 0) + 1
    
    # Count compliance records
    total_assessments = db.query(ComplianceRecord).filter(
        ComplianceRecord.tenant_id == tenant_uuid
    ).count()
    
    pending_assessments = db.query(ComplianceRecord).filter(
        ComplianceRecord.tenant_id == tenant_uuid,
        ComplianceRecord.assessment_status == "pending"
    ).count()
    
    completed_assessments = db.query(ComplianceRecord).filter(
        ComplianceRecord.tenant_id == tenant_uuid,
        ComplianceRecord.assessment_status == "completed"
    ).count()
    
    # Calculate average compliance score
    from sqlalchemy import func
    avg_score = db.query(func.avg(ComplianceRecord.compliance_percentage)).filter(
        ComplianceRecord.tenant_id == tenant_uuid,
        ComplianceRecord.assessment_status == "completed"
    ).scalar() or 0.0
    
    return {
        "total_systems": total_systems,
        "systems_by_status": systems_by_status,
        "systems_by_risk": systems_by_risk,
        "systems_by_compliance": systems_by_compliance,
        "total_assessments": total_assessments,
        "pending_assessments": pending_assessments,
        "completed_assessments": completed_assessments,
        "average_compliance_score": round(avg_score, 2),
    }
