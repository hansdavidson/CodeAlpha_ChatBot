from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

predefined_responses = {
    "hello": "Hello! Welcome to the chatbot. How can I help you today?",
    "hi": "Hi there! Nice to see you. Ask me anything from my predefined questions.",
    "how are you": "I am doing great. Thank you for asking!",
    "what is your name": "I am ColorBot, your stylish predefined chatbot.",
    "who created you": "I was created by Hans Davidson using VS Code.",
    "what can you do": "I can answer predefined questions with a colorful and modern chat experience.",
    "what is flask": "Flask is a lightweight Python web framework used for building websites and web applications.",
    "what is vscode": "VS Code is a powerful source-code editor used for Python, web development, and many other technologies.",
    "bye": "Goodbye! Have a wonderful day.",
    "thanks": "You are welcome! Glad I could help.",
    "thank you": "You are welcome! Feel free to ask another question.",
    "help": "Try asking: hello, what is flask, what is vscode, what can you do, who created you, or bye."
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")

@app.route("/get_response", methods=["POST"])
def get_response():
    user_message = request.json.get("message", "").strip().lower()
    response = predefined_responses.get(
        user_message,
        "Sorry, I only answer predefined questions right now. Try: hello, help, what is flask, what is vscode, who created you, or bye."
    )
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)