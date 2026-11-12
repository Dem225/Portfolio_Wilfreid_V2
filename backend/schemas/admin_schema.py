from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Création d'un administrateur
class AdminCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


# Connexion d'un administrateur
class AdminLogin(BaseModel):
    email: EmailStr
    password: str


# Réponse de l'API
class AdminResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)