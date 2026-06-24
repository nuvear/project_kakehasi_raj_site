import sys
import os
import uuid
from datetime import datetime
import json

# Add the parent directory to sys.path to allow importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models.models import Base, Company, AIProject, MaturityAssessment, MaturityAnswer

def seed_data():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
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
            country='United States' 
        )
        db.add(company)
        
        # 2. Create AI Projects
        projects_data = [
            {'name': 'Customer Churn Prediction', 'desc': 'ML model to predict customer churn', 'impact': 8.5, 'feas': 7.0, 'status': 'In Progress', 'roi': 1200000, 'cost': 350000, 'time': 6},
            {'name': 'Demand Forecasting', 'desc': 'Deep learning model for inventory', 'impact': 9.0, 'feas': 6.0, 'status': 'Planned', 'roi': 2500000, 'cost': 800000, 'time': 12},
            {'name': 'Chatbot for Support', 'desc': 'NLP-powered chatbot', 'impact': 6.5, 'feas': 8.5, 'status': 'In Progress', 'roi': 800000, 'cost': 200000, 'time': 4},
            {'name': 'Price Optimization', 'desc': 'Dynamic pricing engine', 'impact': 7.5, 'feas': 4.5, 'status': 'Planned', 'roi': 3000000, 'cost': 1200000, 'time': 18},
            {'name': 'Fraud Detection', 'desc': 'Real-time transaction fraud', 'impact': 8.0, 'feas': 5.5, 'status': 'Planned', 'roi': 1500000, 'cost': 500000, 'time': 9},
            {'name': 'Document Processing', 'desc': 'OCR + NLP pipeline', 'impact': 5.0, 'feas': 9.0, 'status': 'Completed', 'roi': 600000, 'cost': 150000, 'time': 3},
            {'name': 'Recommendation Engine', 'desc': 'Personalized product recommendations', 'impact': 7.0, 'feas': 7.5, 'status': 'In Progress', 'roi': 1800000, 'cost': 400000, 'time': 8},
            {'name': 'Sentiment Analysis', 'desc': 'Social media sentiment tracking', 'impact': 4.0, 'feas': 8.0, 'status': 'Planned', 'roi': 300000, 'cost': 100000, 'time': 3}
        ]

        print(f"Creating {len(projects_data)} projects...")
        for p in projects_data:
            # Calculate quadrant based on init.sql logic
            if p['impact'] >= 5 and p['feas'] >= 5:
                quad = 'Quick Win'
            elif p['impact'] >= 5 and p['feas'] < 5:
                quad = 'Big Bet'
            elif p['impact'] < 5 and p['feas'] >= 5:
                quad = 'Fill-In'
            else:
                quad = 'Deprioritize'

            project = AIProject(
                id=uuid.uuid4(),
                company_id=company_id,
                name=p['name'],
                description=p['desc'],
                impact_score=p['impact'],
                feasibility_score=p['feas'],
                quadrant=quad,
                status=p['status'],
                estimated_roi=p['roi'],
                implementation_cost=p['cost'],
                timeline_months=p['time'],
                risk_level='medium'
            )
            db.add(project)

        # 3. Create Maturity Assessment
        print("Creating maturity assessment...")
        assessment = MaturityAssessment(
            id=uuid.uuid4(),
            company_id=company_id,
            overall_score=3.2,
            strategy_score=3.5,
            infrastructure_score=3.8, 
            data_score=3.0,
            people_score=2.5,
            governance_score=3.0,
            maturity_level='Defined',
            recommendations={
                "recommendations": [
                    "Establish a formal AI Center of Excellence",
                    "Invest in data quality and governance frameworks",
                    "Develop internal ML engineering talent pipeline",
                    "Create an AI ethics review board",
                    "Implement MLOps practices for model lifecycle management"
                ],
                "priority_areas": [
                    ("people", 2.5),
                    ("data", 3.0),
                    ("governance", 3.0)
                ]
            }
        )
        db.add(assessment)
        
        db.commit()
        print("Seeding complete!")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
