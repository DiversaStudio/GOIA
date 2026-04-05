"""
Seed data script for GOIA
Run: python -m app.seed_data
"""
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app import Base, engine
from app.config import settings

# Import all models
from app.modules.tenants.models import Tenant, TenantType
from app.modules.users.models import User, UserRole
from app.modules.regulations.models import ComplianceFramework
from app.modules.compliance.models import AISystem, RiskLevel, AISystemStatus


def create_tables():
    """Create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


def seed_compliance_frameworks(db: Session):
    """Seed compliance frameworks including Global South"""
    frameworks = [
        # EU Frameworks
        {
            "framework_name": "EU AI Act",
            "framework_code": "EU_AI_ACT",
            "description": "European Union Artificial Intelligence Act - Risk-based regulatory framework for AI systems",
            "region": "EU",
            "version": "2024",
            "rules_definition": '{"risk_levels": ["minimal", "limited", "high", "unacceptable"], "requirements": {"high": ["risk_management", "data_governance", "technical_documentation", "record_keeping", "transparency", "human_oversight", "accuracy", "robustness"]}}'
        },
        {
            "framework_name": "EU GDPR",
            "framework_code": "GDPR",
            "description": "General Data Protection Regulation - Data protection and privacy for EU citizens",
            "region": "EU",
            "version": "2018",
            "rules_definition": '{"principles": ["lawfulness", "fairness", "transparency", "purpose_limitation", "data_minimization", "accuracy", "storage_limitation", "integrity", "confidentiality"]}'
        },
        # US Frameworks
        {
            "framework_name": "NIST AI Risk Management Framework",
            "framework_code": "NIST_AI_RMF",
            "description": "National Institute of Standards and Technology AI Risk Management Framework",
            "region": "US",
            "version": "1.0",
            "rules_definition": '{"core_functions": ["govern", "map", "measure", "manage"], "characteristics": ["valid_and_reliable", "safe", "secure_and_resilient", "accountable_and_transparent", "explainable_and_interpretable", "privacy_enhanced", "fair"]}'
        },
        # UK Framework
        {
            "framework_name": "UK AI Regulation",
            "framework_code": "UK_AI_REG",
            "description": "United Kingdom pro-innovation approach to AI regulation",
            "region": "UK",
            "version": "2023",
            "rules_definition": '{"principles": ["safety_security_robustness", "transparency_explainability", "fairness", "accountability_governance", "contestability_redress"]}'
        },
        # Global South Frameworks
        {
            "framework_name": "African Union AI Strategy",
            "framework_code": "AU_AI_STRATEGY",
            "description": "African Union Continental AI Strategy - Promoting responsible AI development across Africa",
            "region": "AFRICA",
            "version": "2024",
            "rules_definition": '{"pillars": ["digital_infrastructure", "skills_development", "innovation_ecosystems", "ethical_governance"], "principles": ["inclusivity", "sovereignty", "sustainable_development", "human_rights"]}'
        },
        {
            "framework_name": "ASEAN AI Governance Guide",
            "framework_code": "ASEAN_AI_GUIDE",
            "description": "ASEAN Guide on AI Governance and Ethics - Regional framework for Southeast Asia",
            "region": "APAC",
            "version": "2024",
            "rules_definition": '{"principles": ["transparency", "fairness", "accountability", "human_centricity", "security_safety"], "focus_areas": ["capacity_building", "regional_cooperation", "innovation"]}'
        },
        {
            "framework_name": "Latin America AI Ethics Framework",
            "framework_code": "LATAM_AI_ETHICS",
            "description": "Regional framework for ethical AI in Latin America and Caribbean",
            "region": "LATAM",
            "version": "2023",
            "rules_definition": '{"principles": ["human_dignity", "equality_non_discrimination", "transparency", "accountability", "privacy", "solidarity"], "rights_based_approach": true}'
        },
        {
            "framework_name": "Brazil AI Bill",
            "framework_code": "BRAZIL_AI_BILL",
            "description": "Brazil AI Bill (PL 2338/2023) - National AI regulation",
            "region": "LATAM",
            "version": "2023",
            "rules_definition": '{"risk_classification": ["excessive", "high", "moderate"], "rights": ["explanation", "contestability", "human_review"], "principles": ["transparency", "fairness", "accountability"]}'
        },
        {
            "framework_name": "India AI Principles",
            "framework_code": "INDIA_AI",
            "description": "India Principles for Responsible AI - National AI ethics framework",
            "region": "APAC",
            "version": "2024",
            "rules_definition": '{"principles": ["safety_reliability", "equality_inclusivity", "privacy_security", "transparency_explainability", "accountability", "human_oversight"], "priority_sectors": ["healthcare", "agriculture", "education"]}'
        },
        {
            "framework_name": "South Africa AI National Policy",
            "framework_code": "SA_AI_POLICY",
            "description": "South Africa National AI Policy Framework",
            "region": "AFRICA",
            "version": "2024",
            "rules_definition": '{"pillars": ["governance", "capacity_building", "research_innovation", "public_sector_adoption"], "values": ["ubuntu", "inclusivity", "transformation"]}'
        },
    ]
    
    for fw_data in frameworks:
        existing = db.query(ComplianceFramework).filter(
            ComplianceFramework.framework_code == fw_data["framework_code"]
        ).first()
        
        if not existing:
            framework = ComplianceFramework(**fw_data)
            db.add(framework)
            print(f"  Added framework: {fw_data['framework_name']}")
    
    db.commit()
    print(f"Seeded {len(frameworks)} compliance frameworks")


def seed_tenant_and_user(db: Session):
    """Create default tenant and admin user"""
    # Check if tenant exists
    tenant = db.query(Tenant).first()
    
    if not tenant:
        tenant = Tenant(
            id=uuid.uuid4(),
            name="GOIA Demo Organization",
            domain="demo.goia.ai",
            region="GLOBAL",
            org_type=TenantType.ENTERPRISE,
            subscription_tier="enterprise",
            compliance_frameworks='["EU_AI_ACT", "GDPR", "NIST_AI_RMF", "AU_AI_STRATEGY", "ASEAN_AI_GUIDE", "LATAM_AI_ETHICS"]',
            timezone="UTC",
            status="active",
        )
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        print(f"  Created tenant: {tenant.name}")
    
    # Check if user exists
    user = db.query(User).first()
    
    if not user:
        user = User(
            id=uuid.uuid4(),
            email="admin@goia.ai",
            username="admin",
            full_name="GOIA Administrator",
            tenant_id=tenant.id,
            role=UserRole.ADMIN,
            email_verified=True,
            is_active=True,
            is_superuser=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"  Created user: {user.email}")
    
    return tenant, user


def seed_ai_systems(db: Session, tenant: Tenant, user: User):
    """Create sample AI systems"""
    ai_systems = [
        {
            "name": "Customer Service Chatbot",
            "description": "AI-powered chatbot for customer support automation",
            "vendor": "OpenAI",
            "version": "GPT-4",
            "risk_level": RiskLevel.LIMITED,
            "status": AISystemStatus.PRODUCTION,
            "model_type": "Large Language Model",
            "deployment_environment": "Cloud",
            "intended_purpose": "Automate customer support responses and query resolution",
            "tenant_id": tenant.id,
            "owner_id": user.id,
        },
        {
            "name": "Fraud Detection System",
            "description": "Real-time fraud detection for financial transactions",
            "vendor": "Internal",
            "version": "2.1.0",
            "risk_level": RiskLevel.HIGH,
            "status": AISystemStatus.PRODUCTION,
            "model_type": "Classification",
            "deployment_environment": "On-premise",
            "intended_purpose": "Detect fraudulent transactions in real-time",
            "tenant_id": tenant.id,
            "owner_id": user.id,
        },
        {
            "name": "Credit Scoring Model",
            "description": "ML model for creditworthiness assessment",
            "vendor": "Internal",
            "version": "3.0.0",
            "risk_level": RiskLevel.HIGH,
            "status": AISystemStatus.PRODUCTION,
            "model_type": "Classification",
            "deployment_environment": "Cloud",
            "intended_purpose": "Assess credit risk for loan applications",
            "tenant_id": tenant.id,
            "owner_id": user.id,
        },
        {
            "name": "Recruitment Screening AI",
            "description": "AI assistant for resume screening and candidate matching",
            "vendor": "Internal",
            "version": "1.5.0",
            "risk_level": RiskLevel.HIGH,
            "status": AISystemStatus.TESTING,
            "model_type": "NLP Classification",
            "deployment_environment": "Cloud",
            "intended_purpose": "Screen job applications and match candidates to positions",
            "tenant_id": tenant.id,
            "owner_id": user.id,
        },
        {
            "name": "Medical Imaging Diagnostic",
            "description": "AI system for medical image analysis",
            "vendor": "HealthAI Inc",
            "version": "1.0.0",
            "risk_level": RiskLevel.HIGH,
            "status": AISystemStatus.TESTING,
            "model_type": "Computer Vision",
            "deployment_environment": "On-premise",
            "intended_purpose": "Assist radiologists in diagnosing medical conditions from imaging",
            "tenant_id": tenant.id,
            "owner_id": user.id,
        },
    ]
    
    for sys_data in ai_systems:
        existing = db.query(AISystem).filter(
            AISystem.name == sys_data["name"],
            AISystem.tenant_id == tenant.id
        ).first()
        
        if not existing:
            ai_system = AISystem(**sys_data)
            db.add(ai_system)
            print(f"  Added AI System: {sys_data['name']}")
    
    db.commit()
    print(f"Seeded AI systems")


def run_seed():
    """Run all seed functions"""
    print("\n" + "="*50)
    print("GOIA Database Seeding")
    print("="*50 + "\n")
    
    # Create tables first
    create_tables()
    
    # Create session
    SessionLocal = __import__('dal', fromlist=['SessionLocal']).SessionLocal
    db = SessionLocal()
    
    try:
        print("\n1. Seeding compliance frameworks...")
        seed_compliance_frameworks(db)
        
        print("\n2. Seeding tenant and user...")
        tenant, user = seed_tenant_and_user(db)
        
        print("\n3. Seeding AI systems...")
        seed_ai_systems(db, tenant, user)
        
        print("\n" + "="*50)
        print("Seeding completed successfully!")
        print("="*50 + "\n")
        
    except Exception as e:
        print(f"\nError during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
