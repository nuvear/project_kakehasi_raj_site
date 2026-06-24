# Cursor & Cowork Setup Instructions

## For Cursor IDE

### 1. Open the project
```bash
# Open the enterprise-ai-platform folder in Cursor
cursor /path/to/Enterprise\ AI\ Transformation/enterprise-ai-platform
```

### 2. Start the platform
```bash
# Copy environment file
cp .env.example .env

# Edit .env — add your OpenAI API key (optional, platform works without it)
# The Discovery Engine falls back to rule-based matching without an API key

# Start everything
docker-compose up --build
```

### 3. Access the platform
- **Frontend**: http://localhost:3000 (Dashboard)
- **Backend API**: http://localhost:8000 (FastAPI)
- **API Docs**: http://localhost:8000/docs (Swagger UI — interactive!)
- **Database**: localhost:5432 (PostgreSQL)

### 4. Development workflow
The docker-compose mounts source directories as volumes, so:
- Edit `frontend/src/` → Next.js hot-reloads automatically
- Edit `backend/app/` → Uvicorn auto-restarts

### 5. Use Cursor AI to build module UIs
Each module has a dedicated component directory. Ask Cursor to:

```
"Build the Discovery Engine UI in src/components/discovery/DiscoveryForm.jsx
that calls POST /api/discovery/generate with industry and business_problems,
then displays the returned AI opportunities as cards with impact/feasibility scores."
```

```
"Build the Portfolio Manager in src/components/portfolio/MatrixView.jsx
that fetches projects from GET /api/projects and displays them as a
draggable scatter plot on an Impact vs Feasibility matrix using Chart.js."
```

```
"Build the ROI Simulator in src/components/roi/ROICalculator.jsx
that has input fields for revenue, costs, and timeline, calls
POST /api/roi/simulate, and displays results with a bar chart."
```

---

## For Cowork (Claude Desktop Agent)

### Setup steps
1. **Copy the project** to your shared Cowork folder:
   ```
   /Users/rajkumarrajagobalan/Library/Application Support/Claude/
   local-agent-mode-sessions/.../outputs/Enterprise AI Transformation/
   enterprise-ai-platform/
   ```

2. **Tell Cowork**:
   ```
   "Open the enterprise-ai-platform project. Run docker-compose up --build
   to start the platform. The frontend is at localhost:3000 and the API
   docs are at localhost:8000/docs."
   ```

3. **Build modules iteratively** by asking Cowork:
   ```
   "Build the Discovery Engine frontend component. It should have a form
   with Industry dropdown and Business Problems text area. When submitted,
   it calls POST /api/discovery/generate and shows AI opportunity cards."
   ```

### Module-by-module Cowork prompts

**Discovery Engine:**
```
Build src/components/discovery/DiscoveryForm.jsx:
- Industry dropdown (Retail, Healthcare, Manufacturing, Financial Services, Technology)
- Business Problems textarea (one per line)
- Submit button that calls POST /api/discovery/generate
- Display results as cards showing: use_case, prediction_target, expected_roi, complexity
- Color-code cards by quadrant (Quick Win = teal, Big Bet = gold)
```

**Portfolio Matrix:**
```
Build src/components/portfolio/MatrixView.jsx:
- Scatter plot using Chart.js (react-chartjs-2)
- X-axis: Feasibility (1-10), Y-axis: Impact (1-10)
- Each project is a bubble, colored by quadrant
- Quadrant labels in each corner
- Fetch data from GET /api/projects?company_id=a0000000-0000-0000-0000-000000000001
```

**Maturity Assessment:**
```
Build src/components/maturity/AssessmentWizard.jsx:
- Multi-step form with 6 domains (strategy, data, technology, talent, governance, culture)
- Each domain has 6-7 questions rated 1-5
- Submit calls POST /api/maturity/assess
- Results page shows radar chart and recommendations
```

**ROI Simulator:**
```
Build src/components/roi/ROICalculator.jsx:
- Input fields: current_revenue, current_cost, revenue_increase_pct, cost_reduction_pct, implementation_cost, timeline_months
- Three scenario tabs: Base, Optimistic, Pessimistic
- Submit calls POST /api/roi/simulate
- Display: ROI %, Payback months, NPV, total benefit
- Bar chart comparing scenarios
```

**Architecture Generator:**
```
Build src/components/architecture/ArchitectureBuilder.jsx:
- Form: project_name, architecture_type (batch/real_time/hybrid), checkboxes for monitoring and feature_store
- Submit calls POST /api/architecture/generate
- Render the returned SVG diagram
- Show component list with build/buy labels
```

**Roadmap Generator:**
```
Build src/components/roadmap/RoadmapTimeline.jsx:
- Input: duration_months slider (12-24), maturity_level dropdown
- Submit calls POST /api/roadmap/generate
- Display as horizontal timeline with 3 phases
- Each phase shows milestones as checklist items
```

---

## API Quick Reference

All endpoints accept/return JSON. Demo company ID: `a0000000-0000-0000-0000-000000000001`

| Endpoint | Method | Body |
|----------|--------|------|
| `/api/health` | GET | — |
| `/api/projects` | GET | `?company_id=UUID` |
| `/api/projects` | POST | `{company_id, name, impact_score, feasibility_score}` |
| `/api/projects/{id}` | PUT | `{impact_score, feasibility_score, status}` |
| `/api/discovery/generate` | POST | `{industry, business_problems: [...]}` |
| `/api/maturity/assess` | POST | `{company_id, answers: [{question_id, domain, score}]}` |
| `/api/maturity/{company_id}` | GET | — |
| `/api/roi/simulate` | POST | `{company_id, current_revenue, current_cost, revenue_increase_pct, cost_reduction_pct, implementation_cost}` |
| `/api/architecture/generate` | POST | `{project_name, architecture_type, include_monitoring}` |
| `/api/roadmap/generate` | POST | `{company_id, duration_months, maturity_level}` |

## Database Access

```bash
# Connect to the database
docker exec -it enterprise-ai-platform-db-1 psql -U admin -d ai_platform

# View projects
SELECT name, impact_score, feasibility_score, quadrant, status FROM ai_projects;

# View maturity
SELECT * FROM maturity_assessments;
```
