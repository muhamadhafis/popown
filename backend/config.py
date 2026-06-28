import os
import re
from dotenv import load_dotenv

load_dotenv()

raw_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
# Ollama client appends /api/chat, /api/embed etc. automatically.
# Strip trailing /api (or /v1) to avoid double path like /api/api/chat.
OLLAMA_BASE_URL = re.sub(r"/?(?:api|v1)/?$", "", raw_url)
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
