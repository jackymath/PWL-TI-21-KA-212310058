const API_BASE_URL = 'http://localhost:3000';

const botSetupForm = document.getElementById('bot-setup-form');
const botTokenInput = document.getElementById('bot-token');
const chatIdInput = document.getElementById('chat-id');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');

botSetupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const botToken = botTokenInput.value.trim();
  const chatId = chatIdInput.value.trim();
  const res = await fetch(`${API_BASE_URL}/api/setup-bot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ botToken, chatId })
  });
  const data = await res.json();
  alert(data.message);
});

messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  const res = await fetch(`${API_BASE_URL}/api/messages`);
  const messages = await res.json();
  renderMessages(messages);
});

function renderMessages(messages) {
  messagesContainer.innerHTML = '';
  messages.forEach(msg => {
    const el = document.createElement('div');
    el.textContent = `${msg.text} (${msg.sentiment})`;
    messagesContainer.appendChild(el);
  });
}