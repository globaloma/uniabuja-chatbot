import json
import pickle
import random

# Load intents
with open("intents.json", "r", encoding="utf-8") as file:
    intents_data = json.load(file)

# Load trained model and vectorizer
with open("model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)


def get_response(tag):
    for intent in intents_data["intents"]:
        if intent["tag"] == tag:
            return random.choice(intent["responses"])
    return "Sorry, I do not understand your question."


def chatbot_response(text):
    X = vectorizer.transform([text])
    predicted_tag = model.predict(X)[0]
    return get_response(predicted_tag)