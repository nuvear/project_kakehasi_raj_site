from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON, Text, Boolean, Uuid
# from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()


class Company(Base):
    """Companies using the platform."""
    __tablename__ = "companies"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    industry = Column(String(255))
    country = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class AIProject(Base):
    """AI transformation projects."""
    __tablename__ = "ai_projects"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="planning")  # planning, in_progress, completed
    project_type = Column(String(100))  # batch, real_time, hybrid, etc.
    
    # New columns matching init.sql and frontend requirements
    impact_score = Column(Float, default=5.0)
    feasibility_score = Column(Float, default=5.0)
    quadrant = Column(String(50))
    estimated_roi = Column(Float)
    implementation_cost = Column(Float)
    timeline_months = Column(Integer)
    risk_level = Column(String(20), default="medium")
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class MaturityAssessment(Base):
    """AI maturity assessments."""
    __tablename__ = "maturity_assessments"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid, ForeignKey("companies.id"), nullable=False)
    overall_score = Column(Float)
    maturity_level = Column(String(50))  # beginner, developing, intermediate, advanced, expert
    strategy_score = Column(Float)
    infrastructure_score = Column(Float)
    data_score = Column(Float)
    people_score = Column(Float)
    governance_score = Column(Float)
    recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class MaturityAnswer(Base):
    """Individual answers to maturity assessment questions."""
    __tablename__ = "maturity_answers"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    assessment_id = Column(Uuid, ForeignKey("maturity_assessments.id"), nullable=False)
    question_id = Column(String(255), nullable=False)
    domain = Column(String(100), nullable=False)  # strategy, infrastructure, data, people, governance
    score = Column(Integer, nullable=False)  # 1-5
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ROISimulation(Base):
    """ROI simulation results."""
    __tablename__ = "roi_simulations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid, ForeignKey("companies.id"), nullable=False)
    project_id = Column(Uuid, ForeignKey("ai_projects.id"))
    current_revenue = Column(Float, nullable=False)
    current_cost = Column(Float, nullable=False)
    revenue_increase_pct = Column(Float, nullable=False)
    cost_reduction_pct = Column(Float, nullable=False)
    implementation_cost = Column(Float, nullable=False)
    timeline_months = Column(Integer, nullable=False)
    discount_rate = Column(Float, nullable=False)
    revenue_benefit = Column(Float)
    cost_benefit = Column(Float)
    total_benefit = Column(Float)
    net_benefit = Column(Float)
    roi_percentage = Column(Float)
    payback_months = Column(Float)
    npv = Column(Float)
    optimistic_scenario = Column(JSON)
    pessimistic_scenario = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class ArchitectureDesign(Base):
    """ML architecture designs."""
    __tablename__ = "architecture_designs"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id = Column(Uuid, ForeignKey("ai_projects.id"), nullable=False)
    architecture_type = Column(String(100), nullable=False)  # batch, real_time, hybrid
    components = Column(JSON, nullable=False)
    diagram_svg = Column(Text)
    include_monitoring = Column(Boolean, default=True)
    include_feature_store = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Roadmap(Base):
    """Implementation roadmaps."""
    __tablename__ = "roadmaps"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid, ForeignKey("companies.id"), nullable=False)
    project_id = Column(Uuid, ForeignKey("ai_projects.id"))
    duration_months = Column(Integer, nullable=False)
    maturity_level = Column(String(50))
    phases = Column(JSON, nullable=False)  # List of phase objects
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class DiscoveryResult(Base):
    """AI use case discovery results."""
    __tablename__ = "discovery_results"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid, ForeignKey("companies.id"), nullable=False)
    industry = Column(String(255), nullable=False)
    business_problems = Column(JSON, nullable=False)  # List of problems
    opportunities = Column(JSON, nullable=False)  # List of opportunity objects
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class WardleyMap(Base):
    """Wardley maps for strategic planning."""
    __tablename__ = "wardley_maps"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    company_id = Column(Uuid, ForeignKey("companies.id"), nullable=False)
    project_id = Column(Uuid, ForeignKey("ai_projects.id"))
    components = Column(JSON, nullable=False)  # List of component objects
    build_recommendations = Column(JSON)
    buy_recommendations = Column(JSON)
    partner_recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
