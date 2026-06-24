"""Implementation roadmap endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import Roadmap
from app.schemas import RoadmapRequest, RoadmapResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])


@router.post("/generate", response_model=RoadmapResponse)
def generate_roadmap(
    request: RoadmapRequest,
    db: Session = Depends(get_db)
):
    """Generate implementation roadmap."""

    # Generate phases
    phases = AIService.generate_roadmap(
        request.duration_months,
        request.maturity_level
    )

    # Save to database
    db_roadmap = Roadmap(
        company_id=request.company_id,
        project_id=request.project_id,
        duration_months=request.duration_months,
        maturity_level=request.maturity_level,
        phases=phases
    )
    db.add(db_roadmap)
    db.commit()
    db.refresh(db_roadmap)

    return db_roadmap
