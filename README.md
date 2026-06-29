# YouTube AI Companion

Backend API untuk Chrome Extension YouTube AI Companion — chatbot, brand tracker, dan summarizer berbasis transkrip YouTube + Ollama.

## Fitur

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/chat` | POST | Chat tentang video, time command (`ke menit 3`), scene search (`ke adegan KFC`) |
| `/api/brand` | POST | Deteksi brand/merek yang disebut dalam video |
| `/api/summarize` | POST | Rangkuman eksekutif dalam Markdown |
| `/health` | GET | Health check |

## Tech Stack

- **FastAPI** — REST API framework
- **Ollama** (Cloud) — LLM provider (`gpt-oss:120b`)
- **youtube-transcript-api** / **yt-dlp** — Ekstraksi transkrip YouTube
- **YouTube Data API v3** (OAuth) — Fallback transkrip (opsional)

## Setup

### 1. Clone & install

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Konfigurasi

```bash
cp .env.example .env
```

Isi `.env`:

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `OLLAMA_BASE_URL` | ✅ | `https://ollama.com` untuk cloud, `http://localhost:11434` untuk lokal |
| `OLLAMA_API_KEY` | ✅ | API key dari Ollama Cloud |
| `OLLAMA_MODEL` | ✅ | `gpt-oss:120b` (atau model lain) |
| `GOOGLE_CLIENT_ID` | ⬜ | YouTube Data API OAuth — untuk fallback transkrip |
| `GOOGLE_CLIENT_SECRET` | ⬜ | YouTube Data API OAuth — untuk fallback transkrip |
| `YOUTUBE_REFRESH_TOKEN` | ⬜ | Hasil dari `python scripts/get_youtube_refresh_token.py` |

> **Catatan**: Fallback YouTube Data API hanya bekerja untuk video sendiri. Untuk video orang lain, gunakan `youtube-transcript-api` (default).

### 3. Jalankan

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Atau:

```bash
python main.py
```

## API Reference

### `POST /api/chat`

Request body:

```json
{
  "video_id": "xlWhpXdOlTo",
  "message": "Apa isi video ini?",
  "language": "id"
}
```

Fitur pesan:

| Pola | Contoh | Hasil |
|------|--------|-------|
| `ke menit N` | `ke menit 3` | `jump_to_seconds: 180` |
| `ke N` (dengan typo) | `ke mnenit 8`, `ke meint 3` | `jump_to_seconds: 480` |
| `N` (angka saja) | `5` | `jump_to_seconds: 300` |
| `ke adegan <brand>` | `ke adegan KFC` | `jump_to_seconds: 93` |
| `cari bagian <topik>` | `cari bagian Subway` | `jump_to_seconds: 0` |

Response:

```json
{
  "reply": "Pindah ke menit 3:00",
  "jump_to_seconds": 180.0
}
```

### `POST /api/brand`

```json
{
  "video_id": "xlWhpXdOlTo",
  "language": "id"
}
```

Response:

```json
{
  "brands": [
    { "brand": "KFC", "context": "", "timestamp_seconds": 0.0 },
    { "brand": "McDonald's", "context": "ayam gule", "timestamp_seconds": 481.0 }
  ]
}
```

### `POST /api/summarize`

```json
{
  "video_id": "xlWhpXdOlTo",
  "language": "id"
}
```

Response:

```json
{
  "summary": "## Executive Summary …"
}
```

## Arsitektur

```
backend/
├── main.py                  # Entry point FastAPI
├── config.py                # Environment variable loader
├── routers/
│   ├── chat.py              # POST /api/chat
│   ├── brand.py             # POST /api/brand
│   └── summarize.py         # POST /api/summarize
├── utils/
│   ├── transcript.py        # Ekstraksi transkrip (yt-api → yt-dlp → google api)
│   ├── llm.py               # Invoke Ollama
│   └── youtube_api.py       # YouTube Data API v3 OAuth client
├── scripts/
│   └── get_youtube_refresh_token.py  # One-time OAuth setup
├── .env
├── .env.example
└── requirements.txt
```

### Fallback chain transkrip

1. **youtube-transcript-api** (6x retry, exponential backoff)
2. **yt-dlp** dengan `android_vr` client (6x retry) — bypass PO Token requirement
3. **YouTube Data API v3** OAuth (opsional, hanya untuk video sendiri)

## Catatan

- **PO Token**: YouTube baru menerapkan Proof of Origin Token untuk endpoint `timedtext`. Solusinya menggunakan `android_vr` client via yt-dlp.
- **Rate limit**: Setiap metode punya retry 6x dengan exponential backoff (2s, 4s, 8s, 16s, 32s, 64s).
- **Cache**: Transkrip di-cache in-memory per `{video_id}:{language}` untuk menghindari fetch ulang.
- **Model**: `gpt-oss:120b` memiliki context limit ~8000 karakter. Transkrip lebih panjang akan di-sampling (head + tail).
