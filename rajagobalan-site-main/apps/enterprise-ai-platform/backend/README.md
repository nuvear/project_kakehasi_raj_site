# AI Transformation Command Center - Backend

FastAPI backend for the AI Transformation Command Center platform.

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/db`)
- `OPENAI_API_KEY`: (Optional) OpenAI API key for enhanced features
- `OPENAI_MODEL`: (Optional, default: `gpt-4o`) OpenAI model to use
- `SECRET_KEY`: Application secret key
- `CORS_ORIGINS`: Comma-separated list of allowed origins

### 3. Create database

Ensure PostgreSQL is running and create the database with the schema:

```bash
createdb ai_platform
psql ai_platform < init.sql
```

### 4. Run the server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health
- `GET /api/health` - Health check

### Projects
- `GET /api/projects?company_id=UUID` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Discovery
- `POST /api/discovery/generate` - Generate AI use case opportunities

### Maturity Assessment
- `POST /api/maturity/assess` - Conduct maturity assessment
- `GET /api/maturity/{company_id}` - Get latest assessment

### ROI Simulation
- `POST /api/roi/simulate` - Simulate ROI with scenarios

### Architecture
- `POST /api/architecture/generate` - Generate ML architecture design

### Roadmap
- `POST /api/roadmap/generate` - Generate implementation roadmap

### Wardley Map
- `POST /api/wardley/generate` - Generate Wardley map for strategy

### Slides
- `POST /api/slides/export` - Export analysis as PowerPoint

## Project Structure

```
app/
├── __init__.py
├── main.py           # FastAPI application entry point
├── config.py         # Configuration from environment
├── database.py       # SQLAlchemy setup
├── models/
│   ├── __init__.py
│   └── models.py     # ORM models
├── schemas/
│   ├── __init__.py
│   └── schemas.py    # Pydantic models
├── services/
│   ├── __init__.py
│   └── ai_service.py # OpenAI integration with fallbacks
├── utils/
│   └── __init__.py
└── api/
    ├── __init__.py
    ├── health.py     # Health check
    ├── projects.py   # Project CRUD
    ├── discovery.py  # AI use case discovery
    ├── maturity.py   # Maturity assessment
    ├── roi.py        # ROI simulation
    ├── architecture.py # ML architecture design
    ├── roadmap.py    # Implementation roadmap
    ├── wardley.py    # Wardley mapping
    └── slides.py     # PowerPoint export
```

## Features

### AI Service
The `AIService` class provides intelligent capabilities with fallbacks:
- **Use Case Discovery**: Generates AI opportunities based on industry and problems (OpenAI + fallback)
- **Architecture Design**: Creates ML pipeline architectures (OpenAI + template fallback)
- **Roadmap Generation**: Plans 3-phase implementation roadmaps (OpenAI + template fallback)
- **Recommendations**: Generates improvement recommendations based on maturity scores

### Database Models
- **Companies**: Organization information
- **AIProject**: AI transformation projects
- **MaturityAssessment**: Organizational AI maturity evaluation
- **MaturityAnswer**: Individual assessment responses
- **ROISimulation**: Financial projections with 3 scenarios
- **ArchitectureDesign**: ML system architecture
- **Roadmap**: Implementation phasing
- **DiscoveryResult**: AI use case opportunities
- **WardleyMap**: Strategic technology positioning

## Demo Company

A demo company is pre-configured with ID:
```
a0000000-0000-0000-0000-000000000001
```

Use this for testing without creating a new company record.

## License

Proprietary - AI Transformation Command Center
