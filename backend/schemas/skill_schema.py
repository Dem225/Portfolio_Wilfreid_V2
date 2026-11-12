
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# Schéma de base : informations communes
class SkillBase(BaseModel):
    name: str
    category: str
    level: str
    icon: str | None = None
    is_featured: bool = False


# Schéma utilisé pour créer une compétence
class SkillCreate(SkillBase):
    pass


# Schéma utilisé pour modifier une compétence
class SkillUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    level: str | None = None
    icon: str | None = None
    is_featured: bool | None = None


# Schéma utilisé pour renvoyer une compétence
class SkillResponse(SkillBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
