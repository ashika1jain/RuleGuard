import re
from typing import List, Dict, Optional


class EvidenceAnalyzer:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # Extract percentage from user's question
    # ---------------------------------------------------------

    def extract_query_percentage(self, query: str) -> Optional[float]:
        """
        Extract a percentage mentioned in the user's question.

        Example:
            "I have 68% attendance"
        returns:
            68.0
        """

        match = re.search(
            r'(\d+(?:\.\d+)?)\s*%',
            query
        )

        if match:
            return float(match.group(1))

        return None

    # ---------------------------------------------------------
    # Extract percentage-based rules from retrieved evidence
    # ---------------------------------------------------------

    def extract_percentage_rules(self, text: str) -> List[Dict]:
        """
        Extract simple percentage rules from retrieved evidence.

        Examples:

            "at least 75% attendance"
                -> 75 >=

            "at most 50%"
                -> 50 <=

            "60% or above"
                -> 60 >=
        """

        rules = []

        patterns = [
            (
                r'(?:at least|minimum of|minimum)'
                r'\s+(?:\*\*)?\s*'
                r'(\d+(?:\.\d+)?)\s*%',
                '>='
            ),

            (
                r'(?:at most|maximum of|maximum)'
                r'\s+(?:\*\*)?\s*'
                r'(\d+(?:\.\d+)?)\s*%',
                '<='
            ),

            (
                r'(\d+(?:\.\d+)?)\s*%'
                r'\s*(?:\*\*)?\s*'
                r'(?:or higher|or above)',
                '>='
            ),

            (
                r'(\d+(?:\.\d+)?)\s*%'
                r'\s*(?:\*\*)?\s*'
                r'(?:or lower|or below)',
                '<='
            )
        ]

        for pattern, operator in patterns:

            matches = re.finditer(
                pattern,
                text.lower()
            )

            for match in matches:

                rules.append({
                    "value": float(match.group(1)),
                    "operator": operator,
                    "text": text
                })

        return rules

    # ---------------------------------------------------------
    # Evaluate a rule against the user's value
    # ---------------------------------------------------------

    def evaluate_rule(
        self,
        actual_value: Optional[float],
        rule: Dict
    ) -> Optional[bool]:
        """
        Evaluate a numerical rule against the value found
        in the user's question.

        Example:

            actual_value = 68
            rule = 75 >=

            returns False
        """

        if actual_value is None:
            return None

        value = rule["value"]
        operator = rule["operator"]

        if operator == ">=":
            return actual_value >= value

        if operator == "<=":
            return actual_value <= value

        return None

    # ---------------------------------------------------------
    # Analyze all retrieved evidence
    # ---------------------------------------------------------

    def analyze(
        self,
        query: str,
        results: List[Dict]
    ) -> Dict:

        query_percentage = self.extract_query_percentage(
            query
        )

        evidence = []

        for result in results:

            rules = self.extract_percentage_rules(
                result["text"]
            )

            evaluated_rules = []

            for rule in rules:

                outcome = self.evaluate_rule(
                    query_percentage,
                    rule
                )

                evaluated_rules.append({
                    "value": rule["value"],
                    "operator": rule["operator"],
                    "outcome": outcome,
                    "text": rule["text"]
                })

            evidence.append({
                "source": result["source"],
                "section": result["section"],
                "page": result["page"],
                "score": result["score"],
                "rules": evaluated_rules,
                "text": result["text"]
            })

        # -----------------------------------------------------
        # Determine whether retrieved rules disagree
        # -----------------------------------------------------

        rule_outcomes = []

        for item in evidence:

            for rule in item["rules"]:

                if rule["outcome"] is not None:

                    rule_outcomes.append({
                        "source": item["source"],
                        "section": item["section"],
                        "value": rule["value"],
                        "operator": rule["operator"],
                        "outcome": rule["outcome"]
                    })

        has_true_rule = any(
            rule["outcome"] is True
            for rule in rule_outcomes
        )

        has_false_rule = any(
            rule["outcome"] is False
            for rule in rule_outcomes
        )

        # If one applicable rule accepts the value while
        # another rejects it, the evidence disagrees.

        conflict = (
            has_true_rule
            and has_false_rule
        )

        return {
            "query": query,
            "query_percentage": query_percentage,
            "evidence": evidence,
            "rule_outcomes": rule_outcomes,
            "conflict": conflict
        }


# =============================================================
# Standalone test
# =============================================================

if __name__ == "__main__":

    from src.retrieval.retriever import Retriever

    retriever = Retriever()
    analyzer = EvidenceAnalyzer()

    question = input("\nEnter your question: ")

    results = retriever.search(
        question,
        top_k=10
    )

    analysis = analyzer.analyze(
        question,
        results
    )

    print("\n===== EVIDENCE ANALYSIS =====")

    print(
        f"\nQuestion percentage: "
        f"{analysis['query_percentage']}%"
    )

    print(
        f"Conflict detected: "
        f"{analysis['conflict']}"
    )

    print("\n===== RULE OUTCOMES =====")

    for rule in analysis["rule_outcomes"]:

        print(
            f"\nSource  : {rule['source']}"
        )

        print(
            f"Section : {rule['section']}"
        )

        print(
            f"Rule    : "
            f"{rule['operator']} {rule['value']}%"
        )

        print(
            f"Outcome : {rule['outcome']}"
        )