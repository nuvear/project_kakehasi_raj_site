# FastAPI Backend - Complete File Index

## Project Structure

```
backend/
├── app/
│   ├── __init__.py                 # Package marker
│   ├── main.py                     # FastAPI app entry point
│   ├── config.py                   # Settings & environment config
│   ├── database.py                 # SQLAlchemy setup
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py               # ORM models (9 tables)
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── schemas.py              # Pydantic validation models
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   └── ai_service.py           # AI & fallback logic
│   │
│   ├── utils/
│   │   └── __init__.py             # Utility functions
│   │
│   └── api/
│       ├── __init__.py
│       ├── health.py               # GET /api/health
│       ├── projects.py             # CRUD /api/projects
│       ├── discovery.py            # POST /api/discovery/generate
│       ├── maturity.py             # Assessment endpoints
│       ├── roi.py                  # ROI simulation
│       ├── architecture.py         # ML architecture design
│       ├── roadmap.py              # Implementation roadmap
│       ├── wardley.py              # Strategic planning
│       └── slides.py               # PowerPoint export
│
├── .env.example                    # Environment template
├── requirements.txt                # Python dependencies
├── run.sh                          # Startup script
├── test_api.py                     # API test suite
│
├── README.md                       # Quick start guide
├── SETUP.md                        # Detailed setup instructions
├── ARCHITECTURE.md                 # Technical architecture
├── INDEX.md                        # This file
├── Dockerfile                      # Docker containerization
│
└── init.sql                        # Database schema (external)
```

## Core Files Explained

### Entry Point
- **app/main.py** (120 lines)
  - FastAPI app initialization
  - CORS middleware configuration
  - Router registration
  - Lifespan management (startup/shutdown)

### Configuration & Database
- **app/config.py** (20 lines)
  - Environment variable loading
  - Pydantic BaseSettings
  - CORS origins parsing

- **app/database.py** (25 lines)
  - SQLAlchemy engine setup
  - Session factory
  - Dependency injection function

### Data Models (ORM)
- **app/models/models.py** (280 lines)
  - 9 SQLAlchemy ORM models:
    - Company
    - AIProject
    - MaturityAssessment, MaturityAnswer
    - ROISimulation
    - ArchitectureDesign
    - Roadmap
    - DiscoveryResult
    - WardleyMap
  - UUID primary keys
  - Timestamps (created_at, updated_at)
  - Foreign key relationships

### Validation Schemas (Pydantic)
- **app/schemas/schemas.py** (400 lines)
  - Request models (Create, Update)
  - Response models
  - Nested models (OpportunityItem, PhaseItem, etc.)
  - Field validation with constraints

### AI Service
- **app/services/ai_service.py** (500 lines)
  - AIService class with static methods
  - OpenAI integration with fallbacks
  - Use case generation
  - Architecture templates
  - Roadmap generation
  - Recommendation logic

### API Endpoints

