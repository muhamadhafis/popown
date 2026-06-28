import json
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.transcript import get_transcript, format_transcript_text
from utils.llm import invoke_llm

router = APIRouter()


class BrandRequest(BaseModel):
    video_id: str
    language: str | None = None


class BrandItem(BaseModel):
    brand: str
    context: str
    timestamp_seconds: float


class BrandResponse(BaseModel):
    brands: list[BrandItem]


BRAND_PROMPT = """Dari transkrip video YouTube berikut, cari semua merek, brand, atau produk yang disebut.

Kembalikan dalam format JSON array. Setiap item punya:
- brand: nama merek
- context: konteks singkat
- timestamp_seconds: detik kemunculan

Contoh: [{{"brand": "KFC", "context": "makan siang", "timestamp_seconds": 180}}]

Jika tidak ada brand, kembalikan [] saja.

Transkrip:
{transcript}

JSON:"""


def _extract_json(text: str) -> list:
    text = text.strip()
    if not text:
        return []

    for pattern in [
        r"```(?:json)?\s*(\[[\s\S]*?\])\s*```",
        r"(\[[\s\S]*?\])",
    ]:
        match = re.search(pattern, text)
        if match:
            try:
                result = json.loads(match.group(1))
                if isinstance(result, list):
                    return result
            except json.JSONDecodeError:
                pass

    try:
        result = json.loads(text)
        if isinstance(result, list):
            return result
    except json.JSONDecodeError:
        pass

    return []


@router.post("/brand", response_model=BrandResponse)
def brand_tracker(req: BrandRequest):
    try:
        languages = [req.language] if req.language else None
        transcript = get_transcript(req.video_id, languages=languages)
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    transcript_text = format_transcript_text(transcript, max_chars=5000)

    raw = invoke_llm(BRAND_PROMPT.format(transcript=transcript_text))

    brands = _extract_json(raw)
    return BrandResponse(brands=[BrandItem(**b) for b in brands])
