"""
Enhanced Privacy Routes (Pillar 2) - Privacy & Data Governance
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import uuid

from dal import get_db
from app.core.deps import get_current_user, CurrentUser
from app.modules.privacy.models import (
    DataFlowDeclaration, DPIA, DataSubjectRequest,
    DPIAStatus, DataSubjectRequestType, RequestStatus
)
from app.schemas.privacy import (
    DataFlowCreate, DataFlowUpdate, DataFlowResponse, DataFlowListResponse, DataFlowApprove,
    DPIACreate, DPIAUpdate, DPIAResponse, DPIAListResponse,
    DataSubjectRequestCreate, DataSubjectRequestUpdate, DataSubjectRequestResponse,
    DataSubjectRequestListResponse, DataSubjectRequestComplete
)


router = APIRouter(tags=["Privacy & Data Governance"])


# =====================
# DATA FLOW DECLARATIONS
# =====================

@router.get("/data-flows", response_model=DataFlowListResponse)
async def list_data_flows(
    ai_system_id: Optional[str] = None,
    is_approved: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List data flow declarations"""
    query = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(DataFlowDeclaration.ai_system_id == uuid.UUID(ai_system_id))
    if is_approved is not None:
        query = query.filter(DataFlowDeclaration.is_approved == is_approved)
    
    total = query.count()
    flows = query.order_by(DataFlowDeclaration.created_at.desc()).offset(skip).limit(limit).all()
    
    return DataFlowListResponse(
        total=total,
        items=[DataFlowResponse.model_validate(f) for f in flows]
    )


