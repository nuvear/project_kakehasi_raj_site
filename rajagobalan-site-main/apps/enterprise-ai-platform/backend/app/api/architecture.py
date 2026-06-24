"""ML architecture design endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import ArchitectureDesign
from app.schemas import ArchitectureRequest, ArchitectureResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/architecture", tags=["architecture"])


def generate_simple_svg_diagram(arch_type: str) -> str:
    """Generate a simple SVG diagram of the architecture."""

    if arch_type == "batch":
        svg = """<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="30" font-size="20" font-weight="bold">Batch ML Architecture</text>

  <rect x="50" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="60" y="130" font-size="12">Data Ingestion</text>

  <rect x="220" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="230" y="130" font-size="12">Data Storage</text>

  <rect x="390" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="400" y="130" font-size="12">Processing</text>

  <rect x="560" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="570" y="130" font-size="12">Training</text>

  <rect x="220" y="220" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="230" y="270" font-size="12">Batch Prediction</text>

  <rect x="390" y="220" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="400" y="270" font-size="12">Monitoring</text>

  <path d="M 170 120 L 220 120" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 340 120 L 390 120" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 510 120 L 560 120" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 620 160 L 620 220" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 280 220 L 280 160" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 340 260 L 390 260" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>

  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#333"/>
    </marker>
  </defs>
</svg>"""
    elif arch_type == "real_time":
        svg = """<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="30" font-size="20" font-weight="bold">Real-Time ML Architecture</text>

  <rect x="50" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="60" y="130" font-size="12">Event Stream</text>

  <rect x="220" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="230" y="130" font-size="12">Feature Store</text>

  <rect x="390" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="400" y="130" font-size="12">Model Serving</text>

  <rect x="560" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="570" y="130" font-size="12">API/Response</text>

  <rect x="220" y="220" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="230" y="270" font-size="12">Monitoring</text>

  <rect x="390" y="220" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="400" y="270" font-size="12">Retraining</text>

  <path d="M 170 120 L 220 120" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 340 120 L 390 120" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 510 120 L 560 120" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 450 160 L 450 220" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 280 220 L 280 160" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 340 260 L 390 260" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>

  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#333"/>
    </marker>
  </defs>
</svg>"""
    else:  # hybrid
        svg = """<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="30" font-size="20" font-weight="bold">Hybrid ML Architecture</text>

  <rect x="50" y="80" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="60" y="130" font-size="12">Data Ingestion</text>

  <rect x="220" y="50" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="230" y="95" font-size="12">Real-Time</text>
  <text x="230" y="110" font-size="12">Processing</text>

  <rect x="220" y="170" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="230" y="215" font-size="12">Batch</text>
  <text x="230" y="230" font-size="12">Processing</text>

  <rect x="390" y="110" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="400" y="160" font-size="12">Feature Store</text>

  <rect x="560" y="110" width="120" height="80" fill="#E8F4F8" stroke="#333"/>
  <text x="570" y="160" font-size="12">Model Serving</text>

  <path d="M 170 120 L 220 90" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 170 120 L 220 210" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 340 90 L 390 150" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 340 210 L 390 150" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M 510 150 L 560 150" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>

  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#333"/>
    </marker>
  </defs>
</svg>"""

    return svg


@router.post("/generate", response_model=ArchitectureResponse)
def generate_architecture(
    request: ArchitectureRequest,
    db: Session = Depends(get_db)
):
    """Generate ML architecture design."""

    # Generate architecture components
    arch_data = AIService.generate_architecture(
        request.project_name,
        request.architecture_type,
        request.include_monitoring,
        request.include_feature_store
    )

    components = arch_data.get("components", [])

    # Generate SVG diagram
    diagram_svg = generate_simple_svg_diagram(request.architecture_type)

    # Save to database
    db_architecture = ArchitectureDesign(
        project_id=request.project_id,
        architecture_type=request.architecture_type,
        components=components,
        diagram_svg=diagram_svg,
        include_monitoring=request.include_monitoring,
        include_feature_store=request.include_feature_store
    )
    db.add(db_architecture)
    db.commit()
    db.refresh(db_architecture)

    return db_architecture
