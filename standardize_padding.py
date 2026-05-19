import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\cpp-fundamentals"

# The user manually set 54px in variables-types.tsx, so I'll standardize to that
target_padding = "54px"

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Update the padding value in the main container div
        # Look for both 24px (which I added) and cases where it might be missing
        
        # Case 1: Already has padding (24px or anything else)
        pattern1 = r'padding:\s*["\']\d+px["\']'
        new_content = re.sub(pattern1, f'padding: "{target_padding}"', content)
        
        # Case 2: Doesn't have padding yet (unlikely since I just added it to all, but for safety)
        if "padding:" not in new_content:
            pattern2 = r'color:\s*"#f0f0f5"'
            replacement2 = r'color: "#f0f0f5", padding: "' + target_padding + '"'
            new_content = re.sub(pattern2, replacement2, new_content)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename} to {target_padding} padding")
        else:
            print(f"No changes needed for {filename}")
