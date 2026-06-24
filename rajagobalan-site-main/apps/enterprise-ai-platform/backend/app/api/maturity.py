"""Maturity assessment endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import MaturityAssessment, MaturityAnswer
from app.schemas import MaturityAssessRequest, MaturityResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/maturity", tags=["maturity"])


def calculate_maturity_level(score: float) -> str:
    """Convert score to maturity level."""
    if score < 1.5:
        return "beginner"
    elif score < 2.5:
        return "developing"
    elif score < 3.5:
        return "intermediate"
    elif score < 4.5:
        return "advanced"
    else:
        return "expert"


@router.post("/assess", response_model=MaturityResponse)
def assess_maturity(
    request: MaturityAssessRequest,
    db: Session = Depends(get_db)
):
    """Conduct maturity assessment."""

    # Calculate domain scores
    domain_scores = {}
    for domain in ["strategy", "infrastructure", "data", "people", "governance"]:
        domain_answers = [
            ans.score for ans in request.answers
            if ans.domain == domain
        ]
        if domain_answers:
            domain_scores[domain] = sum(domain_answers) / len(domain_answers)
        else:
            domain_scores[domain] = 3.0

    # Calculate overall score
    overall_score = sum(domain_scores.values()) / len(domain_scores)
    maturity_level = calculate_maturity_level(overall_score)

    # Generate recommendations
    recommendations = AIService.generate_recommendations(domain_scores)

    # Create assessment
    db_assessment = MaturityAssessment(
        company_id=request.company_id,
        overall_score=overall_score,
        maturity_level=maturity_level,
        strategy_score=domain_scores.get("strategy", 3.0),
        infrastructure_score=domain_scores.get("infrastructure", 3.0),
        data_score=domain_scores.get("data", 3.0),
        people_score=domain_scores.get("people", 3.0),
        governance_score=domain_scores.get("governance", 3.0),
        recommendations={
            "recommendations": recommendations,
            "priority_areas": sorted(
                domain_scores.items(),
                key=lambda x: x[1]
            )[:3]
        }
    )
    db.add(db_assessment)
    db.flush()  # Get the assessment ID

    # Save answers
    for answer in request.answers:
        db_answer = MaturityAnswer(
            assessment_id=db_assessment.id,
            question_id=answer.question_id,
            domain=answer.domain,
            score=answer.score
        )
        db.add(db_answer)

    db.commit()
    db.refresh(db_assessment)

    return db_assessment


@router.get("/{company_id}", response_model=MaturityResponse)
def get_latest_assessment(
    company_id: UUID,
    db: Session = Depends(get_db)
):
    """Get the latest maturity assessment for a company."""
    assessment = (
        db.query(MaturityAssessment)
        .filter(MaturityAssessment.company_id == company_id)
        .order_by(MaturityAssessment.created_at.desc())
        .first()
    )

    if not assessment:
        raise HTTPException(status_code=404, detail="No assessment found")

    return assessment
