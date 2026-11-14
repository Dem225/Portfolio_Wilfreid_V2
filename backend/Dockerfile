
FROM python:3.12-slim

WORKDIR /app

# Installer uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copier les fichiers de dépendances
COPY pyproject.toml uv.lock ./

# Installer les dépendances Python
RUN uv sync --frozen --no-dev --no-install-project

# Copier le code du backend
COPY . .

# Activer l'environnement virtuel
ENV PATH="/app/.venv/bin:$PATH"

# Exposer le port FastAPI
EXPOSE 8000

# Démarrer le serveur
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
