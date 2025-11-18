// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// View Management
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(view => {
        view.style.display = 'none';
    });

    // Show selected view
    document.getElementById(`${viewName}-view`).style.display = 'block';

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load data for the view
    if (viewName === 'characters') {
        loadCharacters();
    } else if (viewName === 'conversations') {
        loadConversations();
    }
}

// Character Management
async function loadCharacters() {
    try {
        const response = await fetch(`${API_BASE_URL}/characters`);
        const characters = await response.json();
        
        const charactersList = document.getElementById('characters-list');
        charactersList.innerHTML = '';

        if (characters.length === 0) {
            charactersList.innerHTML = '<div class="col-12"><p class="text-muted">No characters yet. Create your first character!</p></div>';
            return;
        }

        characters.forEach(character => {
            const card = createCharacterCard(character);
            charactersList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading characters:', error);
        showAlert('Error loading characters', 'danger');
    }
}

function createCharacterCard(character) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    
    const traits = Array.isArray(character.personality_traits) 
        ? character.personality_traits.join(', ') 
        : character.personality_traits;

    col.innerHTML = `
        <div class="card character-card" onclick="viewCharacter('${character.id}')">
            <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${character.role}</h6>
                <p class="card-text"><strong>Traits:</strong> ${traits}</p>
                <p class="card-text"><strong>Tone:</strong> ${character.tone_of_voice}</p>
                <p class="card-text"><small class="text-muted">Use Case: ${character.intended_use_case}</small></p>
                <div class="btn-group-actions">
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); editCharacter('${character.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteCharacter('${character.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

function showCharacterForm(characterId = null) {
    const modal = new bootstrap.Modal(document.getElementById('characterModal'));
    const form = document.getElementById('characterForm');
    form.reset();

    if (characterId) {
        document.getElementById('characterModalTitle').textContent = 'Edit Character';
        loadCharacterForEdit(characterId);
    } else {
        document.getElementById('characterModalTitle').textContent = 'Create Character';
        document.getElementById('characterId').value = '';
    }

    modal.show();
}

async function loadCharacterForEdit(characterId) {
    try {
        const response = await fetch(`${API_BASE_URL}/characters/${characterId}`);
        const character = await response.json();

        document.getElementById('characterId').value = character.id;
        document.getElementById('characterName').value = character.name;
        document.getElementById('characterRole').value = character.role;
        document.getElementById('personalityTraits').value = Array.isArray(character.personality_traits)
            ? character.personality_traits.join(', ')
            : character.personality_traits;
        document.getElementById('toneOfVoice').value = character.tone_of_voice;
        document.getElementById('knowledgeBoundaries').value = Array.isArray(character.knowledge_boundaries)
            ? character.knowledge_boundaries.join(', ')
            : character.knowledge_boundaries;
        document.getElementById('intendedUseCase').value = character.intended_use_case;
        document.getElementById('backgroundStory').value = character.background_story || '';
        document.getElementById('systemPrompt').value = character.system_prompt || '';
    } catch (error) {
        console.error('Error loading character:', error);
        showAlert('Error loading character', 'danger');
    }
}

async function saveCharacter() {
    const form = document.getElementById('characterForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const characterId = document.getElementById('characterId').value;
    const characterData = {
        name: document.getElementById('characterName').value,
        role: document.getElementById('characterRole').value,
        personality_traits: document.getElementById('personalityTraits').value.split(',').map(t => t.trim()),
        tone_of_voice: document.getElementById('toneOfVoice').value,
        knowledge_boundaries: document.getElementById('knowledgeBoundaries').value.split(',').map(k => k.trim()),
        intended_use_case: document.getElementById('intendedUseCase').value,
        background_story: document.getElementById('backgroundStory').value || null,
        system_prompt: document.getElementById('systemPrompt').value || null
    };

    try {
        let response;
        if (characterId) {
            response = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(characterData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/characters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(characterData)
            });
        }

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('characterModal'));
            modal.hide();
            loadCharacters();
            showAlert('Character saved successfully!', 'success');
        } else {
            throw new Error('Failed to save character');
        }
    } catch (error) {
        console.error('Error saving character:', error);
        showAlert('Error saving character', 'danger');
    }
}

async function deleteCharacter(characterId) {
    if (!confirm('Are you sure you want to delete this character?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadCharacters();
            showAlert('Character deleted successfully!', 'success');
        } else {
            throw new Error('Failed to delete character');
        }
    } catch (error) {
        console.error('Error deleting character:', error);
        showAlert('Error deleting character', 'danger');
    }
}

function viewCharacter(characterId) {
    // Navigate to character detail view or open in modal
    console.log('View character:', characterId);
    // TODO: Implement character detail view
}

function editCharacter(characterId) {
    showCharacterForm(characterId);
}

// Conversation Management
async function loadConversations() {
    try {
        const response = await fetch(`${API_BASE_URL}/conversations`);
        const conversations = await response.json();

        const conversationsList = document.getElementById('conversations-list');
        conversationsList.innerHTML = '';

        if (conversations.length === 0) {
            conversationsList.innerHTML = '<p class="text-muted">No conversations yet.</p>';
            return;
        }

        conversations.forEach(conversation => {
            const item = createConversationItem(conversation);
            conversationsList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading conversations:', error);
        showAlert('Error loading conversations', 'danger');
    }
}

function createConversationItem(conversation) {
    const div = document.createElement('div');
    div.className = 'conversation-item';
    
    const badgeClass = {
        'success': 'bg-success',
        'boundary': 'bg-warning',
        'adversarial': 'bg-danger'
    }[conversation.test_type] || 'bg-secondary';

    div.innerHTML = `
        <h5>${conversation.title}</h5>
        <span class="badge ${badgeClass}">${conversation.test_type || 'general'}</span>
        <p class="mt-2">Messages: ${conversation.messages.length}</p>
        <small class="text-muted">Created: ${new Date(conversation.created_at).toLocaleString()}</small>
    `;

    return div;
}

// Testing
function startTest(testType) {
    console.log('Starting test:', testType);
    // TODO: Implement test interface
    showAlert(`Starting ${testType} test...`, 'info');
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCharacters();
});

