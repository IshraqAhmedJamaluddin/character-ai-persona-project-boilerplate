"""
Character AI Persona - FastAPI Backend
A web application for creating, managing, and testing AI character personas.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import uuid

app = FastAPI(title="Character AI Persona API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data Models
class CharacterProfile(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    personality_traits: List[str]
    tone_of_voice: str
    knowledge_boundaries: List[str]
    intended_use_case: str
    background_story: Optional[str] = None
    system_prompt: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ConversationMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None


class Conversation(BaseModel):
    id: Optional[str] = None
    character_id: str
    title: str
    messages: List[ConversationMessage]
    test_type: Optional[str] = None  # "success", "boundary", "adversarial"
    created_at: Optional[str] = None


class TestResult(BaseModel):
    character_id: str
    conversation_id: str
    test_type: str
    passed: bool
    notes: Optional[str] = None


# In-memory storage (replace with database in production)
characters_db: Dict[str, CharacterProfile] = {}
conversations_db: Dict[str, Conversation] = {}


@app.get("/")
async def root():
    return {"message": "Character AI Persona API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


# Character Management Endpoints
@app.get("/api/characters", response_model=List[CharacterProfile])
async def get_characters():
    """Get all characters"""
    return list(characters_db.values())


@app.get("/api/characters/{character_id}", response_model=CharacterProfile)
async def get_character(character_id: str):
    """Get a specific character by ID"""
    if character_id not in characters_db:
        raise HTTPException(status_code=404, detail="Character not found")
    return characters_db[character_id]


@app.post("/api/characters", response_model=CharacterProfile)
async def create_character(character: CharacterProfile):
    """Create a new character"""
    character_id = str(uuid.uuid4())
    character.id = character_id
    character.created_at = datetime.now().isoformat()
    character.updated_at = datetime.now().isoformat()
    characters_db[character_id] = character
    return character


@app.put("/api/characters/{character_id}", response_model=CharacterProfile)
async def update_character(character_id: str, character: CharacterProfile):
    """Update an existing character"""
    if character_id not in characters_db:
        raise HTTPException(status_code=404, detail="Character not found")
    character.id = character_id
    character.updated_at = datetime.now().isoformat()
    characters_db[character_id] = character
    return character


@app.delete("/api/characters/{character_id}")
async def delete_character(character_id: str):
    """Delete a character"""
    if character_id not in characters_db:
        raise HTTPException(status_code=404, detail="Character not found")
    del characters_db[character_id]
    return {"message": "Character deleted successfully"}


# Conversation Management Endpoints
@app.get("/api/conversations", response_model=List[Conversation])
async def get_conversations(character_id: Optional[str] = None):
    """Get all conversations, optionally filtered by character_id"""
    if character_id:
        return [
            conv for conv in conversations_db.values()
            if conv.character_id == character_id
        ]
    return list(conversations_db.values())


@app.get("/api/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get a specific conversation by ID"""
    if conversation_id not in conversations_db:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversations_db[conversation_id]


@app.post("/api/conversations", response_model=Conversation)
async def create_conversation(conversation: Conversation):
    """Create a new conversation"""
    conversation_id = str(uuid.uuid4())
    conversation.id = conversation_id
    conversation.created_at = datetime.now().isoformat()
    for message in conversation.messages:
        if not message.timestamp:
            message.timestamp = datetime.now().isoformat()
    conversations_db[conversation_id] = conversation
    return conversation


@app.post("/api/conversations/{conversation_id}/messages")
async def add_message(conversation_id: str, message: ConversationMessage):
    """Add a message to an existing conversation"""
    if conversation_id not in conversations_db:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversation = conversations_db[conversation_id]
    if not message.timestamp:
        message.timestamp = datetime.now().isoformat()
    conversation.messages.append(message)
    return {"message": "Message added successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

