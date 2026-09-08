from pathlib import Path
import json

import faiss
import numpy as np

from src.ingestion.loader import load_corpus
from src.ingestion.chunker import chunk_documents
from src.embeddings.embedder import Embedder


# Where we will save the vector database
VECTOR_DIR = Path(__file__).resolve().parents[2] / "data" / "vector_store"

INDEX_PATH = VECTOR_DIR / "index.faiss"
METADATA_PATH = VECTOR_DIR / "metadata.json"


def build_vector_store():
    """
    Load the corpus, create chunks, generate embeddings,
    and save everything required for retrieval.
    """

    print("Loading corpus...")

    documents = load_corpus()
    chunks = chunk_documents(documents)

    print(f"Documents loaded : {len(documents)}")
    print(f"Chunks created   : {len(chunks)}")

    # Generate embeddings
    embedder = Embedder()

    texts = [chunk["text"] for chunk in chunks]

    print("Creating embeddings...")
    embeddings = embedder.embed_texts(texts)

    # Convert to float32 because FAISS expects this format
    embeddings = np.asarray(embeddings, dtype="float32")

    # Create FAISS index
    dimension = embeddings.shape[1]

    index = faiss.IndexFlatIP(dimension)

    # Normalize embeddings so inner product behaves like cosine similarity
    faiss.normalize_L2(embeddings)

    index.add(embeddings)

    # Create directory if it doesn't exist
    VECTOR_DIR.mkdir(parents=True, exist_ok=True)

    # Save FAISS index
    faiss.write_index(index, str(INDEX_PATH))

    # Save chunk metadata
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print()
    print("Vector store created successfully.")
    print(f"Vectors  : {index.ntotal}")
    print(f"Dimension: {dimension}")
    print(f"Index    : {INDEX_PATH}")
    print(f"Metadata : {METADATA_PATH}")


if __name__ == "__main__":
    build_vector_store()