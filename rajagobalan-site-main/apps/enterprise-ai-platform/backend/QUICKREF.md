# FastAPI Backend - Quick Reference

## File Locations

All files are in: `/sessions/dreamy-funny-goodall/proj/backend/`

Core app files in: `/sessions/dreamy-funny-goodall/proj/backend/app/`

## Quick Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with DATABASE_URL

# Start server
./run.sh
# OR
uvicorn app.main:app --reload

# Test API
python test_api.py

# Access documentation
# Browser: http://localhost:8000/docs
```

## Project Structure Summary

```
app/
├── main.py                 → FastAPI app + router registration
├── config.py               → Settings from environment
├── database.py             → SQLAlchemy setup
├── models/models.py        → 9 ORM models
├── schemas/schemas.py      → Pydantic validation
├── services/ai_service.py  → AI + fallback logic
└── api/                    → 9 endpoint modules
    ├── health.py           → /api/health
    ├── projects.py         → /api/projects/*
    ├── discovery.py        → /api/discovery/generate
    ├── maturity.py         → /api/maturity/*
    ├── roi.py              → /api/roi/simulate
    ├── architecture.py     → /api/architecture/generate
    ├── roadmap.py          → /api/roadmap/generate
    ├── wardley.py          → /api/wardley/generate
    └── slides.py           → /api/slides/export
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/health | Health check |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| GET | /api/projects/{id} | Get project |
| PUT | /api/projects/{id} | Update project |
| DELETE | /api/projects/{id} | Delete project |
| POST | /api/discovery/generate | Generate opportunities |
| POST | /api/maturity/assess | Conduct assessment |
| GET | /api/maturity/{company_id} | Get assessment |
| POST | /api/roi/simulate | Calculate ROI |
| POST | /api/architecture/generate | Design architecture |
| POST | /api/roadmap/generate | Create roadmap |
| POST | /api/wardley/generate | Generate Wardley map |
| POST | /api/slides/export | Export PowerPoint |

## Database Models (9 Tables)

1. **companies** - Organizations
2. **ai_projects** - Projects (FK: company)
3. **maturity_assessments** - Assessment scores (FK: company)
4. **maturity_answers** - Individual responses (FK: assessment)
5. **roi_simulations** - Financial projections (FK: company, project)
6. **architecture_designs** - ML designs (FK: project)
7. **roadmaps** - Implementation plans (FK: company, project)
8. **discovery_results** - Use case opportunities (FK: company)
9. **wardley_maps** - Strategic maps (FK: company, project)

## Key Imports

```python
# Core
from app.main import app
from app.config import settings
from app.database import get_db

# Models
from app.models import (
    Company, AIProject, MaturityAssessment,
    ROISimulation, ArchitectureDesign, Roadmap
)

# Schemas
from app.schemas import (
    ProjectCreate, DiscoveryRequest,
    MaturityAssessRequest, ROIRequest
)

# Services
from app.services.ai_service import AIService
```

## Demo Company ID

Use for testing:
```
a0000000-0000-0000-0000-000000000001
```

## Environment Variables

```env
# REQUIRED
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_platform

# OPTIONAL
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
SECRET_KEY=your-key
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

## Common Curl Examples

```bash
# Health check
curl http://localhost:8000/api/health

# List projects
curl "http://localhost:8000/api/projects?company_id=a0000000-0000-0000-0000-000000000001"

# Generate discovery
curl -X POST http://localhost:8000/api/discovery/generate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "a0000000-0000-0000-0000-000000000001",
    "industry": "finance",
    "business_problems": ["fraud", "risk"]
  }'
```

## Response Format

All successful responses:
```json
{
  "id": "uuid",
  "field1": "value",
  "created_at": "2024-01-01T12:00:00",
  "updated_at": "2024-01-01T12:00:00"
}
```

Errors:
```json
{
  "detail": "Error message"
}
```

## Important Files to Review

1. **README.md** - Quick start guide
2. **SETUP.md** - Detailed configuration
3. **ARCHITECTURE.md** - Technical details
4. **INDEX.md** - Complete reference

## Troubleshooting Checklist

- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] .env file exists with DATABASE_URL
- [ ] PostgreSQL running: `psql ai_platform -c "SELECT 1"`
- [ ] Database schema created: `psql ai_platform < init.sql`
- [ ] Server starting: `uvicorn app.main:app --reload`
- [ ] API responding: `curl http://localhost:8000/api/health`
- [ ] Swagger docs available: `http://localhost:8000/docs`

## Development Tips

- Enable SQLAlchemy echo for SQL debugging:
  ```python
  # In database.py
  engine = create_engine(DATABASE_URL, echo=True)
  ```

- Access database directly:
  ```bash
  psql ai_platform
  SELECT * FROM companies;
  ```

- Check API requests with Swagger UI:
  - http://localhost:8000/docs
  - Click "Try it out" on any endpoint

- View all routes:
  ```bash
  curl http://localhost:8000/openapi.json
  ```

## Production Deployment

```bash
# Install gunicorn
pip install gunicorn

# Run with multiple workers
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000

# Or use Docker
docker build -t ai-platform .
docker run -p 8000:8000 -e DATABASE_URL=... ai-platform
```

## Architecture Types Supported

- **batch** - Scheduled predictions, daily/weekly
- **real_time** - Immediate predictions, <100ms latency
- **hybrid** - Mix of batch and real-time

## Maturity Levels

- beginner (1.0-1.5)
- developing (1.5-2.5)
- intermediate (2.5-3.5)
- advanced (3.5-4.5)
- expert (4.5-5.0)

## Opportunity Quadrants

- **quick_wins** - High feasibility, medium impact
- **strategic** - Medium feasibility, high impact
- **moonshots** - Low feasibility, very high impact
- **research** - Experimental, long-term potential

## Files Created

Total: 21 Python files + 7 documentation files

### Python Files (app/)
```
app/__init__.py
app/main.py
app/config.py
app/database.py
app/models/__init__.py
app/models/models.py
app/schemas/__init__.py
app/schemas/schemas.py
app/services/__init__.py
app/services/ai_service.py
app/utils/__init__.py
app/api/__init__.py
app/api/health.py
app/api/projects.py
app/api/discovery.py
app/api/maturity.py
app/api/roi.py
app/api/architecture.py
app/api/roadmap.py
app/api/wardley.py
app/api/slides.py
```

### Configuration Files
```
requirements.txt
.env.example
run.sh
test_api.py
```

### Documentation
```
README.md
SETUP.md
ARCHITECTURE.md
INDEX.md
QUICKREF.md (this file)
```

## Performance Notes

- SQLAlchemy connection pooling enabled
- JSON fields for flexible nested data
- UUID primary keys for security
- Timestamps for audit trail
- Indexes on foreign keys

## Next Steps

1. Install dependencies: `pip install -r requirements.txt`
2. Configure .env with DATABASE_URL
3. Initialize database: `psql ai_platform < init.sql`
4. Start server: `./run.sh`
5. Test API: `python test_api.py`
6. Review docs: http://localhost:8000/docs

