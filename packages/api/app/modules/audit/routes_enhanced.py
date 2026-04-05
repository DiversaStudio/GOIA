"""
Enhanced Audit Routes (Pillar 4) - Observability & Audit
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
import uuid

from dal import get_db
from app.core.deps import get_current_user, CurrentUser
from app.modules.audit.models import (
    AuditLog, EvidenceVault, SystemHealth,
    AuditAction, HealthStatus
)
from app.modules.compliance.models import AISystem
from app.modules.fairness.models import BiasAlert
from app.modules.compliance.models import ComplianceRecord
from app.schemas.audit import (
    AuditLogCreate, AuditLogResponse, AuditLogListResponse,
    EvidenceCreate, EvidenceUpdate, EvidenceResponse, EvidenceListResponse, EvidenceVerify,
    SystemHealthCreate, SystemHealthResponse, SystemHealthListResponse,
    DashboardSummary, ActivityItem
)


router = APIRouter(tags=["Observability & Audit"])


# =====================
# AUDIT LOGS
# =====================

@router.get("/logs", response_model=AuditLogListResponse)
async def list_audit_logs(
    actor_id: Optional[str] = None,
    resource_type: Optional[str] = None,
    action: Optional[AuditAction] = None,
    days: int = Query(7, ge=1, le=90),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List audit logs with filtering"""
    query = db.query(AuditLog).filter(
        AuditLog.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    # Filter by date range
    start_date = datetime.utcnow() - timedelta(days=days)
    query = query.filter(AuditLog.created_at >= start_date)
    
    if actor_id:
        query = query.filter(AuditLog.actor_id == uuid.UUID(actor_id))
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)
    if action:
        query = query.filter(AuditLog.action == action)
    
    total = query.count()
    logs = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    
    return AuditLogListResponse(
        total=total,
        items=[AuditLogResponse.model_validate(l) for l in logs]
    )


