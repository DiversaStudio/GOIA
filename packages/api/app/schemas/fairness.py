"""
Bias & Fairness module schemas (Pillar 3)
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# =====================
# MODEL CARDS
# =====================

class ModelCardBase(BaseModel):
    """Base model card fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    model_name: str = Field(..., min_length=1, max_length=255, description="Model name")
    model_description: Optional[str] = Field(None, description="Model description")
    model_version: Optional[str] = Field(None, max_length=50)
    model_architecture: Optional[str] = Field(None, description="Model architecture")
    training_data: Optional[str] = Field(None, description="Training data description")
    training_data_size: Optional[int] = Field(None, description="Training data size")
    validation_data: Optional[str] = Field(None, description="Validation data description")
    testing_data: Optional[str] = Field(None, description="Testing data description")
    performance_metrics: Dict[str, float] = Field(default_factory=dict, description="Performance metrics")
    limitations: List[str] = Field(default_factory=list, description="Model limitations")
    ethical_considerations: List[str] = Field(default_factory=list, description="Ethical considerations")
    intended_uses: List[str] = Field(default_factory=list, description="Intended uses")
    out_of_scope_uses: List[str] = Field(default_factory=list, description="Out of scope uses")
    fairness_metrics: Dict[str, float] = Field(default_factory=dict, description="Fairness metrics")
    bias_mitigation: List[str] = Field(default_factory=list, description="Bias mitigation strategies")


class ModelCardCreate(ModelCardBase):
    """Schema for creating a model card"""
    tenant_id: str = Field(..., description="Tenant ID")


class ModelCardUpdate(BaseModel):
    """Schema for updating a model card"""
    model_name: Optional[str] = Field(None, min_length=1, max_length=255)
    model_description: Optional[str] = None
    model_version: Optional[str] = Field(None, max_length=50)
    model_architecture: Optional[str] = None
    training_data: Optional[str] = None
    training_data_size: Optional[int] = None
    validation_data: Optional[str] = None
    testing_data: Optional[str] = None
    performance_metrics: Optional[Dict[str, float]] = None
    limitations: Optional[List[str]] = None
    ethical_considerations: Optional[List[str]] = None
    intended_uses: Optional[List[str]] = None
    out_of_scope_uses: Optional[List[str]] = None
    fairness_metrics: Optional[Dict[str, float]] = None
    bias_mitigation: Optional[List[str]] = None


class ModelCardResponse(ModelCardBase):
    """Model card response"""
    id: str
    tenant_id: str
    is_published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ModelCardListResponse(BaseModel):
    """Paginated model cards list"""
    total: int
    items: List[ModelCardResponse]


# =====================
# FAIRNESS ASSESSMENTS
# =====================

class FairnessAssessmentStatus(str, Enum):
    """Fairness assessment status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class FairnessMetric(str, Enum):
    """Fairness metrics"""
    DEMOGRAPHIC_PARITY = "demographic_parity"
    EQUALIZED_ODDS = "equalized_odds"
    EQUAL_OPPORTUNITY = "equal_opportunity"
    DISPARATE_IMPACT = "disparate_impact"
    CALIBRATION = "calibration"


class FairnessAssessmentBase(BaseModel):
    """Base fairness assessment fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    model_card_id: Optional[str] = Field(None, description="Related model card")
    protected_attributes: List[str] = Field(default_factory=list, description="Protected attributes (e.g., gender, race)")
    metrics_evaluated: List[FairnessMetric] = Field(default_factory=list, description="Metrics evaluated")
    threshold: Dict[str, float] = Field(default_factory=dict, description="Fairness thresholds")
    dataset_info: Optional[str] = Field(None, description="Dataset used for assessment")


class FairnessAssessmentCreate(FairnessAssessmentBase):
    """Schema for creating a fairness assessment"""
    tenant_id: str = Field(..., description="Tenant ID")


class FairnessAssessmentUpdate(BaseModel):
    """Schema for updating a fairness assessment"""
    status: Optional[FairnessAssessmentStatus] = None
    protected_attributes: Optional[List[str]] = None
    metrics_evaluated: Optional[List[FairnessMetric]] = None
    threshold: Optional[Dict[str, float]] = None
    dataset_info: Optional[str] = None


class FairnessAssessmentResponse(FairnessAssessmentBase):
    """Fairness assessment response"""
    id: str
    tenant_id: str
    status: FairnessAssessmentStatus = FairnessAssessmentStatus.PENDING
    overall_fairness_score: float = 0.0
    is_fair: bool = True
    metric_results: Dict[str, float] = Field(default_factory=dict, description="Metric results")
    findings: List[Dict[str, Any]] = Field(default_factory=list, description="Findings")
    recommendations: List[str] = Field(default_factory=list, description="Recommendations")
    assessment_date: Optional[datetime] = None
    assessor_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FairnessAssessmentListResponse(BaseModel):
    """Paginated fairness assessments list"""
    total: int
    items: List[FairnessAssessmentResponse]


class FairnessAssessmentComplete(BaseModel):
    """Schema for completing a fairness assessment"""
    score: float = Field(..., ge=0, le=100, description="Overall fairness score")
    is_fair: bool = Field(..., description="Is the model fair?")
    findings: List[Dict[str, Any]] = Field(default_factory=list, description="Findings")
    recommendations: List[str] = Field(default_factory=list, description="Recommendations")


# =====================
# BIAS ALERTS
# =====================

class AlertSeverity(str, Enum):
    """Alert severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class BiasAlertBase(BaseModel):
    """Base bias alert fields"""
    ai_system_id: str = Field(..., description="AI System ID")
    metric_name: str = Field(..., min_length=1, max_length=255, description="Metric being monitored")
    metric_description: Optional[str] = Field(None, description="Metric description")
    threshold: float = Field(..., description="Alert threshold")
    comparison_operator: str = Field("greater_than", description="Comparison operator")
    severity: AlertSeverity = Field(AlertSeverity.MEDIUM, description="Alert severity")
    protected_attribute: Optional[str] = Field(None, description="Protected attribute being monitored")
    notification_channels: List[str] = Field(default_factory=list, description="Notification channels")


class BiasAlertCreate(BiasAlertBase):
    """Schema for creating a bias alert"""
    tenant_id: str = Field(..., description="Tenant ID")


class BiasAlertUpdate(BaseModel):
    """Schema for updating a bias alert"""
    metric_name: Optional[str] = Field(None, min_length=1, max_length=255)
    metric_description: Optional[str] = None
    threshold: Optional[float] = None
    comparison_operator: Optional[str] = None
    severity: Optional[AlertSeverity] = None
    protected_attribute: Optional[str] = None
    notification_channels: Optional[List[str]] = None
    is_active: Optional[bool] = None


class BiasAlertResponse(BiasAlertBase):
    """Bias alert response"""
    id: str
    tenant_id: str
    is_active: bool = True
    is_triggered: bool = False
    current_value: Optional[float] = None
    previous_value: Optional[float] = None
    last_triggered_at: Optional[datetime] = None
    trigger_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BiasAlertListResponse(BaseModel):
    """Paginated bias alerts list"""
    total: int
    items: List[BiasAlertResponse]


class BiasAlertTrigger(BaseModel):
    """Schema for triggering a bias alert"""
    current_value: float = Field(..., description="Current metric value")
    previous_value: Optional[float] = Field(None, description="Previous metric value")
