
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_implicit_returns(filepath):
    # Only target files that use the implicit return pattern in maps
    # This is common in the 'arrays' folder and some others
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern: .map((...) => ( ... ); })}
    # We want to remove the semicolon at the end of the implicit return.
    # We look for ); followed by } at the next line or same line.
    
    # Fix 1: Specific to the array simulation pattern
    new_content = re.sub(r'\)\s*;\s*\}\s*\)\s*\}\s*</div>', r')})}</div>', content)
    
    # Fix 2: More general implicit return map semicolon
    # Match: ); followed by closing paren and brace of the map
    # But ONLY if it's an implicit return (no { before the return)
    # This is tricky with regex. Let's use a simpler one for the specific corruption.
    
    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    # We focus on arrays, linked-list, etc. that might have this error.
    # Graphs are now clean.
    if "graphs" in root: continue 
    
    for file in files:
        if file.endswith(".tsx"):
            fix_implicit_returns(os.path.join(root, file))
