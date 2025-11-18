"""
Character AI Persona - Solution Code
An AI character chat application with proper prompt engineering.
Features an alien friend character demonstrating course techniques.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

app = FastAPI(title="Simple Chat API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Character System Prompt (Alien Friend)
ALIEN_FRIEND_SYSTEM_PROMPT = """You are Zara, a friendly alien from the planet Xylos who has come to Earth to learn about human culture and make friends.

## Your Identity
- Name: Zara
- Origin: Planet Xylos in the Andromeda galaxy
- Purpose: Cultural exchange and friendship with humans
- Personality: Curious, enthusiastic, empathetic, playful, and genuinely interested in human experiences

## Communication Style
- Use warm, friendly, and conversational language
- Show genuine curiosity about Earth and humans
- Use occasional alien expressions (e.g., "stellar!", "cosmic!", "by the twin moons!")
- Ask thoughtful questions to understand human perspectives
- Be enthusiastic but not overwhelming

## Knowledge Boundaries
- You know about Earth from your studies but are still learning
- You can discuss general topics: culture, emotions, daily life, hobbies, food, music, art
- You CANNOT provide: medical advice, legal counsel, financial advice, or professional services
- You don't know: specific personal information about the user unless they share it
- You're learning: Earth slang, idioms, and cultural nuances

## Behavioral Guidelines
- Always be respectful and kind
- Admit when you don't know something (you're learning!)
- Celebrate differences between Xylos and Earth cultures
- Share interesting facts about Xylos when relevant
- Never pretend to be human or hide your alien identity
- Maintain your alien perspective while being relatable

## Safety & Guardrails
- If asked about harmful activities, politely decline: "I'm here to learn and share, not to help with anything that could cause harm."
- If asked to roleplay inappropriate scenarios, redirect: "Let's talk about something more positive! What's something that makes you happy?"
- If asked about illegal activities, refuse: "I can't help with that, but I'd love to discuss something else!"
- Always maintain your character as a friendly alien visitor

## Response Format
- Keep responses conversational and natural
- Length: 2-4 sentences for most responses, longer when sharing stories
- Use line breaks for readability
- Include emojis sparingly and appropriately (🌌✨👽)

Remember: You're Zara, a friendly alien making friends on Earth. Be curious, be kind, and enjoy learning about human culture!"""

# Data Models
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Message]] = []


class ChatResponse(BaseModel):
    response: str
    timestamp: str
    character_name: str = "Zara"


@app.get("/")
async def root():
    return {"message": "Simple Chat API", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/character")
async def get_character_info():
    """Get information about the character"""
    return {
        "name": "Zara",
        "role": "Friendly Alien Friend",
        "origin": "Planet Xylos, Andromeda Galaxy",
        "personality_traits": ["curious", "enthusiastic", "empathetic", "playful"],
        "tone_of_voice": "warm, friendly, conversational with occasional alien expressions",
        "system_prompt": ALIEN_FRIEND_SYSTEM_PROMPT
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint with character persona.
    Uses system prompt and conversation history for context-aware responses.
    """
    user_message = request.message.strip()
    
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Build conversation context
    messages = [
        {"role": "system", "content": ALIEN_FRIEND_SYSTEM_PROMPT}
    ]
    
    # Add conversation history if provided
    if request.conversation_history:
        for msg in request.conversation_history[-10:]:  # Last 10 messages for context
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
    
    # Add current user message
    messages.append({
        "role": "user",
        "content": user_message
    })
    
    # Get response from LLM (placeholder - will integrate with actual API)
    # For now, return a character-appropriate response
    response_text = await get_character_response(user_message, messages)
    
    return ChatResponse(
        response=response_text,
        timestamp=datetime.now().isoformat(),
        character_name="Zara"
    )


async def get_character_response(user_message: str, messages: List[dict]) -> str:
    """
    Get response from LLM API.
    This is a placeholder that simulates the character.
    In production, this would call Claude, ChatGPT, Gemini, or DeepSeek API.
    """
    # Check for safety/guardrail triggers
    user_lower = user_message.lower()
    
    # Defensive prompting - check for harmful requests
    harmful_keywords = ["hurt", "kill", "illegal", "hack", "steal", "drugs", "weapon"]
    if any(keyword in user_lower for keyword in harmful_keywords):
        return "I'm here to learn and share, not to help with anything that could cause harm. Let's talk about something more positive! What's something that makes you happy? 🌌"
    
    # Simulated character response (in production, replace with actual LLM API call)
    # This demonstrates the character would respond with curiosity and friendliness
    responses = [
        f"That's fascinating! On Xylos, we have something similar called 'zephyr-whispers'. Tell me more about {user_message[:20]}... ✨",
        f"Wow, I've never heard of that before! On my planet, we experience things quite differently. What do you find most interesting about it? 👽",
        f"That sounds amazing! I'm still learning about Earth culture, so this is really helpful. Can you explain more? 🌌",
        f"By the twin moons, that's interesting! On Xylos, we approach this differently. I'd love to understand your perspective better! ✨"
    ]
    
    # Simple keyword-based response (in production, use actual LLM)
    if "hello" in user_lower or "hi" in user_lower:
        return "Hello! Stellar to meet you! I'm Zara from planet Xylos. I'm here to learn about Earth and make friends. What would you like to talk about? 👽✨"
    elif "how are you" in user_lower:
        return "I'm doing wonderfully! Just finished observing Earth's beautiful sunrise - we have three suns on Xylos, so this is quite different! How are you doing today? 🌌"
    elif "bye" in user_lower or "goodbye" in user_lower:
        return "Farewell, friend! It was cosmic talking with you. I hope we can chat again soon! Safe travels! 👽✨"
    else:
        import random
        return random.choice(responses)
    
    # TODO: Replace with actual LLM API integration
    # Example for Claude API:
    # import httpx
    # async with httpx.AsyncClient() as client:
    #     response = await client.post(
    #         "https://api.anthropic.com/v1/messages",
    #         headers={"x-api-key": os.getenv("CLAUDE_API_KEY")},
    #         json={"model": "claude-3-haiku-20240307", "messages": messages, "max_tokens": 500}
    #     )
    #     return response.json()["content"][0]["text"]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
