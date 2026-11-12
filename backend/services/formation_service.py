from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.formation import Formation
from schemas.formation_schema import FormationCreate, FormationUpdate


# CREATE : créer une formation
async def create_formation(
    db: AsyncSession,
    formation_data: FormationCreate
):
    new_formation = Formation(**formation_data.model_dump())

    db.add(new_formation)
    await db.commit()
    await db.refresh(new_formation)

    return new_formation


# READ : récupérer toutes les formations
async def get_all_formations(db: AsyncSession):
    result = await db.execute(
        select(Formation).order_by(Formation.created_at.desc())
    )

    return result.scalars().all()


# READ : récupérer une formation par son ID
async def get_formation_by_id(
    db: AsyncSession,
    formation_id: int
):
    result = await db.execute(
        select(Formation).where(Formation.id == formation_id)
    )

    return result.scalar_one_or_none()


# UPDATE : modifier une formation
async def update_formation(
    db: AsyncSession,
    formation: Formation,
    formation_data: FormationUpdate
):
    update_data = formation_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(formation, field, value)

    await db.commit()
    await db.refresh(formation)

    return formation


# DELETE : supprimer une formation
async def delete_formation(
    db: AsyncSession,
    formation: Formation
):
    await db.delete(formation)
    await db.commit()

    return True