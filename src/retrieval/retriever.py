from pathlib import Path
import json

import faiss
import numpy as np

from src.embeddings.embedder import Embedder


# Paths to our saved vector store
VECTOR_DIR = Path(__file__).resolve().parents[2] / "data" / "vector_store"

INDEX_PATH = VECTOR_DIR / "index.faiss"
METADATA_PATH = VECTOR_DIR / "metadata.json"


class Retriever:

    def __init__(self):
        print("Loading vector store...")

        # Load FAISS index
        self.index = faiss.read_index(str(INDEX_PATH))

        # Load metadata
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            self.metadata = json.load(f)

        # Load embedding model
        self.embedder = Embedder()

        print(f"Vector store loaded: {self.index.ntotal} vectors")

    def search(self, query: str, top_k: int = 5):
        """
        Search the vector store for the most relevant chunks.
        """

        # Convert question into an embedding
        query_embedding = self.embedder.embed_texts([query])

        # Convert to float32
        query_embedding = np.asarray(
            query_embedding,
            dtype="float32"
        )

        # Normalize because our FAISS index uses normalized vectors
        faiss.normalize_L2(query_embedding)

        # Search FAISS
        scores, indices = self.index.search(
            query_embedding,
            top_k
        )

        results = []

        for score, index in zip(scores[0], indices[0]):

            if index == -1:
                continue

            result = self.metadata[index].copy()

            result["score"] = float(score)

            results.append(result)

        return results


if __name__ == "__main__":

    retriever = Retriever()

    question = input("\nEnter your question: ")

    results = retriever.search(question, top_k=10)

    print("\n===== SEARCH RESULTS =====\n")

    for i, result in enumerate(results, start=1):

        print(f"--- Result {i} ---")
        print(f"Score   : {result['score']:.4f}")
        print(f"Source  : {result['source']}")
        print(f"Section : {result['section']}")
        print(f"Page    : {result['page']}")
        print(f"Text    : {result['text'][:500]}")
        print()