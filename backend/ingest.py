import os
import re
import json
from pathlib import Path

def extract_text_from_tsx(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Simple regex to extract text from common tags
    # This is a heuristic but works for the current project structure
    text_parts = []
    
    # Extract h1
    h1_matches = re.findall(r"<h1>(.*?)</h1>", content)
    text_parts.extend([f"Title: {m}" for m in h1_matches])
    
    # Extract paragraphs with class description
    desc_matches = re.findall(r'className="description">(.*?)</p>', content)
    text_parts.extend(desc_matches)
    
    # Extract guide cards
    guide_matches = re.findall(r'<h2>(.*?)</h2><p>(.*?)</p>', content)
    for title, text in guide_matches:
        text_parts.append(f"{title}: {text}")
    
    # Extract other paragraphs
    p_matches = re.findall(r"<p>(.*?)</p>", content)
    # Filter out empty or very short strings
    p_matches = [m for m in p_matches if len(m.strip()) > 20]
    text_parts.extend(p_matches)

    return "\n".join(text_parts)

def ingest():
    knowledge_base = []
    content_dir = Path("content/dsa")
    
    # Walk through content/dsa
    for root, _, files in os.walk(content_dir):
        for file in files:
            if file.endswith(".tsx"):
                file_path = Path(root) / file
                text = extract_text_from_tsx(file_path)
                if text.strip():
                    knowledge_base.append({
                        "source": str(file_path),
                        "content": text,
                        "topic": file_path.parent.name
                    })
    
    # Also add DOCUMENTATION.md
    doc_path = Path("DOCUMENTATION.md")
    if doc_path.exists():
        with open(doc_path, "r", encoding="utf-8") as f:
            doc_content = f.read()
        
        # Split doc into sections by ##
        sections = re.split(r"\n## ", doc_content)
        for section in sections:
            if section.strip():
                knowledge_base.append({
                    "source": "DOCUMENTATION.md",
                    "content": section.strip(),
                    "topic": "Documentation"
                })

    # Ensure backend/data directory exists
    os.makedirs("backend/data", exist_ok=True)
    
    with open("backend/data/knowledge_base.json", "w", encoding="utf-8") as f:
        json.dump(knowledge_base, f, indent=2)
    
    print(f"Ingested {len(knowledge_base)} documents.")

if __name__ == "__main__":
    ingest()
