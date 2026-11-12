from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


# Schéma de base : informations communes
class FormationBase(BaseModel):
    title: str
    institution: str
    description: str
    type: str = "Formation"
    start_date: date | None = None
    end_date: date | None = None
    certificate_url: str | None = None
    is_completed: bool = False
    is_featured: bool = False


# Schéma utilisé pour créer une formation
class FormationCreate(FormationBase):
    pass


# Schéma utilisé pour modifier une formation
class FormationUpdate(BaseModel):
    title: str | None = None
    institution: str | None = None
    description: str | None = None
    type: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    certificate_url: str | None = None
    is_completed: bool | None = None
    is_featured: bool | None = None


# Schéma utilisé pour renvoyer une formation
class FormationResponse(FormationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)