// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Chat state
let conversationHistories = {}; // Store separate histories per character
let currentCharacterId = 'alien_friend'; // Default character
let characterInfo = null;
let allCharacters = [];

// DOM elements
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const sendBtn = document.getElementById('send-btn');
const characterDetailsContent = document.getElementById('character-details-content');
const characterSelector = document.getElementById('character-selector');
const chatHeader = document.getElementById('chat-header');

// Load all available characters
async function loadAllCharacters() {
    try {
        const response = await fetch(`${API_BASE_URL}/characters`);
        const data = await response.json();
        allCharacters = data.characters;
        
        // Render character selector
        renderCharacterSelector();
        
        // Load default character
        await switchCharacter(currentCharacterId);
    } catch (error) {
        console.error('Error loading characters:', error);
        characterSelector.innerHTML = '<p class="text-danger">Error loading characters.</p>';
    }
}

// Render character selector
function renderCharacterSelector() {
    characterSelector.innerHTML = allCharacters.map(char => `
        <div class="character-card card ${char.id === currentCharacterId ? 'active' : ''}" 
             data-character-id="${char.id}"
             onclick="switchCharacter('${char.id}')">
            <div class="character-icon">${char.avatar}</div>
            <div class="character-title">${char.name}</div>
            <small class="text-muted">${char.role}</small>
        </div>
    `).join('');
}

// Switch to a different character
async function switchCharacter(characterId) {
    if (!allCharacters.find(c => c.id === characterId)) {
        console.error('Character not found:', characterId);
        return;
    }
    
    // Update current character
    currentCharacterId = characterId;
    
    // Update UI
    renderCharacterSelector();
    
    // Load character info
    await loadCharacterInfo(characterId);
    
    // Clear chat and restore or show welcome message
    chatMessages.innerHTML = '';
    restoreConversation(characterId);
    
    // Update input placeholder
    const character = allCharacters.find(c => c.id === characterId);
    messageInput.placeholder = `Type your message to ${character.name}...`;
}

// Restore conversation history for a character or show welcome message
function restoreConversation(characterId) {
    const history = conversationHistories[characterId] || [];
    
    if (history.length === 0) {
        // No previous conversation, show welcome message
        showWelcomeMessage();
    } else {
        // Restore previous messages
        history.forEach(msg => {
            if (msg.role === 'user') {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message mb-3';
                messageDiv.innerHTML = `
                    <div class="d-flex justify-content-end">
                        <div class="message-bubble user-message">
                            ${escapeHtml(msg.content)}
                        </div>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
            } else if (msg.role === 'assistant') {
                const character = allCharacters.find(c => c.id === characterId);
                const characterName = character ? character.name : 'Assistant';
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message mb-3';
                messageDiv.innerHTML = `
                    <div class="d-flex justify-content-start">
                        <div class="message-bubble assistant-message">
                            <strong>${characterName}:</strong> ${escapeHtml(msg.content)}
                        </div>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
            }
        });
        scrollToBottom();
    }
}

// Load character information
async function loadCharacterInfo(characterId = currentCharacterId) {
    try {
        const response = await fetch(`${API_BASE_URL}/character?character=${characterId}`);
        characterInfo = await response.json();
        
        // Update character display
        document.getElementById('character-name').textContent = characterInfo.name;
        document.getElementById('character-role').textContent = `${characterInfo.role} from ${characterInfo.origin}`;
        document.getElementById('character-avatar').textContent = characterInfo.avatar;
        chatHeader.textContent = `Chat with ${characterInfo.name} ${characterInfo.avatar}`;
        
        // Update character details
        characterDetailsContent.innerHTML = `
            <div class="mb-3">
                <h6>Personality Traits</h6>
                <p>${characterInfo.personality_traits.join(', ')}</p>
            </div>
            <div class="mb-3">
                <h6>Tone of Voice</h6>
                <p>${characterInfo.tone_of_voice}</p>
            </div>
            <div class="mb-3">
                <h6>System Prompt</h6>
                <pre class="bg-light p-3 rounded"><code>${characterInfo.system_prompt}</code></pre>
            </div>
        `;
    } catch (error) {
        console.error('Error loading character info:', error);
        characterDetailsContent.innerHTML = '<p class="text-danger">Error loading character information.</p>';
    }
}

