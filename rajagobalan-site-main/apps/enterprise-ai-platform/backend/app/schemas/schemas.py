from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# Projects
class ProjectCreate(BaseModel):
    """Create a new AI project."""
    company_id: UUID
    name: str
    description: Optional[str] = None
    project_type: Optional[str] = None


class ProjectUpdate(BaseModel):
    """Update an AI project."""
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    project_type: Optional[str] = None


class ProjectResponse(BaseModel):
    """AI project response."""
    id: UUID
    company_id: UUID
    name: str
    description: Optional[str] = None
    status: str
    project_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Discovery
class DiscoveryRequest(BaseModel):
    """Request for AI use case discovery."""
    company_id: UUID
    industry: str
    business_problems: List[str]


class OpportunityItem(BaseModel):
    """Individual opportunity from discovery."""
    use_case: str
    description: str
    prediction_target: Optional[str] = None
    expected_roi: float
    complexity: str  # low, medium, high
    impact_score: float
    feasibility_score: float
    quadrant: str  # quick_wins, strategic, moonshots, research


class DiscoveryResponse(BaseModel):
    """Discovery result response."""
    id: UUID
    company_id: UUID
    industry: str
    business_problems: List[str]
    opportunities: List[OpportunityItem]
    created_at: datetime

    class Config:
        from_attributes = True


# Maturity Assessment
class MaturityAnswerInput(BaseModel):
    """Single answer in maturity assessment."""
    question_id: str
    domain: str  # strategy, infrastructure, data, people, governance
    score: int = Field(ge=1, le=5)


class MaturityAssessRequest(BaseModel):
    """Request for maturity assessment."""
    company_id: UUID
    answers: List[MaturityAnswerInput]


class MaturityResponse(BaseModel):
    """Maturity assessment response."""
    id: UUID
    company_id: UUID
    overall_score: float
    maturity_level: str
    strategy_score: float
    infrastructure_score: float
    data_score: float
    people_score: float
    governance_score: float
    recommendations: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ROI Simulation
class ROIRequest(BaseModel):
    """Request for ROI simulation."""
    company_id: UUID
    project_id: Optional[UUID] = None
    current_revenue: float
    current_cost: float
    revenue_increase_pct: float
    cost_reduction_pct: float
    implementation_cost: float
    timeline_months: int
    discount_rate: float = 0.1


class ScenarioResult(BaseModel):
    """Single scenario ROI result."""
    revenue_benefit: float
    cost_benefit: float
    total_benefit: float
    net_benefit: float
    roi_percentage: float
    payback_months: float
    npv: float


class ROIResponse(BaseModel):
    """ROI simulation response."""
    id: UUID
    company_id: UUID
    base_case: ScenarioResult
    optimistic_scenario: ScenarioResult
    pessimistic_scenario: ScenarioResult
    created_at: datetime

    class Config:
        from_attributes = True


# Architecture Design
class ArchitectureRequest(BaseModel):
    """Request for architecture design."""
    project_id: UUID
    project_name: str
    architecture_type: str  # batch, real_time, hybrid
    include_monitoring: bool = True
    include_feature_store: bool = True


class ComponentItem(BaseModel):
    """Architecture component."""
    name: str
    description: str
    build_or_buy: str  # build, buy
    examples: Optional[List[str]] = None


class ArchitectureResponse(BaseModel):
    """Architecture design response."""
    id: UUID
    project_id: UUID
    architecture_type: str
    components: List[ComponentItem]
    diagram_svg: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Roadmap
class MilestoneItem(BaseModel):
    """Roadmap milestone."""
    name: str
    description: str
    timeline_weeks: int


class PhaseItem(BaseModel):
    """Roadmap phase."""
    phase_number: int
    name: str
    description: str
    duration_months: int
    milestones: List[MilestoneItem]
    deliverables: List[str]


class RoadmapRequest(BaseModel):
    """Request for roadmap generation."""
    company_id: UUID
    project_id: Optional[UUID] = None
    duration_months: int
    maturity_level: Optional[str] = None


class RoadmapResponse(BaseModel):
    """Roadmap response."""
    id: UUID
    company_id: UUID
    duration_months: int
    maturity_level: Optional[str] = None
    phases: List[PhaseItem]
    created_at: datetime

    class Config:
        from_attributes = True


# Wardley Map
class ComponentWardley(BaseModel):
    """Wardley map component."""
    name: str
    description: str
    evolution_stage: str  # genesis, custom_built, product, commodity
    visibility: float = Field(ge=0, le=1)


class RecommendationItem(BaseModel):
    """Strategic recommendation."""
    item: str
    rationale: str


class WardleyRequest(BaseModel):
    """Request for Wardley map."""
    company_id: UUID
    project_id: Optional[UUID] = None


class WardleyResponse(BaseModel):
    """Wardley map response."""
    id: UUID
    company_id: UUID
    components: List[ComponentWardley]
    build_recommendations: Optional[List[RecommendationItem]] = None
    buy_recommendations: Optional[List[RecommendationItem]] = None
    partner_recommendations: Optional[List[RecommendationItem]] = None
    created_at: datetime

    class Config:
        from_attributes = True
