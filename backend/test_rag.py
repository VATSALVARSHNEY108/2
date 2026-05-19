from rag_utils import RAGEngine
import os

# Set CWD to project root for the test
os.chdir("c:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)")

engine = RAGEngine()
query = "How does DFS work?"
context = engine.get_context_string(query)
print(f"Query: {query}")
print(f"Context found: {len(context) > 0}")
print(context[:500] + "...")
