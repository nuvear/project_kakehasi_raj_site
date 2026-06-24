"""AI use case discovery endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import DiscoveryResult
from app.schemas import DiscoveryRequest, DiscoveryResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/discovery", tags=["discovery"])


@router.post("/generate", response_model=DiscoveryResponse)
def generate_discovery(
    request: DiscoveryRequest,
    db: Session = Depends(get_db)
):
    """Generate AI use case discovery results."""

    # Generate opportunities
    opportunities = AIService.generate_use_cases(
        request.industry,
        request.business_problems
    )

    # Save to database
    db_discovery = DiscoveryResult(
        company_id=request.company_id,
        industry=request.industry,
        business_problems=request.business_problems,
        opportunities=opportunities
    )
    db.add(db_discovery)
    db.commit()
    db.refresh(db_discovery)

    return db_discovery
