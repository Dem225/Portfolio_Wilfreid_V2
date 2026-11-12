
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from dependencies.auth import get_current_admin
from schemas.contact_message_schema import (
    ContactMessageCreate,
    ContactMessageUpdate,
    ContactMessageResponse
)
from services import contact_message_service


router = APIRouter(
    prefix="/contact",
    tags=["Messages de contact"]
)


# CREATE : envoyer un message (public)
@router.post(
    "/",
    response_model=ContactMessageResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_contact_message(
    message_data: ContactMessageCreate,
    db: AsyncSession = Depends(get_db)
):
    return await contact_message_service.create_contact_message(
        db,
        message_data
    )


# READ : récupérer tous les messages (administrateur)
@router.get("/", response_model=list[ContactMessageResponse])
async def get_contact_messages(
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return await contact_message_service.get_all_contact_messages(db)


# READ : récupérer un message par son ID (administrateur)
@router.get("/{message_id}", response_model=ContactMessageResponse)
async def get_contact_message(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    message = await contact_message_service.get_contact_message_by_id(
        db,
        message_id
    )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message introuvable"
        )

    return message


# UPDATE : modifier le statut de lecture (administrateur)
@router.patch(
    "/{message_id}",
    response_model=ContactMessageResponse
)
async def update_contact_message(
    message_id: int,
    message_data: ContactMessageUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    message = await contact_message_service.get_contact_message_by_id(
        db,
        message_id
    )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message introuvable"
        )

    return await contact_message_service.update_contact_message(
        db,
        message,
        message_data
    )


# DELETE : supprimer un message (administrateur)
@router.delete(
    "/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_contact_message(
    message_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    message = await contact_message_service.get_contact_message_by_id(
        db,
        message_id
    )

    if message is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message introuvable"
        )

    await contact_message_service.delete_contact_message(db, message)

    return Response(status_code=status.HTTP_204_NO_CONTENT)
