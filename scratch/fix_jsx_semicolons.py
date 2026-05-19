
import os
import re

dir_path = r'c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa'

def fix_jsx_semicolons(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern: ); followed by whitespace and })}
    # This usually happens in {items.map(item => ( ... ); })}
    # We want to remove the semicolon.
    new_content = re.sub(r'\);\s*\}\s*\)\s*\}', r')})', content)
    # Also handle the variant with extra closing tags if they are messsed up
    new_content = re.sub(r'\);\s*\}\s*\}\s*<\/div>', r')}\n              </div>', new_content)
    
    if content != new_content:
        print(f"Fixed {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith(".tsx"):
            fix_jsx_semicolons(os.path.join(root, file))
