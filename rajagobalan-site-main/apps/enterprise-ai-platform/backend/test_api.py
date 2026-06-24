"""
Test script for AI Transformation Command Center API
Run with: python test_api.py
"""

import requests
import json
from uuid import UUID

BASE_URL = "http://localhost:8000"
DEMO_COMPANY_ID = "a0000000-0000-0000-0000-000000000001"


def test_health():
    """Test health endpoint."""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_projects():
    """Test listing projects."""
    print("\n=== Testing List Projects ===")
    response = requests.get(
        f"{BASE_URL}/api/projects",
        params={"company_id": DEMO_COMPANY_ID}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)[:200]}...")


def test_create_project():
    """Test creating a project."""
    print("\n=== Testing Create Project ===")
    payload = {
        "company_id": DEMO_COMPANY_ID,
        "name": "Customer Churn Prediction",
        "description": "Predict which customers are likely to churn",
        "project_type": "real_time"
    }
    response = requests.post(f"{BASE_URL}/api/projects", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2, default=str)}")
    return data.get("id")


def test_discovery():
    """Test discovery endpoint."""
    print("\n=== Testing Discovery Generation ===")
    payload = {
        "company_id": DEMO_COMPANY_ID,
        "industry": "retail",
        "business_problems": [
            "High customer churn rates",
            "Inefficient inventory management",
            "Declining sales in stores"
        ]
    }
    response = requests.post(f"{BASE_URL}/api/discovery/generate", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Opportunities found: {len(data.get('opportunities', []))}")
    if data.get("opportunities"):
        print(f"First opportunity: {json.dumps(data['opportunities'][0], indent=2)}")


def test_maturity_assessment():
    """Test maturity assessment."""
    print("\n=== Testing Maturity Assessment ===")
    payload = {
        "company_id": DEMO_COMPANY_ID,
        "answers": [
            {"question_id": "strat_1", "domain": "strategy", "score": 3},
            {"question_id": "strat_2", "domain": "strategy", "score": 2},
            {"question_id": "infra_1", "domain": "infrastructure", "score": 4},
            {"question_id": "infra_2", "domain": "infrastructure", "score": 3},
            {"question_id": "data_1", "domain": "data", "score": 2},
            {"question_id": "data_2", "domain": "data", "score": 2},
            {"question_id": "people_1", "domain": "people", "score": 3},
            {"question_id": "people_2", "domain": "people", "score": 3},
            {"question_id": "gov_1", "domain": "governance", "score": 2},
            {"question_id": "gov_2", "domain": "governance", "score": 2},
        ]
    }
    response = requests.post(f"{BASE_URL}/api/maturity/assess", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Overall Score: {data.get('overall_score', 'N/A')}")
    print(f"Maturity Level: {data.get('maturity_level', 'N/A')}")
    print(f"Recommendations: {len(data.get('recommendations', {}).get('recommendations', []))}")


def test_roi_simulation():
    """Test ROI simulation."""
    print("\n=== Testing ROI Simulation ===")
    payload = {
        "company_id": DEMO_COMPANY_ID,
        "current_revenue": 10000000,
        "current_cost": 3000000,
        "revenue_increase_pct": 15.0,
        "cost_reduction_pct": 20.0,
        "implementation_cost": 500000,
        "timeline_months": 24,
        "discount_rate": 0.1
    }
    response = requests.post(f"{BASE_URL}/api/roi/simulate", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    base = data.get("base_case", {})
    print(f"ROI: {base.get('roi_percentage', 'N/A'):.1f}%")
    print(f"Net Benefit: ${base.get('net_benefit', 0):,.0f}")
    print(f"Payback (months): {base.get('payback_months', 'N/A'):.1f}")
    print(f"NPV: ${base.get('npv', 0):,.0f}")


def test_architecture():
    """Test architecture generation."""
    print("\n=== Testing Architecture Generation ===")
    
    # First create a project
    project_payload = {
        "company_id": DEMO_COMPANY_ID,
        "name": "Recommendation Engine",
        "description": "Real-time product recommendations",
        "project_type": "real_time"
    }
    project_resp = requests.post(f"{BASE_URL}/api/projects", json=project_payload)
    project_id = project_resp.json().get("id")
    
    # Then generate architecture
    payload = {
        "project_id": project_id,
        "project_name": "Recommendation Engine",
        "architecture_type": "real_time",
        "include_monitoring": True,
        "include_feature_store": True
    }
    response = requests.post(f"{BASE_URL}/api/architecture/generate", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Architecture Type: {data.get('architecture_type')}")
    print(f"Components: {len(data.get('components', []))}")
    for comp in data.get("components", [])[:2]:
        print(f"  - {comp.get('name')}: {comp.get('build_or_buy')}")


def test_roadmap():
    """Test roadmap generation."""
    print("\n=== Testing Roadmap Generation ===")
    payload = {
        "company_id": DEMO_COMPANY_ID,
        "duration_months": 12,
        "maturity_level": "intermediate"
    }
    response = requests.post(f"{BASE_URL}/api/roadmap/generate", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Phases: {len(data.get('phases', []))}")
    for phase in data.get("phases", []):
        print(f"  Phase {phase.get('phase_number')}: {phase.get('name')} ({phase.get('duration_months')} months)")


def test_wardley():
    """Test Wardley map generation."""
    print("\n=== Testing Wardley Map Generation ===")
    payload = {
        "company_id": DEMO_COMPANY_ID
    }
    response = requests.post(f"{BASE_URL}/api/wardley/generate", json=payload)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Components: {len(data.get('components', []))}")
    print(f"Build Recommendations: {len(data.get('build_recommendations', []))}")
    print(f"Buy Recommendations: {len(data.get('buy_recommendations', []))}")
    print(f"Partner Recommendations: {len(data.get('partner_recommendations', []))}")


if __name__ == "__main__":
    print("Starting API tests...")
    print(f"Base URL: {BASE_URL}")
    print(f"Demo Company ID: {DEMO_COMPANY_ID}")

    try:
        test_health()
        test_list_projects()
        test_create_project()
        test_discovery()
        test_maturity_assessment()
        test_roi_simulation()
        test_architecture()
        test_roadmap()
        test_wardley()

        print("\n" + "="*50)
        print("All tests completed successfully!")
        print("="*50)

    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
