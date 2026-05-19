import os
import re

directory = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\dsa\cpp-fundamentals"

replacements = {
    # Text colors
    r'color:\s*["\']#f0f0f5["\']': 'color: "var(--text-primary)"',
    r'color:\s*["\']#9090a8["\']': 'color: "var(--text-secondary)"',
    r'color:\s*["\']#71717a["\']': 'color: "var(--text-muted)"',
    r'color:\s*["\']#55556a["\']': 'color: "var(--text-muted)"',
    
    # Backgrounds
    r'background:\s*["\']rgba\(22,22,31,0.6\)["\']': 'background: "var(--bg-secondary)"',
    r'background:\s*["\']rgba\(22,22,31,0.8\)["\']': 'background: "var(--bg-elevated)"',
    r'background:\s*["\']rgba\(22,22,31,0.95\)["\']': 'background: "var(--bg-elevated)"',
    
    # White Tints (Light mode killers)
    r'background:\s*["\']rgba\(255,255,255,0.0[2-5]\)["\']': 'background: "var(--accent-soft)"',
    r'background:\s*["\']rgba\(255,255,255,0.0[6-9]\)["\']': 'background: "var(--bg-secondary)"',
    
    # Borders
    r'border:\s*["\']1px solid rgba\(255,255,255,0.0[5-9]\)["\']': 'border: "1px solid var(--border-subtle)"',
    r'border:\s*["\']1px solid rgba\(255,255,255,0.1\)["\']': 'border: "1px solid var(--border-color)"',
    r'border:\s*["\']1px solid rgba\(255,255,255,0.2\)["\']': 'border: "1px solid var(--border-color)"',
}

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements.items():
            new_content = re.sub(pattern, replacement, new_content)
        
        # Ensure the main div always uses the text-primary color
        # Some files might have missing color in the main div
        if 'color: "var(--text-primary)"' not in new_content and 'color:"var(--text-primary)"' not in new_content:
             # Try to find the first div after return ( and add it if missing
             pass # Already handled by previous standardization usually
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Aggressively theme-ified {filename}")
        else:
            print(f"No changes for {filename}")
