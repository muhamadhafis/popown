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


BRAND_PROMPT = """Cari brand/merek yang disebutkan dalam transkrip ini.
Setiap baris transkrip dimulai dengan penanda waktu seperti `[120s]` yang menunjukkan waktu dalam detik (misal: 120 detik).
Temukan brand/merek tersebut, konteks kalimatnya, dan catat timestamp waktu kemunculannya (dalam angka detik saja).

Wajib menghasilkan output dalam format JSON array of objects dengan kunci: "brand", "context", dan "timestamp_seconds". Jangan menghasilkan format lain.

Contoh format output:
[
  {{"brand": "KFC", "context": "makan siang di restoran cepat saji", "timestamp_seconds": 180.0}},
  {{"brand": "McDonald's", "context": "membeli ayam gule baru", "timestamp_seconds": 481.0}}
]

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
            brands.append(BrandItem(brand=item, context="", timestamp_seconds=0.0))
        elif isinstance(item, dict):
            brand_name = item.get("brand") or item.get("name") or ""
            if not brand_name and len(item.values()) > 0:
                brand_name = str(list(item.values())[0])
            
            context_str = item.get("context") or ""
            ts = item.get("timestamp_seconds") or item.get("timestamp") or 0.0
            try:
                ts = float(ts)
            except (ValueError, TypeError):
                ts = 0.0
            
            if brand_name:
                brands.append(BrandItem(brand=str(brand_name), context=str(context_str), timestamp_seconds=ts))
    return BrandResponse(brands=brands)
