from contextlib import asynccontextmanager

from fastapi import FastAPI

from database import engine
from routes.project_routes import router as project_router
from routes.skill_routes import router as skill_router
from routes.formation_routes import router as formation_router
from routes.contact_message_routes import router as contact_message_router
from routes.auth_routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware








@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(
    title="Portfolio de Wilfried",
    description="Portfolio professionnel de développeur Backend Python",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://wilfreid-portfolio.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)








app.include_router(project_router)
app.include_router(skill_router)
app.include_router(formation_router)
app.include_router(contact_message_router)
app.include_router(auth_router)


@app.get("/")
async def accueil():
    return {
        "message": "Bienvenue sur le portfolio de Wilfried !",
        "statut": "API opérationnelle"
    }