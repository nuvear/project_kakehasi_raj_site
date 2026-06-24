import sys
import os
import uuid
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.models import MaturityAssessment, Company

db = SessionLocal()
try:
    print("Checking database...")
    company_id = uuid.UUID('a0000000-0000-0000-0000-000000000001')
    company = db.query(Company).filter(Company.id == company_id).first()
    print(f"Company found: {company.name if company else 'None'}")
    
    assessment = db.query(MaturityAssessment).filter(MaturityAssessment.company_id == company_id).first()
    print(f"Assessment found: {assessment.id if assessment else 'None'}")
    if assessment:
        print(f"Assessment Company ID: {assessment.company_id}")
        print(f"Recommendations type: {type(assessment.recommendations)}")
        print(f"Recommendations content: {assessment.recommendations}")

finally:
    db.close()
