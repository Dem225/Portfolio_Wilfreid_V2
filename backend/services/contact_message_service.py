from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.contact_message import ContactMessage
from schemas.contact_message_schema import (
    ContactMessageCreate,
    ContactMessageUpdate
)


# CREATE : enregistrer un nouveau message
async def create_contact_message(
    db: AsyncSession,
    message_data: ContactMessageCreate
):
    new_message = ContactMessage(**message_data.model_dump())

    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    return new_message


# READ : récupérer tous les messages
async def get_all_contact_messages(db: AsyncSession):
    result = await db.execute(
        select(ContactMessage).order_by(
            ContactMessage.created_at.desc()
        )
    )

    return result.scalars().all()


# READ : récupérer un message par son ID
async def get_contact_message_by_id(
    db: AsyncSession,
    message_id: int
):
    result = await db.execute(
        select(ContactMessage).where(
            ContactMessage.id == message_id
        )
    )

    return result.scalar_one_or_none()


# UPDATE : modifier le statut de lecture
async def update_contact_message(
    db: AsyncSession,
    message: ContactMessage,
    message_data: ContactMessageUpdate
):
    update_data = message_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(message, field, value)

    await db.commit()
    await db.refresh(message)

    return message


# DELETE : supprimer un message
async def delete_contact_message(
    db: AsyncSession,
    message: ContactMessage
):
    await db.delete(message)
    await db.commit()

    return True