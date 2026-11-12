from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies.auth import get_current_admin


from database import get_db
from schemas.formation_schema import (
    FormationCreate,
    FormationUpdate,
    FormationResponse
)
from services import formation_service


router = APIRouter(
    prefix="/formations",
    tags=["Formations et certifications"]
)


# CREATE : créer une formation
@router.post(
    "/",
    response_model=FormationResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_formation(
    formation_data: FormationCreate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return await formation_service.create_formation(
        db,
        formation_data
    )


# READ : récupérer toutes les formations
@router.get("/", response_model=list[FormationResponse])
async def get_formations(db: AsyncSession = Depends(get_db)):
    return await formation_service.get_all_formations(db)


# READ : récupérer une formation par son ID
@router.get("/{formation_id}", response_model=FormationResponse)
async def get_formation(
    formation_id: int,
    db: AsyncSession = Depends(get_db)
):
    formation = await formation_service.get_formation_by_id(
        db,
        formation_id
    )

    if formation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Formation introuvable"
        )

    return formation


# UPDATE : modifier une formation
@router.patch("/{formation_id}", response_model=FormationResponse)
async def update_formation(
    formation_id: int,
    formation_data: FormationUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    formation = await formation_service.get_formation_by_id(
        db,
        formation_id
    )

    if formation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Formation introuvable"
        )

    return await formation_service.update_formation(
        db,
        formation,
        formation_data
    )


# DELETE : supprimer une formation
@router.delete(
    "/{formation_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_formation(
    formation_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    formation = await formation_service.get_formation_by_id(
        db,
        formation_id
    )

    if formation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Formation introuvable"
        )

    await formation_service.delete_formation(db, formation)

    return Response(status_code=status.HTTP_204_NO_CONTENT)