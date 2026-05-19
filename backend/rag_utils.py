import json
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class RAGEngine:
    def __init__(self, kb_path=None):
        if kb_path is None:
            # Path relative to this file: backend/data/knowledge_base.json
            base_dir = os.path.dirname(os.path.abspath(__file__))
            self.kb_path = os.path.join(base_dir, "data", "knowledge_base.json")
        else:
            self.kb_path = kb_path
        self.documents = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = None
        self.load_kb()

    def load_kb(self):
        if not os.path.exists(self.kb_path):
            print(f"Knowledge base not found at {self.kb_path}")
            return

        with open(self.kb_path, "r", encoding="utf-8") as f:
            self.documents = json.load(f)

        if self.documents:
            texts = [doc["content"] for doc in self.documents]
            self.tfidf_matrix = self.vectorizer.fit_transform(texts)
            print(f"RAG Engine initialized with {len(self.documents)} documents.")

    def retrieve(self, query, top_k=3):
        if not self.documents or self.tfidf_matrix is None:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get top K indices
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.05: # Threshold to avoid irrelevant content
                results.append({
                    "content": self.documents[idx]["content"],
                    "source": self.documents[idx]["source"],
                    "topic": self.documents[idx]["topic"],
                    "score": float(similarities[idx])
                })
        
        return results

    def get_context_string(self, query, max_chars=2000):
        results = self.retrieve(query)
        if not results:
            return ""
        
        context_parts = ["Relevant platform information:"]
        current_len = len(context_parts[0])
        
        for res in results:
            part = f"\n\nSource: {res['source']} (Topic: {res['topic']})\n{res['content']}"
            if current_len + len(part) < max_chars:
                context_parts.append(part)
                current_len += len(part)
            else:
                break
        
        return "\n".join(context_parts)
