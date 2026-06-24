"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.models import Base

# Import all routers
from app.api import health, projects, discovery, maturity, roi, architecture, roadmap, wardley, slides


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for app startup and shutdown."""
    # Startup
    print("Starting up FastAPI application...")
    Base.metadata.create_all(bind=engine)
    print("Database tables ready")

    yield

    # Shutdown
    print("Shutting down FastAPI application...")


# Create FastAPI app
app = FastAPI(
    title="AI Transformation Command Center",
    description="Backend for AI transformation platform",
    version="7.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(projects.router)
app.include_router(discovery.router)
app.include_router(maturity.router)
app.include_router(roi.router)
app.include_router(architecture.router)
app.include_router(roadmap.router)
app.include_router(wardley.router)
app.include_router(slides.router)


# Root endpoint
@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "AI Transformation Command Center",
        "version": "7.0",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }
