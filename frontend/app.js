// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Chat state
let conversationHistory = [];
let characterInfo = null;

// DOM elements
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const sendBtn = document.getElementById('send-btn');
const characterDetailsContent = document.getElementById('character-details-content');

// Load character information on page load
async function loadCharacterInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/character`);
        characterInfo = await response.json();
        
        // Update character display
        document.getElementById('character-name').textContent = characterInfo.name;
        document.getElementById('character-role').textContent = `${characterInfo.role} from ${characterInfo.origin}`;
        
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
    
    // Add to conversation history
    conversationHistory.push({
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
    
    // Add to conversation history
    conversationHistory.push({
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
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                conversation_history: conversationHistory.slice(0, -1) // Exclude the message we just added
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCharacterInfo();
    messageInput.focus();
});
