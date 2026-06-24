"""AI Projects endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.database import get_db
from app.models import AIProject
from app.schemas import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=List[ProjectResponse])
def list_projects(
    company_id: UUID = None,
    db: Session = Depends(get_db)
):
    """List all projects, optionally filtered by company."""
    query = db.query(AIProject)

    if company_id:
        query = query.filter(AIProject.company_id == company_id)

    projects = query.all()
    return projects


@router.post("", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project."""
    db_project = AIProject(
        company_id=project.company_id,
        name=project.name,
        description=project.description,
        project_type=project.project_type,
        status="planning"
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a specific project."""
    project = db.query(AIProject).filter(AIProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: UUID,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update a project."""
    project = db.query(AIProject).filter(AIProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}")
def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a project."""
    project = db.query(AIProject).filter(AIProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"deleted": str(project_id)}
