import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.transcript import get_transcript, format_transcript_text
from utils.llm import invoke_llm
from utils.vectorstore import build_vector_store, semantic_search

router = APIRouter()


class ChatRequest(BaseModel):
    video_id: str
    message: str
    language: str | None = None


class ChatResponse(BaseModel):
    reply: str
    jump_to_seconds: float | None = None


TIME_CMD_PATTERN = re.compile(
    r"(?:pindah\s+ke\s+)?(?:menit\s+)?(\d+)(?:\s+menit)?(?:\s+(\d+)(?:\s+detik)?)?\s*$",
    re.IGNORECASE,
)

SCENE_KEYWORDS = ["pindah", "cari", "temukan", "scene", "adegan", "bagian"]

CHAT_PROMPT = """Kamu adalah asisten yang membantu menjawab pertanyaan tentang video YouTube. Gunakan konteks transkrip berikut untuk menjawab pertanyaan user.

Transkrip video:
{transcript}

Pertanyaan: {question}

Jawaban:"""


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        languages = [req.language] if req.language else None
        transcript = get_transcript(req.video_id, languages=languages)
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    match = TIME_CMD_PATTERN.match(req.message.strip())
    if match:
        minutes = int(match.group(1))
        seconds = int(match.group(2)) if match.group(2) else 0
        total_seconds = minutes * 60 + seconds
        return ChatResponse(
            reply=f"Pindah ke menit {minutes}:{seconds:02d}",
            jump_to_seconds=float(total_seconds),
        )

    transcript_text = format_transcript_text(transcript, max_chars=5000)

    is_scene_query = any(kw in req.message.lower() for kw in SCENE_KEYWORDS)
    if is_scene_query:
        vector_store = build_vector_store(transcript)
        ts = semantic_search(vector_store, req.message)
        if ts is not None:
            minutes = int(ts // 60)
            secs = int(ts % 60)
            return ChatResponse(
                reply=f"Ditemukan adegan yang cocok di menit {minutes}:{secs:02d}",
                jump_to_seconds=ts,
            )

    reply = invoke_llm(CHAT_PROMPT.format(transcript=transcript_text, question=req.message))
    return ChatResponse(reply=reply)
