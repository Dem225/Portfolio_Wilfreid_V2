
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project
from schemas.project_schema import ProjectCreate, ProjectUpdate


# CREATE : créer un projet
async def create_project(
    db: AsyncSession,
    project_data: ProjectCreate
):
    new_project = Project(**project_data.model_dump())

    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    return new_project


# READ : récupérer tous les projets
async def get_all_projects(db: AsyncSession):
    result = await db.execute(
        select(Project).order_by(Project.created_at.desc())
    )

    return result.scalars().all()


# READ : récupérer un projet par son ID
async def get_project_by_id(
    db: AsyncSession,
    project_id: int
):
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )

    return result.scalar_one_or_none()


# UPDATE : modifier un projet
async def update_project(
    db: AsyncSession,
    project: Project,
    project_data: ProjectUpdate
):
    update_data = project_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)

    return project


# DELETE : supprimer un projet
async def delete_project(
    db: AsyncSession,
    project: Project
):
    await db.delete(project)
    await db.commit()

    return True
