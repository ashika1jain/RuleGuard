from typing import List, Dict

from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"


class Embedder:
    def __init__(self):
        print(f"Loading embedding model: {MODEL_NAME}")
        self.model = SentenceTransformer(MODEL_NAME)
        print("Embedding model loaded.")

    def embed_texts(self, texts: List[str]):
        """
        Convert a list of texts into embedding vectors.
        """
        return self.model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=True
        )

    def embed_documents(self, documents: List[Dict]):
        """
        Generate an embedding for every document chunk.
        """

        texts = [doc["text"] for doc in documents]

        embeddings = self.embed_texts(texts)

        return embeddings


if __name__ == "__main__":
    from src.ingestion.loader import load_corpus
    from src.ingestion.chunker import chunk_documents

    documents = load_corpus()
    chunks = chunk_documents(documents)

    embedder = Embedder()

    embeddings = embedder.embed_documents(chunks)

    print()
    print("Number of chunks :", len(chunks))
    print("Embedding shape  :", embeddings.shape)
    print("First embedding  :", embeddings[0][:10])