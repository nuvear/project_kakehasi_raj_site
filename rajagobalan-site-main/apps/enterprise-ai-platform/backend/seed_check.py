import sys
import os
import uuid
from datetime import datetime
import json

# Add the parent directory to sys.path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models.models import Base, Company, AIProject, MaturityAssessment

def seed_data():
    db = SessionLocal()
    try:
        print("Seeding database...")
        
        # Check if data already exists
        company_id = uuid.UUID('a0000000-0000-0000-0000-000000000001')
        existing_company = db.query(Company).filter(Company.id == company_id).first()
        
        if existing_company:
            print("Data already exists. Skipping.")
            return

        # 1. Create Company
        print("Creating demo company...")
        company = Company(
            id=company_id,
            name='Acme Corp (Demo)',
            industry='Retail',
            country='United States' # Note: 'size' is in SQL but model has 'country', let's check model again to be sure, using 'country' based on previous read
        )
        db.add(company)
        
        # 2. Create AI Projects
        print("Creating AI projects...")
        projects_data = [
            {
                "name": "Customer Churn Prediction",
                "description": "ML model to predict customer churn and trigger retention campaigns",
                "status": "in_progress", # SQL said 'pilot', model has default 'planning'
                "project_type": "batch",
                # Note: Impact/Feasibility scores are not in the SQLAlchemy model I read earlier?
                # Let me re-read models.py carefully. The SQL has them, but I might have missed them in the python file.
                # If they are missing in the Python model, I can't add them. 
                # Wait, I saw AIProject in models.py earlier. Let me double check what fields it has.
            }
        ]
        
        # Let's pause writing and verify the AIProject model fields first to avoid errors.
        pass
    except Exception as e:
        print(f"Error seeding data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
