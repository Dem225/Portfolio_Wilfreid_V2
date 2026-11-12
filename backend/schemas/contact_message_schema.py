from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Schéma utilisé pour recevoir un nouveau message
class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10)


# Schéma utilisé pour modifier le statut de lecture
class ContactMessageUpdate(BaseModel):
    is_read: bool


# Schéma utilisé pour renvoyer un message
class ContactMessageResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)