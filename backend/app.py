from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import chatbot_response

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "University of Abuja Chatbot API is running."})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"response": "Invalid request. Please send a message."}), 400

    user_message = data["message"].strip()

    if not user_message:
        return jsonify({"response": "Please enter a valid message."}), 400

    reply, intent, confidence = chatbot_response(user_message)
    return jsonify({"response": reply, "intent": intent, "confidence": confidence})

if __name__ == "__main__":
    app.run(debug=True)