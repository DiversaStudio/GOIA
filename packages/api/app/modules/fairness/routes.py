from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from dal import get_db
from app.modules.fairness.models import (
    ModelCard,
    FairnessAssessment,
    BiasAlert,
    AssessmentStatus,
    AlertSeverity,
)


router = APIRouter(tags=["Bias & Fairness"])


# =====================
# MODEL CARDS
# =====================

@router.get("/model-cards")
async def list_model_cards(
    ai_system_id: Optional[str] = None,
    is_published: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List model cards"""
    query = db.query(ModelCard)
    if ai_system_id:
        query = query.filter(ModelCard.ai_system_id == ai_system_id)
    if is_published is not None:
        query = query.filter(ModelCard.is_published == is_published)
    cards = query.offset(skip).limit(limit).all()
    return {"total": len(cards), "items": [c.to_dict() for c in cards]}


@router.get("/model-cards/{card_id}")
async def get_model_card(
    card_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific model card"""
    card = db.query(ModelCard).filter(ModelCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Model card not found")
    return card.to_dict()


@router.post("/model-cards")
async def create_model_card(
    card_data: dict,
    db: Session = Depends(get_db)
):
    """Create a model card"""
    card = ModelCard(**card_data)
    db.add(card)
    db.commit()
    db.refresh(card)
    return card.to_dict()


@router.patch("/model-cards/{card_id}")
async def update_model_card(
    card_id: str,
    card_data: dict,
    db: Session = Depends(get_db)
):
    """Update a model card"""
    card = db.query(ModelCard).filter(ModelCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Model card not found")
    
    for key, value in card_data.items():
        if hasattr(card, key):
            setattr(card, key, value)
    card.updated_at = datetime.utcnow()
    db.commit()
    return card.to_dict()


@router.post("/model-cards/{card_id}/publish")
async def publish_model_card(
    card_id: str,
    db: Session = Depends(get_db)
):
    """Publish a model card"""
    card = db.query(ModelCard).filter(ModelCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Model card not found")
    
    card.is_published = True
    card.published_at = datetime.utcnow()
    db.commit()
    return {"message": "Model card published", "card": card.to_dict()}


# =====================
# FAIRNESS ASSESSMENTS
# =====================

@router.get("/assessments")
async def list_fairness_assessments(
    ai_system_id: Optional[str] = None,
    status: Optional[AssessmentStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List fairness assessments"""
    query = db.query(FairnessAssessment)
    if ai_system_id:
        query = query.filter(FairnessAssessment.ai_system_id == ai_system_id)
    if status:
        query = query.filter(FairnessAssessment.status == status)
    assessments = query.offset(skip).limit(limit).all()
    return {"total": len(assessments), "items": [a.to_dict() for a in assessments]}


@router.get("/assessments/{assessment_id}")
async def get_fairness_assessment(
    assessment_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific fairness assessment"""
    assessment = db.query(FairnessAssessment).filter(
        FairnessAssessment.id == assessment_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment.to_dict()


@router.post("/assessments")
async def create_fairness_assessment(
    assessment_data: dict,
    db: Session = Depends(get_db)
):
    """Create a fairness assessment"""
    assessment = FairnessAssessment(**assessment_data)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment.to_dict()


@router.patch("/assessments/{assessment_id}")
async def update_fairness_assessment(
    assessment_id: str,
    assessment_data: dict,
    db: Session = Depends(get_db)
):
    """Update a fairness assessment"""
    assessment = db.query(FairnessAssessment).filter(
        FairnessAssessment.id == assessment_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    for key, value in assessment_data.items():
        if hasattr(assessment, key):
            setattr(assessment, key, value)
    assessment.updated_at = datetime.utcnow()
    db.commit()
    return assessment.to_dict()


@router.post("/assessments/{assessment_id}/complete")
async def complete_fairness_assessment(
    assessment_id: str,
    completion_data: dict,
    db: Session = Depends(get_db)
):
    """Complete a fairness assessment"""
    assessment = db.query(FairnessAssessment).filter(
        FairnessAssessment.id == assessment_id
    ).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    assessment.status = AssessmentStatus.COMPLETED
    assessment.assessment_date = datetime.utcnow()
    assessment.overall_fairness_score = completion_data.get("score", 0.0)
    assessment.is_fair = completion_data.get("is_fair", True)
    assessment.findings = completion_data.get("findings", [])
    assessment.recommendations = completion_data.get("recommendations", [])
    db.commit()
    return {"message": "Assessment completed", "assessment": assessment.to_dict()}


# =====================
# BIAS ALERTS
# =====================

@router.get("/alerts")
async def list_bias_alerts(
    ai_system_id: Optional[str] = None,
    severity: Optional[AlertSeverity] = None,
    is_triggered: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List bias alerts"""
    query = db.query(BiasAlert).filter(BiasAlert.is_active == True)
    if ai_system_id:
        query = query.filter(BiasAlert.ai_system_id == ai_system_id)
    if severity:
        query = query.filter(BiasAlert.severity == severity)
    if is_triggered is not None:
        query = query.filter(BiasAlert.is_triggered == is_triggered)
    alerts = query.offset(skip).limit(limit).all()
    return {"total": len(alerts), "items": [a.to_dict() for a in alerts]}


@router.get("/alerts/{alert_id}")
async def get_bias_alert(
    alert_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific bias alert"""
    alert = db.query(BiasAlert).filter(BiasAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert.to_dict()


@router.post("/alerts")
async def create_bias_alert(
    alert_data: dict,
    db: Session = Depends(get_db)
):
    """Create a bias alert configuration"""
    alert = BiasAlert(**alert_data)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert.to_dict()


@router.patch("/alerts/{alert_id}")
async def update_bias_alert(
    alert_id: str,
    alert_data: dict,
    db: Session = Depends(get_db)
):
    """Update a bias alert"""
    alert = db.query(BiasAlert).filter(BiasAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    for key, value in alert_data.items():
        if hasattr(alert, key):
            setattr(alert, key, value)
    alert.updated_at = datetime.utcnow()
    db.commit()
    return alert.to_dict()


@router.post("/alerts/{alert_id}/trigger")
async def trigger_bias_alert(
    alert_id: str,
    trigger_data: dict,
    db: Session = Depends(get_db)
):
    """Trigger a bias alert"""
    alert = db.query(BiasAlert).filter(BiasAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_triggered = True
    alert.last_triggered_at = datetime.utcnow()
    alert.current_value = trigger_data.get("current_value")
    alert.previous_value = trigger_data.get("previous_value")
    db.commit()
    return {"message": "Alert triggered", "alert": alert.to_dict()}


@router.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_bias_alert(
    alert_id: str,
    db: Session = Depends(get_db)
):
    """Acknowledge a bias alert"""
    alert = db.query(BiasAlert).filter(BiasAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_triggered = False
    db.commit()
    return {"message": "Alert acknowledged", "alert": alert.to_dict()}
