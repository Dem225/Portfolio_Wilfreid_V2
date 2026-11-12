
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.project_schema import ProjectCreate, ProjectUpdate, ProjectResponse
from services import project_service
from dependencies.auth import get_current_admin















router = APIRouter(
    prefix="/projects",
    tags=["Projets"]
)


# CREATE : créer un projet
@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return await project_service.create_project(db, project_data)


# READ : récupérer tous les projets
@router.get("/", response_model=list[ProjectResponse])
async def get_projects(db: AsyncSession = Depends(get_db)):
    return await project_service.get_all_projects(db)


# READ : récupérer un projet par son ID
@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    project = await project_service.get_project_by_id(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projet introuvable"
        )

    return project


# UPDATE : modifier un projet
@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    project = await project_service.get_project_by_id(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projet introuvable"
        )

    return await project_service.update_project(
        db,
        project,
        project_data
    )

# DELETE : supprimer un projet
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    project = await project_service.get_project_by_id(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projet introuvable"
        )

    await project_service.delete_project(db, project)

    return Response(status_code=status.HTTP_204_NO_CONTENT)