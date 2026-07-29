const API_URL = "http://localhost:8080/api/chat";

const intro = document.getElementById("intro");
const starterGrid = document.getElementById("starterGrid");
const messagesEl = document.getElementById("messages");
const chatArea = document.getElementById("chatArea");
const greetingEl = document.getElementById("greeting");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const newChatBtn = document.getElementById("newChatBtn");

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
}

greetingEl.textContent = getGreeting();

function renderMarkdown(raw) {
    let html = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/^#{1,3}\s?(.*)$/gm, '<strong class="md-heading">$1</strong>');
    html = html.replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
    html = html.replace(/(^|\n)[*-]\s+(.+)/g, "$1&bull; $2");
    html = html.replace(/\n/g, "<br>");
    return html;
}

function hideIntro() {
    intro.classList.add("hidden");
}

function addMessage(text, type) {
    hideIntro();
    const row = document.createElement("div");
    row.className = "message-row " + type;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = renderMarkdown(text);

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function showTypingBubble() {
    hideIntro();
    const row = document.createElement("div");
    row.className = "message-row bot";
    row.id = "typingRow";

    const bubble = document.createElement("div");
    bubble.className = "bubble typing-bubble";
    bubble.innerHTML = "<span></span><span></span><span></span>";

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function removeTypingBubble() {
    const row = document.getElementById("typingRow");
    if (row) row.remove();
}

async function sendMessage(userMsg) {
    addMessage(userMsg, "user");
    showTypingBubble();
    sendButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMsg })
        });

        if (!response.ok) {
            throw new Error("Request failed with status " + response.status);
        }

        const data = await response.json();
        removeTypingBubble();
        addMessage(data.reply, "bot");

    } catch (error) {
        removeTypingBubble();
        addMessage("Could not reach the assistant. Please check that the server is running and try again.", "error");
    } finally {
        sendButton.disabled = false;
    }
}

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userMsg = messageInput.value.trim();
    if (!userMsg) return;
    messageInput.value = "";
    messageInput.style.height = "auto";
    sendMessage(userMsg);
});

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
    }
});

messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height = Math.min(messageInput.scrollHeight, 140) + "px";
});

starterGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".starter-card");
    if (!card) return;
    sendMessage(card.dataset.prompt);
});

newChatBtn.addEventListener("click", () => {
    messagesEl.innerHTML = "";
    intro.classList.remove("hidden");
    messageInput.value = "";
    messageInput.style.height = "auto";
    messageInput.focus();
});