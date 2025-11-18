"""
Simple Chat Application - Starter Code
A basic chat interface with no prompt engineering.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime

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
    Simple chat endpoint - just echoes back with a basic response.
    No prompt engineering, no character, just a generic response.
    """
    user_message = request.message
    
    # Simple response - no prompt engineering
    response_text = f"You said: {user_message}. This is a basic response with no prompt engineering."
    
    return ChatResponse(
        response=response_text,
        timestamp=datetime.now().isoformat()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
