from fastapi import APIRouter
from pydantic import BaseModel

from src.retrieval.retriever import Retriever
from src.decisions.evidence_filter import EvidenceFilter
from src.llm.gemini_provider import GeminiProvider


router = APIRouter()

retriever = Retriever()

evidence_filter = EvidenceFilter(
    min_score=0.45,
    max_evidence=8
)

llm_provider = GeminiProvider()


class AskRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_question(request: AskRequest):

    question = request.question.strip()

    if not question:
        return {
            "error": "Question cannot be empty."
        }

    # 1. Retrieve relevant chunks
    results = retriever.search(
        question,
        top_k=10
    )

    # 2. Select evidence
    evidence = evidence_filter.filter(results)

    # 3. Analyze evidence with Gemini
    decision = llm_provider.analyze_evidence(
        question,
        evidence
    )

    # 4. Return final response
    return {
        "question": question,
        "classification": decision["classification"],
        "reason": decision["reason"],
        "supporting_evidence": decision["supporting_evidence"],
        "evidence": evidence
    }