
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# Schéma de base : informations communes à tous les projets
class ProjectBase(BaseModel):
    title: str
    slug: str
    description: str
    image_url: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    youtube_url: str | None = None
    technologies: list[str] = Field(default_factory=list)
    is_featured: bool = False


# Schéma utilisé pour créer un projet
class ProjectCreate(ProjectBase):
    pass


# Schéma utilisé pour modifier un projet
class ProjectUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    image_url: str | None = None
    github_url: str | None = None
    demo_url: str | None = None
    youtube_url: str | None = None
    technologies: list[str] | None = None
    is_featured: bool | None = None


# Schéma utilisé pour renvoyer un projet
class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
