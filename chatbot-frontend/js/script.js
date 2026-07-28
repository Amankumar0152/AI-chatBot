const API_URL = "http://localhost:8080/api/chat";

const toggleBtn = document.getElementById("chatToggleBtn");
const panel = document.getElementById("chatPanel");
const closeBtn = document.getElementById("closeBtn");
const minimizeBtn = document.getElementById("minimizeBtn");
const chatBox = document.getElementById("chatBox");
const messagesEl = document.getElementById("messages");
const greetingBlock = document.getElementById("greetingBlock");
const greetingEl = document.getElementById("greeting");
const suggestionCards = document.getElementById("suggestionCards");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

let isOpen = false;

/* ---------- Open / close ---------- */

function openChat() {
    isOpen = true;
    panel.classList.add("open");
    toggleBtn.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    setTimeout(() => messageInput.focus(), 200);
}

function closeChat() {
    isOpen = false;
    panel.classList.remove("open");
    toggleBtn.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
}

toggleBtn.addEventListener("click", () => (isOpen ? closeChat() : openChat()));
closeBtn.addEventListener("click", closeChat);
minimizeBtn.addEventListener("click", closeChat);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeChat();
});

/* ---------- Greeting ---------- */

function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
}

greetingEl.textContent = getGreeting();

/* ---------- Minimal markdown renderer ---------- */

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

/* ---------- Messages ---------- */

function formatTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function hideGreeting() {
    if (greetingBlock.style.display !== "none") {
        greetingBlock.style.display = "none";
    }
}

function addMessage(text, type) {
    hideGreeting();
    const row = document.createElement("div");
    row.className = "message-row " + type;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = renderMarkdown(text);

    const time = document.createElement("div");
    time.className = "timestamp";
    time.textContent = formatTime();

    row.appendChild(bubble);
    row.appendChild(time);
    messagesEl.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
    return row;
}

function showTypingBubble() {
    hideGreeting();
    const row = document.createElement("div");
    row.className = "message-row bot";
    row.id = "typingRow";

    const bubble = document.createElement("div");
    bubble.className = "bubble typing-bubble";
    bubble.innerHTML = "<span></span><span></span><span></span>";

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingBubble() {
    const row = document.getElementById("typingRow");
    if (row) row.remove();
}

/* ---------- Sending ---------- */

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
    messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + "px";
});

/* ---------- Suggestion cards ---------- */

suggestionCards.addEventListener("click", (e) => {
    const card = e.target.closest(".suggestion-card");
    if (!card) return;

    if (card.dataset.type === "link") {
        window.open(card.dataset.url, "_blank", "noopener");
    } else if (card.dataset.type === "ask") {
        sendMessage(card.dataset.question);
    }
});

/* ---------- Ripple effect on send button ---------- */

sendButton.addEventListener("click", function (e) {
    const rect = sendButton.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
    sendButton.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
});