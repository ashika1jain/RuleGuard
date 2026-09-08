# RuleGuard RAG Dataset

This package is the controlled corpus for the RuleGuard conflict-aware RAG project.

## Contents

- `data/raw/medicaps_placement_policy.pdf` — the authentic 3-page placement-policy PDF supplied for the project. It is copied unchanged.
- Six synthetic Markdown policy documents covering academic, attendance, examination, medical leave, placement, fees, and student conduct.
- `data/test/questions.json` — 25 NOT_COVERED questions, 10 ANSWERED questions, and 3 CONFLICT questions.
- `data/test/contradictions.json` — ground truth for the three deliberate contradictions.

## Important distinction

The Markdown documents are synthetic project material. They must not be represented as official university regulations. The uploaded Medi-Caps placement-policy PDF is the only authentic institutional document in this package.

## Corpus requirement

The Markdown material is intentionally substantially longer than 6,000 words when combined with the PDF's extracted text and is designed as a controlled evaluation corpus rather than a random collection of documents.

## Intended response classes

1. `ANSWERED` — sufficient evidence exists and no conflicting applicable provision was found.
2. `NOT_COVERED` — the corpus does not contain a sufficient answer.
3. `CONFLICT` — two applicable provisions give incompatible answers.

## Three controlled conflicts

- Medical attendance: 75% general threshold vs 60% approved-medical threshold.
- Placement participation: no subsequent recruitment after acceptance vs participation until formal joining.
- Scholarship renewal: 15 August vs 20 August as the non-late deadline.
