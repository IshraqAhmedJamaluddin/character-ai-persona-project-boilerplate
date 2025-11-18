"""
Simple Chat Application - Starter Code
A basic chat interface with no prompt engineering.
"""

import os
from datetime import datetime
from typing import List

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Simple Chat API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data Models
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: str = None


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    timestamp: str


@app.get("/")
async def root():
    return {"message": "Simple Chat API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Simple chat endpoint - uses Gemini 2.5 Flash with no prompt engineering.
    Just a basic chat interface.
    """
    user_message = request.message.strip()

    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY not configured. Please set it in your .env file. Get a free key from https://aistudio.google.com/app/apikey",
        )

    try:
        # Use Gemini 2.5 Flash - no system prompt, no character, just basic chat
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(user_message)
        response_text = response.text
    except Exception as e:
        # If model not found, try listing available models for debugging
        error_msg = str(e)
        if "not found" in error_msg.lower() or "404" in error_msg:
            try:
                available_models = [m.name for m in genai.list_models()]
                error_msg += f"\n\nAvailable models: {', '.join(available_models[:10])}"
            except:
                pass
        raise HTTPException(
            status_code=500, detail=f"Error calling Gemini API: {error_msg}"
        )

    return ChatResponse(response=response_text, timestamp=datetime.now().isoformat())


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
