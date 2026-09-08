from typing import List, Dict


class RuleClassifier:

    def __init__(self, relevance_threshold: float = 0.55):
        self.relevance_threshold = relevance_threshold

    def classify(self, query: str, results: List[Dict]) -> str:
        """
        Classify a question using the retrieved evidence.

        Possible outputs:
            ANSWERED
            NOT_COVERED
            CONFLICT
        """

        # ---------------------------------------------------------
        # 1. Keep only reasonably strong retrieval results
        # ---------------------------------------------------------

        relevant_results = [
            result
            for result in results
            if result["score"] >= self.relevance_threshold
        ]

        # ---------------------------------------------------------
        # 2. If there is no sufficiently strong evidence,
        #    the corpus does not appear to cover the question.
        # ---------------------------------------------------------

        if not relevant_results:
            return "NOT_COVERED"

        # ---------------------------------------------------------
        # 3. Look for explicit evidence that multiple provisions
        #    need to be considered together.
        # ---------------------------------------------------------

        conflict_indicators = [
            "retrieve both provisions",
            "both provisions",
            "conflict",
            "contradict",
            "different threshold",
            "two provisions",
            "unless an additional corpus provision resolves"
        ]

        conflict_results = []

        for result in relevant_results:

            text = result["text"].lower()

            if any(
                indicator in text
                for indicator in conflict_indicators
            ):
                conflict_results.append(result)

        # ---------------------------------------------------------
        # 4. If multiple relevant pieces of evidence explicitly
        #    indicate competing provisions, classify as conflict.
        # ---------------------------------------------------------

        if len(conflict_results) >= 2:
            return "CONFLICT"

        # ---------------------------------------------------------
        # 5. Otherwise, we have sufficiently relevant evidence.
        # ---------------------------------------------------------

        return "ANSWERED"


if __name__ == "__main__":

    from src.retrieval.retriever import Retriever

    retriever = Retriever()
    classifier = RuleClassifier()

    question = input("\nEnter your question: ")

    results = retriever.search(
        question,
        top_k=10
    )

    classification = classifier.classify(
        question,
        results
    )

    print()
    print("==============================")
    print(f"Classification: {classification}")
    print("==============================")