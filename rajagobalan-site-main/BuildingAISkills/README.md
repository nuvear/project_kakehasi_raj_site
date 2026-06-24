# AI Transformation Command Center — Version 7

A **production-grade AI Transformation Platform** for enterprise consulting, internal transformation, and AI strategy workshops.

## What This Platform Does

| Module | Purpose |
|--------|---------|
| **Dashboard** | Visual command center with maturity scores, portfolio heatmap, ROI projections |
| **Discovery Engine** | Enter industry + problem → get AI use cases with ROI estimates |
| **Portfolio Manager** | Interactive Impact/Feasibility matrix with draggable project bubbles |
| **Maturity Assessment** | 40-question assessment across 6 domains with benchmarking |
| **ROI Simulator** | Revenue increase, cost savings, NPV, payback period calculations |
| **Architecture Generator** | Auto-generates ML pipeline architecture diagrams |
| **Wardley Mapping** | Build vs. Buy decision tool based on component evolution |
| **Roadmap Generator** | 12-24 month transformation roadmap with phases |
| **Slide Generator** | Export strategy decks as PowerPoint/PDF |

## Tech Stack

```
Frontend:   Next.js 14 + React + Tailwind CSS + Chart.js + D3
Backend:    Python FastAPI + SQLAlchemy + Pydantic
AI Layer:   OpenAI API + LangChain
Database:   PostgreSQL
Analytics:  DuckDB (embedded)
Deploy:     Docker + docker-compose
```

## Quick Start

### Option 1: Docker (Recommended)

```bash
cp .env.example .env
# Edit .env with your OpenAI API key and database credentials

docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Database:**
```bash
# Start PostgreSQL locally or via Docker:
docker run -d --name ai-platform-db \
  -e POSTGRES_DB=ai_platform \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=changeme \
  -p 5432:5432 postgres:16
```

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/       # Module-specific React components
│   │   │   ├── dashboard/    # Main dashboard widgets
│   │   │   ├── discovery/    # AI Opportunity Discovery
│   │   │   ├── portfolio/    # Portfolio Manager (matrix)
│   │   │   ├── maturity/     # Maturity Assessment
│   │   │   ├── roi/          # ROI Simulator
│   │   │   ├── architecture/ # Architecture Generator
│   │   │   ├── roadmap/      # Roadmap Generator
│   │   │   ├── wardley/      # Wardley Mapping
│   │   │   └── slides/       # Slide Generator
│   │   ├── pages/            # Next.js pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helpers, API client
│   │   └── styles/           # Tailwind config, globals
│   ├── package.json
│   └── next.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry
│   │   ├── api/              # Route handlers
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response models
│   │   ├── services/         # Business logic + AI integrations
│   │   └── utils/            # Helpers
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/
│   └── init.sql              # Database initialization
│
├── docker/
│   └── nginx.conf            # Reverse proxy config
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://admin:changeme@db:5432/ai_platform` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | (required) |
| `OPENAI_MODEL` | Model to use | `gpt-4o` |
| `SECRET_KEY` | JWT signing key | `change-this-in-production` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/discovery/generate` | Generate AI use cases from business problem |
| `GET` | `/api/projects` | List all AI projects |
| `POST` | `/api/projects` | Create new AI project |
| `PUT` | `/api/projects/{id}` | Update project (position, scores) |
| `POST` | `/api/maturity/assess` | Submit maturity assessment |
| `GET` | `/api/maturity/{company_id}` | Get maturity results |
| `POST` | `/api/roi/simulate` | Run ROI simulation |
| `POST` | `/api/architecture/generate` | Generate architecture diagram |
| `POST` | `/api/roadmap/generate` | Generate transformation roadmap |
| `POST` | `/api/slides/export` | Export slides as PPTX |

## For Cursor / Cowork Users

This project is designed to be opened in Cursor or any AI-assisted IDE. Key files to start with:

1. `backend/app/main.py` — FastAPI app setup
2. `frontend/src/pages/index.jsx` — Dashboard entry point
3. `docker-compose.yml` — One-command deployment
4. `database/init.sql` — Database schema

### Cursor Workflow
```
1. Open the project root folder in Cursor
2. Run `docker-compose up --build` in the terminal
3. Use Cursor's AI to iterate on any module
4. Frontend hot-reloads; backend auto-restarts
```

## License

MIT — Use freely for consulting, internal tools, or commercial products.
