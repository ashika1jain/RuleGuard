from src.retrieval.retriever import Retriever
from src.decisions.evidence_filter import EvidenceFilter
from src.llm.gemini_provider import GeminiProvider


retriever = Retriever()

results = retriever.search(
    "I have 68% attendance and approved medical leave. Can I appear for my examination?",
    top_k=10
)

evidence_filter = EvidenceFilter(
    min_score=0.45,
    max_evidence=8
)

evidence = evidence_filter.filter(results)

print("\n===== EVIDENCE SENT TO GEMINI =====")

for index, item in enumerate(evidence):

    print(
        f"\n[{index + 1}] "
        f"{item['source']} | "
        f"{item['section']} | "
        f"score={item['score']:.4f}"
    )

    print(item["text"])


provider = GeminiProvider()

analysis = provider.analyze_evidence(
    "I have 68% attendance and approved medical leave. Can I appear for my examination?",
    evidence
)

print("\n===== GEMINI DECISION =====")
print(analysis)