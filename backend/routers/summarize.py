from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.transcript import get_transcript, format_transcript_text
from utils.llm import invoke_llm

router = APIRouter()


class SummarizeRequest(BaseModel):
    video_id: str
    language: str | None = None


class SummarizeResponse(BaseModel):
    summary: str


ENRICH_PROMPT = """Perbaiki tata bahasa transkrip lisan yang rancu berikut, tambahkan konteks tersirat yang terpotong, dan ubah menjadi artikel naratif yang kaya informasi, detail, namun tetap akurat sesuai isi video.

Transkrip:
{transcript}

Narasi yang sudah diperkaya:"""

SUMMARIZE_PROMPT = """Berdasarkan teks narasi yang sudah diperkaya ini, buatlah rangkuman eksekutif dalam bentuk poin-poin terstruktur Markdown yang mencakup seluruh inti sari krusial dan detail informatif dari video.

Narasi:
{enriched}

Rangkuman Markdown:"""


@router.post("/summarize", response_model=SummarizeResponse)
def summarize(req: SummarizeRequest):
    try:
        languages = [req.language] if req.language else None
        transcript = get_transcript(req.video_id, languages=languages)
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    transcript_text = format_transcript_text(transcript, max_chars=5000)

    enriched = invoke_llm(ENRICH_PROMPT.format(transcript=transcript_text))

    summary = invoke_llm(SUMMARIZE_PROMPT.format(enriched=enriched))

    return SummarizeResponse(summary=summary)
