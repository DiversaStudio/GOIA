"""
Enhanced Fairness Routes (Pillar 3) - Bias & Fairness
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid

from dal import get_db
from app.core.deps import get_current_user, CurrentUser
from app.modules.fairness.models import (
    ModelCard, FairnessAssessment, BiasAlert,
    AssessmentStatus, AlertSeverity
)
from app.schemas.fairness import (
    ModelCardCreate, ModelCardUpdate, ModelCardResponse, ModelCardListResponse,
    FairnessAssessmentCreate, FairnessAssessmentUpdate, FairnessAssessmentResponse,
    FairnessAssessmentListResponse, FairnessAssessmentComplete,
    BiasAlertCreate, BiasAlertUpdate, BiasAlertResponse, BiasAlertListResponse, BiasAlertTrigger
)


router = APIRouter(tags=["Bias & Fairness"])


# =====================
# MODEL CARDS
# =====================

@router.get("/model-cards", response_model=ModelCardListResponse)
async def list_model_cards(
    ai_system_id: Optional[str] = None,
    is_published: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List model cards"""
    query = db.query(ModelCard).filter(
        ModelCard.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(ModelCard.ai_system_id == uuid.UUID(ai_system_id))
    if is_published is not None:
        query = query.filter(ModelCard.is_published == is_published)
    
    total = query.count()
    cards = query.order_by(ModelCard.created_at.desc()).offset(skip).limit(limit).all()
    
    return ModelCardListResponse(
        total=total,
        items=[ModelCardResponse.model_validate(c) for c in cards]
    )


@router.get("/model-cards/{card_id}", response_model=ModelCardResponse)
async def get_model_card(
    card_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific model card"""
    card = db.query(ModelCard).filter(
        ModelCard.id == uuid.UUID(card_id),
        ModelCard.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Model card not found")
    
    return ModelCardResponse.model_validate(card)


@router.post("/model-cards", response_model=ModelCardResponse, status_code=status.HTTP_201_CREATED)
async def create_model_card(
    card_data: ModelCardCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a model card"""
    card = ModelCard(
        **card_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    
    return ModelCardResponse.model_validate(card)


@router.patch("/model-cards/{card_id}", response_model=ModelCardResponse)
async def update_model_card(
    card_id: str,
    card_data: ModelCardUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a model card"""
    card = db.query(ModelCard).filter(
        ModelCard.id == uuid.UUID(card_id),
        ModelCard.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Model card not found")
    
    update_data = card_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(card, key, value)
    
    card.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(card)
    
    return ModelCardResponse.model_validate(card)


@router.post("/model-cards/{card_id}/publish", response_model=ModelCardResponse)
async def publish_model_card(
    card_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Publish a model card"""
    card = db.query(ModelCard).filter(
        ModelCard.id == uuid.UUID(card_id),
        ModelCard.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Model card not found")
    
    card.is_published = True
    card.published_at = datetime.utcnow()
    db.commit()
    db.refresh(card)
    
    return ModelCardResponse.model_validate(card)


# =====================
# FAIRNESS ASSESSMENTS
# =====================

@router.get("/assessments", response_model=FairnessAssessmentListResponse)
async def list_fairness_assessments(
    ai_system_id: Optional[str] = None,
    status: Optional[AssessmentStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List fairness assessments"""
    query = db.query(FairnessAssessment).filter(
        FairnessAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(FairnessAssessment.ai_system_id == uuid.UUID(ai_system_id))
    if status:
        query = query.filter(FairnessAssessment.status == status)
    
    total = query.count()
    assessments = query.order_by(FairnessAssessment.created_at.desc()).offset(skip).limit(limit).all()
    
    return FairnessAssessmentListResponse(
        total=total,
        items=[FairnessAssessmentResponse.model_validate(a) for a in assessments]
    )


@router.get("/assessments/{assessment_id}", response_model=FairnessAssessmentResponse)
async def get_fairness_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific fairness assessment"""
    assessment = db.query(FairnessAssessment).filter(
        FairnessAssessment.id == uuid.UUID(assessment_id),
        FairnessAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    return FairnessAssessmentResponse.model_validate(assessment)


@router.post("/assessments", response_model=FairnessAssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_fairness_assessment(
    assessment_data: FairnessAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a fairness assessment"""
    assessment = FairnessAssessment(
        **assessment_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    return FairnessAssessmentResponse.model_validate(assessment)


@router.patch("/assessments/{assessment_id}", response_model=FairnessAssessmentResponse)
async def update_fairness_assessment(
    assessment_id: str,
    assessment_data: FairnessAssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a fairness assessment"""
    assessment = db.query(FairnessAssessment).filter(
        FairnessAssessment.id == uuid.UUID(assessment_id),
        FairnessAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    update_data = assessment_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(assessment, key, value)
    
    assessment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(assessment)
    
    return FairnessAssessmentResponse.model_validate(assessment)


@router.post("/assessments/{assessment_id}/complete", response_model=FairnessAssessmentResponse)
async def complete_fairness_assessment(
    assessment_id: str,
    completion_data: FairnessAssessmentComplete,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Complete a fairness assessment"""
    assessment = db.query(FairnessAssessment).filter(
        FairnessAssessment.id == uuid.UUID(assessment_id),
        FairnessAssessment.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    assessment.status = AssessmentStatus.COMPLETED
    assessment.assessment_date = datetime.utcnow()
    assessment.overall_fairness_score = completion_data.score
    assessment.is_fair = completion_data.is_fair
    assessment.findings = completion_data.findings
    assessment.recommendations = completion_data.recommendations
    db.commit()
    db.refresh(assessment)
    
    return FairnessAssessmentResponse.model_validate(assessment)


# =====================
# BIAS ALERTS
# =====================

@router.get("/alerts", response_model=BiasAlertListResponse)
async def list_bias_alerts(
    ai_system_id: Optional[str] = None,
    severity: Optional[AlertSeverity] = None,
    is_triggered: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List bias alerts"""
    query = db.query(BiasAlert).filter(
        BiasAlert.tenant_id == uuid.UUID(current_user.tenant_id),
        BiasAlert.is_active == True
    )
    
    if ai_system_id:
        query = query.filter(BiasAlert.ai_system_id == uuid.UUID(ai_system_id))
    if severity:
        query = query.filter(BiasAlert.severity == severity)
    if is_triggered is not None:
        query = query.filter(BiasAlert.is_triggered == is_triggered)
    
    total = query.count()
    alerts = query.order_by(BiasAlert.created_at.desc()).offset(skip).limit(limit).all()
    
    return BiasAlertListResponse(
        total=total,
        items=[BiasAlertResponse.model_validate(a) for a in alerts]
    )


@router.get("/alerts/{alert_id}", response_model=BiasAlertResponse)
async def get_bias_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific bias alert"""
    alert = db.query(BiasAlert).filter(
        BiasAlert.id == uuid.UUID(alert_id),
        BiasAlert.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return BiasAlertResponse.model_validate(alert)


@router.post("/alerts", response_model=BiasAlertResponse, status_code=status.HTTP_201_CREATED)
async def create_bias_alert(
    alert_data: BiasAlertCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a bias alert configuration"""
    alert = BiasAlert(
        **alert_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    
    return BiasAlertResponse.model_validate(alert)


@router.patch("/alerts/{alert_id}", response_model=BiasAlertResponse)
async def update_bias_alert(
    alert_id: str,
    alert_data: BiasAlertUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a bias alert"""
    alert = db.query(BiasAlert).filter(
        BiasAlert.id == uuid.UUID(alert_id),
        BiasAlert.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    update_data = alert_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(alert, key, value)
    
    alert.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    
    return BiasAlertResponse.model_validate(alert)


@router.post("/alerts/{alert_id}/trigger", response_model=BiasAlertResponse)
async def trigger_bias_alert(
    alert_id: str,
    trigger_data: BiasAlertTrigger,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Trigger a bias alert"""
    alert = db.query(BiasAlert).filter(
        BiasAlert.id == uuid.UUID(alert_id),
        BiasAlert.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_triggered = True
    alert.last_triggered_at = datetime.utcnow()
    alert.current_value = trigger_data.current_value
    alert.previous_value = trigger_data.previous_value
    alert.trigger_count = (alert.trigger_count or 0) + 1
    db.commit()
    db.refresh(alert)
    
    return BiasAlertResponse.model_validate(alert)


@router.post("/alerts/{alert_id}/acknowledge", response_model=BiasAlertResponse)
async def acknowledge_bias_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Acknowledge a bias alert"""
    alert = db.query(BiasAlert).filter(
        BiasAlert.id == uuid.UUID(alert_id),
        BiasAlert.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_triggered = False
    db.commit()
    db.refresh(alert)
    
    return BiasAlertResponse.model_validate(alert)


# =====================
# STATISTICS
# =====================

@router.get("/stats/summary")
async def get_fairness_summary(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get fairness statistics summary"""
    tenant_uuid = uuid.UUID(current_user.tenant_id)
    
    # Model cards
    total_cards = db.query(ModelCard).filter(
        ModelCard.tenant_id == tenant_uuid
    ).count()
    
    published_cards = db.query(ModelCard).filter(
        ModelCard.tenant_id == tenant_uuid,
        ModelCard.is_published == True
    ).count()
    
    # Assessments
    total_assessments = db.query(FairnessAssessment).filter(
        FairnessAssessment.tenant_id == tenant_uuid
    ).count()
    
    completed_assessments = db.query(FairnessAssessment).filter(
        FairnessAssessment.tenant_id == tenant_uuid,
        FairnessAssessment.status == AssessmentStatus.COMPLETED
    ).count()
    
    pending_assessments = db.query(FairnessAssessment).filter(
        FairnessAssessment.tenant_id == tenant_uuid,
        FairnessAssessment.status == AssessmentStatus.PENDING
    ).count()
    
    # Alerts
    triggered_alerts = db.query(BiasAlert).filter(
        BiasAlert.tenant_id == tenant_uuid,
        BiasAlert.is_triggered == True,
        BiasAlert.is_active == True
    ).count()
    
    total_alerts = db.query(BiasAlert).filter(
        BiasAlert.tenant_id == tenant_uuid,
        BiasAlert.is_active == True
    ).count()
    
    return {
        "model_cards": {
            "total": total_cards,
            "published": published_cards,
            "draft": total_cards - published_cards,
        },
        "assessments": {
            "total": total_assessments,
            "completed": completed_assessments,
            "pending": pending_assessments,
        },
        "alerts": {
            "total": total_alerts,
            "triggered": triggered_alerts,
        }
    }
