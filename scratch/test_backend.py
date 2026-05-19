import requests
import os
from dotenv import load_dotenv

print(f"CWD: {os.getcwd()}")
env_path = os.path.join(os.getcwd(), ".env")
print(f"Loading .env from: {env_path}")
load_dotenv(dotenv_path=env_path, override=True)
key = os.getenv("OPENROUTER_API_KEY", "")
print(f"Key loaded: {key[:10]}...{key[-4:]} (Length: {len(key)})")

try:
    response = requests.post("http://127.0.0.1:8000/chat", json={"message": "Hello"})
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
