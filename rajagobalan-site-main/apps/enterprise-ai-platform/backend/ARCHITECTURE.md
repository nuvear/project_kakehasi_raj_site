# AI Transformation Command Center - Backend Architecture

## Overview

This is a complete FastAPI backend for the AI Transformation Command Center platform. The system helps organizations assess their AI maturity, discover AI opportunities, and plan their digital transformation journey.

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL (async ORM via SQLAlchemy)
- **API Server**: Uvicorn
- **AI Integration**: OpenAI API (with intelligent fallbacks)
- **Validation**: Pydantic v2
- **Documentation**: AutoDoc with Swagger UI

## Core Components

### 1. Configuration (`app/config.py`)
- Loads environment variables using Pydantic BaseSettings
- Required: DATABASE_URL, SECRET_KEY
- Optional: OPENAI_API_KEY, OPENAI_MODEL
- CORS configuration from environment

### 2. Database Layer (`app/database.py`)
- SQLAlchemy synchronous engine and session factory
- Dependency injection via `get_db()` for FastAPI
- Connection pooling and health checks enabled

### 3. Data Models (`app/models/models.py`)
Nine SQLAlchemy ORM models mapping database tables:

```
companies
├── ai_projects
├── maturity_assessments
│   └── maturity_answers
├── roi_simulations
├── discovery_results
├── architecture_designs
├── roadmaps
└── wardley_maps
```

Each model:
- Uses UUID primary keys
- Includes `created_at` and `updated_at` timestamps
- Uses PostgreSQL-specific column types

### 4. Validation Schemas (`app/schemas/schemas.py`)
Pydantic v2 models for request/response validation:
- **ProjectCreate/Update/Response**: Project management
- **DiscoveryRequest/Response**: Use case discovery
- **MaturityAssessRequest/Response**: Maturity assessment
- **ROIRequest/Response**: ROI simulation
- **ArchitectureRequest/Response**: ML architecture
- **RoadmapRequest/Response**: Implementation planning
- **WardleyRequest/Response**: Strategic mapping

### 5. AI Service (`app/services/ai_service.py`)
Intelligent AI wrapper with graceful fallbacks:

**Key Methods:**
- `generate_use_cases()`: AI discovery with rule-based fallback
- `generate_architecture()`: Architecture design with templates
- `generate_roadmap()`: Phased roadmap with templates
- `generate_recommendations()`: Smart recommendations based on scores

**Fallback Strategy:**
- If OPENAI_API_KEY is configured, uses OpenAI API
- Falls back to rule-based/template logic if API fails or not configured
- No dependencies on external services for core functionality

### 6. API Routers

#### Health Check (`app/api/health.py`)
```
GET /api/health → {status: "ok", version: "7.0"}
```

#### Projects (`app/api/projects.py`)
```
GET    /api/projects?company_id=UUID     - List projects
POST   /api/projects                      - Create project
GET    /api/projects/{id}                 - Get project
PUT    /api/projects/{id}                 - Update project
DELETE /api/projects/{id}                 - Delete project
```

#### Discovery (`app/api/discovery.py`)
```
POST /api/discovery/generate
  Input: industry, business_problems
  Output: opportunities with quadrant mapping
```

#### Maturity (`app/api/maturity.py`)
```
POST /api/maturity/assess
  Input: answers to assessment questions
  Output: domain scores, level, recommendations

GET /api/maturity/{company_id}
  Output: latest assessment
```

#### ROI (`app/api/roi.py`)
```
POST /api/roi/simulate
  Input: financial parameters
  Output: base case + optimistic/pessimistic scenarios
  Calculates: ROI%, NPV, payback period
```

#### Architecture (`app/api/architecture.py`)
```
POST /api/architecture/generate
  Input: project name, architecture type
  Output: components, build/buy recommendations, SVG diagram
```

#### Roadmap (`app/api/roadmap.py`)
```
POST /api/roadmap/generate
  Input: duration, maturity level
  Output: 3-phase roadmap with milestones and deliverables
```

#### Wardley (`app/api/wardley.py`)
```
POST /api/wardley/generate
  Input: company/project context
  Output: components with evolution stages, strategic recommendations
```

#### Slides (`app/api/slides.py`)
```
POST /api/slides/export
  Output: PowerPoint file with strategy summary
```

## Request/Response Flow

