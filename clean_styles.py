import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\cpp-fundamentals"

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Clean up any potential escaped quotes and ensure padding is correct
        # Replacement pattern to ensure clean style
        pattern = r'style=\{\{\s*fontFamily:\s*\\?["\']\\?\'DM Sans\\\', sans-serif\\?["\'],\s*color:\s*["\']#f0f0f5["\'],\s*padding:\s*["\']24px["\']\s*\}\}'
        replacement = r'style={{ fontFamily: "\'DM Sans\', sans-serif", color: "#f0f0f5", padding: "24px" }}'
        
        # Simpler approach: replace the problematic escaped quote string
        new_content = content.replace("fontFamily: \"'DM Sans', sans-serif\"", "fontFamily: \"'DM Sans', sans-serif\"")
        new_content = new_content.replace("fontFamily: '\\'DM Sans\\', sans-serif'", "fontFamily: \"'DM Sans', sans-serif\"")
        new_content = new_content.replace("fontFamily: \"\\'DM Sans\\', sans-serif\"", "fontFamily: \"'DM Sans', sans-serif\"")
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned {filename}")
        else:
            print(f"Skipped {filename} (Already clean or no match)")
