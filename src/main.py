from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import router


app = FastAPI(
    title="RuleGuard API",
    description="Conflict-aware university policy RAG API",
    version="1.0.0",
)


# Allow the React frontend to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "RuleGuard API",
    }


app.include_router(router)