@router.get("/logs/{log_id}", response_model=AuditLogResponse)
async def get_audit_log(
    log_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific audit log"""
    log = db.query(AuditLog).filter(
        AuditLog.id == uuid.UUID(log_id),
        AuditLog.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    
    return AuditLogResponse.model_validate(log)


@router.post("/logs", response_model=AuditLogResponse, status_code=status.HTTP_201_CREATED)
async def create_audit_log(
    request: Request,
    log_data: AuditLogCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create an audit log entry"""
    log = AuditLog(
        **log_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id),
        actor_ip=request.client.host if request.client else None,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return AuditLogResponse.model_validate(log)


# =====================
# EVIDENCE VAULT
# =====================

@router.get("/evidence", response_model=EvidenceListResponse)
async def list_evidence(
    ai_system_id: Optional[str] = None,
    compliance_record_id: Optional[str] = None,
    evidence_type: Optional[str] = None,
    is_verified: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List evidence items"""
    query = db.query(EvidenceVault).filter(
        EvidenceVault.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(EvidenceVault.ai_system_id == uuid.UUID(ai_system_id))
    if compliance_record_id:
        query = query.filter(EvidenceVault.compliance_record_id == uuid.UUID(compliance_record_id))
    if evidence_type:
        query = query.filter(EvidenceVault.evidence_type == evidence_type)
    if is_verified is not None:
        query = query.filter(EvidenceVault.is_verified == is_verified)
    
    total = query.count()
    evidence = query.order_by(EvidenceVault.created_at.desc()).offset(skip).limit(limit).all()
    
    return EvidenceListResponse(
        total=total,
        items=[EvidenceResponse.model_validate(e) for e in evidence]
    )


@router.get("/evidence/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific evidence item"""
    evidence = db.query(EvidenceVault).filter(
        EvidenceVault.id == uuid.UUID(evidence_id),
        EvidenceVault.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    # Update access count
    evidence.access_count = (evidence.access_count or 0) + 1
    evidence.last_accessed_at = datetime.utcnow()
    db.commit()
    
    return EvidenceResponse.model_validate(evidence)


@router.post("/evidence", response_model=EvidenceResponse, status_code=status.HTTP_201_CREATED)
async def create_evidence(
    evidence_data: EvidenceCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Upload evidence to the vault"""
    evidence = EvidenceVault(
        **evidence_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    
    return EvidenceResponse.model_validate(evidence)


@router.patch("/evidence/{evidence_id}", response_model=EvidenceResponse)
async def update_evidence(
    evidence_id: str,
    evidence_data: EvidenceUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update evidence metadata"""
    evidence = db.query(EvidenceVault).filter(
        EvidenceVault.id == uuid.UUID(evidence_id),
        EvidenceVault.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    update_data = evidence_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(evidence, key, value)
    
    evidence.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(evidence)
    
    return EvidenceResponse.model_validate(evidence)


@router.post("/evidence/{evidence_id}/verify", response_model=EvidenceResponse)
async def verify_evidence(
    evidence_id: str,
    verify_data: EvidenceVerify,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Verify an evidence item"""
    evidence = db.query(EvidenceVault).filter(
        EvidenceVault.id == uuid.UUID(evidence_id),
        EvidenceVault.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    evidence.is_verified = True
    evidence.verified_by = verify_data.verifier_id
    evidence.verified_at = datetime.utcnow()
    db.commit()
    db.refresh(evidence)
    
    return EvidenceResponse.model_validate(evidence)


@router.delete("/evidence/{evidence_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Delete evidence"""
    evidence = db.query(EvidenceVault).filter(
        EvidenceVault.id == uuid.UUID(evidence_id),
        EvidenceVault.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    db.delete(evidence)
    db.commit()
    
    return None


# =====================
# SYSTEM HEALTH
# =====================

@router.get("/health", response_model=SystemHealthListResponse)
async def list_system_health(
    ai_system_id: Optional[str] = None,
    status: Optional[HealthStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List system health records"""
    query = db.query(SystemHealth).filter(
        SystemHealth.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(SystemHealth.ai_system_id == uuid.UUID(ai_system_id))
    if status:
        query = query.filter(SystemHealth.overall_status == status)
    
    total = query.count()
    health_records = query.order_by(SystemHealth.created_at.desc()).offset(skip).limit(limit).all()
    
    return SystemHealthListResponse(
        total=total,
        items=[SystemHealthResponse.model_validate(h) for h in health_records]
    )


@router.get("/health/{system_id}", response_model=SystemHealthResponse)
async def get_system_health(
    system_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get latest health for a specific AI system"""
    health = db.query(SystemHealth).filter(
        SystemHealth.ai_system_id == uuid.UUID(system_id),
        SystemHealth.tenant_id == uuid.UUID(current_user.tenant_id)
    ).order_by(SystemHealth.created_at.desc()).first()
    
    if not health:
        raise HTTPException(status_code=404, detail="Health record not found")
    
    return SystemHealthResponse.model_validate(health)


@router.post("/health", response_model=SystemHealthResponse, status_code=status.HTTP_201_CREATED)
async def create_system_health(
    health_data: SystemHealthCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a system health record"""
    health = SystemHealth(
        **health_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(health)
    db.commit()
    db.refresh(health)
    
    return SystemHealthResponse.model_validate(health)


# =====================
# DASHBOARD & ANALYTICS
# =====================

@router.get("/dashboard/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get comprehensive dashboard summary"""
    tenant_uuid = uuid.UUID(current_user.tenant_id)
    
    # AI Systems stats
    systems = db.query(AISystem).filter(
        AISystem.tenant_id == tenant_uuid,
        AISystem.deleted_at == None
    ).all()
    
    total_systems = len(systems)
    systems_by_status = {}
    systems_by_risk = {}
    compliant_count = 0
    non_compliant_count = 0
    
    for system in systems:
        # Status
        status_val = system.status.value if system.status else "unknown"
        systems_by_status[status_val] = systems_by_status.get(status_val, 0) + 1
        
        # Risk
        risk_val = system.risk_level.value if system.risk_level else "unknown"
        systems_by_risk[risk_val] = systems_by_risk.get(risk_val, 0) + 1
        
        # Compliance
        if system.compliance_status == "compliant":
            compliant_count += 1
        elif system.compliance_status == "non_compliant":
            non_compliant_count += 1
    
    # Pending assessments
    pending_assessments = db.query(ComplianceRecord).filter(
        ComplianceRecord.tenant_id == tenant_uuid,
        ComplianceRecord.assessment_status == "pending"
    ).count()
    
    # Triggered alerts
    triggered_alerts = db.query(BiasAlert).filter(
        BiasAlert.tenant_id == tenant_uuid,
        BiasAlert.is_triggered == True,
        BiasAlert.is_active == True
    ).count()
    
    # Calculate compliance score
    from sqlalchemy import func
    avg_score = db.query(func.avg(ComplianceRecord.compliance_percentage)).filter(
        ComplianceRecord.tenant_id == tenant_uuid,
        ComplianceRecord.assessment_status == "completed"
    ).scalar() or 0.0
    
    # Recent activity (last 10 audit logs)
    recent_logs = db.query(AuditLog).filter(
        AuditLog.tenant_id == tenant_uuid
    ).order_by(AuditLog.created_at.desc()).limit(10).all()
    
    recent_activity = []
    for log in recent_logs:
        activity_type = "audit"
        if "compliance" in log.resource_type.lower():
            activity_type = "compliance"
        elif "privacy" in log.resource_type.lower() or "data" in log.resource_type.lower():
            activity_type = "privacy"
        elif "fairness" in log.resource_type.lower() or "bias" in log.resource_type.lower():
            activity_type = "fairness"
        
        time_diff = datetime.utcnow() - log.created_at
        if time_diff.days > 0:
            time_str = f"{time_diff.days} days ago"
        elif time_diff.seconds >= 3600:
            time_str = f"{time_diff.seconds // 3600} hours ago"
        else:
            time_str = f"{time_diff.seconds // 60} minutes ago"
        
        recent_activity.append({
            "id": str(log.id),
            "type": activity_type,
            "message": f"{log.action.value.title()} on {log.resource_type}",
            "time": time_str,
        })
    
    # Pillar stats
    pillar_stats = {
        "compliance": {
            "systems_registered": total_systems,
            "assessments_pending": pending_assessments,
        },
        "privacy": {
            "data_flows": db.query(EvidenceVault).filter(
                EvidenceVault.tenant_id == tenant_uuid
            ).count(),
        },
        "fairness": {
            "alerts_triggered": triggered_alerts,
        },
        "audit": {
            "events_logged_30d": db.query(AuditLog).filter(
                AuditLog.tenant_id == tenant_uuid,
                AuditLog.created_at >= datetime.utcnow() - timedelta(days=30)
            ).count(),
            "evidence_items": db.query(EvidenceVault).filter(
                EvidenceVault.tenant_id == tenant_uuid
            ).count(),
        }
    }
    
    return DashboardSummary(
        total_systems=total_systems,
        compliant_systems=compliant_count,
        non_compliant_systems=non_compliant_count,
        pending_assessments=pending_assessments,
        triggered_alerts=triggered_alerts,
        compliance_score=round(avg_score, 2),
        systems_by_status=systems_by_status,
        systems_by_risk=systems_by_risk,
        recent_activity=recent_activity,
        pillar_stats=pillar_stats,
        last_updated=datetime.utcnow()
    )


@router.get("/stats/summary")
async def get_audit_summary(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get audit statistics summary"""
    tenant_uuid = uuid.UUID(current_user.tenant_id)
    
    # Audit logs
    total_logs_30d = db.query(AuditLog).filter(
        AuditLog.tenant_id == tenant_uuid,
        AuditLog.created_at >= datetime.utcnow() - timedelta(days=30)
    ).count()
    
    # Evidence
    total_evidence = db.query(EvidenceVault).filter(
        EvidenceVault.tenant_id == tenant_uuid
    ).count()
    
    verified_evidence = db.query(EvidenceVault).filter(
        EvidenceVault.tenant_id == tenant_uuid,
        EvidenceVault.is_verified == True
    ).count()
    
    # System health
    healthy_systems = db.query(SystemHealth).filter(
        SystemHealth.tenant_id == tenant_uuid,
        SystemHealth.overall_status == HealthStatus.HEALTHY
    ).count()
    
    return {
        "audit_logs": {
            "total_30d": total_logs_30d,
        },
        "evidence": {
            "total": total_evidence,
            "verified": verified_evidence,
            "pending_verification": total_evidence - verified_evidence,
        },
        "health": {
            "healthy_systems": healthy_systems,
        }
    }
