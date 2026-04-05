from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from dal import get_db
from app.modules.audit.models import (
    AuditLog,
    EvidenceVault,
    SystemHealth,
    AuditAction,
    HealthStatus,
)


router = APIRouter(tags=["Observability & Audit"])


# =====================
# AUDIT LOGS
# =====================

@router.get("/logs")
async def list_audit_logs(
    actor_id: Optional[str] = None,
    resource_type: Optional[str] = None,
    action: Optional[AuditAction] = None,
    tenant_id: Optional[str] = None,
    days: int = 7,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List audit logs"""
    query = db.query(AuditLog)
    
    # Filter by date range
    start_date = datetime.utcnow() - timedelta(days=days)
    query = query.filter(AuditLog.created_at >= start_date)
    
    if actor_id:
        query = query.filter(AuditLog.actor_id == actor_id)
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)
    if action:
        query = query.filter(AuditLog.action == action)
    if tenant_id:
        query = query.filter(AuditLog.tenant_id == tenant_id)
    
    logs = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": len(logs), "items": [l.to_dict() for l in logs]}


@router.get("/logs/{log_id}")
async def get_audit_log(
    log_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific audit log"""
    log = db.query(AuditLog).filter(AuditLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return log.to_dict()


@router.post("/logs")
async def create_audit_log(
    request: Request,
    log_data: dict,
    db: Session = Depends(get_db)
):
    """Create an audit log entry"""
    log = AuditLog(
        **log_data,
        actor_ip=request.client.host if request.client else None,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log.to_dict()


# =====================
# EVIDENCE VAULT
# =====================

@router.get("/evidence")
async def list_evidence(
    ai_system_id: Optional[str] = None,
    compliance_record_id: Optional[str] = None,
    evidence_type: Optional[str] = None,
    is_verified: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List evidence items"""
    query = db.query(EvidenceVault)
    if ai_system_id:
        query = query.filter(EvidenceVault.ai_system_id == ai_system_id)
    if compliance_record_id:
        query = query.filter(EvidenceVault.compliance_record_id == compliance_record_id)
    if evidence_type:
        query = query.filter(EvidenceVault.evidence_type == evidence_type)
    if is_verified is not None:
        query = query.filter(EvidenceVault.is_verified == is_verified)
    
    evidence = query.offset(skip).limit(limit).all()
    return {"total": len(evidence), "items": [e.to_dict() for e in evidence]}


@router.get("/evidence/{evidence_id}")
async def get_evidence(
    evidence_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific evidence item"""
    evidence = db.query(EvidenceVault).filter(
        EvidenceVault.id == evidence_id
    ).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    # Update access count and last accessed
    evidence.access_count += 1
    evidence.last_accessed_at = datetime.utcnow()
    db.commit()
    
    return evidence.to_dict()


@router.post("/evidence")
async def create_evidence(
    evidence_data: dict,
    db: Session = Depends(get_db)
):
    """Upload evidence to the vault"""
    evidence = EvidenceVault(**evidence_data)
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence.to_dict()


@router.patch("/evidence/{evidence_id}")
async def update_evidence(
    evidence_id: str,
    evidence_data: dict,
    db: Session = Depends(get_db)
):
    """Update evidence metadata"""
    evidence = db.query(EvidenceVault).filter(
        EvidenceVault.id == evidence_id
    ).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    for key, value in evidence_data.items():
        if hasattr(evidence, key):
            setattr(evidence, key, value)
    evidence.updated_at = datetime.utcnow()
    db.commit()
    return evidence.to_dict()


@router.post("/evidence/{evidence_id}/verify")
async def verify_evidence(
    evidence_id: str,
    verifier_id: str,
    db: Session = Depends(get_db)
):
    """Verify an evidence item"""
    evidence = db.query(EvidenceVault).filter(
        EvidenceVault.id == evidence_id
    ).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    evidence.is_verified = True
    evidence.verified_by = verifier_id
    evidence.verified_at = datetime.utcnow()
    db.commit()
    return {"message": "Evidence verified", "evidence": evidence.to_dict()}


# =====================
# SYSTEM HEALTH
# =====================

@router.get("/health")
async def list_system_health(
    ai_system_id: Optional[str] = None,
    status: Optional[HealthStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List system health records"""
    query = db.query(SystemHealth)
    if ai_system_id:
        query = query.filter(SystemHealth.ai_system_id == ai_system_id)
    if status:
        query = query.filter(SystemHealth.overall_status == status)
    
    health_records = query.offset(skip).limit(limit).all()
    return {"total": len(health_records), "items": [h.to_dict() for h in health_records]}


@router.get("/health/{system_id}")
async def get_system_health(
    system_id: str,
    db: Session = Depends(get_db)
):
    """Get health for a specific AI system"""
    health = db.query(SystemHealth).filter(
        SystemHealth.ai_system_id == system_id
    ).order_by(SystemHealth.created_at.desc()).first()
    if not health:
        raise HTTPException(status_code=404, detail="Health record not found")
    return health.to_dict()


@router.post("/health")
async def create_system_health(
    health_data: dict,
    db: Session = Depends(get_db)
):
    """Create a system health record"""
    health = SystemHealth(**health_data)
    db.add(health)
    db.commit()
    db.refresh(health)
    return health.to_dict()


@router.get("/dashboard/summary")
async def get_health_summary(
    tenant_id: str,
    db: Session = Depends(get_db)
):
    """Get health summary for dashboard"""
    # Get all AI systems for tenant
    from app.modules.compliance.models import AISystem
    
    ai_systems = db.query(AISystem).filter(
        AISystem.tenant_id == tenant_id,
        AISystem.deleted_at == None
    ).all()
    
    total_systems = len(ai_systems)
    systems_by_status = {}
    systems_by_risk = {}
    
    for system in ai_systems:
        # Count by status
        status = system.status.value if system.status else "unknown"
        systems_by_status[status] = systems_by_status.get(status, 0) + 1
        
        # Count by risk
        risk = system.risk_level.value if system.risk_level else "unknown"
        systems_by_risk[risk] = systems_by_risk.get(risk, 0) + 1
    
    # Get recent alerts
    from app.modules.fairness.models import BiasAlert
    triggered_alerts = db.query(BiasAlert).filter(
        BiasAlert.is_triggered == True,
        BiasAlert.is_active == True
    ).count()
    
    # Get pending compliance assessments
    from app.modules.compliance.models import ComplianceRecord
    pending_assessments = db.query(ComplianceRecord).filter(
        ComplianceRecord.assessment_status == "pending"
    ).count()
    
    return {
        "total_systems": total_systems,
        "systems_by_status": systems_by_status,
        "systems_by_risk": systems_by_risk,
        "triggered_alerts": triggered_alerts,
        "pending_assessments": pending_assessments,
        "compliance_score": 78.5,  # Placeholder - calculate from actual data
        "last_updated": datetime.utcnow().isoformat(),
    }
