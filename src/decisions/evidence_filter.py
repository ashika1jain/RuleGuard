from typing import List, Dict


class EvidenceFilter:
    def __init__(self, min_score: float = 0.45, max_evidence: int = 8):
        self.min_score = min_score
        self.max_evidence = max_evidence

    def filter(self, results: List[Dict]) -> List[Dict]:
        filtered = [
            result
            for result in results
            if result["score"] >= self.min_score
        ]

        filtered.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return filtered[:self.max_evidence]