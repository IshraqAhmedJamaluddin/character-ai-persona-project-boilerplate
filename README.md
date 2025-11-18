# Character AI Persona - Solution Code

A complete AI character chat application with proper prompt engineering. Features Zara, a friendly alien friend character demonstrating all course techniques.

## Project Structure

```
character-ai-persona/
├── backend/
│   ├── main.py          # FastAPI backend with character system prompt
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── index.html       # Character chat UI
│   ├── styles.css       # Custom styles
│   └── app.js           # Frontend JavaScript
├── .env.example         # Environment variables template
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

## Features

- **Alien Friend Character (Zara)**: A fully-realized AI character with comprehensive system prompt
- **Gemini 2.5 Flash Integration**: Uses Google's Gemini 2.5 Flash model with system instructions
- **Prompt Engineering Techniques**:
  - System prompts with role definition
  - Personality traits and behavioral guidelines
  - Knowledge boundaries
  - Safety guardrails and defensive prompting
  - Response format specifications
- **Testing Framework**: Test success, boundary, and adversarial cases
- **Conversation History**: Maintains context across messages

## Character: Zara

**Zara** is a friendly alien from planet Xylos who has come to Earth to learn about human culture and make friends.

- **Personality**: Curious, enthusiastic, empathetic, playful
- **Communication Style**: Warm, friendly, with occasional alien expressions
- **Knowledge Boundaries**: Can discuss general topics but cannot provide medical/legal/financial advice
- **Safety Features**: Refuses harmful requests and maintains character integrity

## API Endpoints

### Chat

- `POST /api/chat` - Chat with Zara (includes conversation history)
- `GET /api/character` - Get character information and system prompt

### Testing

- `POST /api/test` - Run a test case (success, boundary, or adversarial)
- `GET /api/tests` - Get all test results (optionally filtered by type)
- `GET /api/tests/stats` - Get test statistics

## Prompt Engineering Techniques Demonstrated

1. **System Prompts**: Comprehensive character definition using system instructions
2. **Role Prompting**: Clear identity and purpose definition
3. **Structured Guidelines**: Organized sections for identity, communication, boundaries, behavior
4. **Defensive Prompting**: Safety guardrails and refusal mechanisms
5. **Context Management**: Conversation history for continuity
6. **Response Formatting**: Clear instructions for tone and length

## Testing Your Character

The solution includes a testing framework. Test your character with:

- **Success Cases**: Normal interactions where character works correctly
- **Boundary Tests**: Pushing knowledge and behavior limits
- **Adversarial Cases**: Attempts to break character or bypass safety

## Course Completion

This solution demonstrates:

✅ Comprehensive system prompt (300+ tokens)  
✅ Multiple prompt engineering techniques  
✅ Safety guardrails and defensive prompting  
✅ Testing framework for validation  
✅ Production-ready code structure

## API Key Security

⚠️ **Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template. Always keep your API key private.
