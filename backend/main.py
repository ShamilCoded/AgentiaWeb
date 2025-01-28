from fastapi import FastAPI
from transformers import pipeline
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Initialize pipelines
faq_agent = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
sentiment_agent = pipeline("sentiment-analysis")

# Mock database
DATABASE = {
    "order_123": "Order shipped and will arrive on 1st Feb 2025.",
    "order_456": "Order is being processed and will be shipped soon."
}

# Request model
class Query(BaseModel):
    message: str
    context: List[str] = []

@app.post("/api/faq")
async def faq(query: Query):
    response = faq_agent(question=query.message, context=" ".join(query.context))
    return {"answer": response["answer"]}

@app.post("/api/sentiment")
async def sentiment(query: Query):
    sentiment_response = sentiment_agent(query.message)
    return {"sentiment": sentiment_response[0]}

@app.post("/api/database")
async def database(query: Query):
    order_id = query.message.split()[-1]
    response = DATABASE.get(order_id, "Order not found. Please check the ID.")
    return {"response": response}
