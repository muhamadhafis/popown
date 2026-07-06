import os
import sys
import re

# Ensure the backend directory is in the Python search path for Vercel serverless deployment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, brand, summarize

app = FastAPI(
    title="YouTube AI Companion API",
    version="1.0.0",
)

# Set up CORS origins matching:
# 1. The frontend deployment URL (https://popown.vercel.app)
# 2. Localhost for development (e.g., http://localhost:5173, http://127.0.0.1:5173, etc.)
# 3. Chrome extensions (chrome-extension://<id>)
cors_regex = r"^(https://popown\.vercel\.app|http://localhost(:\d+)?|http://127\.0\.0\.1(:\d+)?|chrome-extension://[a-zA-Z0-9]+)$"


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=cors_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(brand.router, prefix="/api")
app.include_router(summarize.router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Popown YouTube AI Companion API",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    import os
    import traceback
    from utils.transcript import get_transcript
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cookies_file = os.path.join(current_dir, "yt-cookies.txt")
    exists = os.path.exists(cookies_file)
    size = os.path.getsize(cookies_file) if exists else -1
    
    test_result = "not run"
    error_trace = ""
    
    try:
        res = get_transcript("xlWhpXdOlTo", languages=["en", "id"])
        test_result = f"success: {len(res)} entries fetched"
    except Exception as e:
        test_result = f"error: {str(e)}"
        error_trace = traceback.format_exc()
        
    return {
        "status": "ok",
        "cookies": {
            "resolved_path": cookies_file,
            "exists": exists,
            "size": size,
            "cwd": os.getcwd()
        },
        "diagnostic_fetch": {
            "result": test_result,
            "traceback": error_trace
        }
    }




# Trigger reload for new env config


