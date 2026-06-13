document.addEventListener("DOMContentLoaded", () => {
    setupTheme();

    const inputField = document.getElementById("user-input");
    if (inputField) {
        inputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });
    }
});

let currentTheme = "dark";

function setupTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById("theme-icon");
    const toggleBtn = document.getElementById("theme-toggle");

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    currentTheme = prefersDark ? "dark" : "light";
    html.setAttribute("data-theme", currentTheme);
    updateThemeIcon();

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            currentTheme = currentTheme === "dark" ? "light" : "dark";
            html.setAttribute("data-theme", currentTheme);
            updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        if (themeIcon) {
            themeIcon.textContent = currentTheme === "dark" ? "🌙" : "☀️";
        }
    }
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userMessage = inputField.value.trim();

    if (userMessage === "") return;

    appendMessage(userMessage, "user");
    inputField.value = "";

    const typingId = showTypingIndicator();

    try {
        const response = await fetch("/get_response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        setTimeout(() => {
            removeTypingIndicator(typingId);
            appendMessage(data.response, "bot");
        }, 1200);
    } catch (error) {
        setTimeout(() => {
            removeTypingIndicator(typingId);
            appendMessage("Something went wrong. Please try again.", "bot");
        }, 1200);
    }
}

function appendMessage(message, sender) {
    const chatBox = document.getElementById("chat-box");
    const row = document.createElement("div");
    row.classList.add("chat-row");

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (sender === "user") {
        row.classList.add("user-row");
        avatar.classList.add("user-avatar");
        avatar.textContent = "🧑";
        messageDiv.classList.add("user-message");
    } else {
        row.classList.add("bot-row");
        avatar.classList.add("bot-avatar");
        avatar.textContent = "🤖";
        messageDiv.classList.add("bot-message");
    }

    messageDiv.textContent = message;

    row.appendChild(avatar);
    row.appendChild(messageDiv);
    chatBox.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    const typingRow = document.createElement("div");
    const uniqueId = "typing-" + Date.now();

    typingRow.classList.add("chat-row", "bot-row");
    typingRow.setAttribute("id", uniqueId);

    typingRow.innerHTML = `
        <div class="avatar bot-avatar">🤖</div>
        <div class="message bot-message typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;

    chatBox.appendChild(typingRow);
    chatBox.scrollTop = chatBox.scrollHeight;
    return uniqueId;
}

function removeTypingIndicator(id) {
    const typingElement = document.getElementById(id);
    if (typingElement) {
        typingElement.remove();
    }
}

function fillSuggestion(text) {
    const input = document.getElementById("user-input");
    if (input) {
        input.value = text;
        input.focus();
    }
}