"""
Common schemas shared across modules
"""
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List, Optional
from datetime import datetime
from enum import Enum

T = TypeVar('T')


# =====================
# PAGINATION
# =====================

class PaginationParams(BaseModel):
    """Pagination query parameters"""
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(100, ge=1, le=1000, description="Max records to return")


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper"""
    total: int = Field(..., description="Total number of records")
    skip: int = Field(0, description="Records skipped")
    limit: int = Field(100, description="Limit applied")
    items: List[T] = Field(default_factory=list, description="List of items")


# =====================
# COMMON ENUMS
# =====================

class RiskLevel(str, Enum):
    """AI System risk levels based on EU AI Act"""
    MINIMAL = "minimal"
    LIMITED = "limited"
    HIGH = "high"
    UNACCEPTABLE = "unacceptable"


class AISystemStatus(str, Enum):
    """AI System operational status"""
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"
    DECOMMISSIONED = "decommissioned"


class AssessmentStatus(str, Enum):
    """Generic assessment status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class ComplianceStatus(str, Enum):
    """Compliance status"""
    PENDING = "pending"
    IN_REVIEW = "in_review"
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"


# =====================
# BASE SCHEMAS
# =====================

class BaseResponse(BaseModel):
    """Base response with common fields"""
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class MessageResponse(BaseModel):
    """Simple message response"""
    message: str
    detail: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None


# =====================
# SEARCH/FILTER
# =====================

class SearchParams(BaseModel):
    """Common search parameters"""
    search: Optional[str] = Field(None, description="Search query string")
    sort_by: Optional[str] = Field(None, description="Field to sort by")
    sort_order: Optional[str] = Field("desc", description="Sort order: asc or desc")
