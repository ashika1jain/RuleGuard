from pathlib import Path
from typing import List, Dict
import re

from pypdf import PdfReader


# Project root → data/raw
DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "raw"


def clean_text(text: str) -> str:
    """Clean unnecessary whitespace from extracted text."""
    text = text.replace("\r\n", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def load_markdown(file_path: Path) -> List[Dict]:
    """Load a Markdown file and split it into sections."""

    text = file_path.read_text(encoding="utf-8")

    # Split whenever we encounter a Markdown heading
    parts = re.split(r"(?m)^(#{1,6})\s+(.+)$", text)

    documents = []

    # Text before the first heading
    if parts[0].strip():
        documents.append({
            "text": clean_text(parts[0]),
            "source": file_path.name,
            "section": "Introduction",
            "page": None
        })

    # Process heading + content pairs
    for i in range(1, len(parts), 3):
        if i + 2 >= len(parts):
            break

        heading_level = parts[i]
        heading = parts[i + 1].strip()
        content = parts[i + 2].strip()

        if content:
            documents.append({
                "text": clean_text(content),
                "source": file_path.name,
                "section": heading,
                "page": None
            })

    return documents


def load_pdf(file_path: Path) -> List[Dict]:
    """Load a PDF page by page."""

    reader = PdfReader(str(file_path))

    documents = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        text = clean_text(text)

        if text:
            documents.append({
                "text": text,
                "source": file_path.name,
                "section": f"PDF Page {page_number}",
                "page": page_number
            })

    return documents


def load_corpus() -> List[Dict]:
    """Load all Markdown and PDF files from data/raw."""

    documents = []

    for file_path in sorted(DATA_DIR.iterdir()):

        if file_path.suffix.lower() == ".md":
            documents.extend(load_markdown(file_path))

        elif file_path.suffix.lower() == ".pdf":
            documents.extend(load_pdf(file_path))

    return documents


if __name__ == "__main__":

    documents = load_corpus()

    print(f"Loaded {len(documents)} document sections.")
    print()

    for i, doc in enumerate(documents, start=1):
        print(f"--- Document {i} ---")
        print(f"Source  : {doc['source']}")
        print(f"Section : {doc['section']}")
        print(f"Page    : {doc['page']}")
        print(f"Text    : {doc['text'][:150]}...")
        print()