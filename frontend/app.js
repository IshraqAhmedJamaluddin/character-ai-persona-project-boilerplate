// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Chat functionality
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

// Add user message to chat
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mb-2';
    messageDiv.innerHTML = `
        <div class="d-flex justify-content-end">
            <div class="bg-primary text-white p-2 rounded" style="max-width: 70%;">
                ${escapeHtml(message)}
            </div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Add assistant message to chat
function addAssistantMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mb-2';
    messageDiv.innerHTML = `
        <div class="d-flex justify-content-start">
            <div class="bg-light p-2 rounded" style="max-width: 70%;">
                ${escapeHtml(message)}
            </div>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Add error message
function addErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-danger mb-2';
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

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    messageInput.value = '';
    
    // Disable input while processing
    messageInput.disabled = true;
    chatForm.querySelector('button').disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        if (response.ok) {
            const data = await response.json();
            addAssistantMessage(data.response);
        } else {
            addErrorMessage('Error: Failed to get response from server');
        }
    } catch (error) {
        console.error('Error:', error);
        addErrorMessage('Error: Unable to connect to server. Make sure the backend is running.');
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        chatForm.querySelector('button').disabled = false;
        messageInput.focus();
    }
});

// Focus input on load
messageInput.focus();
