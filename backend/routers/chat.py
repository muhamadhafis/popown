import re
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.transcript import get_transcript, format_transcript_text
from utils.llm import invoke_llm

router = APIRouter()


class ChatRequest(BaseModel):
    video_id: str
    message: str
    language: str | None = None


class ChatResponse(BaseModel):
    reply: str
    jump_to_seconds: float | None = None


TIME_CMD_PATTERN = re.compile(
    r"(?:(?:pindah|lompat|ke|pergi)\s+)?(?:ke\s+)?(?:[md]\w*\s+)?(\d+)(?:\s*:\s*(\d+))?(?:\s+\w+)?(?:\s+(\d+)(?:\s+detik)?)?\s*$",
    re.IGNORECASE,
)

SCENE_KEYWORDS = ["pindah", "cari", "temukan", "scene", "adegan", "bagian"]

CHAT_PROMPT = """Kamu adalah asisten yang membantu menjawab pertanyaan tentang video YouTube. Gunakan konteks transkrip berikut untuk menjawab pertanyaan user.

Transkrip video:
{transcript}

Pertanyaan: {question}

Jawaban:"""

SCENE_PROMPT = """Cari adegan "{query}" dalam transkrip ini.
Balas hanya ANGKA detik. Contoh: 180. Jika tidak ada: null.

{transcript}

Angka detik:"""

TIME_IN_TEXT = re.compile(
    r"(?:di\s+)?(?:menit\s+)?(\d+)(?:\s*:\s*(\d+))?(?:\s+menit)?(?:\s+(\d+)\s+detik)?",
    re.IGNORECASE,
)

SCENE_STOPWORDS = {"ke", "di", "dan", "yang", "dengan", "saya", "kamu",
                   "cari", "pindah", "temukan", "scene", "adegan", "bagian",
                   "lihat", "tolong", "apa", "itu"}

TS_RE = re.compile(r"\[(\d+\.?\d*)s\]")


def _search_scene_in_transcript(transcript_text: str, query: str) -> float | None:
    words = [w.lower() for w in re.findall(r"\w+", query)
             if w.lower() not in SCENE_STOPWORDS]
    if not words:
        return None
    for line in transcript_text.split("\n"):
        line_lower = line.lower()
        if all(w in line_lower for w in words):
            m = TS_RE.search(line)
            if m:
                return float(m.group(1))
    return None


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
        seconds = int(match.group(2) or match.group(3) or 0)
        total_seconds = minutes * 60 + seconds
        return ChatResponse(
            reply=f"Pindah ke menit {minutes}:{seconds:02d}",
            jump_to_seconds=float(total_seconds),
        )

    transcript_text = format_transcript_text(transcript, max_chars=8000)

    is_scene_query = any(kw in req.message.lower() for kw in SCENE_KEYWORDS)
    if is_scene_query:
        ts = _search_scene_in_transcript(transcript_text, req.message)

        if ts is None:
            raw = invoke_llm(SCENE_PROMPT.format(query=req.message, transcript=transcript_text))
            raw = raw.strip().lower()

            try:
                result = json.loads(raw)
                if result is not None:
                    ts = float(result)
            except (ValueError, json.JSONDecodeError, TypeError):
                pass

            if ts is None:
                match = TIME_IN_TEXT.search(raw)
                if match:
                    minutes = int(match.group(1))
                    seconds = int(match.group(2) or match.group(3) or 0)
                    ts = float(minutes * 60 + seconds)

        if ts is not None:
            minutes = int(ts // 60)
            secs = int(ts % 60)
            return ChatResponse(
                reply=f"Ditemukan adegan yang cocok di menit {minutes}:{secs:02d}",
                jump_to_seconds=ts,
            )

    reply = invoke_llm(CHAT_PROMPT.format(transcript=transcript_text, question=req.message))
    return ChatResponse(reply=reply)
