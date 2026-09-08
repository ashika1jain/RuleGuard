from abc import ABC, abstractmethod
from typing import Any, Dict, List


class LLMProvider(ABC):

    @abstractmethod
    def analyze_evidence(
        self,
        query: str,
        evidence: List[Dict]
    ) -> Dict[str, Any]:
        """
        Analyze retrieved evidence and return a structured decision.
        """
        pass