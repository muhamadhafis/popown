import os
import sys

backend_dir = r"c:\Users\Rakha\OneDrive\Documents\Popown\popown\backend"
sys.path.append(backend_dir)

from utils.transcript import get_transcript

video_id = "xlWhpXdOlTo"
languages = ["en", "id"]

print("Testing full get_transcript function locally...")
try:
    result = get_transcript(video_id, languages=languages)
    if result:
        print("SUCCESS! Transcript fetched:", len(result), "entries")
        print("First entry:", result[0])
    else:
        print("FAILED: get_transcript returned None or empty")
except Exception as e:
    import traceback
    traceback.print_exc()
