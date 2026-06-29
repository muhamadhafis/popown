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


BRAND_PROMPT = """Cari brand/merek dari transkrip ini. Output JSON array saja, tanpa teks lain.

Contoh format:
[{{"brand": "KFC", "context": "makan siang", "timestamp_seconds": 180}}]
Atau jika hanya nama brand saja:
["KFC", "McDonald's"]

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

    transcript_text = format_transcript_text(transcript, max_chars=8000)

    raw = invoke_llm(BRAND_PROMPT.format(transcript=transcript_text))

    items = _extract_json(raw)
    brands = []
    for item in items:
        if isinstance(item, str):
            brands.append(BrandItem(brand=item, context="", timestamp_seconds=0))
        elif isinstance(item, dict):
            brands.append(BrandItem(**item))
    return BrandResponse(brands=brands)
