import re
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io


def _get_credentials(refresh_token: str, client_id: str, client_secret: str) -> Credentials:
    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        client_id=client_id,
        client_secret=client_secret,
        token_uri="https://oauth2.googleapis.com/token",
        scopes=["https://www.googleapis.com/auth/youtube.force-ssl"],
    )
    creds.refresh(Request())
    return creds


def get_transcript_from_youtube_api(
    video_id: str,
    language: str,
    refresh_token: str,
    client_id: str,
    client_secret: str,
) -> list[dict] | None:
    creds = _get_credentials(refresh_token, client_id, client_secret)
    service = build("youtube", "v3", credentials=creds)

    captions = service.captions().list(videoId=video_id, part="snippet").execute()
    track = None
    items = captions.get("items", [])
    for item in items:
        lang = item["snippet"]["language"]
        if lang == language:
            track = item
            break
    if not track and items:
        track = items[0]

    if not track:
        return None

    caption_id = track["id"]
    request = service.captions().download(id=caption_id, tfmt="srt")
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()

    srt_text = fh.getvalue().decode("utf-8")
    return _parse_srt(srt_text)


_TIME_RE = re.compile(
    r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)"
)


def _parse_srt(srt: str) -> list[dict]:
    entries = []
    blocks = re.split(r"\n\s*\n", srt.strip())
    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 2:
            continue
        time_match = _TIME_RE.search(lines[1])
        if not time_match:
            continue
        h1, m1, s1, ms1 = int(time_match[1]), int(time_match[2]), int(time_match[3]), int(time_match[4])
        h2, m2, s2, ms2 = int(time_match[5]), int(time_match[6]), int(time_match[7]), int(time_match[8])
        start = h1 * 3600 + m1 * 60 + s1 + ms1 / 1000
        end = h2 * 3600 + m2 * 60 + s2 + ms2 / 1000
        text = " ".join(line for line in lines[2:] if line.strip() and not line.strip().isdigit())
        if text.strip():
            entries.append({
                "text": text.strip(),
                "start": start,
                "duration": end - start,
            })
    entries.sort(key=lambda e: e["start"])
    return _merge_contiguous(entries) if entries else []


def _merge_contiguous(entries: list[dict]) -> list[dict]:
    if not entries:
        return []
    merged = [entries[0]]
    for e in entries[1:]:
        prev = merged[-1]
        gap = e["start"] - (prev["start"] + prev["duration"])
        if gap < 1.0:
            prev["text"] += " " + e["text"]
            prev["duration"] = e["start"] + e["duration"] - prev["start"]
        else:
            merged.append(e)
    return merged
