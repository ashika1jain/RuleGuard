# RuleGuard

### Conflict-Aware University Policy RAG System

RuleGuard is an evidence-first Retrieval-Augmented Generation (RAG) system designed to answer university policy questions using a controlled policy corpus.

Unlike a conventional RAG chatbot that simply retrieves passages and generates an answer, RuleGuard explicitly evaluates the retrieved evidence and classifies each query into one of three categories:

- **ANSWERED** — sufficient, non-conflicting evidence is available.
- **NOT_COVERED** — the indexed corpus does not contain enough information to answer the question.
- **CONFLICT** — multiple applicable policy provisions contain incompatible requirements, thresholds, permissions, deadlines, or outcomes.

The system also exposes the retrieved evidence, source document, section, page information, and similarity score so that users can verify the basis of the decision.

---

## Problem Statement

University policies can be distributed across multiple documents and may contain overlapping or inconsistent provisions.

A basic RAG system may retrieve relevant passages but can still:

- confidently answer questions that are not covered by the corpus,
- overlook conflicting policy provisions,
- generate unsupported conclusions,
- hide the evidence used to reach a decision.

RuleGuard addresses these issues by combining semantic retrieval, evidence filtering, and LLM-based evidence analysis.

---

## Key Features

- Semantic search over a multi-document policy corpus
- MiniLM-based text embeddings
- FAISS vector similarity search
- Evidence filtering before reasoning
- Gemini-based evidence analysis
- Explicit `ANSWERED`, `NOT_COVERED`, and `CONFLICT` classification
- Source and section information for retrieved evidence
- Similarity scores for retrieved passages
- Expandable evidence cards
- Interactive React frontend
- FastAPI backend
- Evaluation questions and planted conflict benchmarks
- REST API for programmatic access

---

## System Architecture

```text
                         USER QUESTION
                              |
                              v
                         FastAPI /ask
                              |
                              v
                       MiniLM Embedding
                              |
                              v
                       FAISS Vector Search
                              |
                              v
                     Top-K Retrieved Evidence
                              |
                              v
                       Evidence Filtering
                              |
                              v
                    Gemini Evidence Analysis
                              |
                              v
                    +----------------------+
                    |     CLASSIFICATION   |
                    +----------------------+
                       /        |        \
                      /         |         \
                     v          v          v
                ANSWERED   NOT_COVERED   CONFLICT
                     \         |          /
                      \        |         /
                       v       v        v
                       Evidence + Result
                              |
                              v
                       React Frontend

---

## Tech Stack

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- Sentence Transformers
- FAISS
- PyPDF
- Google Gemini API

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

### AI & Retrieval
- `all-MiniLM-L6-v2` — text embeddings
- FAISS — vector similarity search
- Gemini — evidence analysis and classification

---

## How It Works

RuleGuard follows an evidence-first RAG pipeline:

1. **Document Ingestion**  
   Policy documents in PDF and Markdown format are loaded while preserving source and section metadata.

2. **Chunking**  
   Documents are divided into overlapping text chunks to improve retrieval.

3. **Embedding Generation**  
   Each chunk is converted into a 384-dimensional vector using `all-MiniLM-L6-v2`.

4. **Semantic Retrieval**  
   FAISS retrieves the most relevant policy passages for the user's question.

5. **Evidence Filtering**  
   Retrieved passages are filtered based on similarity scores before being passed to the reasoning layer.

6. **Evidence Analysis**  
   Gemini analyzes the user's question using only the retrieved policy evidence.

7. **Classification**  
   The system classifies the query as:
   - `ANSWERED`
   - `NOT_COVERED`
   - `CONFLICT`

8. **Evidence Display**  
   The frontend displays the classification along with the supporting policy passages, source documents, sections, pages, and similarity scores.

---

## Classification

| Classification | Description |
|---|---|
| **ANSWERED** | Sufficient and consistent evidence is available to answer the question. |
| **NOT_COVERED** | The indexed policy corpus does not contain sufficient evidence to answer the question. |
| **CONFLICT** | Two or more applicable policy provisions contain incompatible requirements or outcomes. |

---

## Project Structure

```text
RuleGuard/
├── data/
│   ├── raw/
│   ├── test/
│   └── vector_store/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── App.tsx
│       └── types.ts
│
├── src/
│   ├── api/
│   ├── decisions/
│   ├── embeddings/
│   ├── ingestion/
│   ├── llm/
│   └── retrieval/
│
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
