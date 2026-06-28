from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, brand, summarize

app = FastAPI(
    title="YouTube AI Companion API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api")
app.include_router(brand.router, prefix="/api")
app.include_router(summarize.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
