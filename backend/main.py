from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import sys
import os
import google.generativeai as genai
from dotenv import load_dotenv
import uvicorn

from rag_utils import RAGEngine

# Initialize RAG Engine
rag_engine = RAGEngine()

# Load .env from project root
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path, override=True)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Configure Google Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
async def root():
    return {"message": "Backend running successfully"}


@app.post("/chat")
async def chat(request: ChatRequest):

    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY not found in .env file. Please add your Google AI Studio key."
        )

    try:
        # Retrieve relevant context
        context = rag_engine.get_context_string(request.message)
        
        # Initialize the model
        model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            system_instruction=(
                "You are CoreCode Assistant, a helpful engineering tutor "
                "and coding expert for the CoreCode learning platform. "
                "Keep responses concise and focused on CS and engineering. "
                "Use the following platform content if relevant to answer the user's question. "
                "If the information is not in the context, use your general knowledge but stay "
                "consistent with the platform's focus.\n\n"
                f"{context}"
            )
        )

        # Generate response
        response = await model.generate_content_async(request.message)

        if not response.text:
            raise Exception("Empty response from Gemini")

        return {
            "reply": response.text
        }

    except Exception as e:
        print("Gemini API Error:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API Error: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )