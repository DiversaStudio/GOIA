"""
Seed script for GOIA - Creates sample data for all modules
Run: docker compose exec backend python -m app.seed
"""
from app import SessionLocal
from app.modules.compliance.models import AISystem, ComplianceRecord, RiskAssessment
from app.modules.privacy.models import DataFlowDeclaration, DPIA, DataSubjectRequest
from app.modules.fairness.models import ModelCard, FairnessAssessment, BiasAlert
from app.modules.audit.models import AuditLog, EvidenceVault, SystemHealth
from app.modules.regulations.models import ComplianceFramework
from app.modules.tenants.models import Tenant
from app.modules.users.models import User
from datetime import datetime, timedelta
import uuid
import random

def seed_all():
    db = SessionLocal()
    
    try:
        # Get existing tenant and user
        tenant = db.query(Tenant).first()
        user = db.query(User).first()
        
        if not tenant or not user:
            print("Error: No tenant or user found. Please run initial migrations first.")
            return
        
        tenant_id = tenant.id
        user_id = user.id
        
        print(f"Using tenant: {tenant.name} ({tenant_id})")
        print(f"Using user: {user.email} ({user_id})")
        
        # Get existing AI systems
        ai_systems = db.query(AISystem).filter(AISystem.tenant_id == tenant_id).all()
        print(f"Found {len(ai_systems)} AI systems")
        
        if not ai_systems:
            print("No AI systems found. Please seed AI systems first.")
            return
        
        # 1. Seed Risk Assessments
        print("\n--- Seeding Risk Assessments ---")
        for ai_system in ai_systems:
            existing = db.query(RiskAssessment).filter(
                RiskAssessment.ai_system_id == ai_system.id
            ).first()
            
            if not existing:
                risk_assessment = RiskAssessment(
                    ai_system_id=ai_system.id,
                    tenant_id=tenant_id,
                    validated_by=user_id,
                    risk_level=ai_system.risk_level,
                    overall_risk_score=random.uniform(0.3, 0.9),
                    privacy_risk_score=random.uniform(0.2, 0.8),
                    fairness_risk_score=random.uniform(0.1, 0.7),
                    security_risk_score=random.uniform(0.2, 0.6),
                    transparency_risk_score=random.uniform(0.1, 0.5),
                    assessment_responses={
                        "q1": {"question": "Does the system process personal data?", "answer": "Yes"},
                        "q2": {"question": "Are there automated decisions?", "answer": "Yes"},
                    },
                    risk_mitigations=[
                        {"measure": "Data minimization", "status": "implemented"},
                        {"measure": "Regular bias audits", "status": "planned"},
                    ],
                    is_validated=random.choice([True, False]),
                )
                db.add(risk_assessment)
                print(f"  Created risk assessment for: {ai_system.name}")
        
        # 2. Seed Compliance Records
        print("\n--- Seeding Compliance Records ---")
        frameworks = db.query(ComplianceFramework).limit(5).all()
        
        for ai_system in ai_systems[:3]:  # Only for first 3 systems
            for framework in frameworks[:2]:  # 2 frameworks per system
                existing = db.query(ComplianceRecord).filter(
                    ComplianceRecord.ai_system_id == ai_system.id,
                    ComplianceRecord.framework_id == framework.id
                ).first()
                
                if not existing:
                    compliance_record = ComplianceRecord(
                        ai_system_id=ai_system.id,
                        framework_id=framework.id,
                        tenant_id=tenant_id,
                        assessment_type="periodic",
                        assessment_status=random.choice(["completed", "in_progress", "pending"]),
                        overall_score=random.uniform(0.5, 1.0),
                        compliance_percentage=random.uniform(50.0, 100.0),
                        findings=[
                            {"requirement": "Transparency", "status": "compliant", "notes": "Documentation complete"},
                            {"requirement": "Human oversight", "status": "partial", "notes": "Needs improvement"},
                        ],
                        recommendations=[
                            "Implement additional monitoring",
                            "Update documentation",
                        ],
                        assessor_id=user_id,
                        assessment_date=datetime.utcnow(),
                        next_assessment_date=datetime.utcnow() + timedelta(days=180),
                    )
                    db.add(compliance_record)
                    print(f"  Created compliance record: {ai_system.name} - {framework.framework_code}")
        
        # 3. Seed Data Flow Declarations
        print("\n--- Seeding Data Flow Declarations ---")
        for ai_system in ai_systems[:4]:
            existing = db.query(DataFlowDeclaration).filter(
                DataFlowDeclaration.ai_system_id == ai_system.id
            ).first()
            
            if not existing:
                data_flow = DataFlowDeclaration(
                    ai_system_id=ai_system.id,
                    tenant_id=tenant_id,
                    flow_name=f"Primary data flow - {ai_system.name}",
                    description="Main data processing pipeline",
                    data_categories=["personal", "behavioral"],
                    data_types=["user_input", "system_logs", "metadata"],
                    data_sources=["User interactions", "Third-party APIs"],
                    data_destinations=["AI Model", "Analytics Database"],
                    third_party_transfers=["Cloud Provider"],
                    legal_basis="legitimate_interest",
                    retention_period=365,
                    cross_border_transfer=random.choice([True, False]),
                    is_approved=random.choice([True, False]),
                )
                db.add(data_flow)
                print(f"  Created data flow for: {ai_system.name}")
        
        # 4. Seed DPIAs
        print("\n--- Seeding DPIAs ---")
        high_risk_systems = [s for s in ai_systems if s.risk_level.value == "high"]
        for ai_system in high_risk_systems:
            existing = db.query(DPIA).filter(DPIA.ai_system_id == ai_system.id).first()
            
            if not existing:
                dpia = DPIA(
                    ai_system_id=ai_system.id,
                    tenant_id=tenant_id,
                    title=f"DPIA - {ai_system.name}",
                    description=f"Data Protection Impact Assessment for {ai_system.name}",
                    status=random.choice(["required", "in_progress", "completed"]),
                    necessity_assessment="Processing is necessary for service delivery",
                    proportionality_assessment="Data processing is proportional to purpose",
                    identified_risks=[
                        {"risk": "Unauthorized access", "likelihood": "medium", "impact": "high"},
                        {"risk": "Data breach", "likelihood": "low", "impact": "critical"},
                    ],
                    risk_mitigation_measures=[
                        {"measure": "Encryption at rest", "implemented": True},
                        {"measure": "Access controls", "implemented": True},
                    ],
                    overall_risk_level="medium",
                    is_compliant=random.choice([True, False]),
                    dpo_consulted=random.choice([True, False]),
                )
                db.add(dpia)
                print(f"  Created DPIA for: {ai_system.name}")
        
        # 5. Seed Model Cards
        print("\n--- Seeding Model Cards ---")
        for ai_system in ai_systems:
            existing = db.query(ModelCard).filter(
                ModelCard.ai_system_id == ai_system.id
            ).first()
            
            if not existing:
                model_card = ModelCard(
                    ai_system_id=ai_system.id,
                    tenant_id=tenant_id,
                    model_name=ai_system.name,
                    model_version=ai_system.version or "1.0.0",
                    model_type=ai_system.model_type or "Unknown",
                    training_data_description="Synthetic and anonymized production data",
                    primary_use_cases=[ai_system.description] if ai_system.description else ["General purpose"],
                    limitations=["May produce incorrect results in edge cases"],
                    protected_attributes=["gender", "age", "location"],
                    is_published=random.choice([True, False]),
                )
                db.add(model_card)
                print(f"  Created model card for: {ai_system.name}")
        
        # 6. Seed Fairness Assessments
        print("\n--- Seeding Fairness Assessments ---")
        for ai_system in ai_systems[:4]:
            existing = db.query(FairnessAssessment).filter(
                FairnessAssessment.ai_system_id == ai_system.id
            ).first()
            
            if not existing:
                fairness = FairnessAssessment(
                    ai_system_id=ai_system.id,
                    tenant_id=tenant_id,
                    assessment_name=f"Fairness Assessment - {ai_system.name}",
                    status=random.choice(["pending", "in_progress", "completed"]),
                    protected_attributes=["gender", "age", "ethnicity"],
                    fairness_definitions=["demographic_parity", "equalized_odds"],
                    fairness_metrics={
                        "demographic_parity_difference": random.uniform(0.0, 0.2),
                        "equalized_odds_difference": random.uniform(0.0, 0.15),
                    },
                    overall_fairness_score=random.uniform(0.7, 1.0),
                    is_fair=random.choice([True, False]),
                    findings=[
                        {"attribute": "gender", "finding": "Slight disparity detected", "severity": "low"},
                    ],
                    assessor_id=user_id,
                )
                db.add(fairness)
                print(f"  Created fairness assessment for: {ai_system.name}")
        
        # 7. Seed Bias Alerts
        print("\n--- Seeding Bias Alerts ---")
        for ai_system in ai_systems[:3]:
            existing = db.query(BiasAlert).filter(
                BiasAlert.ai_system_id == ai_system.id
            ).first()
            
            if not existing:
                alert = BiasAlert(
                    ai_system_id=ai_system.id,
                    tenant_id=tenant_id,
                    alert_name=f"Bias drift detection - {ai_system.name}",
                    alert_type="demographic_parity",
                    severity=random.choice(["low", "medium", "high"]),
                    metric_name="demographic_parity_difference",
                    threshold_value=0.1,
                    current_value=random.uniform(0.05, 0.15),
                    is_active=True,
                    is_triggered=random.choice([True, False]),
                    affected_attribute="gender",
                    notification_channels=["email", "slack"],
                )
                db.add(alert)
                print(f"  Created bias alert for: {ai_system.name}")
        
        # 8. Seed Audit Logs
        print("\n--- Seeding Audit Logs ---")
        actions = ["CREATE", "READ", "UPDATE", "ASSESS", "APPROVE"]
        for i in range(10):
            log = AuditLog(
                tenant_id=tenant_id,
                actor_id=user_id,
                actor_email=user.email,
                action=random.choice(actions),
                resource_type="ai_system",
                resource_id=ai_systems[i % len(ai_systems)].id,
                resource_name=ai_systems[i % len(ai_systems)].name,
                request_method="POST" if i % 2 == 0 else "GET",
                request_path=f"/api/v1/compliance/ai-systems/{ai_systems[i % len(ai_systems)].id}",
                response_status=200,
                response_time_ms=random.randint(50, 500),
                created_at=datetime.utcnow() - timedelta(hours=i),
            )
            db.add(log)
        print(f"  Created 10 audit log entries")
        
        # 9. Seed Evidence Vault
        print("\n--- Seeding Evidence Vault ---")
        for i, ai_system in enumerate(ai_systems[:3]):
            existing = db.query(EvidenceVault).filter(
                EvidenceVault.ai_system_id == ai_system.id
            ).first()
            
            if not existing:
                evidence = EvidenceVault(
                    tenant_id=tenant_id,
                    ai_system_id=ai_system.id,
                    evidence_name=f"Assessment Report - {ai_system.name}",
                    evidence_type="report",
                    description="Compliance assessment documentation",
                    file_path=f"/evidence/{ai_system.id}/assessment.pdf",
                    file_size=random.randint(50000, 500000),
                    classification="internal",
                    tags=["assessment", "compliance"],
                    is_verified=True,
                    verified_by=user_id,
                    uploaded_by=user_id,
                )
                db.add(evidence)
                print(f"  Created evidence for: {ai_system.name}")
        
        # 10. Seed System Health
        print("\n--- Seeding System Health ---")
        for ai_system in ai_systems:
            existing = db.query(SystemHealth).filter(
                SystemHealth.ai_system_id == ai_system.id
            ).first()
            
            if not existing:
                health = SystemHealth(
                    ai_system_id=ai_system.id,
                    tenant_id=tenant_id,
                    overall_status=random.choice(["healthy", "healthy", "degraded"]),
                    uptime_percentage=random.uniform(95.0, 99.9),
                    response_time_avg=random.uniform(50, 200),
                    error_rate=random.uniform(0.0, 2.0),
                    requests_total=random.randint(10000, 100000),
                    requests_successful=random.randint(9500, 99000),
                    compliance_score=random.uniform(0.7, 1.0),
                    last_health_check=datetime.utcnow(),
                    next_health_check=datetime.utcnow() + timedelta(hours=1),
                )
                db.add(health)
                print(f"  Created health record for: {ai_system.name}")
        
        db.commit()
        print("\n" + "="*50)
        print("Seeding completed successfully!")
        print("="*50)
        
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
