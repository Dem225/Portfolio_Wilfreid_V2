from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.skill import Skill
from schemas.skill_schema import SkillCreate, SkillUpdate


# CREATE : créer une compétence
async def create_skill(db: AsyncSession, skill_data: SkillCreate):
    new_skill = Skill(**skill_data.model_dump())

    db.add(new_skill)
    await db.commit()
    await db.refresh(new_skill)

    return new_skill


# READ : récupérer toutes les compétences
async def get_all_skills(db: AsyncSession):
    result = await db.execute(
        select(Skill).order_by(Skill.created_at.desc())
    )

    return result.scalars().all()


# READ : récupérer une compétence par son ID
async def get_skill_by_id(db: AsyncSession, skill_id: int):
    result = await db.execute(
        select(Skill).where(Skill.id == skill_id)
    )

    return result.scalar_one_or_none()


# UPDATE : modifier une compétence
async def update_skill(
    db: AsyncSession,
    skill: Skill,
    skill_data: SkillUpdate
):
    update_data = skill_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(skill, field, value)

    await db.commit()
    await db.refresh(skill)

    return skill


# DELETE : supprimer une compétence
async def delete_skill(db: AsyncSession, skill: Skill):
    await db.delete(skill)
    await db.commit()

    return True
