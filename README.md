# Simple Chat Application - Starter Code

A basic chat interface with no prompt engineering. This is the starter code for the Prompt Engineering Foundations course.

## Project Structure

```
character-ai-persona/
├── backend/
│   ├── main.py          # FastAPI backend with simple chat endpoint
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── index.html       # Simple chat UI
│   ├── styles.css       # Custom styles
│   └── app.js           # Frontend JavaScript
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Open `frontend/index.html` in a web browser, or use a local server:

```bash
cd frontend
python -m http.server 8080  # Python 3
# or
npx http-server -p 8080     # Node.js
```

2. Open `http://localhost:8080` in your browser

### API Documentation

Once the backend is running, you can access:

- Interactive API docs: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Current Features

- **Simple Chat Interface**: Basic chat UI with message input and display
- **Echo Response**: Backend simply echoes back user messages with a basic response
- **No Prompt Engineering**: This is intentionally simple - no character, no system prompts, no advanced features

## API Endpoints

- `POST /api/chat` - Send a message and get a simple response
- `GET /api/health` - Health check endpoint

## Course Goal

By the end of the course, you will:

1. Build your own AI character with proper prompt engineering
2. Apply techniques learned (system prompts, role prompting, guardrails, etc.)
3. Test your character with 15+ scenarios
4. Create a portfolio-ready project

## Next Steps

This starter code is intentionally minimal. Your task is to:

- Design and implement an AI character persona
- Add proper prompt engineering techniques
- Integrate with LLM APIs (Claude, ChatGPT, Gemini, DeepSeek)
- Test your character thoroughly
- Document your work for your portfolio
