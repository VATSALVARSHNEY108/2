import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\cpp-fundamentals"

replacements = {
    # Text colors
    r'color:\s*["\']#f0f0f5["\']': 'color: "var(--text-primary)"',
    r'color:\s*["\']#9090a8["\']': 'color: "var(--text-secondary)"',
    r'color:\s*["\']#71717a["\']': 'color: "var(--text-muted)"',
    
    # Backgrounds
    r'background:\s*["\']rgba\(22,22,31,0.6\)["\']': 'background: "var(--bg-secondary)"',
    r'background:\s*["\']rgba\(22,22,31,0.8\)["\']': 'background: "var(--bg-elevated)"',
    
    # Borders
    r'border:\s*["\']1px solid rgba\(255,255,255,0.05\)["\']': 'border: "1px solid var(--border-subtle)"',
    r'border:\s*["\']1px solid rgba\(255,255,255,0.1\)["\']': 'border: "1px solid var(--border-color)"',
    r'border:\s*["\']1px solid rgba\(255,255,255,0.2\)["\']': 'border: "1px solid var(--border-color)"',
    
    # Specific Accents (careful with these)
    # If the accent is hardcoded #06b6d4, replace with var(--accent-secondary)
    r'color:\s*["\']#06b6d4["\']': 'color: "var(--accent-secondary)"',
}

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements.items():
            new_content = re.sub(pattern, replacement, new_content)
        
        # Special case for code blocks: replace hardcoded orange #fb923c with something safer if needed
        # Actually #fb923c is usually fine on both white and black, but let's see.
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Theme-ified {filename}")
        else:
            print(f"No changes for {filename}")
