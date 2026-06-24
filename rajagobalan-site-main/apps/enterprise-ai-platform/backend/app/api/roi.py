"""ROI simulation endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import ROISimulation
from app.schemas import (
    ROIRequest,
    ROIResponse,
    ScenarioResult
)

router = APIRouter(prefix="/api/roi", tags=["roi"])


def calculate_roi_metrics(
    current_revenue: float,
    current_cost: float,
    revenue_increase_pct: float,
    cost_reduction_pct: float,
    implementation_cost: float,
    timeline_months: int,
    discount_rate: float,
    multiplier: float = 1.0
) -> ScenarioResult:
    """Calculate ROI metrics for a scenario."""

    # Apply multiplier for scenarios
    adj_revenue_increase = revenue_increase_pct * multiplier
    adj_cost_reduction = cost_reduction_pct * multiplier

    # Calculate benefits
    annual_revenue_benefit = (current_revenue * adj_revenue_increase) / 100
    annual_cost_benefit = (current_cost * adj_cost_reduction) / 100

    # Monthly benefits
    monthly_revenue_benefit = annual_revenue_benefit / 12
    monthly_cost_benefit = annual_cost_benefit / 12
    monthly_total_benefit = monthly_revenue_benefit + monthly_cost_benefit

    # Total benefit over implementation period
    total_benefit = monthly_total_benefit * timeline_months

    # Net benefit (benefits - implementation cost)
    net_benefit = total_benefit - implementation_cost

    # ROI percentage
    roi_percentage = (net_benefit / implementation_cost * 100) if implementation_cost > 0 else 0

    # Payback months
    if monthly_total_benefit > 0:
        payback_months = implementation_cost / monthly_total_benefit
    else:
        payback_months = float('inf')

    # NPV calculation (simplified)
    npv = 0
    for month in range(1, timeline_months + 1):
        discount_factor = (1 + discount_rate) ** (month / 12)
        npv += (monthly_total_benefit / discount_factor)
    npv -= implementation_cost

    return ScenarioResult(
        revenue_benefit=annual_revenue_benefit,
        cost_benefit=annual_cost_benefit,
        total_benefit=total_benefit,
        net_benefit=net_benefit,
        roi_percentage=roi_percentage,
        payback_months=min(payback_months, timeline_months * 12),
        npv=npv
    )


@router.post("/simulate", response_model=ROIResponse)
def simulate_roi(
    request: ROIRequest,
    db: Session = Depends(get_db)
):
    """Simulate ROI with base, optimistic, and pessimistic scenarios."""

    # Base case
    base_case = calculate_roi_metrics(
        request.current_revenue,
        request.current_cost,
        request.revenue_increase_pct,
        request.cost_reduction_pct,
        request.implementation_cost,
        request.timeline_months,
        request.discount_rate,
        multiplier=1.0
    )

    # Optimistic (1.3x)
    optimistic = calculate_roi_metrics(
        request.current_revenue,
        request.current_cost,
        request.revenue_increase_pct,
        request.cost_reduction_pct,
        request.implementation_cost,
        request.timeline_months,
        request.discount_rate,
        multiplier=1.3
    )

    # Pessimistic (0.7x)
    pessimistic = calculate_roi_metrics(
        request.current_revenue,
        request.current_cost,
        request.revenue_increase_pct,
        request.cost_reduction_pct,
        request.implementation_cost,
        request.timeline_months,
        request.discount_rate,
        multiplier=0.7
    )

    # Save to database
    db_simulation = ROISimulation(
        company_id=request.company_id,
        project_id=request.project_id,
        current_revenue=request.current_revenue,
        current_cost=request.current_cost,
        revenue_increase_pct=request.revenue_increase_pct,
        cost_reduction_pct=request.cost_reduction_pct,
        implementation_cost=request.implementation_cost,
        timeline_months=request.timeline_months,
        discount_rate=request.discount_rate,
        revenue_benefit=base_case.revenue_benefit,
        cost_benefit=base_case.cost_benefit,
        total_benefit=base_case.total_benefit,
        net_benefit=base_case.net_benefit,
        roi_percentage=base_case.roi_percentage,
        payback_months=base_case.payback_months,
        npv=base_case.npv,
        optimistic_scenario=optimistic.model_dump(),
        pessimistic_scenario=pessimistic.model_dump()
    )
    db.add(db_simulation)
    db.commit()
    db.refresh(db_simulation)

    return ROIResponse(
        id=db_simulation.id,
        company_id=db_simulation.company_id,
        base_case=base_case,
        optimistic_scenario=optimistic,
        pessimistic_scenario=pessimistic,
        created_at=db_simulation.created_at
    )
