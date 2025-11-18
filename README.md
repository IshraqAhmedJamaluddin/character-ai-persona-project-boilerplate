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

### Get Your Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" to generate a free API key
4. Copy your API key (you'll need it in the next step)

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

4. Set up your API key:

```bash
# Copy the example environment file
cp ../.env.example .env

# Edit .env and add your Gemini API key
# On Windows, you can use notepad or any text editor
# On Mac/Linux, use: nano .env
```

Then edit `.env` and replace `your_api_key_here` with your actual API key from Google AI Studio.

5. Run the FastAPI server:

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
- **Gemini 2.5 Flash Integration**: Uses Google's Gemini 2.5 Flash model for responses
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
- Add proper prompt engineering techniques (system prompts, role prompting, guardrails)
- Use Gemini 2.5 Flash with your character's system prompt
- Test your character thoroughly (15+ scenarios: success, boundary, adversarial)
- Document your work for your portfolio

## API Key Security

⚠️ **Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template. Always keep your API key private.