@router.get("/data-flows/{flow_id}", response_model=DataFlowResponse)
async def get_data_flow(
    flow_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific data flow declaration"""
    flow = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.id == uuid.UUID(flow_id),
        DataFlowDeclaration.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Data flow not found")
    
    return DataFlowResponse.model_validate(flow)


@router.post("/data-flows", response_model=DataFlowResponse, status_code=status.HTTP_201_CREATED)
async def create_data_flow(
    flow_data: DataFlowCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a data flow declaration"""
    flow = DataFlowDeclaration(
        **flow_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(flow)
    db.commit()
    db.refresh(flow)
    
    return DataFlowResponse.model_validate(flow)


@router.patch("/data-flows/{flow_id}", response_model=DataFlowResponse)
async def update_data_flow(
    flow_id: str,
    flow_data: DataFlowUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a data flow declaration"""
    flow = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.id == uuid.UUID(flow_id),
        DataFlowDeclaration.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Data flow not found")
    
    update_data = flow_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(flow, key, value)
    
    flow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(flow)
    
    return DataFlowResponse.model_validate(flow)


@router.post("/data-flows/{flow_id}/approve", response_model=DataFlowResponse)
async def approve_data_flow(
    flow_id: str,
    approval_data: DataFlowApprove,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Approve a data flow declaration"""
    flow = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.id == uuid.UUID(flow_id),
        DataFlowDeclaration.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Data flow not found")
    
    flow.is_approved = True
    flow.approved_by = approval_data.approver_id
    flow.approved_at = datetime.utcnow()
    db.commit()
    db.refresh(flow)
    
    return DataFlowResponse.model_validate(flow)


@router.delete("/data-flows/{flow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_data_flow(
    flow_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Delete a data flow declaration"""
    flow = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.id == uuid.UUID(flow_id),
        DataFlowDeclaration.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not flow:
        raise HTTPException(status_code=404, detail="Data flow not found")
    
    db.delete(flow)
    db.commit()
    
    return None


# =====================
# DPIA
# =====================

@router.get("/dpias", response_model=DPIAListResponse)
async def list_dpias(
    ai_system_id: Optional[str] = None,
    status: Optional[DPIAStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List DPIAs"""
    query = db.query(DPIA).filter(
        DPIA.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if ai_system_id:
        query = query.filter(DPIA.ai_system_id == uuid.UUID(ai_system_id))
    if status:
        query = query.filter(DPIA.status == status)
    
    total = query.count()
    dpias = query.order_by(DPIA.created_at.desc()).offset(skip).limit(limit).all()
    
    return DPIAListResponse(
        total=total,
        items=[DPIAResponse.model_validate(d) for d in dpias]
    )


@router.get("/dpias/{dpia_id}", response_model=DPIAResponse)
async def get_dpia(
    dpia_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific DPIA"""
    dpia = db.query(DPIA).filter(
        DPIA.id == uuid.UUID(dpia_id),
        DPIA.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not dpia:
        raise HTTPException(status_code=404, detail="DPIA not found")
    
    return DPIAResponse.model_validate(dpia)


@router.post("/dpias", response_model=DPIAResponse, status_code=status.HTTP_201_CREATED)
async def create_dpia(
    dpia_data: DPIACreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a DPIA"""
    dpia = DPIA(
        **dpia_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(dpia)
    db.commit()
    db.refresh(dpia)
    
    return DPIAResponse.model_validate(dpia)


@router.patch("/dpias/{dpia_id}", response_model=DPIAResponse)
async def update_dpia(
    dpia_id: str,
    dpia_data: DPIAUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a DPIA"""
    dpia = db.query(DPIA).filter(
        DPIA.id == uuid.UUID(dpia_id),
        DPIA.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not dpia:
        raise HTTPException(status_code=404, detail="DPIA not found")
    
    update_data = dpia_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(dpia, key, value)
    
    dpia.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(dpia)
    
    return DPIAResponse.model_validate(dpia)


# =====================
# DATA SUBJECT REQUESTS
# =====================

@router.get("/subject-requests", response_model=DataSubjectRequestListResponse)
async def list_subject_requests(
    request_type: Optional[DataSubjectRequestType] = None,
    status: Optional[RequestStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """List data subject requests"""
    query = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.tenant_id == uuid.UUID(current_user.tenant_id)
    )
    
    if request_type:
        query = query.filter(DataSubjectRequest.request_type == request_type)
    if status:
        query = query.filter(DataSubjectRequest.status == status)
    
    total = query.count()
    requests = query.order_by(DataSubjectRequest.created_at.desc()).offset(skip).limit(limit).all()
    
    return DataSubjectRequestListResponse(
        total=total,
        items=[DataSubjectRequestResponse.model_validate(r) for r in requests]
    )


@router.get("/subject-requests/{request_id}", response_model=DataSubjectRequestResponse)
async def get_subject_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a specific data subject request"""
    request = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.id == uuid.UUID(request_id),
        DataSubjectRequest.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return DataSubjectRequestResponse.model_validate(request)


@router.post("/subject-requests", response_model=DataSubjectRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_subject_request(
    request_data: DataSubjectRequestCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a data subject request"""
    request = DataSubjectRequest(
        **request_data.model_dump(),
        tenant_id=uuid.UUID(current_user.tenant_id)
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    
    return DataSubjectRequestResponse.model_validate(request)


@router.patch("/subject-requests/{request_id}", response_model=DataSubjectRequestResponse)
async def update_subject_request(
    request_id: str,
    request_data: DataSubjectRequestUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update a data subject request"""
    request = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.id == uuid.UUID(request_id),
        DataSubjectRequest.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    update_data = request_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(request, key, value)
    
    request.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(request)
    
    return DataSubjectRequestResponse.model_validate(request)


@router.post("/subject-requests/{request_id}/complete", response_model=DataSubjectRequestResponse)
async def complete_subject_request(
    request_id: str,
    completion_data: DataSubjectRequestComplete,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Complete a data subject request"""
    request = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.id == uuid.UUID(request_id),
        DataSubjectRequest.tenant_id == uuid.UUID(current_user.tenant_id)
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request.status = RequestStatus.COMPLETED
    request.completed_at = datetime.utcnow()
    request.response_summary = completion_data.summary
    request.response_data = completion_data.data or {}
    db.commit()
    db.refresh(request)
    
    return DataSubjectRequestResponse.model_validate(request)


# =====================
# STATISTICS
# =====================

@router.get("/stats/summary")
async def get_privacy_summary(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get privacy statistics summary"""
    tenant_uuid = uuid.UUID(current_user.tenant_id)
    
    # Data flows
    total_flows = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.tenant_id == tenant_uuid
    ).count()
    
    approved_flows = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.tenant_id == tenant_uuid,
        DataFlowDeclaration.is_approved == True
    ).count()
    
    # DPIAs
    total_dpias = db.query(DPIA).filter(
        DPIA.tenant_id == tenant_uuid
    ).count()
    
    approved_dpias = db.query(DPIA).filter(
        DPIA.tenant_id == tenant_uuid,
        DPIA.status == DPIAStatus.APPROVED
    ).count()
    
    pending_dpias = db.query(DPIA).filter(
        DPIA.tenant_id == tenant_uuid,
        DPIA.status.in_([DPIAStatus.DRAFT, DPIAStatus.IN_REVIEW])
    ).count()
    
    # Subject requests
    total_requests = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.tenant_id == tenant_uuid
    ).count()
    
    pending_requests = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.tenant_id == tenant_uuid,
        DataSubjectRequest.status.in_([RequestStatus.PENDING, RequestStatus.IN_PROGRESS])
    ).count()
    
    return {
        "data_flows": {
            "total": total_flows,
            "approved": approved_flows,
            "pending_approval": total_flows - approved_flows,
        },
        "dpias": {
            "total": total_dpias,
            "approved": approved_dpias,
            "pending": pending_dpias,
        },
        "subject_requests": {
            "total": total_requests,
            "pending": pending_requests,
        }
    }
