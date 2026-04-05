from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config import settings
from starlette.requests import Request

# Import all routers
from app.modules.users.api.routes import router as users_router
from app.modules.auth.api.routes import router as auth_router
from app.modules.regulations.router import router as regulations_router

# Import enhanced routes for the 4 pillars (with schemas and auth)
from app.modules.compliance.routes_enhanced import router as compliance_router
from app.modules.privacy.routes_enhanced import router as privacy_router
from app.modules.fairness.routes_enhanced import router as fairness_router
from app.modules.audit.routes_enhanced import router as audit_router


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title="GOIA - AI Governance Platform",
        description="Global AI Oversight Initiative - Compliance, Privacy, Fairness, and Observability",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            origin.strip() for origin in 
            settings.ALLOWED_ORIGINS.split(",")
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Trusted hosts for development
    if settings.TRUST_HOSTS:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=["*"],
        )
    
    # Include routers - Auth & Users
    app.include_router(auth_router, prefix="/api/v1/auth")
    app.include_router(users_router, prefix="/api/v1/users")
    
    # Include routers - 4 Pillars
    app.include_router(regulations_router, prefix="/api/v1/regulations")
    app.include_router(compliance_router, prefix="/api/v1/compliance")
    app.include_router(privacy_router, prefix="/api/v1/privacy")
    app.include_router(fairness_router, prefix="/api/v1/fairness")
    app.include_router(audit_router, prefix="/api/v1/audit")
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": "1.0.0"}
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {"message": "GOIA API v1", "docs": "/docs"}
    
    # API version check
    @app.get("/api/v1")
    async def api_version():
        return {
            "version": "v1",
            "status": "active",
            "endpoints": {
                "auth": "/api/v1/auth",
                "users": "/api/v1/users",
                "compliance": "/api/v1/compliance",
                "privacy": "/api/v1/privacy",
                "fairness": "/api/v1/fairness",
                "audit": "/api/v1/audit",
            }
        }
    
    # Middleware for request logging (optional)
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        response = await call_next(request)
        return response
    
    return app

# Create application instance
app = create_app()