### Example: Discovery Request
```json
POST /api/discovery/generate
{
  "company_id": "a0000000-0000-0000-0000-000000000001",
  "industry": "retail",
  "business_problems": ["customer churn", "inventory loss"]
}

Response:
{
  "id": "uuid",
  "industry": "retail",
  "opportunities": [
    {
      "use_case": "Churn Prediction",
      "description": "...",
      "expected_roi": 25.0,
      "complexity": "medium",
      "impact_score": 82,
      "feasibility_score": 85,
      "quadrant": "quick_wins"
    }
  ]
}
```

### Example: ROI Simulation
```json
POST /api/roi/simulate
{
  "company_id": "uuid",
  "current_revenue": 10000000,
  "current_cost": 3000000,
  "revenue_increase_pct": 15.0,
  "cost_reduction_pct": 20.0,
  "implementation_cost": 500000,
  "timeline_months": 24,
  "discount_rate": 0.1
}

Response:
{
  "id": "uuid",
  "base_case": {
    "roi_percentage": 180.0,
    "net_benefit": 1900000,
    "payback_months": 4.2,
    "npv": 1234567
  },
  "optimistic_scenario": {...},
  "pessimistic_scenario": {...}
}
```

## AI Service Fallback Logic

### Use Case Discovery
**With OpenAI**: Uses GPT to analyze industry and problems for custom opportunities

**Fallback**: Rule-based mapping:
- Finance: Fraud Detection, Credit Scoring, Portfolio Optimization
- Retail: Demand Forecasting, Customer Segmentation, Churn Prediction
- Healthcare: Disease Prediction, Treatment Optimization, Resource Planning
- Manufacturing: Predictive Maintenance, Quality Control

### Architecture Design
**With OpenAI**: Custom architectures for project-specific needs

**Fallback**: Template-based:
- Batch: Data Ingestion → Storage → Processing → Training → Batch Prediction
- Real-time: Event Stream → Feature Store → Model Serving → API Response
- Hybrid: Combines both paths

### Roadmap Generation
**With OpenAI**: Tailored phasing based on organizational context

**Fallback**: Standard 3-phase roadmap:
1. Foundation & Assessment (Strategy, Readiness, Pilot Selection)
2. Pilot & Scale (Infrastructure, Execution, Evaluation)
3. Operationalization & Growth (MLOps, Multi-Project, Team Scaling)

## Security Features

1. **CORS Middleware**: Configurable allowed origins
2. **Database Connection Pooling**: Connection health checks
3. **Pydantic Validation**: Input data validation
4. **Environment-based Secrets**: No hardcoded credentials
5. **UUID Primary Keys**: Protection against sequential ID attacks
6. **Timestamps**: Audit trail via created_at/updated_at

## Performance Optimizations

1. **Connection Pooling**: Reuses database connections
2. **Query Filtering**: Compound indexes on common queries
3. **JSON Storage**: For flexible nested data (opportunities, phases, components)
4. **Caching**: SQLAlchemy query caching
5. **Lazy Loading**: Only fetch related data when needed

## Database Schema Relationships

```
companies (1)
  ├─── (N) ai_projects
  ├─── (N) maturity_assessments
  │        └─ (N) maturity_answers
  ├─── (N) roi_simulations
  ├─── (N) discovery_results
  ├─── (N) roadmaps
  ├─── (N) wardley_maps
  
ai_projects (1)
  ├─── (N) roi_simulations
  ├─── (1) architecture_designs
  └─── (N) roadmaps
```

## Demo Company

Pre-configured for testing:
```
ID: a0000000-0000-0000-0000-000000000001
```

Use in API requests without creating new company records.

## Running the Application

### Development
```bash
# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL and optional OPENAI_API_KEY

# Run server
uvicorn app.main:app --reload

# Or use provided script
./run.sh
```

### Production
```bash
# Install dependencies
pip install -r requirements.txt

# Setup environment
export DATABASE_URL="postgresql://..."
export SECRET_KEY="your-secret-key"

# Run with production server (Gunicorn)
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Invalid request
- `404`: Not found
- `500`: Server error

Error responses include descriptive messages:
```json
{
  "detail": "Project not found"
}
```

## Testing

Use provided `test_api.py`:
```bash
# Start server first
./run.sh

# In another terminal
python test_api.py
```

Tests cover all major endpoints and demonstrate request/response formats.

## Future Enhancements

- [ ] Authentication/Authorization (JWT, OAuth)
- [ ] Rate limiting
- [ ] Request logging and monitoring
- [ ] Caching layer (Redis)
- [ ] Webhook notifications
- [ ] Background job queue (Celery)
- [ ] Model versioning
- [ ] A/B testing framework
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant support
