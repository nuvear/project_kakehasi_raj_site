# AI Transformation Command Center - Local Review Guide

This guide provides instructions for architects and developers to set up and run the **AI Transformation Command Center** application locally for review.

## Prerequisites

Ensure you have the following installed on your machine:
- **Python 3.9+**
- **Node.js 18+** & **npm**
- **Git** (if cloning from a repo, though you likely have access to the shared folder)

## Project Structure

The project is organized into two main directories:
- `backend/`: FastAPI application (Python) handling business logic, database, and AI integrations.
- `frontend/`: Next.js application (React) providing the user interface.

## 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:
    - **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
    - **Windows**:
        ```bash
        venv\Scripts\activate
        ```

4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Environment Configuration**:
    - Ensure a `.env` file exists in the root `enterprise-ai-platform/` directory (or `backend/` depending on setup, but the app looks in parent directories too).
    - It should contain:
        ```ini
        DATABASE_URL=sqlite:///backend/ai_platform.db
        OPENAI_API_KEY=your_openai_api_key_here
        SECRET_KEY=your_secret_key
        CORS_ORIGINS=http://localhost:3000
        ```
    - *Note: If you don't have an OpenAI key, the application will use fallback templates for AI features.*

6.  **Database Initialization**:
    - Initialize and seed the SQLite database with demo data:
        ```bash
        python seed_db.py
        ```
    - You should see "Seeding complete!" in the output.

7.  **Start the Backend Server**:
    ```bash
    uvicorn app.main:app --reload
    ```
    - The API will be available at `http://localhost:8000`.
    - API Documentation (Swagger UI) is at `http://localhost:8000/docs`.

## 2. Frontend Setup

1.  Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Start the Frontend Development Server**:
    ```bash
    npm run dev
    ```
    - The application will be available at `http://localhost:3000`.

## 3. Review Walkthrough

Once both servers are running, open `http://localhost:3000` in your browser. You can review the full end-to-end AI transformation lifecycle:

1.  **Home**: Landing page with feature overview and quick access.
2.  **Dashboard**: Executive view of project status, ROI, and portfolio health.
3.  **Discovery Engine**: Generate AI use cases based on industry and business problems.
4.  **Portfolio Manager**: Visualize projects on an Impact vs. Feasibility matrix.
5.  **Maturity Assessment**: Evaluate organizational readiness across 5 domains.
6.  **ROI Simulator**: Project financial impact (NPV, IRR) with scenario modeling.
7.  **Architecture Generator**: Create ML system blueprints (Batch, Real-time, Hybrid).
8.  **Wardley Mapping**: Strategic analysis for Build vs. Buy decisions.
9.  **Roadmap Generator**: Phased implementation planning with milestones.

## 4. Troubleshooting

- **Port Conflicts**:
    - If port `8000` (Backend) or `3000` (Frontend) is in use, kill the process using:
        ```bash
        lsof -i :<port> | awk 'NR!=1 {print $2}' | xargs kill -9
        ```
- **Database Errors**:
    - If you see "No assessment found" or empty data, re-run `python seed_db.py` in the `backend/` directory.
- **Missing Dependencies**:
    - Ensure your virtual environment is activated (`source venv/bin/activate`) when running backend commands.
