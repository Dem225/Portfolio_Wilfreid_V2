
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.skill_schema import SkillCreate, SkillUpdate, SkillResponse
from services import skill_service
from dependencies.auth import get_current_admin

router = APIRouter(
    prefix="/skills",
    tags=["Compétences"]
)


# CREATE : créer une compétence
@router.post(
    "/",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_skill(
    skill_data: SkillCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return await skill_service.create_skill(db, skill_data)

# READ : récupérer toutes les compétences
@router.get("/", response_model=list[SkillResponse])
async def get_skills(db: AsyncSession = Depends(get_db)):
    return await skill_service.get_all_skills(db)


# READ : récupérer une compétence par son ID
@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db)
):
    skill = await skill_service.get_skill_by_id(db, skill_id)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compétence introuvable"
        )

    return skill


# UPDATE : modifier une compétence
@router.patch("/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    skill_data: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    skill = await skill_service.get_skill_by_id(db, skill_id)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compétence introuvable"
        )

    return await skill_service.update_skill(
        db,
        skill,
        skill_data
    )

# DELETE : supprimer une compétence
@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    skill = await skill_service.get_skill_by_id(db, skill_id)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compétence introuvable"
        )

    await skill_service.delete_skill(db, skill)

    return Response(status_code=status.HTTP_204_NO_CONTENT)