from fastapi import FastAPI

from src.api.routes import router


app = FastAPI(
    title="RuleGuard RAG",
    description="Conflict-aware university rulebook question answering system",
    version="1.0.0"
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "RuleGuard RAG API is running."
    }