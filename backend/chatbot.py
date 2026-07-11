import json
import pickle
import random

CONFIDENCE_THRESHOLD = 0.3

with open("intents.json", "r", encoding="utf-8") as file:
    intents_data = json.load(file)

with open("model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)


def get_responses(tag):
    for intent in intents_data["intents"]:
        if intent["tag"] == tag:
            return intent["responses"]
    return ["Sorry, I do not understand your question."]


def predict_intent(message):
    vec = vectorizer.transform([message])
    proba = model.predict_proba(vec)[0]
    confidence = max(proba)
    predicted_tag = model.classes_[proba.argmax()]

    if predicted_tag != "fallback" and confidence < CONFIDENCE_THRESHOLD:
        return "fallback", confidence

    return predicted_tag, confidence


def chatbot_response(text):
    intent_tag, confidence = predict_intent(text)
    response = random.choice(get_responses(intent_tag))
    return response, intent_tag, round(float(confidence), 2)