| File | Lines | Endpoints | Purpose |
|------|-------|-----------|---------|
| health.py | 15 | GET /api/health | Health check |
| projects.py | 100 | GET/POST/PUT/DELETE /api/projects/* | Project CRUD |
| discovery.py | 30 | POST /api/discovery/generate | AI opportunities |
| maturity.py | 70 | POST /api/maturity/assess, GET /api/maturity/* | Assessments |
| roi.py | 80 | POST /api/roi/simulate | ROI calculations |
| architecture.py | 50 | POST /api/architecture/generate | ML architecture |
| roadmap.py | 40 | POST /api/roadmap/generate | Implementation plan |
| wardley.py | 60 | POST /api/wardley/generate | Strategy mapping |
| slides.py | 200 | POST /api/slides/export | PowerPoint export |

## Database Models Summary

### Companies (Base Entity)
- id: UUID (PK)
- name: String(255)
- industry: String(255)
- country: String(255)
- created_at, updated_at: DateTime

### AIProject
- id: UUID (PK)
- company_id: UUID (FK)
- name, description: String/Text
- status: String (planning, in_progress, completed)
- project_type: String
- created_at, updated_at: DateTime

### MaturityAssessment
- id: UUID (PK)
- company_id: UUID (FK)
- overall_score, strategy_score, infrastructure_score, data_score, people_score, governance_score: Float
- maturity_level: String
- recommendations: JSON
- created_at, updated_at: DateTime

### MaturityAnswer
- id: UUID (PK)
- assessment_id: UUID (FK)
- question_id: String
- domain: String
- score: Integer (1-5)
- created_at: DateTime

### ROISimulation
- id: UUID (PK)
- company_id, project_id: UUID (FK)
- Financial inputs: current_revenue, current_cost, revenue_increase_pct, cost_reduction_pct, implementation_cost, timeline_months, discount_rate
- Calculated outputs: revenue_benefit, cost_benefit, total_benefit, net_benefit, roi_percentage, payback_months, npv
- Scenarios: optimistic_scenario, pessimistic_scenario (JSON)
- created_at, updated_at: DateTime

### ArchitectureDesign
- id: UUID (PK)
- project_id: UUID (FK)
- architecture_type: String (batch, real_time, hybrid)
- components: JSON (array of component objects)
- diagram_svg: Text (SVG diagram)
- include_monitoring, include_feature_store: Boolean
- created_at, updated_at: DateTime

### Roadmap
- id: UUID (PK)
- company_id, project_id: UUID (FK)
- duration_months: Integer
- maturity_level: String
- phases: JSON (array of phase objects with milestones, deliverables)
- created_at, updated_at: DateTime

### DiscoveryResult
- id: UUID (PK)
- company_id: UUID (FK)
- industry: String
- business_problems: JSON (array of strings)
- opportunities: JSON (array of opportunity objects)
- created_at, updated_at: DateTime

### WardleyMap
- id: UUID (PK)
- company_id, project_id: UUID (FK)
- components: JSON (array with evolution_stage, visibility)
- build_recommendations, buy_recommendations, partner_recommendations: JSON
- created_at, updated_at: DateTime

## API Response Models

### DiscoveryResponse
```python
{
  "id": UUID,
  "industry": str,
  "opportunities": [
    {
      "use_case": str,
      "description": str,
      "prediction_target": str,
      "expected_roi": float,
      "complexity": str,  # low/medium/high
      "impact_score": float,  # 0-100
      "feasibility_score": float,  # 0-100
      "quadrant": str  # quick_wins/strategic/moonshots/research
    }
  ]
}
```

### MaturityResponse
```python
{
  "id": UUID,
  "overall_score": float,  # 1-5
  "maturity_level": str,  # beginner/developing/intermediate/advanced/expert
  "strategy_score": float,
  "infrastructure_score": float,
  "data_score": float,
  "people_score": float,
  "governance_score": float,
  "recommendations": {
    "recommendations": [str],
    "priority_areas": [(str, float)]
  }
}
```

### ROIResponse (Base Case)
```python
{
  "id": UUID,
  "base_case": {
    "revenue_benefit": float,
    "cost_benefit": float,
    "total_benefit": float,
    "net_benefit": float,
    "roi_percentage": float,
    "payback_months": float,
    "npv": float
  },
  "optimistic_scenario": {...},  # 1.3x multiplier
  "pessimistic_scenario": {...}   # 0.7x multiplier
}
```

### ArchitectureResponse
```python
{
  "id": UUID,
  "architecture_type": str,
  "components": [
    {
      "name": str,
      "description": str,
      "build_or_buy": str,  # build/buy
      "examples": [str]
    }
  ],
  "diagram_svg": str  # SVG diagram
}
```

### RoadmapResponse
```python
{
  "phases": [
    {
      "phase_number": int,
      "name": str,
      "description": str,
      "duration_months": int,
      "milestones": [
        {
          "name": str,
          "description": str,
          "timeline_weeks": int
        }
      ],
      "deliverables": [str]
    }
  ]
}
```

## Dependencies

### Core Framework
- fastapi==0.104.1 - Web framework
- uvicorn==0.24.0 - ASGI server

### Database
- sqlalchemy==2.0.23 - ORM
- psycopg2-binary==2.9.9 - PostgreSQL adapter

### Validation
- pydantic==2.5.0 - Data validation
- pydantic-settings==2.1.0 - Settings management

### AI Integration
- openai==1.3.9 - OpenAI API client

### Export
- python-pptx==0.6.21 - PowerPoint generation

### Utilities
- python-multipart==0.0.6 - File upload support

## Key Features

### AI Service with Fallback Logic
- Uses OpenAI when API key is configured
- Graceful fallback to rule-based/template logic
- No hard dependency on external APIs

### Intelligent Recommendations
- Domain-specific scoring
- Priority-based recommendations
- Customized guidance based on maturity levels

### Financial Modeling
- ROI calculations with NPV
- Three-scenario planning (base, optimistic, pessimistic)
- Payback period analysis

### Strategic Planning Tools
- Wardley mapping for technology strategy
- Phased implementation roadmaps
- Architecture design patterns

### Data Export
- PowerPoint presentations with analysis
- Customizable reports

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| OPENAI_API_KEY | No | None | OpenAI API key |
| OPENAI_MODEL | No | gpt-4o | OpenAI model |
| SECRET_KEY | No | default | Application secret |
| CORS_ORIGINS | No | localhost | CORS allowed origins |

## Running the Application

### Quick Start
```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env with DATABASE_URL
./run.sh
```

### Access
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
python test_api.py
```

Tests all major endpoints and validates responses.

## Documentation Files

- **README.md** - Quick start and basic usage
- **SETUP.md** - Detailed installation and configuration
- **ARCHITECTURE.md** - Technical architecture and design decisions
- **INDEX.md** - This file, complete reference

## Common Tasks

### Add New Endpoint
1. Create route in `app/api/{feature}.py`
2. Add Pydantic schemas in `app/schemas/schemas.py`
3. Add model in `app/models/models.py` if needed
4. Import router in `app/main.py`

### Add Database Migration
1. Update model in `app/models/models.py`
2. Use SQLAlchemy `alembic` for migrations
3. Or regenerate schema in `init.sql`

### Extend AI Service
1. Add method to `AIService` class
2. Implement OpenAI logic
3. Add fallback method
4. Call from API endpoint

### Configure for Production
1. Update `.env` with production DATABASE_URL
2. Set strong SECRET_KEY
3. Set specific CORS_ORIGINS
4. Use `gunicorn` with multiple workers
5. Set up reverse proxy (nginx)
6. Enable HTTPS/SSL