// Show welcome message for current character
function showWelcomeMessage() {
    const character = allCharacters.find(c => c.id === currentCharacterId);
    if (!character) return;
    
    const welcomeMessages = {
        'alien_friend': "I'm Zara, a friendly alien from planet Xylos! I'm here to learn about Earth and make friends. What would you like to talk about? 🌌",
        'ai_girlfriend': "Hi! I'm Luna, your AI companion. I'm here to provide support, companionship, and meaningful conversation. How are you doing today? 💕",
        'ai_boyfriend': "Hey! I'm Alex, your AI companion. I'm here to provide support, companionship, and meaningful conversation. How are you doing today? 💙",
        'pirate_captain': "Ahoy there! I'm Captain Blackbeard, and I be ready for adventure! What tales do ye have to share, matey? 🏴‍☠️",
        'assistant': "Hello! I'm your AI assistant, ready to help you with tasks, answer questions, and provide information. How can I assist you today? 🤖",
        'fitness_coach': "Hey! I'm your fitness coach, and I'm here to help you achieve your health and fitness goals. What would you like to work on today? 💪",
        'language_teacher': "Hello! I'm your language teacher, and I'm here to help you learn and practice languages. What language would you like to work on? 📚"
    };
    
    const message = welcomeMessages[currentCharacterId] || welcomeMessages['alien_friend'];
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'alert alert-info';
    welcomeDiv.id = 'welcome-message';
    welcomeDiv.innerHTML = `<strong>Welcome!</strong> ${message}`;
    chatMessages.appendChild(welcomeDiv);
}

// Add user message to chat
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message mb-3';
    messageDiv.innerHTML = `
        <div class="d-flex justify-content-end">
            <div class="message-bubble user-message">
                ${escapeHtml(message)}
            </div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to conversation history for current character
    if (!conversationHistories[currentCharacterId]) {
        conversationHistories[currentCharacterId] = [];
    }
    conversationHistories[currentCharacterId].push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });
}

// Add assistant message to chat
function addAssistantMessage(message, characterName = 'Zara') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message mb-3';
    messageDiv.innerHTML = `
        <div class="d-flex justify-content-start">
            <div class="message-bubble assistant-message">
                <strong>${characterName}:</strong> ${escapeHtml(message)}
            </div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to conversation history for current character
    if (!conversationHistories[currentCharacterId]) {
        conversationHistories[currentCharacterId] = [];
    }
    conversationHistories[currentCharacterId].push({
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString()
    });
}

// Add error message
function addErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-danger mb-3';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Set loading state
function setLoading(loading) {
    messageInput.disabled = loading;
    sendBtn.disabled = loading;
    const spinner = sendBtn.querySelector('.spinner-border');
    const sendText = sendBtn.querySelector('.send-text');
    
    if (loading) {
        spinner.classList.remove('d-none');
        sendText.textContent = 'Sending...';
    } else {
        spinner.classList.add('d-none');
        sendText.textContent = 'Send';
    }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    messageInput.value = '';
    
    // Set loading state
    setLoading(true);
    
    try {
        // Get conversation history for current character
        const currentHistory = conversationHistories[currentCharacterId] || [];
        
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                conversation_history: currentHistory.slice(0, -1), // Exclude the message we just added
                character: currentCharacterId
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            addAssistantMessage(data.response, data.character_name);
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Failed to get response' }));
            addErrorMessage(`Error: ${errorData.detail || 'Failed to get response from server'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        addErrorMessage('Error: Unable to connect to server. Make sure the backend is running on http://localhost:8000');
    } finally {
        // Re-enable input
        setLoading(false);
        messageInput.focus();
    }
});

// Make switchCharacter available globally for onclick handlers
window.switchCharacter = switchCharacter;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAllCharacters();
    messageInput.focus();
});
