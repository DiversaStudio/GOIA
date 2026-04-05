from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from dal import get_db
from app.modules.privacy.models import (
    DataFlowDeclaration,
    DPIA,
    DataSubjectRequest,
    DPIAStatus,
    DataSubjectRequestType,
    RequestStatus,
)


router = APIRouter(tags=["Privacy & Data Governance"])


# =====================
# DATA FLOW DECLARATIONS
# =====================

@router.get("/data-flows")
async def list_data_flows(
    ai_system_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List data flow declarations"""
    query = db.query(DataFlowDeclaration)
    if ai_system_id:
        query = query.filter(DataFlowDeclaration.ai_system_id == ai_system_id)
    flows = query.offset(skip).limit(limit).all()
    return {"total": len(flows), "items": [f.to_dict() for f in flows]}


@router.get("/data-flows/{flow_id}")
async def get_data_flow(
    flow_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific data flow declaration"""
    flow = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.id == flow_id
    ).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Data flow not found")
    return flow.to_dict()


@router.post("/data-flows")
async def create_data_flow(
    flow_data: dict,
    db: Session = Depends(get_db)
):
    """Create a data flow declaration"""
    flow = DataFlowDeclaration(**flow_data)
    db.add(flow)
    db.commit()
    db.refresh(flow)
    return flow.to_dict()


@router.patch("/data-flows/{flow_id}")
async def update_data_flow(
    flow_id: str,
    flow_data: dict,
    db: Session = Depends(get_db)
):
    """Update a data flow declaration"""
    flow = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.id == flow_id
    ).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Data flow not found")
    
    for key, value in flow_data.items():
        if hasattr(flow, key):
            setattr(flow, key, value)
    flow.updated_at = datetime.utcnow()
    db.commit()
    return flow.to_dict()


@router.post("/data-flows/{flow_id}/approve")
async def approve_data_flow(
    flow_id: str,
    approver_id: str,
    db: Session = Depends(get_db)
):
    """Approve a data flow declaration"""
    flow = db.query(DataFlowDeclaration).filter(
        DataFlowDeclaration.id == flow_id
    ).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Data flow not found")
    
    flow.is_approved = True
    flow.approved_by = approver_id
    flow.approved_at = datetime.utcnow()
    db.commit()
    return {"message": "Data flow approved", "flow": flow.to_dict()}


# =====================
# DPIA (DATA PROTECTION IMPACT ASSESSMENT)
# =====================

@router.get("/dpias")
async def list_dpias(
    ai_system_id: Optional[str] = None,
    status: Optional[DPIAStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List DPIAs"""
    query = db.query(DPIA)
    if ai_system_id:
        query = query.filter(DPIA.ai_system_id == ai_system_id)
    if status:
        query = query.filter(DPIA.status == status)
    dpias = query.offset(skip).limit(limit).all()
    return {"total": len(dpias), "items": [d.to_dict() for d in dpias]}


@router.get("/dpias/{dpia_id}")
async def get_dpia(
    dpia_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific DPIA"""
    dpia = db.query(DPIA).filter(DPIA.id == dpia_id).first()
    if not dpia:
        raise HTTPException(status_code=404, detail="DPIA not found")
    return dpia.to_dict()


@router.post("/dpias")
async def create_dpia(
    dpia_data: dict,
    db: Session = Depends(get_db)
):
    """Create a DPIA"""
    dpia = DPIA(**dpia_data)
    db.add(dpia)
    db.commit()
    db.refresh(dpia)
    return dpia.to_dict()


@router.patch("/dpias/{dpia_id}")
async def update_dpia(
    dpia_id: str,
    dpia_data: dict,
    db: Session = Depends(get_db)
):
    """Update a DPIA"""
    dpia = db.query(DPIA).filter(DPIA.id == dpia_id).first()
    if not dpia:
        raise HTTPException(status_code=404, detail="DPIA not found")
    
    for key, value in dpia_data.items():
        if hasattr(dpia, key):
            setattr(dpia, key, value)
    dpia.updated_at = datetime.utcnow()
    db.commit()
    return dpia.to_dict()


# =====================
# DATA SUBJECT REQUESTS
# =====================

@router.get("/subject-requests")
async def list_subject_requests(
    request_type: Optional[DataSubjectRequestType] = None,
    status: Optional[RequestStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List data subject requests"""
    query = db.query(DataSubjectRequest)
    if request_type:
        query = query.filter(DataSubjectRequest.request_type == request_type)
    if status:
        query = query.filter(DataSubjectRequest.status == status)
    requests = query.offset(skip).limit(limit).all()
    return {"total": len(requests), "items": [r.to_dict() for r in requests]}


@router.get("/subject-requests/{request_id}")
async def get_subject_request(
    request_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific data subject request"""
    request = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.id == request_id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request.to_dict()


@router.post("/subject-requests")
async def create_subject_request(
    request_data: dict,
    db: Session = Depends(get_db)
):
    """Create a data subject request"""
    request = DataSubjectRequest(**request_data)
    db.add(request)
    db.commit()
    db.refresh(request)
    return request.to_dict()


@router.patch("/subject-requests/{request_id}")
async def update_subject_request(
    request_id: str,
    request_data: dict,
    db: Session = Depends(get_db)
):
    """Update a data subject request"""
    request = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.id == request_id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    for key, value in request_data.items():
        if hasattr(request, key):
            setattr(request, key, value)
    request.updated_at = datetime.utcnow()
    db.commit()
    return request.to_dict()


@router.post("/subject-requests/{request_id}/complete")
async def complete_subject_request(
    request_id: str,
    response_data: dict,
    db: Session = Depends(get_db)
):
    """Complete a data subject request"""
    request = db.query(DataSubjectRequest).filter(
        DataSubjectRequest.id == request_id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    request.status = RequestStatus.COMPLETED
    request.completed_at = datetime.utcnow()
    request.response_summary = response_data.get("summary", "")
    request.response_data = response_data.get("data", {})
    db.commit()
    return {"message": "Request completed", "request": request.to_dict()}
