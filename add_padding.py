import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\cpp-fundamentals"

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for the main container div and add padding
        # Pattern: <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#f0f0f5" }}>
        pattern = r'<div style=\{\{\s*fontFamily:\s*["\']\'DM Sans\', sans-serif["\'],\s*color:\s*["\']#f0f0f5["\']\s*\}\}>'
        replacement = r'<div style={{ fontFamily: "\'DM Sans\', sans-serif", color: "#f0f0f5", padding: "24px" }}>'
        
        new_content = re.sub(pattern, replacement, content)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            # Try a slightly different pattern if the first one fails (e.g. different spacing)
            pattern2 = r'fontFamily:\s*"\'DM Sans\', sans-serif",\s*color:\s*"#f0f0f5"'
            replacement2 = r'fontFamily: "\'DM Sans\', sans-serif", color: "#f0f0f5", padding: "24px"'
            new_content2 = re.sub(pattern2, replacement2, content)
            if new_content2 != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content2)
                print(f"Updated {filename} (Pattern 2)")
