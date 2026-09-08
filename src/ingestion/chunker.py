from typing import List, Dict


def chunk_documents(
    documents: List[Dict],
    chunk_size: int = 500,
    overlap: int = 100
) -> List[Dict]:
    """
    Split loaded documents into smaller overlapping chunks.
    """

    chunks = []

    for doc in documents:
        text = doc["text"]

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunk_text = text[start:end].strip()

            if chunk_text:
                chunks.append({
                    "text": chunk_text,
                    "source": doc["source"],
                    "section": doc["section"],
                    "page": doc["page"]
                })

            # Move forward while keeping some overlap
            start += chunk_size - overlap

    return chunks


if __name__ == "__main__":
    # Import the corpus loader
    from src.ingestion.loader import load_corpus

    documents = load_corpus()

    chunks = chunk_documents(documents)

    print(f"Loaded documents : {len(documents)}")
    print(f"Created chunks   : {len(chunks)}")
    print()

    for i, chunk in enumerate(chunks[:10], start=1):
        print(f"--- Chunk {i} ---")
        print(f"Source  : {chunk['source']}")
        print(f"Section : {chunk['section']}")
        print(f"Page    : {chunk['page']}")
        print(f"Text    : {chunk['text'][:200]}...")
        print()