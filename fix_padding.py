import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\cpp-fundamentals"

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # This regex looks for the main div and removes any existing padding attributes, then adds the correct one.
        # It targets the div immediately following the return (
        
        # Pattern to match the main div's style object
        pattern = r'(<div style=\{\{\s*fontFamily:\s*["\']\'DM Sans\', sans-serif["\'],\s*color:\s*["\']#f0f0f5["\'])([^}]*)(\}\}>)'
        
        def replace_padding(match):
            prefix = match.group(1)
            rest = match.group(2)
            suffix = match.group(3)
            
            # Remove any existing padding declarations within the style object
            rest_clean = re.sub(r',\s*padding:\s*["\'][^"\']*["\']', '', rest)
            
            return f'{prefix}, padding: "54px"{rest_clean}{suffix}'
        
        new_content = re.sub(pattern, replace_padding, content)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filename}")
        else:
            # Fallback for slightly different patterns
            if "padding: \"54px\"" not in content:
                 print(f"Skipped {filename} - No match found")
            else:
                 print(f"Verified {filename} (Already correct)")
