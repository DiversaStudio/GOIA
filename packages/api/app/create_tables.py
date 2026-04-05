"""
Create missing database tables for GOIA
Run: docker compose exec backend python -m app.create_tables
"""
from app import Base, engine

# Import all models to ensure they're registered
from app.modules.tenants.models import Tenant
from app.modules.users.models import User
from app.modules.regulations.models import ComplianceFramework
from app.modules.compliance.models import AISystem, ComplianceRecord, RiskAssessment
from app.modules.privacy.models import DataFlowDeclaration, DPIA, DataSubjectRequest
from app.modules.fairness.models import ModelCard, FairnessAssessment, BiasAlert
from app.modules.audit.models import AuditLog, EvidenceVault, SystemHealth


def create_all_tables():
    """Create all tables"""
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
    
    # List all tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\nCreated {len(tables)} tables:")
    for table in sorted(tables):
        print(f"  - {table}")


if __name__ == "__main__":
    create_all_tables()
