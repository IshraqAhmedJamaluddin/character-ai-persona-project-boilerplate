# Character AI Persona

A web application for creating, managing, and testing AI character personas with consistent traits, tone, and goals across multiple scenarios.

## Project Structure

```
character-ai-persona/
├── backend/
│   ├── main.py          # FastAPI backend application
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── index.html       # Main HTML file
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

## Features

- **Character Management**: Create, read, update, and delete AI character personas
- **Conversation Tracking**: Manage conversations and test scenarios
- **Testing Dashboard**: Organize tests into success cases, boundary tests, and adversarial cases
- **System Prompt Management**: Store and manage system prompts for each character

## API Endpoints

### Characters
- `GET /api/characters` - Get all characters
- `GET /api/characters/{id}` - Get a specific character
- `POST /api/characters` - Create a new character
- `PUT /api/characters/{id}` - Update a character
- `DELETE /api/characters/{id}` - Delete a character

### Conversations
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations?character_id={id}` - Get conversations for a character
- `GET /api/conversations/{id}` - Get a specific conversation
- `POST /api/conversations` - Create a new conversation
- `POST /api/conversations/{id}/messages` - Add a message to a conversation

## Next Steps

- Integrate with LLM APIs (Claude, ChatGPT, Gemini, DeepSeek)
- Add database persistence (SQLite, PostgreSQL, etc.)
- Implement conversation testing interface
- Add export functionality for documentation
- Implement system prompt versioning

