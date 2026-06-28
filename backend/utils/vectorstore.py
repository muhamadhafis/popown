import chromadb
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from config import OLLAMA_BASE_URL, OLLAMA_API_KEY, OLLAMA_EMBED_MODEL


def _get_embeddings():
    client_kwargs = {}
    if OLLAMA_API_KEY:
        client_kwargs["headers"] = {
            "Authorization": f"Bearer {OLLAMA_API_KEY}"
        }
    return OllamaEmbeddings(
        model=OLLAMA_EMBED_MODEL,
        base_url=OLLAMA_BASE_URL,
        client_kwargs=client_kwargs,
    )


def build_vector_store(transcript: list[dict]):
    docs = [
        Document(page_content=entry["text"], metadata={"start": entry["start"]})
        for entry in transcript
    ]

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )
    chunks = splitter.split_documents(docs)

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=_get_embeddings(),
    )
    return vector_store


def semantic_search(vector_store, query: str, k: int = 1) -> float | None:
    results = vector_store.similarity_search_with_score(query, k=k)
    if results:
        return results[0][0].metadata.get("start")
    return None
