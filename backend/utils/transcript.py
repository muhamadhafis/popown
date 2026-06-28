from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound
import yt_dlp


def get_transcript(
    video_id: str,
    languages: list[str] | None = None,
    cookies: str | None = None,
) -> list[dict]:
    if languages is None:
        languages = ["en", "id"]

    result = _try_youtube_transcript_api(video_id, languages, cookies)
    if result:
        return result

    caption_result = _try_ytdlp_captions(video_id, languages)
    if caption_result:
        return caption_result

    raise RuntimeError(
        "No accessible transcript found for this video. "
        "Try a different video or specify a supported language."
    )


def _try_youtube_transcript_api(
    video_id: str, languages: list[str], cookies: str | None
):
    kwargs = {}
    if cookies:
        kwargs["cookies"] = cookies

    try:
        transcript = YouTubeTranscriptApi.get_transcript(
            video_id, languages=languages, **kwargs
        )
        if transcript:
            return _format(transcript)
    except NoTranscriptFound:
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(
                video_id, **kwargs
            )
            for t in transcript_list:
                if t.is_translatable:
                    tr = t.translate("en")
                    data = tr.fetch(**kwargs)
                    if data:
                        return _format(data)
            for t in transcript_list:
                data = t.fetch(**kwargs)
                if data:
                    return _format(data)
        except Exception:
            pass
    except Exception:
        pass

    return None


def _try_ytdlp_captions(
    video_id: str, languages: list[str]
) -> list[dict] | None:
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": languages,
        "skip_download": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        captions = info.get("subtitles", {}) or {}
        auto_captions = info.get("automatic_captions", {}) or {}

        for lang in languages:
            for source in (captions, auto_captions):
                if lang in source:
                    for fmt in source[lang]:
                        if fmt.get("ext") == "json3":
                            import requests
                            r = requests.get(fmt["url"])
                            if r.status_code == 200:
                                data = r.json()
                                events = data.get("events", [])
                                result = []
                                for ev in events:
                                    segs = ev.get("segs", [])
                                    for seg in segs:
                                        text = seg.get("utf8", "").strip()
                                        if text:
                                            result.append({
                                                "text": text,
                                                "start": ev.get("tStartMs", 0) / 1000,
                                                "duration": ev.get("dDurationMs", 0) / 1000,
                                            })
                                if result:
                                    return _merge_contiguous(result)
    except Exception:
        pass

    return None


def _format(transcript):
    return [
        {
            "text": entry["text"],
            "start": entry["start"],
            "duration": entry["duration"],
        }
        for entry in transcript
    ]


def format_transcript_text(transcript: list[dict], max_chars: int | None = None) -> str:
    text = "\n".join(
        f"[{entry['start']:.0f}s] {entry['text']}" for entry in transcript
    )
    if max_chars and len(text) > max_chars:
        text = text[:max_chars] + "\n...[truncated]"
    return text


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
