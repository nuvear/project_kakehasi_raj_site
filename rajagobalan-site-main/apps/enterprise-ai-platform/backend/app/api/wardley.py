"""Wardley map strategic planning endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import WardleyMap
from app.schemas import WardleyRequest, WardleyResponse, ComponentWardley, RecommendationItem

router = APIRouter(prefix="/api/wardley", tags=["wardley"])


def generate_wardley_components() -> tuple:
    """Generate Wardley map components with recommendations."""

    components = [
        ComponentWardley(
            name="AI Strategy & Governance",
            description="Executive alignment and AI governance framework",
            evolution_stage="genesis",
            visibility=0.9
        ),
        ComponentWardley(
            name="Data Infrastructure",
            description="Cloud platforms, data lakes, and ETL pipelines",
            evolution_stage="product",
            visibility=0.8
        ),
        ComponentWardley(
            name="ML Infrastructure",
            description="Model training and serving platforms",
            evolution_stage="product",
            visibility=0.75
        ),
        ComponentWardley(
            name="Data Scientists",
            description="AI/ML talent and expertise",
            evolution_stage="custom_built",
            visibility=0.85
        ),
        ComponentWardley(
            name="Feature Engineering",
            description="Feature stores and data pipelines",
            evolution_stage="product",
            visibility=0.7
        ),
        ComponentWardley(
            name="Model Monitoring",
            description="Performance tracking and drift detection",
            evolution_stage="product",
            visibility=0.65
        ),
    ]

    build_recommendations = [
        RecommendationItem(
            item="Custom ML models for differentiation",
            rationale="Unique business logic requires custom development"
        ),
        RecommendationItem(
            item="Internal AI talent and capabilities",
            rationale="Long-term competitive advantage"
        ),
        RecommendationItem(
            item="Custom feature engineering pipelines",
            rationale="Domain-specific features drive model performance"
        ),
    ]

    buy_recommendations = [
        RecommendationItem(
            item="Cloud ML platforms (AWS SageMaker, GCP Vertex AI)",
            rationale="Reduce infrastructure overhead"
        ),
        RecommendationItem(
            item="Model serving platforms (KServe, Seldon)",
            rationale="Standardized deployment and scaling"
        ),
        RecommendationItem(
            item="Monitoring tools (DataDog, New Relic)",
            rationale="Industry-standard observability"
        ),
    ]

    partner_recommendations = [
        RecommendationItem(
            item="AI/ML consultancies for accelerated learning",
            rationale="Reduce time-to-value during initial phases"
        ),
        RecommendationItem(
            item="Strategic cloud providers",
            rationale="Leverage their AI/ML services and support"
        ),
        RecommendationItem(
            item="Data engineering specialists",
            rationale="Help establish data quality foundations"
        ),
    ]

    return components, build_recommendations, buy_recommendations, partner_recommendations


@router.post("/generate", response_model=WardleyResponse)
def generate_wardley(
    request: WardleyRequest,
    db: Session = Depends(get_db)
):
    """Generate Wardley map for strategic planning."""

    components, build_recs, buy_recs, partner_recs = generate_wardley_components()

    # Save to database
    db_wardley = WardleyMap(
        company_id=request.company_id,
        project_id=request.project_id,
        components=[c.model_dump() for c in components],
        build_recommendations=[b.model_dump() for b in build_recs],
        buy_recommendations=[b.model_dump() for b in buy_recs],
        partner_recommendations=[p.model_dump() for p in partner_recs]
    )
    db.add(db_wardley)
    db.commit()
    db.refresh(db_wardley)

    return db_wardley
